/*eslint-disable */
module.exports = {
  "rules": {
    "indent": ["error", 2, {"SwitchCase": 1 }],
    "quotes": [ "error", "single"],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-extra-semi": "warn",            // disallow unnecessary semicolons
    "no-inner-declarations": "error",    // disallow function or variable declarations in nested blocks
  },
  "extends": [
    "eslint:recommended"
  ],
  "globals": {
    "_": false,
    "global": false
  }
};
/*eslint-enable */
