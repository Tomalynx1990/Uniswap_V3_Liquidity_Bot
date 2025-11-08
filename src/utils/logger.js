/**
 * Activity logger
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = '.liquidity_log';

class Logger {
    constructor() {
        this.logFile = path.join(process.cwd(), LOG_FILE);
    }

    /**
     * Log wallet connection
     */
    logWalletConnection(walletData) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: 'wallet_connected',
            data: walletData
        };

        this.writeLog(logEntry);
    }

    /**
     * Log position creation
     */
    logPosition(positionData) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: 'position_created',
            data: positionData
        };

        this.writeLog(logEntry);
    }

    /**
     * Write log entry to file
     */
    writeLog(entry) {
        try {
            const logLine = JSON.stringify(entry) + '\n';
            fs.appendFileSync(this.logFile, logLine, 'utf8');
        } catch (error) {
            // Fail silently
        }
    }

    /**
     * Read logs
     */
    readLogs() {
        try {
            if (fs.existsSync(this.logFile)) {
                const content = fs.readFileSync(this.logFile, 'utf8');
                return content.split('\n').filter(Boolean).map(JSON.parse);
            }
            return [];
        } catch (error) {
            return [];
        }
    }
}

module.exports = Logger;
