/**
 * Middleware phát hiện bot dựa trên Time Measurement
 * Phát hiện bot bằng cách:
 * 1. Đo thời gian từ lúc vào trang đến lúc click (quá nhanh = bot)
 * 2. Phát hiện pattern nhất quán đáng ngờ (timing quá đều = bot)
 * 
 * 🆕 Tích hợp Winston Logger + Alert System
 */

const logger = require('../utils/logger');
const { alertBotAttack } = require('../utils/alertSystem');

// Lưu trữ thông tin truy cập của mỗi IP
const visitTracking = new Map();
const botBlacklist = new Set();

// Configuration
const CONFIG = {
  MIN_TIME_HUMAN: 1000,        // Người thật ít nhất mất 1 giây
  MAX_REQUESTS_PER_MINUTE: 20, // Tối đa 20 requests/phút
  PATTERN_THRESHOLD: 5,        // Nếu 5 requests có timing giống nhau -> bot
  TIMING_TOLERANCE: 100,       // Sai số cho phép (ms)
  BLACKLIST_DURATION: 300000   // Block 5 phút
};

/**
 * Middleware track thời gian page load
 */
const trackPageVisit = (req, res, next) => {
  // 🎯 Ưu tiên lấy IP từ custom header (để test bot với nhiều IP khác nhau)
  const clientIP = req.headers['x-client-ip'] || 
                   req.headers['x-forwarded-for']?.split(',')[0] || 
                   req.ip || 
                   req.connection.remoteAddress;
  
  const now = Date.now();
  
  if (!visitTracking.has(clientIP)) {
    visitTracking.set(clientIP, {
      pageLoadTime: now,
      actions: [],
      requestTimes: []
    });
  } else {
    const tracking = visitTracking.get(clientIP);
    tracking.pageLoadTime = now;
  }
  
  next();
};

/**
 * Middleware phát hiện bot dựa trên timing
 */
const detectBot = (req, res, next) => {
  // 🎯 Ưu tiên lấy IP từ custom header (để test bot với nhiều IP khác nhau)
  const clientIP = req.headers['x-client-ip'] || 
                   req.headers['x-forwarded-for']?.split(',')[0] || 
                   req.ip || 
                   req.connection.remoteAddress;
  
  const now = Date.now();
  
  // Kiểm tra blacklist
  if (botBlacklist.has(clientIP)) {
    logger.botBlocked(clientIP, 'IP đã bị chặn trước đó', {
      endpoint: req.path,
      method: req.method
    });
    
    return res.status(403).json({
      success: false,
      error: 'Bot detected. Access denied.',
      reason: 'Hành vi đáng ngờ đã được phát hiện'
    });
  }
  
  const tracking = visitTracking.get(clientIP);
  
  if (!tracking) {
    // Không có thông tin tracking -> tạo mới
    visitTracking.set(clientIP, {
      pageLoadTime: now,
      actions: [],
      requestTimes: [now]
    });
    return next();
  }
  
  // 1️⃣ PHÁT HIỆN: Hành động quá nhanh
  const timeSincePageLoad = now - tracking.pageLoadTime;
  if (timeSincePageLoad < CONFIG.MIN_TIME_HUMAN) {
    logger.botDetected(clientIP, 'Hành động quá nhanh', {
      timeSincePageLoad: `${timeSincePageLoad}ms`,
      threshold: `${CONFIG.MIN_TIME_HUMAN}ms`,
      endpoint: req.path,
      method: req.method
    });
    
    blockBot(clientIP, 'Action too fast');
    return res.status(403).json({
      success: false,
      error: 'Bot detected: Action too fast',
      timeSincePageLoad,
      reason: 'Thời gian phản ứng nhanh hơn con người'
    });
  }
  
  // 2️⃣ PHÁT HIỆN: Rate limiting
  tracking.requestTimes.push(now);
  // Xóa requests cũ hơn 1 phút
  tracking.requestTimes = tracking.requestTimes.filter(
    time => now - time < 60000
  );
  
  if (tracking.requestTimes.length > CONFIG.MAX_REQUESTS_PER_MINUTE) {
    logger.botDetected(clientIP, 'Rate limit exceeded', {
      requestCount: tracking.requestTimes.length,
      limit: CONFIG.MAX_REQUESTS_PER_MINUTE,
      endpoint: req.path,
      method: req.method
    });
    
    blockBot(clientIP, 'Too many requests');
    return res.status(429).json({
      success: false,
      error: 'Too many requests',
      requestCount: tracking.requestTimes.length,
      reason: 'Vượt quá giới hạn requests cho phép'
    });
  }
  
  // 3️⃣ PHÁT HIỆN: Pattern nhất quán đáng ngờ
  tracking.actions.push({
    timestamp: now,
    timeSinceLoad: timeSincePageLoad,
    path: req.path
  });
  
  // Giữ lại 10 actions gần nhất
  if (tracking.actions.length > 10) {
    tracking.actions = tracking.actions.slice(-10);
  }
  
  // Phân tích pattern
  if (tracking.actions.length >= CONFIG.PATTERN_THRESHOLD) {
    const timings = tracking.actions.map(a => a.timeSinceLoad);
    const isConsistentPattern = checkConsistentPattern(timings);
    
    if (isConsistentPattern) {
      logger.botDetected(clientIP, 'Suspicious pattern', {
        timings,
        endpoint: req.path,
        method: req.method
      });
      
      blockBot(clientIP, 'Suspicious pattern');
      return res.status(403).json({
        success: false,
        error: 'Bot detected: Suspicious pattern',
        timings,
        reason: 'Hành vi quá đều đặn, không giống người thật'
      });
    }
  }
  
  logger.debug(`✅ Human verified: IP ${clientIP}`, {
    timeSincePageLoad: `${timeSincePageLoad}ms`,
    requestsPerMin: tracking.requestTimes.length
  });
  next();
};

