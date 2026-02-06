/**
 * HAI Global - Core Logic Engine (Modular Version)
 * Created by: Scientist Harigovind
 * Date: 2026.02.06
 * * यह फाइल यूजर, सेलर और राइडर के डेटा को अलग-अलग हैंडल करती है 
 * और एडमिन कमीशन को सुरक्षित करती है।
 */

// 1. एडमिन और स्प्लिट पेमेंट सेटिंग्स
const HAI_ADMIN_CONFIG = {
    myUpi: "harigovindsingh91-2@okhdfcbank",
    adminCommissionPercent: 10,   // आपका 10% कमीशन
    deliveryFeePercent: 5,        // डेलिवरी पार्टनर का 5%
    holdPaymentStatus: "HOLD"     // ट्रांजैक्शन सुरक्षा के लिए
};

// 2. मार्केटप्लेस और लोकेशन इनिशियलाइज़ेशन
function loadMarketplace() {
    console.log("HAI Systems Active - Welcome Scientist Harigovind");
    updateUserLocation();
}

function updateUserLocation() {
    const savedProfile = JSON.parse(localStorage.getItem('hai_user_profile'));
    const pinElement = document.getElementById('pin-code');
    if (savedProfile && savedProfile.pin && pinElement) {
        pinElement.innerText = "DELIVERY TO: " + savedProfile.pin;
    }
}

// 3. दुकानदार (Seller) रजिस्ट्रेशन और कैमरा
function openCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(function(stream) {
            alert("HAI System: Camera Access Granted - Rear Camera Active");
            // वैज्ञानिक जी, यहाँ स्ट्रीम को वीडियो एलिमेंट में जोड़ा जा सकता है
        })
        .catch(err => alert("Camera Error: " + err));
    }
}

function registerSeller() {
    const shop = document.getElementById('s-shop').value;
    const pin = document.getElementById('s-pin').value;

    if(!shop || !pin) {
        alert("कृपया दुकान का नाम और पिन कोड दर्ज करें!");
        return;
    }

    const sellerData = {
        role: 'SELLER',
        shop: shop,
        pin: pin,
        email: document.getElementById('s-email').value,
        name: document.getElementById('s-name').value,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('active_seller', JSON.stringify(sellerData));
    alert("बधाई! दुकानदार डेशबोर्ड तैयार है!");
    location.href = 'merchant-portal.html';
}

// 4. राइडर (Rider) रजिस्ट्रेशन
function registerRider() {
    const name = document.getElementById('r-name').value;
    const bank = document.getElementById('r-bank').value;

    if(!name || !bank) {
        alert("नाम और बैंक विवरण अनिवार्य है!");
        return;
    }

    const riderData = {
        role: 'RIDER',
        name: name,
        bank: bank,
        upi: document.getElementById('r-upi').value,
        pin: document.getElementById('r-pin').value,
        status: 'ACTIVE'
    };
    
    localStorage.setItem('active_rider', JSON.stringify(riderData));
    alert("डेलिवरी डेशबोर्ड तैयार है! स्वागत है, " + name);
    location.href = 'delivery-boy.html';
}

// 5. मुख्य पेमेंट इंजन (Split Logic)
function payWithCommission(productId, totalAmount) {
    // वैज्ञानिक गणना (Commission Splitting)
    const adminShare = (totalAmount * HAI_ADMIN_CONFIG.adminCommissionPercent) / 100;
    const deliveryShare = (totalAmount * HAI_ADMIN_CONFIG.deliveryFeePercent) / 100;
    const sellerShare = totalAmount - (adminShare + deliveryShare);

    const orderData = {
        id: "HAI-" + Math.floor(Math.random() * 1000000),
        prodId: productId,
        amount: totalAmount,
        adminAmt: adminShare,
        deliveryAmt: deliveryShare,
        sellerAmt: sellerShare,
        status: "PENDING_DELIVERY",
        timestamp: new Date().toISOString()
    };

    saveOrderToSystem(orderData);

    // एडमिन (आपका) UPI लिंक ट्रिगर करना
    const upiLink = `upi://pay?pa=${HAI_ADMIN_CONFIG.myUpi}&am=${adminShare}&cu=INR&tn=HAI_ORDER_${orderData.id}_COMMISSION`;
    
    console.log(`Split Logic Trace -> Admin: ${adminShare}, Seller: ${sellerShare}, Rider: ${deliveryShare}`);
    
    alert(`प्रक्रिया शुरू: ऑर्डर ID ${orderData.id}\nआपका 10% कमीशन (₹${adminShare}) सुरक्षित किया जा रहा है।`);
    window.location.href = upiLink;
}

function saveOrderToSystem(order) {
    let orders = JSON.parse(localStorage.getItem('hai_orders')) || [];
    orders.push(order);
    localStorage.setItem('hai_orders', JSON.stringify(orders));
}

// 6. राइडर पेमेंट रिलीज (सत्यापन के बाद)
function releaseRiderPayment(orderId) {
    let orders = JSON.parse(localStorage.getItem('hai_orders')) || [];
    let orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex !== -1) {
        orders[orderIndex].status = "DELIVERED";
        const riderAmt = orders[orderIndex].deliveryAmt;
        
        alert(`डेलिवरी सफल! राइडर को ₹${riderAmt} रिलीज करने का निर्देश भेजा गया।`);
        localStorage.setItem('hai_orders', JSON.stringify(orders));
    }
}

// लोड होने पर मार्केटप्लेस चेक करें
window.onload = loadMarketplace;

