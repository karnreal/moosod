// รายการสินค้าจำลองของร้านเจตหมูสด
const products = [
    {
        id: 'pork-belly',
        name: 'หมูสามชั้นเส้นพรีเมียม',
        category: 'fresh',
        price: 180,
        unit: 'กิโลกรัม',
        desc: 'หมูสามชั้นเกรดเอ ไล่ชั้นไขมันและเนื้ออย่างสวยงาม เหมาะสำหรับทำหมูกรอบ ชาบู หรือต้มพะโล้',
        image: 'images/pork_belly.png',
        badge: 'ขายดีที่สุด',
        isHot: true
    },
    {
        id: 'pork-collar',
        name: 'สันคอหมูสุกใสลายหินอ่อน',
        category: 'fresh',
        price: 190,
        unit: 'กิโลกรัม',
        desc: 'สันคอแทรกมันลายหินอ่อนเนื้อนุ่ม นุ่มละมุนลิ้น เหมาะสำหรับการทำปิ้งย่าง หมูกระทะ ชาบู หรือแกง',
        image: 'images/pork_collar.png',
        badge: 'แนะนำ',
        isHot: false
    },
    {
        id: 'minced-pork',
        name: 'เนื้อหมูบดอนามัย',
        category: 'processed',
        price: 140,
        unit: 'กิโลกรัม',
        desc: 'หมูบดละเอียดคัดสรรส่วนเนื้อสะอาด ปลอดสารเร่งเนื้อแดง ไขมันต่ำ เหมาะสำหรับทำแกงจืด ทอดมัน',
        image: 'images/minced_pork.png',
        badge: 'ยอดนิยม',
        isHot: false
    },
    {
        id: 'pork-ribs',
        name: 'ซี่โครงหมูอ่อนคัดพิเศษ',
        category: 'fresh',
        price: 160,
        unit: 'กิโลกรัม',
        desc: 'ซี่โครงกระดูกอ่อนเนื้อติดเยอะ เคี้ยวกรุบกรอบ เหมาะสำหรับทำต้มแซ่บ ซี่โครงทอดกระเทียม หรือเมนูตุ๋น',
        image: 'images/pork_ribs.png',
        badge: 'สดใหม่',
        isHot: false
    }
];

// สถานะการสั่งซื้อ (ตะกร้าสินค้า)
let cart = {};

// เริ่มต้นโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    renderProducts(products);
    initFilters();
    initSearch();
    initScrollReveal();
    updateOrderSummary();
    loadTelegramSettings();
});

// จัดการสถานะ Navbar เมื่อเลื่อนจอ
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// แสดงรายการสินค้าลงในหน้าเว็บ
function renderProducts(productsToRender) {
    const catalogContainer = document.getElementById('product-catalog');
    if (!catalogContainer) return;

    if (productsToRender.length === 0) {
        catalogContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search fs-1 text-muted mb-3"></i>
                <p class="text-muted fs-5">ไม่พบสินค้าที่คุณค้นหา ลองใช้คำอื่นดูนะ</p>
            </div>
        `;
        return;
    }

    catalogContainer.innerHTML = '';
    productsToRender.forEach(product => {
        const currentQty = cart[product.id] || 0;
        const badgeHTML = product.badge
            ? `<span class="product-badge ${product.isHot ? 'hot' : ''}">${product.badge}</span>`
            : '';

        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-3 mb-4 scroll-reveal';
        card.innerHTML = `
            <div class="product-card">
                <div class="product-img-wrapper">
                    <img src="${product.image}" class="product-img" alt="${product.name}">
                    ${badgeHTML}
                </div>
                <div class="product-info">
                    <h4 class="product-title">${product.name}</h4>
                    <p class="product-desc">${product.desc}</p>
                    <div class="product-price-row">
                        <div class="product-price">
                            ฿${product.price} <span class="product-unit">/ ${product.unit}</span>
                        </div>
                    </div>
                    <div class="mt-auto pt-3">
                        <div class="quantity-control">
                            <button class="qty-btn minus" onclick="changeQty('${product.id}', -1)">
                                <i class="bi bi-dash-lg"></i>
                            </button>
                            <input type="text" class="qty-input" id="qty-${product.id}" value="${currentQty}">
                            <button class="qty-btn plus" onclick="changeQty('${product.id}', 1)">
                                <i class="bi bi-plus-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        catalogContainer.appendChild(card);
    });

    // เรียกใช้แอนิเมชันเปิดเผยข้อมูลสำหรับการ์ดที่เพิ่งสร้างใหม่
    initScrollReveal();
}

