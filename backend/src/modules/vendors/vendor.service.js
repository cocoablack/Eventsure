import Vendor from "../../models/Vendor.js";
import SpotlightPlacement from "../../models/SpotlightPlacement.js";

export const getVendors = async (filters = {}) => {
  const query = {
    isActive: true,
    isVerified: true,
  };

  if (filters.search) {
    query.$or = [
      { businessName: { $regex: filters.search, $options: "i" } },
      { username: { $regex: filters.search, $options: "i" } },
      { category: { $regex: filters.search, $options: "i" } },
      { services: { $regex: filters.search, $options: "i" } },
    ];
  }

  if (filters.serviceType) {
    query.category = { $regex: filters.serviceType, $options: "i" };
  }

  if (filters.location) {
    query.location = { $regex: filters.location, $options: "i" };
  }

  const vendors = await Vendor.find(query)
    .select("-email -phone -address")
    .sort({ isSpotlight: -1, rating: -1, createdAt: -1 })
    .populate("owner", "fullName");

  return vendors;
};

export const getSpotlightVendors = async () => {
  const placements = await SpotlightPlacement.find({
    status: "active",
    startsAt: { $lte: new Date() },
    expiresAt: { $gt: new Date() },
  }).sort({ startsAt: -1 }).limit(6).select("vendor");
  return Vendor.find({ _id: { $in: placements.map((item) => item.vendor) }, isActive: true, isVerified: true })
    .select("-email -phone -address")
    .sort({ rating: -1, createdAt: -1 });
};

export const getVendorById = async (vendorId) => {
  return Vendor.findOne({ _id: vendorId, isActive: true, isVerified: true })
    .select("-email -phone -address")
    .populate("owner", "fullName");
};
