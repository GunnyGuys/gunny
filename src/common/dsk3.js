const quyDinh = require("./config");

const {
  isNumber,
  isLetter,
  normalizeString,
  normalizeMessage,
  findAllValidDealer,
  findAllKieuHopLe,
  containKieu,
  isValidKieu,
  isValidDai,
  findUnit,
  substringUntilNumberDetected,
  substringUntilAlphabetDetected,
  countDaiBefore,
} = require("./stringUtils");

const xuLySoKeo = require("./xuLySoKeo");
const xuLyHang = require("./xuLyHang");
const xuLyDonVi = require("./xuLyDonVi");
const xuLySoCapSoChuc = require("./xuLySoCapChuc");
const xuLyBaoLo7 = require("./xuLyBaoLo7");
const xuLySo = require("./xuLySo");
const xuLyMultiMessage = require("./xuLyMultiMessage");

const xuLyKieuA = require("./xuLyKieuA");
const updateType = require("./getExplicitType");
const { tinhTien, tinhLoLai } = require("./tinhTienDSK2");

const ALIAS = "alias";
const RESULT = "result";
const INDEX = "index";
const VALUE = "value";
const KIEU = "kieu";
const TIEN = "tien";

const SAME_DAI_AND_KIEU = ["bl", "dt", "bd"]; // baclieu - baolo, dongthao - dathang, binhduong - baodao

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
      return i > 1 ? i - 2 : i - 1;
    }
    i++;
  }
  return -2;
}

