const { dai } = require("./config");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

/// tiền xác = tong so danh x (cach danh x diem)
/// thầu nhận = tiền xác x he so (0.76, 0.75, 0.7)
var ketQuaSoXo = {};

const permutationLength = (n) => {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

const stringPermutations = (str) => {
  if (str.length <= 2) return str.length === 2 ? [str, str[1] + str[0]] : [str];
  return str
    .split("")
    .reduce(
      (acc, letter, i) =>
        acc.concat(
          stringPermutations(str.slice(0, i) + str.slice(i + 1)).map(
            (val) => letter + val
          )
        ),
      []
    );
};

const tiLeCoThuong = {
  co: [75.5, 75.5, 75.5, 13.6, 66, 66, 66, 11.2, 66, 66, 13.6, 13.6],
  traThuong: [75, 75, 75, 75, 650, 650, 650, 650, 6000, 6000, 750, 550],
};

function getTiLeCoThuong(so, kieu) {
  const indexes = [];
  const d = so[0].length;
  switch (kieu) {
    case "dau":
    case "xiu dau":
    case "dao xiu dau":
      indexes.push(d === 2 ? 0 : 4);
      break;
    case "duoi":
    case "xiu duoi":
    case "dao xiu duoi":
    case "dao dac biet":
      indexes.push(d === 2 ? 1 : d === 3 ? 5 : 8);
      break;
    case "dau duoi":
    case "xiu chu":
    case "dao xiu dau duoi":
      indexes.push(d === 2 ? 0 : 4);
      indexes.push(d === 2 ? 1 : 5);
      break;
    case "bao bay lo":
      indexes.push(d === 2 ? 2 : 6);
      break;
    case "bao lo":
    case "bao dao":
      indexes.push(d === 2 ? 3 : d === 3 ? 7 : 9);
      break;
    case "da thang":
    case "da vong":
      indexes.push(10);
      break;
    case "da xien":
      indexes.push(11);
      break;
    default:
      indexes.push(0);
      break;
  }
  const result = {
    co: [],
    traThuong: [],
  };
  for (let i = 0; i < indexes.length; i++) {
    result["co"].push(tiLeCoThuong["co"][indexes[i]]);
    result["traThuong"].push(tiLeCoThuong["traThuong"][indexes[i]]);
  }
  return result;
}

function getSoLanTrungDau(so, dais) {
  let d = 0;
  const soTrung = [];
  if (
    dais.includes("2 dai") ||
    dais.includes("3 dai") ||
    dais.includes("4 dai")
  ) {
    dais =
      ketQuaSoXo[
        dais.includes("2 dai")
          ? "2 dai"
          : dais.includes("3 dai")
          ? "3 dai"
          : "4 dai"
      ];
  }

  for (let index = 0; index < dais.length; index++) {
    const kq = ketQuaSoXo[dais[index]];
    if (!kq) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Đài đánh không xổ trong ngày đã đánh"
      );
    }
    for (let i = 0; i < so.length; i++) {
      const s = so[i];
      if (`${kq[s.length - 2]}`.padStart(s.length, "0").includes(s)) {
        d++;
        soTrung.push(s);
      }
    }
  }

  return { soLanTrung: d, soTrung: soTrung.join(" ") };
}

function getSoLanTrungDuoi(so, dais) {
  let d = 0;
  const soTrung = [];
  if (
    dais.includes("2 dai") ||
    dais.includes("3 dai") ||
    dais.includes("4 dai")
  ) {
    dais =
      ketQuaSoXo[
        dais.includes("2 dai")
          ? "2 dai"
          : dais.includes("3 dai")
          ? "3 dai"
          : "4 dai"
      ];
  }

  for (let index = 0; index < dais.length; index++) {
    const kq = ketQuaSoXo[dais[index]];
    if (!kq) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Đài đánh không xổ trong ngày đã đánh"
      );
    }
    for (let i = 0; i < so.length; i++) {
      const s = so[i];
      const last = `${kq[kq.length - 1]}`;
      if (last.substring(last.length - s.length, last.length).includes(s)) {
        d++;
        soTrung.push(s);
      }
    }
  }

  return { soLanTrung: d, soTrung: soTrung.join(" ") };
}

