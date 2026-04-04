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
const pageKicker = document.getElementById('pageKicker');
const pageTitle = document.getElementById('pageTitle');
const globalMessage = document.getElementById('globalMessage');
const sessionStatus = document.getElementById('sessionStatus');
const sessionUser = document.getElementById('sessionUser');
const logoutBtn = document.getElementById('logoutBtn');
const marketHeader = document.querySelector('.market-header');
const marketHeaderShell = document.querySelector('.market-header-shell');
const headerPanelToggles = document.querySelectorAll('[data-panel-toggle]');
const headerNavPanel = document.getElementById('headerNavPanel');
const headerSearchPanel = document.getElementById('globalSearchForm');
const headerSessionPanel = document.getElementById('headerSessionPanel');

const globalSearchForm = document.getElementById('globalSearchForm');
const globalSearchInput = document.getElementById('globalSearchInput');
const categoryStrip = document.getElementById('categoryStrip');
const categoryChips = document.getElementById('categoryChips');
const filterCategorySelect = document.getElementById('filterCategory');
const dashboardProducts = document.getElementById('dashboardProducts');
const productsList = document.getElementById('productsList');
const favoritesList = document.getElementById('favoritesList');
const productDetail = document.getElementById('productDetail');
const profileSummary = document.getElementById('profileSummary');
const profileResult = document.getElementById('profileResult');
const myProductsList = document.getElementById('myProductsList');
const soldProductsList = document.getElementById('soldProductsList');
const conversationsList = document.getElementById('conversationsList');
const messageThread = document.getElementById('messageThread');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const sellResult = document.getElementById('sellResult');
const productFilters = document.getElementById('productFilters');
const createProductForm = document.getElementById('createProductForm');
const profileForm = document.getElementById('profileForm');
const avatarForm = document.getElementById('avatarForm');
const refreshProductsBtn = document.getElementById('refreshProductsBtn');
const refreshFavoritesBtn = document.getElementById('refreshFavoritesBtn');
const refreshConversationsBtn = document.getElementById('refreshConversationsBtn');
const paginationInfo = document.getElementById('paginationInfo');
const productsSummary = document.getElementById('productsSummary');
const productsActiveFilters = document.getElementById('productsActiveFilters');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const myPostsActiveCount = document.getElementById('myPostsActiveCount');
const myPostsSoldCount = document.getElementById('myPostsSoldCount');

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
  conversations: [],
  activeConversationId: null,
  activeConversation: null,
  messages: [],
  messagePollTimer: null,
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
  },
  activeHeaderPanel: null
};

