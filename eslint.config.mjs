import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import jsdoc from "eslint-plugin-jsdoc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Force the setting of a swagger description on each api endpoint
    files: ["src/app/api/**/*.ts"],
    plugins: { "jsdoc": jsdoc },
    rules: {
      "jsdoc/no-missing-syntax": [
        "error",
        {
          contexts: [
            {
              comment: "JsdocBlock:has(JsdocTag[tag=swagger])",
              context: "any",
              message: "@swagger documentation is required on each API. Check this out for syntax info: https://github.com/jellydn/next-swagger-doc"
            }
          ]
        }
      ]
    }
  }
];

export default eslintConfig;