function getSoLanTrungBaoBayLo(so, dais) {
  let d = 0;
  const soTrung = [];
  if (
    dais.includes("2 dai") ||
    dais.includes("3 dai") ||
    dais.includes("4 dai")
  ) {
    dais =
      ketQuaSoXo[
        dais.includes("2 dai")
          ? "2 dai"
          : dais.includes("3 dai")
          ? "3 dai"
          : "4 dai"
      ];
  }

  for (let index = 0; index < dais.length; index++) {
    const kq = ketQuaSoXo[dais[index]];
    if (!kq) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Đài đánh không xổ trong ngày đã đánh"
      );
    }
    for (let i = 0; i < so.length; i++) {
      const s = so[i];
      const arr =
        so.length === 2 ? [0, 1, 2, 3, 4, 5, 6, 17] : [1, 2, 3, 4, 5, 6, 7, 17];
      for (let j = 0; j < arr.length; j++) {
        const match = `${kq[arr[j]]}`;
        if (
          match.substring(match.length - s.length, match.length).includes(s)
        ) {
          d++;
          soTrung.push(s);
        }
      }
    }
  }

  return { soLanTrung: d, soTrung: soTrung.join(" ") };
}

function getSoLanTrungBaoLo(so, dais) {
  let d = 0;
  const soTrung = [];
  if (
    dais.includes("2 dai") ||
    dais.includes("3 dai") ||
    dais.includes("4 dai")
  ) {
    dais =
      ketQuaSoXo[
        dais.includes("2 dai")
          ? "2 dai"
          : dais.includes("3 dai")
          ? "3 dai"
          : "4 dai"
      ];
  }

  for (let index = 0; index < dais.length; index++) {
    const kq = ketQuaSoXo[dais[index]];
    if (!kq) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Đài đánh không xổ trong ngày đã đánh"
      );
    }
    for (let i = 0; i < so.length; i++) {
      const s = so[i];
      for (let j = s.length === 2 ? 0 : s.length === 3 ? 1 : 2; j < 18; j++) {
        const match = `${kq[j]}`;
        if (
          match.substring(match.length - s.length, match.length).includes(s)
        ) {
          d++;
          soTrung.push(s);
        }
      }
    }
  }

  return { soLanTrung: d, soTrung: soTrung.join(" ") };
}

function getSoLanTrungBaoDao(so, dais) {
  let d = 0;
  const soTrung = [];
  if (
    dais.includes("2 dai") ||
    dais.includes("3 dai") ||
    dais.includes("4 dai")
  ) {
    dais =
      ketQuaSoXo[
        dais.includes("2 dai")
          ? "2 dai"
          : dais.includes("3 dai")
          ? "3 dai"
          : "4 dai"
      ];
  }

  for (let index = 0; index < dais.length; index++) {
    const kq = ketQuaSoXo[dais[index]];
    if (!kq) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Đài đánh không xổ trong ngày đã đánh"
      );
    }
    for (let i = 0; i < so.length; i++) {
      const permutationArr = stringPermutations(so[i]);
      for (let k = 0; k < permutationArr.length; k++) {
        const s = permutationArr[k];
        for (let j = s.length === 2 ? 0 : s.length === 3 ? 1 : 2; j < 18; j++) {
          const match = `${kq[j]}`;
          if (
            match.substring(match.length - s.length, match.length).includes(s)
          ) {
            d++;
            soTrung.push(s);
          }
        }
      }
    }
  }

  return { soLanTrung: d, soTrung: soTrung.join(" ") };
}

