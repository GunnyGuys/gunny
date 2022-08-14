const {
  compare,
  isLetter,
  normalizeString,
  getIndicesOf,
  isNumber,
} = require("./stringUtils");

function tinHopLe(message, start, end) {
  const messageLen = message.length;
  if (start >= 0 && end < messageLen) {
    const left = start - 1;
    const right = end + 1;
    if (
      left >= 0 &&
      right < messageLen &&
      message[left] === " " &&
      message[right] === " "
    ) {
      return true;
    } else if (start === 0 && right < messageLen && message[right] === " ") {
      return true;
    } else if (left >= 0 && right == messageLen - 1 && message[left] === " ") {
      return true;
    }
  } else {
    return false;
  }
}

function xuLyMultiMessage(message) {
  const patterns = [];
  for (let j = 100; j > 0; j--) {
    patterns.push(`tin ${j}`);
    patterns.push(`tin${j}`);
    patterns.push(`t ${j}`);
    patterns.push(`t${j}`);
  }

  /// Lấy ra vị trí của các mẫu ở trên
  const result = [];
  patterns.forEach((item) => {
    const indices = getIndicesOf(item, message);
    if (indices.length > 0) {
      result.push({ item, indices });
    }
  });

  /// Lấy ra vị trí đầu và cuối của một chuỗi con có thể là số dạng tin
  const response = [];
  result.forEach((item) => {
    const value = item["item"];
    const indices = item["indices"];
    const valueLen = value.length;
    for (let i = 0; i < indices.length; i++) {
      const index = indices[i];
      let start = index;
      let end = index - 1 + valueLen;
      ///
      if (tinHopLe(message, start, end)) {
        response.push(value);
      }
    }
  });

  for (let i = 0; i < response.length; i++) {
    message = message.replaceAll(response[i], "@#");
  }
  const temp = message.split("@#");
  const finalResult = [];
  for (let i = 0; i < temp.length; i++) {
    if (temp[i].trim() !== "") {
      finalResult.push(temp[i].trim());
    }
  }

  return finalResult;
}

module.exports = xuLyMultiMessage;
