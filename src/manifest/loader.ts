import { z } from "zod";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parse, stringify } from "yaml";

export const ManifestItemSchema = z.object({
    type: z.enum(["chapter", "frontmatter", "backmatter", "divider", "section", "post"]),
    file: z.string(),
    title: z.string().optional(),
});

export const ManifestPartSchema = z.object({
    title: z.string(),
    items: z.array(ManifestItemSchema),
});

export const ManifestSchema = z.object({
    title: z.string(),
    parts: z.array(ManifestPartSchema),
});

export type ManifestItem = z.infer<typeof ManifestItemSchema>;
export type ManifestPart = z.infer<typeof ManifestPartSchema>;
export type Manifest = z.infer<typeof ManifestSchema>;

export async function loadManifest(projectRoot: string): Promise<Manifest | null> {
    const manifestPath = join(projectRoot, "manifest.yaml");
    try {
        const content = await readFile(manifestPath, "utf-8");
        return ManifestSchema.parse(parse(content));
    } catch {
        return null;
    }
}

export async function saveManifest(projectRoot: string, manifest: Manifest): Promise<void> {
    const manifestPath = join(projectRoot, "manifest.yaml");
    await writeFile(manifestPath, stringify(manifest), "utf-8");
}

export async function addManifestItem(
    projectRoot: string,
    partIndex: number,
    item: ManifestItem
): Promise<Manifest> {
    let manifest = await loadManifest(projectRoot);
    if (!manifest) {
        manifest = { title: "Untitled", parts: [{ title: "Main", items: [] }] };
    }
    while (manifest.parts.length <= partIndex) {
        manifest.parts.push({ title: `Part ${manifest.parts.length + 1}`, items: [] });
    }
    manifest.parts[partIndex].items.push(item);
    await saveManifest(projectRoot, manifest);
    return manifest;
}

export async function assembleFromManifest(projectRoot: string): Promise<string> {
    const manifest = await loadManifest(projectRoot);
    if (!manifest) throw new Error("No manifest.yaml found");

    const parts: string[] = [];
    for (const part of manifest.parts) {
        parts.push(`\n# ${part.title}\n`);
        for (const item of part.items) {
            if (item.type === "divider") {
                parts.push(`\n---\n`);
                continue;
            }
            try {
                const content = await readFile(join(projectRoot, item.file), "utf-8");
                parts.push(content);
            } catch {
                parts.push(`\n<!-- Missing: ${item.file} -->\n`);
            }
        }
    }

    return parts.join("\n");
}
