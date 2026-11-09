# CourseHub — Quản lý khóa học

Bản 2: React Native + Expo, backend MockAPI thật. Đã viết lại luồng khởi động, CRUD, validation, xử lý lỗi và giao diện. Không có backend riêng hay danh sách hardcode thay API.

## Giới hạn xác minh

Chưa chạy build hoặc thử trực tiếp trên điện thoại trong phiên tạo mã. Không khẳng định đã sửa được native crash chỉ bằng việc thay code. Workflow Check mobile app kiểm tra unit test và export JavaScript cho Android/iOS sau commit; export thành công cũng không chứng minh native runtime không crash. ErrorBoundary chỉ bắt lỗi JavaScript khi render, không bắt lỗi native, lỗi tải bundle hoặc SDK mismatch.

## Cài và chạy trên Windows

Dùng Node.js 24 bản vá mới hoặc Node 26; tránh bản 24.16.0 đã gây assertion trên máy người dùng. VS Code chỉ là editor. Không cần tạo project Android Studio mới.

```powershell
git clone https://github.com/Cuaaaaa2504/Bai-5.git
cd Bai-5
npm run setup
npm test
npx expo-doctor@latest
npm run tunnel
```

Nếu đã clone, kiểm tra `git status` rồi `git pull` trước. Nếu App.js đang được thay bằng màn hình thử, sao lưu ra ngoài repo trước khi khôi phục file; không dùng reset --hard để tránh mất công việc.

### Đồng bộ SDK với Expo Go

Baseline trong package.json là SDK 57 theo metadata npm đã kiểm tra khi viết. Đây không phải cam kết là SDK mới nhất hoặc SDK đang được cài trong Expo Go của bạn. Mỗi bản Expo Go chỉ hỗ trợ SDK tương ứng. Nếu điện thoại yêu cầu SDK 58, chạy:

```powershell
npm run setup -- --sdk=58
npx expo-doctor@latest
npm run tunnel
```

Script setup cài Expo rồi đọc bundledNativeModules.json của chính SDK đó để chọn React, React Native, expo-video, AsyncStorage, safe-area và constants. Không đoán version native package và không dùng --force/--legacy-peer-deps. Script thay package.json và tạo/cập nhật package-lock.json; giữ hai file cùng nhau, commit sau khi kiểm thử thành công. Chạy lại setup khi đổi SDK, không chỉ chạy npm install rồi mở app vì các module tùy chọn được cài ở bước setup. Trước đổi SDK, sao lưu thay đổi hoặc commit trạng thái hiện tại.

Mở Expo Go tương thích và quét QR mới. iPhone thật cần Expo Go và CLI cùng tài khoản: `npx expo whoami`, `npx expo login`. Nếu dùng máy ảo Android, mở emulator rồi `npm run android`. Nếu điện thoại vẫn tự đóng, lấy log terminal và log thiết bị; không lặp lại cài Node khi lỗi Node đã hết.

## MockAPI đã cấu hình

Base URL mặc định: `https://6af2096142c6561ced38f09d.mockapi.io/api/v1`

App tự tải từ URL này khi mở lần đầu. Tab Cấu hình cho đổi URL và kiểm tra trước khi lưu; URL đã lưu từ phiên bản cũ được ưu tiên. Không cần nhập lại nếu đã đúng.

Tạo hai resource độc lập, không lồng nhau:

| Resource | Schema |
|---|---|
| categories | id tự sinh; name String; description String |
| courses | id tự sinh; title String; description String; categoryId String; instructor String; price Number; duration Number; thumbnail String; trailerUrl String; createdAt String |

Chỉ lưu URL ảnh/trailer. categoryId liên kết id danh mục. Tên danh mục luôn lấy từ API.

### Dữ liệu mẫu

Dùng Actions > Seed MockAPI > Run workflow > main > tích confirm_write. Hoặc PowerShell:

```powershell
$env:MOCKAPI_BASE_URL="https://6af2096142c6561ced38f09d.mockapi.io/api/v1"
npm run seed -- --confirm
```

