'use strict';

const express = require("express");
const cors = require("cors");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const { expressjwt } = require('express-jwt');
const fs = require("fs");
const axios = require("axios");

// --- TÍCH HỢP SEQUELIZE ---
// --- Nạp đối tượng db chứa sequelize instance và tất cả các model
const db = require('./models');

// 🚨 SIMPLE LOGGER (không dùng winston để tránh crash)
const logger = {
  info: (...args) => console.log('[INFO]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
  warn: (...args) => console.warn('[WARN]', ...args),
  debug: (...args) => console.log('[DEBUG]', ...args)
};

// 🛡️ ANTI-CLICKJACKING MIDDLEWARE
const { antiClickjacking, presets, detectIframeRequest, testAntiClickjacking } = require('./middleware/antiClickjacking');

// Load .env từ thư mục backend
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

/* ---------------- CORS & Middlewares cơ bản ---------------- */
const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép requests từ:
    // 1. Frontend React (localhost:3000)
    // 2. Bot Control Panel (file:// = origin null)
    // 3. Không có origin (Postman, curl, bot scripts)
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:5000'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Cho phép tất cả trong development
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-ID', 'X-Client-IP'],
  exposedHeaders: ['X-Session-ID'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🛡️ ANTI-CLICKJACKING PROTECTION - ENABLED
app.use(antiClickjacking(presets.dev)); // Dùng dev preset để có logging
app.use(detectIframeRequest); // Phát hiện requests từ iframe
app.use(testAntiClickjacking); // Thêm debug headers

// --- Cấu hình Multer và Static Files (giữ nguyên) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Serve các file tĩnh từ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve ảnh blog qua đường dẫn /images (map vào thư mục uploads/blogs)
app.use('/images', express.static(path.join(__dirname, 'uploads', 'blogs')));

  

/* ---------------- MIDDLEWARE XÁC THỰC ---------------- */

// Middleware xác thực JWT cho tất cả các route /api/admin
app.use(
  '/api/admin',
  expressjwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
  (req, res, next) => {
    req.user = req.auth; // gắn payload vào req.user
    next();
  }
);


// Middleware xác thực JWT cho các route user cần đăng nhập
const authenticateUser = expressjwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] });

// Middleware xác thực "tùy chọn" cho wishlist
const authenticateWishlistOptional = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: false // Quan trọng: không báo lỗi nếu thiếu token
});


/* ---------------- PASSPORT - SOCIAL LOGIN (REFACTORED) ---------------- */
app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        // Sử dụng Sequelize: Tìm user bằng email, nếu không có thì tạo mới
        const [user, created] = await db.User.findOrCreate({
            where: { Email: email },
            defaults: {
                Username: profile.displayName.replace(/\s/g, '') + Date.now().toString().slice(-4), // Tạo username unique
                Password: 'provided_by_google', // Mật khẩu không dùng cho OAuth
                Role: 'user',
                FullName: profile.displayName,
                AvatarURL: profile.photos?.[0]?.value || null,
            }
        });
        return done(null, user);
      } catch (err) {
        console.error("Google OAuth error:", err);
        return done(err, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || `${profile.id}@facebook-placeholder.com`;
        const [user, created] = await db.User.findOrCreate({
            where: { Email: email },
            defaults: {
                Username: profile.displayName.replace(/\s/g, '') + Date.now().toString().slice(-4),
                Password: 'provided_by_facebook',
                Role: 'user',
                FullName: profile.displayName,
                AvatarURL: profile.photos?.[0]?.value || null,
            }
        });
        return done(null, user);
      } catch (err) {
        console.error("Facebook OAuth error:", err);
        return done(err, null);
      }
    }
  )
);


/* ---------------- IMPORT ROUTERS (Đã được refactor) ---------------- */
// User-facing routes
const authRouter = require('./routes/user/auth');
const profileRouter = require('./routes/user/profile');
const productsUserRouter = require('./routes/user/productsUser');
const cartUserRouter = require('./routes/user/cartUser');
const blogsUserRouter = require('./routes/user/blogsUser');
const addressesUserRouter = require('./routes/user/addressesUser');
const homeRouter = require('./routes/user/homeUser');
const userCouponsRoute = require('./routes/user/coupons');
const shippingRouter = require('./routes/user/shipping');
const userPaymentMethodsRouter = require('./routes/user/paymentMethods');
const { userOrdersRouter, guestOrdersRouter } = require('./routes/user/ordersUser');
const guestHistoryRouter = require('./routes/user/guestHistory');
const passwordRouter = require('./routes/user/password');
const wishlistUserRouter = require('./routes/user/wishlist');
const paymentRoutes = require('./routes/payment.route');
// Admin routes
const adminAuthRoutes = require("./routes/admin/authAdmin");
const adminBlogsRouter = require("./routes/admin/blogsAdmin");
const adminCategoriesRouter = require("./routes/admin/categoriesAdmin");
const adminCouponsRouter = require("./routes/admin/couponsAdmin");
const adminDashboardRouter = require("./routes/admin/homeAdmin");
const adminOrdersRouter = require("./routes/admin/ordersAdmin");
const adminPaymentMethodsRouter = require("./routes/admin/paymentMethods");
const adminProductsRouter = require("./routes/admin/productsAdmin");
const adminReviewsRouter = require("./routes/admin/reviews");
const adminUsersRouter = require("./routes/admin/usersAdmin")(upload); // Truyền `upload` vào cho route này

const paymentRouter = require('./routes/payment.route');
app.use('/api/payment', paymentRouter);

// 🛡️ Bot Detection & Demo Attack Routes
const { trackPageVisit, detectBot } = require('./middleware/botDetection');
const demoAttackRouter = require('./routes/demo-attack.route');
const botStatsRouter = require('./routes/bot-stats.route');

