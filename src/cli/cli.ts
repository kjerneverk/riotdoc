import { Command } from "commander";
import chalk from "chalk";
import { registerCreateCommand } from "./commands/create.js";
import { registerOutlineCommand } from "./commands/outline.js";
import { registerDraftCommand } from "./commands/draft.js";
import { registerReviseCommand } from "./commands/revise.js";
import { registerCleanupCommand } from "./commands/cleanup.js";
import { registerSpellcheckCommand } from "./commands/spellcheck.js";
import { registerExportCommand } from "./commands/export.js";
import { registerStatusCommand } from "./commands/status.js";

const VERSION = "1.0.0-dev.0";

/**
 * Create the CLI program
 */
export function createProgram(): Command {
    const program = new Command();
    
    program
        .name("riotdoc")
        .description("Structured document creation with AI assistance")
        .version(VERSION)
        .configureHelp({
            sortSubcommands: true,
        });
    
    // Register commands (implemented in subsequent steps)
    registerCreateCommand(program);
    registerOutlineCommand(program);
    registerDraftCommand(program);
    registerReviseCommand(program);
    registerCleanupCommand(program);
    registerSpellcheckCommand(program);
    registerExportCommand(program);
    registerStatusCommand(program);
    
    // Global options
    program
        .option("-v, --verbose", "Verbose output")
        .option("--json", "Output as JSON")
        .option("--no-color", "Disable colored output");
    
    // Handle unknown commands
    program.on("command:*", () => {
        console.error(chalk.red(`Unknown command: ${program.args.join(" ")}`));
        console.log(`Run ${chalk.cyan("riotdoc --help")} for usage.`);
        process.exit(1);
    });
    
    return program;
}

// All commands are now imported from separate files
