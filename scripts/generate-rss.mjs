import { build } from "esbuild";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const SITE_URL = "https://leonxm.lovable.app";

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function generateRss() {
  // Bundle articles.ts to plain JS, stubbing asset JSON imports.
  const result = await build({
    entryPoints: [resolve(root, "src/lib/articles.ts")],
    bundle: true,
    format: "esm",
    platform: "neutral",
    write: false,
    logLevel: "silent",
    plugins: [
      {
        name: "stub-assets",
        setup(b) {
          b.onResolve({ filter: /\.asset\.json$/ }, (args) => ({
            path: args.path,
            namespace: "stub-asset",
          }));
          b.onLoad({ filter: /.*/, namespace: "stub-asset" }, () => ({
            contents: JSON.stringify({ url: "" }),
            loader: "json",
          }));
        },
      },
    ],
  });

  const code = result.outputFiles[0].text;
  const dataUrl =
    "data:text/javascript;base64," + Buffer.from(code).toString("base64");
  const mod = await import(dataUrl);
  const articles = mod.sortedArticles ?? mod.articles ?? [];

  const items = articles
    .map((a) => {
      const url = `${SITE_URL}/news#${a.id}`;
      const pubDate = new Date(a.date).toUTCString();
      const desc = a.summary || a.content?.split("\n\n")[0] || "";
      const img = a.image
        ? a.image.startsWith("http")
          ? a.image
          : `${SITE_URL}${a.image}`
        : "";
      const html =
        (img ? `<p><img src="${escapeXml(img)}" alt=""/></p>` : "") +
        a.content
          .split(/\n\n+/)
          .map((p) => `<p>${escapeXml(p)}</p>`)
          .join("");
      const media = img
        ? `
      <enclosure url="${escapeXml(img)}" type="image/png"/>
      <media:content url="${escapeXml(img)}" medium="image"/>
      <media:thumbnail url="${escapeXml(img)}"/>`
        : "";
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="false">${escapeXml(a.id)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(desc)}</description>${media}
      <content:encoded><![CDATA[${html}]]></content:encoded>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>LeonXM News</title>
    <link>${SITE_URL}/news</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>Updates, announcements, and station news from LeonXM.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  const outDir = resolve(root, "public");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "rss.xml"), xml, "utf8");
  return xml;
}

// Allow direct execution: `node scripts/generate-rss.mjs`
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  generateRss().then(() => console.log("Wrote public/rss.xml"));
}
