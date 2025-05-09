// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// allow Firebase's .cjs entrypoints to be loaded
config.resolver.sourceExts.push('cjs');

// turn off the new package‑exports guard so native bindings register
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
