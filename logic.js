/**
 * HAI Global - Multi-Vendor Split Payment Logic
 * Created by: Scientist Harigovind
 * Release: 2026.02.06
 */

// 1. एडमिन और कमीशन सेटिंग्स
const HAI_ADMIN_CONFIG = {
    myUpi: "harigovindsingh91-2@okhdfcbank",
    adminCommissionPercent: 10,   // आपका 10%
    deliveryFeePercent: 5,        // डेलिवरी बॉय का 5%
    holdPaymentStatus: "HOLD"     // जब तक डेलिवरी न हो, पैसा होल्ड पर
};

// 2. मार्केटप्लेस लोड करने का फंक्शन
function loadMarketplace() {
    console.log("HAI Systems Active...");
    // यहाँ आप भविष्य में API से प्रोडक्ट्स फेच कर सकते हैं
    updateUserLocation();
}

// 3. पिन कोड/लोकेशन अपडेट
function updateUserLocation() {
    const savedProfile = JSON.parse(localStorage.getItem('hai_user_profile'));
    const pinElement = document.getElementById('pin-code');
    if (savedProfile && savedProfile.pin) {
        pinElement.innerText = "DELIVERY TO: " + savedProfile.pin;
    }
}

// 4. मुख्य पेमेंट इंजन (The Split Logic)
function payWithCommission(productId, totalAmount) {
    // कैलकुलेशन
    const adminShare = (totalAmount * HAI_ADMIN_CONFIG.adminCommissionPercent) / 100;
    const deliveryShare = (totalAmount * HAI_ADMIN_CONFIG.deliveryFeePercent) / 100;
    const sellerShare = totalAmount - (adminShare + deliveryShare);

    // डेटा तैयार करना
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

    // ऑर्डर को लोकल स्टोरेज (या डेटाबेस) में सेव करना
    saveOrderToSystem(orderData);

    // UPI पेमेंट ट्रिगर (आपका कमीशन सबसे पहले)
    // नोट: यहाँ हम एडमिन को पैसे भेज रहे हैं, बाकी पैसा बैकएंड से स्प्लिट होगा
    const upiLink = `upi://pay?pa=${HAI_ADMIN_CONFIG.myUpi}&am=${adminShare}&cu=INR&tn=HAI_ORDER_${orderData.id}_COMMISSION`;
    
    console.log(`Split Info: Admin: ${adminShare}, Seller: ${sellerShare}, Rider: ${deliveryShare}`);
    
    alert(`प्रक्रिया शुरू: ऑर्डर ID ${orderData.id}\nआपका कमीशन (₹${adminShare}) प्रोसेस हो रहा है।`);
    window.location.href = upiLink;
}

// 5. ऑर्डर सेविंग फंक्शन
function saveOrderToSystem(order) {
    let orders = JSON.parse(localStorage.getItem('hai_orders')) || [];
    orders.push(order);
    localStorage.setItem('hai_orders', JSON.stringify(orders));
}

// 6. डेलिवरी कन्फर्मेशन और राइडर पेमेंट रिलीज (यह एडमिन/राइडर पैनल से कॉल होगा)
function releaseRiderPayment(orderId) {
    let orders = JSON.parse(localStorage.getItem('hai_orders')) || [];
    let orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex !== -1) {
        orders[orderIndex].status = "DELIVERED";
        const riderAmt = orders[orderIndex].deliveryAmt;
        
        // यहाँ से राइडर के UPI पर पैसा भेजने का लॉजिक शुरू होगा
        alert(`डेलिवरी सफल! राइडर को ₹${riderAmt} रिलीज किए जा रहे हैं।`);
        
        localStorage.setItem('hai_orders', JSON.stringify(orders));
    }
}
