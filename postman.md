# Postman Test Guide

## 1. Chuẩn bị và chạy server

1. Mở terminal tại thư mục gốc dự án (có `package.json`), ví dụ:
   - `cd d:\BT_NodeJS\DoAnJS-feature\DoAnJS-feature`
2. Copy `.env.example` → `.env`, bật MongoDB khớp `MONGO_URI`.
3. `npm install`
4. Chạy API: `npm run dev` hoặc `npm start`
5. **Seed dữ liệu mẫu (gồm categories, subcategories, locations):** `npm run seed`  
   Chỉ chạy trên DB sạch; nếu đã có dữ liệu trùng tên sẽ lỗi duplicate — xóa collection hoặc đổi tên trong `seed.js`.

Mặc định: `http://localhost:3000` (hoặc theo `PORT` trong `.env`).

## 2. Tạo environment trong Postman

- `base_url` = `http://localhost:3000`
- `auth_token` = (sau khi login)
- `category_id`, `subcategory_id`, `location_id` = (sau khi tạo hoặc copy từ `GET` bên dưới)

**Thứ tự hợp lệ:** Đăng ký/Đăng nhập → có **category** → **subcategory** (cần `category` hợp lệ) → **location** → **tạo sản phẩm**.

## 3. Các bước test Postman

### Bước 1: `Register`

- `POST` `{{base_url}}/api/auth/register`
- Body JSON:

```json
{
  "name": "Test User",
  "email": "user@test.com",
  "password": "123456",
  "phone": "0123456789"
}
```

### Bước 2: `Login`

- `POST` `{{base_url}}/api/auth/login`

```json
{
  "email": "user@test.com",
  "password": "123456"
}
```

- Lưu `data.tokens.accessToken` vào `auth_token`.

### Bước 3: Lấy danh sách — Categories / Subcategories / Locations (để copy `_id`)

- `GET` `{{base_url}}/api/categories`
- `GET` `{{base_url}}/api/subcategories` (tuỳ chọn: `?category=<categoryObjectId>`)
- `GET` `{{base_url}}/api/locations`

Response: `{ "success": true, "data": [ { "_id": "...", ... } ] }`. Dùng các `_id` này cho bước tạo sản phẩm nếu đã seed hoặc đã tạo trước đó.

### Bước 4: `Create Category` (nếu chưa có trong DB)

- `POST` `{{base_url}}/api/categories`

```json
{
  "name": "Điện thoại",
  "description": "Mô tả tuỳ chọn"
}
```

- `slug` tự sinh từ `name`. Nếu báo trùng tên/slug, đổi `name` hoặc xóa document cũ.

### Bước 5: `Create SubCategory`

- `POST` `{{base_url}}/api/subcategories`

```json
{
  "name": "iPhone",
  "category": "{{category_id}}"
}
```

- `category` phải là ObjectId thật của một category (không điền placeholder). `slug` tự sinh, **không cần** gửi `slug` trong body.

### Bước 6: `Create Location`

- `POST` `{{base_url}}/api/locations`

```json
{
  "province": "Hà Nội",
  "district": "Hoàn Kiếm",
  "ward": "Hàng Trống"
}
```

- Bắt buộc: `province`.

### Bước 7: `Create Product`

- `POST` `{{base_url}}/api/products`
- Header: `Authorization: Bearer {{auth_token}}`
- Body JSON (raw), thay biến bằng `_id` thật:

```json
{
  "title": "Điện thoại iPhone 15",
  "description": "Máy like new, 99%",
  "price": 25000000,
  "condition": "like_new",
  "category": "{{category_id}}",
  "subCategory": "{{subcategory_id}}",
  "location": "{{location_id}}"
}
```

- `subCategory` có thể bỏ nếu schema cho phép (hiện tại là tuỳ chọn), nhưng nên gửi để đủ dữ liệu giống chợ thật.

### Bước 8: `Get Products` / `Get current user`

- `GET` `{{base_url}}/api/products`
- `GET` `{{base_url}}/api/users/me` + header `Authorization: Bearer {{auth_token}}`

## 4. Link test nhanh

| API | Method | URL |
|-----|--------|-----|
| Register | POST | `{{base_url}}/api/auth/register` |
| Login | POST | `{{base_url}}/api/auth/login` |
| List categories | GET | `{{base_url}}/api/categories` |
| List subcategories | GET | `{{base_url}}/api/subcategories` |
| List locations | GET | `{{base_url}}/api/locations` |
| Create category | POST | `{{base_url}}/api/categories` |
| Create subcategory | POST | `{{base_url}}/api/subcategories` |
| Create location | POST | `{{base_url}}/api/locations` |
| Products | GET/POST | `{{base_url}}/api/products` |
| Product by id | GET | `{{base_url}}/api/products/:id` |
| Me | GET | `{{base_url}}/api/users/me` |

## 5. Cách dùng `auth_token`

Headers: `Authorization` = `Bearer {{auth_token}}`

## 6. Cổng khác

Đổi `base_url` (ví dụ `http://localhost:3001`) cho khớp `PORT`.

## 7. Ghi chú / lỗi thường gặp

- **Category/SubCategory từng lỗi validation `slug`:** schema đã tạo `slug` trong hook `pre('validate')`; chỉ cần gửi `name` (và `category` cho subcategory).
- **Subcategory báo không tìm thấy category:** `category` phải là `_id` đúng chuỗi 24 ký tự hex; tạo category trước hoặc lấy từ `GET /api/categories`.
- **Duplicate sau seed:** không POST lại cùng tên category đã có; dùng `GET` lấy `_id` có sẵn.