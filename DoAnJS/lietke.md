# Công nghệ Frontend sử dụng trong dự án DoAnJS Marketplace

## Tổng quan
Dự án sử dụng **frontend thuần túy (vanilla)** với HTML5, CSS3 (Custom Properties & Modern Layouts), và JavaScript ES6+ thuần. Không sử dụng framework frontend (React, Vue, Angular) hoặc bundler (Webpack, Vite).

## Stack Frontend chi tiết

### 1. **HTML5**
- **Semantic HTML** với ARIA attributes cho accessibility
- **Forms** với validation native
- **Hash-based SPA routing** (không cần server-side rendering)

### 2. **CSS3 (Custom Design System)**
```
public/css/style.css (~1500+ lines)
├── CSS Custom Properties (CSS Variables) - 40+ biến
├── Flexbox & CSS Grid
├── Modern Box-shadow & Backdrop-filter
├── CSS Animations & Transitions
├── Mobile-first Responsive Design
│   ├── Breakpoints: 640px, 860px, 1080px
│   ├── Container queries tương lai-ready
├── CSS Logical Properties
└── Modern Selectors (:focus-visible, prefers-reduced-motion)
```
- **Font**: Google Fonts (Manrope)
- **Không CSS Framework** (Bootstrap, Tailwind)

### 3. **Vanilla JavaScript ES6+**
```
public/js/main.js (~2500+ lines)
├── Modern JS (async/await, destructuring, template literals)
├── Fetch API cho REST calls
├── FormData & File API (upload ảnh)
├── LocalStorage cho auth state
├── Dynamic DOM manipulation
├── Event delegation
├── Custom routing system (hash-based)
├── Polling cho real-time messages (5s interval)
├── Debouncing & requestAnimationFrame
└── Error boundaries & loading states
```

### 4. **CDN & External Resources**
```
├── Google Fonts: Manrope (400,500,600,700,800)
└── Không CDN libraries (jQuery, Lodash)
```

### 5. **Frontend Features**
| Tính năng | Implementation |
|-----------|----------------|
| **SPA Routing** | Hash-based + `hashchange` event |
| **State Management** | Global `state` object + LocalStorage |
| **Forms** | Native HTML5 + FormData |
| **File Upload** | Multer integration (backend) |
| **Real-time** | Client-side polling (5s) |
| **Responsive** | Mobile-first CSS Grid/Flexbox |
| **Accessibility** | ARIA, focus management, skip-links |
| **PWA-ready** | Service Worker potential |

### 6. **Package.json (Frontend-related)**
```
**Không frontend dependencies**
├── Chỉ backend deps: express, mongoose, multer, etc.
└── Development: nodemon
```

### 7. **Kiến trúc Frontend**
```
public/
├── index.html (Single entry-point SPA)
├── css/style.css (Monolithic CSS)
└── js/main.js (Application logic)
```

### 8. **Các màn hình Frontend hiện có**

#### Auth Screens
- **Landing + Login/Register** (`#authScreen`)
  - Hero section với highlights & metrics
  - Tabbed authentication (login/register)
  - Mobile-first form design

#### Main App Shell (`#appShell`)
```
Header (Sticky + Overlay panels)
├── Navigation panel (`#headerNavPanel`)
├── Global search (`#globalSearchForm`)  
├── Session panel (`#headerSessionPanel`)
└── Brand + Quick actions

Main Content (`#mainContent`)
├── Dashboard (`data-page="dashboard"`)
│   ├── Hero + Stats (`#homeProductCount`, `#homeCategoryCount`)
│   ├── Category chips (`#categoryChips`)
│   ├── Featured products (`#dashboardProducts`)
│   └── Action lanes
├── Products List (`data-page="products"`)
│   ├── Filter sidebar (`#productFilters`)
│   ├── Active filters (`#productsActiveFilters`)
│   ├── Products grid (`#productsList`)
│   └── Pagination
├── Product Detail (`data-page="product-detail"`)
│   ├── Image gallery (`#detailMainImage`)
│   ├── Description + Price
│   ├── Seller info + Contact CTA
│   └── Sticky contact card
├── Sell / Create Product (`data-page="sell"`)
│   ├── Step-by-step guide
│   └── Multi-step form (`#createProductForm`)
├── Favorites (`data-page="favorites"`)
│   └── Saved products grid (`#favoritesList`)
├── Messages (`data-page="messages"`)
│   ├── Conversations list (`#conversationsList`)
│   ├── Message thread (`#messageThread`)
│   └── Product context in chat
├── Profile (`data-page="profile"`)
│   ├── Profile summary + Avatar (`#profileSummary`)
│   └── Edit form (`#profileForm`)
├── Manage Posts (`data-page="manage-posts"`)
│   ├── Active posts (`#myProductsList`)
│   └── Sold posts (`#soldProductsList`)
└── Settings (`data-page="settings"`)

Footer
```

## Điểm mạnh
✅ **Zero dependencies** - Nhẹ, nhanh, không vendor lock  
✅ **Modern standards** - ES6+, CSS3 Grid/Flexbox  
✅ **Mobile-first** - Optimized cho chợ online (10+ responsive breakpoints)  
✅ **Accessible** - ARIA labels, keyboard nav, skip-links  
✅ **Performant** - No bundle, native APIs, requestAnimationFrame  
✅ **Complete Marketplace UX** - 9 screens + overlays  

## Điểm cần cải thiện
⚠️ **No TypeScript**  
⚠️ **No build step** (linting, minification)  
⚠️ **Manual state management** (global state object)  
⚠️ **No unit testing** (frontend logic)  
⚠️ **No SSR/SSG** cho SEO tốt hơn  

**Tổng kết**: Frontend **modern vanilla web platform** với **9 màn hình hoàn chỉnh** (Auth + Marketplace UX), custom design system, phù hợp MVP marketplace nhanh/lightweight.
