# 🎮 Console Attack Scripts - Tấn công Bot qua Browser DevTools

## 📌 Hướng dẫn sử dụng

1. **Mở website**: `http://localhost:3000`
2. **Nhấn F12** để mở DevTools
3. **Chuyển sang tab Console**
4. **Copy 1 trong 3 scripts dưới đây**
5. **Paste vào Console và nhấn Enter**
6. **Xem kết quả real-time** tại: `http://localhost:3000/security-monitor`

---

## 🤖 Script 1: Bot Attack Tuần Tự (Sequential)

Copy toàn bộ đoạn code này vào Console:

```javascript
(async function botSequentialAttack() {
    console.log('%c🤖 BOT SEQUENTIAL ATTACK STARTED', 'background: red; color: white; font-size: 16px; padding: 5px;');
    
    const API_URL = 'http://localhost:5000/api/products?limit=1';
    let successCount = 0;
    let blockedCount = 0;
    let errorCount = 0;
    const totalRequests = 50;
    const delay = 50; // 50ms delay
    
    for (let i = 1; i <= totalRequests; i++) {
        try {
            const startTime = Date.now();
            const response = await fetch(API_URL);
            const duration = Date.now() - startTime;
            
            if (response.status === 200) {
                successCount++;
                console.log(`%c✅ Request #${i}: SUCCESS (${duration}ms)`, 'color: green');
            } else if (response.status === 403) {
                blockedCount++;
                console.log(`%c🚫 Request #${i}: BLOCKED by Bot Detection! (${duration}ms)`, 'color: red; font-weight: bold');
            } else {
                errorCount++;
                console.log(`%c⚠️ Request #${i}: ERROR ${response.status}`, 'color: orange');
            }
        } catch (error) {
            errorCount++;
            console.log(`%c❌ Request #${i}: FAILED - ${error.message}`, 'color: red');
        }
        
        // Delay between requests
        if (i < totalRequests) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    // Summary
    console.log('\n%c📊 ATTACK SUMMARY', 'background: blue; color: white; font-size: 18px; padding: 10px;');
    console.log(`✅ Success: ${successCount}`);
    console.log(`🚫 Blocked: ${blockedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📈 Total: ${totalRequests} requests`);
    console.log(`📊 Block Rate: ${((blockedCount/totalRequests)*100).toFixed(1)}%`);
    console.log('\n👉 Xem chi tiết tại: http://localhost:3000/security-monitor');
})();
```

---

## ⚡ Script 2: Bot Attack Parallel (100 requests cùng lúc)

Copy toàn bộ đoạn code này vào Console:

```javascript
(async function botParallelAttack() {
    console.log('%c⚡ BOT PARALLEL ATTACK STARTED', 'background: red; color: white; font-size: 16px; padding: 5px;');
    
    const API_URL = 'http://localhost:5000/api/products?limit=1';
    const totalRequests = 100;
    let successCount = 0;
    let blockedCount = 0;
    let errorCount = 0;
    
    console.log(`🚀 Sending ${totalRequests} requests simultaneously...`);
    const startTime = Date.now();
    
    // Send all requests at once
    const promises = Array.from({ length: totalRequests }, (_, i) => 
        fetch(API_URL)
            .then(response => {
                if (response.status === 200) {
                    successCount++;
                    console.log(`%c✅ Request #${i+1}: SUCCESS`, 'color: green');
                } else if (response.status === 403) {
                    blockedCount++;
                    console.log(`%c🚫 Request #${i+1}: BLOCKED!`, 'color: red; font-weight: bold');
                } else {
                    errorCount++;
                    console.log(`%c⚠️ Request #${i+1}: ERROR ${response.status}`, 'color: orange');
                }
                return response.status;
            })
            .catch(error => {
                errorCount++;
                console.log(`%c❌ Request #${i+1}: FAILED`, 'color: red');
                return 'error';
            })
    );
    
    // Wait for all requests to complete
    await Promise.all(promises);
    const totalTime = Date.now() - startTime;
    
    // Summary
    console.log('\n%c📊 PARALLEL ATTACK SUMMARY', 'background: purple; color: white; font-size: 18px; padding: 10px;');
    console.log(`✅ Success: ${successCount}`);
    console.log(`🚫 Blocked: ${blockedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📈 Total: ${totalRequests} requests`);
    console.log(`⏱️ Time: ${totalTime}ms`);
    console.log(`⚡ Speed: ${(totalRequests / (totalTime / 1000)).toFixed(0)} req/s`);
    console.log(`📊 Block Rate: ${((blockedCount/totalRequests)*100).toFixed(1)}%`);
    console.log('\n👉 Xem chi tiết tại: http://localhost:3000/security-monitor');
})();
```

---

## 🎯 Script 3: Voucher Hunter Bot (Tấn công lấy voucher tự động)

Copy toàn bộ đoạn code này vào Console:

```javascript
(async function voucherHunterBot() {
    console.log('%c🎯 VOUCHER HUNTER BOT STARTED', 'background: gold; color: black; font-size: 16px; padding: 5px;');
    
    const API_URL = 'http://localhost:5000/api/chatbot';
    const totalAttempts = 30;
    let collectedVouchers = [];
    let successCount = 0;
    let blockedCount = 0;
    
    for (let i = 1; i <= totalAttempts; i++) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'voucher'
                })
            });
            
            if (response.status === 200) {
                const data = await response.json();
                successCount++;
                
                // Extract voucher code from response
                if (data.response && data.response.includes('CODE:')) {
                    const voucherMatch = data.response.match(/CODE:\s*(\w+)/);
                    if (voucherMatch) {
                        const voucherCode = voucherMatch[1];
                        collectedVouchers.push(voucherCode);
                        console.log(`%c🎉 Attempt #${i}: GOT VOUCHER - ${voucherCode}`, 'color: green; font-weight: bold');
                    }
                } else {
                    console.log(`%c✅ Attempt #${i}: Success but no voucher`, 'color: blue');
                }
            } else if (response.status === 403) {
                blockedCount++;
                console.log(`%c🚫 Attempt #${i}: BLOCKED by Bot Detection!`, 'color: red; font-weight: bold');
            }
        } catch (error) {
            console.log(`%c❌ Attempt #${i}: ERROR`, 'color: red');
        }
        
        // Small delay
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Summary
    console.log('\n%c🎁 VOUCHER HUNTER SUMMARY', 'background: green; color: white; font-size: 18px; padding: 10px;');
    console.log(`🎯 Total Attempts: ${totalAttempts}`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`🚫 Blocked: ${blockedCount}`);
    console.log(`🎫 Vouchers Collected: ${collectedVouchers.length}`);
    
    if (collectedVouchers.length > 0) {
        console.log('\n%c📋 COLLECTED VOUCHERS:', 'background: gold; color: black; font-size: 14px; padding: 5px;');
        collectedVouchers.forEach((code, idx) => {
            console.log(`  ${idx + 1}. ${code}`);
        });
        
        // Calculate total discount
        const totalDiscount = collectedVouchers.length * 10; // Giả sử mỗi voucher 10%
        console.log(`\n💰 Total Discount: ${totalDiscount}%`);
    }
    
    console.log('\n👉 Xem logs tại: http://localhost:3000/security-monitor');
})();
```

---

## 📊 Kết quả mong đợi

### ✅ Request 1-5: Thành công (màu xanh)
- Hệ thống chưa phát hiện pattern tấn công
- Response 200 OK

### 🚫 Request 6+: Bị chặn (màu đỏ)
- Bot detection kích hoạt
- IP bị blacklist
- Response 403 Forbidden

### 📈 Xem thống kê real-time:
- Mở tab mới: `http://localhost:3000/security-monitor`
- Xem số lượng IP bị chặn
- Xem logs tấn công real-time

---

## ⚠️ Lưu ý

- ✅ Chỉ dùng cho **demo/testing**
- ✅ Chạy trên **localhost** (không phải production)
- ✅ Hệ thống sẽ tự động **unblock IP** sau vài phút
- ✅ Nếu bị chặn, đợi 5 phút hoặc restart backend

---

## 🎯 Tips Demo cho thầy giáo

1. **Mở 2 tab**:
   - Tab 1: Console (F12) - chạy script
   - Tab 2: `http://localhost:3000/security-monitor` - xem kết quả

2. **Script nên dùng**:
   - **Script 1** (Sequential): Dễ quan sát từng request
   - **Script 2** (Parallel): Demo sức mạnh bot
   - **Script 3** (Voucher): Demo tấn công thực tế

3. **Highlight**:
   - Request 1-5 màu xanh (thành công)
   - Request 6+ màu đỏ (bị chặn)
   - IP xuất hiện trong blacklist

Good luck! 🚀
