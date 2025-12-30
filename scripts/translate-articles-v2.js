const https = require('https');
const fs = require('fs');

// Use MyMemory Translation API (free, no key required for limited use)
function translateText(text, sourceLang = 'en', targetLang = 'ko') {
  return new Promise((resolve, reject) => {
    // MyMemory has 1000 chars per request limit, so we need to chunk
    const maxLength = 900;

    if (text.length <= maxLength) {
      translateChunk(text, sourceLang, targetLang)
        .then(resolve)
        .catch(() => resolve(text)); // Return original on error
      return;
    }

    // Split into sentences for better translation
    const sentences = text.split(/(?<=[.!?。！？\n])\s*/);
    const chunks = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + ' ' + sentence).length > maxLength) {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk = currentChunk ? currentChunk + ' ' + sentence : sentence;
      }
    }
    if (currentChunk) chunks.push(currentChunk.trim());

    // Translate chunks sequentially
    translateChunksSequentially(chunks, sourceLang, targetLang)
      .then(results => resolve(results.join('\n\n')))
      .catch(() => resolve(text));
  });
}

async function translateChunksSequentially(chunks, sourceLang, targetLang) {
  const results = [];
  for (let i = 0; i < chunks.length; i++) {
    try {
      const translated = await translateChunk(chunks[i], sourceLang, targetLang);
      results.push(translated);
      // Rate limiting - wait between requests
      if (i < chunks.length - 1) {
        await new Promise(r => setTimeout(r, 1000));
      }
    } catch (error) {
      results.push(chunks[i]); // Keep original on error
    }
  }
  return results;
}

function translateChunk(text, sourceLang, targetLang) {
  return new Promise((resolve, reject) => {
    const encodedText = encodeURIComponent(text);
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${sourceLang}|${targetLang}`;

    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.responseStatus === 200 && json.responseData && json.responseData.translatedText) {
            resolve(json.responseData.translatedText);
          } else {
            reject(new Error('Translation failed: ' + (json.responseDetails || 'Unknown error')));
          }
        } catch (e) {
          reject(e);
        }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  console.log('='.repeat(60));
  console.log('Article Translation: English → Korean (MyMemory API)');
  console.log('='.repeat(60) + '\n');

  const inputPath = './geeknews-original-articles.json';
  if (!fs.existsSync(inputPath)) {
    console.error('Error: geeknews-original-articles.json not found');
    process.exit(1);
  }

  const articles = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  console.log(`Loaded ${articles.length} articles to translate\n`);

  // Only translate first 10 as a test (API has daily limits)
  const testLimit = 10;
  const articlesToProcess = articles.slice(0, testLimit);
  console.log(`Processing first ${testLimit} articles as test...\n`);

  const translatedArticles = [];

  for (let i = 0; i < articlesToProcess.length; i++) {
    const article = articlesToProcess[i];
    const shortTitle = article.title.length > 45 ? article.title.substring(0, 45) + '...' : article.title;

    console.log(`[${i + 1}/${articlesToProcess.length}] ${shortTitle}`);
    console.log(`  Original: ${article.content.length.toLocaleString()} chars`);

    try {
      // Limit content to prevent API limits
      const contentToTranslate = article.content.substring(0, 5000);
      const translatedContent = await translateText(contentToTranslate);
      console.log(`  Translated: ${translatedContent.length.toLocaleString()} chars ✓`);

      translatedArticles.push({
        title: article.title,
        content: translatedContent,
        source: article.source,
        sourceUrl: article.sourceUrl,
        category: article.category
      });

      // Delay between articles
      await new Promise(r => setTimeout(r, 2000));
    } catch (error) {
      console.error(`  Error: ${error.message}`);
      translatedArticles.push({
        title: article.title,
        content: article.content,
        source: article.source,
        sourceUrl: article.sourceUrl,
        category: article.category
      });
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('TRANSLATION TEST COMPLETE');
  console.log('='.repeat(60));

  const outputPath = './geeknews-articles-test.json';
  fs.writeFileSync(outputPath, JSON.stringify(translatedArticles, null, 2), 'utf8');
  console.log(`\n✓ Saved ${translatedArticles.length} articles to ${outputPath}`);
}

main().catch(console.error);