function getSoLanTrungDaThang(so, dais) {
  let count = 0;
  const soTrung = [];
  const result = [];
  if (
    dais.includes("2 dai") ||
    dais.includes("3 dai") ||
    dais.includes("4 dai")
  ) {
    dais =
      ketQuaSoXo[
        dais.includes("2 dai")
          ? "2 dai"
          : dais.includes("3 dai")
          ? "3 dai"
          : "4 dai"
      ];
  }

  for (let index = 0; index < dais.length; index++) {
    const kq = ketQuaSoXo[dais[index]];
    if (!kq) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Đài đánh không xổ trong ngày đã đánh"
      );
    }
    for (let i = 0; i < so.length; i++) {
      let d = 0;
      const s = so[i];
      for (let j = s.length === 2 ? 0 : s.length === 3 ? 1 : 2; j < 18; j++) {
        const match = `${kq[j]}`;
        if (
          match.substring(match.length - s.length, match.length).includes(s)
        ) {
          d++;
          soTrung.push(s);
        }
      }
      result[i] = (result[i] ? result[i] : 0) + d;
    }
  }

  for (let i = 0; i < so.length - 1; i++) {
    for (let j = i + 1; j < so.length; j++) {
      const a = so[i];
      const b = so[j];
      while (result[so.indexOf(a)] > 0 && result[so.indexOf(b)] > 0) {
        result[so.indexOf(a)]--;
        result[so.indexOf(b)]--;
        count++;
      }
    }
  }

  return { soLanTrung: count, soTrung: soTrung.join(" ") };
}

function getSoLanTrungDaoXiuDau(so, dais) {
  let d = 0;
  const soTrung = [];
  if (
    dais.includes("2 dai") ||
    dais.includes("3 dai") ||
    dais.includes("4 dai")
  ) {
    dais =
      ketQuaSoXo[
        dais.includes("2 dai")
          ? "2 dai"
          : dais.includes("3 dai")
          ? "3 dai"
          : "4 dai"
      ];
  }

  for (let index = 0; index < dais.length; index++) {
    const kq = ketQuaSoXo[dais[index]];
    if (!kq) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Đài đánh không xổ trong ngày đã đánh"
      );
    }
    for (let i = 0; i < so.length; i++) {
      const s = so[i];
      const permutationArr = stringPermutations(s);
      for (let j = 0; j < permutationArr.length; j++) {
        const item = permutationArr[j];
        const match = `${kq[item.length - 2]}`;
        if (
          match
            .substring(match.length - item.length, match.length)
            .padStart(item.length, "0")
            .includes(item)
        ) {
          d++;
          soTrung.push(s);
        }
      }
    }
  }

  return { soLanTrung: d, soTrung: soTrung.join(" ") };
}

function getSoLanTrungDaoXiuDuoi(so, dais) {
  let d = 0;
  const soTrung = [];
  if (
    dais.includes("2 dai") ||
    dais.includes("3 dai") ||
    dais.includes("4 dai")
  ) {
    dais =
      ketQuaSoXo[
        dais.includes("2 dai")
          ? "2 dai"
          : dais.includes("3 dai")
          ? "3 dai"
          : "4 dai"
      ];
  }

  for (let index = 0; index < dais.length; index++) {
    const kq = ketQuaSoXo[dais[index]];
    if (!kq) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Đài đánh không xổ trong ngày đã đánh"
      );
    }
    for (let i = 0; i < so.length; i++) {
      const s = so[i];
      const permutationArr = stringPermutations(s);
      for (let j = 0; j < permutationArr.length; j++) {
        const item = permutationArr[j];
        const match = `${kq[kq.length - 1]}`;
        if (
          match
            .substring(match.length - item.length, match.length)
            .padStart(item.length, "0")
            .includes(item)
        ) {
          d++;
          soTrung.push(s);
        }
      }
    }
  }

  return { soLanTrung: d, soTrung: soTrung.join(" ") };
}

function getSo(value) {
  return value.split(" ");
}

