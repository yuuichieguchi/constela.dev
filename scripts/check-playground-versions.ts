/**
 * Version validation script that checks if playground.json CDN versions
 * match package.json versions for @constela packages.
 */

/**
 * Version mismatch info
 */
export interface VersionMismatch {
  package: string;
  packageJsonVersion: string;
  playgroundVersion: string;
}

/**
 * Result of version check
 */
export interface VersionCheckResult {
  success: boolean;
  mismatches: VersionMismatch[];
}

/**
 * Extract version from CDN URL
 * @param cdnUrl - URL like "https://cdn.jsdelivr.net/npm/@constela/core@0.14.0/+esm"
 * @returns version string like "0.14.0" or null if invalid
 */
export function extractVersionFromCdnUrl(cdnUrl: string): string | null {
  // Match pattern: package@version (handles both scoped and non-scoped packages)
  // Examples:
  //   @constela/core@0.14.0/+esm -> 0.14.0
  //   monaco-editor@0.52.0/+esm -> 0.52.0
  //   @constela/runtime@0.17.1 -> 0.17.1
  const match = cdnUrl.match(/@(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/);
  if (match) {
    return match[1];
  }
  return null;
}

/**
 * Parse package.json version string (strip ^, ~, >= prefixes)
 * @param version - version string like "^0.14.0"
 * @returns clean version like "0.14.0"
 */
export function parsePackageJsonVersion(version: string): string {
  // Remove common version prefixes: ^, ~, >=, >, <=, <, =
  return version.replace(/^[\^~]|^>=|^>|^<=|^<|^=/, '');
}

/**
 * Check if playground.json CDN versions match package.json versions
 * Only checks @constela packages
 */
export function checkPlaygroundVersions(
  packageJson: { dependencies: Record<string, string> },
  playgroundJson: { externalImports: Record<string, string> }
): VersionCheckResult {
  const mismatches: VersionMismatch[] = [];

  for (const [packageName, version] of Object.entries(packageJson.dependencies)) {
    // Only check @constela packages
    if (!packageName.startsWith('@constela/')) {
      continue;
    }

    // Skip if package not in playground.json
    const cdnUrl = playgroundJson.externalImports[packageName];
    if (!cdnUrl) {
      continue;
    }

    const packageJsonVersion = parsePackageJsonVersion(version);
    const playgroundVersion = extractVersionFromCdnUrl(cdnUrl);

    if (playgroundVersion && packageJsonVersion !== playgroundVersion) {
      mismatches.push({
        package: packageName,
        packageJsonVersion,
        playgroundVersion,
      });
    }
  }

  return {
    success: mismatches.length === 0,
    mismatches,
  };
}
