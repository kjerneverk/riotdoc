import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parse, stringify } from "yaml";
import { AssetManifestSchema } from "../types/asset.js";
import type { Asset, AssetManifest } from "../types/asset.js";

export async function loadAssetManifest(projectRoot: string): Promise<AssetManifest> {
    const manifestPath = join(projectRoot, "assets", "manifest.yaml");
    try {
        const content = await readFile(manifestPath, "utf-8");
        const raw = parse(content);
        return AssetManifestSchema.parse(raw);
    } catch {
        return { assets: [] };
    }
}

export async function saveAssetManifest(projectRoot: string, manifest: AssetManifest): Promise<void> {
    const manifestPath = join(projectRoot, "assets", "manifest.yaml");
    await writeFile(manifestPath, stringify(manifest), "utf-8");
}

export async function registerAsset(projectRoot: string, asset: Asset): Promise<AssetManifest> {
    const manifest = await loadAssetManifest(projectRoot);
    const existing = manifest.assets.findIndex(a => a.id === asset.id);
    if (existing >= 0) {
        manifest.assets[existing] = asset;
    } else {
        manifest.assets.push(asset);
    }
    await saveAssetManifest(projectRoot, manifest);
    return manifest;
}