function tongSoDai(dais, kieu) {
  let tongD = dais.length;
  if (dais.includes("2 dai")) tongD = 2;
  else if (dais.includes("3 dai")) tongD = 3;
  else if (dais.includes("4 dai")) tongD = 4;
  const result = [];
  for (let i = 0; i < tongD; i++) {
    if (kieu === "dau" || kieu === "xiu dau" || kieu === "dao xiu dau") {
      result.push(0);
    } else if (
      kieu === "duoi" ||
      kieu === "xiu duoi" ||
      kieu === "dao xiu duoi" ||
      kieu === "dao dac biet"
    ) {
      result.push(1);
    } else if (
      kieu === "dau duoi" ||
      kieu === "xiu chu" ||
      kieu === "dao xiu dau duoi"
    ) {
      result.push(0);
      result.push(1);
    } else if (kieu === "bao bay lo") {
      result.push(2);
    } else if (kieu === "bao lo" || kieu === "bao dao") {
      result.push(3);
    } else if (kieu === "da thang" || kieu === "da vong") {
      //Update: 9/10/2022 for case: dc 311 565 833 bao 1n d 2n
      result.push(10);
    } else if (kieu === "da xien") {
      result.push(11);
      if (tongD === 3) result.push(11);
      else if (tongD === 4) {
        result.push(11);
        result.push(11);
      }
    }
  }
  return result;
}

