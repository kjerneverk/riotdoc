import { Command } from "commander";
import chalk from "chalk";

export interface SpellcheckOptions {
    draft?: string;
}

export function registerSpellcheckCommand(program: Command): void {
    program
        .command("spellcheck [path]")
        .description("Fix spelling and grammar only")
        .option("-d, --draft <number>", "Target draft")
        .action(async (_path: string | undefined, _options: SpellcheckOptions) => {
            console.log(chalk.yellow("Spellcheck command - implementation pending"));
            console.log(chalk.gray("\nThis command will:"));
            console.log(chalk.gray("  1. Load draft"));
            console.log(chalk.gray("  2. Check spelling and basic grammar"));
            console.log(chalk.gray("  3. Report or fix issues"));
        });
}
