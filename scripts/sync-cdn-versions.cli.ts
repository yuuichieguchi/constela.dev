#!/usr/bin/env node
/**
 * CLI entry point for CDN version sync script.
 * Syncs playground.json and ui/[slug].json CDN versions to match package.json.
 *
 * Usage: npx tsx scripts/sync-cdn-versions.cli.ts
 *
 * Exit codes:
 *   0 - Sync completed (or already in sync)
 *   1 - Error occurred
 */

import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { syncCdnVersions } from './sync-cdn-versions.js';

interface JsonFileWithExternalImports {
  externalImports: Record<string, string>;
  [key: string]: unknown;
}

interface SyncTarget {
  label: string;
  path: string;
}

async function main(): Promise<void> {
  const projectRoot = resolve(import.meta.dirname, '..');
  const packageJsonPath = resolve(projectRoot, 'package.json');

  const targets: SyncTarget[] = [
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

    let totalUpdated = 0;

    for (const target of targets) {
      const content = await readFile(target.path, 'utf-8');
      const json = JSON.parse(content) as JsonFileWithExternalImports;

      const { externalImports, updated } = syncCdnVersions(
        packageJson,
        json.externalImports,
      );

      if (updated.length > 0) {
        json.externalImports = externalImports;
        await writeFile(
          target.path,
          JSON.stringify(json, null, 2) + '\n',
          'utf-8',
        );
        for (const pkg of updated) {
          console.log(`  Updated ${pkg} in ${target.label}`);
        }
        totalUpdated += updated.length;
      }
    }

    if (totalUpdated === 0) {
      console.log('All CDN versions already in sync.');
    } else {
      console.log(`\nSynced ${totalUpdated} CDN URL(s).`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
    process.exit(1);
  }
}

main();