Đây là thao tác ghi 3 danh mục và 10 khóa học lên API, không phải dữ liệu giả hiển thị cục bộ. Phải tạo schema trước. Script bỏ qua tên/tiêu đề đã tồn tại và không xóa dữ liệu cũ; lỗi giữa chừng có thể đã ghi một phần. Video Big Buck Bunny chỉ minh họa kỹ thuật phát MP4, không phải trailer thật của khóa học.

## Màn hình và chức năng

1. Danh sách: ảnh bìa, tên, giảng viên, tên danh mục, giá VNĐ; tìm theo tên và lọc danh mục kết hợp; kéo tải lại.
2. Chi tiết: gọi GET theo id, toàn bộ thông tin, ảnh, trailer trong modal, sửa/xóa có xác nhận.
3. Form thêm/sửa: trường bắt buộc, chọn danh mục từ API, preview ảnh, học phí hữu hạn >=0, thời lượng >0, URL hợp lệ và MP4 trực tiếp. createdAt giữ lại khi sửa.
4. Danh mục: danh sách, thêm/sửa/xóa; GET khóa học mới nhất và chặn xóa danh mục có khóa học.
5. Cấu hình: Base URL, nền tảng, thông tin SDK. Có loading, lỗi, retry và dữ liệu rỗng.

Tìm kiếm/lọc phía client trên dữ liệu API. CRUD dùng GET/POST/PUT/DELETE. Sau ghi tải lại hai resource; ghi thành công nhưng refresh lỗi thì hiện thông báo phân biệt. Chặn thao tác trùng khi đang gửi. Kiểm tra categoryId bằng danh mục mới nhất trước lưu. Ràng buộc xóa danh mục là phía client, không thể bảo đảm transaction nếu nhiều client đồng thời. Không hỗ trợ link trang YouTube.

## Cấu trúc

- App.js: boot guard và ErrorBoundary.
- src/AppRoot.js: điều phối màn hình và thao tác API.
- src/ui.js: component và styles dùng chung.
- src/Trailer.js: chỉ require khi mở trailer, dùng expo-video và tự giải phóng player khi unmount.
- src/api.js: timeout, JSON, HTTP errors, kiểm tra mảng và id.
- src/domain.mjs: validation thuần, dùng chung với unit test.
- src/config.js: Base URL mặc định.
- scripts/setup.mjs: đồng bộ dependency theo Expo SDK.
- scripts/seed.mjs: nạp dữ liệu API thật.

## Kiểm thử trước khi nộp

- [ ] Check mobile app trên Actions thành công; giữ lockfile đã kiểm tra.
- [ ] App mở trên điện thoại đúng Expo Go SDK; không chỉ dừng ở export bundle.
- [ ] API có ít nhất 3 danh mục và 10 khóa học.
- [ ] Tìm kiếm/lọc, chi tiết đúng id, phát/dừng/toàn màn hình/đóng trailer.
- [ ] POST/PUT/DELETE phản ánh trên MockAPI và còn đúng sau mở lại app.
- [ ] Sửa danh mục cập nhật tên ở khóa học; chặn xóa danh mục có khóa học.
- [ ] Validation trường rỗng, số âm, NaN, categoryId không tồn tại, URL hỏng.
- [ ] Tắt mạng, retry, ảnh/video lỗi, API rỗng trên project thử nghiệm riêng.

## Kịch bản video nộp bài

Giới thiệu app và schema; GET courses/categories và ghép categoryId; tìm/lọc; GET chi tiết; phát MP4 trong app; POST thêm; PUT sửa; DELETE xóa và đối chiếu MockAPI; CRUD danh mục và chặn xóa; validation, loading và mất mạng; giải thích source API và JSON.

Sản phẩm nộp: source repo, link project/API MockAPI, README và video ghi hình. Video chưa được ghi tự động. Không dùng dữ liệu nhạy cảm vì endpoint MockAPI có thể cho ghi công khai.
