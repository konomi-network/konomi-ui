const webpack = require('webpack');
const CracoEsbuildPlugin = require('craco-esbuild');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const esbuildPlugin = {
  plugin: CracoEsbuildPlugin,
  options: {
    esbuildLoaderOptions: {
      // Optional. Defaults to auto-detect loader.
      loader: 'tsx', // Set the value to 'tsx' if you use typescript
      target: 'es6'
    },
    skipEsbuildJest: true // Optional. Set to true if you want to use babel for jest tests,
  }
};

const isDevMode = process.env.NODE_ENV === 'development';

module.exports = {
  plugins: isDevMode ? [esbuildPlugin] : [],
  webpack: {
    plugins: [
      new webpack.ProvidePlugin({
        React: 'react'
      }),
      new NodePolyfillPlugin({
        excludeAliases: ['console'],
        resolve: {
          fallback: {
            fs: false,
            readline: false,
            path: require.resolve('path-browserify')
          }
        }
      })
    ],
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.svg$/,
        issuer: /\.(js|ts)x?$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: [
                  {
                    removeViewBox: false
                  }
                ]
              }
            }
          }
        ]
      });
      return webpackConfig;
    }
  }
};
