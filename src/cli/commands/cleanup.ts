import { Command } from "commander";
import chalk from "chalk";

export interface CleanupOptions {
    draft?: string;
}

export function registerCleanupCommand(program: Command): void {
    program
        .command("cleanup [path]")
        .description("Light editing pass (grammar, clarity)")
        .option("-d, --draft <number>", "Target draft")
        .action(async (_path: string | undefined, _options: CleanupOptions) => {
            console.log(chalk.yellow("Cleanup command - AI integration pending"));
            console.log(chalk.gray("\nThis command will:"));
            console.log(chalk.gray("  1. Load draft"));
            console.log(chalk.gray("  2. Apply light editing for grammar and clarity"));
            console.log(chalk.gray("  3. Save cleaned version"));
        });
}
