const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response");

const { Order } = require("../../models/Order.model");
const { User } = require("../../models/User.model");

const {
  removeEmpty,
  formatedDateTimeISO,
  FORMAT_DATE,
} = require("../../utils/constants");
const dayjs = require("dayjs");

// READ
const getStatistic = async (req, res) => {
  try {
    // date default to day
    const { startDate, endDate } = req.body;
    // get total order by date
    const statistic = {
      totalOrder: 0,
      totalRevenue: 0,
      totalPatient: 0,
    };

    const totalOrder = await Order.count({
      createdAt: {
        $gte: dayjs(startDate).startOf("day").toDate(),
        $lte: dayjs(endDate).endOf("day").toDate(),
      },
    });

    const totalRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: dayjs(startDate).startOf("day").toDate(),
            $lte: dayjs(endDate).endOf("day").toDate(),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalPatient = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: dayjs(startDate).startOf("day").toDate(),
            $lte: dayjs(endDate).endOf("day").toDate(),
          },
          userType: "user",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);

    // Chart data in year 1-> month current
    const chartData = [];
    for (let i = 1; i <= dayjs().month() + 1; i++) {
      const totalRevenue = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: dayjs()
                .startOf("year")
                .month(i - 1)
                .toDate(),
              $lte: dayjs()
                .endOf("year")
                .month(i - 1)
                .toDate(),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPrice" },
          },
        },
      ]);

      chartData.push({
        month: `Tháng ${i}`,
        value: totalRevenue[0]?.total || 0,
      });
    }

    // Chart day of month, from 1-> today
    const chartDataMonth = [];
    for (let i = 1; i <= dayjs().date(); i++) {
      const totalRevenue = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: dayjs().startOf("month").date(i).toDate(),
              $lte: dayjs().endOf("month").date(i).toDate(),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPrice" },
          },
        },
      ]);

      chartDataMonth.push({
        day: `Ngày ${i}`,
        value: totalRevenue[0]?.total || 0,
      });
    }

    // list top medicine by date and select name and total

    const listTopMedicine = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: dayjs(startDate).startOf("day").toDate(),
            $lte: dayjs(endDate).endOf("day").toDate(),
          },
        },
      },
      {
        $unwind: "$medicines",
      },
      {
        $group: {
          _id: "$medicines.name",
          price: { $first: "$medicines.price" },
          total: { $sum: "$medicines.quantity" },
        },
      },
      {
        $sort: { total: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          price: "$price",
          total: 1,
        },
      },
    ]);

    statistic.listTopMedicine = listTopMedicine;

    statistic.chartYear = chartData;
    statistic.chartMonth = chartDataMonth;

    statistic.totalOrder = totalOrder;
    statistic.totalRevenue = totalRevenue[0]?.total || 0;
    statistic.totalPatient = totalPatient[0]?.total || 0;

    return response(res, StatusCodes.OK, true, { statistic }, null);
  } catch (error) {
    console.error("Error getting meetings:", error);
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      true,
      { statistic: {} },
      null
    );
  }
};

module.exports = {
  getStatistic,
};
