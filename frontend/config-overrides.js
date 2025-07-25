const { override, overrideDevServer } = require('customize-cra');

const devServerConfig = () => config => {
  config.allowedHosts = ['localhost']; // 또는 'all'
  return config;
};

module.exports = function override(config, env) {
  return config;
};

module.exports.devServer = function(configFunction) {
  return function(proxy, allowedHost) {
    const config = configFunction(proxy, allowedHost);
    
    // allowedHosts 문제 해결
    config.allowedHosts = 'all';
    
    return config;
  };
};
