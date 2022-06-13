const path = require("path");

const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");

const pkg = require("./package.json");

const devMode = process.env.NODE_ENV !== "production";
module.exports = {
  mode: devMode ? "development" : "production",
  devtool: devMode ? 'inline-source-map' : 'hidden-source-map',
  entry: path.resolve(__dirname, "./src/index.ts"), //打包入口文件
  output: {
    filename: "shellcoochi.js",
    path: path.resolve(__dirname, "dist"), //输出目录
    library: "shellcoochi",
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: devMode ? "shellcoochi.css" : "shellcoochi.min.css",
      chunkFilename: "[id].css",
    }),
    // 在每个生成的块的顶部添加一个横幅，一般用于版权声明或添加一些信息
    new webpack.BannerPlugin(`${pkg.name} ${pkg.version} ${pkg.description}`),
  ],
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
};
