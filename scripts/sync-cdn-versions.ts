/**
 * CDN version sync script that updates externalImports CDN URLs
 * to match package.json versions for @constela packages.
 */

import {
  extractVersionFromCdnUrl,
  parsePackageJsonVersion,
} from './check-playground-versions.js';

/**
 * Build a jsdelivr CDN URL for a package
 * @param packageName - Package name (e.g. "@constela/core" or "monaco-editor")
 * @param version - Version string (e.g. "0.19.0")
 * @returns CDN URL like "https://cdn.jsdelivr.net/npm/@constela/core@0.19.0/+esm"
 */
export function buildCdnUrl(packageName: string, version: string): string {
  return `https://cdn.jsdelivr.net/npm/${packageName}@${version}/+esm`;
}

/**
 * Sync externalImports CDN versions to match package.json versions.
 * Only updates @constela packages that exist in both externalImports and package.json.
 * Does not mutate the original externalImports object.
 */
export function syncCdnVersions(
  packageJson: { dependencies: Record<string, string> },
  externalImports: Record<string, string>,
): {
  externalImports: Record<string, string>;
  updated: string[];
  skipped: string[];
} {
  const result: Record<string, string> = {};
  const updated: string[] = [];
  const skipped: string[] = [];

  for (const [packageName, cdnUrl] of Object.entries(externalImports)) {
    if (!packageName.startsWith('@constela/')) {
      skipped.push(packageName);
      result[packageName] = cdnUrl;
      continue;
    }

    const depVersion = packageJson.dependencies[packageName];
    if (!depVersion) {
      skipped.push(packageName);
      result[packageName] = cdnUrl;
      continue;
    }

    const targetVersion = parsePackageJsonVersion(depVersion);
    const currentVersion = extractVersionFromCdnUrl(cdnUrl);

    if (currentVersion !== targetVersion) {
      result[packageName] = buildCdnUrl(packageName, targetVersion);
      updated.push(packageName);
    } else {
      result[packageName] = cdnUrl;
    }
  }

  return { externalImports: result, updated, skipped };
}
