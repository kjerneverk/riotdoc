import { Command } from "commander";
import chalk from "chalk";

export interface DraftOptions {
    level?: string;
    from?: string;
}

export function registerDraftCommand(program: Command): void {
    program
        .command("draft [path]")
        .description("Create a new draft")
        .option("-l, --level <level>", "AI assistance level (generate, expand, revise)", "expand")
        .option("-f, --from <draft>", "Base on existing draft")
        .action(async (_path: string | undefined, _options: DraftOptions) => {
            console.log(chalk.yellow("Draft command - AI integration pending"));
            console.log(chalk.gray("\nThis command will:"));
            console.log(chalk.gray("  1. Load outline and objectives"));
            console.log(chalk.gray("  2. Apply voice and style rules"));
            console.log(chalk.gray("  3. Generate draft with specified assistance level"));
            console.log(chalk.gray("  4. Save to drafts/ directory"));
        });
}
