/* eslint-disable */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: "latest", // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "@nuxtjs/eslint-config-typescript",
    "plugin:vue/vue3-recommended",
    "prettier", // This has to be last so it will resolve the eslint/prettier battle.
  ],
  plugins: ["prettier", "vue", "@typescript-eslint"], // Need prettier listed as a plugin
  rules: {
    // Code rules (not formatting)
    "no-unused-vars": "off",
    "func-call-spacing": "off",
    "vue/no-v-for-template-key": ["off"],
    "vue/no-unused-vars": "off",
    "vue/no-multiple-template-root": "off",
    "vue/attribute-hyphenation": 0,
    "vue/multi-word-component-names": ["off"],
    "@typescript-eslint/no-explicit-any": ["off"],
    "@typescript-eslint/no-unused-vars": ["off"],
    // Temp turning off rule while spin up dev work is heavy
    "no-console": "off",
    // Formatting
    "prettier/prettier": 2, // This will look at the rules in the .prettierrc file and throw as an error.
  },
}
