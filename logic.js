// logic.js
let marketplaceData = JSON.parse(localStorage.getItem('hai_market')) || [];

function loadMarketplace() {
    const list = document.getElementById('product-list');
    if (marketplaceData.length === 0) {
        list.innerHTML = `<div class='col-span-2 text-center p-10 text-gray-400'>No sellers nearby yet.</div>`;
        return;
    }

    list.innerHTML = marketplaceData.map(item => `
        <div class="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
            <div class="bg-gray-200 h-32 rounded-xl mb-3 flex items-center justify-center text-gray-400">Image</div>
            <h3 class="font-bold text-sm truncate">${item.productName}</h3>
            <p class="text-[10px] text-blue-500 font-bold mb-2">${item.shopName}</p>
            <div class="flex justify-between items-center">
                <span class="font-black text-lg">₹${item.price}</span>
                <button onclick="placeOrder('${item.id}')" class="bg-blue-600 text-white text-[10px] px-3 py-2 rounded-lg font-bold">BUY</button>
            </div>
        </div>
    `).join('');
}

function placeOrder(id) {
    const otp = Math.floor(1000 + Math.random() * 9000);
    alert(`Order Confirmed! \nSecurity OTP: ${otp}\nShow this to your delivery rider.`);
}
