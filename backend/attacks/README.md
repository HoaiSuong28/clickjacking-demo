# 🤖 Demo Bot Attack & Defense System

## 📋 Tổng quan

Đây là hệ thống demo **tấn công và phòng thủ bot** cho ứng dụng web. Bao gồm:

1. **2 script tấn công bot** (vai trò hacker)
2. **Cơ chế phòng thủ thông minh** (vai trò bảo mật)
3. **API endpoints để test**

---

## 🗂️ Cấu trúc Files

```
backend/
├── attacks/
│   ├── bot-voucher-hunter.js    # Bot săn voucher chatbot
│   └── bot-dos-attack.js         # Bot tấn công DDoS/Auto-click
├── middleware/
│   └── botDetection.js           # Middleware phát hiện bot
├── routes/
│   └── demo-attack.route.js      # API endpoints demo
└── server.js                     # Server chính (đã tích hợp)
```

---

## 🚀 Cách chạy

### Bước 1: Khởi động server backend

```bash
cd backend
npm start
# hoặc
npm run dev
```

Server sẽ chạy tại: `http://localhost:3001`

### Bước 2: Chạy bot tấn công

Mở **terminal mới**, chuyển đến thư mục backend:

```bash
cd backend
```

#### 🤖 Kịch bản 1: Bot săn voucher

**Phương pháp 1: Tấn công trực tiếp API** (Khuyến nghị)
```bash
node attacks/bot-voucher-hunter.js 1
```

**Phương pháp 2: Tấn công qua UI với Puppeteer**
```bash
node attacks/bot-voucher-hunter.js 2
```
⚠️ *Yêu cầu frontend React đang chạy ở `http://localhost:3000`*

**Phương pháp 3: Tấn công song song (Parallel)**
```bash
node attacks/bot-voucher-hunter.js 3
```

#### ⚡ Kịch bản 2: Bot DDoS / Auto-click

**Phương pháp 1: Tấn công tuần tự**
```bash
node attacks/bot-dos-attack.js 1
```

**Phương pháp 2: Tấn công song song (DDoS)** ⚠️ NGUY HIỂM!
```bash
node attacks/bot-dos-attack.js 2
```

**Phương pháp 3: Tấn công theo batch**
```bash
node attacks/bot-dos-attack.js 3
```

**Phương pháp 4: Slow Loris Attack**
```bash
node attacks/bot-dos-attack.js 4
```

---

## 🛡️ Cơ chế phòng thủ

### 1. Time Measurement (Đo thời gian)

Hệ thống đo thời gian từ khi user vào trang đến khi thực hiện hành động:

- **Người thật**: Mất ít nhất 1-3 giây để đọc và click
- **Bot**: Click ngay lập tức (< 1 giây) → **BỊ CHẶN**

### 2. Rate Limiting

- Giới hạn: **20 requests/phút** cho mỗi IP
- Bot gửi 100 requests/giây → **BỊ CHẶN**

### 3. Pattern Detection

Phát hiện hành vi quá đều đặn:

- **Người thật**: Timing không đồng nhất (2s, 3.5s, 1.8s, 4.2s...)
- **Bot**: Timing quá đều (2s, 2s, 2s, 2s...) → **BỊ CHẶN**

Sử dụng **độ lệch chuẩn (Standard Deviation)** để phát hiện.

### 4. Blacklist tự động

IP bị phát hiện là bot sẽ bị block trong **5 phút**, sau đó tự động unblock.

---

## 📊 Kịch bản Demo chi tiết

### 🎯 Kịch bản 1: Bot săn voucher Chatbot

#### Mục tiêu tấn công:
Bot tự động lấy voucher từ chatbot 100 lần trong vài giây.

#### Endpoint bị tấn công:
```
POST http://localhost:3001/api/demo-attack/chat
Body: { "message": "LẤY VOUCHER" }
```

#### Cơ chế hoạt động của Bot:

```javascript
// Bot gửi requests liên tục
for (let i = 1; i <= 100; i++) {
  axios.post('/api/demo-attack/chat', { message: 'LẤY VOUCHER' });
  await sleep(100ms);  // Delay rất nhỏ - không giống người
}
```

#### Phòng thủ phát hiện:

