/**
 * Corpus Index Resource Handler
 */

import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import type { RiotdocUri } from '../types.js';

export async function readCorpusResource(uri: RiotdocUri) {
    const directory = uri.path || process.cwd();
    const cacheFile = join(directory, '.riotdoc', 'cache', 'corpus-index.json');

    try {
        const content = await readFile(cacheFile, 'utf-8');
        const manifest = JSON.parse(content);
        return {
            path: directory,
            indexed: true,
            generatedAt: manifest.generatedAt,
            entryCount: manifest.entryCount,
            entries: manifest.entries,
        };
    } catch {
        return {
            path: directory,
            indexed: false,
            note: 'Corpus not yet indexed. Use riotdoc_corpus_index to build the index.',
        };
    }
}
