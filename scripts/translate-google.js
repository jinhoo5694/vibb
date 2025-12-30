const translate = require('@iamtraction/google-translate');
const fs = require('fs');

async function translateText(text, targetLang = 'ko') {
  // Split long texts into manageable chunks
  const maxLength = 4500;

  if (text.length <= maxLength) {
    try {
      const result = await translate(text, { to: targetLang });
      return result.text;
    } catch (error) {
      console.error(`  Translation error: ${error.message}`);
      return text;
    }
  }

  // Split by paragraphs for long texts
  const paragraphs = text.split(/\n\n+/);
  const chunks = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    if ((currentChunk + '\n\n' + para).length > maxLength) {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = para.length > maxLength ? para.substring(0, maxLength) : para;
    } else {
      currentChunk = currentChunk ? currentChunk + '\n\n' + para : para;
    }
  }
  if (currentChunk) chunks.push(currentChunk);

  const translatedParts = [];
  for (let i = 0; i < chunks.length; i++) {
    try {
      const result = await translate(chunks[i], { to: targetLang });
      translatedParts.push(result.text);
      // Small delay between chunks
      await new Promise(r => setTimeout(r, 200));
    } catch (error) {
      console.error(`  Chunk ${i + 1} error: ${error.message}`);
      translatedParts.push(chunks[i]); // Keep original on error
    }
  }

  return translatedParts.join('\n\n');
}

async function main() {
  console.log('='.repeat(60));
  console.log('Article Translation: English → Korean');
  console.log('Using Google Translate (free web endpoint)');
  console.log('='.repeat(60) + '\n');

  const inputPath = './geeknews-original-articles.json';
  if (!fs.existsSync(inputPath)) {
    console.error('Error: geeknews-original-articles.json not found');
    process.exit(1);
  }

  const articles = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  console.log(`Loaded ${articles.length} articles to translate\n`);

  const translatedArticles = [];
  const startTime = Date.now();

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    const shortTitle = article.title.length > 45 ? article.title.substring(0, 45) + '...' : article.title;

    console.log(`[${i + 1}/${articles.length}] ${shortTitle}`);
    console.log(`  Original: ${article.content.length.toLocaleString()} chars`);

    try {
      const translatedContent = await translateText(article.content);
      console.log(`  Translated: ${translatedContent.length.toLocaleString()} chars ✓`);

      translatedArticles.push({
        title: article.title,
        content: translatedContent,
        source: article.source,
        sourceUrl: article.sourceUrl,
        category: article.category
      });

      // Save progress every 10 articles
      if ((i + 1) % 10 === 0) {
        fs.writeFileSync('./geeknews-articles-progress.json',
          JSON.stringify(translatedArticles, null, 2), 'utf8');
        console.log(`  [Saved progress: ${translatedArticles.length} articles]`);
      }

      // Delay between articles to avoid rate limiting
      await new Promise(r => setTimeout(r, 500));
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

  const elapsedMinutes = Math.round((Date.now() - startTime) / 60000);
  console.log('\n' + '='.repeat(60));
  console.log('TRANSLATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`Time elapsed: ${elapsedMinutes} minutes`);
  console.log(`Articles translated: ${translatedArticles.length}`);

  const outputPath = './geeknews-articles.json';
  fs.writeFileSync(outputPath, JSON.stringify(translatedArticles, null, 2), 'utf8');
  console.log(`\n✓ Saved ${translatedArticles.length} articles to ${outputPath}`);
}

main().catch(console.error);
