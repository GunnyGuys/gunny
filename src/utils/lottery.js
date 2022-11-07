const request = require("request");
const cheerio = require("cheerio");
const moment = require("moment");

const COUNT_DAI = 4;
const MIEN_NAM = "mien-nam";
const MIEN_TRUNG = "mien-trung";
const MIEN_BAC = "mien-bac";

function getUrlLottery(mien, date) {
  return `https://xskt.com.vn/ket-qua-xo-so-theo-ngay/${mien}-xsmn/${date}.html`;
}

function insertWithIndex(text, index, textInsert) {
  return text.substring(0, index) + textInsert + text.substr(index);
}

const getLotteryResults = async (dealer, date) =>
  new Promise((resolve, reject) =>
    request(
      getUrlLottery(dealer, moment(date).format("DD-MM-YYYY")),
      function (error, response, html) {
        const isMienBac = dealer === MIEN_BAC;

        if (!error) {
          const $ = cheerio.load(html, { decodeEntities: false });

          // Miền Trung + Miền Nam
          if (!isMienBac) {
            const data = $(".tbl-xsmn");
            const listDai = data.find("tr").eq(0);
            const html_thu_xo = listDai.find("th").eq(0).html().split("<br>");
            let thu_xo = html_thu_xo[0];
            thu_xo = thu_xo.replace(/<[^>]*>?/gm, "");
            const ngay_xo = html_thu_xo[1];

            let results = [];
            for (let i = 1; i < COUNT_DAI + 1; i++) {
              const dai = listDai.find("th").eq(i).text();
              if (dai !== "") {
                //giai 8
                const g8 = data.find("tr").eq(1).find("td").eq(i).text();

                //giai 7
                const g7 = data.find("tr").eq(2).find("td").eq(i).text();

                //giai 6
                const g6 = data
                  .find("tr")
                  .eq(3)
                  .find("td")
                  .eq(i)
                  .html()
                  .split("<br>")
                  .join(" ");

                //giai 5
                const g5 = data.find("tr").eq(4).find("td").eq(i).text();

                //giai 4
                const g4 = data
                  .find("tr")
                  .eq(5)
                  .find("td")
                  .eq(i)
                  .html()
                  .split("<br>")
                  .join(" ");

                //giai 3
                const g3 = data
                  .find("tr")
                  .eq(6)
                  .find("td")
                  .eq(i)
                  .html()
                  .split("<br>")
                  .join(" ");

                //giai 2
                const g2 = data.find("tr").eq(7).find("td").eq(i).text();

                //giai 1
                const g1 = data.find("tr").eq(8).find("td").eq(i).text();

                //dac biet
                const db = data.find("tr").eq(9).find("td").eq(i).text();

                const winNumbers = [];
                [g8, g7, g6, g5, g4, g3, g2, g1, db].forEach((item) => {
                  const temp = item.split(" ").map(function (i) {
                    return parseInt(i, 10);
                  });
                  winNumbers.push.apply(winNumbers, temp);
                });
                var obj = {};
                obj[dai] = winNumbers;
                results.push(obj);
              }
            }
            const resultFinal = {
              ket_qua: results,
              ngay_so: date,
              thu_so: thu_xo === "CN" ? "Chủ Nhật" : thu_xo,
              kiem_tra_luc: moment().format("YYYY-MM-DD H:mm:ss"),
              mien: dealer,
            };
            resolve(resultFinal);
          } else {
            // Miền Bắc
            const data = $(".result");

            const thu_xo = data
              .find("tr")
              .eq(0)
              .find("th")
              .eq(0)
              .find("b")
              .eq(0)
              .find("a")
              .eq(1)
              .html();

            const tinh_xo = data
              .find("tr")
              .eq(0)
              .find("th")
              .eq(0)
              .find("b")
              .eq(0)
              .html()
              .split("(")[1]
              .slice(0, -1);

            const maDB = data
              .find("tr")
              .eq(11)
              .find("td")
              .eq(0)
              .find("strong")
              .text();

            //giai db
            const db = data.find("tr").eq(1).find("td").eq(1).text();

            // giai 1
            const g1 = data.find("tr").eq(2).find("td").eq(1).text();

            // giai 2
            const g2 = data.find("tr").eq(3).find("td").eq(1).text();

            // giai 3
            const g3 = insertWithIndex(
              data.find("tr").eq(4).find("td").eq(1).text(),
              17,
              " "
            );

            // giai 4
            const g4 = data.find("tr").eq(6).find("td").eq(1).text();

            // giai 5
            const g5 = insertWithIndex(
              data.find("tr").eq(7).find("td").eq(1).text(),
              14,
              " "
            );

            // giai 6
            const g6 = data.find("tr").eq(9).find("td").eq(1).text();

            // giai 7
            const g7 = data.find("tr").eq(10).find("td").eq(1).text();

            let duois = [];
            for (let i = 0; i < 10; i++) {
              let duoi;
              if (i === 4 || i === 7) {
                duoi = data
                  .find("tr")
                  .eq(i + 1)
                  .find("td")
                  .eq(1)
                  .html();
              } else {
                duoi = data
                  .find("tr")
                  .eq(i + 1)
                  .find("td")
                  .eq(3)
                  .html();
              }
              duois.push(duoi);
            }

            const resultFinal = {
              ket_qua: [g7, g6, g5, g4, g3, g2, g1, db],
              duois,
              thu_xo,
              tinh_xo,
              maDB,
              ngay_so: date,
              kiem_tra_luc: moment().format("YYYY-MM-DD H:mm:ss"),
              mien: dealer,
            };
            resolve(resultFinal);
          }
        } else {
          reject(undefined);
        }
      }
    )
  );

module.exports = {
  getLotteryResults,
};
