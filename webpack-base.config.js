const path = require('path');
const os   = require('os');

const glob     = require('glob');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HappyPack         = require('happypack');
const webpack           = require('webpack');

const LEVELS       = glob.sync('bem/blocks*').map( level => path.resolve( `./${level}` ) );
const cpusLength   = os.cpus().length;
const isProduction = process.env.NODE_ENV === 'production';
const JPEG_QUALITY = 93;

module.exports = {
    context : __dirname,

    resolve : {

        modules : [
            ...LEVELS,
            path.resolve('./node_modules'),
            path.resolve('./bower_components'),
        ],

        alias : {
            modernizr$ : path.join( __dirname, '.modernizrrc' ),
            'vue$'     : 'vue/dist/vue.esm.js',
        },
    },

    module : { rules : [
        {
            test : /\.(bemdecl|deps)\.js$/,
            use  : [
                {
                    loader  : 'bem-loader',
                    options : { bem : {
                        extensions : [
                            'deps.js',
                            'coffee',
                            'less',
                            'css',
                            'babel.js',
                            'js',
                        ],
                        levels : LEVELS,
                    } },
                },
            ],
        },

        {
            test   : /\.coffee$/,
            loader : 'coffee-loader',
        },

        {
            test : /\.babel\.js$/,
            use  : isProduction
                ? [ 'babel-loader' ]
                : [
                    'babel-loader',
                    {
                        loader  : 'eslint-loader',
                        options : { configFile: path.join( __dirname, 'config/frontend/eslint.es6.json' ) },
                    },
                ],
        },

        {
            test    : file => file.match( /\.js$/ ) && !isProduction,
            exclude : /(babel|deps|bemdecl)\.js$/,
            use     : [
                {
                    loader  : 'eslint-loader',
                    options : { configFile: path.join( __dirname, 'config/frontend/eslint.json' ) },
                },
            ],
        },

        {
            test    : /\.jade$/,
            exclude : /\.example\.jade$/,
            loader  : 'jade-loader?self',
        },

        {
            test   : /\.less$/,
            loader : ExtractTextPlugin.extract('happypack/loader?id=less'),
        },

        {
            test   : /\.css$/,
            loader : ExtractTextPlugin.extract('happypack/loader?id=css'),
        },

        {
            test : /\.svg$/,
            use  : [ { loader: 'happypack/loader?id=svg' } ],
        },

        {
            test : /\.(png|jpe?g|gif|ico)$/,
            use  : [
                'file-loader?name=[name].[hash].[ext]',
                {
                    loader  : 'img-loader',
                    options : {
                        enabled : false, // ivan.sobolev у меня не получается наладить
                        // Module build failed: Error: spawn /www/srs/node_modules/mozjpeg/vendor/cjpeg ENOENT
                        mozjpeg : {
                            quality     : JPEG_QUALITY,
                            progressive : true,
                            arithmetic  : false,
                        },
                        optipng : false,
                    },
                },
            ],
        },

        {
            test    : /\.(ttf|eot|woff|woff2)$/,
            loaders : [
                'file-loader?name=[name].[hash].[ext]',
            ],
        },

        {
            test    : /\.swf$/,
            loaders : [
                'file-loader?name=[name].[ext]',
            ],
        },

        {
            test    : /\.modernizrrc$/,
            loaders : [
                'modernizr-loader',
                'json-loader',
            ],
        },

        {
            test : /\.vue$/,
            use  : isProduction
                ? [ 'vue-loader' ]
                : [
                    'vue-loader',
                    {
                        loader  : 'eslint-loader',
                        options : {
                            configFile  : path.join( __dirname, 'config/frontend/eslint.vue.json' ),
                            cache       : true,
                            emitWarning : true,
                        },
                    },
                ],
        },
    ] },

    plugins : [

        new HappyPack( {
            id      : 'less',
            threads : cpusLength,
            loaders : [
                'css-loader!postcss-loader!less-loader',
            ],
        } ),

        new HappyPack( {
            id      : 'css',
            threads : cpusLength,
            loaders : [
                'css-loader!postcss-loader',
            ],
        } ),

        new HappyPack( {
            id      : 'svg',
            threads : cpusLength,
            loaders : [
                'svg-url-loader',
                {
                    loader  : 'img-loader',
                    options : {
                        enabled  : true,
                        gifsicle : false,
                        mozjpeg  : false,
                        optipng  : false,
                        pngquant : false,
                        svgo     : { plugins : [
                            { removeTitle: true },
                            { cleanupAttrs: true },
                            { cleanupEnableBackground: true },
                            { cleanupIDs: true },
                            { cleanupNumericValues: true },
                            { collapseGroups: true },
                            { convertColors: true },
                            { mergePaths: true },
                            { convertShapeToPath: true },
                            { convertStyleToAttrs: true },
                            { convertTransform: true },
                            { moveElemsAttrsToGroup: true },
                            { moveGroupAttrsToElems: true },
                            { removeComments: true },
                            { removeDesc: true },
                            { removeDoctype: true },
                            { removeEditorsNSData: true },
                            { removeEmptyAttrs: true },
                            { removeEmptyContainers: true },
                            { removeEmptyText: true },
                            { removeHiddenElems: true },
                            { removeMetadata: true },
                            { removeNonInheritableGroupAttrs: true },
                            { removeUnknownsAndDefaults: true },
                            { removeUnusedNS: true },
                            { removeUselessStrokeAndFill: true },
                            { removeXMLProcInst: true },
                            { convertPathData: false },
                        ] },
                    },
                },
            ],
        } ),

        new webpack.DefinePlugin( { 'process.env': { NODE_ENV: `"${process.env.NODE_ENV}"` } } ),
    ],

    devtool : 'cheap-eval-source-map',

    stats : 'errors-only',
};

