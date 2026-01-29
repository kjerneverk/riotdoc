/**
 * Config Resource Handler
 *
 * Provides access to riotdoc configuration via MCP resources
 */

 
import type { RiotdocUri, ConfigResource } from '../types.js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';
 

/**
 * Read configuration resource
 */
export async function readConfigResource(uri: RiotdocUri): Promise<ConfigResource> {
    const directory = uri.path || process.cwd();
    const configPath = join(directory, 'riotdoc.yaml');

    try {
        const content = await readFile(configPath, 'utf-8');
        const config = parse(content);

        return {
            path: directory,
            exists: true,
            config,
        };
    } catch {
        return {
            path: directory,
            exists: false,
            config: undefined,
        };
    }
}
