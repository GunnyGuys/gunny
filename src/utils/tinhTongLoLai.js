function tinhTongLoLai(messages) {
  try {
    var xacDau = 0;
    var trungDau = 0;
    //
    var xacDuoi = 0;
    var trungDuoi = 0;
    //
    var xacLo = 0;
    var trungLo = 0;
    //
    var xacDaThang = 0;
    var trungDaThang = 0;
    //
    var xacDaXien = 0;
    var trungDaXien = 0;
    // Lo 3 con
    var xac3C = 0;
    var trung3C = 0;
    // Lo 4 con
    var xac4C = 0;
    var trung4C = 0;
    //
    var xacXC = 0;
    var trungXC = 0;
    //
    var xacT2C = 0;
    var trungT2C = 0;
    //
    var xacT3C = 0;
    var trungT3C = 0;
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (message.kieu === "dau") {
        xacDau += message.xac;
        trungDau += message.loi + message.lo;
      } else if (message.kieu === "duoi") {
        xacDuoi += message.xac;
        trungDuoi += message.loi + message.lo;
      } else if (message.kieu === "dau duoi") {
        xacDau += message.xac;
        trungDau += message.loi + message.lo;
      } else if (message.kieu === "da thang") {
        xacDaThang += message.xac;
        trungDaThang += message.loi + message.lo;
      } else if (message.kieu === "da xien") {
        xacDaXien += message.xac;
        trungDaXien += message.loi + message.lo;
      } else if (
        message.kieu === "xiu dau" ||
        message.kieu === "xiu duoi" ||
        message.kieu === "xiu chu"
      ) {
        xacXC += message.xac;
        trungXC += message.loi + message.lo;
      } else if (
        message.kieu === "lo" ||
        message.kieu === "bao lo" ||
        message.kieu === "bao bay lo"
      ) {
        if (message.so && message.so.trim().length > 0) {
          const temp = message.so.split(" ");
          if (temp[0].trim().length > 3) {
            xac4C += message.xac;
            trung4C += message.loi + message.lo;
          } else if (temp[0].trim().length > 2) {
            xac3C += message.xac;
            trung4C += message.loi + message.lo;
          } else {
            xacLo += message.xac;
            trungLo += message.loi + message.lo;
          }
        }
      }
    }
    xacT2C = xacDau + xacDuoi + xacLo + xacDaThang + xacDaXien;
    trungT2C = trungDau + trungDuoi + trungLo + trungDaThang + trungDaXien;
    xacT3C = xacXC + xac3C;
    trungT3C = trungXC + trung3C;

    var totalXac =
      xacDau + xacDuoi + xacDaThang + xacDaXien + xac3C + xac4C + xacXC;
    var totalLoi =
      trungDau +
      trungDuoi +
      trungDaThang +
      trungDaXien +
      trung3C +
      trung4C +
      trungXC;
    return [
      `${xacDau + xacDuoi}@${trungDau + trungDuoi}`,
      `${xacLo}@${trungLo}`,
      `${xacDaThang}@${trungDaThang}`,
      `${xacDaXien}@${trungDaXien}`,
      `${xac3C}@${trung3C}`,
      `${xac4C}@${trung4C}`,
      `${xacXC}@${trungXC}`,
      `${xacT2C}@${trungT2C}`,
      `${xacT3C}@${trungT3C}`,
      `${totalXac}@${totalLoi}`,
    ];
  } catch (error) {
    return ["", "", "", "", "", "", "", "", "", ""];
  }
}

module.exports = tinhTongLoLai;
