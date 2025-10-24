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

// trả về "HH:mm dd/MM/yyyy"
export function formatDateTime(
  isoString,
  { toTimeZone = null, withSeconds = false } = {}
) {
  // toTimeZone: null => dùng timezone của environment;
  // hoặc truyền 'UTC' hoặc 'Asia/Bangkok' để ép timezone.
  const opts = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  if (withSeconds) {
    opts.second = "2-digit";
  }

  const dtf = new Intl.DateTimeFormat("en-GB", {
    ...opts,
    timeZone: toTimeZone || undefined,
  });
  // Intl.DateTimeFormat en-GB trả "dd/mm/yyyy, HH:MM:SS" — ta tách lại cho định dạng mong muốn
  const parts = dtf.formatToParts(new Date(isoString));
  const map = {};
  for (const p of parts) map[p.type] = p.value;

  const hh = map.hour || "00";
  const mm = map.minute || "00";
  const ss = map.second || null;
  const dd = map.day || "01";
  const MM = map.month || "01";
  const yyyy = map.year || "1970";

  return withSeconds
    ? `${hh}:${mm}:${ss} ${dd}/${MM}/${yyyy}`
    : `${hh}:${mm} ${dd}/${MM}/${yyyy}`;
}

export function getTargetDate(daysRemaining) {
  const now = new Date();
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + daysRemaining); 
  targetDate.setHours(23, 59, 59, 0); 
  return targetDate.toISOString().split(".")[0]; 
}
