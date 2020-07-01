const path = require('path');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].min.js',
        chunkFilename: '[name].min.js'
    },
    mode: 'production',
    stats: {
        colors: true
    },
    plugins: [
        new MomentLocalesPlugin({
            localesToKeep: ['es-us', 'nb-no'],
        }),
    ],
    devtool: 'source-map'
};
