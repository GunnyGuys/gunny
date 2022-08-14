const RESULT = "result";
const INDEX = "index";
const VALUE = "value";
const KIEU = "kieu";
const TIEN = "tien";

/// Utils
function isNumber(value) {
  return value >= "0" && value <= "9";
}

function isLetter(value) {
  return value.match(/[a-z]/i);
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

const SAME_DAI_AND_KIEU = ["bl", "dt", "bd"]; // baclieu - baolo, dongthao - dathang, binhduong - baodao

/// Dai quy dinh
const DQD = [
  ["tp, tv, ag"],
  ["tp dt cm"],
  ["tp, cm", "tp,cm"],
  ["tp, bd", "tp bd"],
  ["tp, la"],
  ["daichinh", "dc"],
  ["thanhpho", "tp"],
  ["angiang", "ag"],
  ["dongthap", "dt"],
  ["daiphu", "dp"],
  ["2dai", "2d"],
  ["3dai", "3d"],
  ["4dai", "4d"],
  ["camau", "cm"],
  ["vinhlong", "vl"],
  ["travinh", "tv"],
  ["binhduong", "bd"],
  ["baclieu", "bl"],
  ["daithu3", "dai3"],
  ["mienbac", "mb"],
  ["hanoi", "hn", "HN"],
  ["can tho", "cantho", "ct"],
];

/// Kieu quy dinh
const KQD = [
  ["a1 a2 a3 a4", "a1, a2, a3, a4", "a1,2,3,4"],
  ["a1 a2 a3", "a1, a2, a3", "a1,2,3"],
  ["daodacbiet", "ddb"],
  ["xiuchu", "xc"],
  ["xo lien", "xolien", "xl"],
  ["dau", "d"],
  ["davong", "dv"],
  ["pao lo", "bao lo", "baolo", "paolo", "bl", "pl", "b"],
  ["dathang", "dt"],
  ["dauduoi", "dd"],
  ["daxieng", "daxien", "dx"],
  ["xiuduoi", "xduoi", "xdui"],
  ["duoi", "dui"],
  ["baodao", "bd"],
  ["dxdau xc"],
  ["dxdau"],
  ["dxduoi", "dxdui"],
  ["ab"],
  ["a1"],
  ["a2"],
  ["a3"],
  ["a3"],
  /// a_ a_
  [
    "a1 a2",
    "a1, a2",
    "a1,a2",
    "a1,2",
    "a1, 2",
    "a2 a1",
    "a2, a1",
    "a2,a1",
    "a2,1",
    "a2, 1",
  ],
  [
    "a1 a3",
    "a1, a3",
    "a1,a3",
    "a1,3",
    "a1, 3",
    "a3 a1",
    "a3, a1",
    "a3,a1",
    "a3,1",
    "a3, 1",
  ],
  [
    "a1 a4",
    "a1, a4",
    "a1,a4",
    "a1,4",
    "a1, 4",
    "a4 a1",
    "a4, a1",
    "a4,a1",
    "a4,1",
    "a4, 1",
  ],
  ///
  [
    "a2 a3",
    "a2, a3",
    "a2,a3",
    "a2,3",
    "a2, 3",
    "a3 a2",
    "a3, a2",
    "a3,a2",
    "a3,2",
    "a3, 2",
  ],
  [
    "a2 a4",
    "a2, a4",
    "a2,a4",
    "a2,4",
    "a2, 4",
    "a4 a2",
    "a4, a2",
    "a4,a2",
    "a4,2",
    "a4, 2",
  ],
  [
    "a3 a4",
    "a3, a4",
    "a3,a4",
    "a3,4",
    "a3, 4",
    "a4 a3",
    "a4, a3",
    "a4,a3",
    "a4,3",
    "a4, 3",
  ],
  ["a"],
];

/// So quy dinh
// "00 01 02 03 04 05 06 07 08 09 11 22 33 44 55 66 77 88 99 19 29 39 49 89 59 69 79 10 20 30 40 50 60 70 80 90 91 92 93 94 95 96 97 98":
const SQD = {
  "44 77": [
    "giaphe44",
    "giap he 44",
    "he 44",
    "he44",
    "h44",
    "giaphe 44",
    "giap he44",
  ],
  "56 65": [
    "giaphe56",
    "giap he 56",
    "he 56",
    "he56",
    "h56",
    "giaphe 56",
    "giap he56",
  ],
  "58 85": [
    "giaphe58",
    "giap he 58",
    "he 58",
    "he58",
    "h58",
    "giaphe 58",
    "giap he58",
  ],
  "77 49": ["20k49"],
  "76 49": ["00k99"],
  "75 49": ["990k999"],
  "40 45": ["40k45"],
  "90 99": ["90k99"],
};

/// Tien quy dinh
const TQD = [
  ["nghin", "ngan", "ng", "n"],
  ["trieu", "tr", "t"],
];

function isValidDai(value) {
  for (let i = 0; i < DQD.length; i++) {
    const arr = DQD[i];
    for (let j = 0; j < arr.length; j++) {
      if (value === arr[j]) return true;
    }
  }
  return false;
}

function isValidKieu(value) {
  for (let i = 0; i < KQD.length; i++) {
    const arr = KQD[i];
    for (let j = 0; j < arr.length; j++) {
      if (value.trim().toLowerCase() === arr[j]) return true;
    }
  }
  return false;
}

/// Get dai quy dinh tuong doi
function getDQD(raw) {
  for (let i = 0; i < DQD.length; i++) {
    const arr = DQD[i];
    for (let j = 0; j < arr.length; j++) {
      if (raw.includes(arr[j])) {
        return arr[j];
      }
    }
  }
  return "";
}

/// Get dai quy dinh tuyet doi
function tryGetDai(value) {
  let temp = "";
  for (let i = 0; i < value.length; i++) {
    temp += value[i];
    for (let j = 0; j < DQD.length; j++) {
      const arr = DQD[j];
      for (let k = 0; k < arr.length; k++) {
        if (temp.trim() === arr[k]) {
          return temp;
        }
      }
    }
  }
  return "";
}

function findAllValidDealer(value) {
  let response = [];
  let temp = "";
  for (let i = 0; i < value.length; i++) {
    temp += value[i];
    for (let j = 0; j < DQD.length; j++) {
      const arr = DQD[j];
      for (let k = 0; k < arr.length; k++) {
        if (temp.trim() === arr[k])
          response.push({ result: temp, index: value[i] == " " ? i + 1 : i });
      }
    }
  }
  return response.length > 0 ? response : [{ result: "", index: 0 }];
}

function containKQD(value) {
  for (let i = 0; i < KQD.length; i++) {
    const arr = KQD[i];
    for (let j = 0; j < arr.length; j++) {
      // if (arr[j].includes(value)) return true;
      if (value === arr[j]) return true;
    }
  }
  return false;
}

function isKTPattern(index, value, length) {
  let matchK = false;
  let matchN = false;
  if (0 < index && index < length - 1) {
    const pre = value[index - 1];
    const next = value[index + 1];
    matchK = containKQD(pre);
    if (!matchK) return matchK;
    matchN = isNumber(next);
  }
  return matchK & matchN;
}

function isOnlyOneNumber(value) {
  for (let i = 0; i < value.length; i++) {
    if (!isNumber(value[i]) && !isLetter(value[i])) return false;
  }
  return true;
}

function getDealerArray(value) {
  const compare = ".,;/-~!@-+=<>^$#@&*%";
  let result = "";
  for (let i = 0; i < value.length; i++) {
    if (compare.includes(value[i])) {
      result += " ";
    } else {
      result += value[i];
    }
  }
  return result.trim().replace(/\s+/g, " ").split(" ");
}

function getNumberArray(value) {
  let result = "";
  for (let i = 0; i < value.length; i++) {
    if (!isNumber(value[i]) && !isLetter(value[i])) {
      result += " ";
    } else {
      result += value[i];
    }
  }
  return result.trim().replace(/\s+/g, " ").split(" ");
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

function normalizeMessage(value) {
  let dummyString = normalizeString(value);

  /// Replace multispace to single space
  dummyString = dummyString.replace(/\s+/g, " ");

  /// Convert all sign to unsign
  dummyString = removeAscent(dummyString);

  /// Replace SoQuyDinh to specific number
  Object.keys(SQD).forEach((key) => {
    const arr = SQD[key];
    for (let i = 0; i < arr.length; i++) {
      dummyString = dummyString.replaceAll(arr[i], key);
    }
  });
  return dummyString;
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
 * Retrieve a substring until a alpha character is detected
 * @param {String} value
 * @param {String} alpha
 * @returns
 */
function substringUntilAlphaDetected(value, alpha) {
  let result = "";
  let index = "";
  for (let i = 0; i < value.length; i++) {
    if (value[i] === alpha) {
      index = i + 1;
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
function substringUntilCharDetected(value) {
  let result = "";
  let index = "";
  for (let i = 0; i < value.length; i++) {
    if (isLetter(value[i])) {
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
function algorithmZ(value) {
  let result = "";
  let index = "";
  for (let i = 0; i < value.length; i++) {
    if (isLetter(value[i]) || value[i] == " ") {
      index = i;
      break;
    }
    result += value[i];
    index = i + 1;
  }
  return { result, index };
}

function findNumber(value) {
  let result = "";
  let index = 0;
  for (let i = 0; i < value.length; i++) {
    if (isLetter(value[i])) {
      index = i;
      break;
    }
    result += value[i];
    index = i + 1;
  }
  result = result.replace(/\./g, " ");
  result = result.replace(/\,/g, " ");
  result = result.replace(/\;/g, " ");
  result = result.replace(/\-/g, " ");
  result = result.replace(/\//g, " ");
  result = result.replace(/\+/g, " ");
  result = result.replace(/\~/g, " ");
  result = result.replace(/\s+/g, " ").trim();
  return { result, index };
}

function isValidUnit(value) {
  for (let i = 0; i < TQD.length; i++) {
    const arr = TQD[i];
    for (let j = 0; j < arr.length; j++) {
      if (arr[j].includes(value)) return true;
    }
  }
  return false;
}

function isValidUnitV2(value) {
  for (let i = 0; i < TQD.length; i++) {
    const arr = TQD[i];
    for (let j = 0; j < arr.length; j++) {
      if (arr[j] === value) return true;
    }
  }
  return false;
}

function findUnit(value) {
  let result = "";
  let index = 0;
  for (let i = 0; i < value.length; i++) {
    if (value[i] === " ") {
      index = i;
      if (result === "") result = "nghin";
      break;
    }
    if (isNumber(value[i])) {
      index = i;
      break;
    }
    result += value[i];
    index = i;
  }
  index = index === 0 ? index + 1 : index;
  return { result, index };
}

function findUnitV2(value) {
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
  if (isValidUnitV2(result)) {
    // index = index === 0 ? index + 1 : index;
    // New login
    if (result === value) {
      index = value.length;
    } else if (index === 0) {
      index += 1;
    }
    return { result, index };
  } else {
    result = "nghin";
    index = 0;
    return { result, index };
  }
}

/**
 * Find kieuTienDonvi without dai and number
 * Format: b 2.5n d25n d6n 35 44dt5n
 * @param {*} value
 * @returns
 */
function findKieuTien(value) {
  let result = [];

  let kieu = substringUntilNumberDetected(value);
  let temp = kieu[RESULT].trim();
  while (temp !== "") {
    const afterKieu = value.substring(kieu[INDEX]).trim();

    let tien = algorithmZ(afterKieu);
    const afterTien = afterKieu.substring(tien[INDEX]).trim();
    const donvi = findUnitV2(afterTien);

    result.push([kieu[RESULT], `${tien[RESULT]}${donvi[RESULT]}`]);

    const len =
      Number.parseInt(kieu[INDEX]) +
      Number.parseInt(tien[INDEX]) +
      Number.parseInt(donvi[INDEX]);

    value = value.substring(len).trim();
    if (afterTien === "") return { result, value };
    kieu = substringUntilNumberDetected(value);
    temp = kieu[RESULT].trim();
  }

  return { result, value };
}

function findKieuTienV2(value) {
  let result = [];

  let kieu = substringUntilNumberDetected(value);
  let temp = kieu[RESULT].trim();
  while (temp !== "" && containKQD(temp)) {
    const afterKieu = value.substring(kieu[INDEX]).trim();

    let tien = algorithmZ(afterKieu);
    const afterTien = afterKieu.substring(tien[INDEX]).trim();
    const donvi = findUnitV2(afterTien);

    result.push([kieu[RESULT], `${tien[RESULT]}${donvi[RESULT]}`]);

    const len =
      Number.parseInt(kieu[INDEX]) +
      Number.parseInt(tien[INDEX]) +
      Number.parseInt(donvi[INDEX]);

    value = value.substring(len).trim();
    if (afterTien === "") return { result, value };
    kieu = substringUntilNumberDetected(value);
    temp = kieu[RESULT].trim();
  }

  return { result, value };
}

function findAllKieuHopLe(value) {
  let result = [];
  let temp = "";
  for (let i = 0; i < value.length; i++) {
    temp += value[i];
    for (let j = 0; j < KQD.length; j++) {
      const arr = KQD[j];
      for (let k = 0; k < arr.length; k++) {
        if (temp.trim().toLowerCase() === arr[k])
          result.push({ result: temp, index: value[i] == " " ? i + 1 : i });
      }
    }
  }
  return result;
}

function findKieuTienV3(value) {
  let result = [];

  let kieu = substringUntilNumberDetected(value);
  const allKieuHopLe = findAllKieuHopLe(value);
  let kieu2 = { result: "", index: 0 };
  if (allKieuHopLe.length > 0) {
    kieu2 = allKieuHopLe[allKieuHopLe.length - 1];
  }

  if (
    kieu[RESULT] !== "" &&
    kieu2[RESULT] !== "" &&
    kieu2[RESULT].length > kieu[RESULT].length &&
    isValidKieu(kieu2[RESULT])
  ) {
    kieu = kieu2;
  }

  let temp = kieu[RESULT].trim();
  while (temp !== "" && containKQD(temp)) {
    const afterKieu = value.substring(kieu[INDEX]).trim();

    let tien = algorithmZ(afterKieu);
    const afterTien = afterKieu.substring(tien[INDEX]).trim();
    const donvi = findUnitV2(afterTien);

    result.push([kieu[RESULT], `${tien[RESULT]}${donvi[RESULT]}`]);

    const len =
      Number.parseInt(kieu[INDEX]) +
      Number.parseInt(tien[INDEX]) +
      Number.parseInt(donvi[INDEX]);

    // value = value.substring(len).trim();
    value = normalizeString(value.substring(len));
    if (afterTien === "") return { result, value };

    // Add new 04/07
    // let dealers = findAllValidDealer(value);

    kieu = substringUntilNumberDetected(value);
    const allKieuHopLe = findAllKieuHopLe(value);
    let kieu2 = { result: "", index: 0 };
    if (allKieuHopLe.length > 0) {
      kieu2 = allKieuHopLe[allKieuHopLe.length - 1];
    }

    if (
      kieu[RESULT] !== "" &&
      kieu2[RESULT] !== "" &&
      kieu2[RESULT].length > kieu[RESULT].length &&
      isValidKieu(kieu2[RESULT])
    ) {
      kieu = kieu2;
    }

    temp = kieu[RESULT].trim();
  }

  return { result, value };
}

function isConflictDaiAndKieu(value) {
  for (let i = 0; i < SAME_DAI_AND_KIEU.length; i++) {
    if (SAME_DAI_AND_KIEU[i] === value) return true;
  }
  return false;
}

function checkArrKieuTien(value) {
  let i = 1;
  while (i < value.length) {
    const item1 = value[i][KIEU].trim();
    const item2 = value[i - 1][KIEU].trim();
    if (item1 === item2 && isConflictDaiAndKieu(item1)) {
      return i - 2;
    }
    i++;
  }
  return -2;
}

function countKieuD(value) {
  if (value.length === 0) return 0;
  let count = 0;
  for (let i = 0; i < value.length; i++) {
    const item = value[i][KIEU].trim();
    if (item === "d") count++;
  }
  return count;
}

function findKieuTienV4(value) {
  let result = [];
  let redunt = [];

  let kieu = substringUntilNumberDetected(value);
  const allKieuHopLe = findAllKieuHopLe(value);
  let kieu2 = { result: "", index: 0 };
  if (allKieuHopLe.length > 0) {
    kieu2 = allKieuHopLe[allKieuHopLe.length - 1];
  }

  if (
    kieu[RESULT] !== "" &&
    kieu2[RESULT] !== "" &&
    kieu2[RESULT].length > kieu[RESULT].length &&
    isValidKieu(kieu2[RESULT])
  ) {
    kieu = kieu2;
  }

  let temp = kieu[RESULT].trim();
  while (temp !== "" && containKQD(temp)) {
    const afterKieu = value.substring(kieu[INDEX]).trim();

    let tien = algorithmZ(afterKieu);
    const afterTien = afterKieu.substring(tien[INDEX]).trim();
    const donvi = findUnitV2(afterTien);

    const len =
      Number.parseInt(kieu[INDEX]) +
      Number.parseInt(tien[INDEX]) +
      Number.parseInt(donvi[INDEX]);

    // value = value.substring(len).trim();
    value = normalizeString(value.substring(len));

    result.push({
      kieu: kieu[RESULT],
      tien: tien[RESULT],
      x: donvi[RESULT],
    });

    redunt.push(value);
    const lastInd = checkArrKieuTien(result);
    if (lastInd !== -2) {
      value = redunt[lastInd];
      result = result.slice(0, lastInd + 1);
      return { result, value };
    }
    if (afterTien === "") return { result, value };

    // Add new 04/07
    // let dealers = findAllValidDealer(value);

    kieu = substringUntilNumberDetected(value);
    const allKieuHopLe = findAllKieuHopLe(value);
    let kieu2 = { result: "", index: 0 };
    if (allKieuHopLe.length > 0) {
      kieu2 = allKieuHopLe[allKieuHopLe.length - 1];
    }

    if (
      kieu[RESULT] !== "" &&
      kieu2[RESULT] !== "" &&
      kieu2[RESULT].length > kieu[RESULT].length &&
      isValidKieu(kieu2[RESULT])
    ) {
      kieu = kieu2;
    }

    temp = kieu[RESULT].trim();
  }

  return { result, value };
}

// Đã xử lý được chuỗi có dạng:
// + Dai So KieuTien/Kieu Tien/Kieu Tien - So KieuTien (t1)
// + Dai So KieuTien - So KieuTien (t2)
// + Dai So KieuTien (t6, t9)
// + Dai So KieuTien - So KieuTien - So KieuTien (t5, t8)
// + Dai So KieuTien, Dai So KieuTien (t3, t4x)
// + Dai So KieuTien/Kieu Tien, Dai So KieuTien (t7)
function handleDSKT2(value) {
  const finalResult = [];

  let daiQuyDinh = tryGetDai(value);
  const daiQuyDinh2 = getDQD(value);

  if (
    daiQuyDinh !== "" &&
    daiQuyDinh2 !== "" &&
    daiQuyDinh2.length > daiQuyDinh.length &&
    isValidDai(daiQuyDinh2)
  ) {
    daiQuyDinh = daiQuyDinh2;
  }

  let stringAfterDai = value.substring(daiQuyDinh.length).trim();

  while (stringAfterDai !== "") {
    const nMap = findNumber(stringAfterDai);
    const kieuTien = findKieuTienV3(
      stringAfterDai.substring(nMap[INDEX]).trim()
    );

    const response = {
      dai: daiQuyDinh,
      so: nMap[RESULT],
      kieuTien: kieuTien[RESULT],
    };

    finalResult.push(response);

    let nextDai = tryGetDai(kieuTien[VALUE]);
    const nextDai2 = getDQD(value);
    if (
      nextDai !== "" &&
      nextDai2 !== "" &&
      nextDai2.length > nextDai.length &&
      isValidDai(nextDai2)
    ) {
      nextDai = nextDai2;
    }

    if (nextDai !== "") {
      return finalResult.concat(handleDSKT2(kieuTien[VALUE]));
    }
    stringAfterDai = kieuTien[VALUE];
  }
  return finalResult;
}

function handleDSKT3(value) {
  const result = [];

  let dealers = findAllValidDealer(value);
  let dealer = dealers[dealers.length - 1];

  let stringAfterDealer = value.substring(dealer[RESULT].length);

  while (stringAfterDealer !== "") {
    const nMap = findNumber(stringAfterDealer);
    const kieuTien = findKieuTienV4(
      stringAfterDealer.substring(nMap[INDEX]).trim()
    );

    const response = {
      dai: dealer[RESULT],
      so: nMap[RESULT],
      kieuTien: kieuTien[RESULT],
    };

    result.push(response);

    dealers = findAllValidDealer(kieuTien[VALUE]);
    if (dealers.length > 0) {
      const d = dealers[dealers.length - 1];
      if (d[RESULT] !== "") {
        return result.concat(handleDSKT3(kieuTien[VALUE]));
      }
    }

    stringAfterDealer = kieuTien[VALUE];
  }
  return result;
}

function handleDetailMessage(value) {
  const result = [];
  for (let i = 0; i < value.length; i++) {
    const message = value[i];
    const dai = message["dai"];
    const so = message["so"];
    const dealers = getDealerArray(dai);
    const numbers = getNumberArray(so);
    const kieuTien = message["kieuTien"];
    let adjustKieuTien = [];
    let countD = 0;
    for (let j = 0; j < kieuTien.length; j++) {
      const ktItem = kieuTien[j];
      let kieu = ktItem[KIEU];
      const tien = ktItem[TIEN];
      if (kieu.trim() === "d") {
        countD++;
        if (countD > 1) {
          kieu = "duoi";
        } else if (numbers.length === 1) {
          kieu = "dau";
        } else if (numbers.length === 2) {
          kieu = "dathang";
        }
      } else if (kieu.trim() === "dt") {
        kieu = "dathang";
      } else if (kieu.trim() === "b" && numbers.length === 1) {
        kieu = "baolo";
      } else if (kieu.trim() === "dx" && so.trim().length === 3) {
        kieu = "daoxiudauduoi";
      } else if (kieu.trim() === "dx" && numbers.length === 2) {
        kieu = "daxien";
      } else if (kieu.trim() === "dd" && numbers.length === 1) {
        kieu = "dauduoi";
      } else if (kieu.trim() === "bd" && so.trim().length === 3) {
        kieu = "baodao";
      }

      adjustKieuTien.push({
        kieu,
        tien,
        x: ktItem["x"],
      });
    }
    const response = {
      dai: dai,
      so: so,
      kieuTien: adjustKieuTien,
    };

    result.push(response);
  }
  return result;
}

function findSubMessage(value) {
  const tin = [];
  for (let j = 50; j >= 1; j--) {
    tin.push(`tin ${j} `);
    tin.push(`tin${j} `);
    tin.push(`t${j} `);
  }
  let message = value;
  for (let i = 0; i < tin.length; i++) {
    message = message.replaceAll(tin[i], "@#");
  }
  const temp = message.split("@#");
  const result = [];
  for (let i = 0; i < temp.length; i++) {
    if (temp[i].trim() !== "") {
      result.push(temp[i].trim());
    }
  }
  return result;
}

// Dai So KieuTien - So KieuTien
const t0 = "Tp 136d150d250"; // pass

// Dai So KieuTien/KieuTien/KieuTien - So KieuTien
const t1 = "Dc 90 b 2.5n d25n d6n 35 44dt5n"; // pass

// Dai So KieuTien - So KieuTien
const t2 = "dc100b10n326b10"; // pass

// Dai So KieuTien, Dai So KieuTien
const t3 = "dp hệ 44  pao lô 10n 2d 11 12dt 0.5n"; // pass

// Dai So KieuTien, Dai So KieuTien
const t3x = "dp 77 pao lô 10n 2d 11 12dt 0.5n"; // pass

// Dai So KieuTien, Dai So KieuTien, Dai So KieuTien
const t4 = "dc 123dx10n, 2d 18 19dx10. 4d 32b2.5n"; // pass

// Dai So KieuTien, Dai So KieuTien, Dai So KieuTien
const t4x = "dc 123dx10n 2d 18 19dx10. 4d 32b2.5n"; // pass

// Dai So KieuTien - So KieuTien - So KieuTien - So KieuTien
const t5 = "Vl 15dd200. 30.19.12 a200. 69dd300. 08dd250"; // pass (need handle at a200.)

// Dai So KieuTien
const t6 = "tp dt cm 45b10"; // pass

// Dai So KieuTien/Kieu Tien, Dai So KieuTien
const t7 = "Dc 03 d15n d10n dp 03 04d10n"; // pass

// Dai So KieuTien - So KieuTien - So KieuTien
const t8 = "Vl 18.11a400. 69dd250. 15 a300."; // pass

// Dai So KieuTien
const t9 = "vl..08..dd1100n"; // pass

// Dai So KieuTien So KieuTien So KieuTien
const t10 = "Dc 10 18 30 32 dau100n 11 19 dau200n 52 dau300n"; // pass

// Dai So KieuTien So KieuTien
const t11 = "vl 245-xdui50 52-a200"; // pass (need handle a200)

// Dai So KieuTien
const t12 = "Tv 20k49.83.02 dui 1000"; // pass

const t13 =
  "dp 90 10d5n 2d 90 10dx5n 990dx10n, bl 32bl10n, bd 324bd10n, 00k99dui100. Dt cm 990k999bao lô 10n 330 dxdau xc 50n"; // fail

// Dai So KieuTien, Dai So KieuTien
const t14 = "dc hệ44dd10n 2d 11 12dt 0.5n"; // pass

// Dai So KieuTien, Dai So KieuTien, Dai So KieuTien
const t15 = "dp giáp hệ 44bl0.5n 2d hệ56dui0.5n dai3 h58dd0.5n"; // pass

// Dai So KieuTien
const t16 = "tp, tv, ag h44dd0.2"; // pass

// Dai So KieuTien/KieuTien
const t17 = "tp 10.20d5nd10n"; // pass

// Dai So KieuTien - So KieuTien
const t18 = "tp 13ab10 123ab10"; // pass

// Dai So KieuTien
const t19 = "Dc 10;11d5ng"; // pass

// Dai So KieuTien
const t20 = "2d 12;99d10n"; // pass

// Dai So KieuTien
const t21 = "3d 17;49d0,2n"; // pass

// Dai So KieuTien
const t22 = "Tp,cm 47,06d10"; // pass

// Dai So KieuTien/Kieu Tien
const t23 = "Tp,cm 55,39d10d5"; // pass

// Dai So KieuTien
const t24 = "Dc 40k45d0.5n"; // pass

// Dai So KieuTien
const t25 = "2dai 90k99d0.2"; // pass

// Dai So KieuTien
const t26 = "Dt 85,27xdui10n"; // pass

// Dai So KieuTien
const t27 = "Dc 234dxdau10n"; // pass

// Dai So KieuTien - So KieuTien
const t28 = "Tp 25dd10n 123dxdui0,5"; // pass

// Dai So KieuTien - So KieuTien
const t29 = "Tp 190d35 448d10"; // pass

// Dai So KieuTien - So KieuTien/KieuTien
const t30 = "Tp bd 99,25d10n 17d4,5nd10n"; // pass

// Dai So KieuTien - So KieuTien
const t31 = "Tp 14dx10n, 88xc5n"; // pass

// Dai So KieuTien
const t32 = "Tp6789ddb0.5"; // pass

// Dai So KieuTien
const t33 = "MB 778 xổ liền 10"; // pass

// Dai So KieuTien
const t34 = "HN12A1 10n"; // pass

// Dai So KieuTien
const t35 = "MB 45A1,2,3,4 10n"; // pass

// Dai So KieuTien
const t36 = "MB 45 a1 a2 a3 a4 10n"; // pass

// Dai So KieuTien - So KieuTien - So KieuTien
const t37 = "Cần thơ 234dd5n 44.45d4ng 15.16.17d10n"; // pass

// Dai So KieuTien - So KieuTien - So KieuTien
const t38 = "dp 12;24;36baolo10n 2d 150d12t"; // pass

// Dai So KieuTien - So KieuTien, Dai So KieuTien/KieuTien
const t39 = "Tp 136d150d250 2d 77.79.73.đv3n.đđ10n"; // pass

// Dai So KieuTien/KieuTien
const t40 = "Tp 15,16,17d0.5ndd10n"; // pass

const multiMessage = `t1 dc 123dx10n, 2d 18 19dx10. 4d 32b2.5n
t2 Vl 15dd200. 30.19.12 a200. 69dd300. 08dd250
`;

const msg = `bl11bl10, 12bl10, bl 12bl10, bl12bl10`;
const msg2 = `bd 1234bd10, bd 123bd10 321bd10 345bd10`;
const msg3 = `dt 12 13dt10, dt 34 35dt10 67 68dt10`;

/**
 * For multi message
 */
try {
  const message = normalizeMessage(t13);
  const arrMessage = findSubMessage(message);
  for (let i = 0; i < arrMessage.length; i++) {
    console.log(`TIN ${i + 1}: ${arrMessage[i]}\n`);
    const result = handleDSKT3(arrMessage[i]);
    console.log(JSON.stringify(result));
    console.log("\n");
  }
} catch (error) {
  console.log(error);
}
