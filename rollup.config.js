const path = require("path");
const { readdirSync } = require("fs");
import less from "rollup-plugin-less";
import nested from "postcss-nested";
import postcssPresetEnv from "postcss-preset-env";
const { babel } = require("@rollup/plugin-babel");
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import image from "@rollup/plugin-image";
// import image from 'rollup-plugin-img';

import copy from 'rollup-plugin-copy'

const getPath = (_path) => path.resolve(__dirname, _path);

const extensions = [".js", ".ts", ".tsx"];

//less编译配置
const processLess = function (context, payload) {
  return new Promise((resolve, reject) => {
    less.render(
      {
        file: context,
      },
      function (err, result) {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    );
    less.render(context, {}).then(
      function (output) {
        // output.css = string of css
        // output.map = string of sourcemap
        // output.imports = array of string filenames of the imports referenced
        if (output && output.css) {
          resolve(output.css);
        } else {
          reject({});
        }
      },
      function (err) {
        reject(err);
      }
    );
  });
};

const rollupConfigList = [];
const libsPkgs = readdirSync(path.join(__dirname, "libs")).filter(
  (pkg) => pkg.charAt(0) !== "."
);
libsPkgs.forEach((pkg) => {
  const babelOptions = {
    presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-flow"],
    extensions: [".js", ".jsx", ".ts", ".tsx", ".less"],
    exclude: "**/node_modules/**",
    babelHelpers: "runtime",
    plugins: ["@babel/plugin-transform-runtime"],
  };
  const config = {
    input: `./libs/${pkg}/src/index.tsx`,
    output: [
      //   {
      //     file: `./libs/${pkg}/umd/index.js`,
      //     format: "umd",
      //     name: pkg,
      //     //当入口文件有export时，'umd'格式必须指定name
      //     //这样，在通过<script>标签引入时，才能通过name访问到export的内容。
      //   },
      {
        file: `./libs/${pkg}/es/index.js`,
        format: "es",
        sourcemap: true,
      },
      {
        file: `./libs/${pkg}/lib/index.js`,
        format: "cjs",
        exports: "named" /** Disable warning for default imports */,
        sourcemap: true,
      },
    ],
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.build.json",
        include: [
          "typings.d.ts",
          `./libs/${pkg}/src/**/*.ts`,
          `./libs/${pkg}/src/**/*.tsx`,
        ],
      }),
      postcss({
        plugins: [
          // 处理less嵌套样式写法
          nested(),
          // 替代cssnext
          postcssPresetEnv(),
        ],
        modules: false, //不使用css modules
        extensions: [".css", ".less"],
        process: processLess,
      }),
      terser(),
      babel(babelOptions),
      image(),
      // image({
      //   output: `./libs/${pkg}/es/assets`, // default the root
      //   extensions: /\.(png|jpg|jpeg|gif|svg)$/, // support png|jpg|jpeg|gif|svg, and it's alse the default value
      //   limit: 8192,  // default 8192(8k)
      //   exclude: 'node_modules/**'
      // }),
       // 将不需要编译的静态文件直接复制到dist
    copy({
      targets: [
        { src: `./libs/${pkg}/src/assets/**/*`, dest: `./libs/${pkg}/lib/assets` },
        { src: `./libs/${pkg}/src/assets/**/*`, dest: `./libs/${pkg}/es/assets` }

      ]
    }),
    ],
  };
  rollupConfigList.push(config);
});

export default rollupConfigList;
