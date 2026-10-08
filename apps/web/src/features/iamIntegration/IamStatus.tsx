import type { IamResult } from "../../api/iamClient";

export function outcomeMessage(result: IamResult<unknown>): string {
  switch (result.kind) {
    case "confirmed": return "Server đã xác nhận thao tác.";
    case "refused": return result.status === 401 ? "Phiên không còn hợp lệ. Hãy đăng nhập lại." : "Server từ chối thao tác. Không có quyền, dữ liệu hoặc đầu vào phù hợp.";
    case "stale": return "Dữ liệu đã thay đổi hoặc trạng thái không phù hợp. Tải lại và kiểm tra trước khi gửi thao tác mới.";
    case "unavailable": return "Không lấy được dữ liệu từ Server. Chưa gửi thao tác; thử tải lại khi kết nối ổn định.";
    case "unresolved": return "Chưa xác định được kết quả. Không tự gửi lại. Kiểm tra trạng thái hiện tại; proof đã mất không thể lấy lại dạng rõ.";
  }
}
