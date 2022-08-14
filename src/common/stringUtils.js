const quyDinh = require("./config");

const TIEN_QUY_DINH = [
  ["nghin", "ngan", "ng", "n"],
  ["trieu", "tr", "t"],
];

String.prototype.replaceBetween = function (start, end, what) {
  return this.substring(0, start) + what + this.substring(end);
};

function compare(a, b) {
  if (a.end <= b.start) {
    return -1;
  }

  return 1;
}

function isInteger(value) {
  return /^\d+$/.test(value);
}

function isNumber(value) {
  return value >= "0" && value <= "9";
}

function isLetter(value) {
  return value.match(/[a-z]/i);
}

function containSpecialChar(char) {
  return ".,;:!@#$%^&+=_-".includes(char);
}

function removeAscent(str) {
  if (str === null || str === undefined) return str;
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "e");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "u");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "i");
  str = str.replace(/đ/g, "d");
  str = str.replace(/Đ/g, "d");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "y");
  return str.toLowerCase().trim();
}

function normalizeString(value) {
  let start = 0;
  while (start < value.length) {
    if (isNumber(value[start]) || isLetter(value[start])) break;
    start++;
  }

  let end = value.length - 1;
  while (end >= 0) {
    if (isNumber(value[end]) || isLetter(value[end])) break;
    end--;
  }
  let result = "";
  if (start <= end) {
    for (let i = start; i <= end; i++) {
      result += value[i];
    }
  }
  result = result.trim();
  return result === "" ? value : result;
}

function getIndicesOf(searchStr, str, caseSensitive) {
  var searchStrLen = searchStr.length;
  if (searchStrLen === 0) {
    return [];
  }
  var startIndex = 0,
    index,
    indices = [];
  if (!caseSensitive) {
    str = str.toLowerCase();
    searchStr = searchStr.toLowerCase();
  }
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
}

function normalizeMessage(value) {
  let dummyString = normalizeString(value);

  /// Replace multispace to single space
  dummyString = dummyString.replace(/\s+/g, " ");

  /// Convert all sign to unsign
  dummyString = removeAscent(dummyString);
  return dummyString;
}

function findAllValidDealer(value, daiCheckBox = quyDinh.env) {
  let dai = {};
  // if (daiCheckBox === "bac") {
  //   dai = quyDinh.dai.bac;
  // } else if (daiCheckBox === "trung") {
  //   dai = {
  //     ...quyDinh.dai.trung,
  //     ...quyDinh.dai.khac,
  //   };
  // } else if (daiCheckBox === "nam") {
  //   dai = {
  //     ...quyDinh.dai.nam,
  //     ...quyDinh.dai.khac,
  //   };
  // }

  dai = {
    ...quyDinh.dai.bac,
    ...quyDinh.dai.trung,
    ...quyDinh.dai.nam,
    ...quyDinh.dai.khac,
  };

  const tinh = Object.keys(dai);

  let response = [];
  let temp = "";
  for (let i = 0; i < value.length; i++) {
    temp += value[i];
    for (let j = 0; j < tinh.length; j++) {
      const arr = dai[tinh[j]];
      for (let k = 0; k < arr.length; k++) {
        if (temp.trim() === arr[k])
          response.push({
            result: temp,
            alias: tinh[j],
            index: value[i] === " " ? i + 1 : i,
          });
      }
    }
  }
  return response.length > 0 ? response : [{ result: "", alias: "", index: 0 }];
}

function findAllKieuHopLe(value) {
  const quyDinhKieu = quyDinh.kieu;
  const kieu = Object.keys(quyDinhKieu);

  let result = [];
  let temp = "";
  for (let i = 0; i < value.length; i++) {
    temp += value[i];
    for (let j = 0; j < kieu.length; j++) {
      const arr = quyDinhKieu[kieu[j]];
      for (let k = 0; k < arr.length; k++) {
        if (temp.trim().toLowerCase() === arr[k])
          result.push({
            result: temp,
            alias: kieu[j],
            index: value[i] === " " ? i + 1 : i,
          });
      }
    }
  }
  return result;
}

function findAllValidUnit(value) {
  let result = [];
  let temp = "";
  for (let i = 0; i < value.length; i++) {
    temp += value[i];
    for (let j = 0; j < TIEN_QUY_DINH.length; j++) {
      const arr = TIEN_QUY_DINH[j];
      for (let k = 0; k < arr.length; k++) {
        if (temp.trim().toLowerCase() === arr[k])
          result.push({
            result: temp,
            index: value[i] === " " || temp === value ? i + 1 : i,
          });
      }
    }
  }
  return result;
}

