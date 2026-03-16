/**
 * Voice Profile Resource Handler
 *
 * Provides resolved three-layer voice profile via MCP resources.
 */

import { join } from 'node:path';
import type { RiotdocUri } from '../types.js';
import { resolveVoiceProfile } from '../../voice/profile-loader.js';

/**
 * Read the resolved voice profile for a project path.
 * Returns all three layers (voice, tone, rhetoric) with source tracking.
 */
export async function readVoiceProfileResource(uri: RiotdocUri) {
    const directory = uri.path || process.cwd();
    const projectVoiceDir = join(directory, 'voice');

    const profile = await resolveVoiceProfile({
        projectVoiceDir,
        override: false,
    });

    return {
        path: directory,
        voice: { content: profile.voice, source: profile.sources.voice },
        tone: { content: profile.tone, source: profile.sources.tone },
        rhetoric: { content: profile.rhetoric, source: profile.sources.rhetoric },
    };
}