1. ✅ **Request đầu tiên**: Bot click quá nhanh (< 1s) → Middleware phát hiện
2. ✅ **Requests tiếp theo**: Quá nhiều requests/phút (> 20) → Rate limit
3. ✅ **Pattern**: Timing quá đều → Pattern detection
4. 🚫 **Kết quả**: Bot bị chặn sau 3-5 requests

#### Log mong đợi:

```
✅ [HUMAN VERIFIED] IP ::1 - Time: 1500ms, Requests: 1/min
✅ [HUMAN VERIFIED] IP ::1 - Time: 2300ms, Requests: 2/min
⚠️ [BOT DETECTED] IP ::1 - Hành động quá nhanh: 150ms
🚫 [BOT BLOCKED] IP ::1 đã bị thêm vào blacklist
```

---

### ⚡ Kịch bản 2: Bot tấn công DDoS / Auto-click

#### Mục tiêu tấn công:
Bot gửi 1,000 requests đồng thời để làm sập server.

#### Endpoint bị tấn công:
```
POST http://localhost:3001/api/demo-attack/add-to-cart
Body: { "productId": 1, "quantity": 1 }
```

#### Cơ chế hoạt động của Bot:

```javascript
// Tạo 1000 promises và gửi đồng thời
const promises = [];
for (let i = 1; i <= 1000; i++) {
  promises.push(axios.post('/api/demo-attack/add-to-cart', {...}));
}
await Promise.all(promises);  // BOOM! 💥
```

#### Phòng thủ phát hiện:

1. ✅ **Rate Limiting**: 20 requests đầu thành công
2. 🚫 **Requests 21+**: Bị chặn do vượt quá giới hạn
3. 🚫 **IP Blacklist**: IP bị block hoàn toàn
4. ⚠️ **Server**: Vẫn hoạt động bình thường (không sập)

#### Thống kê mong đợi:

```
📊 THỐNG KÊ TẤN CÔNG
============================================================
⏱️  Thời gian: 2.35 giây
📤 Tổng requests gửi: 1000
⚡ Requests/giây: 425.53
✅ Thành công: 18 (1.8%)
❌ Thất bại: 12
🚫 Bị chặn: 970

✅ HỆ THỐNG PHÒNG THỦ HOẠT ĐỘNG - BOT ĐÃ BỊ PHÁT HIỆN!
============================================================
```

---

## 🧪 Testing & Verification

### Test 1: Kiểm tra hệ thống phòng thủ hoạt động

```bash
# Terminal 1: Chạy server
npm start

# Terminal 2: Chạy bot tấn công
node attacks/bot-voucher-hunter.js 1

# Kết quả mong đợi: Bot bị chặn sau 3-5 requests
```

### Test 2: Kiểm tra rate limiting

```bash
node attacks/bot-dos-attack.js 3

# Kết quả mong đợi: 
# - Batch 1 (50 requests): ~18 thành công, ~32 bị chặn
# - Batch 2+: Tất cả bị chặn (IP đã blacklist)
```

### Test 3: Thống kê vouchers

```bash
# Kiểm tra số voucher còn lại
curl http://localhost:3001/api/demo-attack/voucher-stats

# Reset vouchers (sau khi test)
curl -X POST http://localhost:3001/api/demo-attack/reset-vouchers
```

---

## 🔧 Cấu hình

Bạn có thể điều chỉnh tham số trong các file:

### `backend/middleware/botDetection.js`

```javascript
const CONFIG = {
  MIN_TIME_HUMAN: 1000,        // Thời gian tối thiểu (ms)
  MAX_REQUESTS_PER_MINUTE: 20, // Rate limit
  PATTERN_THRESHOLD: 5,        // Số requests để phát hiện pattern
  TIMING_TOLERANCE: 100,       // Sai số cho phép (ms)
  BLACKLIST_DURATION: 300000   // Thời gian block (5 phút)
};
```

### `backend/attacks/bot-voucher-hunter.js`

```javascript
const CONFIG = {
  TARGET_URL: 'http://localhost:3000',
  BACKEND_API: 'http://localhost:3001/api/demo-attack/chat',
  NUMBER_OF_ATTACKS: 50,       // Số lần tấn công
  DELAY_BETWEEN_ATTACKS: 100   // Delay (ms)
};
```

### `backend/attacks/bot-dos-attack.js`

