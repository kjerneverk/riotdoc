import { Command } from "commander";
import chalk from "chalk";
import { resolve } from "node:path";
import { loadOutline, buildOutlinePrompt } from "../../outline/generator.js";
import { loadDocument } from "../../workspace/loader.js";
import { loadVoice } from "../../voice/loader.js";
import { loadObjectives } from "../../objectives/loader.js";

export interface OutlineOptions {
    generate?: boolean;
    edit?: boolean;
}

export function registerOutlineCommand(program: Command): void {
    program
        .command("outline [path]")
        .description("Generate or edit document outline")
        .option("-g, --generate", "Generate outline with AI")
        .option("-e, --edit", "Open outline for editing")
        .action(async (pathArg: string | undefined, options: OutlineOptions) => {
            try {
                const workspacePath = resolve(pathArg || process.cwd());
                
                // Load document state
                const doc = await loadDocument(workspacePath);
                if (!doc) {
                    console.error(chalk.red("Not a RiotDoc workspace"));
                    process.exit(1);
                }
                
                if (options.generate) {
                    // Generate outline with AI
                    console.log(chalk.cyan("Generating outline..."));
                    
                    const voice = await loadVoice(workspacePath);
                    const objectives = await loadObjectives(workspacePath);
                    
                    const prompt = buildOutlinePrompt(objectives, voice, doc.config.type);
                    
                    // TODO: Call AI provider
                    console.log(chalk.yellow("\nOutline generation prompt:"));
                    console.log(chalk.gray(prompt));
                    console.log(chalk.yellow("\n(AI integration pending - edit OUTLINE.md manually)"));
                    
                } else if (options.edit) {
                    // Open in editor
                    const { spawn } = await import("node:child_process");
                    const editor = process.env.EDITOR || "vim";
                    const outlinePath = `${workspacePath}/OUTLINE.md`;
                    
                    spawn(editor, [outlinePath], { stdio: "inherit" });
                    
                } else {
                    // Show current outline
                    const outline = await loadOutline(workspacePath);
                    console.log(chalk.cyan("\n📋 Current Outline:\n"));
                    console.log(outline);
                    
                    console.log(chalk.gray("\nOptions:"));
                    console.log(chalk.gray("  --generate  Generate outline with AI"));
                    console.log(chalk.gray("  --edit      Open outline in editor"));
                }
                
            } catch (error) {
                console.error(chalk.red("Failed:"), error);
                process.exit(1);
            }
        });
}
