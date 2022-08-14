const quyDinh = require("./config");

function xuLyBaoLo7(message) {
  const temp = " .,;:!@#$%^&+=_-";
  const patterns = [];
  for (let i = 0; i < temp.length; i++) {
    patterns.push(`bao lo 7${temp[i]}`);
    patterns.push(`baolo7${temp[i]}`);
    patterns.push(`blo7${temp[i]}`);
    patterns.push(`bl7${temp[i]}`);
    patterns.push(`bao lo 7 ${temp[i]}`);
    patterns.push(`baolo7 ${temp[i]}`);
    patterns.push(`blo7 ${temp[i]}`);
    patterns.push(`bl7 ${temp[i]}`);
  }

  for (let i = 0; i < patterns.length; i++) {
    message = message.replaceAll(patterns[i], " baobaylo ");
  }

  const b7l = quyDinh.kieu["bao bay lo"];
  for (let i = 0; i < b7l.length; i++) {
    message = message.replaceAll(b7l[i], " baobaylo ");
  }

  return message;
}

module.exports = xuLyBaoLo7;
