declare module '@semantic-release/commit-analyzer' {
  type ReleaseType = 'major' | 'minor' | 'patch';

  interface CommitAnalyzerContext {
    commits: Array<{ hash: string; message: string }>;
    cwd: string;
    logger: { log: (...values: unknown[]) => void };
  }

  export function analyzeCommits(
    pluginConfig: Record<string, unknown>,
    context: CommitAnalyzerContext,
  ): Promise<ReleaseType | null>;
}
