const { resolve } = require('path');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
    // Create the default Expo config
    const config = await createExpoWebpackConfigAsync(env, argv);

    // Add a rule to emit .ttf/.otf files from react-native-vector-icons
    config.module.rules.push({
        test: /\.(ttf|otf)$/,
        include: resolve(__dirname, 'node_modules/react-native-vector-icons'),
        type: 'asset/resource',
        generator: {
            filename: 'assets/fonts/[name][ext]'
        }
    });

    return config;
};
