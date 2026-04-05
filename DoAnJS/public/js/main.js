const apiBase = window.location.origin;

const authScreen = document.getElementById('authScreen');
const appShell = document.getElementById('appShell');
const loginPanel = document.getElementById('loginPanel');
const registerPanel = document.getElementById('registerPanel');
const resetPanel = document.getElementById('resetPanel');
const showLoginBtn = document.getElementById('showLoginBtn');
const showRegisterBtn = document.getElementById('showRegisterBtn');
const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
const backToLoginBtn = document.getElementById('backToLoginBtn');
const backToAppBtn = document.getElementById('backToAppBtn');
const authMessage = document.getElementById('authMessage');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const mainMenuLinks = document.querySelectorAll('#mainMenu a');
const adminOnlyElements = document.querySelectorAll('[data-admin-only]');
const pages = document.querySelectorAll('.page');
const pageKicker = document.getElementById('pageKicker');
const pageTitle = document.getElementById('pageTitle');
const globalMessage = document.getElementById('globalMessage');
const sessionStatus = document.getElementById('sessionStatus');
const sessionUser = document.getElementById('sessionUser');
const logoutBtn = document.getElementById('logoutBtn');
const sessionLoginBtn = document.getElementById('sessionLoginBtn');
const sessionRegisterBtn = document.getElementById('sessionRegisterBtn');
const sessionProfileLink = document.getElementById('sessionProfileLink');
const sessionFavoritesLink = document.getElementById('sessionFavoritesLink');
const sessionEntryAvatar = document.getElementById('sessionEntryAvatar');
const sessionEntryLabel = document.getElementById('sessionEntryLabel');
const sessionEntrySubtext = document.getElementById('sessionEntrySubtext');
const sessionPanelAvatar = document.getElementById('sessionPanelAvatar');
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
const messagesBadge = document.getElementById('messagesBadge');
const headerMessagesBadge = document.getElementById('headerMessagesBadge');
const navMenuBadge = document.getElementById('navMenuBadge');
const headerBarMessagesBadge = document.getElementById('headerBarMessagesBadge');
const sellResult = document.getElementById('sellResult');
const productFilters = document.getElementById('productFilters');
const createProductForm = document.getElementById('createProductForm');
const profileForm = document.getElementById('profileForm');
const avatarForm = document.getElementById('avatarForm');
const profileForgotPasswordBtn = document.getElementById('profileForgotPasswordBtn');
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
const refreshAdminDashboardBtn = document.getElementById('refreshAdminDashboardBtn');
const refreshAdminUsersBtn = document.getElementById('refreshAdminUsersBtn');
const refreshAdminProductsBtn = document.getElementById('refreshAdminProductsBtn');
const refreshAdminActivitiesBtn = document.getElementById('refreshAdminActivitiesBtn');
const adminDashboardMetrics = document.getElementById('adminDashboardMetrics');
const adminDashboardUsersPreview = document.getElementById('adminDashboardUsersPreview');
const adminDashboardProductsPreview = document.getElementById('adminDashboardProductsPreview');
const adminDashboardActivitiesPreview = document.getElementById('adminDashboardActivitiesPreview');
const adminUserMetrics = document.getElementById('adminUserMetrics');
const adminUsersList = document.getElementById('adminUsersList');
const adminProductMetrics = document.getElementById('adminProductMetrics');
const adminProductsList = document.getElementById('adminProductsList');
const adminActivityMetrics = document.getElementById('adminActivityMetrics');
const adminActivitiesList = document.getElementById('adminActivitiesList');

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

const CATEGORY_VISIBLE_COUNT = 10;
const ICONS = {
  grid: '<rect x="4" y="4" width="6" height="6" rx="1.25"></rect><rect x="14" y="4" width="6" height="6" rx="1.25"></rect><rect x="4" y="14" width="6" height="6" rx="1.25"></rect><rect x="14" y="14" width="6" height="6" rx="1.25"></rect>',
  house: '<path d="M3 11.5 12 4l9 7.5"></path><path d="M6.5 10.5V20h11V10.5"></path><path d="M10 20v-5h4v5"></path>',
  laptop: '<rect x="4" y="5" width="16" height="11" rx="2"></rect><path d="M2.5 19h19"></path>',
  car: '<path d="M5 16.5h14"></path><path d="m6 16.5-.75-3.75A2 2 0 0 1 7.2 10.5h9.6a2 2 0 0 1 1.95 2.25L18 16.5"></path><circle cx="7.5" cy="16.5" r="1.5"></circle><circle cx="16.5" cy="16.5" r="1.5"></circle>',
  shirt: '<path d="m8 6 2-2h4l2 2 3 2.5-2 3-2-1V20H9v-7.5l-2 1-2-3Z"></path>',
  sofa: '<path d="M5 12V9.5A2.5 2.5 0 0 1 7.5 7h9A2.5 2.5 0 0 1 19 9.5V12"></path><path d="M4 12h16v5H4z"></path><path d="M6 17v3"></path><path d="M18 17v3"></path>',
  wrench: '<path d="M14.5 5.5a3.5 3.5 0 0 0 4 4l-8 8a2 2 0 1 1-2.8-2.8l8-8a3.5 3.5 0 0 0-1.2-4.3Z"></path>',
  briefcase: '<rect x="3.5" y="7" width="17" height="12" rx="2"></rect><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"></path><path d="M3.5 12h17"></path>',
  paw: '<path d="M8 11.5c-1.1 0-2-.9-2-2.25S6.9 7 8 7s2 .9 2 2.25S9.1 11.5 8 11.5Z"></path><path d="M16 11.5c-1.1 0-2-.9-2-2.25S14.9 7 16 7s2 .9 2 2.25S17.1 11.5 16 11.5Z"></path><path d="M11 8.5c-1 0-1.75-.95-1.75-2.25S10 4 11 4s1.75.95 1.75 2.25S12 8.5 11 8.5Z"></path><path d="M6.5 17.75c0-2.2 2.3-4.25 5.5-4.25s5.5 2.05 5.5 4.25c0 1.2-.8 2.25-2.15 2.25-1.15 0-1.85-.75-3.35-.75-1.5 0-2.25.75-3.35.75-1.35 0-2.15-1.05-2.15-2.25Z"></path>',
  book: '<path d="M6 5.5A2.5 2.5 0 0 1 8.5 3H19v16H8.5A2.5 2.5 0 0 0 6 21Z"></path><path d="M6 5.5V21H5a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2Z"></path>',
  dumbbell: '<path d="M3 9v6"></path><path d="M6 7v10"></path><path d="M18 7v10"></path><path d="M21 9v6"></path><path d="M6 12h12"></path>',
  utensils: '<path d="M5 4v8"></path><path d="M8 4v8"></path><path d="M5 8h3"></path><path d="M13 4v16"></path><path d="M17 4c1.7 1.7 1.7 4.3 0 6v10"></path>',
  sparkles: '<path d="m12 3 1.4 3.6L17 8l-3.6 1.4L12 13l-1.4-3.6L7 8l3.6-1.4Z"></path><path d="m18.5 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z"></path><path d="m5.5 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z"></path>',
  leaf: '<path d="M18.5 5.5C13 5 7 8 5 14c-1 3 1 5 4 5 6 0 9-6 8.5-13.5Z"></path><path d="M8 16c2-2 4-3.5 7-5"></path>',
  store: '<path d="M4 10h16"></path><path d="M5 10V7l1.5-3h11L19 7v3"></path><path d="M6 10v10h12V10"></path><path d="M10 14h4"></path>',
  ticket: '<path d="M4 8.5A2.5 2.5 0 0 0 4 15.5V18h16v-2.5a2.5 2.5 0 0 1 0-7V6H4Z"></path><path d="M12 8v8"></path>',
  heart: '<path d="m12 20-1.1-1C6.1 14.7 3 11.9 3 8.5 3 6 5 4 7.5 4c1.4 0 2.8.65 3.7 1.67C12.1 4.65 13.5 4 14.9 4 17.4 4 19.4 6 19.4 8.5c0 3.4-3.1 6.2-7.9 10.5Z"></path>',
  message: '<path d="M5 6.5h14A2.5 2.5 0 0 1 21.5 9v6A2.5 2.5 0 0 1 19 17.5H11l-4.5 3v-3H5A2.5 2.5 0 0 1 2.5 15V9A2.5 2.5 0 0 1 5 6.5Z"></path>',
  rocket: '<path d="M8 16c-1 2-3.5 3-4.5 3 .1-1 1-3.5 3-4.5"></path><path d="M14.5 9.5 9 15l-3-3 5.5-5.5c2.7-2.7 6.5-3 9-3-.1 2.5-.3 6.3-3 9Z"></path><path d="m13 7 4 4"></path>',
  image: '<rect x="4" y="5" width="16" height="14" rx="2"></rect><circle cx="9" cy="10" r="1.5"></circle><path d="m6 17 4.5-4.5 3.5 3.5 2.5-2.5 1.5 1.5"></path>',
  check: '<path d="m5 12 4 4 10-10"></path>',
  'arrow-left': '<path d="M19 12H5"></path><path d="m10 17-5-5 5-5"></path>',
  eye: '<path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"></path><circle cx="12" cy="12" r="2.5"></circle>',
  user: '<circle cx="12" cy="8" r="3"></circle><path d="M5 19a7 7 0 0 1 14 0"></path>',
  key: '<circle cx="8" cy="12" r="3"></circle><path d="M11 12h10"></path><path d="M18 12v3"></path><path d="M15 12v2"></path>',
  'chevron-down': '<path d="m6 9 6 6 6-6"></path>',
  'chevron-up': '<path d="m6 15 6-6 6 6"></path>'
};

const state = {
  categories: [],
  locations: [],
  locationsByProvince: {},
  currentUser: loadUser(),
  categoryStripExpanded: false,
  conversations: [],
  activeConversationId: null,
  activeConversation: null,
  messages: [],
  messagePollTimer: null,
  products: [],
  featuredProducts: [],
   productComparison: {
    productId: '',
    peers: [],
    criteria: null,
    error: ''
  },
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
  activeHeaderPanel: null,
  pendingRouteMessage: null,
  admin: {
    dashboard: null,
    users: [],
    products: [],
    activities: []
  }
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
    return normalizeSessionUser(JSON.parse(raw));
  } catch (error) {
    localStorage.removeItem('currentUser');
    return null;
  }
}

