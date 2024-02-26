module.exports = {
  root: true,
  extends: ["standard"],

  rules: {
    // curly: "error",
    semi: ["error", "ignore"],
    quotes: ["error", "ignore"],
    "comma-dangle": ["error", "ignore"],
  },

  globals: {
    IS_DEVELOPMENT: "readonly",
  },
  parserOptions: {
    ecmasVersion: 2020,
  },
};
