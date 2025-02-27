import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/components/GigaCaptcha.tsx",
  output: {
    dir: "dist",
    format: "esm"
  },
  plugins: [resolve(), commonjs(), typescript()]
};
