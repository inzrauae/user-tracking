const crypto = require('crypto');
const UAParser = require('ua-parser-js');

// Generate device fingerprint from user agent and other identifiers
const generateDeviceFingerprint = (userAgent, ipAddress) => {
  const fingerprintStr = `${userAgent}${ipAddress}`;
  return crypto.createHash('sha256').update(fingerprintStr).digest('hex');
};

// Parse user agent to get browser and OS info
const parseUserAgent = (userAgent) => {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return {
    browserName: result.browser.name || 'Unknown',
    osName: result.os.name || 'Unknown',
    deviceType: result.device.type || 'desktop',
    isMobile: result.device.type === 'mobile' || result.ua.includes('Mobile'),
    isTablet: result.device.type === 'tablet',
    deviceName: `${result.os.name} ${result.browser.name}`.trim()
  };
};

// Get client IP address from request
const getClientIp = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.socket.remoteAddress ||
    req.connection.remoteAddress ||
    'UNKNOWN'
  );
};

// Check if device is mobile
const isMobileDevice = (userAgent) => {
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent);
};

module.exports = {
  generateDeviceFingerprint,
  parseUserAgent,
  getClientIp,
  isMobileDevice
};
