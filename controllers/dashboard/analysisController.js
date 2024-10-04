const Response = require("../../helpers/response");
const Order = require("../../models/Order");
const Review = require("../../models/Reviews");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

const getTotalOfTheDashboared = async (req, res) => {
  try {
    // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith("Bearer ")) {
      // Extract the token without the 'Bearer ' prefix
      token = tokenWithBearer.slice(7);
    }

    if (!token) {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "Token is missing.",
            status: "failed",
          })
        );
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded.role === "admin") {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "you are not admin.",
            status: "faield",
          })
        );
    }

    const adminErand=await User.findById(decoded._id)



    const allTheBoutique = await User.find({
      role: "boutique",isBlocked:false
    }).countDocuments();
    const allTheDriver = await User.find({ role: "driver" }).countDocuments();
    const compliteOrder = await Order.find({
      status: "delivered",
    }).countDocuments();
    const totalData = {
      adminMoney:adminErand?.earnedMoney,
      allTheBoutique: allTheBoutique,
      allTheDriver: allTheDriver,
      compliteOrder: compliteOrder,
    };

    res
      .status(200)
      .json(
        Response({
          statusCode: 200,
          status: "ok",
          message: "Product created successfully",
          data: { totalData },
        })
      );
  } catch (error) {
    console.log(error,"--------------");
    return res
      .status(500)
      .json(
        Response({
          statusCode: 500,
          message: error.message,
          status: "server error",
        })
      );
  }
};

// const totalRevinew=async(req,res)=>{
//     try {
//         const {year}=req.query
//         // Get the token from the request headers
//         const tokenWithBearer = req.headers.authorization;
//         let token;

//         if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//             // Extract the token without the 'Bearer ' prefix
//             token = tokenWithBearer.slice(7);
//         }

//         if (!token) {
//             return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
//         }

//         // Verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//         if(!decoded.role==="admin"){
//            return res.status(401).json(Response({ statusCode: 401, message: 'you are not admin.',status:'faield' }));
//           }
//         //   const revinew=await Order.find({status:"delivered"})
//         const pipeline = [
//             { $match: { status: 'delivered', createdAt: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year + 1}-01-01`) } } },
//             { $group: { _id: null, grandTotal: { $sum: "$totalAmount" } } }
//         ];

//         const result = await Order.aggregate(pipeline);
//         res.status(200).json(Response({ statusCode: 200, status: "ok", message: "Product created successfully",data:result }));

//     } catch (error) {
//         return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));

//     }
// }
const totalRevinew = async (req, res) => {
  try {
    const { year } = req.query;

    // Ensure the year parameter is provided and valid
    if (!year || isNaN(year)) {
      return res
        .status(400)
        .json(
          Response({
            statusCode: 400,
            message: "Invalid year provided.",
            status: "failed",
          })
        );
    }

    // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith("Bearer ")) {
      // Extract the token without the 'Bearer ' prefix
      token = tokenWithBearer.slice(7);
    }

    if (!token) {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "Token is missing.",
            status: "failed",
          })
        );
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded.role !== "admin") {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "You are not authorized as admin.",
            status: "failed",
          })
        );
    }
   
   
    // Get the start and end date for the specified year
    const startDate = new Date(`${year}-01-01T00:00:00Z`);
    const endDate = new Date(`${parseInt(year) + 1}-01-01T00:00:00Z`);

    // Ensure the dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res
        .status(400)
        .json(
          Response({
            statusCode: 400,
            message: "Invalid date range.",
            status: "failed",
          })
        );
    }

    // Fetch orders for the specified year
    const orders = await Order.find({
      status: "delivered",
      createdAt: { $gte: startDate, $lt: endDate },
    });

    // Calculate total revenue and monthly breakdown
    let totalRevenue = 0;
    const monthlyRevenue = Array(12).fill(0); // Array to store revenue for each month

    orders.forEach((order) => {
      const amount = parseFloat(order.totalAmount);
      if (!isNaN(amount)) {
        totalRevenue += amount;

        const month = order.createdAt.getMonth(); // 0-based month index
        monthlyRevenue[month] += amount;
      }
    });

    // Month names array
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Create a response object with total revenue and monthly breakdown
    const response = {
      
      totalRevenue: totalRevenue.toFixed(2),
      monthlyRevenue: monthlyRevenue.map((revenue, index) => ({
        month: monthNames[index],
        revenue: revenue.toFixed(2),
      })),
    };

    return res.status(200).json(
      Response({
        statusCode: 200,
        status: "ok",
        message: "Revenue data fetched successfully",
        data: response,
      })
    );
  } catch (error) {
    return res
      .status(500)
      .json(
        Response({
          statusCode: 500,
          message: error.message,
          status: "server error",
        })
      );
  }
};

