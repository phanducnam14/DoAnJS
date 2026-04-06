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
