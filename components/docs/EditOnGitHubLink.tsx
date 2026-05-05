import { githubEditBase } from "@/lib/site";

export function EditOnGitHubLink({ sourcePath }: { sourcePath: string }) {
  const url = `${githubEditBase}/${sourcePath}`;
  return (
    <a className="docs-edit-link" href={url} target="_blank" rel="noreferrer">
      <span aria-hidden>✎</span>
      Edit this page on GitHub
    </a>
  );
}
