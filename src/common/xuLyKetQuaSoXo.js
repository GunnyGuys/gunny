const { dealerUnsingedMap } = require("../utils/constant.util");

function dinhDangKetQuaXoSo(ketQua, dealerOrder) {
  var ketQuaSoXo = {};
  const length = dealerOrder.length;
  if (length === 2) {
    ketQuaSoXo["2 dai"] = [dealerOrder[0], dealerOrder[1]];
  } else if (length === 3) {
    ketQuaSoXo["2 dai"] = [dealerOrder[0], dealerOrder[1]];
    ketQuaSoXo["3 dai"] = [dealerOrder[0], dealerOrder[1], dealerOrder[2]];
  } else if (length == 4) {
    ketQuaSoXo["2 dai"] = [dealerOrder[0], dealerOrder[1]];
    ketQuaSoXo["3 dai"] = [dealerOrder[0], dealerOrder[1], dealerOrder[2]];
    ketQuaSoXo["4 dai"] = [
      dealerOrder[0],
      dealerOrder[1],
      dealerOrder[2],
      dealerOrder[3],
    ];
  }
  ketQuaSoXo["dai chinh"] = ketQua[0][dealerOrder[0]];
  for (let i = 0; i < dealerOrder.length; i++) {
    ketQuaSoXo[dealerOrder[i]] = ketQua[i][dealerOrder[i]];
    if (dealerUnsingedMap[dealerOrder[i]]) {
      ketQuaSoXo[dealerUnsingedMap[dealerOrder[i]]] = ketQua[i][dealerOrder[i]];
    }
  }

  return ketQuaSoXo;
}

module.exports = dinhDangKetQuaXoSo;
