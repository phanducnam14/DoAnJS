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
const headerNotificationsPanel = document.getElementById('headerNotificationsPanel');
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
const productReportModal = document.getElementById('productReportModal');
const productReportForm = document.getElementById('productReportForm');
const productReportProductTitle = document.getElementById('productReportProductTitle');
const productReportReasonOptions = document.getElementById('productReportReasonOptions');
const productReportReasonText = document.getElementById('productReportReasonText');
const productReportFeedback = document.getElementById('productReportFeedback');
const productReportSubmitBtn = document.getElementById('productReportSubmitBtn');
const productReportSuccess = document.getElementById('productReportSuccess');
const productReportSuccessText = document.getElementById('productReportSuccessText');
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
const notificationsPanelList = document.getElementById('notificationsPanelList');
const headerBarNotificationsBadge = document.getElementById('headerBarNotificationsBadge');
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
const compareModeSummary = document.getElementById('compareModeSummary');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const toggleCompareModeBtn = document.getElementById('toggleCompareModeBtn');
const openManualCompareBtn = document.getElementById('openManualCompareBtn');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const manualComparePanel = document.getElementById('manualComparePanel');
const myPostsActiveCount = document.getElementById('myPostsActiveCount');
const myPostsSoldCount = document.getElementById('myPostsSoldCount');
const refreshAdminDashboardBtn = document.getElementById('refreshAdminDashboardBtn');
const refreshAdminUsersBtn = document.getElementById('refreshAdminUsersBtn');
const refreshAdminProductsBtn = document.getElementById('refreshAdminProductsBtn');
const refreshAdminReportsBtn = document.getElementById('refreshAdminReportsBtn');
const refreshAdminActivitiesBtn = document.getElementById('refreshAdminActivitiesBtn');
const adminDashboardMetrics = document.getElementById('adminDashboardMetrics');
const adminDashboardUsersPreview = document.getElementById('adminDashboardUsersPreview');
const adminDashboardProductsPreview = document.getElementById('adminDashboardProductsPreview');
const adminDashboardActivitiesPreview = document.getElementById('adminDashboardActivitiesPreview');
const adminUserMetrics = document.getElementById('adminUserMetrics');
const adminUsersList = document.getElementById('adminUsersList');
const adminProductMetrics = document.getElementById('adminProductMetrics');
const adminProductsList = document.getElementById('adminProductsList');
const adminReportMetrics = document.getElementById('adminReportMetrics');
const adminReportsList = document.getElementById('adminReportsList');
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
const REPORT_REASON_OPTIONS = [
  { code: 'fraud', label: 'Nghi ngờ lừa đảo' },
  { code: 'spam', label: 'Tin rác hoặc quảng cáo' },
  { code: 'wrong_category', label: 'Sai danh mục' },
  { code: 'prohibited_item', label: 'Hàng hóa không phù hợp' },
  { code: 'duplicate', label: 'Tin trùng lặp' },
  { code: 'sold_already', label: 'Tin đã bán nhưng chưa gỡ' },
  { code: 'other', label: 'Lý do khác' }
];
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
  notifications: [],
  notificationPollTimer: null,
  products: [],
  featuredProducts: [],
  productComparison: {
    productId: '',
    peers: [],
    criteria: null,
    error: ''
  },
  productReport: {
    open: false,
    productId: '',
    productTitle: '',
    submitting: false,
    success: false,
    reportedProductIds: []
  },
  manualComparison: {
    active: false,
    categoryId: '',
    selectedProductIds: [],
    selectedProducts: [],
    comparedProductIds: []
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
  unreadMeta: {
    unreadCount: null,
    messageCount: null,
    notificationCount: null
  },
  admin: {
    dashboard: null,
    users: [],
    products: [],
    reports: [],
    activities: []
  }
};

