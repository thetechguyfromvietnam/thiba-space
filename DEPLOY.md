# Hướng dẫn Deploy lên Vercel

## Bước 1: Tạo repository trên GitHub

1. Đăng nhập vào GitHub và tạo repository mới
2. Đặt tên repository (ví dụ: `thiba-space-coffee-shop`)
3. **KHÔNG** khởi tạo với README, .gitignore, hoặc license (vì đã có sẵn)

## Bước 2: Push code lên GitHub

Sau khi tạo repository, chạy các lệnh sau (thay `YOUR_USERNAME` và `YOUR_REPO_NAME`):

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Hoặc nếu dùng SSH:
```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Bước 3: Deploy lên Vercel

### Cách 1: Deploy qua Vercel Dashboard (Khuyến nghị)

1. Truy cập https://vercel.com và đăng nhập bằng GitHub
2. Click "Add New Project"
3. Import repository vừa tạo trên GitHub
4. Vercel sẽ tự động detect cấu hình:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Click "Deploy"
6. Chờ vài phút để Vercel build và deploy
7. Sau khi deploy xong, bạn sẽ có URL như: `https://your-project.vercel.app`

### Cách 2: Deploy qua Vercel CLI

```bash
# Cài đặt Vercel CLI (nếu chưa có)
npm i -g vercel

# Deploy
vercel

# Follow các prompt:
# - Set up and deploy? Yes
# - Which scope? Chọn account của bạn
# - Link to existing project? No
# - Project name? (Enter để dùng tên mặc định)
# - Directory? ./
# - Override settings? No
```

## Bước 4: Cấu hình tự động deploy

Sau khi deploy lần đầu, mỗi khi bạn push code lên GitHub, Vercel sẽ tự động deploy lại.

## Lưu ý

- Ứng dụng sử dụng localStorage để lưu dữ liệu, nên dữ liệu sẽ chỉ lưu trên trình duyệt của từng người dùng
- Nếu cần lưu dữ liệu trên server, bạn có thể tích hợp thêm database sau

