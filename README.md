# 👟 HỆ THỐNG WEBSITE BÁN GIÀY - LILLYSHOES

**Thành viên nhóm:**
- Phạm Thị Thùy Linh - 22810310291
- Võ Thị Kim Liên - 22810310261
- Nguyễn Thị Hoài Sương - 22810310254

---

## 📖 1. Giới thiệu

Website thương mại điện tử **LillyShoes** là một nền tảng bán giày trực tuyến chuyên nghiệp với đầy đủ tính năng:

### 🎯 **Mục tiêu dự án:**
- Xây dựng hệ thống e-commerce hoàn chỉnh cho việc mua bán giày online
- Cung cấp trải nghiệm mua sắm mượt mà cho khách hàng
- Hệ thống quản trị mạnh mẽ cho Admin
- **Bảo mật nâng cao:** Tích hợp hệ thống phát hiện và chặn bot tự động

### ✨ **Tính năng chính:**

#### **Dành cho Khách hàng:**
- 🛍️ Xem danh sách sản phẩm với bộ lọc đa dạng (danh mục, giá, size, màu sắc)
- 🔍 Tìm kiếm sản phẩm thông minh
- 🛒 Giỏ hàng với tính năng cập nhật số lượng, xóa sản phẩm
- 💳 Thanh toán qua VNPay hoặc COD
- 🎟️ Sưu tập và sử dụng mã giảm giá (voucher)
- 👤 Quản lý thông tin cá nhân, địa chỉ giao hàng
- 📦 Theo dõi đơn hàng, lịch sử mua hàng
- ⭐ Đánh giá sản phẩm với hình ảnh

#### **Dành cho Admin:**
- 📊 Dashboard tổng quan doanh thu, đơn hàng, sản phẩm bán chạy
- 📦 Quản lý sản phẩm: thêm, sửa, xóa với nhiều variant (size, màu)
- 🏷️ Quản lý danh mục sản phẩm
- 📋 Quản lý đơn hàng: xem, cập nhật trạng thái, xuất PDF
- 👥 Quản lý người dùng: xem danh sách, phân quyền, khóa tài khoản
- 🎫 Quản lý voucher: tạo mã giảm giá, theo dõi sử dụng
- 💰 Quản lý phương thức thanh toán
- 🛡️ **Security Dashboard:** Giám sát tấn công bot real-time (Cloudflare-style)

### 🔒 **Hệ thống bảo mật:**

#### **1. Bot Detection System (3 tầng phòng thủ):**
Dự án tích hợp hệ thống phát hiện và chặn bot tự động:

- **⏱️ Time-based Detection:** Phát hiện hành động quá nhanh (< 1 giây)
- **🚦 Rate Limit Detection:** Giới hạn số requests (> 20 requests/phút)
- **📊 Pattern Analysis:** Phân tích timing để phát hiện bot

**Tính năng:**
- Winston logging với file rotation (DailyRotateFile)
- Alert system: Email + Desktop notifications
- Admin dashboard real-time monitoring
- Bot control panel để demo các loại tấn công
- Tự động unblock IP sau 5 phút

#### **2. Anti-Clickjacking Protection:** 🆕
Middleware bảo vệ website khỏi tấn công clickjacking:

- **🛡️ X-Frame-Options:** Chặn website bị nhúng vào iframe
- **🔒 Content-Security-Policy:** Tiêu chuẩn hiện đại với `frame-ancestors 'none'`
- **🚫 X-Content-Type-Options:** Ngăn MIME type sniffing
- **⚡ X-XSS-Protection:** Kích hoạt XSS filter trên browser
- **🔐 Referrer-Policy:** Bảo vệ thông tin Referer header

**Demo:**
- Trang bị nhiễm mã độc clickjacking (`/infected-page`)
- Test page tương tác (`test-anti-clickjacking.html`)
- Component `InjectedClickjackAttack` mô phỏng tấn công
- Middleware tự động chặn iframe từ domains khác

### 🏗️ **Kiến trúc:**
Hệ thống sử dụng mô hình **Client-Server** với:
- **Frontend:** React.js với Redux Toolkit (SPA)
- **Backend:** Node.js + Express.js (RESTful API)
- **Database:** SQL Server với Sequelize ORM
- **Authentication:** JWT Token
- **Payment Gateway:** VNPay Integration

---

## 🛠️ 2. Công nghệ sử dụng

### **Backend Technologies:**

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **Node.js** | v18.0.0+ | JavaScript Runtime |
| **Express.js** | v5.1.0 | Web Framework |
| **Sequelize** | v6.37.7 | ORM (Object-Relational Mapping) |
| **SQL Server** | 2019+ | Database Management System |
| **JWT** | v9.0.2 | Authentication & Authorization |
| **Bcryptjs** | v3.0.2 | Password Hashing |
| **Nodemailer** | v7.0.10 | Email Service |
| **Multer** | v2.0.2 | File Upload (Images) |
| **Passport** | v0.7.0 | OAuth (Google, Facebook) |
| **Winston** | v3.18.3 | Logging System |
| **Puppeteer** | v24.30.0 | Bot Automation (Demo) |
| **Node-notifier** | v10.0.1 | Desktop Notifications |
| **Axios** | v1.12.2 | HTTP Client |

**Thư viện bổ sung:**
- `express-jwt`: JWT middleware cho Express
- `express-rate-limit`: Rate limiting
- `winston-daily-rotate-file`: Log rotation
- `joi`, `yup`: Data validation
- `dotenv`: Environment variables
- `cors`: Cross-Origin Resource Sharing
- `moment`, `date-fns`: Date manipulation

---

### **Frontend Technologies:**

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **React.js** | v18.3.1 | UI Library |
| **Redux Toolkit** | v2.9.2 | State Management |
| **React Router** | v6.30.1 | Client-side Routing |
| **React Bootstrap** | v2.10.10 | UI Components |
| **Material-UI** | v7.3.4 | Additional UI Components |
| **Axios** | v1.12.2 | API Client |
| **Formik** | v2.4.6 | Form Management |
| **Yup** | v1.7.1 | Form Validation |
| **React Icons** | v5.5.0 | Icon Library |
| **React Toastify** | v11.0.5 | Notifications |
| **Recharts** | v3.2.1 | Charts & Graphs |
| **jsPDF** | v3.0.3 | PDF Generation |

