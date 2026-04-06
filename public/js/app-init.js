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
  toggle.addEventListener('click', async () => {
    toggleHeaderPanel(toggle.dataset.panelToggle);

    if (toggle.dataset.panelToggle === 'notifications' && state.activeHeaderPanel === 'notifications') {
      await loadNotifications({ skipMarkRead: false }).catch((error) => setBanner(globalMessage, error.message, 'error'));
    }
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;

  if (state.productReport.open) {
    closeProductReportModal();
    return;
  }

  if (!state.activeHeaderPanel) return;

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

  if (normalizeRoute().name === 'products') {
    loadProducts().catch((error) => setBanner(globalMessage, error.message, 'error'));
    return;
  }

  window.location.hash = '#/products';
});

document.addEventListener('click', (event) => {
  if (!state.activeHeaderPanel || !marketHeaderShell) return;
  if (marketHeaderShell.contains(event.target)) return;

  closeHeaderPanels();
});

marketHeaderShell?.addEventListener('click', (event) => {
  const notificationEntry = event.target.closest('[data-notification-id]');
  if (notificationEntry) {
    const notificationId = notificationEntry.dataset.notificationId;
    if (notificationId) {
      apiFetch(`/api/users/notifications/${notificationId}/read`, { method: 'PUT' }).catch(() => null);
      state.notifications = state.notifications.map((notification) => (
        notification._id === notificationId ? { ...notification, isRead: true } : notification
      ));
      if (state.unreadMeta.notificationCount > 0) {
        state.unreadMeta = {
          ...state.unreadMeta,
          unreadCount: Math.max(0, (state.unreadMeta.unreadCount || 0) - 1),
          notificationCount: Math.max(0, state.unreadMeta.notificationCount - 1)
        };
      }
      renderNotificationsPanel();
      updateUnreadBadge();
    }
  }

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
    if (action === 'close-report-modal') {
      closeProductReportModal();
      return;
    }

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

    if (action === 'toggle-manual-compare') {
      toggleManualComparisonSelection(id);
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
    if (action === 'report') {
      openProductReportModal({
        productId: id,
        productTitle: actionTarget.dataset.productTitle || ''
      });
      return;
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
    if (action === 'admin-report-review') {
      const nextStatus = actionTarget.dataset.status || 'reviewed';
      const adminNote = window.prompt(nextStatus === 'dismissed' ? 'Ghi chú khi bỏ qua báo cáo này:' : 'Ghi chú xử lý báo cáo này (có thể để trống):', '');
      if (adminNote === null) return;
      if (nextStatus === 'dismissed' && !window.confirm('Đánh dấu báo cáo này là không cần xử lý thêm?')) return;
      await reviewAdminReport(id, nextStatus, adminNote.trim());
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
    await Promise.all([
      loadMetadata(),
      loadDashboardProducts(),
      loadProducts(),
      loadProfile(),
      loadNotifications({ silent: true, skipMarkRead: true })
    ]);
    startNotificationPolling();
    window.location.hash = '#/dashboard';
    setBanner(globalMessage, 'Đăng nhập thành công. Chào mừng bạn quay lại.');
    window.setTimeout(() => {
      revealUnreadNotifications();
    }, 0);
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

toggleCompareModeBtn?.addEventListener('click', () => {
  toggleManualComparisonMode();
});

openManualCompareBtn?.addEventListener('click', () => {
  openManualComparisonPanel();
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

refreshAdminReportsBtn?.addEventListener('click', () => {
  loadAdminReports().catch((error) => setBanner(globalMessage, error.message, 'error'));
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

productReportForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (state.productReport.submitting) return;

  const productId = state.productReport.productId;
  if (!productId) {
    setInlineBox(productReportFeedback, 'Không xác định được tin đăng cần báo cáo.', 'error');
    return;
  }

  const formData = new FormData(productReportForm);
  const reasonCode = String(formData.get('reasonCode') || '').trim();
  const reasonTextInput = String(formData.get('reasonText') || '').trim();
  const selectedReason = REPORT_REASON_OPTIONS.find((item) => item.code === reasonCode);

  if (!selectedReason) {
    setInlineBox(productReportFeedback, 'Vui lòng chọn một lý do báo cáo hợp lệ.', 'error');
    return;
  }

  const reasonText = reasonTextInput || `Lý do người dùng chọn: ${selectedReason.label}.`;

  if (reasonText.length > 500) {
    setInlineBox(productReportFeedback, 'Mô tả báo cáo tối đa 500 ký tự.', 'error');
    productReportReasonText?.focus();
    return;
  }

  clearInlineBox(productReportFeedback);
  state.productReport.submitting = true;
  renderProductReportModal();

  try {
    await submitProductReport(productId, reasonText, selectedReason.code);
    markProductReportSubmitted(productId);
    state.productReport.submitting = false;
    state.productReport.success = true;
    renderProductReportModal();
    focusProductReportModal();
  } catch (error) {
    state.productReport.submitting = false;
    renderProductReportModal();
    setInlineBox(productReportFeedback, error.message, 'error');
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
  closeProductReportModal({ force: true });
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
      await Promise.all([
        loadConversations({ silent: true }).catch(() => null),
        loadNotifications({ silent: true, skipMarkRead: true }).catch(() => null)
      ]);
      updateUnreadBadge();
      startNotificationPolling();

      if (!window.location.hash || window.location.hash === '#/login') {
        window.location.hash = '#/dashboard';
        window.setTimeout(() => {
          revealUnreadNotifications();
        }, 0);
        return;
      }

      await renderRoute();
      revealUnreadNotifications();
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
