import { defineConfig } from 'tsup';

export default defineConfig({
  // Entry point - the main TypeScript file to start bundling from
  entry: ['src/index.ts'],
  
  // Output format - 'esm' means ES Modules (modern JavaScript import/export)
  format: ['esm'],
  
  // Output directory - where the compiled JavaScript files will be placed
  outDir: 'dist',
  
  // Clean the output directory before each build (removes old files)
  clean: true,
  
  // Source maps - disabled for production (set to true for debugging)
  // Source maps help you debug by mapping compiled code back to original TypeScript
  sourcemap: false,
  
  // Minify - disabled to keep code readable
  // Set to true for production to reduce file size
  minify: false,
  
  // Generate TypeScript declaration files (.d.ts) - disabled since not needed for executables
  dts: false,
  
  // Code splitting - disabled to output a single file
  // When false, all code is bundled into one file
  splitting: false,
  
  // Bundle all dependencies into the output file
  // When true, imports are resolved and included in the output
  bundle: true,
  
  // External dependencies - these won't be bundled, users must install them
  // The MCP SDK is kept external because it's large and users will have it installed
  external: [
    '@modelcontextprotocol/sdk'
  ],
  
  // Banner - code to inject at the very top of the output file
  // The shebang tells Unix-like systems to execute this file with Node.js
  banner: {
    js: '#!/usr/bin/env node',
  },
});
