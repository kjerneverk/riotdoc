/**
 * Voice Resource Handler
 *
 * Provides voice configuration via MCP resources
 */

 
import type { RiotdocUri, VoiceResource } from '../types.js';
import { loadVoice } from '../../voice/loader.js';
 

/**
 * Read voice resource
 */
export async function readVoiceResource(uri: RiotdocUri): Promise<VoiceResource> {
    const directory = uri.path || process.cwd();

    const voice = await loadVoice(directory);

    return {
        path: directory,
        tone: voice.tone,
        pointOfView: voice.pointOfView,
        styleNotes: voice.styleNotes,
        avoid: voice.avoid,
        examplePhrases: voice.examplePhrases,
    };
}
