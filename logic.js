/**
 * HAI Global - Universal Intelligence Logic Engine
 * Owner: Scientist Harigovind
 * Version: 3.0 (Worldwide Auto-Sync + Sanskar Module)
 * NO CODE REMOVED - FULL INTEGRATION
 */

// 1. मास्टर कॉन्फ़िगरेशन (यथावत)
const HAI_SYSTEM_CONFIG = {
    adminUpi: "harigovindsingh91-2@okhdfcbank",
    commissionRate: 0.10,
    deliveryFeeRate: 0.05,
    currency: "INR",
    nodeID: "NODE-771"
};

// 2. वर्ल्डवाइड ऑटो-इंजन (Language, Currency & Region)
async function activateUniversalGrid() {
    try {
        console.log("HAI Global: Initiating Worldwide Sync...");
        // IP से लोकेशन और करेंसी का पता लगाना
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        
        // 1. ऑटो-भाषा चयन (Google Translate API के साथ सिंक)
        const userLang = navigator.language.split('-')[0]; 
        if (window.google && google.translate) {
            let combo = document.querySelector('.goog-te-combo');
            if(combo) {
                combo.value = userLang;
                combo.dispatchEvent(new Event('change'));
            }
        }

        // 2. ऑटो-करेंसी चयन (Global Mapping)
        const currencyMap = { 
            'IN': '₹', 'US': '$', 'EU': '€', 'GB': '£', 'JP': '¥', 
            'RU': '₽', 'AE': 'DH', 'CA': 'C$', 'AU': 'A$' 
        };
        const localSymbol = currencyMap[data.country_code] || data.currency || '$';
        
        // UI अपडेट (करेंसी और झंडा)
        const flagElement = document.getElementById('currency-flag');
        if(flagElement) {
            flagElement.innerText = `${data.country_name} ${localSymbol}`;
        }
        
        // लोकल स्टोरेज में लोकेशन सेव करना
        localStorage.setItem('hai_node_loc', JSON.stringify({
            city: data.city,
            country: data.country_name,
            currency: localSymbol
        }));

        console.log(`HAI Node Connected: ${data.country_name} | Node: ${data.city}`);
    } catch (error) {
        console.error("Global Sync Failed:", error);
    }
}

// 3. मार्केटप्लेस इनिशियलाइज़ेशन (यथावत + ऑटो ग्रिड कॉल)
function loadMarketplace() {
    console.log("HAI Systems Online - Authorization: Scientist Harigovind");
    
    // वर्ल्डवाइड इंजन को ट्रिगर करें
    activateUniversalGrid();
    
    // यूजर सिंक चेक
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(currentUser) {
        console.log(`Active Scientific Node: ${currentUser.email}`);
        if(document.getElementById('scoreText')) {
            renderUserStats(currentUser);
        }
    }

    const activeRider = JSON.parse(localStorage.getItem('active_rider'));
    if(activeRider) console.log(`Rider Active: ${activeRider.name}`);
}

// 4. संस्कार मॉड्यूल डैशबोर्ड रेंडरिंग
function renderUserStats(user) {
    const scoreBar = document.getElementById('scoreBar');
    if(scoreBar) {
        scoreBar.style.width = user.sanskarScore + "%";
        document.getElementById('scoreText').innerText = `सात्विक स्कोर: ${user.sanskarScore}%`;
        document.getElementById('walletBalance').innerText = user.wallet ? `₹ ${user.wallet.toFixed(2)}` : "₹ 0.00";
    }
}

// 5. मर्चेंट एवं कैमरा मॉड्यूल (Rear Camera)
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

// 6. राइडर रजिस्ट्रेशन (लॉजिस्टिक्स)
function registerRider() {
    const name = document.getElementById('r-name')?.value;
    const upi = document.getElementById('r-upi')?.value;
    if(!name || !upi) { alert("राइडर का नाम और UPI ID आवश्यक है!"); return; }

    const riderData = { role: 'RIDER', name: name, upi: upi, status: 'STANDBY' };
    localStorage.setItem('active_rider', JSON.stringify(riderData));
    alert(`स्वागत है ${name}!`);
    window.location.href = 'delivery-boy.html';
}

// 7. यूनिफाइड पेमेंट इंजन (Enriched with Sanskar Logic)
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

    // वैज्ञानिक कमीशन गणना
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

    // --- संस्कार मॉड्यूल वृद्धि ---
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

// 8. रिलीज पेमेंट्स
function releasePayments(orderId) {
    let orders = JSON.parse(localStorage.getItem('hai_orders')) || [];
    let order = orders.find(o => o.orderId === orderId);
    if (order && order.status !== "RELEASED") {
        order.status = "RELEASED";
        alert(`भुगतान सफल! \nकमीशन (₹${order.adminAmt}) सुरक्षित है।`);
        localStorage.setItem('hai_orders', JSON.stringify(orders));
    }
}

// मास्टर लोड फंक्शन
window.onload = loadMarketplace;
    
