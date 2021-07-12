const { presets } = require('./babel.configGeneral');

module.exports = function (api) {
  api.cache(true);

  return {
    presets,
    compact: false,
  };
};
