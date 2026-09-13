import babelParser from "@babel/eslint-parser";
import eslint from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { globalIgnores } from "eslint/config";
import globals from "globals";

export default [
  globalIgnores([
    "dist",
    "node_modules",
    ".tanstack",
    "public",
    "src/routeTree.gen.ts",
    "src/content/generated-content.ts",
  ]),
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  perfectionist.configs["recommended-natural"],
  jsxA11y.flatConfigs.recommended,
  {
    files: ["**/*.{js,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: babelParser,
      parserOptions: {
        babelOptions: {
          presets: [
            "@babel/preset-typescript",
            ["@babel/preset-react", { runtime: "automatic" }],
          ],
        },
        requireConfigFile: false,
        sourceType: "module",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs["recommended-latest"].rules,
      "no-console": "error",
      "no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
        },
      ],
      // Type-aware import sorting comes from perfectionist's recommended-natural preset; kept as a warning here.
      "perfectionist/sort-imports": "warn",
      "react/jsx-key": "error",
      "react/jsx-no-leaked-render": [
        "error",
        { validStrategies: ["ternary", "coerce"] },
      ],
      // Mark JSX-referenced identifiers as used (automatic runtime: no React import).
      "react/jsx-uses-vars": "error",
    },
    settings: {
      "jsx-a11y": {
        components: {
          Button: "button",
          Text: "p",
        },
        polymorphicPropName: "as",
      },
      react: {
        version: "detect",
      },
    },
  },
  {
    // no-unused-vars can't see type-position usage under the babel parser, so
    // type-only imports read as unused. tsc (noUnusedLocals/noUnusedParameters,
    // type-aware) owns unused detection for TS; keep the ESLint rule for .js.
    // Same applies to no-undef: babel parser can't resolve TS type identifiers.
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  },
];