// กรองหมวดหมู่สินค้า
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.getAttribute('data-filter');
            const searchInput = document.getElementById('search-input');
            searchInput.value = ''; // เคลียร์ช่องค้นหาเมื่อกดฟิลเตอร์

            if (category === 'all') {
                renderProducts(products);
            } else {
                const filtered = products.filter(p => p.category === category);
                renderProducts(filtered);
            }
        });
    });
}

// ค้นหาสินค้า
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        // รีเซ็ตปุ่มกรองเป็น 'ทั้งหมด'
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            if (btn.getAttribute('data-filter') === 'all') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.desc.toLowerCase().includes(query)
        );
        renderProducts(filtered);
    });
}

// เปลี่ยนแปลงจำนวนสินค้าในตะกร้า
window.changeQty = function (productId, change) {
    const input = document.getElementById(`qty-${productId}`);
    let currentVal = parseInt(input.value) || 0;
    let newVal = currentVal + change;

    if (newVal < 0) newVal = 0;
    if (newVal > 100) newVal = 100; // ลิมิตสั่งซื้อสูงสุด 100 กิโลกรัมต่อรายการ

    input.value = newVal;

    if (newVal === 0) {
        delete cart[productId];
    } else {
        cart[productId] = newVal;
    }

    // อัปเดตราคารวมและบิลจำลอง
    updateOrderSummary();
};

