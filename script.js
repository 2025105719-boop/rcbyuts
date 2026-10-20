function showPage(pageId) {
    const allSections = document.querySelectorAll('.view-section');
    allSections.forEach(section => section.classList.add('hidden'));

    const activeSection = document.getElementById(pageId);
    if(activeSection) activeSection.classList.remove('hidden');

    const btnKembali = document.getElementById('btn-kembali');
    const btnAdmin = document.getElementById('btn-admin');
    
    if (pageId === 'page-home') {
        btnKembali.classList.add('hidden');
        btnAdmin.classList.remove('hidden');
        btnAdmin.classList.add('md:flex');
    } else {
        btnKembali.classList.remove('hidden');
        btnAdmin.classList.add('hidden');
        btnAdmin.classList.remove('md:flex');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

let currentSlide = 0;
const totalSlides = 4;
let slideInterval;

function goToSlide(index) {
    const track = document.getElementById('slider-track');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (!track) return;

    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    dots.forEach((dot, i) => {
        if (i === currentSlide) {
            dot.classList.remove('w-3', 'bg-gray-600');
            dot.classList.add('w-10', 'bg-red-600');
        } else {
            dot.classList.remove('w-10', 'bg-red-600');
            dot.classList.add('w-3', 'bg-gray-600');
        }
    });

    resetSliderTimer();
}

function nextSlide() {
    let next = (currentSlide + 1) % totalSlides;
    goToSlide(next);
}

function startSlider() {
    slideInterval = setInterval(nextSlide, 4000);
}

function resetSliderTimer() {
    clearInterval(slideInterval);
    startSlider();
}

let cart = []; 

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    
    sidebar.classList.toggle('translate-x-full');
    overlay.classList.toggle('hidden');
}

function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID').format(angka);
}

function addToCart(id, name, price, img) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ id, name, price, img, qty: 1 });
    }
    
    updateCartUI();
    
    const sidebar = document.getElementById('cart-sidebar');
    if(sidebar.classList.contains('translate-x-full')) {
        toggleCart();
    }
}

function changeQty(id, delta) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart[itemIndex].qty += delta;
        if (cart[itemIndex].qty <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartBadge = document.getElementById('cart-badge');
    
    cartItemsContainer.innerHTML = ''; 
    let totalHarga = 0;
    let totalBarang = 0;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="text-gray-500 text-center mt-10">Keranjang masih kosong.</p>`;
    } else {
        cart.forEach(item => {
            totalHarga += (item.price * item.qty);
            totalBarang += item.qty;
            
            cartItemsContainer.innerHTML += `
                <div class="flex gap-4 border-b border-gray-800 pb-4">
                    <img src="${item.img}" class="w-20 h-20 object-cover rounded border border-gray-700">
                    <div class="flex-grow">
                        <h4 class="font-bold text-white uppercase text-sm">${item.name}</h4>
                        <p class="text-red-500 font-bold mb-2">Rp ${formatRupiah(item.price)}</p>
                        <div class="flex items-center gap-3">
                            <button onclick="changeQty('${item.id}', -1)" class="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-red-600 text-white rounded font-bold transition-colors">-</button>
                            <span class="text-white font-bold">${item.qty}</span>
                            <button onclick="changeQty('${item.id}', 1)" class="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-red-600 text-white rounded font-bold transition-colors">+</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    cartTotalElement.innerText = `Rp ${formatRupiah(totalHarga)}`;
    cartBadge.innerText = totalBarang;
}

function processCheckout() {
    if (cart.length === 0) {
        alert('Keranjang Anda masih kosong!');
        return;
    }
    
    let totalHarga = 0;
    let totalBarang = 0;
    
    cart.forEach(item => {
        totalHarga += (item.price * item.qty);
        totalBarang += item.qty;
    });

    document.getElementById('modal-total').innerText = `Rp ${formatRupiah(totalHarga)}`;
    document.getElementById('modal-items').innerText = totalBarang;

    toggleCart();

    const modal = document.getElementById('success-modal');
    modal.classList.remove('hidden');
}

function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.add('hidden');
    
    cart = [];
    updateCartUI();
    showPage('page-home');
}

document.addEventListener('DOMContentLoaded', () => {
    startSlider();

    const scrollElements = document.querySelectorAll('.scroll-anim');
    const elementInView = (el, percentageScroll = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        return (elementTop <= ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100)));
    };
    const displayScrollElement = (element) => {
        element.classList.add('is-visible');
    };
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 90)) { displayScrollElement(el); }
        });
    };
    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation(); 
});