const headerPanels = {
  nav: headerNavPanel,
  search: headerSearchPanel,
  session: headerSessionPanel
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
  stopMessagePolling();
  localStorage.removeItem('token');
  setUser(null);
  updateSessionUI();
  closeHeaderPanels();
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

function getCategoryNameById(id) {
  return state.categories.find((item) => item._id === id)?.name || 'Danh mục';
}

function formatMessageTime(value) {
  if (!value) return '';
  return new Date(value).toLocaleString('vi-VN');
}

function formatRelativeTime(value) {
  if (!value) return 'Vừa đăng';

  const now = Date.now();
  const diff = Math.max(0, now - new Date(value).getTime());
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < hour) {
    const minutes = Math.max(1, Math.floor(diff / minute));
    return `${minutes} phút trước`;
  }

  if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours} giờ trước`;
  }

  const days = Math.floor(diff / day);
  return `${days} ngày trước`;
}

function formatProductChatStatus(value) {
  const map = {
    dang_ban: 'Đang bán',
    da_ban: 'Đã bán',
    da_an: 'Đã ẩn'
  };

  return map[value] || 'Đang bán';
}

function formatSellingStatus(product) {
  return product?.isSold ? 'Đã bán' : 'Đang bán';
}

function updateProductsSummary(message) {
  if (productsSummary) {
    productsSummary.textContent = message;
  }
}

function getActiveFilterItems() {
  return [
    state.filters.search ? { key: 'search', label: `Từ khóa: ${state.filters.search}` } : null,
    state.filters.category ? { key: 'category', label: `Danh mục: ${getCategoryNameById(state.filters.category)}` } : null,
    state.filters.province ? { key: 'province', label: `Thành phố: ${state.filters.province}` } : null,
    state.filters.district ? { key: 'district', label: `Quận / huyện: ${state.filters.district}` } : null,
    state.filters.boosted ? { key: 'boosted', label: 'Chỉ xem tin đã boost' } : null
  ].filter(Boolean);
}

function renderActiveFilters() {
  if (!productsActiveFilters) return;

  const activeItems = getActiveFilterItems();
  productsActiveFilters.innerHTML = activeItems.map((item) => `
    <span class="active-filter-chip">
      ${escapeHtml(item.label)}
      <button type="button" class="filter-remove" data-action="clear-filter" data-key="${item.key}" aria-label="Xoa ${escapeHtml(item.label)}">×</button>
    </span>
  `).join('');
}

function clearFilterValue(key) {
  if (key === 'search') state.filters.search = '';
  if (key === 'category') state.filters.category = '';
  if (key === 'province') {
    state.filters.province = '';
    state.filters.district = '';
  }
  if (key === 'district') state.filters.district = '';
  if (key === 'boosted') state.filters.boosted = false;
}

function clearAllFilters() {
  state.filters = {
    search: '',
    category: '',
    province: '',
    district: '',
    boosted: false
  };
}

function normalizeAssetPath(value) {
  return String(value || '').replace(/\\/g, '/');
}

function getProductImageUrl(product) {
  const image = product?.images && product.images[0] ? product.images[0].url : '';
  return image ? `/${normalizeAssetPath(image)}` : '';
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
        <span class="state-eyebrow">Marketplace</span>
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

function updateAuthTabsUI(isLogin) {
  loginPanel.classList.toggle('active', isLogin);
  registerPanel.classList.toggle('active', !isLogin);
  loginPanel.hidden = !isLogin;
  registerPanel.hidden = isLogin;
  showLoginBtn.classList.toggle('active', isLogin);
  showRegisterBtn.classList.toggle('active', !isLogin);
  showLoginBtn.setAttribute('aria-selected', String(isLogin));
  showRegisterBtn.setAttribute('aria-selected', String(!isLogin));
  showLoginBtn.setAttribute('tabindex', isLogin ? '0' : '-1');
  showRegisterBtn.setAttribute('tabindex', isLogin ? '-1' : '0');
}

function showAuthScreen(tab = 'login') {
  authScreen.classList.remove('hidden');
  appShell.classList.add('hidden');
  openAuthTab(tab);
}

function showAppShell() {
  authScreen.classList.add('hidden');
  appShell.classList.remove('hidden');
  updateHeaderMetrics();
}

function updateHeaderMetrics() {
  if (!marketHeader) return;

  const headerHeight = Math.ceil(marketHeader.offsetHeight || 0);
  const stickyOffset = Math.max(88, headerHeight + 24);
  document.documentElement.style.setProperty('--sticky-offset', `${stickyOffset}px`);
}

function syncHeaderPanelsUI() {
  Object.entries(headerPanels).forEach(([name, panel]) => {
    if (!panel) return;

    const isActive = state.activeHeaderPanel === name;
    panel.hidden = !isActive;
  });

  headerPanelToggles.forEach((toggle) => {
    const isActive = toggle.dataset.panelToggle === state.activeHeaderPanel;
    toggle.setAttribute('aria-expanded', String(isActive));
  });

  updateHeaderMetrics();
}

function closeHeaderPanels() {
  if (!state.activeHeaderPanel) return;
  state.activeHeaderPanel = null;
  syncHeaderPanelsUI();
}

function openHeaderPanel(name) {
  state.activeHeaderPanel = name;
  syncHeaderPanelsUI();
}

function toggleHeaderPanel(name) {
  if (state.activeHeaderPanel === name) {
    closeHeaderPanels();
    return;
  }

  openHeaderPanel(name);
}

function openAuthTab(tab) {
  const isLogin = tab === 'login';
  updateAuthTabsUI(isLogin);
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
  const activeFilters = getActiveFilterItems().length;

  paginationInfo.textContent = `Trang ${current} / ${totalPages} • ${totalItems} sản phẩm`;
  updateProductsSummary(
    totalItems
      ? `Đang hiển thị ${totalItems} sản phẩm${activeFilters ? ` với ${activeFilters} bộ lọc đang áp dụng.` : ' mới nhất.'}`
      : 'Chưa có sản phẩm nào để hiển thị.'
  );
  renderActiveFilters();
  prevPageBtn.disabled = current <= 1;
  nextPageBtn.disabled = current >= totalPages;
}

function renderDashboardProducts() {
  if (!state.featuredProducts.length) {
    dashboardProducts.innerHTML = buildStateCard('Chưa có sản phẩm', 'Hiện chưa có sản phẩm để hiển thị trong khu vực đề xuất.', 'empty-state');
    return;
  }

  dashboardProducts.innerHTML = state.featuredProducts.map((product) => productCardTemplate(product, { allowBoost: false })).join('');
}

function productCardTemplate(product, options = {}) {
  const {
    allowBoost = true,
    allowFavorite = true,
    allowMarkSold = false,
    markSoldLabel = 'Đánh dấu đã bán'
  } = options;
  const imageUrl = getProductImageUrl(product);
  const sellerName = product.seller?.name || 'Người bán đã xác minh';
  const postedTime = formatRelativeTime(product.createdAt);
  const categoryName = product.category?.name || '';
  const locationLabel = formatLocation(product.location);

  return `
    <article class="product-card">
      <div class="product-cover">
        ${imageUrl ? `<img src="${imageUrl}" alt="${escapeHtml(product.title)}" />` : '<div class="product-cover-fallback"><strong>Không có ảnh</strong><p>Người bán chưa cập nhật hình minh họa.</p></div>'}
        <div class="product-badges">
          <span class="meta-tag highlight">${product.isBoosted ? 'Nổi bật' : 'Tin mới'}</span>
          <span class="meta-tag">${escapeHtml(formatSellingStatus(product))}</span>
        </div>
      </div>
      <div class="product-body">
        <div class="product-meta-row">
          <span class="product-time">${escapeHtml(postedTime)}</span>
          <span class="product-seller">${escapeHtml(sellerName)}</span>
        </div>
        <div class="product-copy">
          ${categoryName ? `<span class="kicker">${escapeHtml(categoryName)}</span>` : ''}
          <h3 class="product-title">${escapeHtml(product.title)}</h3>
          <p class="product-snippet">${escapeHtml(product.description || 'Không có mô tả')}</p>
        </div>
        <div class="product-price-row">
          <strong class="price">${formatCurrency(product.price)}</strong>
          <span class="condition-pill">${escapeHtml(formatCondition(product.condition))}</span>
        </div>
        <div class="product-stats">
          <span class="meta-tag soft">${escapeHtml(locationLabel)}</span>
          <span class="meta-tag soft">${product.views || 0} lượt xem</span>
          <span class="meta-tag soft">${product.favoritesCount || 0} lượt lưu</span>
        </div>
      </div>
      <div class="product-actions">
        <button type="button" class="btn btn-primary" data-action="detail" data-id="${product._id}">Xem chi tiết</button>
        ${allowFavorite ? `<button type="button" class="btn btn-secondary" data-action="favorite" data-id="${product._id}">Lưu tin</button>` : ''}
        ${allowBoost ? `<button type="button" class="btn btn-tertiary" data-action="boost" data-id="${product._id}">Đẩy tin</button>` : ''}
        ${allowMarkSold && !product.isSold ? `<button type="button" class="btn btn-secondary" data-action="mark-sold" data-id="${product._id}">${markSoldLabel}</button>` : ''}
      </div>
    </article>
  `;
}

function renderProducts(products) {
  if (!products.length) {
    updateProductsSummary('Không tìm thấy kết quả phù hợp với bộ lọc hiện tại.');
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

    return productCardTemplate(entry.product, { allowBoost: false });
  }).join('');
}

function renderProfile(user) {
  if (!user) {
    profileSummary.innerHTML = buildStateCard('Chưa có dữ liệu người dùng', 'Vui lòng đăng nhập để xem và cập nhật hồ sơ cá nhân.', 'empty-state');
    myProductsList.innerHTML = buildStateCard('Cần đăng nhập', 'Đăng nhập để xem các tin bạn đã đăng.', 'empty-state');
    soldProductsList.innerHTML = buildStateCard('Cần đăng nhập', 'Đăng nhập để xem lịch sử hàng đã bán của bạn.', 'empty-state');
    return;
  }

  profileSummary.innerHTML = `
    <div class="profile-hero">
      <div class="avatar-box profile-avatar-large">
        ${user.avatar ? `<img src="/${normalizeAssetPath(user.avatar)}" alt="Ảnh đại diện" />` : '<div class="avatar-fallback">'+escapeHtml((user.name || 'U').slice(0, 1).toUpperCase())+'</div>'}
      </div>
      <div class="profile-hero-copy">
        <span class="kicker">Tài khoản cá nhân</span>
        <h3>${escapeHtml(user.name || 'Người dùng')}</h3>
        <p>${escapeHtml(user.email || '')}</p>
        <div class="profile-tags">
          <span class="meta-tag">${escapeHtml(user.role?.name || 'Người dùng')}</span>
          <span class="meta-tag">${escapeHtml(formatLocation(user.location))}</span>
        </div>
      </div>
    </div>
    <div class="profile-data profile-grid-meta">
      <div class="profile-row"><strong>Họ tên</strong><span>${escapeHtml(user.name || '')}</span></div>
      <div class="profile-row"><strong>Email</strong><span>${escapeHtml(user.email || '')}</span></div>
      <div class="profile-row"><strong>Số điện thoại</strong><span>${escapeHtml(user.phone || 'Chưa cập nhật')}</span></div>
      <div class="profile-row"><strong>Khu vực</strong><span>${escapeHtml(formatLocation(user.location))}</span></div>
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

