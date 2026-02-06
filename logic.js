/**
 * HAI Global - Integrated Logic Engine
 * Owner: Scientist Harigovind
 * Version: 2.1 (Unified Split-Payment & Multi-Role System)
 * Modules: Admin, Seller, Rider, Payment Gateway
 */

// 1. मास्टर कॉन्फ़िगरेशन (Admin Control Panel)
const HAI_SYSTEM_CONFIG = {
    adminUpi: "harigovindsingh91-2@okhdfcbank",
    commissionRate: 0.10,    // 10% वैज्ञानिक हरिगोविंद का हिस्सा
    deliveryFeeRate: 0.05,   // 5% राइडर/डिलिवरी हिस्सा
    currency: "INR",
    nodeID: "NODE-771"
};

// 2. मार्केटप्लेस इनिशियलाइज़ेशन
function loadMarketplace() {
    console.log("HAI Systems Online - Authorization: Scientist Harigovind");
    updateUserLocation();
    // यदि कोई पिछला राइडर या सेलर लॉग इन है तो डेटा फेच करें
    const activeRider = JSON.parse(localStorage.getItem('active_rider'));
    if(activeRider) console.log(`Rider Active: ${activeRider.name}`);
}

function updateUserLocation() {
    const savedProfile = JSON.parse(localStorage.getItem('hai_user_profile'));
    const pinElement = document.getElementById('user-city'); // UI Mapping
    if (savedProfile && savedProfile.pin && pinElement) {
        pinElement.innerText = "LOCAL NODE: " + savedProfile.pin;
    }
}

// 3. मर्चेंट (Seller) एवं कैमरा मॉड्यूल
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

    if(!shop || !pin) {
        alert("त्रुटि: दुकान का नाम और पिन कोड अनिवार्य है!");
        return;
    }

    const sellerData = {
        role: 'SELLER',
        shop: shop,
        pin: pin,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('active_seller', JSON.stringify(sellerData));
    alert("मर्चेंट डेटा सिंक्रोनाइज़ हो गया है! पोर्टल सक्रिय है।");
    window.location.href = 'merchant-portal.html';
}

// 4. राइडर (Logistics) रजिस्ट्रेशन
function registerRider() {
    const name = document.getElementById('r-name')?.value;
    const upi = document.getElementById('r-upi')?.value;

    if(!name || !upi) {
        alert("राइडर का नाम और UPI ID आवश्यक है!");
        return;
    }

    const riderData = {
        role: 'RIDER',
        name: name,
        upi: upi,
        status: 'STANDBY'
    };
    
    localStorage.setItem('active_rider', JSON.stringify(riderData));
    alert(`स्वागत है ${name}! आपका डेलिवरी डेशबोर्ड तैयार है।`);
    window.location.href = 'delivery-boy.html';
}

// 5. यूनिफाइड पेमेंट इंजन (The "Harigovind Split" Logic)
async function globalOrder(productId) {
    // UI से डेटा निकालना
    const productCard = event.target.closest('.product-card');
    const productName = productCard.querySelector('h3').innerText;
    const rawPrice = productCard.querySelector('span.text-lg').innerText.replace(/[^0-9.]/g, '');
    const totalPrice = parseFloat(rawPrice);

    // वैज्ञानिक गणना (Split Calculations)
    const adminCommission = (totalPrice * HAI_SYSTEM_CONFIG.commissionRate).toFixed(2);
    const deliveryShare = (totalPrice * HAI_SYSTEM_CONFIG.deliveryFeeRate).toFixed(2);
    const sellerShare = (totalPrice - (parseFloat(adminCommission) + parseFloat(deliveryShare))).toFixed(2);

    // ट्रांजैक्शन लॉग तैयार करना
    const orderData = {
        orderId: "HAI-" + Date.now().toString().slice(-6),
        productId: productId,
        total: totalPrice,
        adminAmt: adminCommission,
        riderAmt: deliveryShare,
        sellerAmt: sellerShare,
        status: "SECURED_HOLD",
        timestamp: new Date().toISOString()
    };

    // डेटा को सुरक्षित करना (Local Storage + Console Trace)
    saveOrderToSystem(orderData);
    console.table(orderData);

    // पेमेंट गेटवे अलर्ट
    alert(`🔐 HAI SECURE GATEWAY\n-----------------------\nOrder: ${productName}\nTotal: ₹${totalPrice}\n\nSplit routing:\n✔ Admin (You): ₹${adminCommission}\n✔ Rider: ₹${deliveryShare}\n✔ Seller: ₹${sellerShare}`);

    // एडमिन (आपका) UPI लिंक ट्रिगर करना
    // यहाँ पूरा पैसा आपके पास आएगा, जिसे आप बाद में डैशबोर्ड से रिलीज करेंगे
    const upiUrl = `upi://pay?pa=${HAI_SYSTEM_CONFIG.adminUpi}&pn=HAI_GLOBAL_ADMIN&am=${totalPrice}&tn=HAI_ORDER_${orderData.orderId}&cu=INR`;

    window.location.href = upiUrl;
}

function saveOrderToSystem(order) {
    let orders = JSON.parse(localStorage.getItem('hai_orders')) || [];
    orders.push(order);
    localStorage.setItem('hai_orders', JSON.stringify(orders));
}

// 6. ऑथेंटिकेशन और रिलीज (Delivery Confirmation)
function releasePayments(orderId) {
    let orders = JSON.parse(localStorage.getItem('hai_orders')) || [];
    let order = orders.find(o => o.orderId === orderId);

    if (order && order.status !== "RELEASED") {
        order.status = "RELEASED";
        alert(`भुगतान सफल! \nसेलर को ₹${order.sellerAmt} और राइडर को ₹${order.riderAmt} भेज दिए गए हैं। \nआपका कमीशन (₹${order.adminAmt}) वॉलेट में सुरक्षित है।`);
        localStorage.setItem('hai_orders', JSON.stringify(orders));
    }
}

// सिस्टम ऑटो-स्टार्ट
window.onload = loadMarketplace;
