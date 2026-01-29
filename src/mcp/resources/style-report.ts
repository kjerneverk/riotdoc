/**
 * Style Report Resource Handler
 *
 * Provides style validation results via MCP resources
 */

 
import type { RiotdocUri, StyleReportResource } from '../types.js';
 

/**
 * Read style report resource
 */
export async function readStyleReportResource(uri: RiotdocUri): Promise<StyleReportResource> {
    const directory = uri.path || process.cwd();

    // TODO: Implement style validation
    // For now, return empty report
    return {
        path: directory,
        issues: [],
        summary: {
            errors: 0,
            warnings: 0,
            info: 0,
        },
    };
}