**Thư viện bổ sung:**
- `react-datepicker`: Date picker component
- `react-multi-carousel`: Carousel slider
- `react-paginate`: Pagination
- `react-slick`: Slider component
- `jwt-decode`: JWT token decoder
- `bootstrap`: CSS framework

---

### **Database:**
- **SQL Server 2019+** với các bảng:
  - Users, Addresses, Categories, Products
  - ProductVariants, ProductImages, Reviews
  - Carts, CartItems, Orders, OrderItems
  - Coupons, UsageLogs, PaymentMethods
  - Blogs, Wishlists, PasswordResetTokens

---

### **Payment Integration:**
- **VNPay Payment Gateway:**
  - Cổng thanh toán trực tuyến
  - Hỗ trợ thẻ nội địa và quốc tế
  - Xác thực an toàn với HMAC SHA256

---

### **Development Tools:**
- **Nodemon**: Auto-restart server
- **Sequelize CLI**: Database migrations & seeding
- **Git**: Version control
- **VS Code**: Code editor
- **Postman**: API testing

---

## 📁 3. Cấu trúc thư mục dự án

```
Webgiay/
├── backend/                          # Server-side code
│   ├── attacks/                      # Bot attack demo scripts
│   │   ├── bot-dos-attack.js         # DoS attack (4 methods)
│   │   ├── bot-voucher-hunter-NEW.js # Voucher hunter (3 methods)
│   │   ├── bot-control-panel-live.html   # Control panel với API
│   │   └── bot-control-panel.html    # Control panel tĩnh
│   ├── config/                       # Configuration files
│   │   ├── config.json               # Sequelize config
│   │   └── database.json             # DB connection config
│   ├── controllers/                  # Business logic handlers
│   │   ├── auth.controller.js        # Authentication (login, register)
│   │   ├── product.controller.js     # Product CRUD
│   │   ├── cart.controller.js        # Shopping cart
│   │   ├── order.controller.js       # Order management
│   │   ├── user.controller.js        # User management
│   │   ├── coupon.controller.js      # Voucher/coupon
│   │   ├── payment.controller.js     # VNPay integration
│   │   ├── dashboard.controller.js   # Admin dashboard stats
│   │   └── ... (20+ controllers)
│   ├── middleware/                   # Express middlewares
│   │   ├── auth.middleware.js        # JWT authentication
│   │   ├── checkAdmin.js             # Admin authorization
│   │   ├── botDetection.js           # Bot detection (3 layers)
│   │   └── authenticateTokenOptional.js
│   ├── models/                       # Sequelize models (ORM)
│   │   ├── index.js                  # Models loader
│   │   ├── user.js                   # User model
│   │   ├── product.js                # Product model
│   │   ├── order.js                  # Order model
│   │   └── ... (20+ models)
│   ├── routes/                       # API endpoints (RESTful)
│   │   ├── auth.route.js             # /api/auth/*
│   │   ├── product.route.js          # /api/products/*
│   │   ├── cart.route.js             # /api/cart/*
│   │   ├── order.route.js            # /api/orders/*
│   │   ├── admin/                    # Admin routes
│   │   │   ├── product.route.js      # /api/admin/products/*
│   │   │   ├── security.route.js     # /api/admin/security/*
│   │   │   └── ...
│   │   ├── bot-control.route.js      # /api/bot-control/*
│   │   └── ... (20+ route files)
│   ├── services/                     # Business logic services
│   │   ├── email.service.js          # Email sending
│   │   ├── payment.service.js        # VNPay processing
│   │   └── stats.service.js          # Statistics calculation
│   ├── utils/                        # Utility functions
│   │   ├── logger.js                 # Winston logging
│   │   ├── alertSystem.js            # Email + Desktop alerts
│   │   └── helpers.js                # Helper functions
│   ├── validators/                   # Input validation
│   │   ├── auth.validator.js         # Auth validation
│   │   └── product.validator.js      # Product validation
│   ├── migrations/                   # Database migrations
│   │   └── 20251017xxxxxx-*.js       # Migration files
│   ├── seeders/                      # Database seeders
│   │   └── 20251109xxxxxx-*.js       # Seeder files
│   ├── logs/                         # Log files (auto-generated)
│   │   ├── combined.log              # All logs
│   │   ├── error.log                 # Error logs
│   │   └── bot-attacks-YYYY-MM-DD.log # Bot attack logs
│   ├── uploads/                      # Uploaded files
│   │   ├── products/                 # Product images
│   │   ├── avatars/                  # User avatars
│   │   └── reviews/                  # Review images
│   ├── scripts/                      # Utility scripts
│   │   └── clear-blacklist.js        # Clear bot blacklist
│   ├── .env                          # Environment variables
│   └── server.js                     # Express server entry point
│
├── frontend/                         # Client-side code
│   ├── public/                       # Static files
│   │   ├── index.html                # HTML template
│   │   └── favicon.ico               # Favicon
│   ├── src/                          # React source code
│   │   ├── api/                      # API client functions
│   │   │   ├── api.js                # Axios instance
│   │   │   └── index.js              # API methods
│   │   ├── components/               # Reusable components
│   │   │   ├── layout/               # Layout components
│   │   │   │   ├── user/             # User layout
│   │   │   │   │   ├── Navbar.js     # User navbar
│   │   │   │   │   └── Footer.js     # User footer
│   │   │   │   └── admin/            # Admin layout
│   │   │   │       ├── Sidebar.js    # Admin sidebar
│   │   │   │       └── Header.js     # Admin header
│   │   │   ├── BotAttackMonitor.js   # Bot attack monitor
│   │   │   ├── SecurityDashboard.js  # Security dashboard
│   │   │   ├── ProductCard.js        # Product display card
│   │   │   ├── CartItem.js           # Cart item component
│   │   │   └── ... (30+ components)
│   │   ├── pages/                    # Page components
│   │   │   ├── user/                 # User pages
│   │   │   │   ├── Home.js           # Homepage
│   │   │   │   ├── Products.js       # Product listing
│   │   │   │   ├── ProductDetail.js  # Product detail
│   │   │   │   ├── Cart.js           # Shopping cart
│   │   │   │   ├── Checkout.js       # Checkout page
│   │   │   │   ├── Profile.js        # User profile
│   │   │   │   ├── Orders.js         # Order history
│   │   │   │   ├── Vouchers.js       # Voucher collection
│   │   │   │   └── ...
│   │   │   └── admin/                # Admin pages
│   │   │       ├── Dashboard.js      # Admin dashboard
│   │   │       ├── AdminProducts.js  # Product management
│   │   │       ├── AdminOrders.js    # Order management
│   │   │       ├── AdminUsers.js     # User management
│   │   │       ├── AdminCoupons.js   # Coupon management
│   │   │       └── ...
│   │   ├── redux/                    # Redux state management
│   │   │   ├── store.js              # Redux store
│   │   │   ├── userSlice.js          # User state
│   │   │   ├── cartSlice.js          # Cart state
│   │   │   ├── productSlice.js       # Product state
│   │   │   └── ...
│   │   ├── utils/                    # Utility functions
│   │   │   ├── urlUtils.js           # URL helpers
│   │   │   └── formatters.js         # Data formatters
│   │   ├── App.js                    # Main App component
│   │   ├── index.js                  # React entry point
│   │   └── App.css                   # Global styles
│   ├── package.json                  # Frontend dependencies
│   └── .env                          # Frontend env variables
│
├── uploads/                          # Shared uploads folder
├── imagesdemo/                       # Screenshots for README
├── node_modules/                     # Node.js dependencies
├── package.json                      # Root package.json
├── .gitignore                        # Git ignore file
│
└── Documentation/                    # Project documentation
    ├── README.md                     # Main documentation (this file)
    ├── HUONG-DAN-CHAY-DEMO.md        # Demo execution guide
    ├── HUONG-DAN-DEMO-CHO-THAY.md    # Teacher demo script
    ├── DEMO-CHECKLIST.md             # Demo checklist
    ├── HOW-BOT-WORKS.md              # Bot system explanation
    ├── HOW-TO-USE-BOT-CONTROL-PANEL.md # Control panel guide
    ├── DEFENSE-VS-ATTACK.md          # Defense vs Attack explanation
    └── QUICKSTART.md                 # Quick start guide
```

