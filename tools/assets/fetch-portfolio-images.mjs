import fs from "node:fs";
import path from "node:path";

const URLS_PATH = "tools/assets/wp-portfolio-urls.txt";
const OUT_DIR = "public/images/case-studies";
const MAP_PATH = "tools/assets/wp-portfolio-images.json";

if (!fs.existsSync(URLS_PATH)) {
  console.error("Missing:", URLS_PATH);
  process.exit(1);
}

const urls = fs.readFileSync(URLS_PATH, "utf8")
  .split("\n")
  .map(s => s.trim())
  .filter(Boolean);

fs.mkdirSync(OUT_DIR, { recursive: true });

const headers = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

function slugFromUrl(u) {
  const clean = u.replace(/\/+$/, "");
  return clean.substring(clean.lastIndexOf("/") + 1);
}

function getMeta(html, propOrName) {
  // property="og:image" OR name="twitter:image"
  const re = new RegExp(`<meta[^>]+(?:property|name)="${propOrName}"[^>]+content="([^"]+)"[^>]*>`, "i");
  const m = html.match(re);
  return m ? m[1] : null;
}

async function fetchText(url) {
  const res = await fetch(url, { headers, redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return await res.text();
}

async function downloadFile(url, outPath) {
  const res = await fetch(url, { headers, redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1000) throw new Error(`Downloaded too small (${buf.length} bytes)`);
  fs.writeFileSync(outPath, buf);
  return buf.length;
}

const report = [];
for (const wpUrl of urls) {
  const slug = slugFromUrl(wpUrl);
  try {
    const html = await fetchText(wpUrl);

    // Prefer OG image
    let img = getMeta(html, "og:image") || getMeta(html, "twitter:image");

    // Fallback: first <img ... src="...">
    if (!img) {
      const m = html.match(/<img[^>]+src="([^"]+)"/i);
      img = m ? m[1] : null;
    }

    if (!img) {
      report.push({ slug, wpUrl, ok: false, reason: "NO_IMAGE_FOUND" });
      continue;
    }

    // Normalize protocol-relative URLs
    if (img.startsWith("//")) img = "https:" + img;

    // Guess extension
    const extMatch = img.split("?")[0].match(/\.(png|jpe?g|webp)$/i);
    const ext = extMatch ? extMatch[1].toLowerCase().replace("jpeg","jpg") : "jpg";

    const outFile = path.join(OUT_DIR, `${slug}.${ext}`);
    const bytes = await downloadFile(img, outFile);

    report.push({ slug, wpUrl, imageUrl: img, outFile: `/${outFile}`, bytes, ok: true });
    console.log("OK", slug, "->", outFile);
  } catch (e) {
    report.push({ slug, wpUrl, ok: false, reason: String(e?.message || e) });
    console.log("ERR", slug, String(e?.message || e));
  }
}

fs.mkdirSync(path.dirname(MAP_PATH), { recursive: true });
fs.writeFileSync(MAP_PATH, JSON.stringify(report, null, 2));
console.log("\nSaved:", MAP_PATH);
