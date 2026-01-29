/**
 * Outline Resource Handler
 *
 * Provides document outline via MCP resources
 */

 
import type { RiotdocUri, OutlineResource } from '../types.js';
import { loadOutline } from '../../outline/generator.js';
 

/**
 * Read outline resource
 */
export async function readOutlineResource(uri: RiotdocUri): Promise<OutlineResource> {
    const directory = uri.path || process.cwd();

    try {
        const content = await loadOutline(directory);
        return {
            path: directory,
            content,
            exists: true,
        };
    } catch {
        return {
            path: directory,
            content: '',
            exists: false,
        };
    }
}