function getConversationPartner(conversation) {
  return (conversation.participants || []).find((item) => item._id !== state.currentUser?.id) || null;
}

function getConversationProductMeta(conversation) {
  return conversation?.productMeta || {
    _id: conversation?.product?._id || null,
    title: conversation?.productSnapshot?.title || conversation?.product?.title || 'Sản phẩm không xác định',
    price: conversation?.productSnapshot?.price ?? conversation?.product?.price ?? null,
    imageUrl: normalizeAssetPath(conversation?.productSnapshot?.imageUrl || ''),
    status: conversation?.productSnapshot?.status || 'dang_ban',
    available: Boolean(conversation?.product?._id)
  };
}

function renderProductBanner(meta, { compact = false, clickable = false } = {}) {
  const classes = compact ? 'product-chat-banner compact' : 'product-chat-banner';
  const image = meta.imageUrl
    ? `<img src="/${normalizeAssetPath(meta.imageUrl)}" alt="${escapeHtml(meta.title)}" />`
    : '<div class="product-chat-placeholder">Không có ảnh</div>';
  const content = `
    <div class="${classes}">
      <div class="product-chat-thumb">${image}</div>
      <div class="product-chat-copy">
        <strong>${escapeHtml(meta.title)}</strong>
        <p>${escapeHtml(formatCurrency(meta.price))}</p>
        <span class="status-tag">${escapeHtml(formatProductChatStatus(meta.status))}</span>
      </div>
    </div>
  `;

  if (clickable && meta.available && meta._id) {
    return `<a href="#/product/${meta._id}" class="product-chat-link">${content}</a>`;
  }

  if (!meta.available) {
    return `${content}<p class="muted-note">Sản phẩm hiện không còn hiển thị, nhưng cuộc trò chuyện vẫn được lưu.</p>`;
  }

  return content;
}

