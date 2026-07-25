const REQUIRED_KEYS = ["JWT_SECRET"];

export const validateEnvironment = () => {
  const missing = REQUIRED_KEYS.filter((key) => !process.env[key]);
  if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
    missing.push("MONGODB_URI");
  }
  if (process.env.NODE_ENV === "production" && (process.env.JWT_SECRET || "").length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters in production");
  }
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};

export const hasPaystackConfig = () => Boolean(process.env.PAYSTACK_SECRET_KEY);
