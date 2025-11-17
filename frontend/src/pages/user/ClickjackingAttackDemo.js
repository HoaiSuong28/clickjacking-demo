// 🚨 CLICKJACKING ATTACK DEMO COMPONENT
// Component này mô phỏng tấn công clickjacking thực tế trên website chính
// CSP và X-Frame-Options sẽ chặn iframe

import React, { useState, useEffect } from 'react';
import './ClickjackingAttackDemo.css';

const ClickjackingAttackDemo = () => {
  const [showIframe, setShowIframe] = useState(false);
  const [attackStatus, setAttackStatus] = useState('loading');
  const [iframeOpacity, setIframeOpacity] = useState(0);

  useEffect(() => {
    // Log initial state
    console.log('%c🎬 CLICKJACKING ATTACK DEMO', 'color: purple; font-size: 24px; font-weight: bold;');
    console.log('%cInitializing attack scenario on main website...', 'color: gray;');
    console.log('');
    console.log('%c💡 HOW IT WORKS:', 'color: blue; font-weight: bold;');
    console.log('1. User sees attractive "NHẬN VOUCHER 500K" button');
    console.log('2. Invisible iframe (opacity: 0) is positioned on top');
    console.log('3. When user clicks the visible button...');
    console.log('4. They actually click a button INSIDE the hidden iframe');
    console.log('5. Result: Unintended action (e.g., transfer money, change settings)');
    console.log('');
    console.log('%c🛡️ DEFENSE:', 'color: green; font-weight: bold;');
    console.log('X-Frame-Options: DENY - Blocks all iframe embedding');
    console.log('CSP frame-ancestors \'none\' - Modern standard protection');
    console.log('');
  }, []);

  const handleIframeLoad = () => {
    console.log('%c🚨 CLICKJACKING ATTACK SCENARIO', 'color: red; font-size: 20px; font-weight: bold;');
    console.log('%c════════════════════════════════════════', 'color: red;');
    console.log('');
    console.log('%c📊 ATTACK DETAILS:', 'color: orange; font-size: 16px; font-weight: bold;');
    console.log('  🎯 Target: /checkout page');
    console.log('  🎭 Method: Invisible iframe overlay (opacity: 0)');
    console.log('  👤 User sees: "NHẬN VOUCHER 500K" button');
    console.log('  ⚡ User actually clicks: Hidden checkout button in iframe');
    console.log('');
    console.log('%c🔍 WHAT HAPPENED:', 'color: blue; font-size: 16px; font-weight: bold;');
    
    try {
      const iframe = document.getElementById('attack-iframe');
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
      if (iframeDoc && iframeDoc.body) {
        console.log('%c  ❌ ATTACK SUCCESS!', 'color: red; font-weight: bold;');
        console.log('  ⚠️  Iframe loaded successfully');
        console.log('  ⚠️  No security headers detected');
        console.log('  ⚠️  User clicks are being hijacked!');
        setAttackStatus('vulnerable');
      } else {
        throw new Error('Cannot access iframe');
      }
    } catch (error) {
      console.log('%c  ✅ ATTACK BLOCKED!', 'color: green; font-weight: bold;');
      console.log('  🛡️  Security headers detected');
      console.log('  🔒  X-Frame-Options: DENY');
      console.log('  🔒  CSP: frame-ancestors \'none\'');
      console.log('  ✅  User is protected!');
      console.log('');
      console.log('%c🎉 DEFENSE SUCCESSFUL!', 'color: green; font-size: 16px; font-weight: bold;');
      console.log('  The middleware blocked the iframe from loading.');
      console.log('  Clickjacking attack prevented!');
      setAttackStatus('protected');
    }
    
    console.log('');
    console.log('%c════════════════════════════════════════', 'color: red;');
  };

  const handleIframeError = () => {
    console.log('%c✅ Iframe failed to load (GOOD!)', 'color: green; font-weight: bold;');
    setAttackStatus('protected');
  };

  const toggleIframeVisibility = () => {
    setIframeOpacity(prev => prev === 0 ? 0.8 : 0);
    console.log(`%c👁️ Iframe visibility: ${iframeOpacity === 0 ? 'VISIBLE' : 'HIDDEN'}`, 'color: orange;');
  };

  const startAttack = () => {
    setShowIframe(true);
    console.log('%c🚀 Starting clickjacking attack simulation...', 'color: red; font-weight: bold;');
  };

  return (
    <div className="clickjacking-demo-container">
      {/* Demo Warning Banner */}
      <div className="demo-warning-banner">
        ⚠️ DEMO MODE - This is a simulated attack for security testing
      </div>

      {/* Main Content */}
      <div className="demo-content">
        <div className="demo-header">
          <h1>🛡️ Clickjacking Attack & Defense Demo</h1>
          <p className="subtitle">
            Real-world demonstration of clickjacking attack and how CSP/X-Frame-Options protect users
          </p>
        </div>

        {/* Attack Explanation */}
        <div className="attack-explanation">
          <h2>📚 What is Clickjacking?</h2>
          <div className="explanation-grid">
            <div className="explanation-card">
              <div className="card-icon">🎭</div>
              <h3>The Trick</h3>
              <p>Attacker creates a fake website with attractive button "Win 500K Voucher!"</p>
            </div>
            <div className="explanation-card">
              <div className="card-icon">👻</div>
              <h3>The Trap</h3>
              <p>Hidden iframe (opacity: 0) loads your real website underneath</p>
            </div>
            <div className="explanation-card">
              <div className="card-icon">🎯</div>
              <h3>The Attack</h3>
              <p>User thinks they click "Win Voucher" but actually clicks "Transfer Money"</p>
            </div>
            <div className="explanation-card">
              <div className="card-icon">🛡️</div>
              <h3>The Defense</h3>
              <p>CSP & X-Frame-Options headers block iframe loading</p>
            </div>
          </div>
        </div>

        {/* Attack Simulation Area */}
        <div className="attack-simulation">
          <h2>🧪 Try the Attack</h2>
          <p className="simulation-desc">
            Click the button below to simulate a clickjacking attack. 
            The iframe will try to load the checkout page invisibly.
          </p>

          {!showIframe ? (
            <button className="start-attack-btn" onClick={startAttack}>
              🚀 Start Attack Simulation
            </button>
          ) : (
            <div className="attack-active-container">
              {/* Fake Promotional Content */}
              <div className="fake-promo-section">
                <div className="promo-header">
                  <h3>🎉 SPECIAL PROMOTION 🎉</h3>
                  <p className="promo-text">Get 500,000₫ voucher NOW!</p>
                  <p className="promo-subtext">Just click the button below!</p>
                </div>

                {/* FAKE button that user sees */}
                <button className="fake-voucher-button">
                  <span className="gift-icon">🎁</span>
                  CLAIM VOUCHER NOW!
                </button>
              </div>

              {/* REAL iframe (invisible) */}
              <div className="iframe-container">
                <iframe
                  id="attack-iframe"
                  className="attack-iframe"
                  src="/checkout"
                  title="hidden-attack-frame"
                  style={{ opacity: iframeOpacity }}
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  sandbox="allow-same-origin allow-scripts allow-forms"
                />
              </div>

              {/* Protected Overlay (shows when blocked) */}
              {attackStatus === 'protected' && (
                <div className="protected-overlay">
                  <div className="protected-message">
                    <div className="shield-icon">🛡️</div>
                    <h2>✅ ATTACK BLOCKED!</h2>
                    <p>
                      <strong>X-Frame-Options</strong> and <strong>CSP</strong><br />
                      successfully blocked the iframe!<br /><br />
                      Users are 100% protected 🎉
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Control Buttons */}
          {showIframe && (
            <div className="control-buttons">
              <button className="control-btn" onClick={toggleIframeVisibility}>
                👁️ {iframeOpacity === 0 ? 'Show' : 'Hide'} Iframe
              </button>
              <button className="control-btn reset" onClick={() => window.location.reload()}>
                🔄 Reset Demo
              </button>
            </div>
          )}
        </div>

        {/* Status Panel */}
        {showIframe && (
          <div className="status-panel">
            <h3>📊 Attack Status</h3>
            <div className="status-grid">
              <div className="status-item">
                <strong>Target:</strong> /checkout
              </div>
              <div className="status-item">
                <strong>Method:</strong> Invisible iframe overlay
              </div>
              <div className="status-item">
                <strong>Goal:</strong> Hijack user clicks
              </div>
              <div className={`status-item result ${attackStatus}`}>
                <strong>Result:</strong> {
                  attackStatus === 'loading' ? '⏳ Loading...' :
                  attackStatus === 'protected' ? '✅ BLOCKED by CSP + X-Frame-Options' :
                  '❌ VULNERABLE - No protection!'
                }
              </div>
            </div>
          </div>
        )}

        {/* Security Headers Info */}
        <div className="security-info">
          <h2>🔒 Security Implementation</h2>
          <div className="headers-grid">
            <div className="header-card">
              <h4>X-Frame-Options</h4>
              <code>DENY</code>
              <p>Legacy header - 99%+ browser support</p>
            </div>
            <div className="header-card">
              <h4>Content-Security-Policy</h4>
              <code>frame-ancestors 'none'</code>
              <p>Modern standard - More flexible</p>
            </div>
            <div className="header-card">
              <h4>X-Content-Type-Options</h4>
              <code>nosniff</code>
              <p>Prevents MIME sniffing</p>
            </div>
            <div className="header-card">
              <h4>X-XSS-Protection</h4>
              <code>1; mode=block</code>
              <p>Blocks reflected XSS</p>
            </div>
          </div>
        </div>

        {/* Console Tip */}
        <div className="console-tip">
          <p>💡 <strong>Pro Tip:</strong> Open Console (F12) to see detailed attack logs and security analysis!</p>
        </div>
      </div>
    </div>
  );
};

export default ClickjackingAttackDemo;
