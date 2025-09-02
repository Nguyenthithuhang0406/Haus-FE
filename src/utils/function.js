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
