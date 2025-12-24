const formatDate = (date) => {
  if (!date) return "-";

  const d = new Date(date);

  // Shift time to UTC-4
  const utcMinus4 = new Date(d.getTime() - 4 * 60 * 60 * 1000);

  return utcMinus4.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export default formatDate;