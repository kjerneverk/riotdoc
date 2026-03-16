/**
 * MCP Resource Handlers
 *
 * Registry pattern: resources array + Map-based dispatch.
 */

import type { McpResource } from '../types.js';
import { parseRiotdocUri } from '../uri.js';
import { readConfigResource } from './config.js';
import { readStatusResource } from './status.js';
import { readDocumentResource } from './document.js';
import { readOutlineResource } from './outline.js';
import { readObjectivesResource } from './objectives.js';
import { readVoiceResource } from './voice.js';
import { readVoiceProfileResource } from './voice-profile.js';
import { readStyleReportResource } from './style-report.js';
import { readGuidanceResource } from './guidance.js';
import { readAssetsResource } from './assets.js';
import { readCorpusResource } from './corpus.js';
import { readContextResource } from './context.js';

const resourceHandlers: Record<string, (parsed: any) => Promise<unknown>> = {
    config: readConfigResource,
    status: readStatusResource,
    document: readDocumentResource,
    outline: readOutlineResource,
    objectives: readObjectivesResource,
    voice: readVoiceResource,
    'voice-profile': readVoiceProfileResource,
    'style-report': readStyleReportResource,
    guidance: readGuidanceResource,
    assets: readAssetsResource,
    corpus: readCorpusResource,
    context: readContextResource,
};

/**
 * All registered resources
 */
export const resources: McpResource[] = [
    {
        uri: 'riotdoc://config',
        name: 'Configuration',
        description: 'Loads riotdoc configuration from riotdoc.yaml.',
        mimeType: 'application/json',
        handler: async (parsed) => readConfigResource(parsed),
    },
    {
        uri: 'riotdoc://status',
        name: 'Document Status',
        description: 'Gets the current document status including title, type, dates, and progress.',
        mimeType: 'application/json',
        handler: async (parsed) => readStatusResource(parsed),
    },
    {
        uri: 'riotdoc://document',
        name: 'Complete Document',
        description: 'Loads complete document state including config, voice, objectives, drafts, and evidence.',
        mimeType: 'application/json',
        handler: async (parsed) => readDocumentResource(parsed),
    },
    {
        uri: 'riotdoc://outline',
        name: 'Document Outline',
        description: 'Retrieves the document outline from OUTLINE.md.',
        mimeType: 'application/json',
        handler: async (parsed) => readOutlineResource(parsed),
    },
    {
        uri: 'riotdoc://objectives',
        name: 'Document Objectives',
        description: 'Loads document objectives from OBJECTIVES.md.',
        mimeType: 'application/json',
        handler: async (parsed) => readObjectivesResource(parsed),
    },
    {
        uri: 'riotdoc://voice',
        name: 'Voice Configuration',
        description: 'Retrieves voice and tone configuration from voice/tone.md.',
        mimeType: 'application/json',
        handler: async (parsed) => readVoiceResource(parsed),
    },
    {
        uri: 'riotdoc://voice-profile',
        name: 'Resolved Voice Profile',
        description: 'Returns the three-layer resolved voice profile (voice, tone, rhetoric) with source tracking.',
        mimeType: 'application/json',
        handler: async (parsed) => readVoiceProfileResource(parsed),
    },
    {
        uri: 'riotdoc://style-report',
        name: 'Style Validation Report',
        description: 'Gets style validation results for the document.',
        mimeType: 'application/json',
        handler: async (parsed) => readStyleReportResource(parsed),
    },
    {
        uri: 'riotdoc://guidance',
        name: 'Guidance Sources',
        description: 'Returns all resolved guidance sources for the project with metadata and token estimates.',
        mimeType: 'application/json',
        handler: async (parsed) => readGuidanceResource(parsed),
    },
    {
        uri: 'riotdoc://assets',
        name: 'Asset Manifest',
        description: 'Returns the asset manifest with all registered assets.',
        mimeType: 'application/json',
        handler: async (parsed) => readAssetsResource(parsed),
    },
    {
        uri: 'riotdoc://corpus',
        name: 'Corpus Index',
        description: 'Returns the indexed corpus of existing documents.',
        mimeType: 'application/json',
        handler: async (parsed) => readCorpusResource(parsed),
    },
    {
        uri: 'riotdoc://context',
        name: 'Assembled Writing Context',
        description: 'Returns the full assembled writing context combining voice, guidance, and corpus.',
        mimeType: 'application/json',
        handler: async (parsed) => readContextResource(parsed),
    },
];

/**
 * Backward-compatible function to get resources list
 */
export function getResources(): McpResource[] {
    return resources;
}

/**
 * Read a resource by URI using Map-based dispatch
 */
export async function readResource(uri: string): Promise<unknown> {
    const parsed = parseRiotdocUri(uri);
    const handler = resourceHandlers[parsed.type];
    if (!handler) {
        throw new Error(`Unknown resource type: ${parsed.type}`);
    }
    return handler(parsed);
}

export {
    readConfigResource,
    readStatusResource,
    readDocumentResource,
    readOutlineResource,
    readObjectivesResource,
    readVoiceResource,
    readVoiceProfileResource,
    readStyleReportResource,
    readGuidanceResource,
    readAssetsResource,
    readCorpusResource,
    readContextResource,
};