### 📝 **Giải thích các thư mục quan trọng:**

#### **Backend:**
- **`controllers/`**: Xử lý logic nghiệp vụ, nhận request từ routes, gọi services/models, trả về response
- **`models/`**: Định nghĩa schema database với Sequelize ORM
- **`routes/`**: Định nghĩa API endpoints (RESTful), kết nối với controllers
- **`middleware/`**: Các hàm trung gian (authentication, authorization, bot detection)
- **`services/`**: Logic phức tạp (gửi email, xử lý thanh toán, thống kê)
- **`attacks/`**: Scripts demo các loại tấn công bot (CHỈ để demo, không deploy production)
- **`utils/`**: Winston logger, alert system, helper functions
- **`logs/`**: Log files tự động tạo bởi Winston

#### **Frontend:**
- **`src/components/`**: Components tái sử dụng (navbar, footer, cards, modals)
- **`src/pages/`**: Từng trang của website (home, products, cart, admin dashboard)
- **`src/redux/`**: Quản lý state toàn cục với Redux Toolkit
- **`src/api/`**: Các hàm gọi API backend bằng Axios
- **`src/utils/`**: Helper functions, formatters

#### **Documentation:**
- Các file markdown hướng dẫn sử dụng, demo, giải thích hệ thống

---

## 🚀 4. Hướng dẫn cài đặt & chạy chương trình

### 📋 **Yêu cầu môi trường**

| Phần mềm | Phiên bản tối thiểu | Link tải |
|----------|---------------------|----------|
| **Node.js** | v18.0.0+ | https://nodejs.org/ |
| **npm** | v9.0.0+ | (đi kèm Node.js) |
| **SQL Server** | 2019+ | https://www.microsoft.com/sql-server |
| **SQL Server Management Studio (SSMS)** | 18.0+ | https://docs.microsoft.com/sql/ssms |
| **Git** | 2.0+ | https://git-scm.com/ |
| **VS Code** | Latest | https://code.visualstudio.com/ |

**Kiểm tra phiên bản đã cài:**
```powershell
node --version    # Kiểm tra Node.js
npm --version     # Kiểm tra npm
git --version     # Kiểm tra Git
```

---

### 📦 **Bước 1: Clone dự án**

```powershell
# Clone repository từ GitHub
git clone https://github.com/your-username/shoe-store.git

# Di chuyển vào thư mục dự án
cd shoe-store
```

---

### 🗄️ **Bước 2: Cài đặt Database**

#### **Option 1: Import file SQL (Khuyến nghị)**

1. **Tạo Database trong SSMS:**
   ```sql
   CREATE DATABASE ShoeStoreDB911;
   GO
   USE ShoeStoreDB911;
   GO
   ```

2. **Import file SQL:**
   - Mở file `.sql` bạn được cung cấp (ví dụ: `ShoeStoreDB_Full.sql`)
   - Copy toàn bộ nội dung
   - Paste vào SSMS Query Window
   - Đảm bảo đang chọn database `ShoeStoreDB911`
   - Nhấn **Execute (F5)** để chạy

3. **Kiểm tra:**
   ```sql
   -- Kiểm tra các bảng đã tạo
   SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;
   
   -- Kiểm tra dữ liệu mẫu
   SELECT COUNT(*) FROM Users;
   SELECT COUNT(*) FROM Products;
   SELECT COUNT(*) FROM Coupons;
   ```

#### **Option 2: Sử dụng Sequelize Migrations**

```powershell
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Chạy migrations để tạo bảng
npx sequelize-cli db:migrate

# Chạy seeders để tạo dữ liệu mẫu
npx sequelize-cli db:seed:all
```

**Lưu ý:** Cần cấu hình file `backend/config/database.json` trước khi chạy migrations.

---

### ⚙️ **Bước 3: Cấu hình Backend**

#### **3.1. Cấu hình Database Connection:**

Chỉnh sửa file `backend/config/database.json`:

