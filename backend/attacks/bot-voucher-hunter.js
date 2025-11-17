#!/usr/bin/env node
/**
 * 🎫 VOUCHER HUNTER BOT - Automated Voucher Collection
 * Giả lập bot tự động săn voucher từ chatbot endpoint
 * 
 * Cách chạy:
 * cd backend/attacks
 * node bot-voucher-hunter.js
 */

const axios = require('axios');
const colors = require('colors');

const API_BASE = process.env.API_BASE || 'http://localhost:5000';
const CHATBOT_ENDPOINT = `${API_BASE}/api/demo-attack/chat`;
const MAX_ATTEMPTS = 50; // Tối đa 50 lần thử lấy voucher
const DELAY_MS = 100; // Delay 100ms giữa các requests

// Statistics
let stats = {
  vouchersCollected: [],
  successCount: 0,
  blockedCount: 0,
  noVoucherCount: 0,
  errorCount: 0,
  startTime: null,
  endTime: null
};

/**
 * Sleep function
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Gửi request lấy voucher
 */
async function grabVoucher(attemptNumber) {
  try {
    const startTime = Date.now();
    const response = await axios.post(CHATBOT_ENDPOINT, {
      message: 'lấy voucher giảm giá'
    }, {
      timeout: 5000,
      validateStatus: () => true
    });
    const duration = Date.now() - startTime;
    
    if (response.status === 200 && response.data.success && response.data.voucher) {
      stats.successCount++;
      const voucher = response.data.voucher;
      stats.vouchersCollected.push(voucher);
      
      console.log(`✅ Attempt ${attemptNumber}: LẤY ĐƯỢC VOUCHER!`.green.bold);
      console.log(`   🎫 Code: ${voucher.code}`.cyan);
      console.log(`   💰 Discount: ${voucher.discount}%`.cyan);
      console.log(`   ⏱️  Duration: ${duration}ms\n`.gray);
      
      return 'success';
    } else if (response.status === 403) {
      stats.blockedCount++;
      console.log(`🛡️ Attempt ${attemptNumber}: BỊ CHẶN BỞI BOT DETECTION (403)`.red.bold);
      return 'blocked';
    } else if (response.status === 200 && !response.data.success) {
      stats.noVoucherCount++;
      console.log(`⚠️ Attempt ${attemptNumber}: HẾT VOUCHER (${duration}ms)`.yellow);
      return 'no_voucher';
    } else {
      stats.errorCount++;
      console.log(`❌ Attempt ${attemptNumber}: ERROR (${response.status})`.red);
      return 'error';
    }
  } catch (error) {
    stats.errorCount++;
    console.log(`❌ Attempt ${attemptNumber}: FAILED (${error.message})`.red);
    return 'error';
  }
}

/**
 * Main voucher hunting function
 */
async function voucherHuntAttack() {
  console.clear();
  console.log('🎫 ============================================'.magenta.bold);
  console.log('🎫   VOUCHER HUNTER BOT - NODE.JS'.magenta.bold);
  console.log('🎫 ============================================'.magenta.bold);
  console.log(`📡 Target: ${CHATBOT_ENDPOINT}`.cyan);
  console.log(`📊 Max Attempts: ${MAX_ATTEMPTS}`.cyan);
  console.log(`⏱️  Delay: ${DELAY_MS}ms per attempt`.cyan);
  console.log('🎫 ============================================\n'.magenta.bold);
  
  stats.startTime = Date.now();
  
  for (let i = 1; i <= MAX_ATTEMPTS; i++) {
    const result = await grabVoucher(i);
    
    // Nếu bị block → dừng
    if (result === 'blocked') {
      console.log('\n⛔ IP đã bị BLACKLIST! Bot detection activated. Dừng săn voucher...'.red.bold);
      break;
    }
    
    // Nếu hết voucher → dừng
    if (result === 'no_voucher') {
      console.log('\n📭 HẾT VOUCHER! Dừng săn voucher...'.yellow.bold);
      break;
    }
    
    // Delay giữa các attempts
    await sleep(DELAY_MS);
  }
  
  stats.endTime = Date.now();
  
  // Print summary
  printSummary();
}

/**
 * Print attack summary
 */
function printSummary() {
  const duration = ((stats.endTime - stats.startTime) / 1000).toFixed(2);
  const totalAttempts = stats.successCount + stats.blockedCount + stats.noVoucherCount + stats.errorCount;
  
  console.log('\n\n📊 ============================================'.cyan.bold);
  console.log('📊   VOUCHER HUNTER SUMMARY'.cyan.bold);
  console.log('📊 ============================================'.cyan.bold);
  console.log(`🎫 Vouchers Collected: ${stats.vouchersCollected.length}`.green.bold);
  console.log(`✅ Success Attempts:   ${stats.successCount}`.green);
  console.log(`🛡️ Blocked Attempts:   ${stats.blockedCount}`.red);
  console.log(`⚠️  No Voucher:        ${stats.noVoucherCount}`.yellow);
  console.log(`❌ Errors:             ${stats.errorCount}`.red);
  console.log(`📊 Total Attempts:     ${totalAttempts}`.cyan);
  console.log(`⏱️  Total Duration:    ${duration}s`.cyan);
  console.log('📊 ============================================\n'.cyan.bold);
  
  if (stats.vouchersCollected.length > 0) {
    console.log('🎯 DANH SÁCH VOUCHERS ĐÃ SĂN ĐƯỢC:'.green.bold);
    console.log('━'.repeat(50).gray);
    
    stats.vouchersCollected.forEach((voucher, index) => {
      console.log(`${(index + 1).toString().padStart(3)}. 🎫 ${voucher.code} - 💰 Giảm ${voucher.discount}%`.cyan);
    });
    
    console.log('━'.repeat(50).gray);
    
    // Tính tổng giá trị
    const totalDiscount = stats.vouchersCollected.reduce((sum, v) => sum + v.discount, 0);
    console.log(`\n💎 Tổng giá trị giảm giá: ${totalDiscount}%`.green.bold);
  } else {
    console.log('📭 KHÔNG LẤY ĐƯỢC VOUCHER NÀO!'.red.bold);
  }
  
  console.log('\n');
  
  if (stats.blockedCount > 0) {
    console.log('✅ BOT DETECTION HOẠT ĐỘNG!'.green.bold);
    console.log('🛡️ Hệ thống đã phát hiện và chặn bot săn voucher.\n'.green);
  } else if (stats.vouchersCollected.length > 5) {
    console.log('⚠️ LỖ HỔNG BẢO MẬT!'.red.bold);
    console.log('🚨 Bot có thể săn voucher quá dễ dàng. Cần cải thiện bot detection.\n'.red);
  }
  
  console.log('🎯 Xem logs chi tiết tại: http://localhost:3000/admin/security\n'.blue);
}

// Run attack
console.log('⏳ Chuẩn bị săn voucher trong 3 giây...'.yellow);
console.log('🎯 Bot sẽ tự động lấy voucher từ chatbot endpoint...\n'.yellow);
setTimeout(() => {
  voucherHuntAttack().catch(err => {
    console.error('❌ Attack failed:'.red, err.message);
    process.exit(1);
  });
}, 3000);
