module.exports = {
  root: true,
  // extends: ["standard"],
  extends: "eslint:recommended",

  rules: {
    // curly: "error",
    semi: ["error", "ignore"],
    quotes: ["error", "ignore"],
    "comma-dangle": ["error", "ignore"],
    "no-unused-vars": "warn",
  },

  globals: {
    IS_DEVELOPMENT: "readonly",
  },
  parserOptions: {
    ecmasVersion: 2020,
  },
};
