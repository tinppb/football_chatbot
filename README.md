# ⚽ Football Bot VN — Deploy lên Vercel (Gemini AI - Miễn phí)

---

## Bước 1 — Lấy Gemini API Key (miễn phí)
1. Vào https://aistudio.google.com/apikey
2. Đăng nhập bằng tài khoản Google
3. Nhấn **Create API Key** → Copy key

## Bước 2 — Upload code lên GitHub
1. Vào https://github.com → New repository → Đặt tên (vd: football-bot-vn)
2. Upload toàn bộ file trong thư mục này

## Bước 3 — Deploy lên Vercel
1. Vào https://vercel.com/new
2. Import repo GitHub vừa tạo → nhấn **Deploy**

## Bước 4 — Thêm API Key
1. Vào **Settings → Environment Variables**
2. Nhấn **Add Environment Variable**:
   - Name:  GEMINI_API_KEY
   - Value: (key vừa copy)
   - Environments: chọn ALL (Production + Preview + Development)
3. **Save** → **Redeploy**

## Xong! 🎉
Link dạng: https://football-bot-vn.vercel.app

## Giới hạn miễn phí Gemini
- 15 requests/phút
- 1,500 requests/ngày
- Hoàn toàn miễn phí, không cần thẻ
