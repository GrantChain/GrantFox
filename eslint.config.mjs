import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**/*",
      "src/generated/**/*",
      "**/*.generated.*",
      "**/*.wasm.*",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "react/no-array-index-key": "off",
    },
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