function tinhLoLai(message, ketQua) {
  ketQuaSoXo = ketQua;
  for (let i = 0; i < message.messages.length; i++) {
    // Tin thứ i
    const item = message.messages[i];
    const so = getSo(item["so"]);
    const countDai = item["dai"];
    const kieu = item["kieu"];
    const donvi = item["donVi"];
    const diem = (Number.parseFloat(item["tien"]) * donvi) / 1000;

    const coThuong = getTiLeCoThuong(so, kieu);

    /// Dau/Duoi/DauDuoi: Tiền Xác = số chơi x điểm chơi x số lần dò
    const soCachDo = tongSoDai(countDai, kieu);
    let tienXac = 0;
    let thucThu = 0;
    for (let i = 0; i < soCachDo.length; i++) {
      let thu = 0;
      /// Dau/Duoi/DauDuoi: Thực Thu = tiền xác x tỉ lệ cò
      switch (kieu) {
        case "dau":
        case "xiu dau":
        case "duoi":
        case "xiu duoi":
          var xac = so.length * diem;
          tienXac += xac;
          thu += (xac * coThuong["co"][0]) / 100;
          break;
        case "dau duoi":
        case "xiu chu":
          var xac = so.length * diem;
          tienXac += xac;
          thu += (xac * coThuong["co"][soCachDo[i]]) / 100;
          break;
        case "bao bay lo":
          var xac = so.length * diem * 7;
          tienXac += xac;
          thu += (xac * coThuong["co"][0]) / 100;
          break;
        case "bao lo":
          var xac =
            so.length *
            diem *
            (so[0].length === 2 ? 18 : so[0].length === 3 ? 17 : 16);
          tienXac += xac;
          thu += (xac * coThuong["co"][0]) / 100;
          break;
        case "bao dao":
          var xac =
            so.length *
            permutationLength(so[0].length) *
            diem *
            (so[0].length === 2 ? 18 : so[0].length === 3 ? 17 : 16);
          tienXac += xac;
          thu += (xac * coThuong["co"][0]) / 100;
          break;
        // Tiền Xác = số cặp (có phân biệt thứ tự) x điểm chơi x số lần dò
        // Thực Thu = tiền xác x tỉ lệ cò
        // Tiền Trúng = điểm x số lần trúng x tỉ lệ thưởng
        // Lời/Lỗ = Thực Thu – Tiền trúng
        // Công thức tính số cặp:
        // ((tổng số chơi) x (tổng số chơi – 1))
        case "da thang":
        case "da vong": //Update: 9/10/2022 for case: dc 311 565 833 789 bao 1n d 2n
        case "da xien":
          var xac = so.length * (so.length - 1) * diem * 18;
          tienXac += xac;
          thu += (xac * coThuong["co"][0]) / 100;
          break;
        case "dao xiu dau":
        case "dao xiu duoi":
        case "dao dac biet":
          var xac = so.length * permutationLength(so[0].length) * diem;
          tienXac += xac;
          thu += (xac * coThuong["co"][0]) / 100;
          break;
        case "dao xiu dau duoi":
          var xac = so.length * permutationLength(so[0].length) * diem;
          tienXac += xac;
          thu += (xac * coThuong["co"][soCachDo[i]]) / 100;
          break;
        default:
          break;
      }
      thucThu += thu;
    }

    message.messages[i].xac = tienXac;

    let profit = 0;
    ///
    /// dau/duoi/dauduoi: Tiền Trúng = điểm x số lần trúng x tỉ lệ thưởng
    var tienTrung = 0;
    var soLanTrung = 0;
    var soTrung = "";
    switch (kieu) {
      case "dau":
      case "xiu dau":
        ({ soLanTrung, soTrung } = getSoLanTrungDau(so, countDai));
        tienTrung = diem * soLanTrung * coThuong["traThuong"][0];
        profit = thucThu - tienTrung;
        break;
      case "duoi":
      case "xiu duoi":
        ({ soLanTrung, soTrung } = getSoLanTrungDuoi(so, countDai));
        tienTrung = diem * soLanTrung * coThuong["traThuong"][0];
        profit = thucThu - tienTrung;
        break;
      case "dau duoi":
      case "xiu chu":
        tienTrung =
          diem * getSoLanTrungDau(so, countDai) * coThuong["traThuong"][0] +
          diem * getSoLanTrungDuoi(so, countDai) * coThuong["traThuong"][1];
        profit = thucThu - tienTrung;
        break;
      case "bao bay lo":
        ({ soLanTrung, soTrung } = getSoLanTrungBaoBayLo(so, countDai));
        tienTrung = diem * soLanTrung * coThuong["traThuong"][0];
        profit = thucThu - tienTrung;
        break;
      case "bao lo":
        ({ soLanTrung, soTrung } = getSoLanTrungBaoLo(so, countDai));
        tienTrung = diem * soLanTrung * coThuong["traThuong"][0];
        profit = thucThu - tienTrung;
        break;
      case "bao dao":
        ({ soLanTrung, soTrung } = getSoLanTrungBaoDao(so, countDai));
        tienTrung = diem * soLanTrung * coThuong["traThuong"][0];
        profit = thucThu - tienTrung;
        break;
      case "da thang":
      case "da vong": /// Update: 9/10/2022 for case: dc 311 565 833 789 bao 1n d 2n
      case "da xien":
        ({ soLanTrung, soTrung } = getSoLanTrungDaThang(so, countDai));
        tienTrung = diem * soLanTrung * coThuong["traThuong"][0];
        profit = thucThu - tienTrung;
        break;
      case "dao xiu dau":
        ({ soLanTrung, soTrung } = getSoLanTrungDaoXiuDau(so, countDai));
        tienTrung = diem * soLanTrung * coThuong["traThuong"][0];
        profit = thucThu - tienTrung;
        break;
      case "dao xiu duoi":
      case "dao dac biet":
        ({ soLanTrung, soTrung } = getSoLanTrungDaoXiuDuoi(so, countDai));
        tienTrung = diem * soLanTrung * coThuong["traThuong"][0];
        profit = thucThu - tienTrung;
        break;
      case "dao xiu dau duoi":
        tienTrung =
          diem *
            getSoLanTrungDaoXiuDau(so, countDai) *
            coThuong["traThuong"][0] +
          diem *
            getSoLanTrungDaoXiuDuoi(so, countDai) *
            coThuong["traThuong"][1];
        profit = thucThu - tienTrung;
        break;
      default:
        break;
    }
    item.loi = profit;
    message.profit += profit;
    if (soLanTrung !== 0) {
      item.trung = true;
      item.soTrung = soTrung;
      item.lo = profit;
    }
  }
  message.confirmed = true;
  return message;
}

module.exports = tinhLoLai;

/// tien xac = tong so * diem * so cach do