```json
{
  "development": {
    "username": "sa",              // Thay bằng SQL username của bạn
    "password": "123456",          // Thay bằng SQL password của bạn
    "database": "ShoeStoreDB911",  // Tên database
    "host": "localhost",           // SQL Server host
    "dialect": "mssql",
    "dialectOptions": {
      "options": {
        "encrypt": false,
        "trustServerCertificate": true
      }
    },
    "pool": {
      "max": 10,
      "min": 0,
      "idleTimeoutMillis": 30000
    }
  }
}
```

#### **3.2. Tạo file `.env` trong thư mục `backend/`:**

```env
# ==================== DATABASE ====================
DB_USER=sa
DB_PASSWORD=123456
DB_HOST=localhost
DB_NAME=ShoeStoreDB911

# ==================== SERVER ====================
PORT=5000
BASE_URL=http://localhost:5000

# ==================== JWT ====================
JWT_SECRET=abc123xyz789longrandomstringhere

# ==================== GMAIL (cho gửi email) ====================
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_password_here
# Hướng dẫn tạo App Password:
# 1. Vào Gmail → Settings → Security
# 2. Enable 2-Step Verification
# 3. Generate App Password
# 4. Copy password vào GMAIL_PASS

# ==================== VNPAY ====================
VNPAY_RETURN_URL=http://localhost:3000/order-success
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret
# Đăng ký VNPay sandbox tại: https://sandbox.vnpayment.vn/

# ==================== OAUTH (Optional) ====================
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# ==================== ALERT SYSTEM ====================
ALERT_EMAIL_ENABLED=true
ALERT_EMAIL_TO=admin@shoestore.com
ALERT_DESKTOP_ENABLED=true
```

#### **3.3. Cài đặt dependencies Backend:**

```powershell
cd backend
npm install
```

Packages sẽ được cài đặt:
- express, sequelize, mssql, tedious
- jsonwebtoken, bcryptjs, passport
- nodemailer, multer, winston
- axios, cors, dotenv, joi, yup
- và nhiều packages khác...

---

### 🎨 **Bước 4: Cấu hình Frontend**

#### **4.1. Tạo file `.env` trong thư mục `frontend/` (Optional):**

```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

**Lưu ý:** Mặc định frontend đã cấu hình gọi API tại `http://localhost:5000`.

#### **4.2. Cài đặt dependencies Frontend:**

```powershell
# Mở terminal MỚI, di chuyển vào thư mục frontend
cd frontend
npm install
```

Packages sẽ được cài đặt:
- react, react-dom, react-router-dom
- redux, @reduxjs/toolkit, react-redux
- axios, bootstrap, react-bootstrap
- formik, yup, react-icons
- material-ui, recharts, jspdf
- và nhiều packages khác...

---

### 🏃 **Bước 5: Chạy ứng dụng**

#### **5.1. Khởi động Backend Server:**

```powershell
# Terminal 1: Backend
cd backend
npm start
```

**✅ Kiểm tra Backend đã chạy thành công:**
```
✅ Đã khởi tạo 100 vouchers
✅ Kết nối CSDL thành công bằng Sequelize.
🚀 Backend đang chạy tại http://localhost:5000
🛡️ Cloudflare-style Alert System initialized
```

Backend chạy tại: `http://localhost:5000`

#### **5.2. Khởi động Frontend:**

```powershell
# Terminal 2 (MỚI): Frontend
cd frontend
npm start
```

**✅ Kiểm tra Frontend đã chạy thành công:**
```
Compiled successfully!

You can now view shoe-store-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.x:3000
```

Frontend chạy tại: `http://localhost:3000`

Browser sẽ tự động mở trang `http://localhost:3000`

---

### ✅ **Bước 6: Kiểm tra hệ thống**

1. **Truy cập trang chủ:** `http://localhost:3000`
2. **Đăng ký tài khoản mới** hoặc **đăng nhập** bằng tài khoản demo (xem phần 5)
3. **Duyệt sản phẩm:** Click vào Categories, xem danh sách sản phẩm
4. **Thêm vào giỏ hàng:** Click "Thêm vào giỏ" trên sản phẩm
5. **Checkout:** Vào giỏ hàng → Thanh toán
6. **Admin Dashboard:** Login admin → Vào `/admin/dashboard`

---

### 🛠️ **Các lệnh hữu ích:**

```powershell
# Backend
npm start              # Chạy server (production)
npm run dev            # Chạy server với nodemon (auto-reload)
npm run migrate        # Chạy database migrations
npm run migrate:undo   # Hoàn tác migrations
npm run seed           # Chạy database seeders

# Frontend
npm start              # Chạy React app (development)
npm run build          # Build cho production
npm test               # Chạy tests

# Database
npx sequelize-cli db:migrate          # Chạy migrations
npx sequelize-cli db:migrate:undo     # Hoàn tác migration cuối
npx sequelize-cli db:migrate:undo:all # Hoàn tác tất cả migrations
npx sequelize-cli db:seed:all         # Chạy tất cả seeders
```

---

### ⚠️ **Xử lý lỗi thường gặp:**

#### **1. Lỗi kết nối Database:**
```
Error: Failed to connect to database
```
**Giải pháp:**
- Kiểm tra SQL Server đã chạy chưa
- Kiểm tra username/password trong `backend/config/database.json`
- Kiểm tra database `ShoeStoreDB911` đã tồn tại chưa
- Enable TCP/IP trong SQL Server Configuration Manager
- Firewall có block port 1433 không

#### **2. Lỗi `npm install` failed:**
```
npm ERR! code ENOENT
```
**Giải pháp:**
```powershell
# Xóa cache npm
npm cache clean --force

# Xóa node_modules và package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Cài lại
npm install
```

#### **3. Port 3000 hoặc 5000 đã được sử dụng:**
```
Error: Port 5000 is already in use
```
**Giải pháp:**
```powershell
# Tìm process đang dùng port
netstat -ano | findstr :5000

# Kill process (thay PID bằng số từ lệnh trên)
taskkill /PID <PID> /F

# Hoặc đổi port trong file .env
PORT=5001
```

#### **4. Lỗi CORS:**
```
Access to XMLHttpRequest blocked by CORS policy
```
**Giải pháp:**
- Kiểm tra Backend đã chạy chưa (port 5000)
- Kiểm tra CORS config trong `backend/server.js`
- Đảm bảo `allowedOrigins` có `http://localhost:3000`

