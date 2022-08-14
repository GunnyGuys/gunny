function xuLySoCapSoChuc(message) {
  const boChuc = ["bo chuc", "bochuc", "bchuc"];
  const boCap = ["bo cap", "bocap", "bcap", "xcap"];

  for (let i = 0; i < boChuc.length; i++) {
    message = message.replaceAll(boChuc[i], "1111110");
  }

  for (let i = 0; i < boCap.length; i++) {
    message = message.replaceAll(boCap[i], "1111111");
  }

  return message;
}

module.exports = xuLySoCapSoChuc;
