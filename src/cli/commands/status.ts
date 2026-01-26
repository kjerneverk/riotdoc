import { Command } from "commander";
import chalk from "chalk";
import { resolve } from "node:path";
import { loadDocument } from "../../workspace/loader.js";

export function registerStatusCommand(program: Command): void {
    program
        .command("status [path]")
        .description("Show document status")
        .action(async (pathArg: string | undefined) => {
            try {
                const workspacePath = resolve(pathArg || process.cwd());
                
                const doc = await loadDocument(workspacePath);
                if (!doc) {
                    console.error(chalk.red("Not a RiotDoc workspace"));
                    process.exit(1);
                }
                
                console.log(chalk.cyan("\n📊 Document Status\n"));
                console.log(chalk.gray(`Title: ${doc.config.title}`));
                console.log(chalk.gray(`Type: ${doc.config.type}`));
                console.log(chalk.gray(`Status: ${doc.config.status}`));
                console.log(chalk.gray(`Created: ${doc.config.createdAt.toLocaleDateString()}`));
                console.log(chalk.gray(`Updated: ${doc.config.updatedAt.toLocaleDateString()}`));
                
                if (doc.config.targetWordCount) {
                    console.log(chalk.gray(`Target: ${doc.config.targetWordCount} words`));
                }
                
                console.log(chalk.cyan("\n📁 Workspace: ") + chalk.gray(workspacePath));
                
            } catch (error) {
                console.error(chalk.red("Failed:"), error);
                process.exit(1);
            }
        });
}