function stopMessagePolling() {
  if (!state.messagePollTimer) return;
  clearInterval(state.messagePollTimer);
  state.messagePollTimer = null;
}

function startMessagePolling() {
  stopMessagePolling();
  if (!state.activeConversationId) return;

  state.messagePollTimer = window.setInterval(() => {
    if (normalizeRoute().name !== 'messages' || !state.activeConversationId) {
      stopMessagePolling();
      return;
    }

    loadConversationMessages(state.activeConversationId, { silent: true }).catch(() => null);
    loadConversations({ silent: true }).catch(() => null);
  }, 5000);
}

function renderMyProducts(items) {
  const activeItems = items.filter((product) => !product.isSold);
  const soldItems = items.filter((product) => product.isSold);

  if (myPostsActiveCount) {
    myPostsActiveCount.textContent = String(activeItems.length);
  }

  if (myPostsSoldCount) {
    myPostsSoldCount.textContent = String(soldItems.length);
  }

  if (!activeItems.length) {
    myProductsList.innerHTML = buildStateCard('Chưa có tin đăng', 'Bạn chưa đăng sản phẩm nào. Hãy tạo tin mới để bắt đầu bán hàng.', 'empty-state');
  } else {
    myProductsList.innerHTML = activeItems.map((product) => productCardTemplate(product, {
      allowFavorite: false,
      allowMarkSold: true,
      markSoldLabel: 'Đã bán ngoài kênh'
    })).join('');
  }

  if (!soldItems.length) {
    soldProductsList.innerHTML = buildStateCard('Chưa có hàng đã bán', 'Khi bạn đánh dấu một tin là đã bán, sản phẩm sẽ được lưu tại đây và ẩn khỏi trang sản phẩm.', 'empty-state');
    return;
  }

  soldProductsList.innerHTML = soldItems.map((product) => productCardTemplate(product, {
    allowBoost: false,
    allowFavorite: false
  })).join('');
}

