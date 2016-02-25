module.exports = AltMainPlugin;

function AltMainPlugin() {}

AltMainPlugin.prototype.apply = function(compiler) {
  compiler.plugin('normal-module-factory', nmf => {
    nmf.plugin('after-resolve', data => {
      console.log(data);
    });
  })
};
