#!/usr/bin/env node
/**
 * ⚡ BOT ATTACK SCRIPT - Parallel Method
 * Giả lập bot tấn công song song (parallel) - gửi nhiều requests cùng lúc
 * 
 * Cách chạy:
 * cd backend/attacks
 * node bot-parallel.js
 */

const axios = require('axios');
const colors = require('colors');

const API_BASE = process.env.API_BASE || 'http://localhost:5000';
const TARGET_ENDPOINT = `${API_BASE}/api/demo-attack/test`;
const TOTAL_REQUESTS = 100; // Gửi 100 requests ĐỒNG THỜI
const BATCH_SIZE = 20; // Chia thành batches để không overwhelm system

// Statistics
let stats = {
  success: 0,
  blocked: 0,
  errors: 0,
  startTime: null,
  endTime: null
};

/**
 * Gửi 1 request
 */
async function sendRequest(requestNumber) {
  try {
    const startTime = Date.now();
    const response = await axios.get(TARGET_ENDPOINT, {
      timeout: 10000,
      validateStatus: () => true
    });
    const duration = Date.now() - startTime;
    
    const result = {
      number: requestNumber,
      status: response.status,
      duration,
      timestamp: new Date().toISOString()
    };
    
    if (response.status === 200) {
      stats.success++;
      console.log(`✅ Request ${requestNumber}: SUCCESS (${duration}ms)`.green);
    } else if (response.status === 403) {
      stats.blocked++;
      console.log(`🛡️ Request ${requestNumber}: BLOCKED (403) - BOT DETECTED!`.red.bold);
    } else {
      stats.errors++;
      console.log(`⚠️ Request ${requestNumber}: ERROR (${response.status})`.yellow);
    }
    
    return result;
  } catch (error) {
    stats.errors++;
    console.log(`❌ Request ${requestNumber}: FAILED (${error.message})`.red);
    return {
      number: requestNumber,
      status: 'ERROR',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Gửi batch requests song song
 */
async function sendBatch(batchNumber, start, end) {
  console.log(`\n🚀 Batch ${batchNumber}: Sending requests ${start}-${end}...`.cyan.bold);
  
  const promises = [];
  for (let i = start; i <= end; i++) {
    promises.push(sendRequest(i));
  }
  
  const results = await Promise.all(promises);
  
  const batchSuccess = results.filter(r => r.status === 200).length;
  const batchBlocked = results.filter(r => r.status === 403).length;
  
  console.log(`✅ Batch ${batchNumber} completed: ${batchSuccess} success, ${batchBlocked} blocked`.green);
  
  return results;
}

/**
 * Main parallel attack function
 */
async function parallelAttack() {
  console.clear();
  console.log('⚡ ============================================'.red.bold);
  console.log('⚡   PARALLEL BOT ATTACK - NODE.JS'.red.bold);
  console.log('⚡ ============================================'.red.bold);
  console.log(`📡 Target: ${TARGET_ENDPOINT}`.cyan);
  console.log(`📊 Total Requests: ${TOTAL_REQUESTS}`.cyan);
  console.log(`🔥 Concurrency: ${BATCH_SIZE} requests per batch`.cyan);
  console.log(`📦 Total Batches: ${Math.ceil(TOTAL_REQUESTS / BATCH_SIZE)}`.cyan);
  console.log('⚡ ============================================\n'.red.bold);
  
  stats.startTime = Date.now();
  
  const allResults = [];
  const totalBatches = Math.ceil(TOTAL_REQUESTS / BATCH_SIZE);
  
  for (let batch = 1; batch <= totalBatches; batch++) {
    const start = (batch - 1) * BATCH_SIZE + 1;
    const end = Math.min(batch * BATCH_SIZE, TOTAL_REQUESTS);
    
    const batchResults = await sendBatch(batch, start, end);
    allResults.push(...batchResults);
    
    // Kiểm tra nếu bị block nhiều → dừng
    const blockedCount = batchResults.filter(r => r.status === 403).length;
    if (blockedCount > BATCH_SIZE * 0.5) {
      console.log('\n⛔ Phần lớn requests bị BLOCK! IP đã bị blacklist. Dừng tấn công...'.red.bold);
      break;
    }
    
    // Delay nhỏ giữa các batches (100ms)
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  stats.endTime = Date.now();
  
  // Print summary
  printSummary(allResults);
}

/**
 * Print attack summary
 */
function printSummary(results) {
  const duration = ((stats.endTime - stats.startTime) / 1000).toFixed(2);
  const avgSpeed = (results.length / duration).toFixed(2);
  
  console.log('\n\n📊 ============================================'.cyan.bold);
  console.log('📊   PARALLEL ATTACK SUMMARY'.cyan.bold);
  console.log('📊 ============================================'.cyan.bold);
  console.log(`✅ Success:        ${stats.success}`.green);
  console.log(`🛡️ Blocked:        ${stats.blocked}`.red);
  console.log(`❌ Errors:         ${stats.errors}`.yellow);
  console.log(`📦 Total Sent:     ${results.length}`.cyan);
  console.log(`⏱️  Total Duration: ${duration}s`.cyan);
  console.log(`⚡ Average Speed:  ${avgSpeed} req/s`.cyan);
  console.log(`🔥 Concurrency:    ${BATCH_SIZE} parallel requests`.cyan);
  console.log('📊 ============================================\n'.cyan.bold);
  
  // Phân tích pattern
  const successRate = ((stats.success / results.length) * 100).toFixed(2);
  const blockRate = ((stats.blocked / results.length) * 100).toFixed(2);
  
  console.log('📈 PHÂN TÍCH PATTERN:'.blue.bold);
  console.log(`  Success Rate: ${successRate}%`.green);
  console.log(`  Block Rate:   ${blockRate}%`.red);
  
  if (stats.blocked > 0) {
    console.log('\n✅ BOT DETECTION HOẠT ĐỘNG THÀNH CÔNG!'.green.bold);
    console.log('🛡️ Hệ thống đã phát hiện và chặn tấn công bot song song.\n'.green);
  } else {
    console.log('\n⚠️ BOT CHƯA BỊ PHÁT HIỆN!'.yellow.bold);
    console.log('💡 Rate limit có thể chưa kích hoạt. Thử tăng số requests.\n'.yellow);
  }
  
  console.log('🎯 Xem logs chi tiết tại: http://localhost:3000/admin/security\n'.blue);
}

// Run attack
console.log('⏳ Chuẩn bị tấn công PARALLEL trong 3 giây...'.yellow);
setTimeout(() => {
  parallelAttack().catch(err => {
    console.error('❌ Attack failed:'.red, err.message);
    process.exit(1);
  });
}, 3000);