function renderConversations(items) {
  if (!items.length) {
    conversationsList.innerHTML = buildStateCard('Chưa có cuộc trò chuyện', 'Hãy bắt đầu nhắn tin từ trang chi tiết sản phẩm để trao đổi với người bán.', 'empty-state');
    return;
  }

  conversationsList.innerHTML = items.map((conversation) => {
    const partner = getConversationPartner(conversation);
    const lastMessage = conversation.lastMessage?.content || 'Chưa có tin nhắn';
    const productMeta = getConversationProductMeta(conversation);
    const lastTime = conversation.lastMessage?.createdAt ? formatRelativeTime(conversation.lastMessage.createdAt) : 'Mới tạo';
    return `
      <button type="button" class="conversation-item ${state.activeConversationId === conversation._id ? 'active' : ''}" data-action="open-conversation" data-id="${conversation._id}">
        ${renderProductBanner(productMeta, { compact: true })}
        <div class="conversation-top">
          <strong>${escapeHtml(partner?.name || 'Người dùng')}</strong>
          <span class="conversation-time">${escapeHtml(lastTime)}</span>
        </div>
        <div class="conversation-top conversation-submeta">
          <span class="conversation-partner-role">Trao đổi mua bán</span>
          ${conversation.unreadCount ? `<span class="status-tag unread-pill">${conversation.unreadCount} mới</span>` : ''}
        </div>
        <p>${escapeHtml(lastMessage)}</p>
      </button>
    `;
  }).join('');
}

function renderMessageThread() {
  if (!state.activeConversation) {
    messageThread.innerHTML = buildStateCard('Chọn một cuộc trò chuyện', 'Mở một hội thoại để xem lịch sử tin nhắn và tiếp tục trao đổi.', 'empty-state');
    messageForm.classList.add('hidden');
    return;
  }

  const partner = getConversationPartner(state.activeConversation);
  const productMeta = getConversationProductMeta(state.activeConversation);
  const header = `
    <div class="messages-thread-head">
      ${renderProductBanner(productMeta, { clickable: true })}
      <div>
        <strong>${escapeHtml(partner?.name || 'Người dùng')}</strong>
        <p>Trao đổi trực tiếp để chốt đơn nhanh hơn.</p>
      </div>
    </div>
  `;

  const body = state.messages.length
    ? state.messages.map((message) => {
      const isOwn = message.sender?._id === state.currentUser?.id;
      return `
        <article class="message-bubble ${isOwn ? 'own' : ''}">
          <strong>${escapeHtml(message.sender?.name || 'Người dùng')}</strong>
          <p>${escapeHtml(message.content)}</p>
          <span>${escapeHtml(formatMessageTime(message.createdAt))}${isOwn ? ` • ${message.isRead ? 'Đã đọc' : 'Chưa đọc'}` : ''}</span>
        </article>
      `;
    }).join('')
    : buildStateCard('Chưa có tin nhắn', 'Hãy gửi tin đầu tiên để bắt đầu trao đổi.', 'empty-state');

  messageThread.innerHTML = `${header}<div class="message-bubbles">${body}</div>`;
  messageForm.classList.remove('hidden');
  scrollMessageThreadToLatest();
}

function scrollMessageThreadToLatest() {
  window.requestAnimationFrame(() => {
    const bubbles = messageThread.querySelector('.message-bubbles');
    if (!bubbles) return;

    const lastMessage = bubbles.lastElementChild;
    if (lastMessage instanceof HTMLElement) {
      lastMessage.scrollIntoView({ block: 'end' });
    }
  });
}

