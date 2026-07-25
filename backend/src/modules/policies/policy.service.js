import Policy from "../../models/Policy.js";

export const getPolicies = async () => {
  return await Policy.find().sort({ createdAt: -1 });
};

export const getPolicyBySlug = async (slug) => {
  return await Policy.findOne({
    slug,
    isPublished: true,
  });
};

export const createPolicy = async (payload) => {
  return await Policy.create(payload);
};

export const updatePolicy = async (id, payload) => {
  return await Policy.findByIdAndUpdate(id, payload, {
    new: true,
  });
};

export const deletePolicy = async (id) => {
  return await Policy.findByIdAndDelete(id);
};