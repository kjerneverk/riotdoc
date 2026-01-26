import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import { join, resolve } from "node:path";
import { stat } from "node:fs/promises";
import { createWorkspace } from "../../workspace/creator.js";
import type { DocumentConfig } from "../../types.js";

export interface CreateOptions {
    type?: DocumentConfig["type"];
    title?: string;
    path?: string;
}

const DOCUMENT_TYPES = [
    { name: "Blog Post", value: "blog-post" },
    { name: "Podcast Script", value: "podcast-script" },
    { name: "Technical Documentation", value: "technical-doc" },
    { name: "Newsletter", value: "newsletter" },
    { name: "Custom", value: "custom" },
];

/**
 * Prompt for document type
 */
async function promptForType(): Promise<DocumentConfig["type"]> {
    const { type } = await inquirer.prompt([{
        type: "list",
        name: "type",
        message: "Document type:",
        choices: DOCUMENT_TYPES,
    }]);
    return type;
}

/**
 * Prompt for document title
 */
async function promptForTitle(name: string): Promise<string> {
    const defaultTitle = name
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    
    const { title } = await inquirer.prompt([{
        type: "input",
        name: "title",
        message: "Document title:",
        default: defaultTitle,
    }]);
    return title;
}

/**
 * Prompt for primary goal
 */
async function promptForGoal(): Promise<string> {
    const { goal } = await inquirer.prompt([{
        type: "input",
        name: "goal",
        message: "What is the primary goal of this document?",
    }]);
    return goal;
}

/**
 * Prompt for target audience
 */
async function promptForAudience(): Promise<string> {
    const { audience } = await inquirer.prompt([{
        type: "input",
        name: "audience",
        message: "Who is the target audience?",
    }]);
    return audience;
}

/**
 * Check if path already exists
 */
async function pathExists(path: string): Promise<boolean> {
    try {
        await stat(path);
        return true;
    } catch {
        return false;
    }
}

/**
 * Register the create command
 */
export function registerCreateCommand(program: Command): void {
    program
        .command("create <name>")
        .description("Create a new document workspace")
        .option("-t, --type <type>", "Document type (blog-post, podcast-script, technical-doc, newsletter, custom)")
        .option("-T, --title <title>", "Document title")
        .option("-p, --path <path>", "Base path (default: current directory)")
        .action(async (name: string, options: CreateOptions) => {
            try {
                const basePath = options.path || process.cwd();
                const workspacePath = resolve(join(basePath, name));
                
                // Check if already exists
                if (await pathExists(workspacePath)) {
                    console.error(chalk.red(`Directory already exists: ${workspacePath}`));
                    process.exit(1);
                }
                
                console.log(chalk.cyan("\n📝 Creating new document workspace\n"));
                
                // Get document type
                const type = options.type as DocumentConfig["type"] || await promptForType();
                
                // Get title
                const title = options.title || await promptForTitle(name);
                
                // Get initial objectives
                const goal = await promptForGoal();
                const audience = await promptForAudience();
                
                // Create workspace
                console.log(chalk.gray("\nCreating workspace..."));
                
                await createWorkspace({
                    path: workspacePath,
                    id: name,
                    title,
                    type,
                    objectives: {
                        primaryGoal: goal,
                        secondaryGoals: [],
                        keyTakeaways: [],
                    },
                });
                
                // Note: audience is collected but not yet stored in config
                // This will be added when we implement config management
                if (audience) {
                    // Future: store audience in config
                }
                
                console.log(chalk.green(`\n✅ Document workspace created: ${workspacePath}`));
                
                // Show next steps
                console.log(chalk.cyan("\n📋 Next steps:\n"));
                console.log(chalk.gray(`   1. Edit voice/tone.md to define your writing voice`));
                console.log(chalk.gray(`   2. Edit OBJECTIVES.md to refine your goals`));
                console.log(chalk.gray(`   3. Run: riotdoc outline ${name}`));
                console.log(chalk.gray(`   4. Run: riotdoc draft ${name}`));
                
                console.log(chalk.cyan(`\n📁 Workspace structure:`));
                console.log(chalk.gray(`   ${name}/`));
                console.log(chalk.gray(`   ├── riotdoc.yaml      # Configuration`));
                console.log(chalk.gray(`   ├── OBJECTIVES.md     # Goals and objectives`));
                console.log(chalk.gray(`   ├── OUTLINE.md        # Document outline`));
                console.log(chalk.gray(`   ├── voice/            # Voice and style`));
                console.log(chalk.gray(`   ├── evidence/         # Research and references`));
                console.log(chalk.gray(`   ├── drafts/           # Draft iterations`));
                console.log(chalk.gray(`   └── export/           # Final output`));
                
            } catch (error) {
                console.error(chalk.red("Failed to create workspace:"), error);
                process.exit(1);
            }
        });
}
