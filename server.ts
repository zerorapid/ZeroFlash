import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface Post {
  id: string;
  title: string;
  date: string;
  category: string;
  author: string;
  excerpt: string;
  readTime: string;
  content: string;
  seoMetaTitle?: string;
  seoMetaDesc?: string;
  seoImageAlt?: string;
  geoTarget?: string;
  aeoSummary?: string;
  faqQuestion1?: string;
  faqAnswer1?: string;
  faqQuestion2?: string;
  faqAnswer2?: string;
  faqQuestion3?: string;
  faqAnswer3?: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

// In-memory store for comments and newsletter signups to add interactive full-stack functionality
const commentsStore: Record<string, Comment[]> = {
  "minimalist-design-benefits": [
    {
      id: "c1",
      author: "Sarah Jenkins",
      content: "This single column approach is so much easier on the eyes. Sidebars are just visual distraction on phones.",
      timestamp: "2026-05-20T14:23:00Z"
    },
    {
      id: "c2",
      author: "Robert Chen",
      content: "Absolutely agree. My site's mobile traffic went up to 85% this year. Optimizing for mobile first is no longer optional.",
      timestamp: "2026-05-20T16:45:00Z"
    }
  ],
  "core-web-vitals-guide": [
    {
      id: "c3",
      author: "Tariq Mahmood",
      content: "Excellent explanation of INP. It is much harder to debug than FID but yields a far better user experience.",
      timestamp: "2026-05-20T09:12:00Z"
    }
  ]
};

const newsletterSignups: string[] = [];

// Helper function to dynamically parse Markdown files with frontmatter
function parseMarkdownFile(filePath: string, fileName: string): Post {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const fallbackId = fileName.replace(/\.md$/, "");

  // Match frontmatter (bounded by lines starting with ---)
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  
  if (!match) {
    return {
      id: fallbackId,
      title: fallbackId,
      date: "",
      category: "News",
      author: "Staff Reporter",
      excerpt: fileContent.slice(0, 150) + "...",
      readTime: "2 min read",
      content: fileContent
    };
  }

  const frontmatterText = match[1];
  const content = match[2].trim();

  const metadata: Record<string, string> = {};
  frontmatterText.split("\n").forEach((line) => {
    const colonIdx = line.indexOf(":");
    if (colonIdx > -1) {
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim();
      metadata[key] = val;
    }
  });

  return {
    id: metadata.id || fallbackId,
    title: metadata.title || fallbackId,
    date: metadata.date || "",
    category: metadata.category || "News",
    author: metadata.author || "Staff Reporter",
    excerpt: metadata.excerpt || "",
    readTime: metadata.readTime || "3 min read",
    content: content,
    seoMetaTitle: metadata.seoMetaTitle || "",
    seoMetaDesc: metadata.seoMetaDesc || "",
    seoImageAlt: metadata.seoImageAlt || "",
    geoTarget: metadata.geoTarget || "",
    aeoSummary: metadata.aeoSummary || "",
    faqQuestion1: metadata.faqQuestion1 || "",
    faqAnswer1: metadata.faqAnswer1 || "",
    faqQuestion2: metadata.faqQuestion2 || "",
    faqAnswer2: metadata.faqAnswer2 || "",
    faqQuestion3: metadata.faqQuestion3 || "",
    faqAnswer3: metadata.faqAnswer3 || ""
  };
}

// Read and return posts from local posts directory
function getPosts(): Post[] {
  const postsDir = path.join(process.cwd(), "posts");
  if (!fs.existsSync(postsDir)) {
    return [];
  }

  try {
    const files = fs.readdirSync(postsDir);
    const posts = files
      .filter((file) => file.endsWith(".md"))
      .map((file) => {
        const filePath = path.join(postsDir, file);
        return parseMarkdownFile(filePath, file);
      });

    // Sort by date descending
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Error reading posts directory:", error);
    return [];
  }
}

const INDEXNOW_KEY = "zerotectnewskey2026";

async function pingIndexNow(host: string, origin: string, postId: string) {
  try {
    // Skip if on developer environment or sandboxed host
    if (host.includes("localhost") || host.includes("127.0.0.1") || host.includes(".run.app") || host.includes("local")) {
      console.log(`[IndexNow] Skipping web indexer ping for sandboxed development environment host: ${host}`);
      return;
    }

    const payload = {
      host: host,
      key: INDEXNOW_KEY,
      keyLocation: `${origin}/${INDEXNOW_KEY}.txt`,
      urlList: [
        `${origin}/?post=${postId}`,
        `${origin}/`
      ]
    };

    console.log(`[IndexNow] Automatically summoning search engine spiders for: ${origin}/?post=${postId}`);
    const res = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(payload)
    });
    console.log(`[IndexNow] Pinger result code: ${res.status}`);
  } catch (err) {
    console.error("[IndexNow] Search notification warning:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Technical SEO & Auto-Indexing Core Routes
  
  // 1. Robots.txt - Directs Google, Bing, and other web spiders
  app.get("/robots.txt", (req, res) => {
    const host = req.get("host") || "zeronews.local";
    const protocol = req.protocol || "https";
    const origin = `${protocol}://${host}`;
    
    let robots = `User-agent: *\n`;
    robots += `Allow: /\n`;
    robots += `Sitemap: ${origin}/sitemap.xml\n`;
    
    res.header("Content-Type", "text/plain");
    res.send(robots);
  });

  // 2. Dynamic XML Sitemap - Instant discovery of all news articles
  app.get("/sitemap.xml", (req, res) => {
    const host = req.get("host") || "zeronews.local";
    const protocol = req.protocol || "https";
    const origin = `${protocol}://${host}`;
    const posts = getPosts();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    // Homepage
    xml += `  <url>\n`;
    xml += `    <loc>${origin}/</loc>\n`;
    xml += `    <changefreq>hourly</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `  </url>\n`;

    // Individual Article Nodes
    posts.forEach((post) => {
      xml += `  <url>\n`;
      xml += `    <loc>${origin}/?post=${post.id}</loc>\n`;
      xml += `    <lastmod>${post.date || new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;
    res.header("Content-Type", "application/xml");
    res.send(xml);
  });

  // 3. Dynamic XML RSS Feed - Auto-pushing updates to RSS aggregators & trackers
  app.get("/rss.xml", (req, res) => {
    const host = req.get("host") || "zeronews.local";
    const protocol = req.protocol || "https";
    const origin = `${protocol}://${host}`;
    const posts = getPosts();

    let xml = `<?xml version="1.0" encoding="UTF-8" ?>\n`;
    xml += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n`;
    xml += `<channel>\n`;
    xml += `  <title>ZeroNews</title>\n`;
    xml += `  <link>${origin}</link>\n`;
    xml += `  <description>High-speed, single-column tech news feed</description>\n`;
    xml += `  <atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml" />\n`;
    xml += `  <language>en-us</language>\n`;
    
    if (posts.length > 0) {
      const pubDate = new Date(posts[0].date).toUTCString();
      xml += `  <lastBuildDate>${pubDate}</lastBuildDate>\n`;
    }

    posts.forEach((post) => {
      xml += `  <item>\n`;
      xml += `    <title><![CDATA[${post.title}]]></title>\n`;
      xml += `    <link>${origin}/?post=${post.id}</link>\n`;
      xml += `    <guid isPermaLink="true">${origin}/?post=${post.id}</guid>\n`;
      xml += `    <pubDate>${new Date(post.date).toUTCString()}</pubDate>\n`;
      xml += `    <description><![CDATA[${post.excerpt}]]></description>\n`;
      xml += `  </item>\n`;
    });

    xml += `</channel>\n`;
    xml += `</rss>`;
    res.header("Content-Type", "application/xml");
    res.send(xml);
  });

  // 4. IndexNow Dynamic Verification Token File Location (required for crawling proof)
  app.get(`/${INDEXNOW_KEY}.txt`, (req, res) => {
    res.header("Content-Type", "text/plain");
    res.send(INDEXNOW_KEY);
  });

  // API Routes
  app.get("/api/posts", (req, res) => {
    const posts = getPosts();
    // Return full posts including content to support comprehensive real-time search (by title, excerpt, and content)
    res.json(posts);
  });

  app.get("/api/posts/:id", (req, res) => {
    const { id } = req.params;
    const posts = getPosts();
    const post = posts.find((p) => p.id === id);

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.json(post);
  });

  // Get comments for an article
  app.get("/api/posts/:id/comments", (req, res) => {
    const { id } = req.params;
    const comments = commentsStore[id] || [];
    res.json(comments);
  });

  // Post a comment to an article
  app.post("/api/posts/:id/comments", (req, res) => {
    const { id } = req.params;
    const { author, content } = req.body;

    if (!author || !content) {
      res.status(400).json({ error: "Author and content are required" });
      return;
    }

    const newComment: Comment = {
      id: "c_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      author: author.trim(),
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    if (!commentsStore[id]) {
      commentsStore[id] = [];
    }

    commentsStore[id].unshift(newComment);
    res.status(201).json(newComment);
  });

  // Subscribe to newsletter
  app.post("/api/newsletter", (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      res.status(400).json({ error: "A valid email address is required" });
      return;
    }

    const trimmed = email.toLowerCase().trim();
    if (!newsletterSignups.includes(trimmed)) {
      newsletterSignups.push(trimmed);
    }
    res.json({ success: true, message: "Thank you for subscribing!" });
  });

  // Admin: Get all newsletter signups
  app.get("/api/admin/newsletter", (req, res) => {
    res.json(newsletterSignups);
  });

  // Admin: Create dynamic blog post file
  app.post("/api/admin/posts", (req, res) => {
    const { 
      id, title, category, author, excerpt, readTime, content,
      seoMetaTitle, seoMetaDesc, seoImageAlt, geoTarget, aeoSummary,
      faqQuestion1, faqAnswer1, faqQuestion2, faqAnswer2, faqQuestion3, faqAnswer3
    } = req.body;
    
    if (!id || !title || !content) {
      res.status(400).json({ error: "id, title and content are required" });
      return;
    }

    const postsDir = path.join(process.cwd(), "posts");
    
    // Safety check for filename traversal
    if (id.includes("/") || id.includes("..") || id.includes("\\")) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }

    const filePath = path.join(postsDir, `${id}.md`);
    const date = new Date().toISOString().split('T')[0];
    const postData = {
      id,
      title,
      date,
      category: category || "News",
      author: author || "Staff Reporter",
      excerpt: excerpt || (content.length > 150 ? content.slice(0, 150) + "..." : content),
      readTime: readTime || "3 min read",
      content,
      seoMetaTitle: seoMetaTitle || "",
      seoMetaDesc: seoMetaDesc || "",
      seoImageAlt: seoImageAlt || "",
      geoTarget: geoTarget || "",
      aeoSummary: aeoSummary || "",
      faqQuestion1: faqQuestion1 || "",
      faqAnswer1: faqAnswer1 || "",
      faqQuestion2: faqQuestion2 || "",
      faqAnswer2: faqAnswer2 || "",
      faqQuestion3: faqQuestion3 || "",
      faqAnswer3: faqAnswer3 || ""
    };

    const fileContent = `---
id: ${postData.id}
title: ${postData.title}
date: ${postData.date}
category: ${postData.category}
author: ${postData.author}
excerpt: ${postData.excerpt}
readTime: ${postData.readTime}
seoMetaTitle: ${postData.seoMetaTitle}
seoMetaDesc: ${postData.seoMetaDesc}
seoImageAlt: ${postData.seoImageAlt}
geoTarget: ${postData.geoTarget}
aeoSummary: ${postData.aeoSummary}
faqQuestion1: ${postData.faqQuestion1}
faqAnswer1: ${postData.faqAnswer1}
faqQuestion2: ${postData.faqQuestion2}
faqAnswer2: ${postData.faqAnswer2}
faqQuestion3: ${postData.faqQuestion3}
faqAnswer3: ${postData.faqAnswer3}
---

${postData.content}`;

    try {
      fs.writeFileSync(filePath, fileContent, "utf-8");
      
      // Notify search engines of the newly minted article
      const host = req.get("host") || "";
      const protocol = req.protocol || "https";
      const origin = `${protocol}://${host}`;
      if (host) {
        pingIndexNow(host, origin, postData.id).catch((e) => console.error("IndexNow create error:", e));
      }

      res.status(201).json(postData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to write blog post file" });
    }
  });

  // Admin: Edit blog post file
  app.put("/api/admin/posts/:id", (req, res) => {
    const { id } = req.params;
    const { 
      title, category, author, excerpt, readTime, content,
      seoMetaTitle, seoMetaDesc, seoImageAlt, geoTarget, aeoSummary,
      faqQuestion1, faqAnswer1, faqQuestion2, faqAnswer2, faqQuestion3, faqAnswer3
    } = req.body;

    if (!title || !content) {
      res.status(400).json({ error: "title and content are required" });
      return;
    }

    const postsDir = path.join(process.cwd(), "posts");
    const filePath = path.join(postsDir, `${id}.md`);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: "Post file does not exist" });
      return;
    }

    try {
      const existingPost = parseMarkdownFile(filePath, `${id}.md`);
      const postData = {
        id,
        title,
        date: existingPost.date || new Date().toISOString().split('T')[0],
        category: category || existingPost.category,
        author: author || existingPost.author,
        excerpt: excerpt || (content.length > 150 ? content.slice(0, 150) + "..." : content),
        readTime: readTime || existingPost.readTime,
        content,
        seoMetaTitle: seoMetaTitle !== undefined ? seoMetaTitle : existingPost.seoMetaTitle,
        seoMetaDesc: seoMetaDesc !== undefined ? seoMetaDesc : existingPost.seoMetaDesc,
        seoImageAlt: seoImageAlt !== undefined ? seoImageAlt : existingPost.seoImageAlt,
        geoTarget: geoTarget !== undefined ? geoTarget : existingPost.geoTarget,
        aeoSummary: aeoSummary !== undefined ? aeoSummary : existingPost.aeoSummary,
        faqQuestion1: faqQuestion1 !== undefined ? faqQuestion1 : existingPost.faqQuestion1,
        faqAnswer1: faqAnswer1 !== undefined ? faqAnswer1 : existingPost.faqAnswer1,
        faqQuestion2: faqQuestion2 !== undefined ? faqQuestion2 : existingPost.faqQuestion2,
        faqAnswer2: faqAnswer2 !== undefined ? faqAnswer2 : existingPost.faqAnswer2,
        faqQuestion3: faqQuestion3 !== undefined ? faqQuestion3 : existingPost.faqQuestion3,
        faqAnswer3: faqAnswer3 !== undefined ? faqAnswer3 : existingPost.faqAnswer3
      };

      const fileContent = `---
id: ${postData.id}
title: ${postData.title}
date: ${postData.date}
category: ${postData.category}
author: ${postData.author}
excerpt: ${postData.excerpt}
readTime: ${postData.readTime}
seoMetaTitle: ${postData.seoMetaTitle}
seoMetaDesc: ${postData.seoMetaDesc}
seoImageAlt: ${postData.seoImageAlt}
geoTarget: ${postData.geoTarget}
aeoSummary: ${postData.aeoSummary}
faqQuestion1: ${postData.faqQuestion1}
faqAnswer1: ${postData.faqAnswer1}
faqQuestion2: ${postData.faqQuestion2}
faqAnswer2: ${postData.faqAnswer2}
faqQuestion3: ${postData.faqQuestion3}
faqAnswer3: ${postData.faqAnswer3}
---

${postData.content}`;

      fs.writeFileSync(filePath, fileContent, "utf-8");

      // Notify search engines of modified article content
      const host = req.get("host") || "";
      const protocol = req.protocol || "https";
      const origin = `${protocol}://${host}`;
      if (host) {
        pingIndexNow(host, origin, postData.id).catch((e) => console.error("IndexNow edit error:", e));
      }

      res.json(postData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to edit blog post file" });
    }
  });

  // Admin: Delete blog post file
  app.delete("/api/admin/posts/:id", (req, res) => {
    const { id } = req.params;
    const postsDir = path.join(process.cwd(), "posts");
    const filePath = path.join(postsDir, `${id}.md`);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: "Post file does not exist" });
      return;
    }

    try {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: "Post deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete blog post file" });
    }
  });

  // Serve public assets directory (e.g. logos, static previews)
  app.use(express.static(path.join(process.cwd(), "public")));

  // Vite middleware for dev mode. Production builds serve static files in dist/
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(process.cwd(), "index.html");
        let template = fs.readFileSync(indexPath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
