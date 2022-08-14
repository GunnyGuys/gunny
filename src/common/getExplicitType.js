const quyDinh = require("./config");

function getExplicitType(type) {
  const kieuKeys = Object.keys(quyDinh.kieu);
  for (let i = 0; i < kieuKeys.length; i++) {
    const arr = quyDinh.kieu[kieuKeys[i]];
    for (let j = 0; j < arr.length; j++) {
      if (type.trim() === arr[j]) {
        return kieuKeys[i];
      }
    }
  }
  return type;
}

function updateType(result) {
  for (let i = 0; i < result.length; i++) {
    const kieuTien = result[i]["kieuTien"];
    for (let j = 0; j < kieuTien.length; j++) {
      const kieu = getExplicitType(kieuTien[j]["kieu"].trim());
      kieuTien[j]["kieu"] = kieu;
    }
  }
}

module.exports = updateType;
