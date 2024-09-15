const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    "path": require.resolve("path-browserify"),
    "stream": require.resolve("stream-browserify"),
    "buffer": require.resolve("buffer"),
    "https": require.resolve("https-browserify"),
    "crypto": require.resolve("crypto-browserify"),
    "util": require.resolve("util"),
    "url": require.resolve("url"),
    "os": require.resolve("os-browserify/browser"),
    "assert": require.resolve("assert"),
    "querystring": require.resolve("querystring-es3"),
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  );

  return config;
};
