const monday = [
  "Thành Phố - Đồng Tháp - Cà Mau",
  "Thành Phố - Cà Mau - Đồng Tháp",
  "Đồng Tháp - Thành Phố - Cà Mau",
  "Đồng Tháp - Cà Mau - Thành Phố",
  "Cà Mau - Thành Phố - Đồng Tháp",
  "Cà Mau - Đồng Tháp - Thành Phố",
];

const tuesday = [
  "Bến Tre - Vũng Tàu - Bạc Liêu",
  "Bến Tre - Bạc Liêu - Vũng Tàu",
  "Vũng Tàu - Bến Tre - Bạc Liêu",
  "Vũng Tàu - Bạc Liêu - Bến Tre",
  "Bạc Liêu - Bến Tre - Vũng Tàu",
  "Bạc Liêu - Vũng Tàu - Bến Tre",
];

const wednesday = [
  "Đồng Nai - Cần Thơ - Sóc Trăng",
  "Đồng Nai - Sóc Trăng - Cần Thơ",
  "Cần Thơ - Đồng Nai - Sóc Trăng",
  "Cần Thơ - Sóc Trăng - Đồng Nai",
  "Sóc Trăng - Đồng Nai - Cần Thơ",
  "Sóc Trăng - Cần Thơ - Đồng Nai",
];

const thursday = [
  "Tây Ninh - An Giang - Bình Thuận",
  "Tây Ninh - Bình Thuận - An Giang",
  "An Giang - Tây Ninh - Bình Thuận",
  "An Giang - Bình Thuận - Tây Ninh",
  "Bình Thuận - Tây Ninh - An Giang",
  "Bình Thuận - An Giang - Tây Ninh",
];

const friday = [
  "Vĩnh Long - Bình Dương - Trà Vinh",
  "Vĩnh Long - Trà Vinh - Bình Dương",
  "Bình Dương - Vĩnh Long - Trà Vinh",
  "Bình Dương - Trà Vinh - Vĩnh Long",
  "Trà Vinh - Vĩnh Long - Bình Dương",
  "Trà Vinh - Bình Dương - Vĩnh Long",
];

const saturday = [
  "Thành Phố - Long An - Bình Phước - Hậu Giang",
  "Thành Phố - Long An - Hậu Giang - Bình Phước",
  "Thành Phố - Bình Phước - Long An - Hậu Giang",
  "Thành Phố - Bình Phước - Hậu Giang - Long An",
  "Thành Phố - Hậu Giang - Long An - Bình Phước",
  "Thành Phố - Hậu Giang - Bình Phước - Long An",
  "Long An - Thành Phố - Bình Phước - Hậu Giang",
  "Long An - Thành Phố - Hậu Giang - Bình Phước",
  "Long An - Bình Phước - Thành Phố - Hậu Giang",
  "Long An - Bình Phước - Hậu Giang - Thành Phố",
  "Long An - Hậu Giang - Thành Phố - Bình Phước",
  "Long An - Hậu Giang - Bình Phước - Thành Phố",
  "Bình Phước - Thành Phố - Long An - Hậu Giang",
  "Bình Phước - Thành Phố - Hậu Giang - Long An",
  "Bình Phước - Long An - Thành Phố - Hậu Giang",
  "Bình Phước - Long An - Hậu Giang - Thành Phố",
  "Bình Phước - Hậu Giang - Thành Phố - Long An",
  "Bình Phước - Hậu Giang - Long An - Thành Phố",
  "Hậu Giang - Thành Phố - Long An - Bình Phước",
  "Hậu Giang - Thành Phố - Bình Phước - Long An",
  "Hậu Giang - Long An - Thành Phố - Bình Phước",
  "Hậu Giang - Long An - Bình Phước - Thành Phố",
  "Hậu Giang - Bình Phước - Thành Phố - Long An",
  "Hậu Giang - Bình Phước - Long An - Thành Phố",
];

const sunday = [
  "Tiền Giang - Kiên Giang - Đà Lạt",
  "Tiền Giang - Đà Lạt - Kiên Giang",
  "Kiên Giang - Tiền Giang - Đà Lạt",
  "Kiên Giang - Đà Lạt - Tiền Giang",
  "Đà Lạt - Tiền Giang - Kiên Giang",
  "Đà Lạt - Kiên Giang - Tiền Giang",
];

const dealerUnsingedMap = {
  "Đồng Tháp": "dong thap",
  "Cà Mau": "ca mau",
  "Bến Tre ": "ben tre",
  "Vũng Tàu": "vung tau",
  "Bạc Liêu": "bac lieu",
  "Đồng Nai": "dong nai",
  "Cần Thơ": "can tho",
  "Sóc Trăng": "soc trang",
  "Tây Ninh": "tay ninh",
  "An Giang": "an giang",
  "Bình Thuận": "binh thuan",
  "Vĩnh Long": "vinh long",
  "Bình Dương": "binh duong",
  "Trà Vinh": "tra vinh",
  "Long An": "long an",
  "Bình Phước": "binh phuoc",
  "Hậu Giang": "hau giang",
  "TP.HCM": "ho chi minh",
  "Tiền Giang": "tien giang",
  "Kiên Giang": "kien giang",
  "Đà Lạt": "da lat",
};
module.exports = {
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday,
  dealerUnsingedMap,
};
