const dayjs = require("dayjs");

const MIN_HOUR_DAY = 8;
const MAX_HOUR_DAY = 16;

const generateTimeSlots = (date) => {
  const timeSlots = [];

  const currentTime = dayjs().add(30, "minute");
  const currentHour = currentTime.hour();
  const currentMinute = currentTime.minute();
  // add 30 minutes to current time

  for (let hour = MIN_HOUR_DAY; hour <= MAX_HOUR_DAY; hour++) {
    if (hour === 12) continue;

    if (dayjs().format("DD/MM/YYYY") === date) {
      if (hour < currentHour) continue;
      if (hour === currentHour) {
        if (currentMinute > 30) {
          continue;
        } else {
          timeSlots.push(`${hour.toString().padStart(2, "0")}:30`);
          continue;
        }
      }
    }

    timeSlots.push(`${hour.toString().padStart(2, "0")}:00`);
    timeSlots.push(`${hour.toString().padStart(2, "0")}:30`);
  }
  return timeSlots;
};

const TYPE_EMPLOYEE = {
  admin: "admin",
  user: "user",
  doctor: "doctor",
  administrative: "administrative",
  sales: "sales",
};

const TYPE_EMPLOYEE_STR = {
  admin: "Quản lý",
  user: "Người dùng",
  doctor: "Bác sĩ",
  administrative: "Nhân viên hành chánh",
  sales: "Nhân viên bán hàng",
};

const STATUS_BOOKING = {
  medicined: "medicined",
  finished: "finished",
  booked: "booked",
  waiting: "waiting",
  examining: "examining",
  rejected: "rejected",
  cancelled: "cancelled",
};

const STATUS_BOOKING_STR = {
  medicined: "Đã kê toa",
  finished: "Đã khám",
  booked: "Đã đặt",
  waiting: "Chờ khám",
  examining: "Đang khám",
  rejected: "Từ chối",
  cancelled: "Đã hủy",
};

const STATUS_MEDICAL = {
  examined: "examined",
  medicined: "medicined",
};

const FORMAT_DATE_TIME = "DD/MM/YYYY HH:mm";

const TIME_CAN_EDIT = 2;
const TIME_PHYSICAL_EXAM = 30;
const FORMAT_DATE_MONGO_ISO = "YYYY-MM-DDTHH:mm:ssZ";

const FORMAT_DATE = "DD/MM/YYYY";
const FORMAT_TIME = "HH:mm";

const getToday = () => {
  return dayjs().format(FORMAT_DATE);
};

const formatedDate = (date, format = null) => {
  return dayjs(date, format || FORMAT_DATE).format(format || FORMAT_DATE);
};

const formatedTime = (date) => {
  return dayjs(date, FORMAT_TIME).format(FORMAT_TIME);
};

const formatedDateTimeISO = (date, format = null) => {
  return dayjs(date, format || FORMAT_DATE).toISOString();
};

const removeEmpty = (obj) => {
  let newObj = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] === Object(obj[key])) newObj[key] = removeEmpty(obj[key]);
    else if (obj[key]) newObj[key] = obj[key];
  });
  return newObj;
};

function queryStringToObject(queryString) {
  var params = new URLSearchParams(queryString);
  var result = {};

  params.forEach(function (value, key) {
    result[key] = !isNaN(value) ? parseFloat(value) : value;
  });

  return result;
}

function queryStringToArrayObjects(queryString) {
  var params = new URLSearchParams(queryString);
  var result = [];

  params.forEach(function (value, key) {
    var obj = {};
    obj[key] = !isNaN(value) ? parseFloat(value) : value;
    result.push(obj);
  });

  return result;
}

module.exports = {
  generateTimeSlots,
  getToday,
  formatedDate,
  formatedTime,
  TIME_CAN_EDIT,
  TIME_PHYSICAL_EXAM,
  TYPE_EMPLOYEE,
  TYPE_EMPLOYEE_STR,
  STATUS_BOOKING,
  STATUS_MEDICAL,
  STATUS_BOOKING_STR,
  FORMAT_TIME,
  FORMAT_DATE_TIME,
  removeEmpty,
  FORMAT_DATE,
  formatedDateTimeISO,
  queryStringToObject,
  queryStringToArrayObjects,
};
