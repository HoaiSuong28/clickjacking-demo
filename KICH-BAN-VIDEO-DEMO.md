# 🎬 KỊCH BẢN VIDEO DEMO - CHỐNG CLICKJACKING BẰNG CSP & X-FRAME-OPTIONS

**ĐỀ TÀI**: Chống Clickjacking bằng Content Security Policy (CSP) & X-Frame-Options  
**Thời lượng**: 8-10 phút  
**Định dạng**: Video màn hình (Screen Recording) + Voice Over  
**Nộp**: Link Youtube (Không công khai)

---

## 📋 PHẦN 1: GIỚI THIỆU ĐỀ TÀI (1.5-2 phút)

### 🎤 Lời thoại:

> "Xin chào thầy/cô và các bạn. Em xin trình bày đề tài: **Chống Clickjacking bằng Content Security Policy (CSP) và X-Frame-Options - Kết hợp hệ thống phát hiện Bot tấn công**.
>
> **Clickjacking** là một kỹ thuật tấn công nguy hiểm, khi hacker nhúng website hợp pháp vào trong iframe ẩn, lừa người dùng click vào các nút độc hại mà họ không hề hay biết. Ví dụ: người dùng nghĩ mình đang like một bài viết, nhưng thực tế đang chuyển tiền cho hacker.
>
> Ngoài clickjacking thủ công, hacker còn sử dụng **bot tự động** để tấn công quy mô lớn: spam requests, brute force login, scraping dữ liệu. Vì vậy em áp dụng **bảo vệ nhiều lớp (Defense-in-Depth)**:
>
> **LỚP 1 - Chống Clickjacking**:
> - X-Frame-Options Header: Chặn website được nhúng vào iframe
> - Content Security Policy (CSP): Kiểm soát nguồn tài nguyên
>
> **LỚP 2 - Chống Bot Attacks**:
> - Bot Detection Middleware: Phát hiện bot theo timing và rate limit
> - Automatic IP Blacklisting: Tự động chặn IP độc hại
>
> Hệ thống demo bao gồm:
> - **Website thương mại điện tử** được bảo vệ 2 lớp
> - **Clickjacking Attack Demo**: Trang giả mạo cố nhúng iframe
> - **Bot Attack Panel V2**: Mô phỏng 5 loại bot attack
> - **Security Monitor**: Dashboard giám sát real-time"

