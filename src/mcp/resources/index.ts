/**
 * MCP Resource Handlers
 *
 * Provides read-only access to riotdoc data via MCP resources
 */

 
import type { McpResource } from '../types.js';
import { parseRiotdocUri } from '../uri.js';
import { readConfigResource } from './config.js';
import { readStatusResource } from './status.js';
import { readDocumentResource } from './document.js';
import { readOutlineResource } from './outline.js';
import { readObjectivesResource } from './objectives.js';
import { readVoiceResource } from './voice.js';
import { readStyleReportResource } from './style-report.js';
 

/**
 * Get all available resources
 */
export function getResources(): McpResource[] {
    return [
        {
            uri: 'riotdoc://config',
            name: 'Configuration',
            description: 'Loads riotdoc configuration from riotdoc.yaml. ' +
                'URI format: riotdoc://config[/path/to/workspace]. ' +
                'If no path is provided, uses current working directory. ' +
                'Returns: { path: string, exists: boolean, config: object }. ' +
                'The config object includes document metadata, type, status, and settings.',
            mimeType: 'application/json',
        },
        {
            uri: 'riotdoc://status',
            name: 'Document Status',
            description: 'Gets the current document status including title, type, dates, and progress. ' +
                'URI format: riotdoc://status[/path/to/workspace]. ' +
                'Returns: { path, title, type, status, createdAt, updatedAt, targetWordCount, audience }. ' +
                'Use this to check the state of a document before operations.',
            mimeType: 'application/json',
        },
        {
            uri: 'riotdoc://document',
            name: 'Complete Document',
            description: 'Loads complete document state including config, voice, objectives, drafts, and evidence. ' +
                'URI format: riotdoc://document[/path/to/workspace]. ' +
                'Returns comprehensive document information. ' +
                'Use this to get a full snapshot of the document workspace.',
            mimeType: 'application/json',
        },
        {
            uri: 'riotdoc://outline',
            name: 'Document Outline',
            description: 'Retrieves the document outline from OUTLINE.md. ' +
                'URI format: riotdoc://outline[/path/to/workspace]. ' +
                'Returns: { path, content, exists }. ' +
                'The outline provides the structural framework for the document.',
            mimeType: 'application/json',
        },
        {
            uri: 'riotdoc://objectives',
            name: 'Document Objectives',
            description: 'Loads document objectives from OBJECTIVES.md. ' +
                'URI format: riotdoc://objectives[/path/to/workspace]. ' +
                'Returns: { path, primaryGoal, secondaryGoals, keyTakeaways, callToAction, emotionalArc }. ' +
                'Objectives define what the document aims to achieve.',
            mimeType: 'application/json',
        },
        {
            uri: 'riotdoc://voice',
            name: 'Voice Configuration',
            description: 'Retrieves voice and tone configuration from voice/tone.md. ' +
                'URI format: riotdoc://voice[/path/to/workspace]. ' +
                'Returns: { path, tone, pointOfView, styleNotes, avoid, examplePhrases }. ' +
                'Voice configuration defines the writing style and tone.',
            mimeType: 'application/json',
        },
        {
            uri: 'riotdoc://style-report',
            name: 'Style Validation Report',
            description: 'Gets style validation results for the document. ' +
                'URI format: riotdoc://style-report[/path/to/workspace]. ' +
                'Returns: { path, issues: Array<{line, column, severity, message, rule}>, summary }. ' +
                'Use this to check for style violations and writing quality issues.',
            mimeType: 'application/json',
        },
    ];
}

/**
 * Read a resource by URI
 */
export async function readResource(uri: string): Promise<any> {
    const parsed = parseRiotdocUri(uri);

    switch (parsed.type) {
        case 'config':
            return readConfigResource(parsed);
        case 'status':
            return readStatusResource(parsed);
        case 'document':
            return readDocumentResource(parsed);
        case 'outline':
            return readOutlineResource(parsed);
        case 'objectives':
            return readObjectivesResource(parsed);
        case 'voice':
            return readVoiceResource(parsed);
        case 'style-report':
            return readStyleReportResource(parsed);
        default:
            throw new Error(`Unknown resource type: ${parsed.type}`);
    }
}

// Re-export individual handlers for testing
export {
    readConfigResource,
    readStatusResource,
    readDocumentResource,
    readOutlineResource,
    readObjectivesResource,
    readVoiceResource,
    readStyleReportResource,
};