function findKieuTien(value) {
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
  while (temp !== "" && containKieu(normalizeString(temp))) {
    const afterKieu = value.substring(kieu[INDEX]).trim();

    let tien = substringUntilAlphabetDetected(afterKieu);
    const afterTien = afterKieu.substring(tien[INDEX]).trim();
    const donvi = findUnit(afterTien);

    const len =
      Number.parseInt(kieu[INDEX]) +
      Number.parseInt(tien[INDEX]) +
      Number.parseInt(donvi[INDEX]);

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

function handleDSKT(value) {
  const result = [];

  let dealers = findAllValidDealer(value);
  let dealer = dealers[dealers.length - 1];

  if (!isValidDai(dealer[RESULT], quyDinh.env)) {
    return [`INVALID_DAI@${dealer[RESULT]}`];
  }

  let stringAfterDealer = value.substring(dealer[RESULT].length);

  while (stringAfterDealer !== "") {
    const nMap = findNumber(stringAfterDealer);

    /// Update for t30 - 17/07/2022
    if (nMap[RESULT] === "") {
      result.push({
        dai: dealer[ALIAS],
        so: "",
        kieuTien: [],
      });
      return result.concat(handleDSKT(normalizeString(stringAfterDealer)));
    }

    const kieuTien = findKieuTien(
      stringAfterDealer.substring(nMap[INDEX]).trim()
    );

    const response = {
      dai: dealer[ALIAS],
      so: nMap[RESULT],
      kieuTien: kieuTien[RESULT],
    };

    result.push(response);

    dealers = findAllValidDealer(kieuTien[VALUE]);
    if (dealers.length > 0) {
      const d = dealers[dealers.length - 1];

      if (d[RESULT] !== "" && !isValidDai(dealer[RESULT], quyDinh.env)) {
        return ["INVALID_DAI", dealer[RESULT]];
      } else if (d[RESULT] !== "") {
        return result.concat(handleDSKT(kieuTien[VALUE]));
      }
    }

    stringAfterDealer = kieuTien[VALUE];
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
const t1 = `Tin1 dc100b10n326b10
Tin 2 dp hệ 44  pao lô 10n 2d 11 12dt 0.5n`; // pass

// Dai So KieuTien, Dai So KieuTien
const t2 = `t1 dc 123dx10n, 2d 18 19dx10. 4d 32b2.5n
t2 Vl 15dd200. 30.19.12 a200. 69dd300. 08dd250`; // pass

// Dai So KieuTien
const t3 = `T1  tp dt cm 45b10
Tin 2 Dc 03 d15n d10n dp 03 04d10n`; // pass

// Dai So KieuTien - So KieuTien - So KieuTien
const t4 = "Vl 18.11a400. 69dd250. 15 a300."; // pass

// Dai So KieuTien
const t5 = "vl..08..dd1100n"; // pass

// Dai So KieuTien So KieuTien So KieuTien
const t6 = "Dc 10 18 30 32 dau100n 11 19 dau200n 52 dau300n"; // pass

// Dai So KieuTien So KieuTien
const t7 = `vl 245-xdui50
52-a200`; // pass (need handle a200)

// Dai So KieuTien
const t8 = "Tv 20k49.83.02 dui 1000"; // pass

const t9 =
  "dp 90 10d5n 2d 90 10dx5n 990dx10n, bl 32bl10n, bd 324bd10n, 00k99dui100. Dt cm 990k999bao lô 10n 330 dxdau xc 50n"; // fail

// Dai So KieuTien, Dai So KieuTien
const t10 = `Tin 1 dc hệ44dd10n 2d 11 12dt 0.5n
Tin 2 dp giáp hệ 44bl0.5n 2d hệ56dui0.5n dai3 h58dd0.5n
Tin 3 tp, tv, ag h44dd0.2`; // pass

// Dai So KieuTien/KieuTien
const t11 = `tp 10.20d5nd10n
tp 13ab10 123ab10`; // pass

// Dai So KieuTien
const t12 = "Dc 10;11d5ng"; // pass

// Dai So KieuTien
const t13 = "2d 12;99d10n"; // pass

// Dai So KieuTien
const t14 = "3d 17;49d0,2n"; // pass

// Dai So KieuTien
const t15 = "Tp,cm 47,06d10"; // pass

// Dai So KieuTien/Kieu Tien
const t16 = "Tp,cm 55,39d10d5"; // pass

// Dai So KieuTien
const t17 = "Dc 40k45d0.5n"; // pass

// Dai So KieuTien
const t18 = "2dai 90k99d0.2"; // pass

// Dai So KieuTien
const t19 = "Dt 85,27xdui10n"; // pass

// Dai So KieuTien
const t20 = "Dc 234dxdau10n"; // pass

// Dai So KieuTien - So KieuTien
const t21 = "Tp 25dd10n 123dxdui0,5"; // pass

// Dai So KieuTien - So KieuTien
const t22 = "Tp 190d35 448d10"; // pass

// Dai So KieuTien - So KieuTien/KieuTien
const t23 = "Tp bd 99,25d10n 17d4,5nd10n"; // pass

// Dai So KieuTien - So KieuTien
const t24 = "Tp 14dx10n, 88xc5n"; // pass

// Dai So KieuTien
const t25 = "Tp6789ddb0.5"; // pass

// Dai So KieuTien
const t26 = `Mb 778 xl 10
MB 778 xổ liền 10`; // pass

// Dai So KieuTien
const t27 = "HN12A1 10n"; // pass

// Dai So KieuTien
const t28 = "MB 45A1,2,3,4 10n"; // pass

// Dai So KieuTien
const t29 = "MB 45 a1 a2 a3 a4 10n"; // pass

// Dai So KieuTien - So KieuTien - So KieuTien
const t30 = "Cần thơ 234dd5n 44.45d4ng 15.16.17d10n"; // pass

// Dai So KieuTien - So KieuTien - So KieuTien
const t31 = `T1 dp 12;24;36baolo10n 2d 150d12t
T2 Tp 136d150d250 2d 77.79.73.đv3n.đđ10n`; // pass

// Dai So KieuTien/KieuTien
const t32 = "Tp 15,16,17d0.5ndd10n"; // pass

const t33 = `la;ct;tp	15,16d10n
dp 20-21-25dd10
mb 40k49a1,2,3,4 10n
ag,vl.10.bl.10n
tv tp giap-he44 dd 10n
tv tp 10/20/30dx0.5
qt10k30bao7lo 10n
HN 16/36/40 xổ liền 10 ngàn
`;

const t34 = `bl11bl10, 12bl10, bl 12bl10, bl12bl10`;

const t35 = `bd 1234bd10, bd 123bd10 321bd10 345bd10`;

const t36 = `dt 12 13dt10, dt 34 35dt10 67 68dt10`;

const t37 = "dc 12,123 baolo 10";

/// Priority
/// normalize message
/// xuLySoKeo
/// xuLyHang
/// xuLyDonVi
/// xuLyGiapHe
/// xuLySoCapChuc
/// normalize message

function handleMessage(message) {
  message = xuLySoKeo(message);
  ///
  message = xuLyHang(message);
  message = xuLyDonVi(message);
  message = xuLyBaoLo7(message);
  message = xuLySoCapSoChuc(message);
  message = xuLySo(message);
  ///
  message = normalizeMessage(message);
  const result = handleDSKT(message);
  return result;
}

function parseMessage(message) {
  const output = [];
  try {
    console.log(`ORIGINAL MESSAGE: ${message}\n`);
    message = normalizeMessage(message);
    const multiMessage = xuLyMultiMessage(message);
    for (let i = 0; i < multiMessage.length; i++) {
      let item = multiMessage[i];
      console.log(`Tin ${i + 1}: ${item}\n`);
      const result = handleMessage(item);
      clearKieu(result);
      boCapVaChuc(result);
      //
      updateType(result);
      output.push(result);
      console.log(JSON.stringify(result));
      console.log("\n\n");
      return output;
    }
  } catch (err) {
    console.log(err);
    return err;
  }
}

function timTongDai(item, curIndex) {
  const rp = [];
  rp.push(item[curIndex]["dai"]);
  curIndex--;
  while (curIndex >= 0) {
    const dai = item[curIndex]["dai"];
    const so = item[curIndex]["so"];
    const kieuTien = item[curIndex]["kieuTien"];
    if (!(so === "" && kieuTien.length === 0)) return rp;
    rp.unshift(dai);
    curIndex--;
  }
  return rp;
}

function getDonVi(value) {
  if (["nghin", "ngan", "ng", "n"].includes(value)) {
    return 1000;
  } else {
    return 1000000;
  }
}

function findListMessageModel(messages) {
  const messageList = [];
  for (let i = 0; i < messages.length; i++) {
    // Tin thứ i
    const message = messages[i];
    for (let j = 0; j < message.length; j++) {
      var item = message[j];
      const so = item["so"];
      const kieuTien = item["kieuTien"];
      if (so !== "" && kieuTien.length > 0) {
        //
        for (let k = 0; k < kieuTien.length; k++) {
          const kt = kieuTien[k];
          var m = {};
          m["tin"] = `Tin${i + 1}`;
          m["dai"] = timTongDai(message, j);
          m["so"] = so;
          m["kieu"] = kt["kieu"];
          m["tien"] = Number.parseFloat(kt["tien"]);
          m["donVi"] = getDonVi(kt["x"]);
          messageList.push(m);
        }
      }
    }
  }
  return messageList;
}

function isChuc(number) {
  return number[number.length - 1] === "0";
}

function isCap(number) {
  if (number.length < 2) return false;
  let i = 0;
  while (i < number.length - 1) {
    if (number[i] !== number[i + 1]) return false;
    i++;
  }
  return true;
}

function boCapVaChuc(result) {
  for (let i = 0; i < result.length; i++) {
    const obj = result[i];
    const numbers = getNumberArray(obj["so"]);
    const isBoChuc = numbers.includes("1111110");
    const isBoCap = numbers.includes("1111111");
    const temp = [];
    numbers.forEach((item) => {
      if (
        !(isBoCap && isCap(item)) &&
        !(isBoChuc && isChuc(item)) &&
        item !== "1111110" &&
        item !== "1111111"
      ) {
        temp.push(item);
      }
    });
    obj["so"] = temp.join(" ");
  }
}

function countCharInKieuTien(kieuTien, char) {
  let count = 0;
  for (let i = 0; i < kieuTien.length; i++) {
    const kt = kieuTien[i];
    const kieu = kt[KIEU];
    if (kieu.trim() === char) count++;
  }
  return count;
}

function clearKieu(result) {
  for (let i = 0; i < result.length; i++) {
    const message = result[i];
    const so = message["so"];
    const kieuTien = message["kieuTien"];
    const numbers = getNumberArray(so);
    let count = countCharInKieuTien(kieuTien, "d");
    for (let j = 0; j < kieuTien.length; j++) {
      const kieu = kieuTien[j][KIEU].trim();
      const dai = message["dai"];
      /// Update: add condition kieu === "d" 9/10/2022 for case: dc 311 565 833 789 bao 1n d 2n
      if (count == 1 && kieu === "d") {
        const numLen = numbers.length;
        const slDai = countDaiBefore(result, i);
        const isNhieuDai = slDai > 1 || dai === "2 dai" || dai === "3 dai";
        /// 1 đài + 2 số => đá thẳng
        /// Nhiều đài + 2 số => đá xiêng
        /// 1 đài + > 2 số => đá vòng
        /// Nhiều đài + > 2 số => đá vòng
        if (isNhieuDai) {
          if (numLen === 2) {
            kieuTien[j][KIEU] = "da xieng";
          } else if (numLen > 2) {
            kieuTien[j][KIEU] = "da vong";
          }
        } else {
          if (numLen === 2) {
            kieuTien[j][KIEU] = "da thang";
          } else if (numLen > 2) {
            kieuTien[j][KIEU] = "da vong";
          }
        }
      } else if (count > 1) {
        if (j == 0 && kieu === "d") {
          kieuTien[j][KIEU] = "dau";
        } else if (kieu === "d") {
          kieuTien[j][KIEU] = "duoi";
        }
      }
    }
  }
}

// Ví dụ 1: Dc 14, 15dau10ng
// Ví dụ 2: 2dai 14,15dau10ng
// Ví dụ 3: 3dai 14,15dau 10ng
// Vi dụ 4: 3dai 14,15,16dau10ng

// dc 311 565 833 bao 1n d 1n
// 2d 12.13 đt 1n
// dc 070 đến 079 xc 5n
//

// tinhLoLai(findListMessageModel(parseMessage(t15)));

function tryParseMessage(message) {
  return findListMessageModel(parseMessage(message));
}
module.exports = tryParseMessage;
