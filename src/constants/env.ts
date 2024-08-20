const IS_LOCAL = process.env.NODE_ENV === "development";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export { IS_LOCAL, IS_PRODUCTION };