/* ---------------- USE ROUTERS (Tổ chức lại theo prefix) ---------------- */
const apiRouter = express.Router();

// 🎯 Bot Stats API - Real-time monitoring (không cần bot detection)
apiRouter.use('/bot-stats', botStatsRouter);

// Public User Routes (không cần bot detection)
apiRouter.use('/auth', authRouter);
apiRouter.use('/products', productsUserRouter);
apiRouter.use('/blogs', blogsUserRouter);
apiRouter.use('/home', homeRouter);
apiRouter.use('/shipping', shippingRouter);
apiRouter.use('/payment-methods', userPaymentMethodsRouter);
apiRouter.use('/guest-history', guestHistoryRouter);
apiRouter.use('/guest-orders', guestOrdersRouter);
apiRouter.use('/password', passwordRouter);
apiRouter.use('/payment', paymentRoutes);

// ✅ User Routes - KHÔNG có bot detection (hoạt động bình thường)
apiRouter.use('/cart', cartUserRouter);
apiRouter.use('/user/coupons', userCouponsRoute);

// 🛡️ DEMO ATTACK Route - CHỈ endpoint này mới có bot detection
// Áp dụng trackPageVisit và detectBot CHỈ cho demo-attack
apiRouter.use('/demo-attack', trackPageVisit, detectBot, demoAttackRouter);

// Authenticated User Routes
const userAuthMiddleware = (req, res, next) => { if(req.auth) req.user = req.auth; next(); };
apiRouter.use('/profile', authenticateUser, userAuthMiddleware, profileRouter);
apiRouter.use('/addresses', authenticateUser, userAuthMiddleware, addressesUserRouter);
apiRouter.use('/user/orders', authenticateUser, userAuthMiddleware, userOrdersRouter);
apiRouter.use('/wishlist', authenticateWishlistOptional, userAuthMiddleware, wishlistUserRouter);

// Admin Routes (đã có middleware /api/admin ở trên)
apiRouter.use('/admin/auth', adminAuthRoutes);
apiRouter.use('/admin/blogs', adminBlogsRouter);
apiRouter.use('/admin/categories', adminCategoriesRouter);
apiRouter.use('/admin/coupons', adminCouponsRouter);
apiRouter.use('/admin/home', adminDashboardRouter);
apiRouter.use('/admin/orders', adminOrdersRouter);
apiRouter.use('/admin/payment-methods', adminPaymentMethodsRouter);
apiRouter.use('/admin/products', adminProductsRouter);
apiRouter.use('/admin/reviews', adminReviewsRouter);
apiRouter.use('/admin/users', adminUsersRouter);

// 🤖 Bot Control API
const botControlRouter = require('./routes/bot-control.route');
apiRouter.use('/bot-control', botControlRouter);

// 🛡️ Security Monitor (PUBLIC - không cần auth)
const securityRouter = require('./routes/admin/security.route');
apiRouter.use('/security', securityRouter);

// Gắn router chính vào /api
app.use('/api', apiRouter);

/* ---------------- API CURRENT USER (REFACTORED) ---------------- */
app.get("/api/current_user", authenticateUser, async (req, res) => {
    try {
        const user = await db.User.findByPk(req.auth.id, {
            attributes: ['UserID', 'Username', 'Email', 'Role', 'AvatarURL']
        });
        if (!user) return res.status(404).json(null);
        
        const userData = user.get({ plain: true });
        res.json({
            ...userData,
            avatar: userData.AvatarURL ? `${process.env.BASE_URL || 'http://localhost:5000'}${userData.AvatarURL}` : null,
        });
    } catch (err) {
        res.status(500).json(null);
    }
});


/* ---------------- OAUTH ROUTES (REFACTORED) ---------------- */
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "http://localhost:3000/login", session: false }), (req, res) => {
    const user = req.user.get({ plain: true });
    const payload = { id: user.UserID, role: user.Role, username: user.Username, email: user.Email, avatar: user.AvatarURL };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.redirect(`http://localhost:3000/login?token=${token}&role=${user.Role}`);
});

app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"], session: false }));
app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "http://localhost:3000/login", session: false }), (req, res) => {
    const user = req.user.get({ plain: true });
    const payload = { id: user.UserID, role: user.Role, username: user.Username, email: user.Email, avatar: user.AvatarURL };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.redirect(`http://localhost:3000/login?token=${token}&role=${user.Role}`);
});


/* ---------------- ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
    if (err && err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
    // Thêm các xử lý lỗi khác nếu cần
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  logger.error(`Uncaught Exception: ${error.message}`);
  // Không exit process để server tiếp tục chạy
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  logger.error(`Unhandled Rejection: ${reason}`);
});

db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Kết nối CSDL thành công bằng Sequelize.');
    // Chỉ đồng bộ trong môi trường development để an toàn
    // if (process.env.NODE_ENV !== 'production') {
    //     db.sequelize.sync({ alter: true }).then(() => { // `alter: true` giúp cập nhật bảng mà không xóa dữ liệu
    //         console.log('🔄 Đồng bộ model với database thành công.');
    //     });
    // }
    app.listen(PORT, () => {
      logger.info(`🚀 Backend đang chạy tại http://localhost:${PORT}`);
      console.log(`🚀 Backend đang chạy tại http://localhost:${PORT}`);
      
      // 🚨 Khởi động hệ thống Alert (Cloudflare-style) - TEMPORARY DISABLED
      // startAlertMonitoring();
      // logger.info('🛡️ Cloudflare-style Alert System initialized');
    });
  })
  .catch(err => {
    console.error('❌ Kết nối CSDL thất bại:', err);
  });