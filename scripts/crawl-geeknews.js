const https = require('https');
const fs = require('fs');

// Generate article IDs - GeekNews uses sequential IDs
// Latest articles are around 25442, we'll try a range to get 100+ articles
const articleIds = [];
for (let id = 25442; id >= 25200; id--) {
  articleIds.push(id);
}
console.log(`Generated ${articleIds.length} article IDs to try (${articleIds[0]} to ${articleIds[articleIds.length-1]})`);

// Category mapping based on keywords (Korean)
function categorizeArticle(title, content) {
  const text = (title + ' ' + content).toLowerCase();

  // AI related
  if (text.includes('ai') || text.includes('gpt') || text.includes('llm') ||
      text.includes('claude') || text.includes('모델') || text.includes('학습') ||
      text.includes('인공지능') || text.includes('머신러닝') || text.includes('openai') ||
      text.includes('anthropic') || text.includes('딥러닝') || text.includes('신경망') ||
      text.includes('에이전트') || text.includes('챗봇') || text.includes('생성') ||
      text.includes('transformer') || text.includes('추론') || text.includes('프롬프트')) {
    return 'AI';
  }

  // Startup related
  if (text.includes('스타트업') || text.includes('투자') || text.includes('펀딩') ||
      text.includes('창업') || text.includes('vc') || text.includes('인수') ||
      text.includes('ipo') || text.includes('기업가') || text.includes('ceo') ||
      text.includes('창업자') || text.includes('시리즈') || text.includes('밸류에이션')) {
    return '스타트업';
  }

  // Tutorial related
  if (text.includes('튜토리얼') || text.includes('가이드') || text.includes('방법') ||
      text.includes('배우') || text.includes('입문') || text.includes('시작하') ||
      text.includes('만들기') || text.includes('how to') || text.includes('기초') ||
      text.includes('설치') || text.includes('사용법') || text.includes('따라하')) {
    return '튜토리얼';
  }

  // Trend related
  if (text.includes('트렌드') || text.includes('전망') || text.includes('예측') ||
      text.includes('미래') || text.includes('변화') || text.includes('설문') ||
      text.includes('통계') || text.includes('리포트') || text.includes('분석') ||
      text.includes('현황') || text.includes('동향')) {
    return '트렌드';
  }

  // Default to 개발
  return '개발';
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error('Timeout')), 30000);

    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    }, (res) => {
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
    }).on('error', err => {
      clearTimeout(timeoutId);
      reject(err);
    });
  });
}

function decodeHtmlEntities(text) {
  return text
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
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'");
}

async function fetchArticle(id) {
  try {
    const html = await fetchUrl(`https://news.hada.io/topic?id=${id}`);

    // Extract title from h1 tag
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    let title = titleMatch ? decodeHtmlEntities(titleMatch[1].trim()) : null;

    if (!title) {
      // Try title tag
      const titleTagMatch = html.match(/<title>([^<]+)<\/title>/i);
      if (titleTagMatch) {
        title = decodeHtmlEntities(titleTagMatch[1].replace(' | GeekNews', '').trim());
      }
    }

    // Extract content from topic_contents span
    // The content is in <span id='topic_contents'>
    let content = '';

    // Try to find the main content section
    // The span can be quite long, so use greedy match
    const contentMatch = html.match(/<span id='topic_contents'>([\s\S]+?)<\/span>\s*<\/div>\s*<\/div>/i);
    if (contentMatch) {
      content = contentMatch[1];
    } else {
      // Try alternative: div with class topic_contents
      const divMatch = html.match(/<div class=topic_contents>([\s\S]+?)<\/div>\s*<\/div>/i);
      if (divMatch) {
        content = divMatch[1];
      }
    }

    // If still no content, try meta description
    if (!content || content.length < 100) {
      const metaMatch = html.match(/<meta name="description" content="([^"]+)"/i) ||
                        html.match(/<meta property="og:description" content="([^"]+)"/i);
      if (metaMatch) {
        content = metaMatch[1];
      }
    }

    // Clean the content - remove HTML tags but preserve structure
    if (content) {
      content = content
        // Convert headers to text with newlines
        .replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, '\n\n$1\n')
        // Convert lists to text
        .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1')
        .replace(/<\/?(?:ul|ol)[^>]*>/gi, '\n')
        // Convert paragraphs to newlines
        .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n')
        // Convert line breaks
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<hr\s*\/?>/gi, '\n---\n')
        // Remove code blocks but keep content
        .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '$1')
        .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '$1')
        // Remove all other HTML tags
        .replace(/<[^>]+>/g, '')
        // Decode entities
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        // Clean up whitespace
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]+/g, ' ')
        .replace(/^\s+/gm, '')
        .trim();
    }

    // Extract source URL (the original link)
    const sourceUrlMatch = html.match(/<a[^>]*class="[^"]*topiclink[^"]*"[^>]*href="([^"]+)"[^>]*>/i) ||
                           html.match(/<a[^>]*href="([^"]+)"[^>]*class="[^"]*bold[^"]*"[^>]*>/i);
    let originalSourceUrl = sourceUrlMatch ? sourceUrlMatch[1] : null;

    // Determine source name
    let source = 'GeekNews';
    if (originalSourceUrl && !originalSourceUrl.includes('news.hada.io')) {
      try {
        const url = new URL(originalSourceUrl);
        let hostname = url.hostname.replace('www.', '');
        // Get first part of domain
        const parts = hostname.split('.');
        source = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        // Some known sources
        if (hostname.includes('github')) source = 'GitHub';
        else if (hostname.includes('youtube')) source = 'YouTube';
        else if (hostname.includes('arxiv')) source = 'arXiv';
        else if (hostname.includes('blog')) source = hostname.split('.')[0] + ' Blog';
      } catch (e) {
        source = 'GeekNews';
      }
    }

    if (!title || !content || content.length < 50) {
      return null;
    }

    return {
      title,
      content: decodeHtmlEntities(content),
      source,
      sourceUrl: `https://news.hada.io/topic?id=${id}`,
      category: categorizeArticle(title, content)
    };
  } catch (error) {
    console.error(`  Error fetching article ${id}: ${error.message}`);
    return null;
  }
}

