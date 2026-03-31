const apiBase = window.location.origin;

const authScreen = document.getElementById('authScreen');
const appShell = document.getElementById('appShell');
const loginPanel = document.getElementById('loginPanel');
const registerPanel = document.getElementById('registerPanel');
const showLoginBtn = document.getElementById('showLoginBtn');
const showRegisterBtn = document.getElementById('showRegisterBtn');
const authMessage = document.getElementById('authMessage');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const mainMenuLinks = document.querySelectorAll('#mainMenu a');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('pageTitle');
const globalMessage = document.getElementById('globalMessage');
const sessionStatus = document.getElementById('sessionStatus');
const sessionUser = document.getElementById('sessionUser');
const logoutBtn = document.getElementById('logoutBtn');

const globalSearchForm = document.getElementById('globalSearchForm');
const globalSearchInput = document.getElementById('globalSearchInput');
const categoryChips = document.getElementById('categoryChips');
const filterCategorySelect = document.getElementById('filterCategory');
const dashboardProducts = document.getElementById('dashboardProducts');
const productsList = document.getElementById('productsList');
const favoritesList = document.getElementById('favoritesList');
const productDetail = document.getElementById('productDetail');
const profileSummary = document.getElementById('profileSummary');
const profileResult = document.getElementById('profileResult');
const sellResult = document.getElementById('sellResult');
const productFilters = document.getElementById('productFilters');
const createProductForm = document.getElementById('createProductForm');
const profileForm = document.getElementById('profileForm');
const avatarForm = document.getElementById('avatarForm');
const refreshProductsBtn = document.getElementById('refreshProductsBtn');
const refreshFavoritesBtn = document.getElementById('refreshFavoritesBtn');
const paginationInfo = document.getElementById('paginationInfo');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');

const filterProvinceSelect = document.getElementById('filterProvince');
const filterDistrictSelect = document.getElementById('filterDistrict');
const filterDistrictField = document.getElementById('filterDistrictField');
const sellCategorySelect = document.getElementById('sellCategory');
const sellProvinceSelect = document.getElementById('sellProvince');
const sellDistrictSelect = document.getElementById('sellDistrict');
const sellDistrictField = document.getElementById('sellDistrictField');
const sellLocationInput = document.getElementById('sellLocation');
const profileProvinceSelect = document.getElementById('profileProvince');
const profileDistrictSelect = document.getElementById('profileDistrict');
const profileDistrictField = document.getElementById('profileDistrictField');
const profileLocationInput = document.getElementById('profileLocation');

const profileNameInput = profileForm.elements.namedItem('name');
const profilePhoneInput = profileForm.elements.namedItem('phone');

const state = {
  categories: [],
  locations: [],
  locationsByProvince: {},
  currentUser: loadUser(),
  products: [],
  featuredProducts: [],
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
    limit: 12
  },
  filters: {
    search: '',
    category: '',
    province: '',
    district: '',
    boosted: false
  }
};

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function loadUser() {
  const raw = localStorage.getItem('currentUser');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    localStorage.removeItem('currentUser');
    return null;
  }
}

function setUser(user) {
  state.currentUser = user;
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
}

function clearSession() {
  localStorage.removeItem('token');
  setUser(null);
  updateSessionUI();
}

function isAuthenticated() {
  return Boolean(getToken());
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatCurrency(value) {
  if (typeof value !== 'number') return 'Chưa có giá';
  return `${value.toLocaleString('vi-VN')} đ`;
}

function formatCondition(value) {
  const map = {
    new: 'Mới',
    like_new: 'Như mới',
    good: 'Tốt',
    used: 'Đã sử dụng'
  };

  return map[value] || 'Khác';
}

function formatLocation(value) {
  if (!value) return 'Chưa cập nhật';
  return [value.province, value.district, value.ward].filter(Boolean).join(' - ');
}

function setBanner(element, message, type = 'info') {
  element.textContent = message;
  element.classList.remove('hidden', 'error');
  if (type === 'error') {
    element.classList.add('error');
  }
}

function clearBanner(element) {
  element.textContent = '';
  element.classList.add('hidden');
  element.classList.remove('error');
}

function setInlineBox(element, message, type = 'info') {
  element.textContent = message;
  element.classList.remove('error');
  if (type === 'error') {
    element.classList.add('error');
  }
}

function buildStateCard(title, text, stateClass) {
  return `
    <div class="${stateClass}">
      <div>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(text)}</p>
      </div>
    </div>
  `;
}

async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getToken();

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${apiBase}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Yêu cầu thất bại');
  }

  return data;
}

