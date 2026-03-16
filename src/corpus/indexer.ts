import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { join, relative } from "node:path";
import type { CorpusEntry, CorpusIndexManifest } from "../types/corpus.js";

function extractTitle(content: string): string {
    const frontmatterMatch = content.match(/^---[\s\S]*?title:\s*["']?([^"'\n]+)/);
    if (frontmatterMatch) return frontmatterMatch[1].trim();
    const headingMatch = content.match(/^#\s+(.+)$/m);
    if (headingMatch) return headingMatch[1].trim();
    return "Untitled";
}

function extractDate(content: string, filePath: string): string | undefined {
    const frontmatterMatch = content.match(/^---[\s\S]*?date:\s*["']?([^"'\n]+)/);
    if (frontmatterMatch) return frontmatterMatch[1].trim();
    const pathMatch = filePath.match(/(\d{4})\/(\d{2})/);
    if (pathMatch) return `${pathMatch[1]}-${pathMatch[2]}`;
    return undefined;
}

function extractTags(content: string): string[] {
    const match = content.match(/^---[\s\S]*?tags:\s*\n((?:\s*-\s*.+\n)*)/);
    if (match) {
        return match[1].split("\n").filter(l => l.trim().startsWith("-")).map(l => l.replace(/^\s*-\s*/, "").trim());
    }
    return [];
}

function extractHeadings(content: string): string[] {
    return (content.match(/^#{1,3}\s+.+$/gm) || []).map(h => h.replace(/^#+\s+/, ""));
}

async function scanDirectory(rootDir: string, pattern: string): Promise<string[]> {
    const files: string[] = [];
    const regex = new RegExp(pattern.replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*").replace(/\./g, "\\."));

    async function walk(dir: string) {
        try {
            const entries = await readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = join(dir, entry.name);
                if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
                    await walk(fullPath);
                } else if (entry.isFile()) {
                    const rel = relative(rootDir, fullPath);
                    if (regex.test(rel)) files.push(fullPath);
                }
            }
        } catch { /* skip unreadable dirs */ }
    }

    await walk(rootDir);
    return files.sort();
}

export async function indexCorpus(
    rootDir: string,
    pattern: string = "**/*.md",
    cacheFile?: string
): Promise<CorpusIndexManifest> {
    const files = await scanDirectory(rootDir, pattern);
    const entries: CorpusEntry[] = [];

    for (const file of files) {
        try {
            const content = await readFile(file, "utf-8");
            const relPath = relative(rootDir, file);
            entries.push({
                path: relPath,
                title: extractTitle(content),
                date: extractDate(content, relPath),
                tags: extractTags(content),
                wordCount: content.split(/\s+/).filter(Boolean).length,
                summary: content.split("\n\n").find(p => p.length > 50 && !p.startsWith("#") && !p.startsWith("---"))?.slice(0, 200),
                headings: extractHeadings(content),
            });
        } catch { /* skip unreadable */ }
    }

    const manifest: CorpusIndexManifest = {
        generatedAt: new Date().toISOString(),
        rootDir,
        pattern,
        entryCount: entries.length,
        entries,
    };

    if (cacheFile) {
        await mkdir(join(cacheFile, ".."), { recursive: true });
        await writeFile(cacheFile, JSON.stringify(manifest, null, 2), "utf-8");
    }

    return manifest;
}

export function searchCorpus(manifest: CorpusIndexManifest, query: string): CorpusEntry[] {
    const q = query.toLowerCase();
    return manifest.entries.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.headings.some(h => h.toLowerCase().includes(q)) ||
        (e.tags && e.tags.some(t => t.toLowerCase().includes(q))) ||
        (e.summary && e.summary.toLowerCase().includes(q))
    );
}

export function corpusByDate(manifest: CorpusIndexManifest, start?: string, end?: string): CorpusEntry[] {
    return manifest.entries.filter(e => {
        if (!e.date) return false;
        if (start && e.date < start) return false;
        if (end && e.date > end) return false;
        return true;
    });
}

export function corpusRecent(manifest: CorpusIndexManifest, n: number): CorpusEntry[] {
    return [...manifest.entries]
        .filter(e => e.date)
        .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
        .slice(0, n);
}