```javascript
const CONFIG = {
  TARGET_API: 'http://localhost:3001/api/demo-attack/add-to-cart',
  NUMBER_OF_REQUESTS: 1000,    // Số requests
  PARALLEL: true,              // Gửi đồng thời?
  DELAY_BETWEEN_REQUESTS: 10   // Delay (ms)
};
```

---

## 📈 API Endpoints

### 1. Chatbot lấy voucher

```http
POST /api/demo-attack/chat
Content-Type: application/json

{
  "message": "LẤY VOUCHER"
}
```

**Response thành công:**
```json
{
  "success": true,
  "message": "🎉 Chúc mừng! Bạn nhận được voucher giảm 30%",
  "voucher": {
    "code": "VOUCHER001",
    "discount": 30
  },
  "remainingVouchers": 99
}
```

**Response bị chặn:**
```json
{
  "success": false,
  "error": "Bot detected: Action too fast",
  "timeSincePageLoad": 150,
  "reason": "Thời gian phản ứng nhanh hơn con người"
}
```

### 2. Thêm vào giỏ hàng

```http
POST /api/demo-attack/add-to-cart
Content-Type: application/json

{
  "productId": 1,
  "quantity": 1
}
```

**Response thành công:**
```json
{
  "success": true,
  "message": "Đã thêm sản phẩm vào giỏ hàng",
  "productId": 1,
  "quantity": 1
}
```

### 3. Thống kê vouchers

```http
GET /api/demo-attack/voucher-stats
```

**Response:**
```json
{
  "total": 100,
  "used": 23,
  "remaining": 77
}
```

### 4. Reset vouchers

```http
POST /api/demo-attack/reset-vouchers
```

---

## 🎓 Giải thích kỹ thuật

### 1. Time-based Detection

```javascript
const timeSincePageLoad = now - tracking.pageLoadTime;
if (timeSincePageLoad < MIN_TIME_HUMAN) {
  // Bot! Con người không thể nhanh đến vậy
  blockBot(clientIP);
}
```

### 2. Rate Limiting

```javascript
tracking.requestTimes.push(now);
tracking.requestTimes = tracking.requestTimes.filter(
  time => now - time < 60000  // Chỉ giữ requests trong 1 phút
);

if (tracking.requestTimes.length > MAX_REQUESTS_PER_MINUTE) {
  blockBot(clientIP);
}
```

### 3. Pattern Detection (Standard Deviation)

```javascript
function checkConsistentPattern(timings) {
  // Tính độ lệch chuẩn
  const mean = timings.reduce((a, b) => a + b) / timings.length;
  const variance = timings.reduce((sum, val) => 
    sum + Math.pow(val - mean, 2), 0) / timings.length;
  const stdDev = Math.sqrt(variance);
  
  // Nếu stdDev < 100ms → quá đều → bot
  return stdDev < TIMING_TOLERANCE;
}
```

---

## 🎯 Kết luận

### Điều bạn đã học:

1. ✅ **Cách bot hoạt động**: Tự động hóa với Puppeteer và Axios
2. ✅ **Cách phát hiện bot**: Time measurement, Rate limiting, Pattern detection
3. ✅ **Cách phòng thủ**: Middleware, Blacklist, Standard Deviation

### Lưu ý quan trọng:

- ⚠️ Chỉ sử dụng trên **localhost** để học tập
- ⚠️ **KHÔNG** tấn công website thật (vi phạm pháp luật)
- ⚠️ Trong production, cần thêm **CAPTCHA**, **Token-based auth**, **CDN firewall**

---

## 🐛 Troubleshooting

### Lỗi: "Cannot find module 'puppeteer'"

```bash
cd backend
npm install puppeteer
```

### Lỗi: "ECONNREFUSED"

→ Server backend chưa chạy. Khởi động:
```bash
npm start
```

### Lỗi: "ChatGPT selector not found"

→ Điều chỉnh selector trong `bot-voucher-hunter.js` (phương pháp 2) theo UI của bạn.

---

## 📞 Support

Nếu có lỗi, kiểm tra:

1. ✅ Server đang chạy: `http://localhost:3001`
2. ✅ Dependencies đã cài: `puppeteer`, `axios`, `express-rate-limit`
3. ✅ Port không bị conflict
4. ✅ Log trong console

---

**🎉 Chúc bạn demo thành công!**