const feedbackRatio = async (req, res) => {
  try {
    const { year } = req.query;

    if (!year || isNaN(parseInt(year))) {
      return res
        .status(400)
        .json(
          Response({
            statusCode: 400,
            message: "A valid year is required.",
            status: "failed",
          })
        );
    }

    // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith("Bearer ")) {
      // Extract the token without the 'Bearer ' prefix
      token = tokenWithBearer.slice(7);
    }

    if (!token) {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "Token is missing.",
            status: "failed",
          })
        );
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded || decoded.role !== "admin") {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "You are not authorized as admin.",
            status: "failed",
          })
        );
    }

    // Define start and end of the year
    const startDate = new Date(`${year}-01-01T00:00:00Z`);
    const endDate = new Date(`${parseInt(year) + 1}-01-01T00:00:00Z`); // The start of the next year
    endDate.setMilliseconds(endDate.getMilliseconds() - 1); // End of the year

    // Fetch reviews for the specified year
    const reviews = await Review.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Calculate review ratio
    const totalReviews = reviews.length;
    let positiveReviews = 0;

    reviews.forEach((review) => {
      // Convert rating to number for comparison
      const rating = parseInt(review.rating, 10);
      if (rating >= 4) {
        positiveReviews++;
      }
    });

    const ratio = totalReviews > 0 ? (positiveReviews / totalReviews) * 100 : 0; // Convert to percentage

    return res.status(200).json(
      Response({
        statusCode: 200,
        message: "Review ratio calculated successfully.",
        data: {
          year,
          totalReviews,
          positiveReviews,
          ratio: parseInt(ratio), // Rounded to 2 decimal places
        },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .json(
        Response({
          statusCode: 500,
          message: error.message,
          status: "server error",
        })
      );
  }
};

const todayorderDetailsinDashboared = async (req, res) => {
  try {
    // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith("Bearer ")) {
      // Extract the token without the 'Bearer ' prefix
      token = tokenWithBearer.slice(7);
    }

    if (!token) {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "Token is missing.",
            status: "failed",
          })
        );
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded || decoded.role !== "admin") {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "You are not authorized as admin.",
            status: "failed",
          })
        );
    }

    // Get today's and yesterday's dates in UTC timezone
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split("T")[0];

    // Find orders created today
    const todayOrders = await Order.find({
      createdAt: {
        $gte: new Date(today + "T00:00:00Z"), // Start of today
        $lte: new Date(today + "T23:59:59Z"), // End of today
      },
    });

    // Find orders created yesterday
    const yesterdayOrders = await Order.find({
      createdAt: {
        $gte: new Date(yesterdayDate + "T00:00:00Z"), // Start of yesterday
        $lte: new Date(yesterdayDate + "T23:59:59Z"), // End of yesterday
      },
    });

    // Calculate the percentage change
    const todayCount = todayOrders.length;
    const yesterdayCount = yesterdayOrders.length;
    let percentageChange = 0;
    let changeType = "No Change";

    if (yesterdayCount > 0) {
      percentageChange = ((todayCount - yesterdayCount) / yesterdayCount) * 100;
      changeType = percentageChange >= 0 ? "Positive" : "Negative";
    } else if (todayCount > 0) {
      percentageChange = 100; // If there were no orders yesterday and there are orders today
      changeType = "Positive";
    }

    // Round percentageChange to 2 decimal places
    percentageChange = parseFloat(percentageChange.toFixed(2));

    const data = {
      todayOrderCount: todayCount,
      yesterdayOrderCount: yesterdayCount,
      percentageChange: percentageChange, // Rounded to 2 decimal places
      changeType: changeType, // Indicates if the change is positive or negative
    };
    return res.status(200).json(
      Response({
        statusCode: 200,
        message: "Today's orders fetched successfully.",
        data: data,
      })
    );
  } catch (error) {
    return res
      .status(500)
      .json(
        Response({
          statusCode: 500,
          message: error.message,
          status: "server error",
        })
      );
  }
};