function fillSelect(select, items, formatter) {
  const placeholder = select.dataset.placeholder || select.querySelector('option')?.textContent || 'Chọn';
  select.innerHTML = `<option value="">${placeholder}</option>`;

  items.forEach((item) => {
    const option = document.createElement('option');
    option.value = item._id;
    option.textContent = formatter(item);
    select.appendChild(option);
  });
}

function buildLocationsByProvince(locations) {
  return locations.reduce((groups, item) => {
    if (!groups[item.province]) {
      groups[item.province] = [];
    }

    groups[item.province].push(item);
    return groups;
  }, {});
}

function fillTextSelect(select, items) {
  const placeholder = select.dataset.placeholder || select.querySelector('option')?.textContent || 'Chọn';
  select.innerHTML = `<option value="">${placeholder}</option>`;

  items.forEach((item) => {
    const option = document.createElement('option');
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

function toggleDistrictField(field, select, visible) {
  field.classList.toggle('hidden', !visible);
  select.disabled = !visible;
}

function populateDistrictSelect(select, province) {
  const districts = (state.locationsByProvince[province] || []).map((item) => item.district);
  fillTextSelect(select, districts);
}

function syncLocationSelector({ provinceSelect, districtSelect, districtField, hiddenInput, province, locationId, allowEmptyDistrict = false }) {
  provinceSelect.value = province || '';

  if (!province) {
    hiddenInput.value = '';
    districtSelect.value = '';
    toggleDistrictField(districtField, districtSelect, false);
    return;
  }

  populateDistrictSelect(districtSelect, province);
  toggleDistrictField(districtField, districtSelect, true);

  if (locationId) {
    const match = (state.locationsByProvince[province] || []).find((item) => item._id === locationId);
    districtSelect.value = match?.district || '';
    hiddenInput.value = match?._id || '';
    return;
  }

  districtSelect.value = allowEmptyDistrict ? '' : districtSelect.value;
  hiddenInput.value = '';
}

function bindLocationSelector({ provinceSelect, districtSelect, districtField, hiddenInput, requireDistrict }) {
  provinceSelect.addEventListener('change', () => {
    const province = provinceSelect.value;

    if (!province) {
      hiddenInput.value = '';
      districtSelect.value = '';
      districtSelect.required = false;
      toggleDistrictField(districtField, districtSelect, false);
      return;
    }

    populateDistrictSelect(districtSelect, province);
    districtSelect.value = '';
    hiddenInput.value = '';
    districtSelect.required = requireDistrict;
    toggleDistrictField(districtField, districtSelect, true);
  });

  districtSelect.addEventListener('change', () => {
    const province = provinceSelect.value;
    const district = districtSelect.value;
    const match = (state.locationsByProvince[province] || []).find((item) => item.district === district);
    hiddenInput.value = match?._id || '';
  });
}

function populateProvinceFilters() {
  const provinces = Object.keys(state.locationsByProvince).sort((a, b) => a.localeCompare(b, 'vi'));
  fillTextSelect(filterProvinceSelect, provinces);
  fillTextSelect(sellProvinceSelect, provinces);
  fillTextSelect(profileProvinceSelect, provinces);
}

function populateMetadataControls() {
  const categoryFormatter = (item) => item.name;
  fillSelect(filterCategorySelect, state.categories, categoryFormatter);
  fillSelect(sellCategorySelect, state.categories, categoryFormatter);
  populateProvinceFilters();
}

async function ensureMetadataLoaded() {
  if (state.categories.length && state.locations.length) {
    return;
  }

  await loadMetadata();
}

function updateSessionUI() {
  if (state.currentUser) {
    sessionStatus.textContent = 'Đã đăng nhập';
    sessionUser.textContent = `${state.currentUser.name || 'Người dùng'} | ${state.currentUser.email || ''}`;
    logoutBtn.classList.remove('hidden');
  } else {
    sessionStatus.textContent = 'Chưa đăng nhập';
    sessionUser.textContent = 'Vui lòng đăng nhập để sử dụng hệ thống.';
    logoutBtn.classList.add('hidden');
  }
}

function showAuthScreen(tab = 'login') {
  authScreen.classList.remove('hidden');
  appShell.classList.add('hidden');
  openAuthTab(tab);
}

function showAppShell() {
  authScreen.classList.add('hidden');
  appShell.classList.remove('hidden');
}

function openAuthTab(tab) {
  const isLogin = tab === 'login';
  loginPanel.classList.toggle('active', isLogin);
  registerPanel.classList.toggle('active', !isLogin);
  showLoginBtn.classList.toggle('active', isLogin);
  showRegisterBtn.classList.toggle('active', !isLogin);
  clearBanner(authMessage);
}

function syncFiltersToForm() {
  productFilters.search.value = state.filters.search;
  productFilters.category.value = state.filters.category;
  filterProvinceSelect.value = state.filters.province;
  if (state.filters.province) {
    populateDistrictSelect(filterDistrictSelect, state.filters.province);
    toggleDistrictField(filterDistrictField, filterDistrictSelect, true);
    filterDistrictSelect.value = state.filters.district;
  } else {
    filterDistrictSelect.value = '';
    toggleDistrictField(filterDistrictField, filterDistrictSelect, false);
  }
  productFilters.boosted.checked = state.filters.boosted;
  globalSearchInput.value = state.filters.search;
}

function renderCategoryChips() {
  const allChip = `<button type="button" class="chip ${state.filters.category ? '' : 'active'}" data-category="">Tất cả</button>`;
  const items = state.categories.map((item) => `
    <button type="button" class="chip ${state.filters.category === item._id ? 'active' : ''}" data-category="${item._id}">
      ${escapeHtml(item.name)}
    </button>
  `).join('');

  categoryChips.innerHTML = allChip + items;
}

function updatePaginationUI() {
  const current = state.pagination.page;
  const totalPages = state.pagination.pages || 1;
  const totalItems = state.pagination.total || 0;

  paginationInfo.textContent = `Trang ${current} / ${totalPages} • ${totalItems} sản phẩm`;
  prevPageBtn.disabled = current <= 1;
  nextPageBtn.disabled = current >= totalPages;
}

function renderDashboardProducts() {
  if (!state.featuredProducts.length) {
    dashboardProducts.innerHTML = buildStateCard('Chưa có sản phẩm', 'Hiện chưa có sản phẩm để hiển thị trong khu vực đề xuất.', 'empty-state');
    return;
  }

  dashboardProducts.innerHTML = state.featuredProducts.map((product) => productCardTemplate(product, false)).join('');
}

function productCardTemplate(product, allowBoost = true) {
  return `
    <article class="product-card">
      <div class="product-meta">
        <span class="meta-tag">${product.isBoosted ? 'Đã boost' : 'Tin thường'}</span>
        <span class="meta-tag">${escapeHtml(formatCondition(product.condition))}</span>
      </div>
      <div>
        <h3>${escapeHtml(product.title)}</h3>
        <p>${escapeHtml(product.description || 'Không có mô tả')}</p>
      </div>
      <strong class="price">${formatCurrency(product.price)}</strong>
      <div class="detail-tags">
        <span class="meta-tag">${escapeHtml(formatLocation(product.location))}</span>
        <span class="meta-tag">Lượt xem ${product.views || 0}</span>
        <span class="meta-tag">Yêu thích ${product.favoritesCount || 0}</span>
      </div>
      <div class="inline-actions">
        <button type="button" class="btn btn-primary" data-action="detail" data-id="${product._id}">Xem chi tiết</button>
        <button type="button" class="btn btn-secondary" data-action="favorite" data-id="${product._id}">Yêu thích</button>
        ${allowBoost ? `<button type="button" class="btn btn-secondary" data-action="boost" data-id="${product._id}">Boost tin</button>` : ''}
      </div>
    </article>
  `;
}

function renderProducts(products) {
  if (!products.length) {
    productsList.innerHTML = buildStateCard('Không tìm thấy sản phẩm phù hợp', 'Hãy thử đổi từ khóa tìm kiếm hoặc bộ lọc để xem thêm kết quả khác.', 'empty-state');
    return;
  }

  productsList.innerHTML = products.map((product) => productCardTemplate(product)).join('');
}

function renderFavorites(items) {
  if (!items.length) {
    favoritesList.innerHTML = buildStateCard('Danh sách yêu thích đang trống', 'Bạn chưa lưu sản phẩm nào. Hãy thêm từ trang sản phẩm để xem lại sau.', 'empty-state');
    return;
  }

  favoritesList.innerHTML = items.map((entry) => {
    if (!entry.product) {
      return buildStateCard('Sản phẩm không còn tồn tại', 'Mục yêu thích này hiện không còn dữ liệu hợp lệ.', 'error-state');
    }

    return productCardTemplate(entry.product, false);
  }).join('');
}

function renderProfile(user) {
  if (!user) {
    profileSummary.innerHTML = buildStateCard('Chưa có dữ liệu người dùng', 'Vui lòng đăng nhập để xem và cập nhật hồ sơ cá nhân.', 'empty-state');
    return;
  }

  profileSummary.innerHTML = `
    <div class="avatar-box">
      ${user.avatar ? `<img src="/${user.avatar}" alt="Ảnh đại diện" />` : '<div class="empty-state"><div><strong>Chưa có avatar</strong><p>Hãy tải ảnh đại diện để hồ sơ trông chuyên nghiệp hơn.</p></div></div>'}
    </div>
    <div class="profile-tags">
      <span class="meta-tag">${escapeHtml(user.role?.name || 'Người dùng')}</span>
      <span class="meta-tag">${escapeHtml(formatLocation(user.location))}</span>
    </div>
    <div class="profile-data">
      <div class="profile-row"><strong>Họ tên:</strong> ${escapeHtml(user.name || '')}</div>
      <div class="profile-row"><strong>Email:</strong> ${escapeHtml(user.email || '')}</div>
      <div class="profile-row"><strong>Số điện thoại:</strong> ${escapeHtml(user.phone || 'Chưa cập nhật')}</div>
      <div class="profile-row"><strong>Khu vực:</strong> ${escapeHtml(formatLocation(user.location))}</div>
    </div>
  `;

  profileNameInput.value = user.name || '';
  profilePhoneInput.value = user.phone || '';
  syncLocationSelector({
    provinceSelect: profileProvinceSelect,
    districtSelect: profileDistrictSelect,
    districtField: profileDistrictField,
    hiddenInput: profileLocationInput,
    province: user.location?.province,
    locationId: user.location?._id,
    allowEmptyDistrict: true
  });
}

function renderProductDetail(product) {
  const imageUrl = product.images && product.images[0] ? `/${product.images[0].url}` : '';

  productDetail.innerHTML = `
    <div class="product-detail-layout">
      <div class="media-box">
        ${imageUrl ? `<img src="${imageUrl}" alt="${escapeHtml(product.title)}" />` : '<div class="empty-state"><div><strong>Chưa có hình ảnh</strong><p>Sản phẩm này chưa được cập nhật ảnh minh họa.</p></div></div>'}
      </div>
      <div class="detail-content">
        <div class="detail-tags">
          <span class="meta-tag">${product.isBoosted ? 'Đã boost' : 'Tin thường'}</span>
          <span class="meta-tag">${escapeHtml(formatCondition(product.condition))}</span>
          <span class="meta-tag">${escapeHtml(formatLocation(product.location))}</span>
        </div>
        <div>
          <h2>${escapeHtml(product.title)}</h2>
          <p>${escapeHtml(product.description || '')}</p>
        </div>
        <strong class="price">${formatCurrency(product.price)}</strong>
        <div class="profile-data">
          <div class="profile-row"><strong>Người bán:</strong> ${escapeHtml(product.seller?.name || 'Không rõ')}</div>
          <div class="profile-row"><strong>Lượt xem:</strong> ${product.views || 0}</div>
          <div class="profile-row"><strong>Lượt yêu thích:</strong> ${product.favoritesCount || 0}</div>
        </div>
        <div class="inline-actions">
          <button type="button" class="btn btn-primary" data-action="favorite" data-id="${product._id}">Yêu thích</button>
          <button type="button" class="btn btn-secondary" data-action="boost" data-id="${product._id}">Boost tin</button>
          <a href="#/products" class="btn btn-secondary">Quay lại danh sách</a>
        </div>
      </div>
    </div>
  `;
}

async function loadMetadata() {
  const [categoryResponse, locationResponse] = await Promise.all([
    apiFetch('/api/meta/categories'),
    apiFetch('/api/meta/locations')
  ]);

  state.categories = categoryResponse.data || [];
  state.locations = locationResponse.data || [];
  state.locationsByProvince = buildLocationsByProvince(state.locations);
  populateMetadataControls();

  syncFiltersToForm();
  renderCategoryChips();
}

async function loadDashboardProducts() {
  const response = await apiFetch('/api/products?limit=4');
  state.featuredProducts = response.data?.products || [];
  renderDashboardProducts();
}

async function loadProducts() {
  productsList.innerHTML = buildStateCard('Đang tải sản phẩm', 'Hệ thống đang tải danh sách sản phẩm, vui lòng chờ trong giây lát.', 'loading-state');

  const params = new URLSearchParams();
  params.set('page', String(state.pagination.page));
  params.set('limit', String(state.pagination.limit));

  if (state.filters.search) params.set('search', state.filters.search);
  if (state.filters.category) params.set('category', state.filters.category);
  if (state.filters.province) params.set('province', state.filters.province);
  if (state.filters.district) params.set('district', state.filters.district);
  if (state.filters.boosted) params.set('boosted', 'true');

  const response = await apiFetch(`/api/products?${params.toString()}`);
  state.products = response.data?.products || [];
  state.pagination = response.data?.pagination || state.pagination;

  renderProducts(state.products);
  renderHomeStats();
  updatePaginationUI();
}

async function loadFavorites() {
  if (!isAuthenticated()) {
    favoritesList.innerHTML = buildStateCard('Cần đăng nhập', 'Vui lòng đăng nhập để xem danh sách yêu thích của bạn.', 'empty-state');
    return;
  }

  favoritesList.innerHTML = buildStateCard('Đang tải yêu thích', 'Hệ thống đang lấy danh sách sản phẩm bạn đã lưu.', 'loading-state');
  const response = await apiFetch('/api/favorites');
  renderFavorites(response.data || []);
}

async function loadProfile() {
  if (!isAuthenticated()) {
    renderProfile(null);
    return;
  }

  const response = await apiFetch('/api/users/me');
  const user = response.data;

  setUser({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role?.name || 'Người dùng'
  });

  updateSessionUI();
  renderProfile(user);
}

async function loadProductDetail(id) {
  productDetail.innerHTML = buildStateCard('Đang tải chi tiết sản phẩm', 'Vui lòng chờ để hệ thống hiển thị đầy đủ thông tin sản phẩm.', 'loading-state');
  const response = await apiFetch(`/api/products/${id}`);
  renderProductDetail(response.data);
}

function renderHomeStats() {
  document.getElementById('homeProductCount').textContent = state.pagination.total || state.products.length;
  document.getElementById('homeCategoryCount').textContent = state.categories.length;
  document.getElementById('homeLocationCount').textContent = state.locations.length;
}

function normalizeRoute() {
  const hash = window.location.hash || '#/dashboard';
  const cleanHash = hash.replace('#/', '');

  if (cleanHash.startsWith('product/')) {
    return { name: 'product-detail', id: cleanHash.split('/')[1] };
  }

  if (cleanHash === 'login') {
    return { name: 'auth' };
  }

  const allowedRoutes = ['dashboard', 'products', 'favorites', 'profile', 'settings', 'sell'];
  return { name: allowedRoutes.includes(cleanHash) ? cleanHash : 'dashboard' };
}

async function renderRoute() {
  if (!isAuthenticated()) {
    showAuthScreen('login');
    if (window.location.hash !== '#/login') {
      window.location.hash = '#/login';
    }
    return;
  }

  showAppShell();

  const route = normalizeRoute();
  const titleMap = {
    dashboard: 'Trang chủ',
    products: 'Sản phẩm',
    'product-detail': 'Chi tiết sản phẩm',
    favorites: 'Yêu thích',
    profile: 'Hồ sơ cá nhân',
    settings: 'Cài đặt',
    sell: 'Đăng tin mới'
  };

  pageTitle.textContent = titleMap[route.name] || 'Trang chủ';
  pages.forEach((page) => page.classList.toggle('active', page.dataset.page === route.name));
  mainMenuLinks.forEach((link) => link.classList.toggle('active', link.dataset.route === route.name));
  clearBanner(globalMessage);

  try {
    if (route.name === 'products' || route.name === 'sell' || route.name === 'profile') {
      await ensureMetadataLoaded();
      populateMetadataControls();
    }

    if (route.name === 'dashboard') {
      renderDashboardProducts();
      renderHomeStats();
    }
    if (route.name === 'products') {
      await loadProducts();
    }
    if (route.name === 'favorites') {
      await loadFavorites();
    }
    if (route.name === 'profile') {
      await loadProfile();
    }
    if (route.name === 'product-detail' && route.id) {
      await loadProductDetail(route.id);
    }
  } catch (error) {
    setBanner(globalMessage, error.message, 'error');
  }
}

async function toggleFavorite(productId) {
  if (!isAuthenticated()) {
    showAuthScreen('login');
    setBanner(authMessage, 'Vui lòng đăng nhập để sử dụng tính năng yêu thích.', 'error');
    return;
  }

  const response = await apiFetch(`/api/favorites/${productId}`, { method: 'POST' });
  setBanner(globalMessage, response.message || 'Đã cập nhật danh sách yêu thích.');

  if (window.location.hash === '#/favorites') {
    await loadFavorites();
  }

  await loadProducts().catch(() => null);
  await loadDashboardProducts().catch(() => null);
}

async function boostProduct(productId) {
  if (!isAuthenticated()) {
    showAuthScreen('login');
    setBanner(authMessage, 'Vui lòng đăng nhập để boost sản phẩm.', 'error');
    return;
  }

  await apiFetch(`/api/products/${productId}/boost`, { method: 'PUT' });
  setBanner(globalMessage, 'Boost sản phẩm thành công.');
  await loadProducts().catch(() => null);
  await loadDashboardProducts().catch(() => null);
}

showLoginBtn.addEventListener('click', () => openAuthTab('login'));
showRegisterBtn.addEventListener('click', () => openAuthTab('register'));

globalSearchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  state.filters.search = globalSearchInput.value.trim();
  state.pagination.page = 1;
  syncFiltersToForm();
  window.location.hash = '#/products';
});

categoryChips.addEventListener('click', (event) => {
  const chip = event.target.closest('[data-category]');
  if (!chip) return;

  state.filters.category = chip.dataset.category;
  state.pagination.page = 1;
  syncFiltersToForm();
  renderCategoryChips();
  window.location.hash = '#/products';
});

document.addEventListener('click', async (event) => {
  const actionTarget = event.target.closest('[data-action]');
  if (!actionTarget) return;

  const { action, id } = actionTarget.dataset;

  try {
    if (action === 'detail') {
      window.location.hash = `#/product/${id}`;
    }
    if (action === 'favorite') {
      await toggleFavorite(id);
    }
    if (action === 'boost') {
      await boostProduct(id);
    }
  } catch (error) {
    setBanner(globalMessage, error.message, 'error');
  }
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setBanner(authMessage, 'Đang đăng nhập, vui lòng chờ...');

  try {
    const payload = Object.fromEntries(new FormData(loginForm).entries());
    const response = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setToken(response.data.tokens.accessToken);
    setUser(response.data.user);
    updateSessionUI();
    clearBanner(authMessage);
    loginForm.reset();
    showAppShell();
    await Promise.all([loadMetadata(), loadDashboardProducts(), loadProducts(), loadProfile()]);
    window.location.hash = '#/dashboard';
    setBanner(globalMessage, 'Đăng nhập thành công. Chào mừng bạn quay lại.');
  } catch (error) {
    setBanner(authMessage, error.message, 'error');
  }
});

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setBanner(authMessage, 'Đang tạo tài khoản...');

  try {
    const payload = Object.fromEntries(new FormData(registerForm).entries());
    await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    registerForm.reset();
    openAuthTab('login');
    setBanner(authMessage, 'Tạo tài khoản thành công. Vui lòng đăng nhập để tiếp tục.');
  } catch (error) {
    setBanner(authMessage, error.message, 'error');
  }
});

