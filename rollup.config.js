const path = require("path");
const { readdirSync } = require("fs");
const postcss = require('rollup-plugin-postcss');
import less from 'rollup-plugin-less';
const { babel, getBabelOutputPlugin } = require('@rollup/plugin-babel');
const buble = require('@rollup/plugin-buble');
import ts from 'rollup-plugin-typescript2'
const getPath = _path => path.resolve(__dirname, _path);

const extensions = [
    '.js',
    '.ts',
    '.tsx'
]

// ts
const tsPlugin = ts({
    tsconfig: getPath('./tsconfig.json'), // 导入本地ts配置
    extensions
})

const processLess = function (context, payload) {
    return new Promise((resolve, reject) => {
        less.render({
            file: context
        }, function (err, result) {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        });

        less.render(context, {})
            .then(function (output) {
                // output.css = string of css
                // output.map = string of sourcemap
                // output.imports = array of string filenames of the imports referenced
                if (output && output.css) {
                    resolve(output.css);
                } else {
                    reject({})
                }
            },
                function (err) {
                    reject(err)
                });

    })
}

const rollupConfigList = [];
const libsPkgs = readdirSync(path.join(__dirname, "libs")).filter(
    (pkg) => pkg.charAt(0) !== "."
);
libsPkgs.forEach((pkg) => {
    const babelOptions = {
        "presets": [
            '@babel/preset-env',
            '@babel/preset-react'
        ]
    }
    const config = {
        input: `./libs/${pkg}/src/index.tsx`,
        output: [
            {
                file: `./libs/${pkg}/index.js`,
                format: 'umd',
                name: pkg
                //当入口文件有export时，'umd'格式必须指定name
                //这样，在通过<script>标签引入时，才能通过name访问到export的内容。
            },
            // {
            //     file: `./libs/${pkg}/es/index.js`,
            //     format: 'es'
            // },
            // {
            //     file: `./cjs/index.js`,
            //     format: 'cjs'
            // }
        ],
        plugins: [
            getBabelOutputPlugin(babelOptions),
            tsPlugin,
            buble(),
            postcss({
                extract: true,
                // minimize: isProductionEnv,
                process: processLess,
            }),
        ]
    }
    rollupConfigList.push(config);
})

export default rollupConfigList;