// const sevenDaysOrderDetailsinDashboared = async (req, res) => {
//   try {
//     // Get the token from the request headers
//     const tokenWithBearer = req.headers.authorization;
//     let token;

//     if (tokenWithBearer && tokenWithBearer.startsWith("Bearer ")) {
//       // Extract the token without the 'Bearer ' prefix
//       token = tokenWithBearer.slice(7);
//     }

//     if (!token) {
//       return res
//         .status(401)
//         .json(
//           Response({
//             statusCode: 401,
//             message: "Token is missing.",
//             status: "failed",
//           })
//         );
//     }

//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     if (!decoded || decoded.role !== "admin") {
//       return res
//         .status(401)
//         .json(
//           Response({
//             statusCode: 401,
//             message: "You are not authorized as admin.",
//             status: "failed",
//           })
//         );
//     }

//     // Calculate the date range for the past 7 days
//     const today = new Date();
//     const oneWeekAgo = new Date(today);
//     oneWeekAgo.setDate(today.getDate() - 7);

//     // Find orders from the past week
//     const orders = await Order.find({
//       createdAt: {
//         $gte: oneWeekAgo,
//         $lte: today,
//       },
//     });

//     // Initialize data structure for the last 7 days
//     const dailyData = {};

//     // Loop through each day in the last 7 days
//     for (let i = 6; i >= 0; i--) {
//       const date = new Date(today);
//       date.setDate(today.getDate() - i);
//       const dateString = date.toISOString().split('T')[0];
//       dailyData[dateString] = { orderCount: 0, percentageChange: 0, changeType: "No Change" };
//     }

//     // Calculate the order count for each day
//     orders.forEach(order => {
//       const date = order.createdAt.toISOString().split('T')[0]; // Get date in YYYY-MM-DD format
//       if (dailyData[date]) {
//         dailyData[date].orderCount += 1;
//       }
//     });

//     // Calculate percentage changes day-over-day
//     const dates = Object.keys(dailyData);
//     for (let i = 1; i < dates.length; i++) {
//       const currentDay = dates[i];
//       const previousDay = dates[i - 1];
//       const currentCount = dailyData[currentDay].orderCount;
//       const previousCount = dailyData[previousDay].orderCount;

//       if (previousCount > 0) {
//         const percentageChange = ((currentCount - previousCount) / previousCount) * 100;
//         dailyData[currentDay].percentageChange = parseFloat(percentageChange.toFixed(2));
//         dailyData[currentDay].changeType = percentageChange >= 0 ? "Positive" : "Negative";
//       } else if (currentCount > 0) {
//         dailyData[currentDay].percentageChange = 100;
//         dailyData[currentDay].changeType = "Positive";
//       }
//     }

//     // Format the result for response
//     const responseData = dates.map(date => ({
//       date,
//       orderCount: dailyData[date].orderCount,
//       percentageChange: dailyData[date].percentageChange,
//       changeType: dailyData[date].changeType,
//     }));

//     return res.status(200).json(
//       Response({
//         statusCode: 200,
//         message: "Order details for the last week fetched successfully.",
//         data: responseData,
//       })
//     );
//   } catch (error) {
//     return res
//       .status(500)
//       .json(
//         Response({
//           statusCode: 500,
//           message: error.message,
//           status: "server error",
//         })
//       );
//   }
// };

