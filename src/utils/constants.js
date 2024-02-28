const dayjs = require("dayjs");

const MAX_HOUR_DAY = 16;

const generateTimeSlots = (date) => {
  const timeSlots = [];
  const currentHour = dayjs().hour();
  const currentMinute = dayjs().minute();

  for (let hour = 8; hour <= MAX_HOUR_DAY; hour++) {
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

module.exports = { generateTimeSlots, TYPE_EMPLOYEE, TYPE_EMPLOYEE_STR };
