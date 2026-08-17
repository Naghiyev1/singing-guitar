import type { NextConfig } from "next";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === "true";
const isAccountSite = repositoryName.endsWith(".github.io");
const basePath = isGitHubPagesBuild && !isAccountSite ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  ...(isGitHubPagesBuild ? { output: "export" as const } : {}),
  basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
  // The repository also contains Cloudflare-only helper modules used by the
  // hosted build. They are not imported by the static Pages application.
  typescript: { ignoreBuildErrors: isGitHubPagesBuild },
};

export default nextConfig;
