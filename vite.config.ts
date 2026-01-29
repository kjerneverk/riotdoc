import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { chmod, cp } from 'node:fs/promises';
import path from 'node:path';

export default defineConfig({
    build: {
        lib: {
            entry: {
                index: "src/index.ts",
                cli: "src/cli/cli.ts",
                bin: "src/cli/bin.ts",
                "mcp-server": "src/mcp/server.ts",
            },
            name: "riotdoc",
            formats: ["es"],
        },
        rollupOptions: {
            external: [
                "@modelcontextprotocol/sdk",
                "@modelcontextprotocol/sdk/server/mcp.js",
                "@modelcontextprotocol/sdk/server/stdio.js",
                "commander",
                "chalk",
                "js-yaml",
                "marked",
                "inquirer",
                "zod",
                "yaml",
                "riotprompt",
                "agentic",
                "execution",
                "node:fs",
                "node:path",
                "node:fs/promises",
                "node:os",
                "node:http",
                "node:url",
                "node:process",
                "node:readline",
                "node:async_hooks",
                "node:util",
                "node:crypto",
            ],
            output: {
                entryFileNames: "[name].js",
            },
            plugins: [
                {
                    name: 'chmod-bin-and-copy-prompts',
                    writeBundle: async () => {
                        // Make bin and mcp-server executable after build
                        const binPath = path.resolve('dist/bin.js');
                        const mcpServerPath = path.resolve('dist/mcp-server.js');
                        await chmod(binPath, 0o755);
                        await chmod(mcpServerPath, 0o755);
                        
                        // Copy prompt templates to dist
                        const promptsSource = path.resolve('src/mcp/prompts');
                        const promptsDest = path.resolve('dist/mcp/prompts');
                        await cp(promptsSource, promptsDest, { 
                            recursive: true,
                            filter: (src) => src.endsWith('.md')
                        });
                    }
                }
            ]
        },
        sourcemap: true,
        minify: false,
    },
    plugins: [
        dts({
            rollupTypes: true,
        }),
    ],
});