function setUser(user) {
  state.currentUser = user ? normalizeSessionUser(user) : null;
  if (state.currentUser) {
    localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
  } else {
    localStorage.removeItem('currentUser');
  }

  updateAdminNavigation();
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

function normalizeSearchKey(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
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

function getModerationReason(product) {
  if (product?.isHidden && product?.hiddenReason) {
    return String(product.hiddenReason).trim();
  }

  if (String(product?.status || '').toLowerCase() === 'rejected' && product?.rejectionReason) {
    return String(product.rejectionReason).trim();
  }

  return '';
}

function normalizeSessionUser(user) {
  if (!user) return null;

  return {
    ...user,
    id: user.id || user._id || null,
    _id: user._id || user.id || null,
    role: typeof user.role === 'object' ? (user.role?.name || 'user') : (user.role || 'user')
  };
}

function getRoleName(role) {
  if (!role) return 'user';
  if (typeof role === 'string') return role.toLowerCase();
  if (typeof role === 'object') return String(role.name || role.label || 'user').toLowerCase();
  return 'user';
}

function getCurrentUserRoleName(user = state.currentUser) {
  return getRoleName(user?.role);
}

function isAdminUser(user = state.currentUser) {
  return getCurrentUserRoleName(user) === 'admin';
}

function isAdminRoute(name) {
  return ['admin-dashboard', 'admin-users', 'admin-posts', 'admin-activities'].includes(name);
}

function updateAdminNavigation() {
  const visible = isAdminUser();
  adminOnlyElements.forEach((element) => {
    element.classList.toggle('hidden', !visible);
  });
}

function formatRoleLabel(value) {
  return getRoleName(value) === 'admin' ? 'Quản trị viên' : 'Người dùng';
}

function formatDateTime(value) {
  if (!value) return 'Chưa cập nhật';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Chưa cập nhật';
  }

  return date.toLocaleString('vi-VN');
}

function formatCount(value) {
  const count = Number(value);
  if (!Number.isFinite(count)) return '0';
  return count.toLocaleString('vi-VN');
}

function getUserAvatarLabel(user = state.currentUser) {
  return getInitials(user?.name || user?.email || 'Tài khoản');
}

function buildAvatarInner(user = state.currentUser) {
  if (user?.avatar) {
    return `<img src="/${normalizeAssetPath(user.avatar)}" alt="" />`;
  }

  return `<span class="avatar-letter">${escapeHtml(getUserAvatarLabel(user))}</span>`;
}

function paintAvatar(element, user = state.currentUser) {
  if (!element) return;
  element.innerHTML = buildAvatarInner(user);
}

function buildIcon(name, className = 'ui-icon') {
  const iconMarkup = ICONS[name] || ICONS.grid;
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconMarkup}</svg>`;
}

function buildButtonLabel(iconName, text) {
  return `<span class="btn-label">${buildIcon(iconName, 'ui-icon btn-icon-inline')}<span>${escapeHtml(text)}</span></span>`;
}

function buildChipLabel(iconName, text) {
  return `${buildIcon(iconName, 'ui-icon chip-icon')}<span>${escapeHtml(text)}</span>`;
}

function getCategoryIconName(name) {
  const key = normalizeSearchKey(name);

  if (/bat dong san|nha dat|can ho|phong tro|van phong/.test(key)) return 'house';
  if (/dien thoai|laptop|may tinh|dien tu|cong nghe|camera|tablet|phu kien/.test(key)) return 'laptop';
  if (/xe|oto|o to|xe may|phuong tien|phu tung/.test(key)) return 'car';
  if (/thoi trang|quan ao|giay dep|tui xach|phu kien thoi trang/.test(key)) return 'shirt';
  if (/noi that|gia dung|nha bep|do dung|ban ghe/.test(key)) return 'sofa';
  if (/dich vu|sua chua|xay dung|do nghe|cong cu/.test(key)) return 'wrench';
  if (/viec lam|tuyen dung|van phong pham|kinh doanh/.test(key)) return 'briefcase';
  if (/thu cung|cho meo|pet/.test(key)) return 'paw';
  if (/sach|tap chi|tai lieu/.test(key)) return 'book';
  if (/the thao|da ngoai|tap gym|xe dap/.test(key)) return 'dumbbell';
  if (/an uong|thuc pham|do an|do uong/.test(key)) return 'utensils';
  if (/lam dep|my pham|cham soc/.test(key)) return 'sparkles';
  if (/nong nghiep|cay canh|vuon|hat giong/.test(key)) return 'leaf';
  if (/ve|giai tri|su kien|du lich/.test(key)) return 'ticket';
  if (/me be|do choi|giao duc/.test(key)) return 'store';

  return 'grid';
}

function pickNumber(...values) {
  const match = values.find((value) => value !== undefined && value !== null && value !== '' && Number.isFinite(Number(value)));
  return match === undefined ? 0 : Number(match);
}

function pickArray(...values) {
  return values.find(Array.isArray) || [];
}

function getObjectId(value) {
  return value?._id || value?.id || value || '';
}

function getProductOwnerId(product) {
  return getObjectId(product?.seller);
}

function isOwnedByCurrentUser(product) {
  return Boolean(state.currentUser?.id) && getProductOwnerId(product) === state.currentUser.id;
}

function canFavoriteProduct(product) {
  return Boolean(state.currentUser?.id) && !isAdminUser() && !isOwnedByCurrentUser(product) && !product?.isSold;
}

function canBoostProduct(product) {
  return isOwnedByCurrentUser(product) && product?.status === 'approved' && !product?.isHidden && !product?.isSold;
}

function canMessageProductSeller(product) {
  return Boolean(state.currentUser?.id) && !isAdminUser() && !isOwnedByCurrentUser(product) && !product?.isSold;
}

function getUserLabel(user) {
  return user?.name || user?.fullName || user?.email || 'Người dùng';
}

function isUserBanned(user) {
  return Boolean(user?.isBanned || user?.banned);
}

function getModerationStatus(product) {
  const rawStatus = String(product?.moderationStatus || product?.status || '').toLowerCase();
  const approvedFlag = typeof product?.isApproved === 'boolean' ? product.isApproved : product?.approved;

  if (product?.isHidden) {
    return { key: 'hidden', label: 'Đang ẩn', className: 'badge-dark', reason: getModerationReason(product) };
  }

  if (rawStatus === 'deleted' || rawStatus === 'removed' || product?.deletedAt) {
    return { key: 'deleted', label: 'Đã gỡ', className: 'badge-danger', reason: '' };
  }

  if (
    rawStatus === 'approved'
    || rawStatus === 'published'
    || rawStatus === 'active'
    || approvedFlag === true
    || product?.approvedAt
  ) {
    return { key: 'approved', label: 'Đã duyệt', className: 'badge-ok', reason: '' };
  }

  if (rawStatus === 'rejected' || rawStatus === 'declined' || product?.rejectedAt) {
    return { key: 'rejected', label: 'Từ chối', className: 'badge-danger', reason: getModerationReason(product) };
  }

  return { key: 'pending', label: 'Chờ duyệt', className: 'badge-warn', reason: '' };
}

function formatActivityAction(action) {
  const normalized = String(action || '').toLowerCase();
  const map = {
    approve: 'Duyệt tin',
    approve_product: 'Duyệt tin',
    delete: 'Xóa bản ghi',
    delete_product: 'Xóa tin',
    delete_user: 'Xóa tài khoản',
    ban: 'Khóa tài khoản',
    ban_user: 'Khóa tài khoản',
    unban: 'Mở khóa tài khoản',
    unban_user: 'Mở khóa tài khoản',
    reject_product: 'Từ chối tin',
    hide_product: 'Ẩn tin',
    unhide_product: 'Hiện lại tin',
    update_role: 'Cập nhật quyền',
    change_role: 'Cập nhật quyền',
    role_update: 'Cập nhật quyền',
    dashboard_view: 'Xem tổng quan',
    login: 'Đăng nhập quản trị'
  };

  if (map[normalized]) {
    return map[normalized];
  }

  return normalized
    ? normalized.replace(/[_-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    : 'Hoạt động quản trị';
}

function getActivityActor(activity) {
  return activity?.admin?.name || activity?.actor?.name || activity?.user?.name || activity?.performedBy?.name || 'Quản trị viên';
}

function getActivityTarget(activity) {
  return activity?.target?.title
    || activity?.target?.name
    || activity?.product?.title
    || activity?.user?.email
    || activity?.subject?.title
    || activity?.subject?.name
    || activity?.targetId
    || '';
}

function formatActivityDetails(details) {
  if (!details) {
    return 'Bản ghi này được tạo tự động từ các thao tác của quản trị viên.';
  }

  if (typeof details === 'string') {
    return details;
  }

  if (typeof details === 'object') {
    return Object.entries(details)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
      .join(' • ') || 'Bản ghi này được tạo tự động từ các thao tác của quản trị viên.';
  }

  return String(details);
}

function extractAdminList(payload, keys = []) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  for (const key of keys) {
    if (Array.isArray(payload[key])) {
      return payload[key];
    }
  }

  return [];
}

function normalizeAdminDashboard(payload = {}) {
  const metrics = payload.metrics || payload.summary || payload.stats || {};

  return {
    totalUsers: pickNumber(metrics.totalUsers, payload.totalUsers, metrics.userCount, payload.userCount),
    adminUsers: pickNumber(metrics.adminUsers, payload.adminUsers, metrics.totalAdmins, payload.totalAdmins),
    bannedUsers: pickNumber(metrics.bannedUsers, payload.bannedUsers),
    totalProducts: pickNumber(metrics.totalProducts, payload.totalProducts, metrics.productCount, payload.productCount),
    pendingProducts: pickNumber(metrics.pendingProducts, payload.pendingProducts),
    approvedProducts: pickNumber(metrics.approvedProducts, payload.approvedProducts),
    totalActivities: pickNumber(metrics.totalActivities, payload.totalActivities, metrics.activityCount, payload.activityCount),
    recentUsers: pickArray(payload.recentUsers, payload.users),
    recentProducts: pickArray(payload.pendingItems, payload.pendingProducts, payload.products),
    recentActivities: pickArray(payload.recentActivities, payload.activities, payload.logs)
  };
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
  element.classList.remove('hidden', 'error', 'success');
  if (type === 'error') {
    element.classList.add('error');
  }
  if (type === 'success') {
    element.classList.add('success');
  }
}

function clearBanner(element) {
  element.textContent = '';
  element.classList.add('hidden');
  element.classList.remove('error', 'success');
}

function setInlineBox(element, message, type = 'info') {
  element.textContent = message;
  element.classList.remove('error', 'success');
  if (type === 'error') {
    element.classList.add('error');
  }
  if (type === 'success') {
    element.classList.add('success');
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
    const error = new Error(data.message || 'Yêu cầu thất bại');
    error.status = response.status;
    error.path = path;
    throw error;
  }

  return data;
}

async function syncSessionFromServer() {
  if (!isAuthenticated()) return null;

  const response = await apiFetch('/api/users/me');
  const user = response.data;

  setUser({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role?.name || user.role || 'user',
    phone: user.phone,
    avatar: user.avatar,
    location: user.location
  });

  updateSessionUI();
  return user;
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

function syncRecoveryForm(user = state.currentUser) {
  if (!forgotPasswordForm) return;

  const emailInput = forgotPasswordForm.elements.namedItem('email');
  const phoneInput = forgotPasswordForm.elements.namedItem('phone');

  emailInput.value = user?.email || '';
  phoneInput.value = user?.phone || '';
}

function updateSessionUI() {
  paintAvatar(sessionEntryAvatar, state.currentUser);
  paintAvatar(sessionPanelAvatar, state.currentUser);

  if (state.currentUser) {
    sessionStatus.textContent = 'Đã đăng nhập';
    sessionUser.textContent = `${state.currentUser.name || 'Người dùng'} | ${state.currentUser.email || ''}${isAdminUser() ? ' | Quản trị viên' : ''}`;
    if (sessionEntryLabel) {
      sessionEntryLabel.textContent = state.currentUser.name || 'Tài khoản';
    }
    if (sessionEntrySubtext) {
      sessionEntrySubtext.textContent = isAdminUser() ? 'Quản trị viên' : 'Hồ sơ cá nhân';
    }
    logoutBtn.classList.remove('hidden');
    sessionLoginBtn?.classList.add('hidden');
    sessionRegisterBtn?.classList.add('hidden');
    sessionProfileLink?.classList.remove('hidden');
    sessionFavoritesLink?.classList.remove('hidden');
  } else {
    sessionStatus.textContent = 'Chưa đăng nhập';
    sessionUser.textContent = 'Vui lòng đăng nhập để sử dụng hệ thống.';
    if (sessionEntryLabel) {
      sessionEntryLabel.textContent = 'Tài khoản';
    }
    if (sessionEntrySubtext) {
      sessionEntrySubtext.textContent = 'Đăng nhập';
    }
    logoutBtn.classList.add('hidden');
    sessionLoginBtn?.classList.remove('hidden');
    sessionRegisterBtn?.classList.remove('hidden');
    sessionProfileLink?.classList.add('hidden');
    sessionFavoritesLink?.classList.add('hidden');
  }

  syncRecoveryForm();
  updateAdminNavigation();
}

function updateAuthTabsUI(activePanel) {
  const isLogin = activePanel === 'login';
  const isRegister = activePanel === 'register';
  const isReset = activePanel === 'reset';

  loginPanel.classList.toggle('active', isLogin);
  registerPanel.classList.toggle('active', isRegister);
  resetPanel.classList.toggle('active', isReset);
  loginPanel.hidden = !isLogin;
  registerPanel.hidden = !isRegister;
  resetPanel.hidden = !isReset;
  showLoginBtn.classList.toggle('active', isLogin);
  showRegisterBtn.classList.toggle('active', isRegister);
  showLoginBtn.setAttribute('aria-selected', String(isLogin));
  showRegisterBtn.setAttribute('aria-selected', String(isRegister));
  showLoginBtn.setAttribute('tabindex', isLogin ? '0' : '-1');
  showRegisterBtn.setAttribute('tabindex', isRegister ? '0' : '-1');
  backToAppBtn?.classList.toggle('hidden', !isAuthenticated());
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
  updateAuthTabsUI(tab);
  if (tab === 'reset') {
    syncRecoveryForm();
  }
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
  const activeCategoryId = state.filters.category;
  const activeCategory = state.categories.find((item) => item._id === activeCategoryId);
  let visibleCategories = state.categories;

  if (!state.categoryStripExpanded && state.categories.length > CATEGORY_VISIBLE_COUNT) {
    visibleCategories = state.categories.slice(0, CATEGORY_VISIBLE_COUNT);

    if (activeCategory && !visibleCategories.some((item) => item._id === activeCategory._id)) {
      visibleCategories = [...visibleCategories.slice(0, CATEGORY_VISIBLE_COUNT - 1), activeCategory];
    }
  }

  const allChip = `
    <button type="button" class="chip chip-category ${activeCategoryId ? '' : 'active'}" data-category="">
      ${buildChipLabel('grid', 'Tất cả')}
    </button>
  `;

  const items = visibleCategories.map((item) => `
    <button type="button" class="chip chip-category ${activeCategoryId === item._id ? 'active' : ''}" data-category="${item._id}">
      ${buildChipLabel(getCategoryIconName(item.name), item.name)}
    </button>
  `).join('');

  const hiddenCount = Math.max(0, state.categories.length - CATEGORY_VISIBLE_COUNT);
  const toggleButton = hiddenCount
    ? `
      <button type="button" class="chip chip-toggle" data-toggle-categories="true" aria-expanded="${String(state.categoryStripExpanded)}">
        ${buildChipLabel(state.categoryStripExpanded ? 'chevron-up' : 'chevron-down', state.categoryStripExpanded ? 'Thu gọn' : `Xem thêm ${hiddenCount}`)}
      </button>
    `
    : '';

  categoryChips.innerHTML = allChip + items + toggleButton;
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
    allowManageImages = false,
    allowMarkSold = false,
    markSoldLabel = 'Đánh dấu đã bán',
    showModerationInfo = false,
    compactManageActions = false
  } = options;
  const imageUrl = getProductImageUrl(product);
  const sellerName = product.seller?.name || 'Người bán đã xác minh';
  const postedTime = formatRelativeTime(product.createdAt);
  const categoryName = product.category?.name || '';
  const locationLabel = formatLocation(product.location);
  const moderation = getModerationStatus(product);
  const canFavoriteNow = allowFavorite && canFavoriteProduct(product);
  const canMessageNow = canMessageProductSeller(product);
  const canBoostNow = allowBoost && canBoostProduct(product);
  const secondaryActions = [
    canMessageNow ? `<button type="button" class="btn btn-secondary" data-action="start-conversation" data-id="${product._id}">${buildButtonLabel('message', 'Nhắn tin')}</button>` : '',
    canFavoriteNow ? `<button type="button" class="btn btn-secondary" data-action="favorite" data-id="${product._id}">${buildButtonLabel('heart', 'Lưu tin')}</button>` : '',
    canBoostNow ? `<button type="button" class="btn btn-secondary" data-action="boost" data-id="${product._id}">${buildButtonLabel('rocket', 'Đẩy tin')}</button>` : '',
    allowManageImages ? `<button type="button" class="btn btn-secondary" data-action="edit-images" data-id="${product._id}">${buildButtonLabel('image', compactManageActions ? 'Ảnh' : 'Quản lý ảnh')}</button>` : '',
    allowMarkSold && !product.isSold ? `<button type="button" class="btn btn-secondary" data-action="mark-sold" data-id="${product._id}">${buildButtonLabel('check', markSoldLabel)}</button>` : ''
  ].filter(Boolean).join('');

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
          ${showModerationInfo ? `<span class="meta-tag ${moderation.className}">${escapeHtml(moderation.label)}</span>` : ''}
        </div>
        ${showModerationInfo && moderation.reason ? `<p class="admin-record-note">Lý do kiểm duyệt: ${escapeHtml(moderation.reason)}</p>` : ''}
      </div>
      <div class="product-actions">
        <button type="button" class="btn btn-primary product-primary-action" data-action="detail" data-id="${product._id}">${buildButtonLabel('eye', compactManageActions ? 'Chi tiết' : 'Xem chi tiết')}</button>
        ${secondaryActions ? `<div class="product-quick-actions">${secondaryActions}</div>` : ''}
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
          <span class="meta-tag">${escapeHtml(formatRoleLabel(user.role))}</span>
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
  syncRecoveryForm(user);
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
      allowManageImages: true,
      allowMarkSold: true,
      markSoldLabel: 'Đã bán ngoài kênh',
      showModerationInfo: true,
      compactManageActions: true
    })).join('');
  }

  if (!soldItems.length) {
    soldProductsList.innerHTML = buildStateCard('Chưa có hàng đã bán', 'Khi bạn đánh dấu một tin là đã bán, sản phẩm sẽ được lưu tại đây và ẩn khỏi trang sản phẩm.', 'empty-state');
    return;
  }

  soldProductsList.innerHTML = soldItems.map((product) => productCardTemplate(product, {
    allowBoost: false,
    allowFavorite: false,
    showModerationInfo: true,
    compactManageActions: true
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

function updateUnreadBadge() {
  // Calculate total unread messages
  const totalUnread = state.conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
  
  // Update sidebar badge
  if (messagesBadge) {
    if (totalUnread > 0) {
      messagesBadge.textContent = totalUnread > 9 ? '9+' : String(totalUnread);
      messagesBadge.classList.remove('hidden');
      messagesBadge.setAttribute('aria-label', `${totalUnread} tin nhắn chưa đọc`);
    } else {
      messagesBadge.classList.add('hidden');
    }
  }

  // Update header quick actions badge
  if (headerMessagesBadge) {
    if (totalUnread > 0) {
      headerMessagesBadge.textContent = totalUnread > 9 ? '9+' : String(totalUnread);
      headerMessagesBadge.classList.remove('hidden');
      headerMessagesBadge.setAttribute('aria-label', `${totalUnread} tin nhắn chưa đọc`);
    } else {
      headerMessagesBadge.classList.add('hidden');
    }
  }

  // Update nav menu button badge
  if (navMenuBadge) {
    if (totalUnread > 0) {
      navMenuBadge.textContent = totalUnread > 9 ? '9+' : String(totalUnread);
      navMenuBadge.classList.remove('hidden');
      navMenuBadge.setAttribute('aria-label', `${totalUnread} tin nhắn chưa đọc`);
    } else {
      navMenuBadge.classList.add('hidden');
    }
  }

  // Update header bar messages link badge
  if (headerBarMessagesBadge) {
    if (totalUnread > 0) {
      headerBarMessagesBadge.textContent = totalUnread > 9 ? '9+' : String(totalUnread);
      headerBarMessagesBadge.classList.remove('hidden');
      headerBarMessagesBadge.setAttribute('aria-label', `${totalUnread} tin nhắn chưa đọc`);
    } else {
      headerBarMessagesBadge.classList.add('hidden');
    }
  }
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
  const comparePanel = renderProductComparison(product);
  const imageItems = product.images || [];
  const imageUrl = imageItems[0] ? `/${normalizeAssetPath(imageItems[0].url)}` : '';
  const galleryItems = imageItems.slice(1); // Exclude main image
  const isOwner = isOwnedByCurrentUser(product);
  const canMessageSeller = canMessageProductSeller(product);
  const canFavoriteNow = canFavoriteProduct(product);
  const canBoostNow = canBoostProduct(product);
  const moderation = getModerationStatus(product);
  const sellerName = product.seller?.name || 'Người bán đã xác minh';
  const gallery = galleryItems.length
    ? galleryItems.map((item, index) => `
      <button type="button" class="detail-thumb" data-action="select-detail-image" data-image="/${normalizeAssetPath(item.url)}" data-alt="${escapeHtml(product.title)} ${index + 2}" aria-label="Xem ảnh ${index + 2} của ${escapeHtml(product.title)}">
        <img src="/${normalizeAssetPath(item.url)}" alt="${escapeHtml(product.title)} ${index + 2}" />
      </button>
    `).join('')
    : '';
  const imageManager = isOwner ? `
    <section class="detail-image-manager">
      <div class="section-head compact-head">
        <div>
          <p class="kicker">Quản lý ảnh</p>
          <h3>Cập nhật ảnh cho tin đăng</h3>
        </div>
      </div>
      <div class="detail-image-manager-grid">
        ${(imageItems.length ? imageItems : []).map((item, index) => `
          <article class="detail-image-manager-card">
            <div class="detail-image-manager-preview">
              <img src="/${normalizeAssetPath(item.url)}" alt="${escapeHtml(product.title)} ${index + 1}" />
            </div>
            <div class="detail-image-manager-copy">
              <strong>Ảnh ${index + 1}</strong>
              <p>Bạn có thể thay trực tiếp hoặc xóa ảnh này khỏi tin đăng.</p>
            </div>
            <div class="detail-image-manager-actions">
              <button type="button" class="btn btn-secondary btn-sm" data-action="replace-product-image" data-product-id="${product._id}" data-image-id="${item._id}">Thay ảnh</button>
              <button type="button" class="btn btn-secondary btn-sm" data-action="remove-product-image" data-product-id="${product._id}" data-image-id="${item._id}">Xóa ảnh</button>
            </div>
          </article>
        `).join('') || '<p class="field-note">Tin đăng này hiện chưa có ảnh nào. Hãy thêm ảnh mới bên dưới.</p>'}
      </div>
      <form id="productImageUploadForm" class="form-grid top-space" data-product-id="${product._id}">
        <label class="field">
          <span>Thêm ảnh mới</span>
          <input type="file" name="images" multiple accept="image/*" />
          <small class="field-note">Bạn có thể thêm nhiều ảnh cùng lúc, tối đa 10 ảnh cho mỗi tin đăng.</small>
        </label>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Tải ảnh lên</button>
        </div>
      </form>
    </section>
  ` : '';
  const moderationPanel = isOwner ? `
    <div class="detail-info-card">
      <strong>Kiểm duyệt tin đăng</strong>
      <div class="profile-data compact-data">
        <div class="profile-row"><strong>Trạng thái</strong><span><span class="badge ${moderation.className}">${escapeHtml(moderation.label)}</span></span></div>
        <div class="profile-row"><strong>Ghi chú</strong><span>${escapeHtml(moderation.reason || 'Chưa có ghi chú từ quản trị viên.')}</span></div>
      </div>
    </div>
  ` : '';

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
        ${imageManager}
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
          ${moderationPanel}
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
          ${comparePanel}
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
          ${canMessageSeller ? `<button type="button" class="btn btn-primary" data-action="start-conversation" data-id="${product._id}">${buildButtonLabel('message', 'Nhắn tin người bán')}</button>` : ''}
          ${canFavoriteNow ? `<button type="button" class="btn btn-secondary" data-action="favorite" data-id="${product._id}">${buildButtonLabel('heart', 'Lưu tin')}</button>` : ''}
          <button type="button" class="btn btn-secondary" data-action="compare" data-id="${product._id}">So sánh cùng danh mục</button>
          ${canBoostNow ? `<button type="button" class="btn btn-secondary" data-action="boost" data-id="${product._id}">${buildButtonLabel('rocket', 'Đẩy tin')}</button>` : ''}
          <a href="#/products" class="btn btn-secondary">${buildButtonLabel('arrow-left', 'Quay lại danh sách')}</a>
        </div>
      </aside>
    </div>
  `;
}

