const {
  compare,
  isLetter,
  normalizeString,
  getIndicesOf,
  isNumber,
} = require("./stringUtils");

function isValidBetween2Numbers(value) {
  if (value === "") return true;
  for (let i = 0; i < value.length; i++) {
    if (isLetter(value[i])) {
      return false;
    }
  }
  return true;
}

function findSoKieuDonVi(value) {
  let temp = normalizeString(value);
  const arr = ["don vi", "donvi", "donv", "dvi"];
  let count = 0;
  arr.forEach((item) => {
    temp = temp.replaceAll(item, "");
    count++;
  });

  if (count === 0) return "";
  const numbers = [];
  for (let i = 0; i < temp.length; i++) {
    if (isNumber(temp[i])) numbers.push(Number.parseInt(temp[i]));
  }
  if (numbers.length === 0) return "";

  let finalResult = "";

  numbers.forEach((item) => {
    const top = (item + 1) * 10;
    for (let i = item * 10; i < top; i++) {
      finalResult += `${i} `;
    }
  });

  return ` ${finalResult}`;
}

function xuLyDonVi(message) {
  const messageLen = message.length;
  const arr = ["don vi", "donvi", "donv", "dvi"];

  /// Lấy ra các mẫu có thể là số dạng đơn vị
  const patterns = [];
  arr.forEach((item) => {
    for (let i = 1; i < 10; i++) {
      patterns.push(`${item}${i}`);
      patterns.push(`${item} ${i}`);
    }
  });

  /// Lấy ra vị trí của các mẫu ở trên
  const result = [];
  patterns.forEach((item) => {
    const indices = getIndicesOf(item, message);
    if (indices.length > 0) {
      result.push({ item, indices });
    }
  });

  /// Lấy ra vị trí đầu và cuối của một chuỗi con có thể là số đơn vị
  const response = [];
  result.forEach((item) => {
    const value = item["item"];
    const indices = item["indices"];
    const valueLen = value.length;
    for (let i = 0; i < indices.length; i++) {
      const index = indices[i];
      let start = index;
      let end = index - 1 + valueLen;
      while (start - 1 >= 0 && !isLetter(message[start - 1])) start--;
      while (end + 1 < messageLen && !isLetter(message[end + 1])) end++;
      response.push({ start, end });
    }
  });

  response.sort(compare);

  /// Xử lý dạng liên tiếp nhau
  let cur = 0;
  while (cur + 1 < response.length) {
    const curItem = response[cur];
    const nextItem = response[cur + 1];
    const curEnd = curItem["end"];
    const nextStart = nextItem["start"];
    if (curEnd <= nextStart) {
      const middleValue = message.substring(curEnd, nextStart);
      if (isValidBetween2Numbers(middleValue)) {
        response.shift();
        response.shift();
        response.unshift({
          start: curItem["start"],
          end: nextItem["end"],
        });
      }
    }
  }

  let delta = 0;
  response.forEach((item) => {
    const s = item["start"] - 1 + delta;
    const e = item["end"] + 1 + delta;

    const value = message.substring(s + 1, e);
    const soDonVi = findSoKieuDonVi(value);
    if (soDonVi !== "") {
      delta = soDonVi.length - value.length;
      message = message.replaceBetween(s + 1, e, soDonVi);
    }
  });

  return message;
}

module.exports = xuLyDonVi;
