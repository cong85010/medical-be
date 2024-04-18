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
      throw new Error("Order must have at least one medicine");
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
    return response(res, StatusCodes.BAD_REQUEST, true, { order: null }, null);
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
      });

    return response(res, StatusCodes.OK, true, { order: order }, null);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return response(res, StatusCodes.BAD_REQUEST, true, { order: null }, null);
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
async function getAllOrders() {
  try {
    const orders = await Order.find().populate("medicines");
    return response(res, StatusCodes.OK, true, { orders: orders }, null);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return response(res, StatusCodes.BAD_REQUEST, true, { order: null }, null);
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
};
