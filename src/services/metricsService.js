import Booking from "../models/Booking.js";
import Trip from "../models/Trip.js";
import Payment from "../models/Payment.js";

export const getKPIs = async () => {
  const [totalBookings, confirmedBookings, totalRevenueAgg, topTrips] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ status: "CONFIRMED" }),
    Payment.aggregate([{ $match: { status: "SUCCESS" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    Booking.aggregate([
      { $match: { status: "CONFIRMED" } },
      { $group: { _id: "$trip", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: "trips", localField: "_id", foreignField: "_id", as: "trip" } },
      { $unwind: "$trip" },
      { $project: { _id: 0, tripId: "$trip._id", title: "$trip.title", count: 1 } }
    ])
  ]);

  const totalRevenue = totalRevenueAgg[0]?.total || 0;
  return { totalBookings, confirmedBookings, totalRevenue, topTrips };
};
