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
  const canReportNow = canReportProduct(product);
  const hasReportedNow = hasSubmittedProductReport(product._id);
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
          ${canReportNow ? `<button type="button" class="btn btn-secondary${hasReportedNow ? ' product-report-complete' : ''}" data-action="report" data-id="${product._id}" data-report-product-id="${product._id}" data-product-title="${escapeHtml(product.title)}"${hasReportedNow ? ' disabled aria-disabled="true"' : ''}>${hasReportedNow ? 'Đã gửi báo cáo' : 'Báo cáo tin đăng'}</button>` : ''}
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

function getManualCompareCategoryId() {
  return state.filters.category || '';
}

function resetManualComparison({ keepMode = state.manualComparison.active } = {}) {
  state.manualComparison.active = keepMode;
  state.manualComparison.categoryId = keepMode ? getManualCompareCategoryId() : '';
  state.manualComparison.selectedProductIds = [];
  state.manualComparison.selectedProducts = [];
  state.manualComparison.comparedProductIds = [];
}

function syncManualComparisonState() {
  if (!state.manualComparison.active) {
    resetManualComparison({ keepMode: false });
    return;
  }

  const categoryId = getManualCompareCategoryId();
  if (!categoryId) {
    state.manualComparison.categoryId = '';
    state.manualComparison.selectedProductIds = [];
    state.manualComparison.selectedProducts = [];
    state.manualComparison.comparedProductIds = [];
    return;
  }

  if (state.manualComparison.categoryId !== categoryId) {
    state.manualComparison.categoryId = categoryId;
    state.manualComparison.selectedProductIds = [];
    state.manualComparison.selectedProducts = [];
    state.manualComparison.comparedProductIds = [];
    return;
  }

  if (state.manualComparison.comparedProductIds.length) {
    const selectedIds = new Set(state.manualComparison.selectedProductIds);
    state.manualComparison.comparedProductIds = state.manualComparison.comparedProductIds.filter((id) => selectedIds.has(id));

    if (state.manualComparison.comparedProductIds.length < 2) {
      state.manualComparison.comparedProductIds = [];
    } else {
      state.manualComparison.comparedProductIds = state.manualComparison.selectedProductIds.slice();
    }
  }
}

function getManualCompareProducts(ids = state.manualComparison.selectedProductIds) {
  const productsById = new Map([
    ...state.manualComparison.selectedProducts.map((product) => [getObjectId(product), product]),
    ...state.products.map((product) => [getObjectId(product), product])
  ]);
  return ids.map((id) => productsById.get(id)).filter(Boolean);
}

