const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // zod v4 lists its ESM build ("import") before its CommonJS build
    // ("require") in package.json "exports", so Metro picks the ESM files,
    // which fail to transform (`export * as core from ...`).
    // Metro adds "import" for `import ...` statements, so for zod only we
    // pretend it's a require() and get the CommonJS build.
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === 'zod' || moduleName.startsWith('zod/')) {
        return context.resolveRequest(
          { ...context, isESMImport: false }, // ask for the "require" build
          moduleName,
          platform,
        );
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
