/**
 * Asset Manifest Resource Handler
 */

import type { RiotdocUri } from '../types.js';
import { loadAssetManifest } from '../../assets/manager.js';

export async function readAssetsResource(uri: RiotdocUri) {
    const directory = uri.path || process.cwd();
    const manifest = await loadAssetManifest(directory);

    return {
        path: directory,
        totalAssets: manifest.assets.length,
        globalStyle: manifest.globalStyle,
        namingConvention: manifest.namingConvention,
        assets: manifest.assets,
    };
}