function findUnit(value) {
  let result = "";
  let index = 0;

  for (let i = 0; i < value.length; i++) {
    if (value[i] === " " || isNumber(value[i]) || !isValidUnit(value[i])) {
      index = i;
      break;
    }
    result += value[i];
    index = i;
  }

  if (isValidUnit(result)) {
    if (result === value) {
      index = value.length;
    } else if (index === 0) {
      index += 1;
    }
  } else {
    result = "nghin";
    index = 0;
    return { result, index };
  }

  const units = findAllValidUnit(value);
  if (units.length > 0) {
    const result2 = units[units.length - 1];
    if (result2["result"].length > result.length) {
      return result2;
    }
  }
  return { result, index };
}

function containKieu(value) {
  const kieuQuyDinh = quyDinh.kieu;
  const kieu = Object.keys(kieuQuyDinh);

  for (let i = 0; i < kieu.length; i++) {
    const arr = kieuQuyDinh[kieu[i]];
    for (let j = 0; j < arr.length; j++) {
      if (value === arr[j]) return true;
    }
  }
  return false;
}

function isValidUnit(value) {
  for (let i = 0; i < TIEN_QUY_DINH.length; i++) {
    const arr = TIEN_QUY_DINH[i];
    for (let j = 0; j < arr.length; j++) {
      if (arr[j] === value) return true;
    }
  }
  return false;
}

function isValidKieu(value) {
  const kieuQuyDinh = quyDinh.kieu;
  const kieu = Object.keys(kieuQuyDinh);

  for (let i = 0; i < kieu.length; i++) {
    const arr = kieuQuyDinh[kieu[i]];
    for (let j = 0; j < arr.length; j++) {
      if (value.trim().toLowerCase() === arr[j]) return true;
    }
  }
  return false;
}

function isValidDai(cur, daiCheckBox) {
  if (cur.trim() === "") return false;
  let dai = {};
  if (daiCheckBox === "bac") {
    dai = quyDinh.dai.bac;
  } else if (daiCheckBox === "trung") {
    dai = {
      ...quyDinh.dai.trung,
      ...quyDinh.dai.khac,
    };
  } else if (daiCheckBox === "nam") {
    dai = {
      ...quyDinh.dai.nam,
      ...quyDinh.dai.khac,
    };
  }

  const tinh = Object.keys(dai);

  for (let i = 0; i < tinh.length; i++) {
    const arr = dai[tinh[i]];
    for (let k = 0; k < arr.length; k++) {
      if (cur.trim() === arr[k]) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Retrieve a substring until a numeric character is detected
 * @param {String} value
 * @returns
 */
function substringUntilNumberDetected(value) {
  let result = "";
  let index = "";
  for (let i = 0; i < value.length; i++) {
    if (isNumber(value[i])) {
      index = i;
      break;
    }
    result += value[i];
    index = i + 1;
  }
  return { result, index };
}

/**
 * Retrieve a substring until a character from a-z is detected
 * @param {String} value
 * @returns
 */
function substringUntilAlphabetDetected(value) {
  let result = "";
  let index = "";
  for (let i = 0; i < value.length; i++) {
    if (isLetter(value[i])) {
      index = i;
      break;
    }
    if (value[i] == " ") {
      index = i + 1;
      break;
    }
    result += value[i];
    index = i + 1;
  }
  return { result, index };
}

function countDaiBefore(result, curIndex) {
  let count = 0;
  while (curIndex >= 0) {
    const so = result[curIndex]["so"];
    const kieuTien = result[curIndex]["kieuTien"];
    if (!(so === "" && kieuTien.length === 0)) return count;
    count++;
    curIndex--;
  }
  return count;
}

module.exports = {
  compare,
  isInteger,
  isNumber,
  isLetter,
  containSpecialChar,
  removeAscent,
  normalizeString,
  getIndicesOf,
  normalizeMessage,
  findAllValidDealer,
  findAllKieuHopLe,
  containKieu,
  isValidUnit,
  isValidKieu,
  isValidDai,
  findAllValidUnit,
  findUnit,
  substringUntilNumberDetected,
  substringUntilAlphabetDetected,
  countDaiBefore,
};
