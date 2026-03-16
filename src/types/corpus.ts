/**
 * A single entry in the corpus index, representing one previously-written
 * document (blog post, chapter, paper, etc.) with extracted metadata.
 */
export interface CorpusEntry {
    path: string;
    title: string;
    date?: string;
    tags?: string[];
    wordCount: number;
    summary?: string;
    headings: string[];
}

/**
 * Corpus index metadata, persisted as a JSON manifest file in
 * .riotdoc/cache/corpus-index.json for fast reloading.
 */
export interface CorpusIndexManifest {
    generatedAt: string;
    rootDir: string;
    pattern: string;
    entryCount: number;
    entries: CorpusEntry[];
}
