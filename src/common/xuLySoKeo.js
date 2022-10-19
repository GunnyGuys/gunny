const {
  compare,
  isInteger,
  isLetter,
  containSpecialChar,
  normalizeString,
  getIndicesOf,
} = require("./stringUtils");

function findSoKeo(value) {
  const temp = normalizeString(value);
  const valueLen = temp.length;
  let left = "";
  let right = "";
  let i = 0;
  let j = valueLen - 1;
  while (i < valueLen && !isLetter(temp[i])) {
    left += temp[i];
    i++;
  }

  while (j >= 0 && !isLetter(temp[j])) {
    right = `${temp[j]}${right}`;
    j--;
  }

  if (left.trim().length !== right.trim().length) return "";

  if (isInteger(left.trim()) && isInteger(right.trim())) {
    const leftString = left.trim();
    const rightString = right.trim();
    const lN = Number.parseInt(leftString);
    const rN = Number.parseInt(rightString);
    if (lN >= rN) return "";
    let result = "";
    if (lN === 0 && rN === 99) {
      return " 00 11 22 33 44 55 66 77 88 99 ";
    }
    // Update for case: dc 076 đến 976 xc 5n 16/10/22
    if (leftString.length === rightString.length && rightString.length === 3) {
      if (
        leftString[0] !== rightString[0] &&
        leftString[1] === rightString[1] &&
        leftString[2] === rightString[2]
      ) {
        for (
          let i = Number.parseInt(leftString[0]);
          i <= Number.parseInt(rightString[0]);
          i++
        ) {
          result += ` ${i}${leftString[1]}${leftString[2]}`;
        }
      } else if (
        leftString[0] === rightString[0] &&
        leftString[1] !== rightString[1] &&
        leftString[2] === rightString[2]
      ) {
        for (
          let i = Number.parseInt(leftString[1]);
          i <= Number.parseInt(rightString[1]);
          i++
        ) {
          result += ` ${leftString[0]}${i}${leftString[2]}`;
        }
      } else if (
        leftString[0] === rightString[0] &&
        leftString[1] === rightString[1] &&
        leftString[2] !== rightString[2]
      ) {
        for (
          let i = Number.parseInt(leftString[2]);
          i <= Number.parseInt(rightString[2]);
          i++
        ) {
          result += ` ${leftString[0]}${leftString[1]}${i}`;
        }
      }
      return result + " ";
    }

    for (let i = lN; i <= rN; i++) {
      result += `${i} `;
    }
    return ` ${result}`;
  }
  return "";
}

function xuLySoKeo(message) {
  const messageLen = message.length;
  const arr = ["keo", "toi", "den", "k"];

  /// Lấy ra các mẫu có thể là số kéo
  const patterns = [];
  arr.forEach((item) => {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        patterns.push(`${i}${item}${j}`);
        patterns.push(`${i} ${item} ${j}`);
        patterns.push(`${i} ${item}${j}`);
        patterns.push(`${i}${item} ${j}`);
      }
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

  /// Lấy ra vị trí đầu và cuối của một chuỗi con có thể là số kéo
  const response = [];
  result.forEach((item) => {
    const value = item["item"];
    const indices = item["indices"];
    const valueLen = value.length;
    for (let i = 0; i < indices.length; i++) {
      const index = indices[i];
      let start = index;
      let end = index - 1 + valueLen;
      while (
        start - 1 >= 0 &&
        !isLetter(message[start - 1]) &&
        !containSpecialChar(message[start - 1])
      )
        start--;
      while (
        end + 1 < messageLen &&
        !isLetter(message[end + 1]) &&
        !containSpecialChar(message[end + 1])
      )
        end++;
      response.push({ start, end });
    }
  });

  response.sort(compare);
  let delta = 0;
  response.forEach((item) => {
    const s = item["start"] - 1 + delta;
    const e = item["end"] + 1 + delta;

    const value = message.substring(s + 1, e);
    const soKeo = findSoKeo(value);
    if (soKeo !== "") {
      delta = soKeo.length - value.length;
      message = message.replaceBetween(s + 1, e, soKeo);
    }
  });

  return message;
}

module.exports = xuLySoKeo;
