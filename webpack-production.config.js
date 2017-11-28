/* eslint no-magic-numbers: "off", camelcase: "off" */

const path              = require('path');

const baseConfig        = require('./webpack-base.config');
const glob              = require('glob');
const webpack           = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const CONFIG_FILTRES = { fonts: /\.(eot|woff(?:2)?|ttf)/ };

module.exports = Object.assign( {}, baseConfig, {

    entry : getEntries(),

    output : {
        path       : path.join( __dirname, 'root/dist' ),
        filename   : '[name].[chunkhash].js',
        publicPath : '/dist/',
    },

    devtool : 'source-map',

} );

baseConfig.plugins.push(

    new webpack.DefinePlugin( { 'process.env': { NODE_ENV: '"production"' } } ),

    new webpack.NoEmitOnErrorsPlugin(),

    new ExtractTextPlugin( {
        filename  : '[name].[chunkhash].css',
        allChunks : true,
    } ),

    new webpack.optimize.CommonsChunkPlugin( {
        name      : 'all',
        chunks    : [ 'all' ],
        minChunks : Infinity,
    } ),

    new webpack.LoaderOptionsPlugin( {
        test     : /\.(css|less)$/,
        minimize : true,
        debug    : false,
        options  : { // this overrides default options, see https://github.com/webpack/webpack/issues/2684
            autoprefixer : false,
            safe         : true,
            svgo         : false,
        },
    } ),

    new webpack.optimize.UglifyJsPlugin( {
        warnings : false,
        compress : {
            drop_console  : true,
            drop_debugger : true,
        },
    } ),

    new CompressionPlugin( {
        asset     : '[path].gz[query]',
        algorithm : 'gzip',
        test      : /\.js$|\.css$/,
        threshold : 10240,
        minRatio  : 0.8,
    } )
);

function getEntries() {
    const entries = {};

    glob.sync('bem/bundles/**/*.bemdecl.js').forEach( bemdecl => {
        const basename = path.basename( bemdecl, '.bemdecl.js' );

        entries[ basename ] = `./${bemdecl}`;
    } );


    return entries;
}

function getInitialModuleName( file ) {
    return path.basename( file ).replace( /\.[0-9a-f]{32}/, '' );
}

function checkModuleByMask( file ) {
    let isMatch = 0;

    for ( let mask of Object.keys( CONFIG_FILTRES ) ) {
        if ( CONFIG_FILTRES[ mask ].test( file ) ) {
            isMatch = 1;

            break;
        }
    }

    return isMatch;
}
