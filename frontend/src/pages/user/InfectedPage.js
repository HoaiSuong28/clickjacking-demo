// 🚨 TRANG ĐÃ BỊ NHIỄM MÃ ĐỘC CLICKJACKING
// Mô phỏng khi kẻ tấn công đã inject mã độc vào website qua lỗ hổng XSS

import React, { useState } from 'react';
import './InfectedPage.css';
import InjectedClickjackAttack from '../../components/InjectedClickjackAttack';

const InfectedPage = () => {
  const [attackEnabled, setAttackEnabled] = useState(true);
  const [showExplanation, setShowExplanation] = useState(true);

  return (
    <div className="infected-page">
      {/* 🚨 Component mã độc đã bị inject - Trong thực tế người dùng không biết */}
      {attackEnabled && <InjectedClickjackAttack isActive={attackEnabled} />}

      {/* Phần giải thích cho demo */}
      {showExplanation && (
        <div className="explanation-banner">
          <button 
            className="close-explanation"
            onClick={() => setShowExplanation(false)}
          >
            ✕
          </button>
          <h3>🚨 CẢNH BÁO: Trang này đã bị nhiễm mã độc Clickjacking!</h3>
          <p><strong>Kịch bản tấn công:</strong></p>
          <ol>
            <li>Kẻ tấn công tìm được lỗ hổng XSS trong website</li>
            <li>Inject component <code>InjectedClickjackAttack</code> vào React app</li>
            <li>Component tạo iframe overlay ẩn lên trang thật</li>
            <li>Người dùng tưởng click vào "Nhận voucher" nhưng thực ra đang click vào trang giả</li>
          </ol>
          <div className="attack-controls">
            <button 
              onClick={() => setAttackEnabled(!attackEnabled)}
              className={attackEnabled ? 'btn-danger' : 'btn-success'}
            >
              {attackEnabled ? '🛑 Tắt tấn công (Bật CSP)' : '▶️ Bật tấn công'}
            </button>
          </div>
        </div>
      )}

      {/* Nội dung trang bình thường */}
      <div className="page-content">
        <header className="page-header">
          <h1>🛒 Cửa Hàng Giày Chính Hãng</h1>
          <nav>
            <a href="/">Trang chủ</a>
            <a href="/products">Sản phẩm</a>
            <a href="/cart">Giỏ hàng</a>
            <a href="/profile">Tài khoản</a>
          </nav>
        </header>

        <main className="main-content">
          <div className="promo-section">
            <h2>🎉 Khuyến mãi đặc biệt</h2>
            <p>Mua ngay hôm nay để nhận ưu đãi!</p>
          </div>

          <div className="products-grid">
            <div className="product-card">
              <img src="https://via.placeholder.com/300x200?text=Giay+Nike" alt="Giày Nike" />
              <h3>Nike Air Max</h3>
              <p className="price">1.500.000đ</p>
              <button className="btn-buy">Mua ngay</button>
            </div>

            <div className="product-card">
              <img src="https://via.placeholder.com/300x200?text=Giay+Adidas" alt="Giày Adidas" />
              <h3>Adidas Ultraboost</h3>
              <p className="price">1.800.000đ</p>
              <button className="btn-buy">Mua ngay</button>
            </div>

            <div className="product-card">
              <img src="https://via.placeholder.com/300x200?text=Giay+Puma" alt="Giày Puma" />
              <h3>Puma RS-X</h3>
              <p className="price">1.200.000đ</p>
              <button className="btn-buy">Mua ngay</button>
            </div>
          </div>

          <div className="info-section">
            <h2>📌 Thông tin quan trọng</h2>
            <p>
              <strong>Đây là mô phỏng tấn công Clickjacking thực tế!</strong>
            </p>
            <div className="warning-box">
              <h3>🎯 Cách hoạt động của tấn công:</h3>
              <ul>
                <li><strong>Bước 1:</strong> Kẻ tấn công tìm lỗ hổng XSS (ví dụ: form comment không được sanitize)</li>
                <li><strong>Bước 2:</strong> Inject mã JavaScript độc hại vào database hoặc local storage</li>
                <li><strong>Bước 3:</strong> Mã độc được thực thi khi user load trang</li>
                <li><strong>Bước 4:</strong> Tạo iframe overlay ẩn (opacity: 0) che phủ trang thật</li>
                <li><strong>Bước 5:</strong> User click vào nút "Nhận voucher" nhưng thực ra đang click vào iframe giả</li>
                <li><strong>Kết quả:</strong> Chuyển tiền, đăng spam, đổi mật khẩu... mà user không biết!</li>
              </ul>
            </div>

            <div className="defense-box">
              <h3>🛡️ Cách phòng thủ:</h3>
              <ul>
                <li><strong>Content Security Policy (CSP):</strong> Chặn việc tạo iframe từ nguồn không rõ</li>
                <li><strong>X-Frame-Options:</strong> Ngăn website bị nhúng vào iframe của trang khác</li>
                <li><strong>Frame-busting JavaScript:</strong> Phát hiện và phá vỡ iframe overlay</li>
                <li><strong>Input Validation:</strong> Sanitize tất cả input để ngăn XSS</li>
                <li><strong>CSP frame-src:</strong> Chỉ cho phép iframe từ domain tin cậy</li>
              </ul>
              <pre>{`// Backend: middleware/antiClickjacking.js
app.use((req, res, next) => {
  // Chặn website bị nhúng vào iframe
  res.setHeader('X-Frame-Options', 'DENY');
  
  // CSP chặn iframe không rõ nguồn gốc
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors 'none'; frame-src 'self'"
  );
  
  next();
});`}</pre>
            </div>
          </div>
        </main>

        <footer className="page-footer">
          <p>© 2025 Cửa Hàng Giày - Demo Bảo Mật Clickjacking</p>
        </footer>
      </div>
    </div>
  );
};

export default InfectedPage;
