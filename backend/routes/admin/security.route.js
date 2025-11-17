/**
 * 🛡️ CLOUDFLARE-STYLE SECURITY DASHBOARD
 * Admin-only route for viewing bot attack logs, blocked IPs, and security statistics
 */

const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const logger = require('../../utils/logger');

// Middleware: Kiểm tra admin (giả định bạn đã có middleware này)
const checkAdmin = require('../../middleware/checkAdmin');
const authenticateToken = require('../../middleware/auth.middleware');

/**
 * GET /api/admin/security/stats
 * Lấy thống kê tổng quan về bot attacks
 */
router.get('/stats', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const stats = logger.getStats();
    
    res.json({
      success: true,
      data: {
        totalBotAttacks: stats.botAttacks,
        blockedIPs: Array.from(stats.blockedIPs),
        blockedCount: stats.blockedIPs.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Failed to get security stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve security statistics'
    });
  }
});

/**
 * GET /api/admin/security/logs
 * Lấy danh sách log files
 */
router.get('/logs', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const logsDir = path.join(__dirname, '../../logs');
    
    // Kiểm tra thư mục logs có tồn tại không
    try {
      await fs.access(logsDir);
    } catch {
      return res.json({
        success: true,
        data: {
          files: [],
          message: 'Logs directory not created yet. Start backend to generate logs.'
        }
      });
    }
    
    const files = await fs.readdir(logsDir);
    const botAttackLogs = files.filter(f => f.startsWith('bot-attacks-'));
    
    const logFiles = await Promise.all(
      botAttackLogs.map(async (filename) => {
        const filepath = path.join(logsDir, filename);
        const stats = await fs.stat(filepath);
        return {
          filename,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      })
    );
    
    res.json({
      success: true,
      data: {
        files: logFiles.sort((a, b) => b.modified - a.modified),
        totalFiles: logFiles.length
      }
    });
  } catch (error) {
    logger.error('Failed to list log files:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list log files'
    });
  }
});

/**
 * GET /api/admin/security/logs/:filename
 * Xem nội dung của một log file cụ thể
 */
router.get('/logs/:filename', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const { filename } = req.params;
    const { limit = 100, offset = 0 } = req.query;
    
    // Security: Chỉ cho phép đọc bot-attacks-*.log
    if (!filename.startsWith('bot-attacks-') || !filename.endsWith('.log')) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this log file'
      });
    }
    
    const filepath = path.join(__dirname, '../../logs', filename);
    const content = await fs.readFile(filepath, 'utf8');
    
    // Parse JSON logs (mỗi dòng là một JSON object)
    const lines = content.trim().split('\n').filter(line => line);
    const logs = lines
      .map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(log => log !== null);
    
    // Phân trang
    const total = logs.length;
    const paginatedLogs = logs.slice(offset, offset + limit);
    
    res.json({
      success: true,
      data: {
        logs: paginatedLogs,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      }
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({
        success: false,
        error: 'Log file not found'
      });
    }
    logger.error('Failed to read log file:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to read log file'
    });
  }
});

/**
 * GET /api/admin/security/recent-attacks
 * Lấy danh sách các cuộc tấn công gần đây (từ log file hôm nay)
 */
router.get('/recent-attacks', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const todayLogFile = `bot-attacks-${today}.log`;
    const filepath = path.join(__dirname, '../../logs', todayLogFile);
    
    try {
      const content = await fs.readFile(filepath, 'utf8');
      const lines = content.trim().split('\n').filter(line => line);
      const logs = lines
        .map(line => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(log => log !== null && log.level === 'warn'); // Chỉ lấy bot attacks
      
      // Lấy 50 attacks gần nhất
      const recentAttacks = logs.slice(-50).reverse();
      
      res.json({
        success: true,
        data: {
          attacks: recentAttacks,
          count: recentAttacks.length
        }
      });
    } catch (error) {
      if (error.code === 'ENOENT') {
        return res.json({
          success: true,
          data: {
            attacks: [],
            count: 0,
            message: 'No attacks detected today'
          }
        });
      }
      throw error;
    }
  } catch (error) {
    logger.error('Failed to get recent attacks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve recent attacks'
    });
  }
});

/**
 * POST /api/admin/security/clear-blacklist
 * Xóa toàn bộ blacklist (unblock tất cả IPs)
 */
router.post('/clear-blacklist', authenticateToken, checkAdmin, async (req, res) => {
  try {
    // Gọi hàm reset stats từ logger
    logger.resetStats();
    
    logger.securityEvent('Admin cleared IP blacklist', {
      admin: req.user.email || req.user.username,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: 'Blacklist cleared successfully'
    });
  } catch (error) {
    logger.error('Failed to clear blacklist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear blacklist'
    });
  }
});

module.exports = router;
