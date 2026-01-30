/**
 * Timeline utility functions for filtering and querying timeline events
 * 
 * Copied from RiotPlan (src/mcp/tools/timeline-utils.ts)
 * Original source: /Users/tobrien/gitw/kjerneverk/riotplan/src/mcp/tools/timeline-utils.ts
 * No modifications needed - works for document events too
 */

import type { TimelineEvent, TimelineEventType, NarrativeChunkEvent } from '../../types.js';

/**
 * Filter timeline by event type
 */
export function filterTimelineByType(
    timeline: TimelineEvent[],
    type: TimelineEventType
): TimelineEvent[] {
    return timeline.filter(event => event.type === type);
}

/**
 * Get all narrative chunks from timeline
 */
export function getNarrativeChunks(timeline: TimelineEvent[]): NarrativeChunkEvent[] {
    return filterTimelineByType(timeline, 'narrative_chunk') as NarrativeChunkEvent[];
}

/**
 * Get events since a specific timestamp
 */
export function getEventsSince(
    timeline: TimelineEvent[],
    sinceTimestamp: string
): TimelineEvent[] {
    const sinceTime = new Date(sinceTimestamp).getTime();
    return timeline.filter(event => new Date(event.timestamp).getTime() >= sinceTime);
}

/**
 * Get events since last checkpoint
 */
export function getEventsSinceLastCheckpoint(timeline: TimelineEvent[]): TimelineEvent[] {
    const lastCheckpointIndex = timeline.findLastIndex(e => e.type === 'checkpoint_created');
    if (lastCheckpointIndex === -1) {
        return timeline;
    }
    return timeline.slice(lastCheckpointIndex + 1);
}

/**
 * Get all checkpoints from timeline
 */
export function getCheckpoints(timeline: TimelineEvent[]): TimelineEvent[] {
    return filterTimelineByType(timeline, 'checkpoint_created');
}

/**
 * Get timeline statistics
 */
export function getTimelineStats(timeline: TimelineEvent[]): {
    total: number;
    byType: Record<string, number>;
    firstEvent?: string;
    lastEvent?: string;
    checkpointCount: number;
    narrativeChunkCount: number;
} {
    const byType: Record<string, number> = {};
    
    for (const event of timeline) {
        byType[event.type] = (byType[event.type] || 0) + 1;
    }
    
    return {
        total: timeline.length,
        byType,
        firstEvent: timeline[0]?.timestamp,
        lastEvent: timeline[timeline.length - 1]?.timestamp,
        checkpointCount: byType['checkpoint_created'] || 0,
        narrativeChunkCount: byType['narrative_chunk'] || 0,
    };
}

/**
 * Format timeline for display
 */
export function formatTimelineEvent(event: TimelineEvent): string {
    const time = new Date(event.timestamp).toLocaleString();
    const data = JSON.stringify(event.data, null, 2);
    return `## ${time} - ${event.type}\n\n\`\`\`json\n${data}\n\`\`\`\n`;
}

/**
 * Format multiple timeline events
 */
export function formatTimeline(events: TimelineEvent[]): string {
    return events.map(formatTimelineEvent).join('\n');
}
