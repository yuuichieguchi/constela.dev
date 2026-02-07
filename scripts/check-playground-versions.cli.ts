#!/usr/bin/env node
/**
 * CLI entry point for version validation script.
 * Checks if playground.json and ui/[slug].json CDN versions match package.json versions.
 *
 * Exit codes:
 *   0 - All versions match
 *   1 - Version mismatches found or error occurred
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { checkPlaygroundVersions } from './check-playground-versions.js';
import type { VersionMismatch } from './check-playground-versions.js';

interface ValidationTarget {
  label: string;
  path: string;
}

async function main(): Promise<void> {
  const projectRoot = resolve(import.meta.dirname, '..');
  const packageJsonPath = resolve(projectRoot, 'package.json');

  const targets: ValidationTarget[] = [
    {
      label: 'playground.json',
      path: resolve(projectRoot, 'src/routes/playground.json'),
    },
    {
      label: 'ui/[slug].json',
      path: resolve(projectRoot, 'src/routes/ui/[slug].json'),
    },
  ];

  try {
    const packageJsonContent = await readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent) as {
      dependencies: Record<string, string>;
    };

    const allMismatches: { label: string; mismatches: VersionMismatch[] }[] = [];

    for (const target of targets) {
      const content = await readFile(target.path, 'utf-8');
      const json = JSON.parse(content) as {
        externalImports: Record<string, string>;
      };

      const result = checkPlaygroundVersions(packageJson, json);

      if (!result.success) {
        allMismatches.push({
          label: target.label,
          mismatches: result.mismatches,
        });
      }
    }

    if (allMismatches.length === 0) {
      console.log(
        'All @constela package versions match between package.json and CDN URLs.',
      );
      process.exit(0);
    } else {
      console.error('Version mismatches found:');
      console.error('');
      for (const { label, mismatches } of allMismatches) {
        for (const mismatch of mismatches) {
          console.error(`  ${mismatch.package} (${label}):`);
          console.error(`    package.json: ${mismatch.packageJsonVersion}`);
          console.error(`    CDN URL:      ${mismatch.playgroundVersion}`);
          console.error('');
        }
      }
      console.error('Run `pnpm sync-cdn` to fix.');
      process.exit(1);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
    process.exit(1);
  }
}

main();
