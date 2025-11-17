// 🛡️ MIDDLEWARE CHỐNG CLICKJACKING
// Sử dụng X-Frame-Options và Content-Security-Policy để ngăn chặn tấn công clickjacking

/**
 * Middleware chống Clickjacking bằng cách:
 * 1. X-Frame-Options: DENY - Chặn website bị nhúng vào iframe
 * 2. Content-Security-Policy: frame-ancestors 'none' - Tiêu chuẩn hiện đại
 * 3. X-Content-Type-Options: nosniff - Ngăn MIME type sniffing
 * 
 * @param {Object} options - Cấu hình tùy chọn
 * @param {String} options.policy - 'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM uri'
 * @param {Array} options.allowedOrigins - Danh sách origins được phép nhúng (nếu policy = 'ALLOW-FROM')
 * @param {Boolean} options.enableLogging - Bật logging
 */

const antiClickjacking = (options = {}) => {
  const {
    policy = 'DENY', // Mặc định: Chặn hoàn toàn
    allowedOrigins = [],
    enableLogging = true
  } = options;

  return (req, res, next) => {
    // 📊 Logging (nếu bật)
    if (enableLogging) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] 🛡️ Anti-Clickjacking: ${req.method} ${req.path}`);
    }

    // 🔒 BƯỚC 1: Set X-Frame-Options Header
    // Tiêu chuẩn cũ nhưng vẫn được hỗ trợ rộng rãi
    switch (policy.toUpperCase()) {
      case 'DENY':
        // Chặn hoàn toàn - Không cho phép nhúng vào iframe
        res.setHeader('X-Frame-Options', 'DENY');
        break;
      
      case 'SAMEORIGIN':
        // Chỉ cho phép nhúng từ cùng origin (same domain)
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        break;
      
      case 'ALLOW-FROM':
        // Cho phép nhúng từ origins cụ thể (deprecated, nên dùng CSP)
        if (allowedOrigins.length > 0) {
          res.setHeader('X-Frame-Options', `ALLOW-FROM ${allowedOrigins[0]}`);
        } else {
          res.setHeader('X-Frame-Options', 'DENY');
        }
        break;
      
      default:
        res.setHeader('X-Frame-Options', 'DENY');
    }

    // 🔒 BƯỚC 2: Set Content-Security-Policy (CSP) Header
    // Tiêu chuẩn hiện đại, thay thế X-Frame-Options
    let cspFrameAncestors;
    switch (policy.toUpperCase()) {
      case 'DENY':
        cspFrameAncestors = "frame-ancestors 'none'";
        break;
      
      case 'SAMEORIGIN':
        cspFrameAncestors = "frame-ancestors 'self'";
        break;
      
      case 'ALLOW-FROM':
        if (allowedOrigins.length > 0) {
          cspFrameAncestors = `frame-ancestors ${allowedOrigins.join(' ')}`;
        } else {
          cspFrameAncestors = "frame-ancestors 'none'";
        }
        break;
      
      default:
        cspFrameAncestors = "frame-ancestors 'none'";
    }

    // Lấy CSP hiện tại (nếu đã set trước đó)
    const existingCSP = res.getHeader('Content-Security-Policy');
    if (existingCSP) {
      // Append frame-ancestors vào CSP hiện tại
      res.setHeader('Content-Security-Policy', `${existingCSP}; ${cspFrameAncestors}`);
    } else {
      // Set CSP mới
      res.setHeader('Content-Security-Policy', cspFrameAncestors);
    }

    // 🔒 BƯỚC 3: Set X-Content-Type-Options Header
    // Ngăn browser đoán MIME type (giảm thiểu tấn công XSS)
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // 🔒 BƯỚC 4: Set X-XSS-Protection Header (Bonus)
    // Kích hoạt XSS filter trên browser (legacy, nhưng vẫn hữu ích)
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // 🔒 BƯỚC 5: Set Referrer-Policy Header (Bonus)
    // Giảm thiểu rò rỉ thông tin qua Referer header
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // 📊 Logging headers đã set (nếu bật)
    if (enableLogging) {
      console.log(`  ✅ X-Frame-Options: ${res.getHeader('X-Frame-Options')}`);
      console.log(`  ✅ Content-Security-Policy: ${res.getHeader('Content-Security-Policy')}`);
      console.log(`  ✅ X-Content-Type-Options: ${res.getHeader('X-Content-Type-Options')}`);
    }

    next();
  };
};

// 🎯 Các preset cấu hình phổ biến
const presets = {
  // 🔒 STRICT: Chặn hoàn toàn (khuyến nghị cho production)
  strict: {
    policy: 'DENY',
    enableLogging: false
  },

  // 🔓 SAME_ORIGIN: Chỉ cho phép nhúng từ cùng domain
  sameOrigin: {
    policy: 'SAMEORIGIN',
    enableLogging: false
  },

  // 🧪 DEV: Bật logging cho môi trường development
  dev: {
    policy: 'DENY',
    enableLogging: true
  },

  // 🌐 ALLOW_TRUSTED: Cho phép nhúng từ origins tin cậy
  allowTrusted: (origins = []) => ({
    policy: 'ALLOW-FROM',
    allowedOrigins: origins,
    enableLogging: false
  })
};

/**
 * Middleware kiểm tra xem request có phải từ iframe hay không
 * Nếu phát hiện, log cảnh báo
 */
const detectIframeRequest = (req, res, next) => {
  const referer = req.get('Referer');
  const origin = req.get('Origin');
  
  // Kiểm tra nếu request đến từ iframe khác domain
  if (referer && origin) {
    const refererOrigin = new URL(referer).origin;
    if (refererOrigin !== origin) {
      console.warn(`⚠️ CLICKJACKING ATTEMPT DETECTED!`);
      console.warn(`  Request from: ${refererOrigin}`);
      console.warn(`  Target: ${req.path}`);
      console.warn(`  IP: ${req.ip}`);
      console.warn(`  User-Agent: ${req.get('User-Agent')}`);
    }
  }

  next();
};

/**
 * Middleware test: Thêm header debug để kiểm tra
 */
const testAntiClickjacking = (req, res, next) => {
  res.setHeader('X-Anti-Clickjacking-Enabled', 'true');
  res.setHeader('X-Protected-By', 'LillyShoes Security Team');
  next();
};

// Export middleware và presets
module.exports = {
  antiClickjacking,
  presets,
  detectIframeRequest,
  testAntiClickjacking
};

// 📚 HƯỚNG DẪN SỬ DỤNG:
// 
// 1. Chặn hoàn toàn (khuyến nghị):
//    app.use(antiClickjacking(presets.strict));
//
// 2. Chỉ cho phép nhúng từ cùng domain:
//    app.use(antiClickjacking(presets.sameOrigin));
//
// 3. Dev mode với logging:
//    app.use(antiClickjacking(presets.dev));
//
// 4. Cho phép origins cụ thể:
//    app.use(antiClickjacking(presets.allowTrusted(['https://trusted-site.com'])));
//
// 5. Custom config:
//    app.use(antiClickjacking({
//      policy: 'DENY',
//      enableLogging: true
//    }));
//
// 6. Thêm phát hiện iframe (optional):
//    app.use(detectIframeRequest);
//
// 📊 TEST:
// 1. Mở DevTools → Network → Chọn 1 request
// 2. Xem Response Headers:
//    - X-Frame-Options: DENY
//    - Content-Security-Policy: frame-ancestors 'none'
//    - X-Content-Type-Options: nosniff
//
// 3. Test iframe:
//    <iframe src="http://localhost:5000"></iframe>
//    → Browser sẽ chặn và hiển thị lỗi
