/**
 * Objectives Resource Handler
 *
 * Provides document objectives via MCP resources
 */

 
import type { RiotdocUri, ObjectivesResource } from '../types.js';
import { loadObjectives } from '../../objectives/loader.js';
 

/**
 * Read objectives resource
 */
export async function readObjectivesResource(uri: RiotdocUri): Promise<ObjectivesResource> {
    const directory = uri.path || process.cwd();

    const objectives = await loadObjectives(directory);

    return {
        path: directory,
        primaryGoal: objectives.primaryGoal,
        secondaryGoals: objectives.secondaryGoals,
        keyTakeaways: objectives.keyTakeaways,
        callToAction: objectives.callToAction,
        emotionalArc: objectives.emotionalArc,
    };
}
