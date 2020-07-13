//eslint-disable-next-line @typescript-eslint/no-var-requires
const merge = require("webpack-merge");
//eslint-disable-next-line @typescript-eslint/no-var-requires
const tsImportPluginFactory = require("ts-import-plugin");
module.exports = {
  publicPath:'/app/',
  outputDir:'app',
  parallel: false,
  lintOnSave: false,
  chainWebpack:config => {
    config.module.rule("ts").use("ts-loader").tap(options => {
        options = merge(options, {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: "vant",
                libraryDirectory: "es",
                style: true
              })
            ]
          }),
          compilerOptions: {
            module: "es2015"
          }
        });
        return options;
      });
  }
};
