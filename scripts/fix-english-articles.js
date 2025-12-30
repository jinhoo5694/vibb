const translate = require('@iamtraction/google-translate');
const fs = require('fs');

async function translateSmallChunk(text, targetLang = 'ko') {
  try {
    const result = await translate(text, { to: targetLang });
    return result.text;
  } catch (e) {
    return null;
  }
}

async function translateText(text) {
  // Very small chunks - 1500 chars max
  const chunks = [];
  let current = '';
  const sentences = text.split(/(?<=[.!?\n])/);

  for (const s of sentences) {
    if ((current + s).length > 1500) {
      if (current) chunks.push(current);
      current = s.length > 1500 ? s.substring(0, 1500) : s;
    } else {
      current += s;
    }
  }
  if (current) chunks.push(current);

  const results = [];
  for (let i = 0; i < chunks.length; i++) {
    const translated = await translateSmallChunk(chunks[i]);
    if (translated) {
      results.push(translated);
    } else {
      results.push(chunks[i]); // Keep original on fail
    }
    await new Promise(r => setTimeout(r, 300));
  }
  return results.join('\n\n');
}

function hasEnglish(text) {
  const englishWords = text.match(/\b[a-zA-Z]{4,}\b/g) || [];
  const totalWords = text.split(/\s+/).length;
  return englishWords.length / totalWords > 0.3;
}

async function main() {
  console.log('Fixing English articles...\n');

  const articles = JSON.parse(fs.readFileSync('./geeknews-articles.json', 'utf8'));
  let fixed = 0;

  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    if (hasEnglish(a.content)) {
      console.log(`[${i+1}] ${a.title.substring(0,40)}...`);
      console.log(`  Has English content, translating...`);

      try {
        const translated = await translateText(a.content);
        articles[i].content = translated;
        fixed++;
        console.log(`  Done ✓`);
      } catch (e) {
        console.log(`  Error: ${e.message}`);
      }

      await new Promise(r => setTimeout(r, 500));
    }
  }

  fs.writeFileSync('./geeknews-articles.json', JSON.stringify(articles, null, 2));
  console.log(`\nFixed ${fixed} articles`);
}

main().catch(console.error);
