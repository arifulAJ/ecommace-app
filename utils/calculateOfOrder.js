const moment = require("moment");
const Order = require("../models/Order");


 // Function to calculate the tips amount
 const calculateTotalTips = (ordersArray) => {
    return ordersArray.reduce((total, order) => {
        const subTotal = parseFloat(order.subTotal);
        const tipsPercentage = parseFloat(order.tips);
        const tipsAmount = tipsPercentage * subTotal;
        return total + tipsAmount;
    }, 0).toFixed(2); // Round to 2 decimal places
};
const calculateTotalSubTotal = (ordersArray) => {
    return ordersArray.reduce((total, order) => {
        const subTotal = parseFloat(order.subTotal);
        return total + subTotal;
    }, 0);
};

const currentMonthOrders = async (boutiqueId) => {
    // Get the start and end of the current month
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    // Query to find orders for the current month
    const orders = await Order.find({
        boutiqueId: boutiqueId,
        createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth
        }
    });

    return orders;
};
const currentMonthOrdersDriver = async (driverId) => {
    // Get the start and end of the current month
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    // Query to find orders for the current month
    const orders = await Order.find({
        assignedDriver: driverId,
        createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth
        }
    });

    return orders;
};

const calculateTotalShippingFee = (ordersArray) => {
    return ordersArray.reduce((total, order) => {
        const shippingFee = parseFloat(order.shippingFee);
        return total + shippingFee;
    }, 0);
};

module.exports={
    calculateTotalSubTotal,
    currentMonthOrders,
    calculateTotalTips,
    calculateTotalShippingFee,
    currentMonthOrdersDriver
}