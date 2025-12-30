const https = require('https');
const fs = require('fs');

// Progress tracking
let totalChunks = 0;
let translatedChunks = 0;

function translateChunk(text, sourceLang = 'en', targetLang = 'ko') {
  return new Promise((resolve, reject) => {
    const encodedText = encodeURIComponent(text.substring(0, 500)); // MyMemory limit
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${sourceLang}|${targetLang}`;

    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      },
      timeout: 30000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.responseStatus === 200 && json.responseData && json.responseData.translatedText) {
            translatedChunks++;
            resolve(json.responseData.translatedText);
          } else if (json.responseStatus === 429) {
            reject(new Error('Rate limit exceeded'));
          } else {
            reject(new Error(json.responseDetails || 'Translation failed'));
          }
        } catch (e) {
          reject(e);
        }
      });
      res.on('error', reject);
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function translateText(text) {
  // Split text into smaller chunks (max 500 chars for MyMemory)
  const sentences = text.split(/(?<=[.!?\n])/);
  const chunks = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > 450) {
      if (currentChunk.trim()) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }
  if (currentChunk.trim()) chunks.push(currentChunk.trim());

  totalChunks += chunks.length;
  const results = [];

  for (let i = 0; i < chunks.length; i++) {
    try {
      const translated = await translateChunk(chunks[i]);
      results.push(translated);
      // Rate limit: 10 requests per 10 seconds for free tier
      await new Promise(r => setTimeout(r, 1200));
    } catch (error) {
      if (error.message === 'Rate limit exceeded') {
        console.log('\n  [Rate limit hit, waiting 60s...]');
        await new Promise(r => setTimeout(r, 60000));
        // Retry
        try {
          const translated = await translateChunk(chunks[i]);
          results.push(translated);
        } catch (e) {
          results.push(chunks[i]); // Keep original on error
        }
      } else {
        results.push(chunks[i]); // Keep original on error
      }
    }
  }

  return results.join(' ');
}

async function main() {
  console.log('='.repeat(60));
  console.log('Full Article Translation: English → Korean');
  console.log('Using MyMemory Translation API (Free Tier)');
  console.log('='.repeat(60) + '\n');

  const inputPath = './geeknews-original-articles.json';
  if (!fs.existsSync(inputPath)) {
    console.error('Error: geeknews-original-articles.json not found');
    process.exit(1);
  }

  const articles = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  console.log(`Loaded ${articles.length} articles to translate\n`);

  // Calculate estimated time
  const totalChars = articles.reduce((sum, a) => sum + a.content.length, 0);
  const estimatedChunks = Math.ceil(totalChars / 450);
  console.log(`Total characters: ${totalChars.toLocaleString()}`);
  console.log(`Estimated chunks: ${estimatedChunks}`);
  console.log(`Estimated time: ${Math.ceil(estimatedChunks * 1.5 / 60)} minutes\n`);
  console.log('Starting translation...\n');

  const translatedArticles = [];
  const startTime = Date.now();

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    const shortTitle = article.title.length > 40 ? article.title.substring(0, 40) + '...' : article.title;

    process.stdout.write(`[${i + 1}/${articles.length}] ${shortTitle}`);
    process.stdout.write(`\n  Content: ${article.content.length.toLocaleString()} chars → `);

    try {
      const translatedContent = await translateText(article.content);
      console.log(`${translatedContent.length.toLocaleString()} chars ✓`);

      translatedArticles.push({
        title: article.title,
        content: translatedContent,
        source: article.source,
        sourceUrl: article.sourceUrl,
        category: article.category
      });

      // Save progress every 5 articles
      if ((i + 1) % 5 === 0) {
        fs.writeFileSync('./geeknews-articles-progress.json',
          JSON.stringify(translatedArticles, null, 2), 'utf8');
        console.log(`  [Progress saved: ${translatedArticles.length} articles]`);
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
      translatedArticles.push({
        title: article.title,
        content: article.content,
        source: article.source,
        sourceUrl: article.sourceUrl,
        category: article.category
      });
    }
  }

  const elapsedMinutes = Math.round((Date.now() - startTime) / 60000);
  console.log('\n' + '='.repeat(60));
  console.log('TRANSLATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`Time elapsed: ${elapsedMinutes} minutes`);
  console.log(`Chunks translated: ${translatedChunks}/${totalChunks}`);

  const outputPath = './geeknews-articles.json';
  fs.writeFileSync(outputPath, JSON.stringify(translatedArticles, null, 2), 'utf8');
  console.log(`\n✓ Saved ${translatedArticles.length} articles to ${outputPath}`);
}

main().catch(console.error);
