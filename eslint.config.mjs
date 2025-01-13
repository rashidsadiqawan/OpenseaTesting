import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extend Next.js core and TypeScript rules
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Custom rules to disable specific linting errors
  {
    rules: {
      // Disable exhaustive-deps rule for useEffect dependencies
      "react-hooks/exhaustive-deps": "off",  // Ignore missing dependencies in useEffect

      // Disable the 'no-explicit-any' rule for TypeScript
      "@typescript-eslint/no-explicit-any": "off",  // Allow the use of 'any' type
    },
  },
];

export default eslintConfig;
