import { z } from "zod";

/**
 * Voice profile path schema — points to the three markdown files
 * that define an author's voice, tone, and rhetorical patterns.
 *
 * Modeled after the pattern observed in slop-codex (author-voice.md,
 * author-tone.md, author-rhetorical-patterns.md) and the blog project's
 * identical three-file system.
 */
export const VoiceProfileSchema = z.object({
    voice: z.string().describe("Path to voice.md defining the author's intellectual perspective and posture"),
    tone: z.string().describe("Path to tone.md mapping tonal registers and their triggers"),
    rhetoric: z.string().describe("Path to rhetoric.md documenting reproducible rhetorical structures"),
});

export type VoiceProfile = z.infer<typeof VoiceProfileSchema>;

/**
 * A resolved voice profile with loaded content and source tracking.
 * The source field tracks where each layer came from when inheritance
 * is in play (shared author profile -> project override).
 */
export interface ResolvedVoiceProfile {
    voice: string;
    tone: string;
    rhetoric: string;
    sources: {
        voice: VoiceLayerSource;
        tone: VoiceLayerSource;
        rhetoric: VoiceLayerSource;
    };
}

export type VoiceLayerSource = "project" | "shared" | "default";

/**
 * Default starter content for a new voice.md file.
 */
export const DEFAULT_VOICE_CONTENT = `# Author Voice

## Perspective

_Describe the author's intellectual perspective and posture..._

## Core Worldview

_What assumptions and beliefs shape the writing?_

## Relationship to Reader

_How does the author relate to the reader? (peer, guide, teacher, critic)_
`;

/**
 * Default starter content for a new tone.md file.
 */
export const DEFAULT_TONE_CONTENT = `# Tonal Register

## Default Tone

_Describe the primary tonal register (e.g., conversational, formal, sardonic)..._

## Tonal Shifts

_When and why does tone shift? What triggers a change in register?_

## Tone Signals

_What linguistic markers indicate each tonal register?_
`;

/**
 * Default starter content for a new rhetoric.md file.
 */
export const DEFAULT_RHETORIC_CONTENT = `# Rhetorical Patterns

## Primary Structures

_Describe the most common essay/chapter/section structures..._

## Mechanical Rules

_What consistent patterns appear in sentence construction, paragraph rhythm, etc.?_

## Devices

_What rhetorical devices are used frequently? (analogies, callbacks, reframing, etc.)_
`;
