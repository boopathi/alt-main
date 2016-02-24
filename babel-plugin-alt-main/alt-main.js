module.exports = function(babel) {
  return {
    visitor: {
      Expression: function(path, plugin) {
        console.log("call", plugin.file.opts);
      }
    }
  }
};
