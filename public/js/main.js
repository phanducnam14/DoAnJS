const homeBtn = document.getElementById('btnHome');
const productsBtn = document.getElementById('btnProducts');
const authBtn = document.getElementById('btnAuth');
const homeSection = document.getElementById('homeSection');
const productsSection = document.getElementById('productsSection');
const authSection = document.getElementById('authSection');
const productsList = document.getElementById('productsList');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const authInfo = document.getElementById('authInfo');

const showPanel = (panel) => {
  homeSection.classList.remove('active');
  productsSection.classList.remove('active');
  authSection.classList.remove('active');
  homeBtn.classList.remove('active');
  productsBtn.classList.remove('active');
  authBtn.classList.remove('active');

  if (panel === 'home') {
    homeSection.classList.add('active');
    homeBtn.classList.add('active');
  }
  if (panel === 'products') {
    productsSection.classList.add('active');
    productsBtn.classList.add('active');
  }
  if (panel === 'auth') {
    authSection.classList.add('active');
    authBtn.classList.add('active');
  }
};

homeBtn.addEventListener('click', () => showPanel('home'));
productsBtn.addEventListener('click', () => showPanel('products'));
authBtn.addEventListener('click', () => showPanel('auth'));

const apiBase = window.location.origin;

const fetchProducts = async () => {
  productsList.innerHTML = '<p>Đang tải sản phẩm...</p>';
  try {
    const res = await fetch(`${apiBase}/api/products`);
    const data = await res.json();
    if (!data.success) {
      productsList.innerHTML = `<p>Lỗi: ${data.message || 'Không lấy được sản phẩm'}</p>`;
      return;
    }
    if (!data.data || !data.data.products || data.data.products.length === 0) {
      productsList.innerHTML = '<p>Không có sản phẩm.</p>';
      return;
    }

    productsList.innerHTML = data.data.products
      .map((product) => `
        <div class="product-card">
          <h4>${product.title || 'Sản phẩm'}</h4>
          <p>${product.description || 'Không có mô tả'}</p>
          <p><strong>Giá:</strong> ${product.price ? product.price.toLocaleString() + ' VND' : 'Chưa có'}</p>
          <p><strong>Trạng thái:</strong> ${product.isSold ? 'Đã bán' : 'Còn hàng'}</p>
        </div>
      `)
      .join('');
  } catch (err) {
    productsList.innerHTML = `<p>Lỗi: ${err.message}</p>`;
  }
};

const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);

const showAuthInfo = (message, success = true) => {
  authInfo.textContent = message;
  authInfo.style.color = success ? '#0f76ff' : '#e11d48';
};

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(registerForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(`${apiBase}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      showAuthInfo('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
      registerForm.reset();
    } else {
      showAuthInfo(data.message || 'Đăng ký thất bại.', false);
    }
  } catch (err) {
    showAuthInfo(err.message, false);
  }
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(`${apiBase}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success && data.data?.tokens?.accessToken) {
      setToken(data.data.tokens.accessToken);
      showAuthInfo('Đăng nhập thành công! Token đã lưu vào localStorage.');
      loginForm.reset();
    } else {
      showAuthInfo(data.message || 'Đăng nhập thất bại.', false);
    }
  } catch (err) {
    showAuthInfo(err.message, false);
  }
});

fetchProducts();