function renderManualComparisonPanel() {
  if (!manualComparePanel) return;

  const compareProducts = getManualCompareProducts(state.manualComparison.comparedProductIds);
  if (compareProducts.length < 2) {
    manualComparePanel.hidden = true;
    manualComparePanel.innerHTML = '';
    return;
  }

  const categoryName = getCategoryNameById(getManualCompareCategoryId());
  const filteredCount = formatCount(state.pagination.total || state.products.length);
  const visibleCount = formatCount(state.products.length);

  manualComparePanel.hidden = false;
  manualComparePanel.innerHTML = `
    <div class="section-head section-head-wrap compact-head">
      <div>
        <p class="kicker">So sánh thủ công</p>
        <h3>${escapeHtml(categoryName)}</h3>
        <p class="section-helper">Đối chiếu nhanh ${escapeHtml(formatCount(compareProducts.length))} sản phẩm đã chọn từ danh sách đang lọc.</p>
      </div>
    </div>
    <div class="comparison-current-card">
      <div>
        <span class="comparison-label">Danh sách đang lọc</span>
        <strong>${escapeHtml(categoryName)}</strong>
      </div>
      <div class="comparison-current-meta">
        <span class="meta-tag">${escapeHtml(filteredCount)} sản phẩm phù hợp</span>
        <span class="meta-tag">${escapeHtml(visibleCount)} đang hiển thị trên trang</span>
        <span class="meta-tag">${escapeHtml(formatCount(compareProducts.length))} đã chọn để so sánh</span>
      </div>
    </div>
    <div class="comparison-grid">
      ${compareProducts.map((product) => `
        <article class="comparison-card">
          <div class="comparison-card-head">
            <div>
              <span class="comparison-label">${escapeHtml(product.category?.name || categoryName)}</span>
              <h4>${escapeHtml(product.title)}</h4>
            </div>
            <strong class="price">${formatCurrency(product.price)}</strong>
          </div>
          <div class="comparison-meta-row">
            <span class="meta-tag soft">${escapeHtml(formatCondition(product.condition))}</span>
            <span class="meta-tag soft">${escapeHtml(formatLocation(product.location))}</span>
            <span class="meta-tag soft">${escapeHtml(formatRelativeTime(product.createdAt))}</span>
          </div>
          <div class="profile-data compact-data comparison-data">
            <div class="profile-row"><strong>Người đăng</strong><span>${escapeHtml(product.seller?.name || 'Người bán đã xác minh')}</span></div>
            <div class="profile-row"><strong>Tình trạng</strong><span>${escapeHtml(formatCondition(product.condition))}</span></div>
            <div class="profile-row"><strong>Khu vực</strong><span>${escapeHtml(formatLocation(product.location))}</span></div>
            <div class="profile-row"><strong>Lượt xem</strong><span>${escapeHtml(formatCount(product.views || 0))}</span></div>
            <div class="profile-row"><strong>Lượt lưu</strong><span>${escapeHtml(formatCount(product.favoritesCount || 0))}</span></div>
          </div>
          <p class="product-snippet">${escapeHtml(truncateText(product.description || 'Không có mô tả chi tiết.', 150))}</p>
          <div class="comparison-card-actions">
            <button type="button" class="btn btn-primary" data-action="detail" data-id="${escapeHtml(getObjectId(product))}">Xem chi tiết</button>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

function renderManualComparisonUI() {
  if (!toggleCompareModeBtn || !openManualCompareBtn || !compareModeSummary) return;

  const active = state.manualComparison.active;
  const categoryId = getManualCompareCategoryId();
  const hasCategory = Boolean(categoryId);
  const selectedCount = state.manualComparison.selectedProductIds.length;
  const compareReady = active && hasCategory && selectedCount >= 2;
  const filteredCount = formatCount(state.pagination.total || state.products.length);
  const visibleCount = formatCount(state.products.length);

  toggleCompareModeBtn.textContent = active ? 'Thoát chế độ so sánh' : 'Bật chế độ so sánh';
  openManualCompareBtn.disabled = !compareReady;
  openManualCompareBtn.textContent = compareReady
    ? `So sánh ${formatCount(selectedCount)} sản phẩm`
    : 'Chọn ít nhất 2 sản phẩm';

  if (!active) {
    compareModeSummary.textContent = 'Bật chế độ so sánh để chọn sản phẩm trực tiếp từ danh sách đang lọc.';
  } else if (!hasCategory) {
    compareModeSummary.textContent = 'Chế độ so sánh đang bật. Hãy áp dụng bộ lọc danh mục để chỉ giữ lại các sản phẩm cùng nhóm trước khi chọn.';
  } else if (!state.products.length) {
    compareModeSummary.textContent = `Danh mục ${getCategoryNameById(categoryId)} hiện chưa có sản phẩm phù hợp với bộ lọc đang áp dụng.`;
  } else {
    compareModeSummary.textContent = `${getCategoryNameById(categoryId)} có ${filteredCount} sản phẩm phù hợp, đang hiển thị ${visibleCount} sản phẩm trên trang này và bạn đã chọn ${formatCount(selectedCount)} sản phẩm.`;
  }

  renderManualComparisonPanel();
}

function toggleManualComparisonMode() {
  resetManualComparison({ keepMode: !state.manualComparison.active });
  renderProducts(state.products);
}

function toggleManualComparisonSelection(productId) {
  if (!state.manualComparison.active || !getManualCompareCategoryId()) return;

  const targetId = String(productId || '');
  if (!targetId) return;

  const selectedIds = new Set(state.manualComparison.selectedProductIds);
  if (selectedIds.has(targetId)) {
    selectedIds.delete(targetId);
    state.manualComparison.selectedProducts = state.manualComparison.selectedProducts.filter((product) => getObjectId(product) !== targetId);
  } else {
    selectedIds.add(targetId);
    const product = state.products.find((item) => getObjectId(item) === targetId);
    if (product) {
      state.manualComparison.selectedProducts = [
        ...state.manualComparison.selectedProducts.filter((item) => getObjectId(item) !== targetId),
        product
      ];
    }
  }

  state.manualComparison.selectedProductIds = Array.from(selectedIds);

  if (state.manualComparison.comparedProductIds.length) {
    state.manualComparison.comparedProductIds = state.manualComparison.selectedProductIds.length >= 2
      ? state.manualComparison.selectedProductIds.slice()
      : [];
  }

  renderProducts(state.products);
}

function openManualComparisonPanel() {
  if (!state.manualComparison.active || !getManualCompareCategoryId()) return;
  if (state.manualComparison.selectedProductIds.length < 2) return;

  state.manualComparison.comparedProductIds = state.manualComparison.selectedProductIds.slice();
  renderManualComparisonUI();
  manualComparePanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  syncManualComparisonState();

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

  const currentConversation = state.conversations.find((item) => item._id === conversationId);
  const previousUnreadCount = currentConversation?.unreadCount || 0;

  const response = await apiFetch(`/api/conversations/${conversationId}/messages`);
  state.activeConversation = response.data.conversation;
  state.activeConversationId = response.data.conversation._id;
  state.messages = response.data.messages || [];
  state.conversations = state.conversations.map((conversation) => (
    conversation._id === conversationId
      ? { ...conversation, unreadCount: 0 }
      : conversation
  ));
  if (previousUnreadCount > 0 && typeof state.unreadMeta.messageCount === 'number') {
    state.unreadMeta = {
      ...state.unreadMeta,
      unreadCount: Math.max(0, (state.unreadMeta.unreadCount || 0) - previousUnreadCount),
      messageCount: Math.max(0, state.unreadMeta.messageCount - previousUnreadCount)
    };
  }
  renderConversations(state.conversations);
  renderMessageThread();
  updateUnreadBadge();
  await loadUnreadMeta().catch(() => null);
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
  const reportCount = Number(product?.reportStats?.pending || 0);

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
          ${reportCount > 0 ? `<span class="badge badge-warn">${escapeHtml(formatCount(reportCount))} báo cáo chờ xử lý</span>` : ''}
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
  const reportCount = Number(product?.reportStats?.pending || 0);

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
          ${reportCount > 0 ? `<span class="badge badge-warn">${escapeHtml(formatCount(reportCount))} báo cáo chờ xử lý</span>` : ''}
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

function adminReportCardTemplate(report) {
  const reportId = getObjectId(report);
  const productId = getObjectId(report?.product);
  const productTitle = report?.product?.title || report?.productSnapshot?.title || 'Tin đăng không còn tồn tại';
  const sellerName = getUserLabel(report?.seller || report?.product?.seller);
  const reporterName = getUserLabel(report?.reporter);
  const status = String(report?.status || 'pending');
  const statusMeta = status === 'dismissed'
    ? { label: 'Đã bỏ qua', className: 'badge-dark' }
    : status === 'reviewed'
      ? { label: 'Đã xem xét', className: 'badge-ok' }
      : { label: 'Chờ xử lý', className: 'badge-warn' };

  return `
    <article class="admin-record-card">
      <div class="admin-record-head">
        <div class="admin-record-copy">
          <span class="kicker">Báo cáo người dùng</span>
          <h3>${escapeHtml(productTitle)}</h3>
          <p class="admin-record-note">${escapeHtml(report?.reasonText || 'Không có mô tả chi tiết.')}</p>
        </div>
        <div class="admin-badge-row">
          <span class="badge ${statusMeta.className}">${escapeHtml(statusMeta.label)}</span>
          <span class="badge">${escapeHtml(formatReportReasonLabel(report?.reasonCode))}</span>
        </div>
      </div>
      <div class="admin-meta-row">
        <span class="meta-tag">Người báo cáo: ${escapeHtml(reporterName)}</span>
        <span class="meta-tag">Người đăng: ${escapeHtml(sellerName)}</span>
        <span class="meta-tag">Tạo lúc: ${escapeHtml(formatDateTime(report?.createdAt))}</span>
      </div>
      <div class="admin-kv-grid">
        <div class="admin-kv-item">
          <span>Trạng thái</span>
          <strong>${escapeHtml(statusMeta.label)}</strong>
        </div>
        <div class="admin-kv-item">
          <span>Người xử lý</span>
          <strong>${escapeHtml(getUserLabel(report?.reviewedBy) || 'Chưa xử lý')}</strong>
        </div>
        <div class="admin-kv-item">
          <span>Ghi chú admin</span>
          <strong>${escapeHtml(report?.adminNote || 'Chưa có ghi chú')}</strong>
        </div>
      </div>
      <div class="admin-record-actions">
        ${productId ? `<a href="#/product/${escapeHtml(productId)}" class="header-link">Xem tin</a>` : '<span class="header-link">Tin đăng không còn khả dụng</span>'}
        ${status === 'pending' ? `<button type="button" class="btn btn-primary" data-action="admin-report-review" data-id="${escapeHtml(reportId)}" data-status="reviewed">Đánh dấu đã xem xét</button>` : ''}
        ${status === 'pending' ? `<button type="button" class="btn btn-secondary" data-action="admin-report-review" data-id="${escapeHtml(reportId)}" data-status="dismissed">Bỏ qua báo cáo</button>` : ''}
      </div>
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

function renderAdminReports() {
  const reports = state.admin.reports || [];
  const pendingCount = reports.filter((report) => report?.status === 'pending').length;
  const reviewedCount = reports.filter((report) => report?.status === 'reviewed').length;
  const dismissedCount = reports.filter((report) => report?.status === 'dismissed').length;
  const uniqueProducts = new Set(reports.map((report) => getObjectId(report?.product)).filter(Boolean)).size;

  if (adminReportMetrics) {
    adminReportMetrics.innerHTML = buildAdminMetricCards([
      { label: 'Tổng báo cáo', value: reports.length, note: 'Các báo cáo người dùng đã gửi vào hệ thống' },
      { label: 'Chờ xử lý', value: pendingCount, note: 'Cần kiểm tra và phản hồi sớm' },
      { label: 'Đã xem xét', value: reviewedCount, note: 'Đã có người quản trị ghi nhận' },
      { label: 'Đã bỏ qua', value: dismissedCount, note: 'Báo cáo không cần hành động thêm' },
      { label: 'Tin bị báo cáo', value: uniqueProducts, note: 'Số tin đăng khác nhau có phát sinh báo cáo' }
    ]);
  }

  if (adminReportsList) {
    adminReportsList.innerHTML = reports.length
      ? reports.map((report) => adminReportCardTemplate(report)).join('')
      : buildStateCard('Chưa có báo cáo', 'Khi người dùng báo cáo tin đăng, khu vực này sẽ hiển thị để quản trị viên xử lý.', 'empty-state');
  }
}
