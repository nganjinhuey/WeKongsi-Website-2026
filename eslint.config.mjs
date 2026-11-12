// eslint-config-next ships flat configs directly, so no FlatCompat shim is needed.
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const config = [
  {
    // The design-reference projects live inside this directory, have their own
    // toolchains, and are not ours to lint.
    ignores: [
      "INFII Website Reference/**",
      "EASY Landing Page/**",
      ".next/**",
      "node_modules/**",
      "scratch/**",
      "next-env.d.ts",
    ],
  },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];

export default config;
