/**
 * Status Resource Handler
 *
 * Provides document status via MCP resources
 */

 
import type { RiotdocUri, DocumentStatusResource } from '../types.js';
import { loadDocument } from '../../workspace/loader.js';
 

/**
 * Read status resource
 */
export async function readStatusResource(uri: RiotdocUri): Promise<DocumentStatusResource> {
    const directory = uri.path || process.cwd();

    const doc = await loadDocument(directory);
    if (!doc) {
        throw new Error('Not a RiotDoc workspace');
    }

    return {
        path: directory,
        title: doc.config.title,
        type: doc.config.type,
        status: doc.config.status,
        createdAt: doc.config.createdAt.toISOString(),
        updatedAt: doc.config.updatedAt.toISOString(),
        targetWordCount: doc.config.targetWordCount,
        audience: doc.config.audience,
    };
}