---

### 🎓 **Demo Bot Detection System (Optional):**

Để demo hệ thống phát hiện bot:

```powershell
# Chạy bot attack scripts
cd backend
node attacks/bot-dos-attack.js 1      # Sequential attack
node attacks/bot-dos-attack.js 2      # Parallel attack
node attacks/bot-dos-attack.js 3      # Batch attack
node attacks/bot-voucher-hunter-NEW.js 2  # Voucher hunter

# Mở Control Panel
# Double-click file: backend/attacks/bot-control-panel-live.html

# Xem Security Dashboard
# Login admin → http://localhost:3000/security-dashboard
```

**Lưu ý:** Sau khi test bot, restart backend để clear blacklist:
```powershell
Ctrl+C     # Dừng backend
npm start  # Chạy lại
```

Chi tiết xem file `HUONG-DAN-CHAY-DEMO.md`

---

## 👥 5. Tài khoản Demo

### 🔐 **Danh sách tài khoản test:**

| Vai trò | Email | Username | Password | Quyền truy cập |
|---------|-------|----------|----------|----------------|
| **👨‍💼 Admin** | admin@example.com | admin | Linh2308@ | Toàn quyền quản lý hệ thống |
| **👤 User (Khách hàng)** | user1@example.com | user1 | User123456 | Mua hàng, đánh giá, quản lý đơn |

---

### 🎯 **Chi tiết phân quyền:**

#### **1. Tài khoản Admin (`admin@example.com` / `Linh2308@`)**

**Quyền hạn:**
- ✅ **Dashboard Quản trị:** Xem thống kê doanh thu, đơn hàng, khách hàng, sản phẩm
- ✅ **Quản lý Sản phẩm:** CRUD sản phẩm, biến thể, hình ảnh
- ✅ **Quản lý Danh mục:** Thêm/sửa/xóa categories
- ✅ **Quản lý Đơn hàng:** Xem tất cả đơn, cập nhật trạng thái (Pending → Processing → Shipped → Delivered)
- ✅ **Quản lý Khách hàng:** Xem danh sách users, kích hoạt/vô hiệu hóa tài khoản
- ✅ **Quản lý Mã giảm giá:** Tạo/sửa/xóa coupons, xem usage logs
- ✅ **Quản lý Blog:** Viết/sửa/xóa bài viết
- ✅ **Quản lý Review:** Duyệt/xóa đánh giá từ khách hàng
- ✅ **Security Dashboard:** Xem logs bot attack, blacklist IPs, analytics
- ✅ **Quản lý Thanh toán & Vận chuyển:** Cấu hình payment methods, shipping providers

**Truy cập:**
```
1. Mở http://localhost:3000
2. Click "Đăng nhập" (góc phải header)
3. Nhập Email: admin@example.com
4. Nhập Password: Linh2308@
5. Sau khi login, click vào "Admin Dashboard" trong menu
```

**Trang admin chính:** `http://localhost:3000/admin/dashboard`

---

#### **2. Tài khoản User (Khách hàng) (`user1@example.com` / `User123456`)**

**Quyền hạn:**
- ✅ **Duyệt sản phẩm:** Xem danh sách, chi tiết sản phẩm, tìm kiếm, lọc
- ✅ **Giỏ hàng:** Thêm/xóa/cập nhật số lượng sản phẩm
- ✅ **Wishlist:** Lưu sản phẩm yêu thích
- ✅ **Đặt hàng:** Checkout, nhập địa chỉ, chọn phương thức thanh toán/vận chuyển
- ✅ **Áp dụng Coupon:** Nhập mã giảm giá khi thanh toán
- ✅ **Quản lý Đơn hàng:** Xem lịch sử đơn hàng của mình, theo dõi trạng thái
- ✅ **Đánh giá Sản phẩm:** Viết review, upload hình ảnh/video sau khi nhận hàng
- ✅ **Quản lý Hồ sơ:** Cập nhật thông tin cá nhân, đổi mật khẩu
- ✅ **Quản lý Địa chỉ:** Thêm/sửa/xóa địa chỉ giao hàng
- ✅ **Đọc Blog:** Xem bài viết về sản phẩm, tin tức

**Truy cập:**
```
1. Mở http://localhost:3000
2. Click "Đăng nhập"
3. Nhập Email: user1@example.com
4. Nhập Password: User123456
5. Browse sản phẩm, thêm vào giỏ, checkout
```

**Trang chính:** `http://localhost:3000` (trang khách hàng)

---

### ➕ **Tạo tài khoản mới:**

#### **Đăng ký tài khoản Khách hàng:**

1. Truy cập `http://localhost:3000/signup`
2. Điền form:
   - Username
   - Email
   - Password (tối thiểu 8 ký tự, có chữ hoa, số, ký tự đặc biệt)
   - Confirm Password
3. Click "Đăng ký"
4. Hệ thống sẽ gửi email xác nhận (nếu đã cấu hình GMAIL_USER)
5. Login với tài khoản vừa tạo

#### **Tạo tài khoản Admin:**

**Option 1: Qua Database (SSMS)**
```sql
USE ShoeStoreDB911;

-- Insert admin user
INSERT INTO Users (username, email, password, isAdmin, createdAt, updatedAt)
VALUES (
    'newadmin',
    'newadmin@example.com',
    -- Password: 'Admin123456' đã hash bcrypt
    '$2a$10$...[hash bcrypt của password]',
    1,  -- isAdmin = 1 (true)
    GETDATE(),
    GETDATE()
);
```

**Option 2: Upgrade user hiện tại thành Admin**
```sql
-- Tìm user cần upgrade
SELECT id, username, email, isAdmin FROM Users WHERE email = 'user1@example.com';

-- Set isAdmin = 1
UPDATE Users SET isAdmin = 1 WHERE email = 'user1@example.com';
```

**Lưu ý:** Mật khẩu được mã hóa bằng bcrypt. Để tạo hash từ plaintext, sử dụng tool online hoặc Node.js:
```javascript
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('YourPassword', 10);
console.log(hash); // Copy hash này vào SQL
```

---

### 🔒 **Lưu ý bảo mật:**

