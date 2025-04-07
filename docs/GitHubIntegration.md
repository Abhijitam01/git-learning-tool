# GitHub Integration Guide

## Overview

This document outlines the possibilities and implementation strategies for integrating the Git Learning Tool with GitHub. While the current implementation simulates Git operations locally, actual GitHub integration would enhance the educational experience by connecting to real repositories.

## Integration Options

### 1. GitHub Authentication

**OAuth Integration**
```typescript
// Sample OAuth Flow Implementation
import { Octokit } from "@octokit/rest";

// Step 1: Redirect user to GitHub for authorization
const clientId = process.env.GITHUB_CLIENT_ID;
const redirectUri = `${process.env.APP_URL}/api/auth/github/callback`;
const scope = "repo user";
const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

// Step 2: Obtain access token (server-side)
async function exchangeCodeForToken(code: string): Promise<string> {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${process.env.APP_URL}/api/auth/github/callback`,
    }),
  });
  
  const data = await response.json();
  return data.access_token;
}

// Step 3: Create authenticated Octokit client
function createGitHubClient(token: string): Octokit {
  return new Octokit({ auth: token });
}
```

**Benefits**
- User identity verification through GitHub
- Access to user's repositories and profile
- Seamless authentication experience
- Permission scoping based on educational needs

### 2. Repository Management

**Repository Creation**
```typescript
async function createRepository(
  octokit: Octokit,
  name: string,
  description: string,
  isPrivate: boolean
): Promise<Repository> {
  const { data } = await octokit.repos.createForAuthenticatedUser({
    name,
    description,
    private: isPrivate,
    auto_init: true, // Initialize with README
  });
  
  return data;
}
```

**Repository Cloning**
```typescript
async function cloneRepository(
  octokit: Octokit,
  owner: string,
  repo: string,
  targetDir: string
): Promise<void> {
  // Using isomorphic-git for browser-based Git operations
  const { clone } = await import("isomorphic-git");
  const http = await import("isomorphic-git/http/web");
  const fs = await import("@isomorphic-git/lightning-fs");
  
  const lightningFS = new fs.default("fs");
  
  await clone({
    fs: lightningFS,
    http,
    dir: targetDir,
    url: `https://github.com/${owner}/${repo}.git`,
    corsProxy: process.env.CORS_PROXY, // If needed
    onAuth: () => ({ username: octokit.auth.token }),
  });
}
```

**Repository Listing**
```typescript
async function listUserRepositories(octokit: Octokit): Promise<Repository[]> {
  const { data } = await octokit.repos.listForAuthenticatedUser({
    sort: "updated",
    per_page: 10,
  });
  
  return data;
}
```

### 3. Git Operations

**Commit Creation**
```typescript
async function createCommit(
  octokit: Octokit,
  owner: string,
  repo: string,
  branch: string,
  path: string,
  content: string,
  message: string
): Promise<void> {
  // Get the latest commit SHA for the branch
  const { data: refData } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${branch}`,
  });
  const latestCommitSha = refData.object.sha;
  
  // Get the tree SHA for the latest commit
  const { data: commitData } = await octokit.git.getCommit({
    owner,
    repo,
    commit_sha: latestCommitSha,
  });
  const treeSha = commitData.tree.sha;
  
  // Create a blob with the file content
  const { data: blobData } = await octokit.git.createBlob({
    owner,
    repo,
    content: Buffer.from(content).toString("base64"),
    encoding: "base64",
  });
  
  // Create a new tree with the new file
  const { data: newTreeData } = await octokit.git.createTree({
    owner,
    repo,
    base_tree: treeSha,
    tree: [
      {
        path,
        mode: "100644", // File mode
        type: "blob",
        sha: blobData.sha,
      },
    ],
  });
  
  // Create a new commit
  const { data: newCommitData } = await octokit.git.createCommit({
    owner,
    repo,
    message,
    tree: newTreeData.sha,
    parents: [latestCommitSha],
  });
  
  // Update the reference
  await octokit.git.updateRef({
    owner,
    repo,
    ref: `heads/${branch}`,
    sha: newCommitData.sha,
  });
}
```

**Branch Creation**
```typescript
async function createBranch(
  octokit: Octokit,
  owner: string,
  repo: string,
  branchName: string,
  fromBranch: string = "main"
): Promise<void> {
  // Get the SHA for the source branch
  const { data: refData } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${fromBranch}`,
  });
  const sha = refData.object.sha;
  
  // Create a new reference (branch)
  await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha,
  });
}
```

**Merge Operations**
```typescript
async function mergeBranches(
  octokit: Octokit,
  owner: string,
  repo: string,
  base: string,
  head: string,
  commitMessage: string
): Promise<void> {
  await octokit.repos.merge({
    owner,
    repo,
    base,
    head,
    commit_message: commitMessage,
  });
}
```

### 4. Workspace Integration

**Browser-Based File System**
```typescript
import { LightningFS } from "@isomorphic-git/lightning-fs";
import * as git from "isomorphic-git";
import http from "isomorphic-git/http/web";

