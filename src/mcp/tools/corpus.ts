/**
 * Content Corpus Tools
 */

import { z } from 'zod';
import { resolve, join } from 'node:path';
import { readFile } from 'node:fs/promises';
import type { McpTool, ToolResult, ToolExecutionContext } from '../types.js';
import { executeCommand } from './shared.js';
import { indexCorpus, searchCorpus } from '../../corpus/indexer.js';

export const corpusIndexTool: McpTool = {
    name: 'riotdoc_corpus_index',
    description:
        'Index a directory of documents into a searchable corpus. ' +
        'Scans for markdown files and extracts titles, dates, tags, headings, and word counts.',
    schema: {
        path: z.string().optional().describe('Path to document workspace (defaults to current directory)'),
        corpus_path: z.string().describe('Root directory of the corpus to index'),
        pattern: z.string().optional().describe('Glob pattern for files to index (default: "**/*.md")'),
    },
    async execute(args: Record<string, unknown>, context: ToolExecutionContext): Promise<ToolResult> {
        return executeCommand(
            args,
            context,
            async () => {
                const workspacePath = resolve((args.path as string) || process.cwd());
                const corpusPath = resolve(workspacePath, args.corpus_path as string);
                const pattern = (args.pattern as string) || '**/*.md';
                const cacheFile = join(workspacePath, '.riotdoc', 'cache', 'corpus-index.json');

                const manifest = await indexCorpus(corpusPath, pattern, cacheFile);

                return {
                    path: workspacePath,
                    corpusPath,
                    pattern,
                    entryCount: manifest.entryCount,
                    generatedAt: manifest.generatedAt,
                    cacheFile,
                };
            },
            (result) => ({
                ...result,
                message: `Indexed ${result.entryCount} documents from ${result.corpusPath}`,
            }),
        );
    },
};

export const corpusSearchTool: McpTool = {
    name: 'riotdoc_corpus_search',
    description:
        'Search the indexed corpus for documents matching a query. ' +
        'Searches titles, headings, tags, and summaries.',
    schema: {
        path: z.string().optional().describe('Path to document workspace (defaults to current directory)'),
        query: z.string().describe('Search query'),
        max_results: z.number().optional().describe('Maximum number of results to return (default: 10)'),
    },
    async execute(args: Record<string, unknown>, context: ToolExecutionContext): Promise<ToolResult> {
        return executeCommand(
            args,
            context,
            async () => {
                const workspacePath = resolve((args.path as string) || process.cwd());
                const cacheFile = join(workspacePath, '.riotdoc', 'cache', 'corpus-index.json');

                let manifest;
                try {
                    const content = await readFile(cacheFile, 'utf-8');
                    manifest = JSON.parse(content);
                } catch {
                    throw new Error('Corpus index not found. Run riotdoc_corpus_index first.');
                }

                const query = args.query as string;
                const maxResults = (args.max_results as number) || 10;
                const results = searchCorpus(manifest, query).slice(0, maxResults);

                return {
                    path: workspacePath,
                    query,
                    totalMatches: results.length,
                    results,
                };
            },
        );
    },
};

export const corpusReadTool: McpTool = {
    name: 'riotdoc_corpus_read',
    description:
        'Read the full content of a corpus entry by its path.',
    schema: {
        corpus_path: z.string().describe('Root directory of the corpus'),
        entry_path: z.string().describe('Relative path of the entry within the corpus'),
    },
    async execute(args: Record<string, unknown>, context: ToolExecutionContext): Promise<ToolResult> {
        return executeCommand(
            args,
            context,
            async () => {
                const corpusPath = resolve(args.corpus_path as string);
                const entryPath = args.entry_path as string;
                const fullPath = join(corpusPath, entryPath);

                const content = await readFile(fullPath, 'utf-8');

                return {
                    corpusPath,
                    entryPath,
                    content,
                    wordCount: content.split(/\s+/).filter(Boolean).length,
                };
            },
        );
    },
};
