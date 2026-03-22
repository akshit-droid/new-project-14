const fs = require("fs");
const path = require("path");

const siteMetadata = {
  siteName: "Ezupp ERP",
  companyName: "Electrovese Solutions Pvt Ltd",
  defaultTitle: "Ezupp ERP | Distribution-Led ERP for Sales and Supply Chains",
  defaultDescription:
    "Ezupp ERP helps distribution-led businesses improve field sales productivity, partner operations, and supply chain visibility.",
  defaultImage: "/main.png"
};

const readEntriesFromDir = (folderName) => {
  const directory = path.join(__dirname, folderName);
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => {
      const filePath = path.join(directory, fileName);
      const rawJson = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(rawJson);
      const slugFromFileName = fileName.replace(/\.json$/, "");

      return {
        slug: parsed.slug || slugFromFileName,
        sections: Array.isArray(parsed.sections) ? parsed.sections : [],
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        ...parsed
      };
    });
};

const getCollections = () => {
  const blogPosts = readEntriesFromDir("blog");
  const knowledgeArticles = readEntriesFromDir("knowledge");

  return {
    blog: {
      key: "blog",
      label: "Blog",
      basePath: "/blog",
      headline: "Ezupp Blog",
      description:
        "Playbooks, market insights, and practical ideas for sales execution, distribution operations, and supply chain growth.",
      schemaType: "BlogPosting",
      items: blogPosts
    },
    knowledge: {
      key: "knowledge",
      label: "Knowledge Base",
      basePath: "/knowledge",
      headline: "Ezupp Knowledge Base",
      description:
        "Implementation guides, configuration references, and operational runbooks for teams deploying Ezupp ERP.",
      schemaType: "TechArticle",
      items: knowledgeArticles
    }
  };
};

module.exports = {
  siteMetadata,
  getCollections,
  collections: getCollections()
};