### 📹 Hành động:
- Hiển thị slide giải thích Clickjacking Attack (có hình minh họa)
- Hiển thị sơ đồ flow: Attacker → Fake Page → Iframe → Victim Website → BLOCKED
- Chuyển sang màn hình desktop với 3 cửa sổ đã chuẩn bị:
  - Cửa sổ 1: Website chính (http://localhost:3000)
  - Cửa sổ 2: Attack Demo Page (trang giả mạo)
  - Terminal: Backend logs (phía dưới)

---

## 📋 PHẦN 2: DEMO CÁC CHỨC NĂNG CHÍNH (5-6 phút)

### 🎯 2.1. Khởi động hệ thống (30 giây)

#### 🎤 Lời thoại:
> "Đầu tiên, em sẽ khởi động backend và frontend. Backend chạy trên port 5000, frontend chạy trên port 3000."

#### 📹 Hành động:
```bash
# Terminal 1 - Backend
cd backend
npm start
# Chờ hiện "🚀 Backend đang chạy tại http://localhost:5000"

# Terminal 2 - Frontend  
cd frontend
npm start
# Chờ hiện "webpack compiled successfully"
```

### 🎯 2.2. Giới thiệu Website được bảo vệ (1 phút)

#### 🎤 Lời thoại:
> "Đây là website thương mại điện tử LilyShoes đã được tích hợp CSP và X-Frame-Options.
>
> Em sẽ mở Developer Tools để các bạn thấy các security headers đã được áp dụng."

#### 📹 Hành động:
1. Truy cập `http://localhost:3000`
2. Mở **F12 Developer Tools** → Tab **Network**
3. Refresh trang
4. Click vào request đầu tiên (document)
5. Scroll xuống **Response Headers**, highlight:
   ```
   X-Frame-Options: DENY
   Content-Security-Policy: frame-ancestors 'none'
   X-Content-Type-Options: nosniff
   ```

#### 🎤 Lời thoại (tiếp):
> "Các bạn thấy, server đã trả về 3 headers bảo mật:
> - **X-Frame-Options: DENY** - Chặn hoàn toàn việc nhúng vào iframe
> - **Content-Security-Policy: frame-ancestors 'none'** - CSP level 2, chặn tất cả nguồn nhúng
> - **X-Content-Type-Options: nosniff** - Ngăn browser đoán kiểu file độc hại
>
> Giờ em sẽ demo tấn công clickjacking để chứng minh headers này hoạt động."

### 🎯 2.3. Demo Clickjacking Attack - Bị Chặn (2 phút)

#### 🎤 Lời thoại:
> "Em sẽ tạo một trang web giả mạo, cố gắng nhúng LilyShoes vào iframe ẩn để đánh cắp click của người dùng."

#### 📹 Hành động:
1. **Tạo file `clickjacking-attack.html`** trên desktop:
```html
<!DOCTYPE html>
<html>
<head>
    <title>🎁 NHẬN QUÀ MIỄN PHÍ!</title>
    <style>
        body {
            font-family: Arial;
            text-align: center;
            padding: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .gift-box {
            font-size: 100px;
            animation: bounce 1s infinite;
        }
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        button {
            font-size: 24px;
            padding: 20px 40px;
            background: #ff6b6b;
            border: none;
            color: white;
            cursor: pointer;
            border-radius: 10px;
            position: relative;
            z-index: 1;
        }
        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.5; /* Để demo dễ thấy - thực tế sẽ là 0 */
            z-index: 999;
            border: 3px solid red;
        }
    </style>
</head>
<body>
    <div class="gift-box">🎁</div>
    <h1>CHÚC MỪNG BẠN ĐÃ TRÚNG THƯỞNG!</h1>
    <p style="font-size: 20px;">Click nút bên dưới để nhận quà ngay!</p>
    <button>🎉 NHẬN QUÀ NGAY 🎉</button>
    
    <!-- Iframe ẩn nhúng website thật -->
    <iframe src="http://localhost:3000"></iframe>
    
    <p style="margin-top: 50px; font-size: 14px; opacity: 0.7;">
        ⚠️ Đây là demo tấn công Clickjacking<br>
        Iframe cố gắng nhúng LilyShoes (màu đỏ phía sau)
    </p>
</body>
</html>
```

2. **Mở file trong browser**
3. **Quan sát Console (F12)**

#### 🎤 Lời thoại (trong khi mở file):
> "Đây là trang web giả mạo, người dùng thấy nút 'NHẬN QUÀ NGAY' hấp dẫn.
> Nhưng phía sau, hacker đã cố gắng nhúng website LilyShoes vào iframe ẩn (em để opacity 0.5 để demo dễ thấy, thực tế sẽ là 0).
>
> Khi người dùng click vào nút, thực tế họ đang click vào nút trên website LilyShoes bên dưới - ví dụ nút 'Chuyển tiền', 'Xác nhận đơn hàng'..."

#### 📹 Hành động:
- Chỉ vào iframe màu đỏ phía sau
- Mở **F12 Console**
- Highlight error message:
  ```
  Refused to display 'http://localhost:3000/' in a frame because it set 'X-Frame-Options' to 'deny'.
  ```

#### 🎤 Lời thoại (tiếp):
> "Các bạn thấy, browser đã chặn! Console báo lỗi:
> 'Refused to display in a frame because X-Frame-Options is DENY'
>
> Iframe hoàn toàn trắng, không load được nội dung. Đây chính là tác dụng của X-Frame-Options và CSP frame-ancestors.
>
> Người dùng an toàn, không thể bị lừa click."

### 🎯 2.4. Kiểm tra Backend Logs (1 phút)

#### 🎤 Lời thoại:
> "Bên backend, hệ thống đã ghi log mỗi lần có iframe request."

#### 📹 Hành động:
- Chuyển sang **Terminal Backend**
- Scroll tìm dòng log:
  ```
  [2025-11-17T14:33:16.979Z] 🛡️ Anti-Clickjacking: GET /
    ✅ X-Frame-Options: DENY
    ✅ Content-Security-Policy: frame-ancestors 'none'
    ✅ X-Content-Type-Options: nosniff
    ⚠️ IFRAME REQUEST DETECTED from Referer: (null)
  ```

#### 🎤 Lời thoại (tiếp):
> "Backend đã phát hiện iframe request và tự động áp dụng security headers. Mọi attempt clickjacking đều bị chặn ngay từ HTTP response level."

### 🎯 2.5. Demo Security Monitor Dashboard (1 phút)

#### 🎤 Lời thoại:
> "Để giám sát tổng quan, em có Security Monitor Dashboard theo dõi các cuộc tấn công real-time."

#### 📹 Hành động:
- Mở `http://localhost:3000/security-monitor`
- Chỉ vào các metric:
  - **Total Bot Attacks**: Tổng số bot attack attempts (không phải clickjacking)
  - **Blocked IPs**: IPs đã bị blacklist
  - **Recent Logs**: Logs chi tiết

#### 🎤 Lời thoại (tiếp):
> "Dashboard này cập nhật tự động mỗi 5 giây. Ngoài clickjacking protection, hệ thống còn phát hiện và chặn bot attacks như spam, brute force, scraping.
>
> Đây là tầng bảo mật bổ sung, kết hợp với CSP và X-Frame-Options để bảo vệ toàn diện."

### 🎯 2.6. Demo Bot Attack Panel - Lớp bảo vệ thứ 2 (2.5 phút)

#### 🎤 Lời thoại:
> "Sau khi chặn clickjacking thành công, giờ em demo **Lớp bảo vệ thứ 2**: Chống Bot Attacks.
>
> Đây là Bot Attack Panel V2 - công cụ mô phỏng 5 loại tấn công bot:
> 1. Product Scraping - Bot scrape thông tin sản phẩm
> 2. Voucher Hunter - Bot săn voucher tự động
> 3. Blog Spam - Bot spam requests
> 4. Account Flooding - Bot tạo hàng trăm tài khoản giả
> 5. Brute Force Login - Bot dò mật khẩu
>
> Em sẽ demo **Product Scraping** - bot gửi 20 requests liên tục để scrape dữ liệu."

#### 📹 Hành động:
1. **Mở `bot-attack-panel-v2.html`**
2. **Giới thiệu giao diện** (30 giây):
   - Chỉ vào Attack Configuration
   - Chỉ vào Real-time Statistics
   - Chỉ vào Attack Logs section
3. **Cấu hình attack**:
   - Attack Type: **Product Scraping**
   - Total Requests: **20**
   - Delay: **50ms** (rất nhanh - giống bot)
4. **Click 🚀 LAUNCH ATTACK**
5. **Quan sát Bot Panel** (1 phút):
   - **Phase 1**: Reconnaissance
     - Logs: "Initiating connection to port 5000..."
     - Logs: "Scanning for vulnerable endpoints..."
     - Logs: "Found public endpoint: /api/products"
   - **Phase 2**: Attack Execution
     - Request #1-2: ✅ **Success** (màu xanh) - "200 OK"
     - Request #3-5: 🚫 **Blocked** (màu đỏ) - "403 Forbidden: Bot detected"
   - **Statistics cập nhật**:
     - Sent: 20
     - Success: 2
     - Blocked: 18
     - Detection: **DETECTED** (màu đỏ)

#### 🎤 Lời thoại (trong khi quan sát):
> "Các bạn thấy, bot bắt đầu quét port, tìm endpoint public...
>
> Request đầu tiên thành công vì hệ thống chưa phát hiện pattern.
>
> Nhưng từ request thứ 3, bot detection middleware đã kích hoạt! Lý do:
> - Timing quá nhanh: 50ms giữa các requests (con người cần ít nhất 500ms)
> - Rate limit vượt quá: 20 requests trong 1 giây (giới hạn là 5 requests/phút)
>
> IP của bot bị tự động blacklist trong 5 phút."

6. **Chuyển sang Security Monitor** (30 giây):
   - **Total Bot Attacks**: Tăng lên (ví dụ: 2 → 3)
   - **Blocked IPs**: Xuất hiện IP `127.0.0.1`
   - **Recent Logs**: 
     - Timestamp: Vừa xong
     - IP: 127.0.0.1
     - Endpoint: /api/products
     - Reason: "Rate limit exceeded"

#### 🎤 Lời thoại (tiếp):
> "Security Monitor đã cập nhật ngay! Dashboard này refresh tự động mỗi 5 giây.
>
> IP của bot đã bị thêm vào danh sách Blocked IPs. Logs ghi chi tiết: thời gian, endpoint, lý do bị chặn.
>
> Như vậy, hệ thống đã thành công chặn cả:
> - ✅ Clickjacking attack (Lớp 1) - Chặn iframe
> - ✅ Bot attack (Lớp 2) - Chặn spam/scraping
>
> Đây chính là **Defense-in-Depth** - bảo vệ nhiều lớp."

---

## 📋 PHẦN 3: GIẢI THÍCH CẤU TRÚC CHƯƠNG TRÌNH (2-3 phút)

### 🎯 3.1. Kiến trúc tổng quan - Defense-in-Depth (1 phút)

#### 🎤 Lời thoại:
> "Về cấu trúc chương trình, em áp dụng chiến lược **Defense-in-Depth** - bảo vệ nhiều lớp:
> 
> **LỚP 1 - HTTP Security Headers** (Chống Clickjacking):
> - Anti-Clickjacking Middleware (`antiClickjacking.js`)
> - Tự động inject X-Frame-Options: DENY
> - Content-Security-Policy: frame-ancestors 'none'
> - Phát hiện iframe requests và log cảnh báo
>
> **LỚP 2 - Bot Detection** (Chống tấn công tự động):
> - Bot Detection Middleware (`botDetection.js`)
> - Time-based detection: Requests quá nhanh (< 500ms)
> - Rate limiting: Tối đa 5 requests/phút
> - Pattern analysis: Phát hiện bot behavior
> - Automatic blacklisting: Block IP 5 phút
>
> **LỚP 3 - Monitoring & Logging**:
> - Security Monitor Dashboard (React.js)
> - Real-time statistics và logs
> - Auto-refresh mỗi 5 giây
> - API endpoints: `/api/security/stats`, `/api/security/recent-attacks`
>
> **Testing Tools**:
> - Clickjacking Attack Demo Page (iframe test)
> - Bot Attack Panel V2 (penetration testing)
> - 5 loại attack scenarios"

#### 📹 Hành động:
- Mở VS Code
- Hiển thị cấu trúc thư mục:
```
Webgiay/
├── backend/
│   ├── middleware/
│   │   ├── antiClickjacking.js    # 🛡️ LỚP 1 - Chống Clickjacking
│   │   │                          #   ↳ X-Frame-Options + CSP
│   │   └── botDetection.js        # 🤖 LỚP 2 - Chống Bot
│   │                              #   ↳ Timing + Rate Limit + Pattern
│   ├── routes/
│   │   ├── admin/security.route.js  # API monitoring
│   │   └── user/
│   │       ├── productsUser.js      # Protected by detectBot
│   │       ├── auth.js              # Protected by detectBot
│   │       └── blogsUser.js         # Protected by detectBot
│   ├── server.js                    # Apply middleware global
│   └── attacks/
│       ├── clickjacking-attack.html  # Test Layer 1
│       └── bot-attack-panel-v2.html  # Test Layer 2
└── frontend/
    └── src/
        └── pages/admin/
            └── SecurityMonitor.js    # Real-time monitoring
```

### 🎯 3.2. Anti-Clickjacking Middleware (1.5 phút)

#### 🎤 Lời thoại:
> "Đây là file quan trọng nhất - `antiClickjacking.js`.
>
> Middleware này có 3 chức năng chính:
>
> **1. Inject Security Headers**:
> - Mỗi HTTP response đều được gắn X-Frame-Options: DENY
> - Content-Security-Policy: frame-ancestors 'none'
> - X-Content-Type-Options: nosniff
>
> **2. Detect Iframe Requests**:
> - Kiểm tra header Sec-Fetch-Dest === 'iframe'
> - Hoặc kiểm tra Referer có phải từ iframe không
> - Log warning nếu phát hiện attempt clickjacking
>
> **3. Flexible Configuration**:
> - Dev preset: Log chi tiết để debug
> - Production preset: Chặn im lặng, không log verbose
> - Custom preset: Tùy chỉnh theo nhu cầu"

#### 📹 Hành động:
- Mở file `backend/middleware/antiClickjacking.js`
- Scroll đến hàm `antiClickjacking()`, highlight:
```javascript
function antiClickjacking(options = {}) {
  return (req, res, next) => {
    // Set X-Frame-Options
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Set Content-Security-Policy
    res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
    
    // Set X-Content-Type-Options
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    if (options.logging) {
      console.log(`[${new Date().toISOString()}] 🛡️ Anti-Clickjacking: ${req.method} ${req.path}`);
    }
    
    next();
  };
}
```

- Scroll đến `detectIframeRequest()`, highlight:
```javascript
function detectIframeRequest(req, res, next) {
  const secFetchDest = req.headers['sec-fetch-dest'];
  const referer = req.headers['referer'];
  
  if (secFetchDest === 'iframe' || referer) {
    console.warn(`⚠️ IFRAME REQUEST DETECTED from ${req.ip}`);
  }
  
  next();
}
```

- Scroll xuống presets:
```javascript
const presets = {
  dev: { logging: true, strict: false },
  production: { logging: false, strict: true }
};
```

### 🎯 3.3. Bot Detection Algorithm (1 phút)

#### 🎤 Lời thoại:
> "Middleware thứ 2 - `botDetection.js` - làm việc song song với clickjacking protection.
>
> Thuật toán phát hiện bot có 3 cơ chế:
> 1. **Time-based**: Nếu requests nhanh hơn 500ms → Bot
> 2. **Rate limiting**: Nếu vượt 5 requests/phút → Bot  
> 3. **Pattern analysis**: Nếu 3 requests có timing giống nhau → Bot
>
> Khi phát hiện, IP bị blacklist 5 phút."

#### 📹 Hành động:
- Mở file `botDetection.js`
- Highlight CONFIG:
```javascript
const CONFIG = {
  MIN_TIME_HUMAN: 500,         // 0.5 giây
  MAX_REQUESTS_PER_MINUTE: 5,  // 5 requests/phút
  PATTERN_THRESHOLD: 3,        // 3 patterns
  BLACKLIST_DURATION: 300000   // 5 phút
};
```
- Scroll đến `detectBot()` function

### 🎯 3.4. Integration vào Server (30 giây)

#### 🎤 Lời thoại:
> "Cả 2 middleware được áp dụng trong `server.js`:
> - **antiClickjacking**: Global cho tất cả routes
> - **detectBot**: Chọn lọc cho các endpoint nhạy cảm
>
> Như vậy hệ thống bảo vệ 2 lớp: Clickjacking + Bot."

#### 📹 Hành động:
- Mở `backend/server.js`
- Scroll tìm dòng:
```javascript
// Import middleware
const { antiClickjacking, presets } = require('./middleware/antiClickjacking');
const { detectBot } = require('./middleware/botDetection');

// LỚP 1: Apply global - Chống Clickjacking
app.use(antiClickjacking(presets.dev));
app.use(detectIframeRequest);

// LỚP 2: Apply selective - Chống Bot
// (áp dụng trong routes/user/productsUser.js, auth.js, blogsUser.js)
```

- Mở `routes/user/productsUser.js`, highlight:
```javascript
router.get('/', detectBot, productController.getAllProducts);
```

---

## 📋 PHẦN 4: KẾT LUẬN (30 giây - 1 phút)

### 🎤 Lời thoại:

> "Tóm lại, đề tài đã thực hiện thành công **hệ thống bảo mật 2 lớp**:
> 
> **LỚP 1 - Chống Clickjacking**:
> ✅ X-Frame-Options: DENY - Chặn website được nhúng iframe
> ✅ Content Security Policy: frame-ancestors 'none' - Tiêu chuẩn mới
> ✅ Phát hiện iframe attempts - Log warning real-time
> ✅ Tương thích đa trình duyệt - Chrome, Firefox, Safari, Edge
>
> **LỚP 2 - Chống Bot Attacks**:
> ✅ Time-based detection - Phát hiện requests quá nhanh (< 500ms)
> ✅ Rate limiting - Giới hạn 5 requests/phút
> ✅ Pattern analysis - Nhận diện bot behavior
> ✅ Automatic blacklisting - Block IP tự động 5 phút
> ✅ Real-time monitoring - Dashboard cập nhật liên tục
>
> **Ưu điểm của giải pháp Defense-in-Depth**:
> - ✅ Bảo vệ toàn diện: Vừa chặn clickjacking, vừa chặn bot
> - ✅ Đơn giản triển khai: Chỉ cần 2 middleware
> - ✅ Hiệu suất cao: Overhead thấp, chỉ check headers + timing
> - ✅ Không ảnh hưởng UX: User hợp lệ không bị ảnh hưởng
> - ✅ Standards-compliant: Tuân thủ W3C, OWASP Top 10
> - ✅ Có công cụ testing: Bot Attack Panel V2 để kiểm thử
>
> **Kết quả demo**:
> - 🚫 Clickjacking attack: BLOCKED (iframe error)
> - 🚫 Bot attack (20 requests): 2 Success, 18 Blocked
> - 📊 Security Monitor: Real-time tracking attacks
>
> **Hướng phát triển**:
> - Tích hợp CAPTCHA cho suspicious IPs
> - Machine Learning để phát hiện bot patterns phức tạp
> - CSP nonce/hash cho inline scripts
> - Subresource Integrity (SRI) cho CDN
> - Device Fingerprinting nâng cao
>
> Em xin cảm ơn thầy/cô và các bạn đã theo dõi!"

### 📹 Hành động:
- Hiển thị lại cửa sổ browser với error "Refused to display in a frame"
- Chuyển sang slide "Thank You" với thông tin:
  ```
  Đề tài: Chống Clickjacking bằng CSP & X-Frame-Options
  Sinh viên: [Tên]
  MSSV: [MSSV]
  Lớp: [Lớp]
  
  Cảm ơn thầy/cô và các bạn! 🙏
  ```
- Fade out

---

## 🎬 CHECKLIST TRƯỚC KHI QUAY

### ✅ Chuẩn bị môi trường:
- [ ] Backend chạy ổn định trên port 5000
- [ ] Frontend chạy ổn định trên port 3000
- [ ] Database có dữ liệu mẫu (products, blogs, vouchers)
- [ ] Clear logs cũ để demo sạch

### ✅ Chuẩn bị màn hình:
- [ ] Độ phân giải: 1920x1080 (Full HD)
- [ ] Font size terminal đủ lớn để đọc
- [ ] Đóng tất cả tab/app không liên quan
- [ ] Bật Dark Mode (đẹp hơn khi quay)

### ✅ Chuẩn bị file:
- [ ] Tạo `clickjacking-attack.html` trên desktop (copy từ kịch bản)
- [ ] `bot-attack-panel-v2.html` mở sẵn (tùy chọn)
- [ ] Security Monitor mở tại `/security-monitor`
- [ ] VS Code mở thư mục dự án, file `antiClickjacking.js` mở sẵn
- [ ] Terminal split 2 cửa sổ (backend + frontend)

### ✅ Phần mềm quay:
- **Windows**: OBS Studio (miễn phí)
- **Mac**: QuickTime Screen Recording
- **Cài đặt**: 60fps, 1920x1080, Audio ON

### ✅ Lưu ý khi quay:
- 🎤 Nói rõ ràng, không quá nhanh
- ⏸️ Pause 2-3 giây giữa các phần để dễ cắt
- 🖱️ Di chuột chậm, highlight phần quan trọng
- 🔴 Quay 2-3 lần để chọn take tốt nhất

---

## 📤 UPLOAD YOUTUBE

### Cài đặt video:
- **Tiêu đề**: "Demo Chống Clickjacking bằng CSP & X-Frame-Options | Web Thương Mại Điện Tử"
- **Mô tả**: 
  ```
  Đề tài: Chống Clickjacking bằng Content Security Policy (CSP) & X-Frame-Options
  Sinh viên: [Tên bạn]
  MSSV: [MSSV]
  Lớp: [Lớp]
  
  Nội dung:
  ✅ Giải thích Clickjacking Attack
  ✅ Demo tấn công bị chặn bởi X-Frame-Options
  ✅ Content Security Policy frame-ancestors
  ✅ Anti-Clickjacking Middleware (Express.js)
  ✅ Testing & Monitoring tools
  
  Tech Stack: Node.js, Express, React, CSP, X-Frame-Options
  ```
- **Quyền riêng tư**: **Không công khai** (Unlisted)
- **Danh sách phát**: Tạo playlist "Đồ án cuối kỳ"

---

## 💡 MẸO QUAY VIDEO HAY

1. **Intro mạnh mẽ**: Bắt đầu với slide đẹp hoặc animation
2. **Giọng nói tự tin**: Nói như đang thuyết trình trước mặt thầy
3. **Transitions mượt**: Dùng fade in/out khi chuyển phần
4. **Highlight quan trọng**: Zoom vào số liệu/logs quan trọng
5. **Background music**: Nhạc nền nhẹ nhàng (tùy chọn)
6. **Outro chuyên nghiệp**: Màn hình "Thank you" + contact info

---

## ⏱️ TIMELINE DỰ KIẾN

| Thời gian | Nội dung | Hành động |
|-----------|----------|-----------|
| 00:00-00:10 | Intro | Slide tiêu đề + Defense-in-Depth |
| 00:10-02:00 | Giới thiệu đề tài | Giải thích 2 lớp bảo vệ + sơ đồ |
| 02:00-02:30 | Khởi động hệ thống | Terminal commands |
| 02:30-03:30 | Giới thiệu website | F12 → Network → Response Headers |
| 03:30-05:30 | **Demo LỚP 1: Clickjacking bị chặn** | Fake page + iframe → ERROR |
| 05:30-06:30 | **Demo LỚP 2: Bot Attack bị chặn** | Bot Panel → 2 Success, 18 Blocked |
| 06:30-07:00 | Security Monitor | Dashboard real-time stats |
| 07:00-09:00 | Giải thích code | antiClickjacking.js + botDetection.js |
| 09:00-10:00 | Kết luận | Defense-in-Depth + Thank you |

---

**Chúc bạn quay video thành công! 🎬🎉**
