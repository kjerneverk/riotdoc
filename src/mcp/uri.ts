/**
 * URI Parser for RiotDoc MCP Resources
 *
 * Parses riotdoc:// URIs into structured components
 */

 
import type { RiotdocUri } from './types.js';
 

/**
 * Parse a riotdoc:// URI
 *
 * Format: riotdoc://type[/path][?query]
 *
 * Examples:
 * - riotdoc://config
 * - riotdoc://config/path/to/workspace
 * - riotdoc://document/path/to/workspace
 * - riotdoc://outline/path/to/workspace
 * - riotdoc://status/path/to/workspace
 */
export function parseRiotdocUri(uri: string): RiotdocUri {
    if (!uri.startsWith('riotdoc://')) {
        throw new Error(`Invalid riotdoc URI: ${uri}`);
    }

    const withoutScheme = uri.slice('riotdoc://'.length);
    const [pathPart, queryPart] = withoutScheme.split('?');
    const segments = pathPart.split('/').filter(Boolean);

    if (segments.length === 0) {
        throw new Error(`Invalid riotdoc URI: missing resource type`);
    }

    const type = segments[0] as RiotdocUri['type'];
    const path = segments.slice(1).join('/') || undefined;

    // Parse query string if present
    const query: Record<string, string> = {};
    if (queryPart) {
        const params = new URLSearchParams(queryPart);
        for (const [key, value] of params) {
            query[key] = value;
        }
    }

    return {
        scheme: 'riotdoc',
        type,
        path,
        query: Object.keys(query).length > 0 ? query : undefined,
    };
}

/**
 * Build a riotdoc:// URI from components
 */
export function buildRiotdocUri(
    type: RiotdocUri['type'],
    path?: string,
    query?: Record<string, string>
): string {
    let uri = `riotdoc://${type}`;
    
    if (path) {
        uri += `/${path}`;
    }
    
    if (query && Object.keys(query).length > 0) {
        const params = new URLSearchParams(query);
        uri += `?${params.toString()}`;
    }
    
    return uri;
}
