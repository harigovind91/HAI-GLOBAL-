// Database Simulation
let shops = JSON.parse(localStorage.getItem('hai_shops')) || [];
let orders = JSON.parse(localStorage.getItem('hai_orders')) || [];

// 1. IP Tracking Function
async function getIP() {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip;
}

// 2. Register Merchant with GPS
async function registerMerchant() {
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const newShop = {
            id: Date.now(),
            name: document.getElementById('m-name').value,
            product: document.getElementById('m-prod').value,
            price: document.getElementById('m-price').value,
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            ip: await getIP()
        };
        shops.push(newShop);
        localStorage.setItem('hai_shops', JSON.stringify(shops));
        alert("वैज्ञानिक जी, दुकान रजिस्टर हो गई! IP: " + newShop.ip);
        window.location.href = 'index.html';
    });
}

// 3. Place Order & Generate OTP
async function placeOrder(shopId) {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
        id: Date.now(),
        shopId: shopId,
        otp: otp,
        status: 'PENDING',
        userIP: await getIP()
    };
    orders.push(newOrder);
    localStorage.setItem('hai_orders', JSON.stringify(orders));
    alert("ऑर्डर सफल! रसीद OTP: " + otp);
    window.location.reload();
}

// 4. Admin - Load Global Data
function loadGlobalData() {
    const key = document.getElementById('master-key').value;
    if(key === "HAI-ADMIN-2026") { // आपकी Master Security Key
        const stats = document.getElementById('admin-stats');
        stats.innerHTML = `<h3>Total Orders: ${orders.length}</h3>` + 
            orders.map(o => `<div class='card text-black'>Order ID: ${o.id}<br>User IP: ${o.userIP}<br>OTP: ${o.otp}</div>`).join('');
    } else {
        alert("Access Denied: Incorrect Master Key");
    }
}

// 5. Initializers
function initCustomer() {
    const container = document.getElementById('shop-container');
    container.innerHTML = shops.map(s => `
        <div class="card">
            <h3 class="font-bold">${s.name}</h3>
            <p>${s.product} - ₹${s.price}</p>
            <button onclick="placeOrder(${s.id})" class="btn btn-primary mt-2">Buy Now</button>
        </div>
    `).join('') || "आसपास कोई दुकान नहीं है।";
}