// Create a virtual filesystem
const fs = new LightningFS("fs");

// Initialize a workspace
async function initWorkspace(repoName: string): Promise<void> {
  // Create a directory for the repository
  await fs.promises.mkdir(`/${repoName}`);
  
  // Initialize a Git repository
  await git.init({
    fs,
    dir: `/${repoName}`,
    defaultBranch: "main",
  });
  
  // Create a README file
  const readme = "# Learning Git\n\nThis repository was created for learning Git.";
  await fs.promises.writeFile(`/${repoName}/README.md`, readme);
  
  // Stage and commit the file
  await git.add({
    fs,
    dir: `/${repoName}`,
    filepath: "README.md",
  });
  
  await git.commit({
    fs,
    dir: `/${repoName}`,
    message: "Initial commit",
    author: {
      name: "Git Learning Tool",
      email: "git@learning.tool",
    },
  });
}
```

**Visual Diff View**
```typescript
import * as diff from "diff";

// Generate a visual diff for a file
function generateFileDiff(oldContent: string, newContent: string): string {
  const diffResult = diff.createPatch(
    "file.txt",
    oldContent,
    newContent,
    "old",
    "new"
  );
  
  return diffResult;
}

// Render the diff in the UI
function renderDiff(diffText: string): React.ReactNode {
  const lines = diffText.split("\n").slice(4); // Skip header lines
  
  return (
    <div className="diff-view">
      {lines.map((line, index) => {
        let className = "diff-line";
        
        if (line.startsWith("+")) {
          className += " diff-added";
        } else if (line.startsWith("-")) {
          className += " diff-removed";
        } else if (line.startsWith("@@")) {
          className += " diff-info";
        }
        
        return (
          <div key={index} className={className}>
            {line}
          </div>
        );
      })}
    </div>
  );
}
```

### 5. Issue and Pull Request Management

**Issue Creation**
```typescript
async function createIssue(
  octokit: Octokit,
  owner: string,
  repo: string,
  title: string,
  body: string
): Promise<Issue> {
  const { data } = await octokit.issues.create({
    owner,
    repo,
    title,
    body,
  });
  
  return data;
}
```

**Pull Request Creation**
```typescript
async function createPullRequest(
  octokit: Octokit,
  owner: string,
  repo: string,
  title: string,
  body: string,
  head: string,
  base: string = "main"
): Promise<PullRequest> {
  const { data } = await octokit.pulls.create({
    owner,
    repo,
    title,
    body,
    head,
    base,
  });
  
  return data;
}
```

## Implementation Roadmap

### Phase 1: Authentication
1. Set up GitHub OAuth application
2. Implement login flow
3. Store and manage authentication tokens
4. Create user profile views

### Phase 2: Repository Management
1. Allow users to create learning repositories
2. Enable repository browsing and selection
3. Implement repository cloning
4. Develop repository settings management

### Phase 3: Git Operations
1. Implement basic Git operations (commit, branch, merge)
2. Create visual Git history viewer
3. Develop interactive commit creation
4. Enable branch management

### Phase 4: Educational Integration
1. Connect real Git operations to learning modules
2. Create guided exercises using real repositories
3. Implement progress tracking with real repositories
4. Develop assessment tools for repository evaluation

## Security Considerations

1. **Token Storage**
   - Store tokens securely using HTTP-only cookies
   - Implement proper token refresh mechanisms
   - Use secure storage for sensitive credentials

2. **Permission Scoping**
   - Request minimal GitHub permissions (scopes)
   - Use fine-grained personal access tokens when possible
   - Clearly communicate required permissions to users

3. **Rate Limiting**
   - Implement proper rate limiting to avoid API abuse
   - Cache responses when appropriate
   - Handle GitHub API rate limit errors gracefully

4. **User Data Protection**
   - Clear guidelines on data usage
   - Options to disconnect GitHub account
   - Compliance with relevant privacy regulations

## User Experience Guidelines

1. **Clear Authentication Flow**
   - Explain why GitHub access is needed
   - Show loading states during authentication
   - Handle errors gracefully with clear messages

2. **Repository Context**
   - Always display current repository name
   - Show branch information
   - Indicate sync status (local/remote)

3. **Operation Feedback**
   - Show progress for long-running operations
   - Provide clear success/failure messages
   - Offer recovery options after failures

## Conclusion

Integrating with GitHub will transform the Git Learning Tool from a simulation to a real-world development environment, providing a seamless bridge between learning and practice. This integration requires careful planning for authentication, permission management, and user experience design to ensure a smooth educational journey.

By following this integration guide, the Git Learning Tool can offer users a comprehensive Git learning experience with real GitHub repositories while maintaining a focus on educational goals.