function renderProductDetail(product) {
  const imageItems = product.images || [];
  const imageUrl = imageItems[0] ? `/${normalizeAssetPath(imageItems[0].url)}` : '';
  const canMessageSeller = state.currentUser && product.seller?._id !== state.currentUser.id;
  const sellerName = product.seller?.name || 'Người bán đã xác minh';
  const gallery = imageItems.length
    ? imageItems.map((item, index) => `
      <button type="button" class="detail-thumb" data-action="select-detail-image" data-image="/${normalizeAssetPath(item.url)}" data-alt="${escapeHtml(product.title)} ${index + 1}" aria-label="Xem ảnh ${index + 1} của ${escapeHtml(product.title)}">
        <img src="/${normalizeAssetPath(item.url)}" alt="${escapeHtml(product.title)} ${index + 1}" />
      </button>
    `).join('')
    : '';

  productDetail.innerHTML = `
    <div class="product-detail-layout">
      <div class="detail-gallery-shell">
        <div class="media-box detail-gallery-main">
          ${imageUrl ? `<img id="detailMainImage" src="${imageUrl}" alt="${escapeHtml(product.title)}" />` : '<div class="product-cover-fallback"><strong>Không có ảnh</strong><p>Sản phẩm này chưa được cập nhật hình minh họa.</p></div>'}
        </div>
        ${gallery ? `<div class="detail-gallery-strip">${gallery}</div>` : ''}
        <div class="detail-tags">
          <span class="meta-tag highlight">${product.isBoosted ? 'Tin được đề xuất' : 'Tin đang hiển thị'}</span>
          <span class="meta-tag">${escapeHtml(formatSellingStatus(product))}</span>
          <span class="meta-tag">${escapeHtml(formatCondition(product.condition))}</span>
        </div>
      </div>
      <div class="detail-content">
        <div class="detail-description-card">
          <div class="detail-heading">
            <span class="kicker">Chi tiết tin đăng</span>
            <h2>${escapeHtml(product.title)}</h2>
            <p>${escapeHtml(product.description || '')}</p>
          </div>
          <div class="detail-price-row">
            <strong class="price price-xl">${formatCurrency(product.price)}</strong>
            <span class="detail-time">${escapeHtml(formatRelativeTime(product.createdAt))}</span>
          </div>
          <div class="detail-tags">
            <span class="meta-tag soft">${escapeHtml(formatLocation(product.location))}</span>
            <span class="meta-tag soft">${product.views || 0} lượt xem</span>
            <span class="meta-tag soft">${product.favoritesCount || 0} lượt lưu</span>
          </div>
        </div>
        <div class="detail-info-grid">
          <div class="detail-info-card">
            <strong>Thông tin quét nhanh</strong>
            <div class="profile-data compact-data">
              <div class="profile-row"><strong>Tình trạng</strong><span>${escapeHtml(formatCondition(product.condition))}</span></div>
              <div class="profile-row"><strong>Khu vực</strong><span>${escapeHtml(formatLocation(product.location))}</span></div>
              <div class="profile-row"><strong>Lượt xem</strong><span>${product.views || 0}</span></div>
              <div class="profile-row"><strong>Lượt lưu</strong><span>${product.favoritesCount || 0}</span></div>
            </div>
          </div>
          <div class="detail-seller-card">
          <div class="detail-seller-head">
            <div class="seller-avatar-mini">${escapeHtml(sellerName.slice(0, 1).toUpperCase())}</div>
            <div>
              <strong>${escapeHtml(sellerName)}</strong>
            </div>
          </div>
            <div class="profile-data compact-data">
              <div class="profile-row"><strong>Số điện thoại liên hệ</strong><span>${escapeHtml(product.seller?.phone || 'Đang cập nhật')}</span></div>
              <div class="profile-row"><strong>Khu vực</strong><span>${escapeHtml(formatLocation(product.location))}</span></div>
              <div class="profile-row"><strong>Trạng thái</strong><span>${escapeHtml(formatSellingStatus(product))}</span></div>
            </div>
          </div>
        </div>
      </div>
      <aside class="detail-contact-card">
        <div>
          <span class="kicker">Liên hệ nhanh</span>
          <strong class="price">${formatCurrency(product.price)}</strong>
        </div>
        <div class="profile-data compact-data">
          <div class="profile-row"><strong>Tình trạng tin</strong><span>${escapeHtml(formatSellingStatus(product))}</span></div>
          <div class="profile-row"><strong>Người đăng</strong><span>${escapeHtml(sellerName)}</span></div>
          <div class="profile-row"><strong>Khu vực</strong><span>${escapeHtml(formatLocation(product.location))}</span></div>
        </div>
        <div class="detail-contact-actions">
          ${canMessageSeller ? `<button type="button" class="btn btn-primary" data-action="start-conversation" data-id="${product._id}">Nhắn tin người bán</button>` : ''}
          <button type="button" class="btn btn-secondary" data-action="favorite" data-id="${product._id}">Lưu tin này</button>
          <button type="button" class="btn btn-tertiary" data-action="boost" data-id="${product._id}">Đẩy tin</button>
          <a href="#/products" class="btn btn-secondary">Quay lại danh sách</a>
        </div>
      </aside>
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
  updateProductsSummary('Đang tải kết quả sản phẩm...');
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

async function loadMyProducts() {
  if (!isAuthenticated()) {
    myProductsList.innerHTML = buildStateCard('Cần đăng nhập', 'Đăng nhập để xem các tin bạn đã đăng.', 'empty-state');
    soldProductsList.innerHTML = buildStateCard('Cần đăng nhập', 'Đăng nhập để xem lịch sử hàng đã bán của bạn.', 'empty-state');
    return;
  }

  myProductsList.innerHTML = buildStateCard('Đang tải tin của bạn', 'Hệ thống đang lấy danh sách sản phẩm bạn đã đăng.', 'loading-state');
  soldProductsList.innerHTML = buildStateCard('Đang tải lịch sử đã bán', 'Hệ thống đang đồng bộ danh sách các tin đã được đánh dấu là đã bán.', 'loading-state');
  const response = await apiFetch('/api/products/mine');
  renderMyProducts(response.data || []);
}

async function markProductAsSold(productId) {
  await apiFetch(`/api/products/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isSold: true })
  });

  setBanner(globalMessage, 'Sản phẩm đã được đánh dấu là đã bán và không còn hiển thị trên trang sản phẩm.');

  await Promise.all([
    loadMyProducts(),
    loadProducts().catch(() => null),
    loadDashboardProducts().catch(() => null),
    loadFavorites().catch(() => null)
  ]);
}

