const fs = require('fs');
const translate = require('translate');

// Configure translator
translate.engine = 'google';

async function translateText(text, targetLang = 'ko') {
  try {
    // Split long texts into chunks
    const maxLength = 4000;
    if (text.length <= maxLength) {
      const result = await translate(text, { to: targetLang });
      return result;
    }

    // Split by paragraphs for long texts
    const paragraphs = text.split(/\n\n+/);
    const translatedParts = [];
    let currentChunk = '';

    for (const para of paragraphs) {
      if ((currentChunk + '\n\n' + para).length > maxLength) {
        if (currentChunk) {
          try {
            const result = await translate(currentChunk, { to: targetLang });
            translatedParts.push(result);
            await new Promise(r => setTimeout(r, 300));
          } catch (error) {
            translatedParts.push(currentChunk);
          }
        }
        currentChunk = para;
      } else {
        currentChunk = currentChunk ? currentChunk + '\n\n' + para : para;
      }
    }

    if (currentChunk) {
      try {
        const result = await translate(currentChunk, { to: targetLang });
        translatedParts.push(result);
      } catch (error) {
        translatedParts.push(currentChunk);
      }
    }

    return translatedParts.join('\n\n');
  } catch (error) {
    console.error(`Translation error: ${error.message}`);
    return text;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('Article Translation: English → Korean');
  console.log('='.repeat(60) + '\n');

  const inputPath = './geeknews-original-articles.json';
  if (!fs.existsSync(inputPath)) {
    console.error('Error: geeknews-original-articles.json not found');
    process.exit(1);
  }

  const articles = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  console.log(`Loaded ${articles.length} articles to translate\n`);

  const translatedArticles = [];

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

  console.log('\n' + '='.repeat(60));
  console.log('TRANSLATION COMPLETE');
  console.log('='.repeat(60));

  const outputPath = './geeknews-articles.json';
  fs.writeFileSync(outputPath, JSON.stringify(translatedArticles, null, 2), 'utf8');
  console.log(`\n✓ Saved ${translatedArticles.length} articles to ${outputPath}`);
}

main().catch(console.error);
