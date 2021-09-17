/**
 * Convert a file path on the current system to a file path that can be used on Linux
 *
 * Takes the current OS' file separator and replaces all of them with a '/'.
 *
 * Relevant if the current system is a Windows machine but is generating
 * commands for a Linux CodeBuild image.
 */
export declare function toPosixPath(osPath: string, currentSep?: string): string;