async function loadConversations({ silent = false } = {}) {
  if (!isAuthenticated()) {
    conversationsList.innerHTML = buildStateCard('Cần đăng nhập', 'Đăng nhập để xem các cuộc trò chuyện của bạn.', 'empty-state');
    messageThread.innerHTML = buildStateCard('Cần đăng nhập', 'Đăng nhập để xem nội dung tin nhắn.', 'empty-state');
    messageForm.classList.add('hidden');
    return;
  }

  if (!silent) {
    conversationsList.innerHTML = buildStateCard('Đang tải hội thoại', 'Hệ thống đang lấy danh sách cuộc trò chuyện của bạn.', 'loading-state');
  }

  const response = await apiFetch('/api/conversations');
  state.conversations = response.data || [];

  if (state.activeConversationId && !state.conversations.some((item) => item._id === state.activeConversationId)) {
    state.activeConversationId = null;
    state.activeConversation = null;
    state.messages = [];
  }

  renderConversations(state.conversations);
  if (state.activeConversationId) {
    const current = state.conversations.find((item) => item._id === state.activeConversationId);
    if (current) state.activeConversation = current;
    renderMessageThread();
  }
}

async function loadConversationMessages(conversationId, { silent = false } = {}) {
  if (!silent) {
    messageThread.innerHTML = buildStateCard('Đang tải tin nhắn', 'Hệ thống đang tải lịch sử trao đổi.', 'loading-state');
  }

  const response = await apiFetch(`/api/conversations/${conversationId}/messages`);
  state.activeConversation = response.data.conversation;
  state.activeConversationId = response.data.conversation._id;
  state.messages = response.data.messages || [];
  renderConversations(state.conversations);
  renderMessageThread();
}

async function startConversation(productId) {
  const response = await apiFetch('/api/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId })
  });

  state.activeConversationId = response.data._id;
  window.location.hash = '#/messages';
  await loadConversations();
  await loadConversationMessages(response.data._id);
  startMessagePolling();
}

async function loadProductDetail(id) {
  productDetail.innerHTML = buildStateCard('Đang tải chi tiết sản phẩm', 'Vui lòng chờ để hệ thống hiển thị đầy đủ thông tin sản phẩm.', 'loading-state');
  const response = await apiFetch(`/api/products/${id}`);
  renderProductDetail(response.data);
}

function renderHomeStats() {
  const productCount = document.getElementById('homeProductCount');
  const categoryCount = document.getElementById('homeCategoryCount');
  const locationCount = document.getElementById('homeLocationCount');

  if (productCount) {
    productCount.textContent = String(state.pagination.total || state.products.length);
  }

  if (categoryCount) {
    categoryCount.textContent = String(state.categories.length);
  }

  if (locationCount) {
    locationCount.textContent = String(state.locations.length);
  }
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

  const allowedRoutes = ['dashboard', 'products', 'messages', 'favorites', 'profile', 'manage-posts', 'settings', 'sell'];
  return { name: allowedRoutes.includes(cleanHash) ? cleanHash : 'dashboard' };
}

