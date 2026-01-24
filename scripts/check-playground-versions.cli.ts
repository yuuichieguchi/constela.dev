#!/usr/bin/env node
/**
 * CLI entry point for version validation script.
 * Checks if playground.json CDN versions match package.json versions.
 *
 * Exit codes:
 *   0 - All versions match
 *   1 - Version mismatches found or error occurred
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { checkPlaygroundVersions } from './check-playground-versions.js';

async function main(): Promise<void> {
  const projectRoot = resolve(import.meta.dirname, '..');
  const packageJsonPath = resolve(projectRoot, 'package.json');
  const playgroundJsonPath = resolve(projectRoot, 'src/routes/playground.json');

  try {
    const [packageJsonContent, playgroundJsonContent] = await Promise.all([
      readFile(packageJsonPath, 'utf-8'),
      readFile(playgroundJsonPath, 'utf-8'),
    ]);

    const packageJson = JSON.parse(packageJsonContent) as { dependencies: Record<string, string> };
    const playgroundJson = JSON.parse(playgroundJsonContent) as { externalImports: Record<string, string> };

    const result = checkPlaygroundVersions(packageJson, playgroundJson);

    if (result.success) {
      console.log('All @constela package versions match between package.json and playground.json');
      process.exit(0);
    } else {
      console.error('Version mismatches found:');
      console.error('');
      for (const mismatch of result.mismatches) {
        console.error(`  ${mismatch.package}:`);
        console.error(`    package.json:    ${mismatch.packageJsonVersion}`);
        console.error(`    playground.json: ${mismatch.playgroundVersion}`);
        console.error('');
      }
      console.error('Please update playground.json CDN URLs to match package.json versions.');
      process.exit(1);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
    process.exit(1);
  }
}

main();
