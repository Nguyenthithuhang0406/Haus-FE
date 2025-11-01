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

export const flyToCart = (imageUrl, startElement) => {
  const cartIcon = document.querySelector("#cart-icon");
  if (!cartIcon || !startElement) return;

  const startRect = startElement.getBoundingClientRect();
  const endRect = cartIcon.getBoundingClientRect();

  const flyImage = document.createElement("div");
  flyImage.style.position = "fixed";
  flyImage.style.left = `${startRect.left}px`;
  flyImage.style.top = `${startRect.top}px`;
  flyImage.style.width = "100px"; // kích thước ban đầu 100x100
  flyImage.style.height = "100px";
  flyImage.style.borderRadius = "50%";
  flyImage.style.backgroundImage = `url(${imageUrl})`;
  flyImage.style.backgroundSize = "cover";
  flyImage.style.backgroundPosition = "center";
  flyImage.style.zIndex = 9999;
  flyImage.style.pointerEvents = "none";
  flyImage.style.opacity = "1";
  document.body.appendChild(flyImage);

  const startX = startRect.left;
  const startY = startRect.top;
  const endX = endRect.left + endRect.width / 2 - 15; // 15 = 30/2
  const endY = endRect.top + endRect.height / 2 - 15;

  // 📍 Thu nhỏ ngay xuống 30x30
  flyImage.animate(
    [
      { width: "100px", height: "100px", opacity: 1 },
      { width: "30px", height: "30px", opacity: 0.95 },
    ],
    { duration: 200, easing: "ease-in" }
  ).onfinish = () => {
    // 📍 Bay theo đường cong
    flyImage.animate(
      [
        { transform: `translate(0px, 0px)`, opacity: 0.95, offset: 0 },
        {
          transform: `translate(${(endX - startX) / 2}px, ${
            (endY - startY) / 2 - 100
          }px)`,
          opacity: 0.8,
          offset: 0.6,
        },
        {
          transform: `translate(${endX - startX}px, ${endY - startY}px)`,
          opacity: 0.1,
          offset: 1,
        },
      ],
      { duration: 900, easing: "cubic-bezier(0.45, 0, 0.2, 1)" }
    ).onfinish = () => {
      // 📍 Hiệu ứng nảy nhẹ ở giỏ hàng
      const bounce = document.createElement("div");
      bounce.style.position = "fixed";
      bounce.style.left = `${endRect.left + endRect.width / 2 - 10}px`;
      bounce.style.top = `${endRect.top + endRect.height / 2 - 10}px`;
      bounce.style.width = "20px";
      bounce.style.height = "20px";
      bounce.style.borderRadius = "50%";
      bounce.style.background = "rgba(255, 150, 50, 0.6)";
      bounce.style.zIndex = 10000;
      bounce.style.pointerEvents = "none";
      document.body.appendChild(bounce);

      bounce.animate(
        [
          { transform: "scale(0)", opacity: 0.8 },
          { transform: "scale(1.3)", opacity: 0.6 },
          { transform: "scale(0.8)", opacity: 0 },
        ],
        { duration: 400, easing: "ease-out" }
      ).onfinish = () => bounce.remove();

      flyImage.remove();
    };
  };
};