productFilters.addEventListener('submit', async (event) => {
  event.preventDefault();

  state.filters.search = productFilters.search.value.trim();
  state.filters.category = productFilters.category.value;
  state.filters.province = filterProvinceSelect.value;
  state.filters.district = filterDistrictSelect.value;
  state.filters.boosted = productFilters.boosted.checked;
  state.pagination.page = 1;

  syncFiltersToForm();
  renderCategoryChips();

  try {
    await loadProducts();
  } catch (error) {
    setBanner(globalMessage, error.message, 'error');
  }
});

refreshProductsBtn.addEventListener('click', () => {
  loadProducts().catch((error) => setBanner(globalMessage, error.message, 'error'));
});

refreshFavoritesBtn.addEventListener('click', () => {
  loadFavorites().catch((error) => setBanner(globalMessage, error.message, 'error'));
});

prevPageBtn.addEventListener('click', async () => {
  if (state.pagination.page <= 1) return;
  state.pagination.page -= 1;
  await loadProducts().catch((error) => setBanner(globalMessage, error.message, 'error'));
});

nextPageBtn.addEventListener('click', async () => {
  if (state.pagination.page >= state.pagination.pages) return;
  state.pagination.page += 1;
  await loadProducts().catch((error) => setBanner(globalMessage, error.message, 'error'));
});

createProductForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setInlineBox(sellResult, 'Đang tạo sản phẩm...');

  try {
    const formData = new FormData(createProductForm);

    if (!sellLocationInput.value) {
      throw new Error('Vui lòng chọn quận / huyện trước khi đăng sản phẩm.');
    }

    const response = await apiFetch('/api/products', {
      method: 'POST',
      body: formData
    });

    createProductForm.reset();
    sellLocationInput.value = '';
    toggleDistrictField(sellDistrictField, sellDistrictSelect, false);
    setInlineBox(sellResult, `Đăng sản phẩm thành công: ${response.data.title}`);
    setBanner(globalMessage, 'Sản phẩm mới đã được đăng thành công.');
    await Promise.all([loadProducts(), loadDashboardProducts()]);
  } catch (error) {
    setInlineBox(sellResult, error.message, 'error');
  }
});

profileForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setInlineBox(profileResult, 'Đang cập nhật hồ sơ...');

  try {
    const payload = Object.fromEntries(new FormData(profileForm).entries());

    if (profileProvinceSelect.value && !profileLocationInput.value) {
      throw new Error('Vui lòng chọn quận / huyện trước khi lưu hồ sơ.');
    }

    const response = await apiFetch('/api/users/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    renderProfile(response.data);
    setInlineBox(profileResult, 'Cập nhật hồ sơ thành công.');
    setBanner(globalMessage, 'Thông tin cá nhân đã được cập nhật.');
  } catch (error) {
    setInlineBox(profileResult, error.message, 'error');
  }
});

avatarForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setInlineBox(profileResult, 'Đang tải avatar...');

  try {
    const formData = new FormData(avatarForm);
    await apiFetch('/api/users/avatar', {
      method: 'PUT',
      body: formData
    });

    avatarForm.reset();
    await loadProfile();
    setInlineBox(profileResult, 'Tải avatar thành công.');
  } catch (error) {
    setInlineBox(profileResult, error.message, 'error');
  }
});

logoutBtn.addEventListener('click', () => {
  clearSession();
  showAuthScreen('login');
  setBanner(authMessage, 'Bạn đã đăng xuất khỏi hệ thống.');
  window.location.hash = '#/login';
});

window.addEventListener('hashchange', () => {
  renderRoute();
});

async function init() {
  filterCategorySelect.dataset.placeholder = 'Tất cả danh mục';
  sellCategorySelect.dataset.placeholder = 'Chọn danh mục';
  filterProvinceSelect.dataset.placeholder = 'Tất cả thành phố';
  filterDistrictSelect.dataset.placeholder = 'Tất cả quận / huyện';
  sellProvinceSelect.dataset.placeholder = 'Chọn thành phố';
  sellDistrictSelect.dataset.placeholder = 'Chọn quận / huyện';
  profileProvinceSelect.dataset.placeholder = 'Chọn thành phố';
  profileDistrictSelect.dataset.placeholder = 'Chọn quận / huyện';

  bindLocationSelector({
    provinceSelect: sellProvinceSelect,
    districtSelect: sellDistrictSelect,
    districtField: sellDistrictField,
    hiddenInput: sellLocationInput,
    requireDistrict: true
  });

  bindLocationSelector({
    provinceSelect: profileProvinceSelect,
    districtSelect: profileDistrictSelect,
    districtField: profileDistrictField,
    hiddenInput: profileLocationInput,
    requireDistrict: false
  });

  filterProvinceSelect.addEventListener('change', () => {
    const province = filterProvinceSelect.value;

    if (!province) {
      filterDistrictSelect.value = '';
      toggleDistrictField(filterDistrictField, filterDistrictSelect, false);
      return;
    }

    populateDistrictSelect(filterDistrictSelect, province);
    filterDistrictSelect.value = '';
    toggleDistrictField(filterDistrictField, filterDistrictSelect, true);
  });

  updateSessionUI();

  try {
    await loadMetadata();
    await Promise.all([loadDashboardProducts(), loadProducts()]);
    renderHomeStats();

    if (isAuthenticated()) {
      showAppShell();
      if (!window.location.hash || window.location.hash === '#/login') {
        window.location.hash = '#/dashboard';
      }
      await renderRoute();
      return;
    }

    showAuthScreen('login');
    window.location.hash = '#/login';
  } catch (error) {
    if (isAuthenticated()) {
      showAppShell();
      setBanner(globalMessage, error.message, 'error');
    } else {
      showAuthScreen('login');
      setBanner(authMessage, error.message, 'error');
    }
  }
}

init();
