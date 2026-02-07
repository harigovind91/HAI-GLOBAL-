/**
 * HAI Global - Integrated Logic Engine
 * Owner: Scientist Harigovind
 * Version: 2.2 (Integrated Sanskar Module & User Sync)
 * NO CODE REMOVED - ONLY ENHANCED
 */

// 1. मास्टर कॉन्फ़िगरेशन (यथावत)
const HAI_SYSTEM_CONFIG = {
    adminUpi: "harigovindsingh91-2@okhdfcbank",
    commissionRate: 0.10,
    deliveryFeeRate: 0.05,
    currency: "INR",
    nodeID: "NODE-771"
};

// 2. मार्केटप्लेस इनिशियलाइज़ेशन (अपडेटेड: यूजर सिंक के साथ)
function loadMarketplace() {
    console.log("HAI Systems Online - Authorization: Scientist Harigovind");
    updateUserLocation();
    
    // नए यूजर पोर्टल के लिए चेक
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(currentUser) {
        console.log(`Active Scientific Node: ${currentUser.email}`);
        // डैशबोर्ड पर डेटा रिफ्लेक्ट करने के लिए
        if(document.getElementById('scoreText')) {
            renderUserStats(currentUser);
        }
    }

    const activeRider = JSON.parse(localStorage.getItem('active_rider'));
    if(activeRider) console.log(`Rider Active: ${activeRider.name}`);
}

// नया फंक्शन: डैशबोर्ड डेटा रेंडरिंग के लिए
function renderUserStats(user) {
    const scoreBar = document.getElementById('scoreBar');
    if(scoreBar) {
        scoreBar.style.width = user.sanskarScore + "%";
        document.getElementById('scoreText').innerText = `सात्विक स्कोर: ${user.sanskarScore}%`;
        document.getElementById('walletBalance').innerText = `₹ ${user.wallet.toFixed(2)}`;
    }
}

// 3. मर्चेंट एवं कैमरा मॉड्यूल (यथावत)
function openCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(function(stream) {
            alert("HAI System: Scanner Active - Rear Camera Engaged");
            const video = document.querySelector('video');
            if(video) video.srcObject = stream;
        })
        .catch(err => alert("Camera Node Error: " + err));
    }
}

function registerSeller() {
    const shop = document.getElementById('s-shop')?.value;
    const pin = document.getElementById('s-pin')?.value;
    if(!shop || !pin) { alert("त्रुटि: दुकान का नाम और पिन कोड अनिवार्य है!"); return; }

    const sellerData = { role: 'SELLER', shop: shop, pin: pin, timestamp: new Date().toISOString() };
    localStorage.setItem('active_seller', JSON.stringify(sellerData));
    alert("मर्चेंट डेटा सिंक्रोनाइज़ हो गया है!");
    window.location.href = 'merchant-portal.html';
}

// 4. राइडर रजिस्ट्रेशन (यथावत)
function registerRider() {
    const name = document.getElementById('r-name')?.value;
    const upi = document.getElementById('r-upi')?.value;
    if(!name || !upi) { alert("राइडर का नाम और UPI ID आवश्यक है!"); return; }

    const riderData = { role: 'RIDER', name: name, upi: upi, status: 'STANDBY' };
    localStorage.setItem('active_rider', JSON.stringify(riderData));
    alert(`स्वागत है ${name}!`);
    window.location.href = 'delivery-boy.html';
}

// 5. यूनिफाइड पेमेंट इंजन (Enriched with Sanskar Logic)
async function globalOrder(productId) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if(!user) {
        alert("सुरक्षा प्रोटोकॉल: खरीदारी के लिए लॉगिन अनिवार्य है।");
        window.location.href = 'user-login.html';
        return;
    }

    const productCard = event.target.closest('.product-card');
    const productName = productCard.querySelector('h3').innerText;
    const rawPrice = productCard.querySelector('span.text-lg').innerText.replace(/[^0-9.]/g, '');
    const totalPrice = parseFloat(rawPrice);

    // आपकी मूल वैज्ञानिक गणना (Split Calculations)
    const adminCommission = (totalPrice * HAI_SYSTEM_CONFIG.commissionRate).toFixed(2);
    const deliveryShare = (totalPrice * HAI_SYSTEM_CONFIG.deliveryFeeRate).toFixed(2);
    const sellerShare = (totalPrice - (parseFloat(adminCommission) + parseFloat(deliveryShare))).toFixed(2);

    const orderId = "HAI-" + Date.now().toString().slice(-6);
    const orderData = {
        orderId: orderId,
        userEmail: user.email,
        total: totalPrice,
        adminAmt: adminCommission,
        riderAmt: deliveryShare,
        sellerAmt: sellerShare,
        status: "SECURED_HOLD",
        timestamp: new Date().toISOString()
    };

    saveOrderToSystem(orderData);

    // --- संस्कार मॉड्यूल वृद्धि (सात्विक प्रेम का वैज्ञानिक प्रभाव) ---
    user.sanskarScore = Math.min(100, (user.sanskarScore || 75) + 2);
    user.totalCount = (user.totalCount || 0) + 1;
    localStorage.setItem('currentUser', JSON.stringify(user));

    alert(`🔐 HAI SECURE GATEWAY\nOrder: ${productName}\n\nसात्विक स्कोर बढ़ाकर ${(user.sanskarScore)}% हो गया है।`);

    const upiUrl = `upi://pay?pa=${HAI_SYSTEM_CONFIG.adminUpi}&pn=HAI_GLOBAL_ADMIN&am=${totalPrice}&tn=HAI_ORDER_${orderId}&cu=INR`;
    window.location.href = upiUrl;
}

function saveOrderToSystem(order) {
    let orders = JSON.parse(localStorage.getItem('hai_orders')) || [];
    orders.push(order);
    localStorage.setItem('hai_orders', JSON.stringify(orders));
}

// 6. रिलीज पेमेंट्स (यथावत)
function releasePayments(orderId) {
    let orders = JSON.parse(localStorage.getItem('hai_orders')) || [];
    let order = orders.find(o => o.orderId === orderId);
    if (order && order.status !== "RELEASED") {
        order.status = "RELEASED";
        alert(`भुगतान सफल! \nकमीशन (₹${order.adminAmt}) सुरक्षित है।`);
        localStorage.setItem('hai_orders', JSON.stringify(orders));
    }
}

window.onload = loadMarketplace;
        
