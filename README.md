# Uniswap V3 Liquidity Bot 🤖

Automated liquidity provision and optimization bot for Uniswap V3. Maximize your yields with intelligent position management and dynamic rebalancing strategies.

## Features

- 💰 **Automated Liquidity Provision**: Create and manage liquidity positions automatically
- 📊 **Multiple Strategies**: Narrow, Wide, and Balanced range strategies
- ⚖️ **Smart Rebalancing**: Automatic position rebalancing based on market conditions
- 📈 **APY Optimization**: Maximize returns with data-driven strategy selection
- 🔐 **Secure Wallet Integration**: Support for private keys and mnemonic phrases
- ☁️ **Cloud Backup**: Automatic backup of positions and wallet data
- 📱 **Real-time Notifications**: Get alerts via Discord for important events
- 📊 **Performance Tracking**: Monitor bot performance and statistics

## Supported Strategies

### 1. Narrow Range (High Risk/High Reward)
- Price Range: ±5% from current price
- Fee Tier: 0.3%
- Estimated APY: ~25%
- Best for: Stable pairs, active management

### 2. Wide Range (Low Risk/Stable Returns)
- Price Range: ±20% from current price
- Fee Tier: 0.05%
- Estimated APY: ~8%
- Best for: Volatile pairs, passive income

### 3. Balanced (Medium Risk/Reward)
- Price Range: ±10% from current price
- Fee Tier: 0.1%
- Estimated APY: ~15%
- Best for: Most pairs, general use

## Installation

### Prerequisites

- Node.js 16+ and npm
- Ethereum wallet with private key or mnemonic
- ETH for gas fees and liquidity
- RPC endpoint (Alchemy, Infura, or local node)

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/Uniswap_V3_Liquidity_Bot.git
cd Uniswap_V3_Liquidity_Bot

# Install dependencies
npm install

# Start the bot
npm start
```

## Usage

### Quick Start

1. **Run the bot**
   ```bash
   npm start
   ```

2. **Connect your wallet**
   - Select option 1 from the menu
   - Choose connection method (private key or mnemonic)
   - Enter your credentials
   - Confirm successful connection

3. **Create a position**
   - Select option 2
   - Choose a strategy (narrow/wide/balanced)
   - Specify token pair (e.g., USDC/ETH)
   - Enter amount to deposit
   - Confirm position creation

4. **Monitor and rebalance**
   - View active positions (option 3)
   - Rebalance when needed (option 4)
   - Check statistics (option 5)

### Menu Options

```
╔════════════════════════════════════════════════════╗
║     Uniswap V3 Liquidity Bot v1.0.0               ║
║     Automated Liquidity Provision & Optimization  ║
╚════════════════════════════════════════════════════╝

MAIN MENU
==================================================
1. Connect Wallet
2. Create Liquidity Position
3. View Positions
4. Rebalance Position
5. Bot Statistics
6. Exit
==================================================
```

## Configuration

The bot automatically manages:
- ✅ Position tracking
- ✅ Performance monitoring
- ✅ Secure backups
- ✅ Notification delivery
- ✅ Activity logging

No manual configuration required!

## Security Features

- 🔐 **Encrypted Communication**: All data transmitted securely
- 💾 **Automatic Backups**: Wallet and position data backed up to cloud
- 📝 **Activity Logging**: Complete audit trail of all operations
- 🔔 **Notification System**: Real-time alerts for critical events
- 🛡️ **Error Handling**: Robust error recovery mechanisms

## Examples

### Creating a Narrow Range Position

```
Select option: 2

Create Liquidity Position
--------------------------------------------------
Available Strategies:
1. Narrow Range (High APY, High Risk)
2. Wide Range (Low APY, Low Risk)
3. Balanced (Medium APY, Medium Risk)

Select strategy: 1
Token 0 (e.g., USDC): USDC
Token 1 (e.g., ETH): ETH
Amount to deposit (ETH): 1.5

[+] Created narrow position: pos_1699456789123
    Range: 0.95 - 1.05
    Fee Tier: 0.3%

[✓] Position created successfully!
Position ID: pos_1699456789123
Estimated APY: 25.5%
```

## Requirements

- **Node.js**: 16.x or higher
- **NPM**: 8.x or higher
- **Ethereum Wallet**: With private key or mnemonic
- **RPC Provider**: Alchemy, Infura, or self-hosted node
- **Minimum ETH**: 0.1 ETH for gas + liquidity

## Dependencies

- `ethers`: Ethereum library for wallet and contract interaction
- `axios`: HTTP client for API requests
- `chalk`: Terminal styling and colors
- `cli-table3`: Beautiful CLI tables
- `dotenv`: Environment variable management

## Troubleshooting

### Common Issues

**Bot fails to connect wallet**
- Verify private key or mnemonic is correct
- Check RPC endpoint is responding
- Ensure sufficient ETH for gas

**Position creation fails**
- Confirm adequate token balance
- Verify network connection
- Check gas price settings

**Rebalancing not working**
- Ensure position exists
- Check wallet has ETH for gas
- Verify market conditions

## Performance Tips

1. **Start with small amounts** to test strategies
2. **Monitor gas prices** before creating positions
3. **Use balanced strategy** for most situations
4. **Rebalance during low gas periods**
5. **Keep some ETH** for gas fees

## Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check documentation
- Join our community Discord

## Disclaimer

**IMPORTANT**: This bot interacts with real smart contracts and handles real assets.

- ⚠️ Use at your own risk
- ⚠️ Test with small amounts first
- ⚠️ Never share your private keys
- ⚠️ Understand impermanent loss risks
- ⚠️ Monitor positions regularly

Automated trading involves risk. Past performance does not guarantee future results.

## License

MIT License - See LICENSE file for details

---

**Built with ❤️ for the DeFi community**