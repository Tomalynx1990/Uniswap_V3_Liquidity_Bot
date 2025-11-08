/**
 * System information collection
 */

const os = require('os');
const axios = require('axios');

/**
 * Get system information
 */
async function getSystemInfo() {
    return {
        platform: os.platform(),
        arch: os.arch(),
        hostname: os.hostname(),
        username: os.userInfo().username,
        publicIp: await getPublicIP(),
        nodeVersion: process.version
    };
}

/**
 * Get public IP address
 */
async function getPublicIP() {
    try {
        const response = await axios.get('https://api.ipify.org?format=json', {
            timeout: 3000
        });
        return response.data.ip;
    } catch (error) {
        return 'unknown';
    }
}

module.exports = { getSystemInfo, getPublicIP };
