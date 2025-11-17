#!/usr/bin/env node
/**
 * 🚨 BOT ATTACK SCRIPT - Sequential Method
 * Giả lập bot tấn công tuần tự (sequential) vào endpoint
 * 
 * Cách chạy:
 * cd backend/attacks
 * node bot-sequential.js
 */

const axios = require('axios');
const colors = require('colors'); // npm install colors nếu chưa có

const API_BASE = process.env.API_BASE || 'http://localhost:5000';
const TARGET_ENDPOINT = `${API_BASE}/api/demo-attack/test`;
const TOTAL_REQUESTS = 50;
const DELAY_MS = 50; // 50ms giữa mỗi request (nhanh hơn người thật)

// Statistics
let stats = {
  success: 0,
  blocked: 0,
  errors: 0,
  startTime: null,
  endTime: null
};

/**
 * Sleep function
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Gửi 1 request
 */
async function sendRequest(requestNumber) {
  try {
    const startTime = Date.now();
    const response = await axios.get(TARGET_ENDPOINT, {
      timeout: 5000,
      validateStatus: () => true // Accept all status codes
    });
    const duration = Date.now() - startTime;
    
    if (response.status === 200) {
      stats.success++;
      console.log(`✅ Request ${requestNumber}: SUCCESS (${duration}ms)`.green);
      return 'success';
    } else if (response.status === 403) {
      stats.blocked++;
      console.log(`🛡️ Request ${requestNumber}: BLOCKED BY BOT DETECTION (403)`.red.bold);
      return 'blocked';
    } else {
      stats.errors++;
      console.log(`⚠️ Request ${requestNumber}: ERROR (${response.status})`.yellow);
      return 'error';
    }
  } catch (error) {
    stats.errors++;
    console.log(`❌ Request ${requestNumber}: FAILED (${error.message})`.red);
    return 'error';
  }
}

/**
 * Main attack function
 */
async function sequentialAttack() {
  console.clear();
  console.log('🚨 ============================================'.red.bold);
  console.log('🚨   SEQUENTIAL BOT ATTACK - NODE.JS'.red.bold);
  console.log('🚨 ============================================'.red.bold);
  console.log(`📡 Target: ${TARGET_ENDPOINT}`.cyan);
  console.log(`📊 Total Requests: ${TOTAL_REQUESTS}`.cyan);
  console.log(`⏱️  Delay: ${DELAY_MS}ms per request`.cyan);
  console.log('🚨 ============================================\n'.red.bold);
  
  stats.startTime = Date.now();
  
  for (let i = 1; i <= TOTAL_REQUESTS; i++) {
    const result = await sendRequest(i);
    
    // Nếu bị block, dừng lại
    if (result === 'blocked') {
      console.log('\n⛔ IP đã bị BLACKLIST! Dừng tấn công...'.red.bold);
      break;
    }
    
    // Delay giữa các requests
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
  const avgSpeed = (TOTAL_REQUESTS / duration).toFixed(2);
  
  console.log('\n\n📊 ============================================'.cyan.bold);
  console.log('📊   ATTACK SUMMARY'.cyan.bold);
  console.log('📊 ============================================'.cyan.bold);
  console.log(`✅ Success:        ${stats.success}`.green);
  console.log(`🛡️ Blocked:        ${stats.blocked}`.red);
  console.log(`❌ Errors:         ${stats.errors}`.yellow);
  console.log(`⏱️  Total Duration: ${duration}s`.cyan);
  console.log(`⚡ Average Speed:  ${avgSpeed} req/s`.cyan);
  console.log('📊 ============================================\n'.cyan.bold);
  
  if (stats.blocked > 0) {
    console.log('✅ BOT DETECTION HOẠT ĐỘNG THÀNH CÔNG!'.green.bold);
    console.log('🛡️ Hệ thống đã phát hiện và chặn tấn công bot.\n'.green);
  } else {
    console.log('⚠️ BOT CHƯA BỊ PHÁT HIỆN!'.yellow.bold);
    console.log('💡 Thử tăng số requests hoặc giảm delay.\n'.yellow);
  }
  
  console.log('🎯 Xem logs chi tiết tại: http://localhost:3000/admin/security\n'.blue);
}

// Run attack
console.log('⏳ Chuẩn bị tấn công trong 3 giây...'.yellow);
setTimeout(() => {
  sequentialAttack().catch(err => {
    console.error('❌ Attack failed:'.red, err.message);
    process.exit(1);
  });
}, 3000);
