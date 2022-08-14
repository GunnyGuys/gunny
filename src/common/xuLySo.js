const quyDinh = require("./config");

function xuLySo(value) {
  Object.keys(quyDinh.so).forEach((key) => {
    const yN = quyDinh.so[key]["y nghia"];
    const arr = quyDinh.so[key]["chu quy dinh"];
    for (let i = 0; i < arr.length; i++) {
      value = value.replaceAll(arr[i], ` ${yN} `);
    }
  });
  return value;
}

module.exports = xuLySo;
