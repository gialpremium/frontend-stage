/* eslint no-magic-numbers: "off", camelcase: "off" */

const path = require('path');

const webpack  = require('webpack');
const glob     = require('glob');
const rc       = require('rc');

const ExtractTextPlugin     = require('extract-text-webpack-plugin');
const baseConfig            = require('./webpack-base.config');

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

function getEntries() {
    const entries = {};
    const customChuncks = CONFIG.defaultEntries.concat( CONFIG.entry );

    glob.sync('bem/bundles/**/*.bemdecl.js').forEach( bemdecl => {
        const basename = path.basename( bemdecl, '.bemdecl.js' );

        if ( CONFIG.overrideEntry && !customChuncks.includes( basename ) ) {
            return;
        }

        entries[ basename ] = `./${bemdecl}`;
    } );

    return entries;
}

function getConfig() {
    return rc( 'build', {
        devServer : {
            port           : 5555,
            host           : 'localhost',
            contentBase    : path.join( __dirname, 'root/dist' ),
            clientLogLevel : 'error',
            stats          : 'errors-only',
        },

        output : {
            path       : path.join( __dirname, 'root/dist' ),
            filename   : '[name].js',
            pathinfo   : true,
            publicPath : '/dist/',
        },

        defaultEntries: [ 'all' ]

    } );
}

