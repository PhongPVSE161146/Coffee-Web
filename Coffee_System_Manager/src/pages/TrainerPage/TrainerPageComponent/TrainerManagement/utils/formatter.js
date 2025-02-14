export const formatter = (isoDate) => {
  const date = new Date(isoDate);
  const day = String(date.getDay()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).padStart(2, "0");

  return `${day}/${month}/${year}`;
};

export const isDate = (date) => {
  if (date instanceof Date) {
    return !isNaN(date);
  }

  const iso8601Regex =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(([+-]\d{2}:\d{2})|Z)$/;

  if (!iso8601Regex.test(date)) {
    return false; // Không khớp định dạng ISO 8601
  }

  const parsedDate = new Date(date);
  return !isNaN(parsedDate);
};
