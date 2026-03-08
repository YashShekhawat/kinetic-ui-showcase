import { Base64 } from 'js-base64';

const REPO = import.meta.env.VITE_GITHUB_REPO as string;
const BRANCH = import.meta.env.VITE_GITHUB_BRANCH as string;
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string;

const headers: Record<string, string> = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
  Accept: 'application/vnd.github.v3+json',
};

export async function getFile(path: string): Promise<{ content: string; sha: string } | null> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers },
  );
  if (!res.ok) return null;
  const data = await res.json();
  return {
    content: Base64.decode(data.content),
    sha: data.sha,
  };
}

export async function putFile(
  path: string,
  content: string,
  message: string,
  sha?: string,
) {
  const body: Record<string, string> = {
    message,
    content: Base64.encode(content),
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}`,
    { method: 'PUT', headers, body: JSON.stringify(body) },
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? 'GitHub API error');
  }
  return res.json();
}

export interface CommitInfo {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export async function getRecentCommits(count = 5): Promise<CommitInfo[]> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/commits?per_page=${count}&sha=${BRANCH}`,
    { headers },
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.map((c: any) => ({
    sha: c.sha,
    message: c.commit.message,
    author: c.commit.author.name,
    date: c.commit.author.date,
  }));
}
