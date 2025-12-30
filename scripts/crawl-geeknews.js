const https = require('https');
const http = require('http');
const fs = require('fs');

// Category mapping
function categorizeArticle(title, content) {
  const text = (title + ' ' + content).toLowerCase();
  if (text.includes('ai') || text.includes('llm') || text.includes('gpt') ||
      text.includes('claude') || text.includes('machine learning') || text.includes('neural') ||
      text.includes('model') || text.includes('agent') || text.includes('openai')) {
    return 'AI';
  }
  if (text.includes('startup') || text.includes('founder') || text.includes('invest') ||
      text.includes('acqui') || text.includes('vc') || text.includes('funding') ||
      text.includes('ceo') || text.includes('company')) {
    return '스타트업';
  }
  if (text.includes('tutorial') || text.includes('learn') || text.includes('guide') ||
      text.includes('how to') || text.includes('getting started')) {
    return '튜토리얼';
  }
  if (text.includes('trend') || text.includes('future') || text.includes('state of') ||
      text.includes('review') || text.includes('outlook')) {
    return '트렌드';
  }
  return '개발';
}

function fetchWithRedirects(url, maxRedirects = 5, timeout = 30000) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) {
      reject(new Error('Too many redirects'));
      return;
    }

    const timeoutId = setTimeout(() => reject(new Error('Timeout')), timeout);
    const client = url.startsWith('https') ? https : http;

    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'identity',
      },
      timeout: timeout
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        clearTimeout(timeoutId);
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const urlObj = new URL(url);
          redirectUrl = urlObj.origin + (redirectUrl.startsWith('/') ? '' : '/') + redirectUrl;
        }
        fetchWithRedirects(redirectUrl, maxRedirects - 1, timeout).then(resolve).catch(reject);
        return;
      }

      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        clearTimeout(timeoutId);
        resolve(data);
      });
      res.on('error', err => {
        clearTimeout(timeoutId);
        reject(err);
      });
    });

    req.on('error', err => {
      clearTimeout(timeoutId);
      reject(err);
    });
  });
}

function extractFullArticle(html, url) {
  // Remove unwanted elements
  let content = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  // Try to find article content
  let articleContent = '';

  const patterns = [
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<div[^>]*class="[^"]*(?:markdown-body|readme|article-content|post-content|entry-content|content-body|post-body|blog-content|prose)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*id="(?:readme|content|article|post)"[^>]*>([\s\S]*?)<\/div>/i,
    /<main[^>]*>([\s\S]*?)<\/main>/i,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1] && match[1].length > 500) {
      articleContent = match[1];
      break;
    }
  }

  if (!articleContent || articleContent.length < 300) {
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      articleContent = bodyMatch[1];
    }
  }

  // Convert HTML to clean text with markdown
  let text = articleContent
    // Headers
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n\n')
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n\n')
    .replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '\n##### $1\n\n')
    .replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, '\n###### $1\n\n')
    // Code blocks
    .replace(/<pre[^>]*><code[^>]*class="[^"]*language-(\w+)[^"]*"[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '\n```$1\n$2\n```\n')
    .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '\n```\n$1\n```\n')
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '\n```\n$1\n```\n')
    // Inline code
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')
    // Bold/Strong
    .replace(/<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, '**$1**')
    // Italic/Em
    .replace(/<(?:em|i)[^>]*>([\s\S]*?)<\/(?:em|i)>/gi, '*$1*')
    // Links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    // Images
    .replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, '![$1]($2)')
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)')
    .replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)')
    // Blockquotes
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '\n> $1\n')
    // List items
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
    // Remove list containers
    .replace(/<\/?(?:ul|ol)[^>]*>/gi, '\n')
    // Paragraphs
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n')
    // Divs with potential content
    .replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, '$1\n')
    // Line breaks
    .replace(/<br\s*\/?>/gi, '\n')
    // Horizontal rules
    .replace(/<hr[^>]*\/?>/gi, '\n---\n')
    // Remove all remaining tags
    .replace(/<[^>]+>/g, '')
    // Decode HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(num))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '...')
    .replace(/&copy;/g, '©')
    .replace(/&reg;/g, '®')
    .replace(/&trade;/g, '™')
    .replace(/&bull;/g, '•')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    // Clean up whitespace
    .replace(/\n{4,}/g, '\n\n\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/^\s+/gm, '')
    .trim();

  return text;
}