// อัปเดตตารางสรุปราคาสั่งซื้อ
function updateOrderSummary() {
    const summaryContainer = document.getElementById('calc-items-list');
    const totalItemsEl = document.getElementById('total-items-qty');
    const subtotalEl = document.getElementById('subtotal-price');
    const deliveryEl = document.getElementById('delivery-fee');
    const grandTotalEl = document.getElementById('grand-total-price');
    const orderSection = document.getElementById('order-calculator-section');

    if (!summaryContainer) return;

    let itemsHtml = '';
    let totalItems = 0;
    let subtotal = 0;

    // ค้นหาสินค้าที่มีการเลือกสั่งซื้อ
    products.forEach(product => {
        const qty = cart[product.id] || 0;
        if (qty > 0) {
            const itemTotal = product.price * qty;
            totalItems += qty;
            subtotal += itemTotal;

            itemsHtml += `
                <div class="calculator-item">
                    <img src="${product.image}" alt="${product.name}" class="calc-item-img">
                    <div class="calc-item-details">
                        <div class="calc-item-title">${product.name}</div>
                        <div class="calc-item-price">฿${product.price} / ${product.unit}</div>
                    </div>
                    <div class="quantity-control me-3" style="max-width: 120px;">
                        <button class="qty-btn minus" style="width: 30px; height: 30px; font-size: 0.9rem;" onclick="changeQty('${product.id}', -1)">
                            <i class="bi bi-dash-lg"></i>
                        </button>
                        <input type="text" class="qty-input" style="width: 40px; font-size: 0.95rem;" id="calc-qty-${product.id}" value="${qty}">
                        <button class="qty-btn plus" style="width: 30px; height: 30px; font-size: 0.9rem;" onclick="changeQty('${product.id}', 1)">
                            <i class="bi bi-plus-lg"></i>
                        </button>
                    </div>
                    <div class="calc-item-total">฿${itemTotal.toLocaleString()}</div>
                </div>
            `;
        }
    });

    if (totalItems === 0) {
        summaryContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-cart3 fs-1 text-muted mb-3 d-block"></i>
                <p class="text-muted">ยังไม่ได้เลือกสินค้าเพื่อคำนวณราคา<br>กดเพิ่มจำนวนสินค้าที่ต้องการจากรายการสินค้าด้านบน</p>
            </div>
        `;
        totalItemsEl.textContent = '0 กิโลกรัม';
        subtotalEl.textContent = '฿0';
        deliveryEl.textContent = 'คำนวณตามระยะทาง';
        grandTotalEl.textContent = '฿0';
        return;
    }

    summaryContainer.innerHTML = itemsHtml;
    totalItemsEl.textContent = `${totalItems} กิโลกรัม`;
    subtotalEl.textContent = `฿${subtotal.toLocaleString()}`;

    // ตั้งค่าบริการส่งฟรีเมื่อสั่งซื้อเกิน 500 บาท หรือคิดค่าส่งเริ่มต้น 50 บาท
    const deliveryFee = subtotal >= 500 ? 0 : 50;
    deliveryEl.textContent = deliveryFee === 0 ? 'ส่งฟรี (โปรโมชัน)' : `฿${deliveryFee}`;

    const grandTotal = subtotal + deliveryFee;
    grandTotalEl.textContent = `฿${grandTotal.toLocaleString()}`;
}

// ส่งรายการสั่งซื้อไปยัง LINE
window.sendOrderToLine = function () {
    let orderDetails = [];
    let subtotal = 0;
    let totalItems = 0;

    products.forEach(product => {
        const qty = cart[product.id] || 0;
        if (qty > 0) {
            const price = product.price * qty;
            orderDetails.push(`- ${product.name} จำนวน ${qty} ${product.unit} (฿${price.toLocaleString()})`);
            subtotal += price;
            totalItems += qty;
        }
    });

    if (orderDetails.length === 0) {
        alert('กรุณาเลือกเนื้อหมูที่ต้องการสั่งซื้อก่อนคำนวณบิลส่งไลน์ครับ');
        return;
    }

    const deliveryFee = subtotal >= 500 ? 0 : 50;
    const grandTotal = subtotal + deliveryFee;
    const deliveryText = deliveryFee === 0 ? 'ส่งฟรี (สั่งขั้นต่ำครบ 500.-)' : `฿${deliveryFee}`;

    // สร้างข้อความสวยงามสำหรับส่งทาง LINE
    const message =
        `🐷 สนใจสั่งซื้อหมูสด [ร้านเจตหมูสด] 🐷
---------------------------------
รายการสินค้าที่ต้องการสั่ง:
${orderDetails.join('\n')}

💰 รายละเอียดราคารวม:
- ราคารวมสินค้า: ฿${subtotal.toLocaleString()}
- ค่าบริการจัดส่ง: ${deliveryText}
- ยอดสุทธิที่ต้องชำระ: ฿${grandTotal.toLocaleString()}
---------------------------------
📌 ข้อมูลลูกค้าสำหรับจัดส่ง:
ชื่อผู้รับ: [กรุณากรอกชื่อของคุณ]
เบอร์โทรศัพท์: [กรุณากรอกเบอร์โทร]
ที่อยู่จัดส่ง: [กรุณากรอกที่อยู่]
เวลาที่สะดวกรับของ: [กรุณาระบุเวลา]`;

    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(message)}`;
    window.open(lineUrl, '_blank');
};

// แอนิเมชันเปิดตัวหน้าเว็บตอน Scroll
function initScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    const windowHeight = window.innerHeight;
    const revealPoint = 100;

    function reveal() {
        reveals.forEach(element => {
            const revealTop = element.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', reveal);
    // รันทันทีหนึ่งครั้งเพื่อแสดงหน้าแรก
    reveal();
}

// === ระบบบอต Telegram ===

// บันทึกค่าตั้งค่า Telegram เข้า localStorage
window.saveTelegramSettings = function () {
    const token = document.getElementById('tg-bot-token').value.trim();
    const chatId = document.getElementById('tg-chat-id').value.trim();
    localStorage.setItem('tg_bot_token', token);
    localStorage.setItem('tg_chat_id', chatId);

    updateTelegramFab(chatId);

    // ปิด Modal
    const modalEl = document.getElementById('telegramSettingsModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) {
        modal.hide();
    } else {
        // ดึง instance หรือสร้างใหม่เมื่อเรียกตรงไม่ได้
        const modalInstance = new bootstrap.Modal(modalEl);
        modalInstance.hide();
    }

    alert('บันทึกการตั้งค่า Telegram Bot สำเร็จ!');
};

// โหลดค่าตั้งค่า Telegram จาก localStorage
window.loadTelegramSettings = function () {
    const token = localStorage.getItem('tg_bot_token') || '';
    const chatId = localStorage.getItem('tg_chat_id') || '';

    const tokenInput = document.getElementById('tg-bot-token');
    const chatIdInput = document.getElementById('tg-chat-id');

    if (tokenInput) tokenInput.value = token;
    if (chatIdInput) chatIdInput.value = chatId;

    updateTelegramFab(chatId);
};

// อัปเดตลิงก์ FAB Telegram
function updateTelegramFab(chatId) {
    const fabTelegram = document.getElementById('fab-telegram-link');
    if (!fabTelegram) return;

    if (chatId && !chatId.startsWith('-') && isNaN(chatId)) {
        // หากป้อนเป็น Username (เช่น @jadepork หรือ jadepork)
        const username = chatId.replace('@', '');
        fabTelegram.href = `https://t.me/${username}`;
    } else {
        // ลิงก์เริ่มต้นหากยังไม่ได้ระบุ
        fabTelegram.href = `https://t.me/`;
    }
}

// ส่งรายการสั่งซื้อไปยังบอต Telegram
window.sendOrderToTelegram = function () {
    const token = localStorage.getItem('tg_bot_token');
    const chatId = localStorage.getItem('tg_chat_id');

    if (!token || !chatId) {
        const modalEl = document.getElementById('telegramSettingsModal');
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
        alert('กรุณากรอก Bot Token และ Chat ID ของคุณ เพื่อเริ่มใช้งานการส่งออเดอร์เข้า Telegram');
        return;
    }

    let orderDetails = [];
    let subtotal = 0;
    let totalItems = 0;

    products.forEach(product => {
        const qty = cart[product.id] || 0;
        if (qty > 0) {
            const price = product.price * qty;
            orderDetails.push(`- ${product.name} จำนวน ${qty} ${product.unit} (฿${price.toLocaleString()})`);
            subtotal += price;
            totalItems += qty;
        }
    });

    if (orderDetails.length === 0) {
        alert('กรุณาเลือกเนื้อหมูที่ต้องการสั่งซื้อก่อนคำนวณบิลส่ง Telegram ครับ');
        return;
    }

    const deliveryFee = subtotal >= 500 ? 0 : 50;
    const grandTotal = subtotal + deliveryFee;
    const deliveryText = deliveryFee === 0 ? 'ส่งฟรี (สั่งขั้นต่ำครบ 500.-)' : `฿${deliveryFee}`;

    const message =
        `🐷 สนใจสั่งซื้อหมูสด [ร้านเจตหมูสด] 🐷
---------------------------------
รายการสินค้าที่ต้องการสั่ง:
${orderDetails.join('\n')}

💰 รายละเอียดราคารวม:
- ราคารวมสินค้า: ฿${subtotal.toLocaleString()}
- ค่าบริการจัดส่ง: ${deliveryText}
- ยอดสุทธิที่ต้องชำระ: ฿${grandTotal.toLocaleString()}
---------------------------------
📌 ข้อมูลลูกค้าสำหรับจัดส่ง:
ชื่อผู้รับ: [กรุณากรอกชื่อของคุณ]
เบอร์โทรศัพท์: [กรุณากรอกเบอร์โทร]
ที่อยู่จัดส่ง: [กรุณากรอกที่อยู่]
เวลาที่สะดวกรับของ: [กรุณาระบุเวลา]`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const data = {
        chat_id: chatId,
        text: message
    };

    const btn = document.getElementById('btn-send-telegram');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> กำลังส่ง...`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('ไม่สามารถส่งข้อความได้ กรุณาตรวจสอบความถูกต้องของ Token/Chat ID หรือเช็คว่านำบอตเข้าแชท/กลุ่มนั้นหรือยัง');
            }
            return response.json();
        })
        .then(result => {
            alert('ส่งใบสั่งซื้อไปยัง Telegram Bot สำเร็จแล้ว! ทางร้านจะตอบกลับโดยเร็วที่สุด');
        })
        .catch(error => {
            console.error('Error sending to Telegram:', error);
            alert(`เกิดข้อผิดพลาด: ${error.message}`);
        })
        .finally(() => {
            btn.disabled = false;
            btn.innerHTML = originalText;
        });
};
