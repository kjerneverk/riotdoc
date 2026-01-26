import { Command } from "commander";
import chalk from "chalk";

export interface ReviseOptions {
    draft?: string;
    message?: string;
}

export function registerReviseCommand(program: Command): void {
    program
        .command("revise [path]")
        .description("Add revision feedback")
        .option("-d, --draft <number>", "Target draft number")
        .option("-m, --message <message>", "Revision feedback")
        .action(async (_path: string | undefined, _options: ReviseOptions) => {
            console.log(chalk.yellow("Revise command - implementation pending"));
            console.log(chalk.gray("\nThis command will:"));
            console.log(chalk.gray("  1. Load specified draft"));
            console.log(chalk.gray("  2. Collect revision feedback"));
            console.log(chalk.gray("  3. Save to revisions/ directory"));
        });
}
