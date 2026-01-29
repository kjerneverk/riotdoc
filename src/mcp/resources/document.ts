/**
 * Document Resource Handler
 *
 * Provides complete document state via MCP resources
 */

 
import type { RiotdocUri, DocumentResource } from '../types.js';
import { loadDocument } from '../../workspace/loader.js';
 

/**
 * Read document resource
 */
export async function readDocumentResource(uri: RiotdocUri): Promise<DocumentResource> {
    const directory = uri.path || process.cwd();

    const doc = await loadDocument(directory);
    if (!doc) {
        throw new Error('Not a RiotDoc workspace');
    }

    return {
        path: directory,
        config: {
            id: doc.config.id,
            title: doc.config.title,
            type: doc.config.type,
            status: doc.config.status,
            createdAt: doc.config.createdAt.toISOString(),
            updatedAt: doc.config.updatedAt.toISOString(),
            targetWordCount: doc.config.targetWordCount,
            audience: doc.config.audience,
        },
        voice: doc.voice,
        objectives: doc.objectives,
        outline: undefined, // Loaded separately if needed
        drafts: doc.drafts.map(d => ({
            number: d.number,
            path: d.path,
            createdAt: d.createdAt.toISOString(),
            wordCount: d.wordCount,
        })),
        evidence: doc.evidence.map(e => ({
            id: e.id,
            path: e.path,
            description: e.description,
            type: e.type,
        })),
    };
}
