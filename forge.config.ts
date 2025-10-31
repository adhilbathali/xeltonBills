import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import path from 'path';

// KEEP THIS IMPORT for now, but its function is being bypassed for better-sqlite3
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true, // Keep ASAR true for the rest of the app
    // *** ADD THIS: A custom ignore function to exclude better-sqlite3 from ASAR ***
    ignore: (filePath) => {
      // This regex will ignore anything inside the better-sqlite3 node_modules folder
      // for being packed into app.asar. It will then be placed directly in resources/app/
      const shouldIgnore = filePath.includes('node_modules\\better-sqlite3');
      if (shouldIgnore) {
        console.log(`Excluding from ASAR: ${filePath}`); // Optional: for debugging
      }
      return shouldIgnore;
    },
    icon: path.join(__dirname, 'src', 'renderer', 'asset', 'icon'),
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      setupIcon: path.join(__dirname, 'src', 'renderer', 'asset', 'icon.ico'),
    }),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: 'src/main/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/main/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    // Keep this plugin. It might still handle other native modules or be required.
    new AutoUnpackNativesPlugin({}),
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;