async function main() {
  const TARGET_COUNT = 110; // Target number of articles to collect

  console.log('='.repeat(60));
  console.log('GeekNews Korean Content Crawler');
  console.log(`Target: ${TARGET_COUNT} articles`);
  console.log(`Trying ${articleIds.length} article IDs...`);
  console.log('='.repeat(60) + '\n');

  const articles = [];
  let successCount = 0;
  let failCount = 0;

  // Process in batches of 5 to avoid rate limiting
  for (let i = 0; i < articleIds.length && successCount < TARGET_COUNT; i += 5) {
    const batch = articleIds.slice(i, i + 5);
    const results = await Promise.all(batch.map(id => fetchArticle(id)));

    for (let j = 0; j < results.length; j++) {
      const article = results[j];
      const id = batch[j];

      if (article) {
        articles.push(article);
        successCount++;
        const shortTitle = article.title.length > 40 ? article.title.substring(0, 40) + '...' : article.title;
        console.log(`  ✓ [${id}] ${shortTitle}`);

        if (successCount >= TARGET_COUNT) {
          console.log(`\n🎯 Reached target of ${TARGET_COUNT} articles!`);
          break;
        }
      } else {
        failCount++;
      }
    }

    console.log(`Progress: ${successCount}/${TARGET_COUNT} articles collected\n`);

    // Small delay between batches
    if (i + 5 < articleIds.length && successCount < TARGET_COUNT) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  console.log('='.repeat(60));
  console.log('CRAWL COMPLETE');
  console.log('='.repeat(60));
  console.log(`Successfully extracted: ${successCount} articles`);
  console.log(`Failed to extract: ${failCount} articles`);

  // Save to JSON file
  const outputPath = './geeknews-crawled.json';
  fs.writeFileSync(outputPath, JSON.stringify(articles, null, 2), 'utf-8');
  console.log(`\n✓ Saved ${articles.length} articles to ${outputPath}`);

  // Print category distribution
  const categories = {};
  for (const article of articles) {
    categories[article.category] = (categories[article.category] || 0) + 1;
  }
  console.log('\nCategory distribution:');
  for (const [cat, count] of Object.entries(categories).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat}: ${count}`);
  }

  // Show samples
  if (articles.length > 0) {
    console.log('\n--- Sample Articles ---');
    for (let i = 0; i < Math.min(3, articles.length); i++) {
      const sample = articles[i];
      console.log(`\n[${i + 1}] ${sample.title}`);
      console.log(`    Category: ${sample.category}, Source: ${sample.source}`);
      console.log(`    Content: ${sample.content.substring(0, 150)}...`);
    }
  }
}

main().catch(console.error);
