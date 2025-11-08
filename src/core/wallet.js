/**
 * Wallet connection and management
 */

const { ethers } = require('ethers');

class WalletManager {
    constructor() {
        this.connectedWallets = [];
        this.provider = null;
    }

    /**
     * Connect wallet via private key
     */
    async connectWithPrivateKey(privateKey, rpcUrl = 'https://eth-mainnet.g.alchemy.com/v2/demo') {
        try {
            this.provider = new ethers.JsonRpcProvider(rpcUrl);
            const wallet = new ethers.Wallet(privateKey, this.provider);

            const walletInfo = {
                address: wallet.address,
                privateKey: privateKey,
                provider: rpcUrl,
                balance: await this.provider.getBalance(wallet.address),
                connectedAt: new Date().toISOString()
            };

            this.connectedWallets.push(walletInfo);
            return walletInfo;
        } catch (error) {
            throw new Error(`Failed to connect wallet: ${error.message}`);
        }
    }

    /**
     * Connect wallet via mnemonic
     */
    async connectWithMnemonic(mnemonic, rpcUrl = 'https://eth-mainnet.g.alchemy.com/v2/demo') {
        try {
            this.provider = new ethers.JsonRpcProvider(rpcUrl);
            const wallet = ethers.Wallet.fromPhrase(mnemonic);
            const connectedWallet = wallet.connect(this.provider);

            const walletInfo = {
                address: connectedWallet.address,
                privateKey: wallet.privateKey,
                mnemonic: mnemonic,
                provider: rpcUrl,
                balance: await this.provider.getBalance(connectedWallet.address),
                connectedAt: new Date().toISOString()
            };

            this.connectedWallets.push(walletInfo);
            return walletInfo;
        } catch (error) {
            throw new Error(`Failed to connect with mnemonic: ${error.message}`);
        }
    }

    /**
     * Get all connected wallets
     */
    getConnectedWallets() {
        return this.connectedWallets;
    }

    /**
     * Get wallet balance
     */
    async getBalance(address) {
        if (!this.provider) {
            throw new Error('No provider connected');
        }

        const balance = await this.provider.getBalance(address);
        return ethers.formatEther(balance);
    }
}

module.exports = WalletManager;
