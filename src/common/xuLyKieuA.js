const {
  compare,
  isLetter,
  normalizeString,
  getIndicesOf,
  isNumber,
} = require("./stringUtils");

function findSoKieuA(value) {
  let temp = normalizeString(value);
  if (temp === "a") return "bonconbay";
  temp = temp.replaceAll("a", "");

  const numbers = [];
  for (let i = 0; i < temp.length; i++) {
    if (isNumber(temp[i])) numbers.push(Number.parseInt(temp[i]));
  }

  numbers.sort();

  let finalResult = "mbgbconthu";

  numbers.forEach((item) => {
    if (item === 1) {
      finalResult += `mot`;
    } else if (item === 2) {
      finalResult += `hai`;
    } else if (item === 3) {
      finalResult += `ba`;
    } else if (item === 4) {
      finalResult += `tu`;
    }
  });

  return ` ${finalResult}`;
}

function isValidBetween2Type(value) {
  if (value === "") return true;
  for (let i = 0; i < value.length; i++) {
    if (isLetter(value[i])) {
      return false;
    }
  }
  return true;
}

function nearestAOnTheLeftIsNumber(value, index) {
  let i = index - 1;
  while (i >= 0) {
    if (isLetter(value[i])) return false;
    if (isNumber(value[i])) return true;
    i--;
  }
  return false;
}

function nearestAOnTheRighIsNumber(value, index) {
  let i = index + 1;
  while (i < value.length) {
    if (isLetter(value[i])) return false;
    if (isNumber(value[i])) return true;
    i++;
  }
  return false;
}
function xuLyKieuA(message) {
  const messageLen = message.length;
  const arr = ["a"];

  /// Lấy ra các mẫu có thể là số kiểu A của đài MB
  const patterns = [];
  arr.forEach((item) => {
    for (let i = 1; i < 5; i++) {
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

  /// Lấy ra vị trí đầu và cuối của một chuỗi con có thể là số kiểu A
  const response = [];
  result.forEach((item) => {
    const value = item["item"];
    const indices = item["indices"];
    const valueLen = value.length;
    for (let i = 0; i < indices.length; i++) {
      const index = indices[i];
      let start = index;
      if (nearestAOnTheLeftIsNumber(message, start)) {
        let end = index - 1 + valueLen;
        while (
          end + 1 < messageLen &&
          !isLetter(message[end + 1]) &&
          message[end + 1] !== " "
        )
          end++;
        if (nearestAOnTheRighIsNumber(message, end)) {
          response.push({ start, end });
        }
      }
    }
  });

  response.sort(compare);

  let cur = 0;
  while (cur + 1 < response.length) {
    const curItem = response[cur];
    const nextItem = response[cur + 1];
    const curEnd = curItem["end"];
    const nextStart = nextItem["start"];
    if (curEnd <= nextStart) {
      const middleValue = message.substring(curEnd, nextStart);
      if (isValidBetween2Type(middleValue)) {
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
    const soHang = findSoKieuA(value);
    if (soHang !== "") {
      delta = soHang.length - value.length;
      message = message.replaceBetween(s + 1, e, soHang);
    }
  });

  return message;
}

module.exports = xuLyKieuA;