async function renderRoute() {
  closeHeaderPanels();

  if (!isAuthenticated()) {
    showAuthScreen('login');
    if (window.location.hash !== '#/login') {
      window.location.hash = '#/login';
    }
    return;
  }

  showAppShell();

  const route = normalizeRoute();
  const kickerMap = {
    dashboard: 'Chợ trực tuyến',
    products: 'Tìm và duyệt nhanh',
    messages: 'Trao đổi để chốt đơn',
    'product-detail': 'Tin đăng được xem',
    favorites: 'Danh sách quan tâm',
    profile: 'Tài khoản cá nhân',
    'manage-posts': 'Hiệu quả tin đăng',
    settings: 'Hệ thống và nguyên tắc',
    sell: 'Đăng tin có hướng dẫn'
  };
  const titleMap = {
    dashboard: 'Trang chủ',
    products: 'Sản phẩm',
    messages: 'Tin nhắn',
    'product-detail': 'Chi tiết sản phẩm',
    favorites: 'Yêu thích',
    profile: 'Hồ sơ cá nhân',
    'manage-posts': 'Quản lý tin đăng',
    settings: 'Cài đặt',
    sell: 'Đăng tin mới'
  };

  if (pageKicker) {
    pageKicker.textContent = kickerMap[route.name] || kickerMap.dashboard;
  }
  pageTitle.textContent = titleMap[route.name] || 'Trang chủ';
  const activeMenuRoute = route.name === 'product-detail' ? 'products' : route.name;
  pages.forEach((page) => page.classList.toggle('active', page.dataset.page === route.name));
  mainMenuLinks.forEach((link) => {
    const isActive = link.dataset.route === activeMenuRoute;
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
  if (categoryStrip) {
    categoryStrip.classList.toggle('hidden', !['dashboard', 'products', 'favorites'].includes(route.name));
  }
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
    if (route.name === 'messages') {
      await loadConversations();
      if (state.activeConversationId) {
        await loadConversationMessages(state.activeConversationId);
      } else {
        renderMessageThread();
      }
      startMessagePolling();
    } else {
      stopMessagePolling();
    }
    if (route.name === 'profile') {
      await loadProfile();
    }
    if (route.name === 'manage-posts') {
      await loadMyProducts();
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
    setBanner(authMessage, 'Vui lòng đăng nhập để đẩy tin sản phẩm.', 'error');
    return;
  }

  await apiFetch(`/api/products/${productId}/boost`, { method: 'PUT' });
  setBanner(globalMessage, 'Đẩy tin sản phẩm thành công.');
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
  closeHeaderPanels();
  window.location.hash = '#/products';
});

headerPanelToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    toggleHeaderPanel(toggle.dataset.panelToggle);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !state.activeHeaderPanel) return;

  const activeToggle = Array.from(headerPanelToggles).find((toggle) => toggle.dataset.panelToggle === state.activeHeaderPanel);
  closeHeaderPanels();
  activeToggle?.focus();
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

document.addEventListener('click', (event) => {
  if (!state.activeHeaderPanel || !marketHeaderShell) return;
  if (marketHeaderShell.contains(event.target)) return;

  closeHeaderPanels();
});

marketHeaderShell?.addEventListener('click', (event) => {
  const routeLink = event.target.closest('a[href^="#/"]');
  if (routeLink) {
    closeHeaderPanels();
  }
});

document.addEventListener('click', async (event) => {
  const actionTarget = event.target.closest('[data-action]');
  if (!actionTarget) return;

  const { action, id } = actionTarget.dataset;

  try {
    if (action === 'clear-filter') {
      clearFilterValue(actionTarget.dataset.key);
      state.pagination.page = 1;
      syncFiltersToForm();
      renderCategoryChips();
      await loadProducts();
    }
    if (action === 'detail') {
      window.location.hash = `#/product/${id}`;
    }
    if (action === 'select-detail-image') {
      const detailMainImage = document.getElementById('detailMainImage');
      if (detailMainImage) {
        detailMainImage.setAttribute('src', actionTarget.dataset.image || '');
        detailMainImage.setAttribute('alt', actionTarget.dataset.alt || 'Ảnh sản phẩm');
      }
    }
    if (action === 'favorite') {
      await toggleFavorite(id);
    }
    if (action === 'boost') {
      await boostProduct(id);
    }
    if (action === 'mark-sold') {
      await markProductAsSold(id);
    }
    if (action === 'start-conversation') {
      await startConversation(id);
    }
    if (action === 'open-conversation') {
      state.activeConversationId = id;
      await loadConversationMessages(id);
      await loadConversations({ silent: true });
      startMessagePolling();
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

clearFiltersBtn.addEventListener('click', async () => {
  clearAllFilters();
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

refreshConversationsBtn.addEventListener('click', () => {
  loadConversations().catch((error) => setBanner(globalMessage, error.message, 'error'));
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

    setUser({
      ...state.currentUser,
      id: response.data._id || state.currentUser?.id,
      name: response.data.name,
      email: response.data.email,
      role: response.data.role?.name || state.currentUser?.role || 'Người dùng'
    });
    updateSessionUI();
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

messageForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!state.activeConversationId) {
    setBanner(globalMessage, 'Hãy chọn một cuộc trò chuyện trước khi gửi tin nhắn.', 'error');
    return;
  }

  const content = messageInput.value.trim();
  if (!content) {
    setBanner(globalMessage, 'Nội dung tin nhắn không được để trống.', 'error');
    return;
  }

  try {
    await apiFetch(`/api/conversations/${state.activeConversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    messageForm.reset();
    await loadConversationMessages(state.activeConversationId, { silent: true });
    await loadConversations({ silent: true });
  } catch (error) {
    setBanner(globalMessage, error.message, 'error');
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

window.addEventListener('resize', updateHeaderMetrics);

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
  syncHeaderPanelsUI();

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