function formatPriceDifference(value) {
  const amount = Number(value) || 0;
  if (amount === 0) return 'Bằng giá hiện tại';
  return amount > 0
    ? `Cao hơn ${formatCurrency(amount)}`
    : `Thấp hơn ${formatCurrency(Math.abs(amount))}`;
}

function buildComparisonBadges(item) {
  const badges = [];
  if (item?.comparison?.sameSubCategory) {
    badges.push('<span class="meta-tag soft">Cùng phân nhóm</span>');
  }
  if (item?.comparison?.sameDistrict) {
    badges.push('<span class="meta-tag soft">Cùng quận / huyện</span>');
  } else if (item?.comparison?.sameProvince) {
    badges.push('<span class="meta-tag soft">Cùng thành phố</span>');
  }
  if (item?.comparison?.sameCondition) {
    badges.push('<span class="meta-tag soft">Cùng tình trạng</span>');
  }

  return badges.join('');
}

function renderProductComparison(currentProduct) {
  const compareState = state.productComparison;
  const compareItems = Array.isArray(compareState.peers) ? compareState.peers : [];

  if (compareState.productId !== currentProduct._id) {
    return '';
  }

  if (!compareItems.length) {
    if (compareState.error) {
      return `
        <section class="detail-info-card comparison-panel">
          <div class="section-head compact-head">
            <div>
              <p class="kicker">So sánh cùng danh mục</p>
              <h3>Chưa thể tải dữ liệu so sánh</h3>
            </div>
          </div>
          <p class="comparison-empty">${escapeHtml(compareState.error)}</p>
        </section>
      `;
    }

    return `
      <section class="detail-info-card comparison-panel">
        <div class="section-head compact-head">
          <div>
            <p class="kicker">So sánh cùng danh mục</p>
            <h3>Chưa có sản phẩm tương tự</h3>
          </div>
        </div>
        <p class="comparison-empty">Hiện chưa có sản phẩm công khai nào khác trong cùng danh mục để đối chiếu về giá, tình trạng và khu vực.</p>
      </section>
    `;
  }

  return `
    <section class="detail-info-card comparison-panel">
      <div class="section-head compact-head">
        <div>
          <p class="kicker">So sánh cùng danh mục</p>
          <h3>Đối chiếu nhanh với các tin gần nhất</h3>
        </div>
      </div>
      <div class="comparison-current-card">
        <div>
          <span class="comparison-label">Sản phẩm đang xem</span>
          <strong>${escapeHtml(currentProduct.title)}</strong>
        </div>
        <div class="comparison-current-meta">
          <span class="meta-tag">${escapeHtml(formatCurrency(currentProduct.price))}</span>
          <span class="meta-tag">${escapeHtml(formatCondition(currentProduct.condition))}</span>
          <span class="meta-tag">${escapeHtml(formatLocation(currentProduct.location))}</span>
        </div>
      </div>
      <div class="comparison-grid">
        ${compareItems.map((item) => `
          <article class="comparison-card">
            <div class="comparison-card-head">
              <div>
                <span class="comparison-label">${escapeHtml(item.product?.category?.name || 'Cùng danh mục')}</span>
                <h4>${escapeHtml(item.product?.title || 'Sản phẩm tương tự')}</h4>
              </div>
              <strong class="price">${formatCurrency(item.product?.price)}</strong>
            </div>
            <div class="comparison-meta-row">
              ${buildComparisonBadges(item)}
            </div>
            <div class="profile-data compact-data comparison-data">
              <div class="profile-row"><strong>Chênh lệch giá</strong><span>${escapeHtml(formatPriceDifference(item.comparison?.priceDifference))}</span></div>
              <div class="profile-row"><strong>Tình trạng</strong><span>${escapeHtml(formatCondition(item.product?.condition))}</span></div>
              <div class="profile-row"><strong>Khu vực</strong><span>${escapeHtml(formatLocation(item.product?.location))}</span></div>
              <div class="profile-row"><strong>Lượt xem</strong><span>${escapeHtml(formatCount(item.product?.views || 0))}</span></div>
              <div class="profile-row"><strong>Lượt lưu</strong><span>${escapeHtml(formatCount(item.product?.favoritesCount || 0))}</span></div>
            </div>
            <div class="comparison-card-actions">
              <button type="button" class="btn btn-primary" data-action="detail" data-id="${item.product?._id || ''}">Xem chi tiết</button>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
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

async function loadProducts({ silent = false } = {}) {
  if (!silent) {
    updateProductsSummary('Đang tải kết quả sản phẩm...');
    productsList.innerHTML = buildStateCard('Đang tải sản phẩm', 'Hệ thống đang tải danh sách sản phẩm, vui lòng chờ trong giây lát.', 'loading-state');
  }

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

async function loadFavorites({ silent = false } = {}) {
  if (!isAuthenticated()) {
    favoritesList.innerHTML = buildStateCard('Cần đăng nhập', 'Vui lòng đăng nhập để xem danh sách yêu thích của bạn.', 'empty-state');
    return;
  }

  if (!silent) {
    favoritesList.innerHTML = buildStateCard('Đang tải yêu thích', 'Hệ thống đang lấy danh sách sản phẩm bạn đã lưu.', 'loading-state');
  }
  const response = await apiFetch('/api/favorites');
  renderFavorites(response.data || []);
}

async function loadProfile() {
  if (!isAuthenticated()) {
    renderProfile(null);
    return;
  }

  const user = await syncSessionFromServer();
  renderProfile(user);
}

async function loadMyProducts({ silent = false } = {}) {
  if (!isAuthenticated()) {
    myProductsList.innerHTML = buildStateCard('Cần đăng nhập', 'Đăng nhập để xem các tin bạn đã đăng.', 'empty-state');
    soldProductsList.innerHTML = buildStateCard('Cần đăng nhập', 'Đăng nhập để xem lịch sử hàng đã bán của bạn.', 'empty-state');
    return;
  }

  if (!silent) {
    myProductsList.innerHTML = buildStateCard('Đang tải tin của bạn', 'Hệ thống đang lấy danh sách sản phẩm bạn đã đăng.', 'loading-state');
    soldProductsList.innerHTML = buildStateCard('Đang tải lịch sử đã bán', 'Hệ thống đang đồng bộ danh sách các tin đã được đánh dấu là đã bán.', 'loading-state');
  }
  const response = await apiFetch('/api/products/mine');
  renderMyProducts(response.data || []);
}

async function refreshVisibleProductSurfaces(productId = '') {
  const route = normalizeRoute();
  const refreshTasks = [];

  if (route.name === 'dashboard') {
    refreshTasks.push(loadDashboardProducts().catch(() => null));
  }

  if (route.name === 'products') {
    refreshTasks.push(loadProducts({ silent: true }).catch(() => null));
  }

  if (route.name === 'favorites') {
    refreshTasks.push(loadFavorites({ silent: true }).catch(() => null));
  }

  if (route.name === 'manage-posts') {
    refreshTasks.push(loadMyProducts({ silent: true }).catch(() => null));
  }

  if (route.name === 'product-detail' && route.id && (!productId || route.id === productId)) {
    refreshTasks.push(loadProductDetail(route.id, { silent: true }).catch(() => null));
  }

  await Promise.all(refreshTasks);
}

async function markProductAsSold(productId) {
  await apiFetch(`/api/products/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isSold: true })
  });

  setBanner(globalMessage, 'Sản phẩm đã được đánh dấu là đã bán và không còn hiển thị trên trang sản phẩm.');

  await Promise.all([
    loadMyProducts({ silent: true }),
    refreshVisibleProductSurfaces(productId)
  ]);
}

async function updateProductImages(productId, { files = [], removeImageId = '', replaceImageId = '', replaceFile = null } = {}) {
  const formData = new FormData();
  Array.from(files || []).forEach((file) => {
    formData.append('images', file);
  });

  if (removeImageId) {
    formData.append('removeImageIds', removeImageId);
  }

  if (replaceImageId && replaceFile) {
    formData.append('replaceImageIds', replaceImageId);
    formData.append('replaceImages', replaceFile);
  }

  const response = await apiFetch(`/api/products/${productId}`, {
    method: 'PUT',
    body: formData
  });

  if (normalizeRoute().name === 'product-detail' && normalizeRoute().id === productId) {
    renderProductDetail(response.data);
  }

  await Promise.all([
    loadMyProducts({ silent: true }).catch(() => null),
    refreshVisibleProductSurfaces(productId)
  ]);

  return response;
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
  updateUnreadBadge();
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

async function loadProductDetail(id, { silent = false } = {}) {
  if (!silent) {
    productDetail.innerHTML = buildStateCard('Đang tải chi tiết sản phẩm', 'Vui lòng chờ để hệ thống hiển thị đầy đủ thông tin sản phẩm.', 'loading-state');
  }
  const productResponse = await apiFetch(`/api/products/${id}`);

  let comparisonState = {
    productId: id,
    peers: [],
    criteria: null,
    error: ''
  };

  try {
    const comparisonResponse = await apiFetch(`/api/products/${id}/compare`);
    comparisonState = {
      productId: id,
      peers: comparisonResponse.data?.peers || [],
      criteria: comparisonResponse.data?.criteria || null,
      error: ''
    };
  } catch (error) {
    comparisonState.error = error.message || 'Dữ liệu so sánh tạm thời chưa khả dụng.';
  }

  state.productComparison = comparisonState;

  renderProductDetail(productResponse.data);
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

function truncateText(value, length = 140) {
  const text = String(value || '').trim();
  if (text.length <= length) return text;
  return `${text.slice(0, length).trim()}…`;
}

function buildAdminMetricCards(items) {
  return items.map((item) => `
    <article class="summary-card${item.note ? ' summary-card-copy' : ''}">
      <span>${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(formatCount(item.value))}</strong>
      ${item.note ? `<p>${escapeHtml(item.note)}</p>` : ''}
    </article>
  `).join('');
}

function buildAdminDashboardMetricCards(items) {
  return items.map((item) => `
    <article class="admin-dashboard-metric-card${item.emphasis ? ' is-emphasis' : ''}">
      <span>${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(formatCount(item.value))}</strong>
      ${item.note ? `<p>${escapeHtml(item.note)}</p>` : ''}
    </article>
  `).join('');
}

function getInitials(value) {
  const words = String(value || '').trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (!words.length) return 'ND';
  return words.map((word) => word.charAt(0).toUpperCase()).join('');
}

function adminDashboardUserPreviewTemplate(user) {
  const label = getUserLabel(user);
  const roleName = getRoleName(user?.role);
  const banned = isUserBanned(user);

  return `
    <article class="admin-dashboard-user-card">
      <div class="admin-dashboard-user-top">
        <div class="admin-dashboard-user-primary">
          <div class="admin-dashboard-user-avatar">${escapeHtml(getInitials(label))}</div>
          <div class="admin-dashboard-user-copy">
            <strong>${escapeHtml(label)}</strong>
            <p>${escapeHtml(user?.email || 'Chưa cập nhật email')}</p>
          </div>
        </div>
        <div class="admin-dashboard-user-tags">
          <span class="badge ${roleName === 'admin' ? 'badge-dark' : ''}">${escapeHtml(formatRoleLabel(roleName))}</span>
          <span class="badge ${banned ? 'badge-danger' : 'badge-ok'}">${banned ? 'Đang bị khóa' : 'Đang hoạt động'}</span>
        </div>
      </div>
      <div class="admin-meta-row">
        <span class="meta-tag">SĐT: ${escapeHtml(user?.phone || 'Chưa cập nhật')}</span>
        <span class="meta-tag">Khu vực: ${escapeHtml(formatLocation(user?.location))}</span>
        <span class="meta-tag">Tạo lúc: ${escapeHtml(formatDateTime(user?.createdAt))}</span>
      </div>
    </article>
  `;
}

function adminDashboardProductWorkbenchTemplate(product) {
  const productId = getObjectId(product);
  const moderation = getModerationStatus(product);
  const canModerate = Boolean(productId);
  const canApprove = canModerate && moderation.key !== 'approved';
  const canReject = canModerate && moderation.key !== 'rejected';
  const canHide = canModerate && moderation.key === 'approved';
  const canUnhide = canModerate && moderation.key === 'hidden';
  const categoryName = product?.category?.name || product?.categoryName || 'Danh mục chưa rõ';
  const sellerName = getUserLabel(product?.seller);

  return `
    <article class="admin-dashboard-product-card">
      <div class="admin-dashboard-product-head">
        <div class="admin-dashboard-product-copy">
          <span class="kicker">Hàng chờ kiểm duyệt</span>
          <h3>${escapeHtml(product?.title || 'Tin đăng chưa có tiêu đề')}</h3>
          <p class="admin-record-note">${escapeHtml(truncateText(product?.description || 'Chưa có mô tả chi tiết.', 160))}</p>
        </div>
        <div class="admin-dashboard-product-badges">
          <span class="badge ${moderation.className}">${escapeHtml(moderation.label)}</span>
          <span class="badge ${product?.isSold ? 'badge-danger' : 'badge-ok'}">${product?.isSold ? 'Đã bán' : 'Đang bán'}</span>
        </div>
      </div>

      <div class="admin-dashboard-fact-grid">
        <div class="admin-dashboard-fact">
          <span>Người đăng</span>
          <strong>${escapeHtml(sellerName)}</strong>
        </div>
        <div class="admin-dashboard-fact">
          <span>Danh mục</span>
          <strong>${escapeHtml(categoryName)}</strong>
        </div>
        <div class="admin-dashboard-fact">
          <span>Giá niêm yết</span>
          <strong>${escapeHtml(formatCurrency(product?.price))}</strong>
        </div>
        <div class="admin-dashboard-fact">
          <span>Thời điểm tạo</span>
          <strong>${escapeHtml(formatDateTime(product?.createdAt))}</strong>
        </div>
      </div>

      <div class="admin-meta-row">
        <span class="meta-tag">Khu vực: ${escapeHtml(formatLocation(product?.location))}</span>
        <span class="meta-tag">Lượt xem: ${escapeHtml(formatCount(product?.views || 0))}</span>
        <span class="meta-tag">Lượt lưu: ${escapeHtml(formatCount(product?.favoritesCount || 0))}</span>
      </div>

      ${moderation.reason ? `<p class="admin-dashboard-product-note">Lý do kiểm duyệt: ${escapeHtml(moderation.reason)}</p>` : ''}

      <div class="admin-record-actions admin-dashboard-product-actions">
        ${canModerate ? `<a href="#/product/${escapeHtml(productId)}" class="header-link">Xem tin</a>` : '<span class="header-link">Thiếu mã tin đăng</span>'}
        ${canApprove ? `<button type="button" class="btn btn-primary" data-action="admin-post-approve" data-id="${escapeHtml(productId)}">Duyệt tin</button>` : ''}
        ${canReject ? `<button type="button" class="btn btn-secondary" data-action="admin-post-reject" data-id="${escapeHtml(productId)}">Từ chối</button>` : ''}
        ${canHide ? `<button type="button" class="btn btn-secondary" data-action="admin-post-hide" data-id="${escapeHtml(productId)}">Ẩn tin</button>` : ''}
        ${canUnhide ? `<button type="button" class="btn btn-secondary" data-action="admin-post-unhide" data-id="${escapeHtml(productId)}">Hiện lại</button>` : ''}
        ${canModerate ? `<button type="button" class="btn btn-secondary" data-action="admin-post-delete" data-id="${escapeHtml(productId)}">Xóa tin</button>` : ''}
      </div>
    </article>
  `;
}

function adminDashboardActivityItemTemplate(activity) {
  const action = activity?.action || activity?.type || activity?.event || '';
  const actionLabel = formatActivityAction(action);
  const targetLabel = getActivityTarget(activity);
  const description = activity?.description || activity?.message || `${actionLabel}${targetLabel ? ` • ${targetLabel}` : ''}`;
  const details = formatActivityDetails(activity?.details || activity?.note);
  const timestamp = formatDateTime(activity?.createdAt || activity?.timestamp || activity?.updatedAt);

  return `
    <article class="admin-dashboard-activity-item">
      <div class="admin-dashboard-activity-marker" aria-hidden="true">
        <span class="admin-dashboard-activity-dot"></span>
      </div>
      <div class="admin-dashboard-activity-copy">
        <div class="admin-dashboard-activity-head">
          <strong>${escapeHtml(description || 'Hoạt động quản trị')}</strong>
          <span class="admin-dashboard-activity-time">${escapeHtml(timestamp)}</span>
        </div>
        <div class="admin-dashboard-activity-labels">
          <span class="badge badge-dark">${escapeHtml(actionLabel)}</span>
          <span class="badge">Thực hiện: ${escapeHtml(getActivityActor(activity))}</span>
          ${targetLabel ? `<span class="badge">Đối tượng: ${escapeHtml(targetLabel)}</span>` : ''}
        </div>
        <p class="admin-dashboard-activity-detail">${escapeHtml(details)}</p>
      </div>
    </article>
  `;
}

function adminUserCardTemplate(user, options = {}) {
  const { showActions = true } = options;
  const userId = getObjectId(user);
  const isSelf = Boolean(userId) && userId === state.currentUser?.id;
  const canManage = showActions && !isSelf && Boolean(userId);
  const roleName = getRoleName(user?.role);
  const nextRole = roleName === 'admin' ? 'user' : 'admin';
  const banned = isUserBanned(user);

  return `
    <article class="admin-record-card">
      <div class="admin-record-head">
        <div class="admin-record-copy">
          <span class="kicker">Người dùng</span>
          <h3>${escapeHtml(getUserLabel(user))}</h3>
          <p class="admin-record-note">${escapeHtml(user?.email || 'Chưa cập nhật email')}</p>
        </div>
        <div class="admin-badge-row">
          <span class="badge ${roleName === 'admin' ? 'badge-dark' : ''}">${escapeHtml(formatRoleLabel(roleName))}</span>
          <span class="badge ${banned ? 'badge-danger' : 'badge-ok'}">${banned ? 'Đang bị khóa' : 'Đang hoạt động'}</span>
        </div>
      </div>
      <div class="admin-meta-row">
        <span class="meta-tag">SĐT: ${escapeHtml(user?.phone || 'Chưa cập nhật')}</span>
        <span class="meta-tag">Khu vực: ${escapeHtml(formatLocation(user?.location))}</span>
        <span class="meta-tag">Tạo lúc: ${escapeHtml(formatDateTime(user?.createdAt))}</span>
      </div>
      <div class="admin-kv-grid">
        <div class="admin-kv-item">
          <span>Mã người dùng</span>
          <strong>${escapeHtml(userId || 'Chưa có mã')}</strong>
        </div>
        <div class="admin-kv-item">
          <span>Cập nhật gần nhất</span>
          <strong>${escapeHtml(formatDateTime(user?.updatedAt || user?.createdAt))}</strong>
        </div>
        <div class="admin-kv-item">
          <span>Ghi chú</span>
          <strong>${escapeHtml(isSelf ? 'Tài khoản hiện tại của bạn' : 'Có thể điều chỉnh quyền hoặc trạng thái truy cập')}</strong>
        </div>
      </div>
      ${showActions ? `
        <div class="admin-record-actions">
          ${isSelf ? '<span class="header-link">Tài khoản hiện tại</span>' : ''}
          ${!isSelf && !canManage ? '<span class="header-link">Thiếu mã người dùng</span>' : ''}
          ${canManage ? `
            <button type="button" class="btn btn-primary" data-action="admin-user-role" data-id="${escapeHtml(userId)}" data-role="${escapeHtml(nextRole)}">${nextRole === 'admin' ? 'Cấp quyền admin' : 'Hạ về người dùng'}</button>
            <button type="button" class="btn btn-secondary" data-action="admin-user-ban" data-id="${escapeHtml(userId)}" data-banned="${String(!banned)}">${banned ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}</button>
            <button type="button" class="btn btn-secondary" data-action="admin-user-delete" data-id="${escapeHtml(userId)}">Xóa tài khoản</button>
          ` : ''}
        </div>
      ` : ''}
    </article>
  `;
}

function adminProductCardTemplate(product, options = {}) {
  const { showActions = true } = options;
  const productId = getObjectId(product);
  const canModerate = showActions && Boolean(productId);
  const moderation = getModerationStatus(product);
  const canApprove = canModerate && moderation.key !== 'approved';
  const canReject = canModerate && moderation.key !== 'rejected';
  const canHide = canModerate && moderation.key === 'approved';
  const canUnhide = canModerate && moderation.key === 'hidden';
  const categoryName = product?.category?.name || product?.categoryName || 'Danh mục chưa rõ';
  const sellerName = getUserLabel(product?.seller);

  return `
    <article class="admin-record-card">
      <div class="admin-record-head">
        <div class="admin-record-copy">
          <span class="kicker">Tin đăng</span>
          <h3>${escapeHtml(product?.title || 'Tin đăng chưa có tiêu đề')}</h3>
          <p class="admin-record-note">${escapeHtml(truncateText(product?.description || 'Chưa có mô tả chi tiết.', 180))}</p>
        </div>
        <div class="admin-badge-row">
          <span class="badge ${moderation.className}">${escapeHtml(moderation.label)}</span>
          <span class="badge ${product?.isSold ? 'badge-danger' : 'badge-ok'}">${product?.isSold ? 'Đã bán' : 'Đang bán'}</span>
        </div>
      </div>
      <div class="admin-meta-row">
        <span class="meta-tag">Người đăng: ${escapeHtml(sellerName)}</span>
        <span class="meta-tag">Danh mục: ${escapeHtml(categoryName)}</span>
        <span class="meta-tag">Giá: ${escapeHtml(formatCurrency(product?.price))}</span>
        <span class="meta-tag">Tạo lúc: ${escapeHtml(formatDateTime(product?.createdAt))}</span>
      </div>
      <div class="admin-kv-grid">
        <div class="admin-kv-item">
          <span>Khu vực</span>
          <strong>${escapeHtml(formatLocation(product?.location))}</strong>
        </div>
        <div class="admin-kv-item">
          <span>Lượt xem</span>
          <strong>${escapeHtml(formatCount(product?.views || 0))}</strong>
        </div>
        <div class="admin-kv-item">
          <span>Lượt lưu</span>
          <strong>${escapeHtml(formatCount(product?.favoritesCount || 0))}</strong>
        </div>
      </div>
      ${moderation.reason ? `<p class="admin-record-note">Lý do kiểm duyệt: ${escapeHtml(moderation.reason)}</p>` : ''}
      ${showActions ? `
        <div class="admin-record-actions">
          ${canModerate ? `<a href="#/product/${escapeHtml(productId)}" class="header-link">Xem tin</a>` : '<span class="header-link">Thiếu mã tin đăng</span>'}
          ${canApprove ? `<button type="button" class="btn btn-primary" data-action="admin-post-approve" data-id="${escapeHtml(productId)}">Duyệt tin</button>` : ''}
          ${canReject ? `<button type="button" class="btn btn-secondary" data-action="admin-post-reject" data-id="${escapeHtml(productId)}">Từ chối</button>` : ''}
          ${canHide ? `<button type="button" class="btn btn-secondary" data-action="admin-post-hide" data-id="${escapeHtml(productId)}">Ẩn tin</button>` : ''}
          ${canUnhide ? `<button type="button" class="btn btn-secondary" data-action="admin-post-unhide" data-id="${escapeHtml(productId)}">Hiện lại</button>` : ''}
          ${canModerate ? `<button type="button" class="btn btn-secondary" data-action="admin-post-delete" data-id="${escapeHtml(productId)}">Xóa tin</button>` : ''}
        </div>
      ` : ''}
    </article>
  `;
}

function adminActivityItemTemplate(activity) {
  const action = activity?.action || activity?.type || activity?.event || '';
  const actionLabel = formatActivityAction(action);
  const targetLabel = getActivityTarget(activity);
  const description = activity?.description || activity?.message || `${actionLabel}${targetLabel ? ` • ${targetLabel}` : ''}`;

  return `
    <article class="admin-activity-item">
      <div class="admin-record-head">
        <div class="admin-record-copy">
          <span class="kicker">Nhật ký</span>
          <strong>${escapeHtml(description || 'Hoạt động quản trị')}</strong>
          <p class="admin-record-note">${escapeHtml(formatActivityDetails(activity?.details || activity?.note))}</p>
        </div>
        <div class="admin-badge-row">
          <span class="badge badge-dark">${escapeHtml(actionLabel)}</span>
          <span class="badge">${escapeHtml(formatDateTime(activity?.createdAt || activity?.timestamp || activity?.updatedAt))}</span>
        </div>
      </div>
      <div class="admin-meta-row">
        <span class="meta-tag">Thực hiện: ${escapeHtml(getActivityActor(activity))}</span>
        ${targetLabel ? `<span class="meta-tag">Đối tượng: ${escapeHtml(targetLabel)}</span>` : ''}
        ${activity?.targetType ? `<span class="meta-tag">Loại: ${escapeHtml(activity.targetType)}</span>` : ''}
      </div>
    </article>
  `;
}

function renderAdminDashboard() {
  const dashboard = state.admin.dashboard || normalizeAdminDashboard({});
  const prioritizedProducts = dashboard.recentProducts.filter((product) => ['pending', 'hidden', 'rejected'].includes(getModerationStatus(product).key));
  const productsToShow = prioritizedProducts.slice(0, 4);

  if (adminDashboardMetrics) {
    adminDashboardMetrics.innerHTML = buildAdminDashboardMetricCards([
      { label: 'Chờ duyệt', value: dashboard.pendingProducts, note: 'Các tin cần phản hồi ngay trong hàng chờ', emphasis: true },
      { label: 'Tài khoản', value: dashboard.totalUsers, note: 'Tổng người dùng đang hiện diện trong hệ thống', emphasis: true },
      { label: 'Quản trị viên', value: dashboard.adminUsers, note: 'Tài khoản có thể thao tác khu vực nội bộ' },
      { label: 'Đang bị khóa', value: dashboard.bannedUsers, note: 'Các hồ sơ đang bị giới hạn truy cập' },
      { label: 'Tổng tin', value: dashboard.totalProducts, note: 'Số tin đăng đang được theo dõi' },
      { label: 'Nhật ký', value: dashboard.totalActivities, note: 'Bản ghi phục vụ đối soát thao tác' }
    ]);
  }

  if (adminDashboardUsersPreview) {
    adminDashboardUsersPreview.innerHTML = dashboard.recentUsers.length
      ? dashboard.recentUsers.slice(0, 4).map((user) => adminDashboardUserPreviewTemplate(user)).join('')
      : buildStateCard('Chưa có người dùng mới', 'Khi backend trả về tài khoản mới hoặc danh sách ưu tiên, khu vực này sẽ hiển thị để bạn theo dõi nhanh.', 'empty-state');
  }

  if (adminDashboardProductsPreview) {
    adminDashboardProductsPreview.innerHTML = productsToShow.length
      ? productsToShow.map((product) => adminDashboardProductWorkbenchTemplate(product)).join('')
      : buildStateCard('Hàng chờ đang thông thoáng', 'Hiện chưa có tin đăng nào ở trạng thái cần duyệt, ẩn lại hoặc xem xét từ chối trong khu vực điều phối.', 'empty-state');
  }

  if (adminDashboardActivitiesPreview) {
    adminDashboardActivitiesPreview.innerHTML = dashboard.recentActivities.length
      ? dashboard.recentActivities.slice(0, 6).map((activity) => adminDashboardActivityItemTemplate(activity)).join('')
      : buildStateCard('Chưa có nhật ký', 'Các thao tác quản trị mới sẽ được ghi nhận và hiển thị tại đây.', 'empty-state');
  }
}

function renderAdminUsers() {
  const users = state.admin.users || [];
  const adminCount = users.filter((user) => getRoleName(user?.role) === 'admin').length;
  const bannedCount = users.filter((user) => isUserBanned(user)).length;
  const recentCount = users.filter((user) => {
    const createdAt = new Date(user?.createdAt || 0).getTime();
    return createdAt && (Date.now() - createdAt) <= (7 * 24 * 60 * 60 * 1000);
  }).length;

  if (adminUserMetrics) {
    adminUserMetrics.innerHTML = buildAdminMetricCards([
      { label: 'Tổng tài khoản', value: users.length, note: 'Đang tồn tại trong hệ thống' },
      { label: 'Quản trị viên', value: adminCount, note: 'Có quyền thao tác khu vực admin' },
      { label: 'Đang bị khóa', value: bannedCount, note: 'Tạm thời chặn truy cập' },
      { label: 'Mới trong 7 ngày', value: recentCount, note: 'Tài khoản vừa tham gia gần đây' }
    ]);
  }

  if (adminUsersList) {
    adminUsersList.innerHTML = users.length
      ? users.map((user) => adminUserCardTemplate(user)).join('')
      : buildStateCard('Chưa có dữ liệu người dùng', 'Danh sách người dùng sẽ hiển thị khi hệ thống trả về dữ liệu quản trị.', 'empty-state');
  }
}

function renderAdminProducts() {
  const products = state.admin.products || [];
  const pendingCount = products.filter((product) => getModerationStatus(product).label === 'Chờ duyệt').length;
  const approvedCount = products.filter((product) => getModerationStatus(product).label === 'Đã duyệt').length;
  const rejectedCount = products.filter((product) => getModerationStatus(product).label === 'Từ chối').length;
  const hiddenCount = products.filter((product) => getModerationStatus(product).label === 'Đang ẩn').length;
  const soldCount = products.filter((product) => product?.isSold).length;

  if (adminProductMetrics) {
    adminProductMetrics.innerHTML = buildAdminMetricCards([
      { label: 'Tổng tin', value: products.length, note: 'Tin đăng đã được đồng bộ' },
      { label: 'Chờ duyệt', value: pendingCount, note: 'Cần xác nhận trước khi hiển thị' },
      { label: 'Đã duyệt', value: approvedCount, note: 'Đã sẵn sàng hoặc đang hiển thị' },
      { label: 'Từ chối', value: rejectedCount, note: 'Cần người bán chỉnh sửa và gửi lại' },
      { label: 'Đang ẩn', value: hiddenCount, note: 'Tạm thời không hiển thị công khai' },
      { label: 'Đã bán', value: soldCount, note: 'Các tin đã được đánh dấu bán xong' }
    ]);
  }

  if (adminProductsList) {
    adminProductsList.innerHTML = products.length
      ? products.map((product) => adminProductCardTemplate(product)).join('')
      : buildStateCard('Chưa có tin đăng', 'Khi backend trả về danh sách tin quản trị, khu vực này sẽ hiển thị để kiểm duyệt.', 'empty-state');
  }
}

function renderAdminActivities() {
  const activities = state.admin.activities || [];
  const recentCount = activities.filter((activity) => {
    const createdAt = new Date(activity?.createdAt || activity?.timestamp || 0).getTime();
    return createdAt && (Date.now() - createdAt) <= (24 * 60 * 60 * 1000);
  }).length;
  const roleChangeCount = activities.filter((activity) => /role/i.test(String(activity?.action || activity?.type || ''))).length;
  const moderationCount = activities.filter((activity) => /(approve|delete|ban|unban|product)/i.test(String(activity?.action || activity?.type || ''))).length;

  if (adminActivityMetrics) {
    adminActivityMetrics.innerHTML = buildAdminMetricCards([
      { label: 'Tổng bản ghi', value: activities.length, note: 'Nhật ký đang được lưu' },
      { label: 'Trong 24 giờ', value: recentCount, note: 'Nhịp hoạt động gần nhất' },
      { label: 'Đổi quyền', value: roleChangeCount, note: 'Các thao tác liên quan vai trò' },
      { label: 'Điều phối nội dung', value: moderationCount, note: 'Bao gồm duyệt, xóa hoặc khóa' }
    ]);
  }

  if (adminActivitiesList) {
    adminActivitiesList.innerHTML = activities.length
      ? activities.map((activity) => adminActivityItemTemplate(activity)).join('')
      : buildStateCard('Chưa có nhật ký hoạt động', 'Mọi thao tác quản trị sẽ xuất hiện tại đây để tiện theo dõi và kiểm tra.', 'empty-state');
  }
}

async function loadAdminDashboard() {
  if (!isAdminUser()) return;

  if (adminDashboardMetrics) {
    adminDashboardMetrics.innerHTML = buildStateCard('Đang tải tổng quan', 'Hệ thống đang lấy nhanh các chỉ số điều hành dành cho quản trị viên.', 'loading-state');
  }
  if (adminDashboardUsersPreview) {
    adminDashboardUsersPreview.innerHTML = buildStateCard('Đang tải người dùng', 'Hệ thống đang đồng bộ các tài khoản cần theo dõi.', 'loading-state');
  }
  if (adminDashboardProductsPreview) {
    adminDashboardProductsPreview.innerHTML = buildStateCard('Đang tải tin chờ duyệt', 'Hệ thống đang lấy danh sách bài đăng cần kiểm duyệt.', 'loading-state');
  }
  if (adminDashboardActivitiesPreview) {
    adminDashboardActivitiesPreview.innerHTML = buildStateCard('Đang tải nhật ký', 'Hệ thống đang truy xuất các hoạt động quản trị gần đây.', 'loading-state');
  }

  const [dashboardResponse, usersResponse, productsResponse, activitiesResponse] = await Promise.all([
    apiFetch('/api/admin/dashboard'),
    apiFetch('/api/admin/users').catch(() => ({ data: [] })),
    apiFetch('/api/admin/products').catch(() => ({ data: [] })),
    apiFetch('/api/admin/activities').catch(() => ({ data: [] }))
  ]);

  const dashboard = normalizeAdminDashboard(dashboardResponse.data || {});
  const fallbackUsers = extractAdminList(usersResponse.data, ['users', 'items', 'results', 'data']);
  const fallbackProducts = extractAdminList(productsResponse.data, ['products', 'items', 'results', 'data']);
  const fallbackActivities = extractAdminList(activitiesResponse.data, ['activities', 'items', 'results', 'logs', 'data']);

  if (!dashboard.recentUsers.length) {
    dashboard.recentUsers = fallbackUsers;
  }

  if (!dashboard.recentProducts.length) {
    dashboard.recentProducts = fallbackProducts.filter((product) => getModerationStatus(product).label === 'Chờ duyệt');
  }

  if (!dashboard.recentActivities.length) {
    dashboard.recentActivities = fallbackActivities;
  }

  dashboard.totalUsers = dashboard.totalUsers || fallbackUsers.length;
  dashboard.adminUsers = dashboard.adminUsers || fallbackUsers.filter((user) => getRoleName(user?.role) === 'admin').length;
  dashboard.bannedUsers = dashboard.bannedUsers || fallbackUsers.filter((user) => isUserBanned(user)).length;
  dashboard.totalProducts = dashboard.totalProducts || fallbackProducts.length;
  dashboard.pendingProducts = dashboard.pendingProducts || fallbackProducts.filter((product) => getModerationStatus(product).label === 'Chờ duyệt').length;
  dashboard.approvedProducts = dashboard.approvedProducts || fallbackProducts.filter((product) => getModerationStatus(product).label === 'Đã duyệt').length;
  dashboard.totalActivities = dashboard.totalActivities || fallbackActivities.length;

  state.admin.users = fallbackUsers.length ? fallbackUsers : state.admin.users;
  state.admin.products = fallbackProducts.length ? fallbackProducts : state.admin.products;
  state.admin.activities = fallbackActivities.length ? fallbackActivities : state.admin.activities;
  state.admin.dashboard = dashboard;
  renderAdminDashboard();
}

async function loadAdminUsers() {
  if (!isAdminUser()) return;

  if (adminUserMetrics) {
    adminUserMetrics.innerHTML = buildStateCard('Đang tải chỉ số người dùng', 'Hệ thống đang tổng hợp số liệu tài khoản.', 'loading-state');
  }
  if (adminUsersList) {
    adminUsersList.innerHTML = buildStateCard('Đang tải danh sách người dùng', 'Hệ thống đang lấy dữ liệu tài khoản để bạn quản lý.', 'loading-state');
  }

  const response = await apiFetch('/api/admin/users');
  state.admin.users = extractAdminList(response.data, ['users', 'items', 'results', 'data']);
  renderAdminUsers();
}

async function loadAdminProducts() {
  if (!isAdminUser()) return;

  if (adminProductMetrics) {
    adminProductMetrics.innerHTML = buildStateCard('Đang tải chỉ số tin đăng', 'Hệ thống đang tổng hợp dữ liệu kiểm duyệt bài đăng.', 'loading-state');
  }
  if (adminProductsList) {
    adminProductsList.innerHTML = buildStateCard('Đang tải danh sách tin', 'Hệ thống đang lấy luồng tin đăng dành cho quản trị viên.', 'loading-state');
  }

  const response = await apiFetch('/api/admin/products');
  state.admin.products = extractAdminList(response.data, ['products', 'items', 'results', 'data']);
  renderAdminProducts();
}

async function loadAdminActivities() {
  if (!isAdminUser()) return;

  if (adminActivityMetrics) {
    adminActivityMetrics.innerHTML = buildStateCard('Đang tải chỉ số nhật ký', 'Hệ thống đang đếm các hoạt động nội bộ gần đây.', 'loading-state');
  }
  if (adminActivitiesList) {
    adminActivitiesList.innerHTML = buildStateCard('Đang tải nhật ký hoạt động', 'Hệ thống đang lấy các thao tác quản trị để hiển thị.', 'loading-state');
  }

  const response = await apiFetch('/api/admin/activities');
  state.admin.activities = extractAdminList(response.data, ['activities', 'items', 'results', 'logs', 'data']);
  renderAdminActivities();
}

async function refreshAdminAfterUserChange() {
  await Promise.all([
    loadAdminDashboard().catch(() => null),
    loadAdminUsers().catch(() => null),
    loadAdminActivities().catch(() => null)
  ]);
}

async function refreshAdminAfterProductChange() {
  await Promise.all([
    loadAdminDashboard().catch(() => null),
    loadAdminProducts().catch(() => null),
    loadAdminActivities().catch(() => null),
    loadProducts().catch(() => null),
    loadDashboardProducts().catch(() => null),
    loadFavorites().catch(() => null)
  ]);
}

async function updateAdminUserRole(userId, role) {
  await apiFetch(`/api/admin/users/${userId}/role`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role })
  });

  setBanner(globalMessage, role === 'admin' ? 'Đã cấp quyền quản trị viên cho tài khoản đã chọn.' : 'Đã chuyển tài khoản về quyền người dùng.');
  await refreshAdminAfterUserChange();
}

async function toggleAdminUserBan(userId, shouldBan) {
  await apiFetch(`/api/admin/users/${userId}/ban`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isBanned: shouldBan })
  });

  setBanner(globalMessage, shouldBan ? 'Tài khoản đã được khóa tạm thời.' : 'Tài khoản đã được mở khóa.');
  await refreshAdminAfterUserChange();
}

async function deleteAdminUser(userId) {
  await apiFetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
  setBanner(globalMessage, 'Đã xóa tài khoản khỏi hệ thống.');
  await refreshAdminAfterUserChange();
}

async function approveAdminProduct(productId) {
  await apiFetch(`/api/admin/products/${productId}/approve`, { method: 'PUT' });
  setBanner(globalMessage, 'Tin đăng đã được duyệt thành công.');
  await refreshAdminAfterProductChange();
}

async function rejectAdminProduct(productId, reason) {
  await apiFetch(`/api/admin/products/${productId}/reject`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason })
  });
  setBanner(globalMessage, 'Tin đăng đã bị từ chối và người đăng sẽ thấy lý do kiểm duyệt.');
  await refreshAdminAfterProductChange();
}

async function hideAdminProduct(productId, reason) {
  await apiFetch(`/api/admin/products/${productId}/hide`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason })
  });
  setBanner(globalMessage, 'Tin đăng đã được ẩn tạm thời khỏi hệ thống công khai.');
  await refreshAdminAfterProductChange();
}

async function unhideAdminProduct(productId) {
  await apiFetch(`/api/admin/products/${productId}/unhide`, { method: 'PUT' });
  setBanner(globalMessage, 'Tin đăng đã được hiển thị lại theo trạng thái kiểm duyệt hiện tại.');
  await refreshAdminAfterProductChange();
}

async function deleteAdminProduct(productId) {
  await apiFetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
  setBanner(globalMessage, 'Tin đăng đã được xóa khỏi hệ thống.');
  await refreshAdminAfterProductChange();
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

  const allowedRoutes = ['dashboard', 'products', 'messages', 'favorites', 'profile', 'manage-posts', 'settings', 'sell', 'admin-dashboard', 'admin-users', 'admin-posts', 'admin-activities'];
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

  if (isAdminRoute(route.name) && !isAdminUser()) {
    await loadProfile().catch(() => null);
  }

  if (isAdminRoute(route.name) && !isAdminUser()) {
    state.pendingRouteMessage = 'Bạn không có quyền truy cập khu vực quản trị.';
    window.location.hash = '#/dashboard';
    return;
  }

  const kickerMap = {
    dashboard: 'Chợ trực tuyến',
    products: 'Tìm và duyệt nhanh',
    messages: 'Trao đổi để chốt đơn',
    'product-detail': 'Tin đăng được xem',
    favorites: 'Danh sách quan tâm',
    profile: 'Tài khoản cá nhân',
    'manage-posts': 'Hiệu quả tin đăng',
    settings: 'Hệ thống và nguyên tắc',
    sell: 'Đăng tin có hướng dẫn',
    'admin-dashboard': 'Bảng điều phối nội bộ',
    'admin-users': 'Kiểm soát tài khoản',
    'admin-posts': 'Duyệt nội dung hệ thống',
    'admin-activities': 'Truy vết thao tác nội bộ'
  };
  const titleMap = {
    dashboard: 'Trang chủ',
    products: 'Sản phẩm',
    messages: 'Tin nhắn',
    'product-detail': 'Chi tiết sản phẩm',
    favorites: 'Danh sách quan tâm',
    profile: 'Tài khoản cá nhân',
    'manage-posts': 'Hiệu quả tin đăng',
    settings: 'Cài đặt',
    sell: 'Đăng tin mới',
    'admin-dashboard': 'Tổng quan quản trị',
    'admin-users': 'Quản lý người dùng',
    'admin-posts': 'Kiểm duyệt tin đăng',
    'admin-activities': 'Nhật ký quản trị'
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
  if (state.pendingRouteMessage) {
    setBanner(globalMessage, state.pendingRouteMessage, 'error');
    state.pendingRouteMessage = null;
  }

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
    if (route.name === 'admin-dashboard') {
      await loadAdminDashboard();
    }
    if (route.name === 'admin-users') {
      await loadAdminUsers();
    }
    if (route.name === 'admin-posts') {
      await loadAdminProducts();
    }
    if (route.name === 'admin-activities') {
      await loadAdminActivities();
    }
  } catch (error) {
    if (error.status === 401) {
      clearSession();
      showAuthScreen('login');
      setBanner(authMessage, 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.', 'error');
      if (window.location.hash !== '#/login') {
        window.location.hash = '#/login';
      }
      return;
    }

    if (isAdminRoute(route.name) && error.status === 403) {
      await syncSessionFromServer().catch(() => null);

      if (!isAdminUser()) {
        state.pendingRouteMessage = 'Tài khoản hiện tại không có quyền truy cập khu vực quản trị.';
        window.location.hash = '#/dashboard';
        return;
      }
    }

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
  await refreshVisibleProductSurfaces(productId);
}

async function boostProduct(productId) {
  if (!isAuthenticated()) {
    showAuthScreen('login');
    setBanner(authMessage, 'Vui lòng đăng nhập để đẩy tin sản phẩm.', 'error');
    return;
  }

  await apiFetch(`/api/products/${productId}/boost`, { method: 'PUT' });
  setBanner(globalMessage, 'Đẩy tin sản phẩm thành công.');
  await refreshVisibleProductSurfaces(productId);
}

showLoginBtn.addEventListener('click', () => openAuthTab('login'));
showRegisterBtn.addEventListener('click', () => openAuthTab('register'));
forgotPasswordBtn?.addEventListener('click', () => openAuthTab('reset'));
backToLoginBtn?.addEventListener('click', () => openAuthTab('login'));
backToAppBtn?.addEventListener('click', () => {
  if (!isAuthenticated()) {
    openAuthTab('login');
    return;
  }

  showAppShell();
  renderRoute();
});
profileForgotPasswordBtn?.addEventListener('click', () => {
  showAuthScreen('reset');
  syncRecoveryForm(state.currentUser);
});

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
  const toggleButton = event.target.closest('[data-toggle-categories]');
  if (toggleButton) {
    state.categoryStripExpanded = !state.categoryStripExpanded;
    renderCategoryChips();
    return;
  }

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

    if (action === 'compare') {
      if (normalizeRoute().name === 'product-detail' && normalizeRoute().id === id) {
        const comparePanel = document.querySelector('.comparison-panel');
        comparePanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        state.pendingRouteMessage = 'Kéo xuống phần so sánh để xem nhanh các sản phẩm cùng danh mục.';
        window.location.hash = `#/product/${id}`;
      }
    }
    
    if (action === 'edit-images') {
      state.pendingRouteMessage = 'Bạn có thể thêm, xóa hoặc thay ảnh của tin đăng trong phần quản lý ảnh ở trang chi tiết.';
      window.location.hash = `#/product/${id}`;
    }
    if (action === 'select-detail-image') {
      const detailMainImage = document.getElementById('detailMainImage');
      if (detailMainImage) {
        detailMainImage.setAttribute('src', actionTarget.dataset.image || '');
        detailMainImage.setAttribute('alt', actionTarget.dataset.alt || 'Ảnh sản phẩm');
      }
    }
    if (action === 'remove-product-image') {
      const productId = actionTarget.dataset.productId || id;
      const imageId = actionTarget.dataset.imageId || '';
      if (!productId || !imageId) return;
      if (!window.confirm('Xóa ảnh này khỏi tin đăng?')) return;

      const response = await updateProductImages(productId, { removeImageId: imageId });
      setBanner(globalMessage, response.message || 'Đã xóa ảnh khỏi tin đăng.');
    }
    if (action === 'replace-product-image') {
      const productId = actionTarget.dataset.productId || id;
      const imageId = actionTarget.dataset.imageId || '';
      if (!productId || !imageId) return;

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.addEventListener('change', async () => {
        const selectedFile = input.files && input.files[0];
        if (!selectedFile) return;

        try {
          const response = await updateProductImages(productId, {
            replaceImageId: imageId,
            replaceFile: selectedFile
          });
          setBanner(globalMessage, response.message || 'Đã thay ảnh thành công.');
        } catch (error) {
          setBanner(globalMessage, error.message, 'error');
        }
      }, { once: true });
      input.click();
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
    if (action === 'admin-user-role') {
      const nextRole = actionTarget.dataset.role || 'user';
      const confirmMessage = nextRole === 'admin'
        ? 'Cấp quyền quản trị viên cho tài khoản này?'
        : 'Thu hồi quyền quản trị và chuyển tài khoản này về người dùng?';
      if (!window.confirm(confirmMessage)) return;
      await updateAdminUserRole(id, nextRole);
    }
    if (action === 'admin-user-ban') {
      const shouldBan = actionTarget.dataset.banned === 'true';
      const confirmMessage = shouldBan
        ? 'Khóa tạm thời tài khoản này?'
        : 'Mở khóa để tài khoản này hoạt động lại?';
      if (!window.confirm(confirmMessage)) return;
      await toggleAdminUserBan(id, shouldBan);
    }
    if (action === 'admin-user-delete') {
      if (!window.confirm('Xóa vĩnh viễn tài khoản này khỏi hệ thống?')) return;
      await deleteAdminUser(id);
    }
    if (action === 'admin-post-approve') {
      if (!window.confirm('Duyệt tin đăng này để cho phép hiển thị trên hệ thống?')) return;
      await approveAdminProduct(id);
    }
    if (action === 'admin-post-reject') {
      const reason = window.prompt('Nhập lý do từ chối tin đăng này:');
      if (reason === null) return;
      await rejectAdminProduct(id, reason);
    }
    if (action === 'admin-post-hide') {
      const reason = window.prompt('Nhập lý do ẩn tạm tin đăng này:');
      if (reason === null) return;
      await hideAdminProduct(id, reason);
    }
    if (action === 'admin-post-unhide') {
      if (!window.confirm('Hiện lại tin đăng này?')) return;
      await unhideAdminProduct(id);
    }
    if (action === 'admin-post-delete') {
      if (!window.confirm('Xóa tin đăng này khỏi hệ thống?')) return;
      await deleteAdminProduct(id);
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

forgotPasswordForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  setBanner(authMessage, 'Đang cập nhật mật khẩu, vui lòng chờ...');

  try {
    const formData = Object.fromEntries(new FormData(forgotPasswordForm).entries());
    if (String(formData.password || '') !== String(formData.confirmPassword || '')) {
      throw new Error('Mật khẩu xác nhận không trùng khớp.');
    }

    const payload = {
      email: String(formData.email || '').trim(),
      phone: String(formData.phone || '').trim(),
      password: String(formData.password || '')
    };

    await apiFetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    clearSession();
    forgotPasswordForm.reset();
    showAuthScreen('login');
    loginForm.elements.namedItem('email').value = payload.email;
    setBanner(authMessage, 'Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại bằng mật khẩu mới.', 'success');
    window.location.hash = '#/login';
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

refreshAdminDashboardBtn?.addEventListener('click', () => {
  loadAdminDashboard().catch((error) => setBanner(globalMessage, error.message, 'error'));
});

refreshAdminUsersBtn?.addEventListener('click', () => {
  loadAdminUsers().catch((error) => setBanner(globalMessage, error.message, 'error'));
});

refreshAdminProductsBtn?.addEventListener('click', () => {
  loadAdminProducts().catch((error) => setBanner(globalMessage, error.message, 'error'));
});

refreshAdminActivitiesBtn?.addEventListener('click', () => {
  loadAdminActivities().catch((error) => setBanner(globalMessage, error.message, 'error'));
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

productDetail.addEventListener('submit', async (event) => {
  const form = event.target.closest('#productImageUploadForm');
  if (!form) return;

  event.preventDefault();

  const fileInput = form.elements.namedItem('images');
  const productId = form.dataset.productId || '';
  const files = fileInput?.files || [];

  if (!productId) {
    setBanner(globalMessage, 'Không xác định được tin đăng cần cập nhật ảnh.', 'error');
    return;
  }

  if (!files.length) {
    setBanner(globalMessage, 'Vui lòng chọn ít nhất một ảnh để tải lên.', 'error');
    return;
  }

  try {
    const response = await updateProductImages(productId, { files });
    form.reset();
    setBanner(globalMessage, response.message || 'Đã cập nhật ảnh cho tin đăng.');
  } catch (error) {
    setBanner(globalMessage, error.message, 'error');
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
      role: response.data.role?.name || response.data.role || state.currentUser?.role || 'user',
      phone: response.data.phone,
      avatar: response.data.avatar || state.currentUser?.avatar,
      location: response.data.location
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

sessionLoginBtn?.addEventListener('click', () => {
  closeHeaderPanels();
  showAuthScreen('login');
  window.location.hash = '#/login';
});

sessionRegisterBtn?.addEventListener('click', () => {
  closeHeaderPanels();
  showAuthScreen('register');
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
      await loadProfile().catch(() => null);
      await loadConversations({ silent: true }).catch(() => null);
      updateUnreadBadge();

      if (!window.location.hash || window.location.hash === '#/login') {
        window.location.hash = '#/dashboard';
        return;
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
