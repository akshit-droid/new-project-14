const fs = require("fs");
const path = require("path");

const allowedTypes = new Set(["blog", "knowledge"]);

const parseArgs = (argv) => {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }

    args[key] = next;
    i += 1;
  }
  return args;
};

const printUsage = () => {
  console.log(`Usage:
  npm run new:content -- --type blog --slug route-planning-basics --title "Route Planning Basics"

Optional:
  --description "SEO description"
  --excerpt "Card summary"
  --author "Team Name"
  --tags "Field Sales,Execution"
  --publishedAt 2026-03-22
  --updatedAt 2026-03-22
  --dry-run
`);
};

const toIsoDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString().slice(0, 10);
};

const run = () => {
  const args = parseArgs(process.argv.slice(2));
  const type = String(args.type || "").trim().toLowerCase();
  const slug = String(args.slug || "").trim().toLowerCase();
  const title = String(args.title || "").trim();

  if (!allowedTypes.has(type) || !slug || !title) {
    printUsage();
    process.exit(1);
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    console.error("Error: --slug must use lowercase letters, numbers, and hyphens only.");
    process.exit(1);
  }

  const publishedAt = args.publishedAt ? toIsoDate(args.publishedAt) : toIsoDate(new Date());
  const updatedAt = args.updatedAt ? toIsoDate(args.updatedAt) : publishedAt;

  if (!publishedAt || !updatedAt) {
    console.error("Error: invalid date. Use YYYY-MM-DD.");
    process.exit(1);
  }

  const description = String(args.description || `${title} for Ezupp teams.`).trim();
  const excerpt = String(args.excerpt || description).trim();
  const author = String(args.author || "Ezupp Editorial Team").trim();
  const tags = String(args.tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const entry = {
    slug,
    title,
    description,
    excerpt,
    publishedAt,
    updatedAt,
    author,
    tags,
    sections: [
      {
        type: "paragraph",
        text: "Write the opening summary for this page."
      },
      {
        type: "heading",
        text: "Main section heading"
      },
      {
        type: "paragraph",
        text: "Add the core details for this section."
      },
      {
        type: "list",
        items: ["Key point one.", "Key point two.", "Key point three."]
      }
    ]
  };

  const outputDir = path.join(__dirname, "..", "content", type);
  const outputFile = path.join(outputDir, `${slug}.json`);

  if (fs.existsSync(outputFile)) {
    console.error(`Error: entry already exists at ${outputFile}`);
    process.exit(1);
  }

  const rendered = `${JSON.stringify(entry, null, 2)}\n`;

  if (args["dry-run"]) {
    console.log(rendered);
    return;
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputFile, rendered);
  console.log(`Created ${outputFile}`);
};

run();