const sevenDaysOrderDetailsinDashboared = async (req, res) => {
  try {
    // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith("Bearer ")) {
      // Extract the token without the 'Bearer ' prefix
      token = tokenWithBearer.slice(7);
    }

    if (!token) {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "Token is missing.",
            status: "failed",
          })
        );
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded || decoded.role !== "admin") {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "You are not authorized as admin.",
            status: "failed",
          })
        );
    }

    // Calculate the date range for the past 7 days
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    // Find orders from the past week
    const lastWeekOrders = await Order.find({
      createdAt: {
        $gte: oneWeekAgo,
        $lte: today,
      },
    });

    // Calculate the total order count for the last 7 days
    const lastWeekOrderCount = lastWeekOrders.length;

    // Calculate the order count for the previous 7 days
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(today.getDate() - 14);

    const previousWeekOrders = await Order.find({
      createdAt: {
        $gte: twoWeeksAgo,
        $lte: oneWeekAgo,
      },
    });

    const previousWeekOrderCount = previousWeekOrders.length;

    // Calculate the percentage change
    let percentageChange = 0;
    let changeType = "No Change";

    if (previousWeekOrderCount > 0) {
      percentageChange = ((lastWeekOrderCount - previousWeekOrderCount) / previousWeekOrderCount) * 100;
      changeType = percentageChange >= 0 ? "Positive" : "Negative";
    } else if (lastWeekOrderCount > 0) {
      percentageChange = 100; // If there were no orders the previous week and there are orders this week
      changeType = "Positive";
    }

    // Round percentageChange to 2 decimal places
    percentageChange = parseFloat(percentageChange.toFixed(2));

    const data = {
      lastWeekOrderCount: lastWeekOrderCount,
      previousWeekOrderCount: previousWeekOrderCount,
      percentageChange: percentageChange, // Rounded to 2 decimal places
      changeType: changeType, // Indicates if the change is positive or negative
    };

    return res.status(200).json(
      Response({
        statusCode: 200,
        message: "Order details for the last week fetched successfully.",
        data: data,
      })
    );
  } catch (error) {
    return res
      .status(500)
      .json(
        Response({
          statusCode: 500,
          message: error.message,
          status: "server error",
        })
      );
  }
};

const totalCostAndSell = async (req, res) => {
  try {
    // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith("Bearer ")) {
      // Extract the token without the 'Bearer ' prefix
      token = tokenWithBearer.slice(7);
    }

    if (!token) {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "Token is missing.",
            status: "failed",
          })
        );
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded || decoded.role !== "admin") {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "You are not authorized as admin.",
            status: "failed",
          })
        );
    }

    // Calculate the date range for the past 7 days
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    // Find orders from the past week
    const orders = await Order.find({
      createdAt: {
        $gte: oneWeekAgo,
        $lte: today,
      },
      status: "delivered",
    });

    // Initialize data structure with all days of the week
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyData = {};

    // Initialize each day with zero values
    daysOfWeek.forEach(day => {
      dailyData[day] = { sales: 0, costs: 0, additional: 0 };
    });

    // Process orders to calculate daily totals
    orders.forEach(order => {
      const day = order.createdAt.toLocaleString('default', { weekday: 'short' }); // Get day name

      dailyData[day].sales += parseFloat(order.totalAmount);
      dailyData[day].costs += parseFloat(order.costs || 0);  // Assuming you have costs in your orders
      dailyData[day].additional += parseFloat(order.additional || 0); // Assuming you have additional data
    });

    // Format the result for response
    const responseData = daysOfWeek.map(day => ({
      day,
      sales: dailyData[day].sales.toFixed(2),
      costs: dailyData[day].costs.toFixed(2),
      additional: dailyData[day].additional.toFixed(2),
    }));

    return res.status(200).json(
      Response({
        statusCode: 200,
        message: "Total cost and sell data for the past week fetched successfully.",
        data: responseData,
      })
    );
  } catch (error) {
    return res
      .status(500)
      .json(
        Response({
          statusCode: 500,
          message: error.message,
          status: "server error",
        })
      );
  }
};




module.exports = {
  getTotalOfTheDashboared,
  totalRevinew,
  feedbackRatio,
  todayorderDetailsinDashboared,
  totalCostAndSell,
  sevenDaysOrderDetailsinDashboared
};