const headerPanels = {
  nav: headerNavPanel,
  search: headerSearchPanel,
  notifications: headerNotificationsPanel,
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
  stopNotificationPolling();
  state.notifications = [];
  state.unreadMeta = {
    unreadCount: 0,
    messageCount: 0,
    notificationCount: 0
  };
  localStorage.removeItem('token');
  setUser(null);
  renderNotificationsPanel();
  updateUnreadBadge();
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
  return ['admin-dashboard', 'admin-users', 'admin-posts', 'admin-reports', 'admin-activities'].includes(name);
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

function canReportProduct(product) {
  return Boolean(state.currentUser?.id) && !isAdminUser() && !isOwnedByCurrentUser(product) && !product?.isSold;
}

function formatReportReasonLabel(value) {
  const match = REPORT_REASON_OPTIONS.find((item) => item.code === String(value || '').trim());
  return match?.label || 'Lý do khác';
}

function buildReportReasonPromptText() {
  return REPORT_REASON_OPTIONS.map((item, index) => `${index + 1}. ${item.label}`).join('\n');
}

function hasSubmittedProductReport(productId) {
  const targetId = String(productId || '');
  return Boolean(targetId) && state.productReport.reportedProductIds.includes(targetId);
}

function buildProductReportReasonOptions(selectedReasonCode = REPORT_REASON_OPTIONS[0]?.code || '') {
  return REPORT_REASON_OPTIONS.map((item) => `
    <label class="report-reason-option">
      <input type="radio" name="reasonCode" value="${escapeHtml(item.code)}"${item.code === selectedReasonCode ? ' checked' : ''} required />
      <span class="report-reason-option-body">
        <strong>${escapeHtml(item.label)}</strong>
      </span>
    </label>
  `).join('');
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
    review_report: 'Xem xét báo cáo',
    dismiss_report: 'Bỏ qua báo cáo',
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
    pendingReports: pickNumber(metrics.pendingReports, payload.pendingReports),
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

function clearInlineBox(element) {
  if (!element) return;
  element.textContent = '';
  element.classList.remove('error', 'success');
}

function resetProductReportForm() {
  productReportForm?.reset();

  if (productReportReasonOptions) {
    productReportReasonOptions.innerHTML = buildProductReportReasonOptions();
  }

  clearInlineBox(productReportFeedback);
}

function renderProductReportModal() {
  if (!productReportModal) return;

  const { open, productTitle, submitting, success } = state.productReport;
  productReportModal.hidden = !open;
  productReportModal.style.display = open ? 'grid' : 'none';
  productReportModal.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('report-modal-open', open);

  if (!open) {
    return;
  }

  if (productReportProductTitle) {
    productReportProductTitle.textContent = productTitle || 'Tin đăng đang xem';
  }

  if (productReportSuccessText) {
    productReportSuccessText.textContent = productTitle
      ? `Báo cáo thành công. Quản trị viên sẽ xem xét tin đăng "${productTitle}" trong thời gian sớm nhất.`
      : 'Báo cáo thành công. Quản trị viên sẽ xem xét phản ánh của bạn trong thời gian sớm nhất.';
  }

  if (productReportForm) {
    productReportForm.hidden = success;
  }

  if (productReportSuccess) {
    productReportSuccess.hidden = !success;
  }

  if (productReportReasonText) {
    productReportReasonText.disabled = submitting || success;
  }

  productReportForm?.querySelectorAll('input[name="reasonCode"]').forEach((input) => {
    input.disabled = submitting || success;
  });

  productReportModal.querySelectorAll('button[data-action="close-report-modal"]').forEach((button) => {
    button.disabled = submitting;
  });

  if (productReportSubmitBtn) {
    productReportSubmitBtn.disabled = submitting || success;
    productReportSubmitBtn.textContent = submitting ? 'Đang gửi báo cáo...' : 'Gửi báo cáo';
  }
}

function focusProductReportModal() {
  if (!state.productReport.open) return;

  window.requestAnimationFrame(() => {
    const target = state.productReport.success
      ? productReportSuccess?.querySelector('[data-action="close-report-modal"]')
      : productReportForm?.querySelector('input[name="reasonCode"]:checked');

    target?.focus();
  });
}

function openProductReportModal({ productId, productTitle }) {
  const targetId = String(productId || '');
  if (!targetId || hasSubmittedProductReport(targetId)) return;

  closeHeaderPanels();
  state.productReport.open = true;
  state.productReport.productId = targetId;
  state.productReport.productTitle = String(productTitle || 'Tin đăng đang xem').trim() || 'Tin đăng đang xem';
  state.productReport.submitting = false;
  state.productReport.success = false;

  resetProductReportForm();
  renderProductReportModal();
  focusProductReportModal();
}

function closeProductReportModal({ force = false } = {}) {
  if (!force && state.productReport.submitting) return;
  if (!state.productReport.open && !force) return;

  state.productReport.open = false;
  state.productReport.productId = '';
  state.productReport.productTitle = '';
  state.productReport.submitting = false;
  state.productReport.success = false;

  resetProductReportForm();
  renderProductReportModal();
}

function syncProductReportCallToAction(productId) {
  const targetId = String(productId || '');
  if (!targetId || !productDetail) return;

  const trigger = productDetail.querySelector(`[data-report-product-id="${targetId}"]`);
  if (!(trigger instanceof HTMLButtonElement)) return;

  trigger.disabled = true;
  trigger.textContent = 'Đã gửi báo cáo';
  trigger.classList.add('product-report-complete');
  trigger.setAttribute('aria-disabled', 'true');
}

function markProductReportSubmitted(productId) {
  const targetId = String(productId || '');
  if (!targetId) return;

  if (!state.productReport.reportedProductIds.includes(targetId)) {
    state.productReport.reportedProductIds = [...state.productReport.reportedProductIds, targetId];
  }

  syncProductReportCallToAction(targetId);
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
  closeProductReportModal({ force: true });
  authScreen.classList.remove('hidden');
  appShell.classList.add('hidden');
  openAuthTab(tab);
}

function showAppShell() {
  closeProductReportModal({ force: true });
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

function stopNotificationPolling() {
  if (state.notificationPollTimer) {
    window.clearInterval(state.notificationPollTimer);
    state.notificationPollTimer = null;
  }
}

function startNotificationPolling() {
  stopNotificationPolling();
  if (!isAuthenticated()) return;

  state.notificationPollTimer = window.setInterval(() => {
    loadNotifications({ silent: true, skipMarkRead: true }).catch(() => null);
  }, 30000);
}

function revealUnreadNotifications() {
  const unreadNotifications = state.notifications.filter((notification) => !notification.isRead);
  if (!unreadNotifications.length) return;

  openHeaderPanel('notifications');

  const latestApprovalNotification = unreadNotifications.find((notification) => notification.type === 'product');
  if (latestApprovalNotification) {
    setBanner(globalMessage, latestApprovalNotification.message || 'Bạn có thông báo mới từ quản trị viên.');
  }
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
    compactManageActions = false,
    manualCompareMode = false,
    manualCompareSelected = false
  } = options;
  const productId = getObjectId(product);
  const imageUrl = getProductImageUrl(product);
  const sellerName = product.seller?.name || 'Người bán đã xác minh';
  const postedTime = formatRelativeTime(product.createdAt);
  const categoryName = product.category?.name || '';
  const locationLabel = formatLocation(product.location);
  const moderation = getModerationStatus(product);
  const canFavoriteNow = allowFavorite && canFavoriteProduct(product);
  const canMessageNow = canMessageProductSeller(product);
  const canBoostNow = allowBoost && canBoostProduct(product);
  const compareToggle = manualCompareMode ? `
    <label class="product-compare-toggle ${manualCompareSelected ? 'is-selected' : ''}">
      <input type="checkbox" data-action="toggle-manual-compare" data-id="${productId}" ${manualCompareSelected ? 'checked' : ''} />
      <span>${manualCompareSelected ? 'Đã chọn để so sánh' : 'Chọn để so sánh'}</span>
    </label>
  ` : '';
  const secondaryActions = [
    canMessageNow ? `<button type="button" class="btn btn-secondary" data-action="start-conversation" data-id="${product._id}">${buildButtonLabel('message', 'Nhắn tin')}</button>` : '',
    canFavoriteNow ? `<button type="button" class="btn btn-secondary" data-action="favorite" data-id="${product._id}">${buildButtonLabel('heart', 'Lưu tin')}</button>` : '',
    canBoostNow ? `<button type="button" class="btn btn-secondary" data-action="boost" data-id="${product._id}">${buildButtonLabel('rocket', 'Đẩy tin')}</button>` : '',
    allowManageImages ? `<button type="button" class="btn btn-secondary" data-action="edit-images" data-id="${product._id}">${buildButtonLabel('image', compactManageActions ? 'Ảnh' : 'Quản lý ảnh')}</button>` : '',
    allowMarkSold && !product.isSold ? `<button type="button" class="btn btn-secondary" data-action="mark-sold" data-id="${product._id}">${buildButtonLabel('check', markSoldLabel)}</button>` : ''
  ].filter(Boolean).join('');

  return `
    <article class="product-card${manualCompareSelected ? ' is-compare-selected' : ''}">
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
        ${compareToggle}
        <button type="button" class="btn btn-primary product-primary-action" data-action="detail" data-id="${product._id}">${buildButtonLabel('eye', compactManageActions ? 'Chi tiết' : 'Xem chi tiết')}</button>
        ${secondaryActions ? `<div class="product-quick-actions">${secondaryActions}</div>` : ''}
      </div>
    </article>
  `;
}

function renderProducts(products) {
  const manualCompareMode = state.manualComparison.active && Boolean(getManualCompareCategoryId());
  const selectedIds = new Set(state.manualComparison.selectedProductIds);

  if (!products.length) {
    updateProductsSummary('Không tìm thấy kết quả phù hợp với bộ lọc hiện tại.');
    productsList.innerHTML = buildStateCard('Không tìm thấy sản phẩm phù hợp', 'Hãy thử đổi từ khóa tìm kiếm hoặc bộ lọc để xem thêm kết quả khác.', 'empty-state');
    renderManualComparisonUI();
    return;
  }

  productsList.innerHTML = products.map((product) => productCardTemplate(product, {
    manualCompareMode,
    manualCompareSelected: selectedIds.has(getObjectId(product))
  })).join('');
  renderManualComparisonUI();
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

function renderNotificationsPanel() {
  if (!notificationsPanelList) return;

  if (!state.notifications.length) {
    notificationsPanelList.innerHTML = buildStateCard('Chưa có thông báo', 'Khi bài đăng của bạn được duyệt hoặc có cập nhật mới, thông báo sẽ xuất hiện tại đây.', 'empty-state');
    return;
  }

  notificationsPanelList.innerHTML = state.notifications.map((notification) => {
    const href = notification.relatedId ? `#/product/${notification.relatedId}` : '#/dashboard';
    return `
      <a href="${href}" class="notification-entry ${notification.isRead ? '' : 'is-unread'}" data-notification-id="${escapeHtml(notification._id)}">
        <div class="notification-entry-copy">
          <strong>${escapeHtml(notification.title || 'Thông báo hệ thống')}</strong>
          <p>${escapeHtml(notification.message || '')}</p>
        </div>
        <span>${escapeHtml(formatRelativeTime(notification.createdAt))}</span>
      </a>
    `;
  }).join('');
}

function updateUnreadBadge() {
  const totalUnread = typeof state.unreadMeta.messageCount === 'number'
    ? state.unreadMeta.messageCount
    : state.conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
  const notificationUnread = typeof state.unreadMeta.notificationCount === 'number'
    ? state.unreadMeta.notificationCount
    : state.notifications.filter((notification) => !notification.isRead).length;
  
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

  if (headerBarNotificationsBadge) {
    if (notificationUnread > 0) {
      headerBarNotificationsBadge.textContent = notificationUnread > 9 ? '9+' : String(notificationUnread);
      headerBarNotificationsBadge.classList.remove('hidden');
      headerBarNotificationsBadge.setAttribute('aria-label', `${notificationUnread} thông báo chưa đọc`);
    } else {
      headerBarNotificationsBadge.classList.add('hidden');
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
