# 🚀 HƯỚNG DẪN CHẠY BOT TẤN CÔNG

## 📌 CÓ 2 CÁCH:

---

## ⚡ CÁCH 1: Console Attack (Đơn giản - F12)

### Bước 1: Mở website
```
http://localhost:3000
```

### Bước 2: Nhấn F12 → Tab Console

### Bước 3: Copy script từ file
```
CONSOLE-ATTACK-SCRIPTS.md
```

### Bước 4: Paste vào Console → Enter

### Bước 5: Xem kết quả
- Console: logs màu xanh/đỏ
- Tab mới: `http://localhost:3000/security-monitor`

---

## 🎮 CÁCH 2: Bot Panel V2 (Chi tiết - GUI)

### Bước 1: Mở file
```
Double-click: backend/attacks/bot-attack-panel-v2.html
```

### Bước 2: Cấu hình (hoặc để mặc định)
- Attack Type: DoS Attack
- Total Requests: 100
- Delay: 50ms
- Email: user@example.com
- Password: password123

### Bước 3: Click nút
```
🚀 LAUNCH ATTACK
```

### Bước 4: Xem logs
- **Tab này**: Logs chi tiết từng bước bot xâm nhập
  - Phase 1: Login (kết nối port 5000)
  - Phase 2: Scan endpoints
  - Phase 3: Attack execution
  - Request #1-5: ✅ Success
  - Request #6+: 🚫 Blocked

- **Tab mới**: `http://localhost:3000/security-monitor`
  - IP bị chặn
  - Thống kê tấn công
  - Logs real-time

---

## 🎯 KẾT QUẢ MONG ĐỢI:

### ✅ Request 1-5: SUCCESS (màu xanh)
- Server chưa phát hiện bot
- Response 200 OK

### 🚫 Request 6+: BLOCKED (màu đỏ)
- Bot detection kích hoạt
- IP bị blacklist
- Response 403 Forbidden

### 📊 Security Monitor hiển thị:
- Total Attacks: 100
- Blocked IPs: 1
- Logs: Request từ IP nào, bị chặn lúc nào

---

## 💡 KHUYẾN NGHỊ CHO DEMO:

### Demo cho thầy dùng **CÁCH 2** vì:
- ✅ Có GUI đẹp, chuyên nghiệp
- ✅ Logs chi tiết: bot đăng nhập → kết nối port → attack → bị chặn
- ✅ Thống kê real-time: Success/Blocked/Errors
- ✅ Rõ ràng từng bước bot xâm nhập

### Demo nhanh dùng **CÁCH 1** vì:
- ✅ Chỉ cần F12 → Paste → Enter
- ✅ Nhanh 30 giây
- ✅ Thấy ngay kết quả trong Console

---

## 🛡️ LƯU Ý:

- ⚠️ Chỉ chạy trên **localhost** (không phải production)
- ⚠️ Mở **2 tab**: Bot Panel + Security Monitor
- ⚠️ Nếu bị chặn hết, đợi 5 phút hoặc restart backend

---

## 📺 DEMO CHO THẦY (5 PHÚT):

1. Mở `bot-attack-panel-v2.html`
2. Mở tab mới: `security-monitor`
3. Click "Launch Attack"
4. Thầy thấy:
   - Bot Panel: Logs chi tiết bot login → attack → blocked
   - Security Monitor: IP bị chặn, thống kê tăng
5. Done! ✅
