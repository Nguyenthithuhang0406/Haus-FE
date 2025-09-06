export const formatNumber = (number) => {
  if (!Number.isInteger(number)) {
    number = Math.floor(number);
  }

  return number.toLocaleString("de-DE");
};

// Hàm format phút:giây
export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};
export function formatDate(input) {
  const date = new Date(input);
  if (isNaN(date)) return ""; // nếu parse lỗi
  
  // Lấy ngày, tháng, năm đầy đủ
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatDateForApi(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}
