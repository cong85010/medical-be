const { Medicine } = require("../../models/Medicine.model");
const { Order } = require("../../models/Order.model");
const { response } = require("../../utils/response");
const { StatusCodes } = require("http-status-codes");
const {
  updateMedicalRecord,
} = require("../medicalRecord/medicalRecord.controller");
const { STATUS_BOOKING, STATUS_MEDICAL } = require("../../utils/constants");
const MedicalRecord = require("../../models/MedicalRecord.model");

// Create a new order
async function createOrder(req, res) {
  try {
    //Validate order
    const orderData = req.body;
    const { medicines } = orderData;
    if (!medicines || medicines.length === 0) {
      throw new Error("Không có thuốc trong đơn hàng");
    }

    // descrease medicine quantity
    for (let i = 0; i < medicines.length; i++) {
      const medicineId = medicines[i]._id;
      const quantity = medicines[i].quantity;
      const medicine = await Medicine.findById(medicineId);
      if (medicine.quantity < quantity) {
        return response(
          res,
          StatusCodes.BAD_REQUEST,
          true,
          { order: null },
          `Thuốc: "${medicine.name}" không đủ số lượng | Số lượng còn lại: ${medicine.quantity}`
        );
      }
      await Medicine.findByIdAndUpdate(
        medicineId,
        { quantity: medicine.quantity - quantity },
        { new: true }
      );
    }

    const orderNumber = `DH-${Date.now()}`;
    orderData.orderNumber = orderNumber;
    // Create a new order
    const order = new Order(orderData);

    // Save the order to the database
    const savedOrder = await order.save();
    await MedicalRecord.findByIdAndUpdate(
      orderData.medicalRecordId,
      { status: STATUS_MEDICAL.medicined },
      { new: true }
    );

    return response(res, StatusCodes.OK, true, { order: savedOrder }, null);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    // Handle any errors
    return response(res, StatusCodes.BAD_REQUEST, true, { order: null }, "Lỗi tạo đơn hàng");
  }
}

// Read order by ID
async function getOrderById(req, res) {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("medicines");
    return response(res, StatusCodes.OK, true, { order: order }, null);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return response(res, StatusCodes.BAD_REQUEST, true, { order: null }, null);
  }
}

// Read order by Medical Record ID
async function getOrderByMedicalRecordId(req, res) {
  try {
    const { medicalRecordId } = req.params;
    const order = await Order.findOne({ medicalRecordId })
      .populate("medicines")
      .populate({
        path: "salesId",
        model: "user",
        select: "_id fullName phone",
      })
      .populate({
        path: "medicalRecordId",
        model: "medicalRecord",
        select: "_id patientId doctorId",
      })
      .populate({
        path: "medicalRecordId",
        model: "medicalRecord",
        populate: {
          path: "patientId",
          model: "user",
          select: "_id fullName phone",
        },
      })
      .populate({
        path: "patientId",
        model: "user",
      })
      .populate({
        path: "medicalRecordId",
        model: "medicalRecord",
        populate: {
          path: "doctorId",
          model: "user",
          select: "_id fullName specialty",
        },
      });

    return response(res, StatusCodes.OK, true, { order: order }, null);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return response(res, StatusCodes.BAD_REQUEST, true, { order: null }, null);
  }
}

async function getOrderByPatientId(req, res) {
  try {
    const { patientId } = req.params;
    const orders = await Order.find({ patientId })
      .sort({ createdAt: -1 })
      .populate("medicines")
      .populate({
        path: "salesId",
        model: "user",
        select: "_id fullName phone",
      })
      .populate({
        path: "patientId",
        model: "user",
      })
      .populate({
        path: "medicalRecordId",
        model: "medicalRecord",
        select: "_id patientId doctorId",
      })
      .populate({
        path: "medicalRecordId",
        model: "medicalRecord",
        populate: {
          path: "patientId",
          model: "user",
          select: "_id fullName phone",
        },
      })

      .populate({
        path: "medicalRecordId",
        model: "medicalRecord",
        populate: {
          path: "doctorId",
          model: "user",
          select: "_id fullName specialty",
        },
      });

    return response(res, StatusCodes.OK, true, { orders }, null);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return response(res, StatusCodes.BAD_REQUEST, true, { orders: [] }, null);
  }
}

// Update order by ID
async function updateOrder(req, res) {
  try {
    const { orderId } = req.params;
    const updateData = req.body;

    const order = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
    });
    return response(res, StatusCodes.OK, true, { order: order }, null);
  } catch (error) {
    console.error("Error updating order:", error);
    return response(res, StatusCodes.BAD_REQUEST, true, { order: null }, null);
  }
}

// Delete order by ID
async function deleteOrder(req, res) {
  try {
    const { orderId } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    return response(res, StatusCodes.OK, true, { order: deletedOrder }, null);
  } catch (error) {
    console.error("Error deleting order:", error);
    return response(res, StatusCodes.BAD_REQUEST, true, { order: null }, null);
  }
}

// Get all orders
async function getAllOrders(req, res) {
  try {
    const query = req.query;
    const orderNumber = query.orderNumber;
    const limit = query.limit || 10;
    const page = query.page || 1;

    const total = await Order.count(orderNumber ? { orderNumber } : {});

    const orders = await Order.find(orderNumber ? { orderNumber } : {})
      .sort({ createdAt: -1 })
      .populate("medicines")
      .populate({
        path: "salesId",
        model: "user",
        select: "_id fullName phone",
      })
      .populate({
        path: "patientId",
        model: "user",
      })
      .populate({
        path: "medicalRecordId",
        model: "medicalRecord",
        select: "_id patientId doctorId",
      })
      .populate({
        path: "medicalRecordId",
        model: "medicalRecord",
        populate: {
          path: "patientId",
          model: "user",
          select: "_id fullName phone",
        },
      })
      .populate({
        path: "medicalRecordId",
        model: "medicalRecord",
        populate: {
          path: "doctorId",
          model: "user",
          select: "_id fullName specialty",
        },
      })
      .limit(limit)
      .skip((page - 1) * limit);

    return response(res, StatusCodes.OK, true, { orders, total }, null);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      true,
      { order: null, total: 0 },
      null
    );
  }
}

// Export the controller functions
module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrderByMedicalRecordId,
  getOrderByPatientId,
};
