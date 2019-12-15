const mix = require('laravel-mix');

mix.setPublicPath('dist');

mix.webpackConfig({
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
            },
        ],
    },
    output: {
        publicPath: '/',
        chunkFilename: 'js/[name].[chunkhash].js',
    },
});

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('src/js/enterprise.js', 'dist/js')
    .js('src/js/supplier.js', 'dist/js')
    .js('src/js/admin.js', 'dist/js')
    .sass('src/sass/app.scss', 'dist/css')
    .copy(['src/favicon.ico', 'src/robots.txt'], 'dist')
    .copy(['src/static'], 'dist/static');

if (mix.config.production) {
    mix.version();
}

// 生成文件映射后执行
mix.then(() => {
    const fileList = ['index.html', 'supplier.html', 'admin.html'];
    const manifest = Mix.manifest.get();

    for (const fileName of fileList) {
        const template = File.find('src/' + fileName).read();
        // 替换内容
        const parsedHtml = template.replace(/\{\{.*?['"](.*?)['"].*?\}\}/g, function (match, contents, offset, input) {
            const assetPathKey = (contents.startsWith('/') ? '' : '/') + contents;
            return manifest[assetPathKey];
        });

        File.find(Config.publicPath + '/' + fileName).write(parsedHtml);
    }
});

// 将第三方库导出成单独的文件
mix.extract([
    '@fortawesome/fontawesome-svg-core',
    '@fortawesome/free-solid-svg-icons',
    '@fortawesome/vue-fontawesome',
    'axios',
    'element-ui',
    'js-cookie',
    'lodash',
    'luxon',
    'normalize.css',
    'vue',
    'vuex',
    'vue-router',
]).options();

mix.disableNotifications();