async function getGeekNewsArticles() {
  const articles = [];

  for (let page = 1; page <= 5; page++) {
    const url = page === 1 ? 'https://news.hada.io/' : `https://news.hada.io/?page=${page}`;
    console.log(`Fetching GeekNews page ${page}...`);

    try {
      const html = await fetchWithRedirects(url);

      // Extract articles with their source URLs and topic IDs
      const regex = /<div class='topic_row'>[\s\S]*?<a[^>]*href=['"]([^'"]+)['"][^>]*rel=['"]nofollow['"][^>]*id=['"]tr(\d+)['"][^>]*><h1>([^<]+)<\/h1><\/a>/g;
      let match;

      while ((match = regex.exec(html)) !== null) {
        const sourceUrl = match[1];
        const title = match[3].trim();

        // Extract topic ID from the page
        const topicIdMatch = html.match(new RegExp(`topic\\?id=(\\d+)[^>]*>${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').substring(0, 20)}`));
        let topicId = topicIdMatch ? topicIdMatch[1] : null;

        if (!topicId) {
          // Try another pattern
          const altMatch = sourceUrl.match(/topic\?id=(\d+)/);
          topicId = altMatch ? altMatch[1] : null;
        }

        articles.push({
          title,
          sourceUrl: sourceUrl.startsWith('topic?id=') ? `https://news.hada.io/${sourceUrl}` : sourceUrl,
          topicId
        });
      }

      // Also get topic IDs directly
      const topicRegex = /topic\?id=(\d+)/g;
      const topicIds = new Set();
      while ((match = topicRegex.exec(html)) !== null) {
        topicIds.add(match[1]);
      }

      await new Promise(r => setTimeout(r, 300));
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error.message);
    }
  }

  // Remove duplicates
  const seen = new Set();
  return articles.filter(a => {
    const key = a.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 100);
}

async function getTopicInfo(topicId) {
  const url = `https://news.hada.io/topic?id=${topicId}`;

  try {
    const html = await fetchWithRedirects(url);

    // Get title
    const titleMatch = html.match(/<h1>([^<]+)<\/h1>/);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Get source URL
    const sourceMatch = html.match(/<a[^>]*href=['"]([^'"]+)['"][^>]*class=['"]bold[^'"]*['"][^>]*>/i);
    let sourceUrl = sourceMatch ? sourceMatch[1] : url;
    if (!sourceUrl.startsWith('http')) {
      sourceUrl = url;
    }

    // Get source domain
    let source = 'GeekNews';
    try {
      if (sourceUrl.startsWith('http') && !sourceUrl.includes('news.hada.io')) {
        source = new URL(sourceUrl).hostname.replace('www.', '');
      }
    } catch (e) {}

    return { title, sourceUrl, source };
  } catch (error) {
    return null;
  }
}

async function fetchOriginalArticle(sourceUrl) {
  // Skip problematic domains
  const skipDomains = ['twitter.com', 'x.com', 'youtube.com', 'youtu.be', 'linkedin.com', 'facebook.com', 'instagram.com'];
  try {
    const hostname = new URL(sourceUrl).hostname;
    if (skipDomains.some(d => hostname.includes(d))) {
      return null;
    }
  } catch (e) {
    return null;
  }

  try {
    const html = await fetchWithRedirects(sourceUrl, 5, 30000);
    const content = extractFullArticle(html, sourceUrl);

    if (content && content.length > 200) {
      return content;
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('GeekNews Full Article Crawler');
  console.log('Fetching original articles from source URLs...');
  console.log('='.repeat(60) + '\n');

  // Get list of articles from GeekNews
  const gnArticles = await getGeekNewsArticles();
  console.log(`\nFound ${gnArticles.length} articles to process\n`);

  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < gnArticles.length; i++) {
    const article = gnArticles[i];
    const shortTitle = article.title.length > 50 ? article.title.substring(0, 50) + '...' : article.title;

    process.stdout.write(`[${i + 1}/${gnArticles.length}] ${shortTitle}\n`);

    let sourceUrl = article.sourceUrl;
    let source = 'GeekNews';

    // If it's a topic URL, get the actual source
    if (sourceUrl.includes('news.hada.io/topic')) {
      const topicIdMatch = sourceUrl.match(/id=(\d+)/);
      if (topicIdMatch) {
        const info = await getTopicInfo(topicIdMatch[1]);
        if (info && info.sourceUrl) {
          sourceUrl = info.sourceUrl;
          source = info.source;
        }
      }
    } else {
      try {
        source = new URL(sourceUrl).hostname.replace('www.', '');
      } catch (e) {}
    }

    // Fetch original article
    let content = null;
    if (!sourceUrl.includes('news.hada.io')) {
      process.stdout.write(`  → Fetching from ${source}... `);
      content = await fetchOriginalArticle(sourceUrl);

      if (content) {
        console.log(`✓ (${content.length} chars)`);
        successCount++;
      } else {
        console.log('✗ (failed to extract)');
        failCount++;
      }
    } else {
      console.log('  → Show GN post (no external source)');
      failCount++;
    }

    if (content && content.length >= 200) {
      results.push({
        title: article.title,
        content: content,
        source: source,
        sourceUrl: sourceUrl,
        category: categorizeArticle(article.title, content),
        language: 'en' // Original is in English, needs translation
      });
    }

    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n' + '='.repeat(60));
  console.log('CRAWL COMPLETE');
  console.log('='.repeat(60));
  console.log(`Successfully extracted: ${successCount} articles`);
  console.log(`Failed to extract: ${failCount} articles`);
  console.log(`Total content: ${results.reduce((s, a) => s + a.content.length, 0).toLocaleString()} characters`);

  // Save results
  const outputPath = './geeknews-original-articles.json';
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n✓ Saved ${results.length} articles to ${outputPath}`);

  console.log('\n⚠️  NOTE: These articles are in ENGLISH (original language).');
  console.log('    They need to be translated to Korean.');
  console.log('    The next step will handle translation.\n');

  // Show sample
  if (results.length > 0) {
    console.log('--- Sample Article ---');
    const sample = results[0];
    console.log(`Title: ${sample.title}`);
    console.log(`Source: ${sample.source}`);
    console.log(`Length: ${sample.content.length} chars`);
    console.log(`\nContent preview:\n${sample.content.substring(0, 800)}...\n`);
  }
}

main().catch(console.error);
