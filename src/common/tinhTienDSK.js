//  cò đầu đuôi 2 con là 0.76
// 	cò đầu đuôi 3 con là 0.65
// 	cò các trường hợp khác là 0.7

//  thưởng đầu đuôi 2 con là 75 lần
// 	thưởng đầu đuôi 3 con là 85 lần
// 	thưởng các trường hợp khác là 680 lần

const thuongDD2 = 75;
const thuongDD3 = 85;
const thuongOther = 680;

/// tiền xác = tong so danh x (cach danh x diem)
/// thầu nhận = tiền xác x he so (0.76, 0.75, 0.7)
const ketQuaSoXo = {
  "2 dai": ["ho chi minh", "long an"],
  "3 dai": ["ho chi minh", "long an", "binh phuoc"],
  "dai chinh": [
    10, 951, 9541, 1306, 1203, 4123, 27551, 20226, 23816, 93849, 30973, 31015,
    08168, 14300, 24328, 92368, 81209, 122111,
  ],
  "ho chi minh": [
    12, 134, 9541, 1306, 1203, 4156, 27551, 20226, 23816, 93849, 30973, 31015,
    08168, 14300, 24328, 92368, 81209, 122136,
  ],
  "long an": [
    64, 997, 1509, 2876, 4887, 0360, 12901, 69062, 67460, 66996, 16178, 84394,
    88562, 73050, 65126, 58427, 56781, 944892,
  ],
  "binh phuoc": [
    30, 707, 4191, 2351, 8657, 3112, 62381, 69342, 04442, 45864, 53278, 36681,
    03305, 80469, 80713, 83438, 90115, 856312,
  ],
  "hau giang": [
    56, 067, 3742, 6748, 9552, 0335, 70690, 64094, 71910, 40274, 92594, 03305,
    50234, 25576, 69631, 09237, 56638, 700699,
  ],
  "vinh long": [
    08, 067, 3742, 6748, 9552, 0335, 70690, 64094, 71910, 40274, 92594, 03305,
    50234, 25576, 69631, 09237, 56638, 700608,
  ],
};

function isTrungDau(so, dais) {
  if (dais.includes("2 dai") || dais.includes("3 dai")) {
    dais = ketQuaSoXo[dais.includes("2 dai") ? "2 dai" : "3 dai"];
  }

  for (let index = 0; index < dais.length; index++) {
    const kq = ketQuaSoXo[dais[index]];
    for (let i = 0; i < so.length; i++) {
      const s = so[i];
      if (`${kq[s.length - 2]}`.padStart(s.length, "0").includes(s)) {
        return true;
      }
    }
  }

  return false;
}

function isTrungDuoi(so, dais) {
  if (dais.includes("2 dai") || dais.includes("3 dai")) {
    dais = ketQuaSoXo[dais.includes("2 dai") ? "2 dai" : "3 dai"];
  }

  for (let index = 0; index < dais.length; index++) {
    const kq = ketQuaSoXo[dais[index]];
    for (let i = 0; i < so.length; i++) {
      const s = so[i];
      const last = `${kq[kq.length - 1]}`;
      if (last.substring(last.length - s.length, last.length).includes(s)) {
        return true;
      }
    }
  }

  return false;
}

function isTrungDaThang(so, dai) {
  const kq = ketQuaSoXo[dai];
  const n1 = so[0];
  const n2 = so[1];
  const l = n1.length;

  let d1 = kq.some((element) => {
    const e = `${element}`;
    const el = e.length;
    return e.substring(el - l, el).includes(n1);
  });
  let d2 = kq.some((element) => {
    const e = `${element}`;
    const el = e.length;
    return e.substring(el - l, el).includes(n2);
  });
  return d1 && d2;
}

function isTrungBaoLo(so, dai) {
  const kq = ketQuaSoXo[dai];
  for (let i = 0; i < so.length; i++) {
    const num = so[i];
    const numLen = num.length;
    const index = numLen === 2 ? 0 : 1;
    for (let j = index; j < kq.length; j++) {
      let row = `${kq[j]}`.padStart(numLen, "0");
      if (row.substring(row.length - numLen, row.length).includes(num)) {
        return true;
      }
    }
  }
  return false;
}

