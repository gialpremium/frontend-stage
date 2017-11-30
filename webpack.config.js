/* eslint no-magic-numbers: "off", camelcase: "off" */

const path = require('path');

const webpack  = require('webpack');
const glob     = require('glob');
const rc       = require('rc');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin   = require('html-webpack-plugin');

const baseConfig        = require('./webpack-base.config');

const CONFIG = getConfig();

module.exports = Object.assign( {}, baseConfig, {

    entry : getEntries(),

    output : CONFIG.output,

    devServer : CONFIG.devServer,

    devtool : 'cheap-eval-source-map',
} );

baseConfig.plugins.push(

    new ExtractTextPlugin( {
        filename  : '[name].css',
        allChunks : true,
    } ),

    new webpack.optimize.CommonsChunkPlugin( {
        name      : 'all',
        chunks    : [ 'all' ],
        minChunks : Infinity,
    } )
);

// glob.sync('bem/bundles/**/*.bemdecl.js').forEach( bemdecl => {
//     const basename = path.basename( bemdecl, '.bemdecl.js' );
//     baseConfig.plugins.push(
//         new HtmlWebpackPlugin({
//             filename: '../../pages/' + basename +'.html'
//         })
//     );
// } );


function getEntries() {
    const entries = {};
    glob.sync('bem/bundles/**/*.bemdecl.js').forEach( bemdecl => {
        const basename = path.basename( bemdecl, '.bemdecl.js' );

        entries[ basename ] = `./${bemdecl}`;
    } );

    return entries;
}

function getConfig() {
    return rc( 'build', {
        output : {
            path       : path.join( __dirname, 'root/dist' ),
            filename   : '[name].js',
            pathinfo   : true,
            publicPath : '../root/dist/',
        },

        defaultEntries: [ 'all' ]

    } );
}