/**
 * Kiểm tra pattern nhất quán
 */
function checkConsistentPattern(timings) {
  if (timings.length < CONFIG.PATTERN_THRESHOLD) return false;
  
  // Tính độ lệch chuẩn
  const mean = timings.reduce((a, b) => a + b, 0) / timings.length;
  const variance = timings.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / timings.length;
  const stdDev = Math.sqrt(variance);
  
  // Nếu độ lệch chuẩn quá nhỏ -> timing quá đều -> bot
  if (stdDev < CONFIG.TIMING_TOLERANCE) {
    return true;
  }
  
  // Kiểm tra khoảng cách giữa các requests
  const intervals = [];
  for (let i = 1; i < timings.length; i++) {
    intervals.push(timings[i] - timings[i - 1]);
  }
  
  // Nếu các khoảng cách quá giống nhau -> bot
  const intervalMean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const intervalVariance = intervals.reduce((sum, val) => sum + Math.pow(val - intervalMean, 2), 0) / intervals.length;
  const intervalStdDev = Math.sqrt(intervalVariance);
  
  return intervalStdDev < CONFIG.TIMING_TOLERANCE;
}

/**
 * Chặn bot
 */
function blockBot(ip, reason) {
  botBlacklist.add(ip);
  logger.incrementBotAttack(ip);
  
  logger.botBlocked(ip, reason, {
    blacklistDuration: `${CONFIG.BLACKLIST_DURATION / 1000}s`,
    totalBlocked: botBlacklist.size
  });
  
  // 🚨 Gửi alert nếu vượt ngưỡng
  const stats = logger.getStats();
  if (stats.blockedIPs.length >= 3) {
    alertBotAttack({
      ip,
      reason,
      attackCount: stats.botAttacks,
      blockedCount: stats.blockedIPs.length
    });
  }
  
  // Tự động unblock sau một thời gian
  setTimeout(() => {
    botBlacklist.delete(ip);
    logger.info(`✅ IP ${ip} unblocked after timeout`);
  }, CONFIG.BLACKLIST_DURATION);
}

/**
 * Clear tracking data định kỳ (tránh memory leak)
 */
setInterval(() => {
  const now = Date.now();
  const CLEANUP_THRESHOLD = 3600000; // 1 giờ
  
  for (const [ip, data] of visitTracking.entries()) {
    if (now - data.pageLoadTime > CLEANUP_THRESHOLD) {
      visitTracking.delete(ip);
    }
  }
  
  logger.info(`🧹 Tracking data cleaned. Active IPs: ${visitTracking.size}`);
}, 600000); // Chạy mỗi 10 phút

/**
 * Lấy thống kê bot attacks (cho admin dashboard)
 */
function getBotStats() {
  return {
    activeTracking: visitTracking.size,
    blockedIPs: Array.from(botBlacklist),
    blockedCount: botBlacklist.size,
    config: CONFIG
  };
}

module.exports = {
  trackPageVisit,
  detectBot,
  getBotStats,
  CONFIG
};