function getSo(value) {
  return value.split(" ");
}

function getDonVi(value) {
  if (["nghin", "ngan", "ng", "n"].includes(value.trim())) {
    return 1000;
  } else {
    return 1000000;
  }
}

function getTienXac(tien, kieu, so, donvi) {
  tien = tien * donvi * so.length;
  switch (kieu) {
    case "dau":
    case "duoi":
      return tien;
    case "dau duoi":
      return tien * 2;
    case "bao bay lo":
      return tien * 7;
    case "bao lo":
      let sum = 0;
      for (let i = 0; i < so.length; i++) {
        if (so[i].length === 2) {
          sum += tien * 18;
        } else if (so[i].length === 3) {
          sum += tien * 17;
        } else {
          sum += tien * 16;
        }
      }
      return sum;
    case "da thang":
      return tien * 36;
    default:
      return tien;
  }
}

function getTiLeThuong(so, kieu) {
  if (kieu === "dau duoi" || kieu === "dau" || kieu === "duoi") {
    if (so[0].length === 2) {
      return 75;
    } else if (so[0].length === 3) {
      return 85;
    }
  }
  return 680;
}

function howToThauNhan(so, tienXac) {
  const p = so[0];
  if (p.length === 2) {
    return tienXac * 0.76;
  } else if (p.length === 3) {
    return tienXac * 0.65;
  } else {
    return tienXac * 0.7;
  }
}

function getHeSoDai(dais) {
  if (dais.includes("2 dai")) return 2;
  if (dais.includes("3 dai")) return 3;
  return dais.length;
}

function countDaiBefore(item, curIndex) {
  const rp = [];
  rp.push(item["dai"]);
  curIndex--;
  while (curIndex >= 0) {
    const dai = item["dai"];
    const so = item["so"];
    const kieuTien = item["kieuTien"];
    if (!(so === "" && kieuTien.length === 0)) return rp;
    rp.push(dai);
    curIndex--;
  }
  return rp;
}

function tinhTien(messages) {
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    for (let j = 0; j < message.length; j++) {
      const item = message[j];
      const dai = item["dai"];
      const so = getSo(item["so"]);
      const kieuTien = item["kieuTien"];
      if (so !== "" && kieuTien.length > 0) {
        const countDai = countDaiBefore(item, j);
        for (let k = 0; k < kieuTien.length; k++) {
          const kt = kieuTien[k];
          const kieu = kt["kieu"];
          const donvi = getDonVi(kt["x"]);
          const diem = (Number.parseFloat(kt["tien"]) * donvi) / 1000;
          const tienXac =
            getHeSoDai(countDai) * getTienXac(kt["tien"], kieu, so, donvi);
          const thauNhan = howToThauNhan(so, tienXac / donvi);
          const tiLeThuong = getTiLeThuong(so, kieu);
          let profit = 0;
          let tongThuong = 0;
          switch (kieu) {
            case "da thang":
              profit = (thauNhan - tongThuong) * donvi;
              break;
            case "dau":
              tongThuong = isTrungDau(so, countDai) ? diem * tiLeThuong : 0;
              profit = (thauNhan - tongThuong) * donvi;
              break;
            case "duoi":
              tongThuong = isTrungDuoi(so, countDai) ? diem * tiLeThuong : 0;
              profit = (thauNhan - tongThuong) * donvi;
              break;
            case "dau duoi":
              if (isTrungDau(so, countDai)) {
                tongThuong += diem * tiLeThuong;
              }
              if (isTrungDuoi(so, countDai)) {
                tongThuong += diem * tiLeThuong;
              }
              profit = (thauNhan - tongThuong) * donvi;
              break;
            case "bao lo":
              profit = (thauNhan - tongThuong) * donvi;
              break;
            default:
              break;
          }
          console.log(profit);
          console.log("\n");
        }
      }
    }
  }
}

module.exports = tinhTien;

/// tien xac = tong so * diem * so cach do
