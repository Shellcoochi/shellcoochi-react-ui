const path = require("path");
const { readdirSync } = require("fs");

const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");

const devMode = process.env.NODE_ENV !== "production";

const tailPkgs = readdirSync(path.join(__dirname, "libs")).filter(
  (pkg) => pkg.charAt(0) !== "."
);

const webPackConfigList = [];
tailPkgs.forEach((pkg) => {
  const entry = {};
  entry[`${pkg}`] = `./libs/${pkg}/src/index.tsx`;
  if (!(!process.env.NODE_ENV || process.env.NODE_ENV === "development")) {
    entry[`${pkg}.min`] = `./libs/${pkg}/src/index.tsx`;
  }
  const config = {
    entry,
    output: {
      filename: "[name].js",
      library: `Pro${pkg
        .toLowerCase()
        .replace(/( |^)[a-z]/g, (L) => L.toUpperCase())}`,
      libraryTarget: "umd",
      path: path.resolve(__dirname, "libs", pkg, "dist"),
      globalObject: "this",
    },
    mode: devMode ? "development" : "production",
    devtool: devMode ? "inline-source-map" : "hidden-source-map",
    resolve: {
      extensions: [".ts", ".tsx", ".json", ".css", ".js", ".less"],
    },
    optimization: {
      minimizer: devMode
        ? []
        : [
            // 压缩js代码
            new TerserJSPlugin({
              // cache: true, // 启用文件缓存并设置缓存目录的路径
              parallel: true, // 使用多进程并行运行
            }),
            // 用于优化或者压缩CSS资源
            new CssMinimizerPlugin(),
          ],
      sideEffects: false,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            "babel-loader?cacheDirectory",
            {
              loader: "ts-loader",
              options: {
                configFile: "tsconfig.json",
              },
            },
          ],
        },
        {
          test: /\.(c|le)ss$/,
          use: [
            {
              // 将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，使用此loader就不需要用style-loader，即使用了也不会有效果
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: "css-loader",
              options: {
                modules: {
                  auto: true,
                  localIdentName: "[path][name]__[local]",
                },
                importLoaders: 2, // 一个css中引入了另一个css，也会执行之前两个loader，即postcss-loader和less-loader
              },
            },
            {
              loader: "less-loader", // 使用 less-loader 将 less 转为 css
            },
          ],
        },
      ],
    },
    externals: [
      {
        react: "React",
        "react-dom": "ReactDOM",
        antd: "antd",
        moment: "moment",
      },
    ],
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css",
      }),
    ],
  };
  webPackConfigList.push(config);
});
module.exports = webPackConfigList;