- ⚠️ **Đây là tài khoản DEMO**, không sử dụng cho production
- ⚠️ Đổi password ngay sau khi triển khai lên môi trường thật
- ⚠️ Không chia sẻ tài khoản admin với người không rõ nguồn gốc
- ⚠️ JWT_SECRET trong `.env` phải là chuỗi random mạnh (dùng tool như `uuidgen` hoặc `openssl rand`)

---

### 📝 **Test Scenarios với tài khoản Demo:**

#### **Khách hàng (user1@example.com):**
1. ✅ Duyệt sản phẩm theo category "Giày Thể Thao", "Giày Tây"
2. ✅ Tìm kiếm sản phẩm "Nike", "Adidas"
3. ✅ Thêm 3 sản phẩm vào giỏ hàng
4. ✅ Áp dụng mã giảm giá `WELCOME10` hoặc `FREESHIP50`
5. ✅ Checkout với địa chỉ mới
6. ✅ Thanh toán qua VNPay (sandbox)
7. ✅ Xem lịch sử đơn hàng
8. ✅ Đánh giá sản phẩm đã mua (rating 5*, comment + upload ảnh)

#### **Admin (admin@example.com):**
1. ✅ Xem Dashboard: Doanh thu, tổng đơn hàng, khách hàng mới
2. ✅ Thêm sản phẩm mới với variants (size 38, 39, 40, 41, 42)
3. ✅ Tạo coupon giảm 20% cho đơn từ 500k
4. ✅ Cập nhật trạng thái đơn hàng: Pending → Processing → Shipped
5. ✅ Xem Security Dashboard: Kiểm tra bot attack logs
6. ✅ Chạy bot attack script → Xem IP bị blacklist
7. ✅ Viết blog mới về sản phẩm
8. ✅ Duyệt review từ khách hàng

---

## 📸 6. Hình ảnh minh họa

> **Lưu ý:** Các hình ảnh demo được lưu trong thư mục `./imagesdemo/`. Nếu thư mục chưa tồn tại, vui lòng tạo thư mục và thêm screenshots vào theo đúng tên file dưới đây.

### ✅ **Danh sách hình ảnh cần có:**

| Tên file | Mô tả | Kích thước khuyến nghị |
|----------|-------|------------------------|
| `trangchuUser.jpeg` | Trang chủ User | 1920x1080 |
| `trangsanpham.jpeg` | Trang danh sách sản phẩm | 1920x1080 |
| `trangchitiet.jpeg` | Trang chi tiết sản phẩm | 1920x1080 |
| `tranggiohang.jpeg` | Trang giỏ hàng | 1920x1080 |
| `trangthanhtoan.jpeg` | Trang thanh toán | 1920x1080 |
| `trangprofileorder.jpeg` | Profile - Quản lý đơn hàng | 1920x1080 |
| `trangprofilevoucher.jpeg` | Profile - Ví voucher | 1920x1080 |
| `trangchuAdmin.jpeg` | Admin Dashboard | 1920x1080 |
| `quanlydanhmuc.jpeg` | Admin - Quản lý danh mục | 1920x1080 |
| `quanlydonhang.jpeg` | Admin - Quản lý đơn hàng | 1920x1080 |
| `quanlykhyenmai.jpeg` | Admin - Quản lý voucher | 1920x1080 |
| `quanlynguoidung.jpeg` | Admin - Quản lý người dùng | 1920x1080 |
| `quanlyphuongthuctt.jpeg` | Admin - Phương thức thanh toán | 1920x1080 |
| `quanlysanpham.jpeg` | Admin - Quản lý sản phẩm | 1920x1080 |

**Cách chụp screenshots:**
```
1. Chạy ứng dụng (Frontend: localhost:3000, Backend: localhost:5000)
2. Sử dụng Snipping Tool (Windows) hoặc Screenshot (Mac)
3. Mỗi ảnh nên chụp full screen để thấy rõ giao diện
4. Lưu vào thư mục ./imagesdemo/ với đúng tên file
5. Format: JPEG hoặc PNG (khuyến nghị JPEG để giảm dung lượng)
```

---

### 📷 **Preview hình ảnh:**

#### **Chức năng User (Khách hàng)**

**1. Trang chủ User**
![Trang chủ User](./imagesdemo/trangchuUser.jpeg)
*Hiển thị: Header với menu, banner chính, sản phẩm nổi bật, categories*

**2. Trang Sản phẩm (Danh sách)**
![Trang Sản phẩm](./imagesdemo/trangsanpham.jpeg)
*Hiển thị: Sidebar filter (giá, size, màu), danh sách sản phẩm dạng grid, pagination*

**3. Trang Chi tiết Sản phẩm**
![Trang Chi tiết Sản phẩm](./imagesdemo/trangchitiet.jpeg)
*Hiển thị: Hình ảnh sản phẩm lớn, thông tin chi tiết, chọn size/màu, nút "Thêm vào giỏ", reviews*

**4. Trang Giỏ hàng**
![Trang Giỏ hàng](./imagesdemo/tranggiohang.jpeg)
*Hiển thị: Danh sách sản phẩm trong giỏ, cập nhật số lượng, tổng tiền, nút "Thanh toán"*

**5. Trang Thanh toán**
![Trang Thanh toán](./imagesdemo/trangthanhtoan.jpeg)
*Hiển thị: Form nhập địa chỉ, chọn phương thức thanh toán/vận chuyển, áp dụng voucher*

**6. Trang Profile (Đơn hàng)**
![Trang Profile Đơn hàng](./imagesdemo/trangprofileorder.jpeg)
*Hiển thị: Lịch sử đơn hàng, trạng thái đơn (Pending/Processing/Shipped/Delivered)*

**7. Trang Profile (Ví Voucher)**
![Trang Profile Ví Voucher](./imagesdemo/trangprofilevoucher.jpeg)
*Hiển thị: Danh sách voucher khả dụng, voucher đã dùng, nút "Sưu tập voucher mới"*

---

#### **Chức năng Admin (Quản trị)**

**8. Trang chủ Admin (Dashboard)**
![Trang chủ Admin](./imagesdemo/trangchuAdmin.jpeg)
*Hiển thị: Cards thống kê (doanh thu, đơn hàng, khách hàng), biểu đồ doanh thu, top sản phẩm*

