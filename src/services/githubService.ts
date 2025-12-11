export interface GitHubRepoStats {
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  lastUpdate: string;
  description: string;
  language: string | null;
  license: string | null;
}

export class GitHubService {
  private baseUrl = 'https://api.github.com';

  /**
   * Extract owner and repo name from GitHub URL
   * @param url - GitHub repository URL (e.g., https://github.com/anthropics/skills)
   * @returns { owner, repo } or null if invalid
   */
  private parseGitHubUrl(url: string): { owner: string; repo: string } | null {
    try {
      const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (match) {
        return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Fetch repository statistics from GitHub API
   * @param repoUrl - Full GitHub repository URL
   * @returns Repository statistics or null if fetch fails
   */
  async fetchRepoStats(repoUrl: string): Promise<GitHubRepoStats | null> {
    const parsed = this.parseGitHubUrl(repoUrl);
    if (!parsed) {
      console.error('Invalid GitHub URL:', repoUrl);
      return null;
    }

    const { owner, repo } = parsed;

    try {
      const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          // Add GitHub token if available (optional, increases rate limit)
          ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN && {
            'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
          }),
        },
        // Cache for 5 minutes
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.error('Repository not found:', repoUrl);
        } else if (response.status === 403) {
          console.error('GitHub API rate limit exceeded');
        } else {
          console.error('GitHub API error:', response.status, response.statusText);
        }
        return null;
      }

      const data = await response.json();

      return {
        stars: data.stargazers_count || 0,
        forks: data.forks_count || 0,
        watchers: data.watchers_count || 0,
        openIssues: data.open_issues_count || 0,
        lastUpdate: data.updated_at || data.pushed_at || '',
        description: data.description || '',
        language: data.language || null,
        license: data.license?.name || data.license?.spdx_id || null,
      };
    } catch (error) {
      console.error('Error fetching GitHub stats:', error);
      return null;
    }
  }

  /**
   * Fetch stats for multiple repositories in parallel
   * @param repoUrls - Array of GitHub repository URLs
   * @returns Map of URL to stats
   */
  async fetchMultipleRepoStats(repoUrls: string[]): Promise<Map<string, GitHubRepoStats | null>> {
    const results = await Promise.all(
      repoUrls.map(async (url) => {
        const stats = await this.fetchRepoStats(url);
        return { url, stats };
      })
    );

    return new Map(results.map(r => [r.url, r.stats]));
  }
}

export const githubService = new GitHubService();