**9. Quản lý Danh mục**
![Quản lý Danh mục](./imagesdemo/quanlydanhmuc.jpeg)
*Hiển thị: Bảng danh sách categories, nút thêm/sửa/xóa*

**10. Quản lý Đơn hàng**
![Quản lý Đơn hàng](./imagesdemo/quanlydonhang.jpeg)
*Hiển thị: Bảng đơn hàng, filter theo trạng thái, nút cập nhật trạng thái, xuất PDF*

**11. Quản lý Khuyến mãi (Voucher)**
![Quản lý Khuyến mãi](./imagesdemo/quanlykhyenmai.jpeg)
*Hiển thị: Danh sách vouchers, điều kiện (min order, discount %), expiry date*

**12. Quản lý Người dùng**
![Quản lý Người dùng](./imagesdemo/quanlynguoidung.jpeg)
*Hiển thị: Bảng users, role (Admin/User), trạng thái (Active/Disabled), nút kích hoạt/vô hiệu hóa*

**13. Quản lý Phương thức Thanh toán**
![Quản lý Phương thức Thanh toán](./imagesdemo/quanlyphuongthuctt.jpeg)
*Hiển thị: Danh sách payment methods (VNPay, COD), trạng thái enabled/disabled*

**14. Quản lý Sản phẩm**
![Quản lý Sản phẩm](./imagesdemo/quanlysanpham.jpeg)
*Hiển thị: Bảng sản phẩm với hình ảnh thumbnail, giá, stock, nút thêm/sửa/xóa*

---

## 🎥 7. Video Demo

### 📹 **Video hướng dẫn và demo đầy đủ:**

🔗 **Link video:** [Nhấn vào đây để xem Video Demo](https://youtu.be/YOUR_VIDEO_ID)  
*(Hoặc: [Google Drive Link](https://drive.google.com/file/d/YOUR_FILE_ID))*

---

### 📝 **Nội dung video:**

Video demo bao gồm các phần chính sau:

#### **Phần 1: Giới thiệu dự án (00:00 - 01:30)**
- ✅ Tổng quan về website LillyShoes
- ✅ Giới thiệu công nghệ sử dụng (React, Node.js, SQL Server)
- ✅ Kiến trúc hệ thống (Frontend - Backend - Database)

#### **Phần 2: Demo chức năng Khách hàng (01:30 - 08:00)**
- ✅ **Đăng ký/Đăng nhập** (01:30 - 02:15)
  - Tạo tài khoản mới
  - Login với email/username
- ✅ **Duyệt sản phẩm** (02:15 - 03:30)
  - Xem trang chủ
  - Browse categories (Giày Thể Thao, Giày Tây, Giày Sandal)
  - Tìm kiếm sản phẩm
  - Lọc theo giá, size, màu sắc
- ✅ **Chi tiết sản phẩm** (03:30 - 04:15)
  - Xem hình ảnh, mô tả sản phẩm
  - Chọn size, màu sắc
  - Đọc review từ khách hàng khác
- ✅ **Giỏ hàng & Checkout** (04:15 - 06:00)
  - Thêm sản phẩm vào giỏ
  - Cập nhật số lượng
  - Áp dụng mã giảm giá (Voucher)
  - Nhập địa chỉ giao hàng
  - Chọn phương thức thanh toán (VNPay / COD)
  - Chọn đơn vị vận chuyển
- ✅ **Quản lý Profile** (06:00 - 07:00)
  - Xem lịch sử đơn hàng
  - Quản lý địa chỉ
  - Ví voucher
  - Wishlist (Danh sách yêu thích)
- ✅ **Đánh giá sản phẩm** (07:00 - 08:00)
  - Viết review với rating 5*
  - Upload hình ảnh sản phẩm

#### **Phần 3: Demo chức năng Admin (08:00 - 15:00)**
- ✅ **Login Admin** (08:00 - 08:30)
  - Đăng nhập với tài khoản admin
  - Truy cập Admin Dashboard
- ✅ **Dashboard & Thống kê** (08:30 - 09:30)
  - Xem doanh thu theo ngày/tháng
  - Thống kê đơn hàng (Pending, Processing, Shipped, Delivered)
  - Top sản phẩm bán chạy
  - Biểu đồ doanh thu (Recharts)
- ✅ **Quản lý Sản phẩm** (09:30 - 11:00)
  - Thêm sản phẩm mới với nhiều variants (size 38-42, 3 màu)
  - Upload hình ảnh sản phẩm
  - Chỉnh sửa thông tin sản phẩm
  - Xóa sản phẩm
- ✅ **Quản lý Đơn hàng** (11:00 - 12:00)
  - Xem danh sách đơn hàng
  - Cập nhật trạng thái: Pending → Processing → Shipped → Delivered
  - Xem chi tiết đơn hàng
  - Xuất PDF hóa đơn
- ✅ **Quản lý Voucher** (12:00 - 13:00)
  - Tạo mã giảm giá mới (%, fixed amount)
  - Thiết lập điều kiện (min order, max discount, expiry date)
  - Xem usage logs (ai đã dùng mã nào)
- ✅ **Quản lý Người dùng** (13:00 - 13:45)
  - Xem danh sách khách hàng
  - Kích hoạt/vô hiệu hóa tài khoản
  - Xem lịch sử mua hàng của từng user
- ✅ **Quản lý Blog** (13:45 - 14:30)
  - Viết bài viết mới về sản phẩm
  - Thêm hình ảnh vào blog
  - Publish/Unpublish bài viết
- ✅ **Quản lý Review** (14:30 - 15:00)
  - Duyệt review từ khách hàng
  - Xóa review spam/không phù hợp

#### **Phần 4: Demo Bot Detection System (15:00 - 20:00)** ⭐ **ĐIỂM NỔI BẬT**
- ✅ **Giới thiệu hệ thống** (15:00 - 16:00)
  - Giải thích 3 tầng phòng thủ:
    - Time-based Detection (< 1s)
    - Rate Limit Detection (> 20 req/min)
    - Pattern Analysis
  - Kiến trúc Winston logging với DailyRotateFile
  - Cloudflare-style Alert System (Email + Desktop notifications)
- ✅ **Demo tấn công Bot** (16:00 - 18:30)
  - Chạy `bot-dos-attack.js` (Sequential attack)
  - Chạy `bot-voucher-hunter-NEW.js` (Parallel voucher hunting)
  - Sử dụng Bot Control Panel (`bot-control-panel-live.html`)
  - Xem logs real-time trong terminal
- ✅ **Security Dashboard** (18:30 - 20:00)
  - Login admin → Security Dashboard
  - Xem bot attack logs với chart (Recharts)
  - Kiểm tra blacklisted IPs
  - Xem alert history
  - Phân tích pattern timing
  - Export logs to CSV

#### **Phần 5: Tổng kết (20:00 - 21:00)**
- ✅ Điểm mạnh của dự án
- ✅ Công nghệ sử dụng
- ✅ Bài học kinh nghiệm
- ✅ Hướng phát triển tương lai

---

### ⏱️ **Timeline tham khảo:**

| Thời gian | Nội dung | Mô tả |
|-----------|----------|-------|
| 00:00 - 01:30 | Giới thiệu | Tổng quan dự án, công nghệ, kiến trúc |
| 01:30 - 08:00 | Chức năng User | Đăng ký, duyệt sản phẩm, mua hàng, review |
| 08:00 - 15:00 | Chức năng Admin | Dashboard, quản lý sản phẩm, đơn hàng, voucher |
| 15:00 - 20:00 | **Bot Detection** ⭐ | Demo tấn công bot, Security Dashboard, alerts |
| 20:00 - 21:00 | Tổng kết | Điểm mạnh, bài học, hướng phát triển |

**Tổng thời lượng:** ~21 phút

---

### 📌 **Ghi chú quan trọng:**

- 🎬 Video được quay màn hình với **OBS Studio** hoặc **Camtasia**
- 🎤 Có voice-over giải thích chi tiết từng bước
- 📊 Sử dụng annotations để highlight các tính năng quan trọng
- ⚡ Tốc độ video 1.0x (không tua nhanh) để dễ theo dõi
- 📱 Độ phân giải: 1080p (Full HD)
- 🌐 Ngôn ngữ: Tiếng Việt

---

### 🔗 **Cách truy cập video:**

#### **Option 1: YouTube (Khuyến nghị)**
```
1. Click vào link YouTube ở trên
2. Video có thể được set "Unlisted" (chỉ người có link mới xem)
3. Không cần login YouTube để xem
```

#### **Option 2: Google Drive**
```
1. Click vào Google Drive link
2. Chọn "Download" để tải về
3. Hoặc xem trực tiếp trên Drive (nếu dung lượng < 100MB)
```

#### **Option 3: Lưu trữ local**
```
Video được lưu trong thư mục: ./demo-videos/
File: LillyShoes_FullDemo_2024.mp4 (hoặc .avi)
```

---

### 💡 **Lưu ý khi xem video:**

- ✅ **Bot Detection Demo** (15:00-20:00) là phần **QUAN TRỌNG NHẤT** thể hiện tính độc đáo của dự án
- ✅ Xem kỹ phần Security Dashboard để hiểu cách hệ thống phát hiện và chặn bot
- ✅ Nếu muốn test lại, tham khảo file `HUONG-DAN-CHAY-DEMO.md`
- ✅ Chi tiết kỹ thuật Bot Detection xem file `HOW-BOT-WORKS.md`

---

## 📚 Tài liệu tham khảo thêm

Để hiểu rõ hơn về dự án, vui lòng xem các file markdown sau trong thư mục gốc:

| File | Mô tả |
|------|-------|
| `HUONG-DAN-CHAY-DEMO.md` | Hướng dẫn chi tiết chạy demo cho thầy/cô |
| `HUONG-DAN-DEMO-CHO-THAY.md` | Kịch bản demo cho giảng viên |
| `HOW-BOT-WORKS.md` | Giải thích chi tiết hệ thống Bot Detection |
| `HOW-TO-USE-BOT-CONTROL-PANEL.md` | Hướng dẫn sử dụng Bot Control Panel |
| `DEFENSE-VS-ATTACK.md` | So sánh chiến lược phòng thủ vs tấn công |
| `DEMO-ATTACK-SUMMARY.md` | Tóm tắt các loại tấn công bot |
| `DEMO-CHECKLIST.md` | Checklist kiểm tra trước khi demo |
| `QUICKSTART.md` | Hướng dẫn khởi chạy nhanh |

---

## 🎓 Kết luận

Website **LillyShoes** là một dự án e-commerce hoàn chỉnh với các tính năng:

### ✅ **Điểm mạnh:**
1. **Giao diện thân thiện:** React.js với Bootstrap, Material-UI, responsive design
2. **Chức năng đầy đủ:** Mua hàng, thanh toán, quản lý đơn, review, voucher
3. **Admin Dashboard mạnh mẽ:** Thống kê real-time, quản lý toàn diện
4. **Bảo mật nâng cao:** ⭐ Hệ thống phát hiện bot tự động với 3 tầng phòng thủ
5. **Logging chuyên nghiệp:** Winston với DailyRotateFile, structured logs
6. **Alert System:** Email + Desktop notifications kiểu Cloudflare
7. **Tích hợp VNPay:** Thanh toán online an toàn

### 🚀 **Công nghệ hiện đại:**
- **Frontend:** React 18.3.1, Redux Toolkit, React Router v6
- **Backend:** Node.js 18+, Express 5.1.0, Sequelize ORM
- **Database:** SQL Server 2019+ với 20+ tables
- **Security:** JWT, bcrypt, Winston logging, bot detection
- **Payment:** VNPay gateway integration

### 📈 **Hướng phát triển:**
- Tích hợp AI/ML cho recommendation system
- Thêm OAuth2 login (Google, Facebook)
- Real-time chat support (Socket.io)
- Mobile app (React Native)
- Multi-language support (i18n)
- Advanced analytics với Machine Learning

---

**👥 Nhóm phát triển:**
- Phạm Thị Thùy Linh - 22810310291
- Võ Thị Kim Liên - 22810310261
- Nguyễn Thị Hoài Sương - 22810310254

**📧 Liên hệ:** lillyshoes.dev@gmail.com  
**🔗 GitHub:** https://github.com/your-username/shoe-store

---

*Cảm ơn bạn đã quan tâm đến dự án **LillyShoes**! 👟✨*

