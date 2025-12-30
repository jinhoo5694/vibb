const fs = require('fs');

// Read the crawled JSON
const articles = JSON.parse(fs.readFileSync('./geeknews-crawled.json', 'utf-8'));

function enhanceContent(content) {
  if (!content) return content;

  const lines = content.split('\n');
  const enhancedLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      enhancedLines.push('');
      continue;
    }

    // Already has markdown formatting - skip
    if (trimmed.startsWith('#') || trimmed.startsWith('>') || trimmed.startsWith('```')) {
      enhancedLines.push(line);
      continue;
    }

    // Detect section headers - Korean patterns
    // Pattern 1: Lines that are short titles (no dash prefix, no period at end)
    // Pattern 2: Lines ending with Korean header markers
    const isHeaderCandidate = (
      !trimmed.startsWith('-') &&
      !trimmed.startsWith('•') &&
      trimmed.length > 3 &&
      trimmed.length < 50 &&
      !trimmed.endsWith('.') &&
      !trimmed.endsWith(',') &&
      !trimmed.endsWith(')') &&
      !trimmed.includes('http') &&
      // Check if previous line is empty or --- (section break)
      (i === 0 || !lines[i-1].trim() || lines[i-1].trim() === '---')
    );

    // Common Korean section header patterns
    const koreanHeaderPatterns = [
      /^[가-힣A-Za-z0-9\s]+[:：]$/,  // Ends with colon
      /^[가-힣A-Za-z\s]+(의\s)?(분석|설명|요약|정리|전망|현황|동향|특징|장점|단점|개요|결론|배경|문제|해결|방안|대응|계획|방향|목표|핵심|주요|기능|구조|원리|개념|정의|의미|가치|효과|영향|결과|변화|발전|역사|미래|과제|전략|방법|기대|한계|내용|설명)$/,
      /^[가-힣]+\s(및|과|와)\s[가-힣]+$/,  // "A 및 B" pattern
      /^(핵심|주요|추가|결론|향후)\s?[가-힣]+$/,  // Starting with key words
      /^[가-힣A-Za-z0-9\s]+\s(소개|안내|가이드)$/,
    ];

    const matchesHeaderPattern = koreanHeaderPatterns.some(pattern => pattern.test(trimmed));

    // Check if it looks like a header (short, capitalized section title feel)
    const looksLikeHeader = isHeaderCandidate && (
      matchesHeaderPattern ||
      // English-style headers
      /^[A-Z][A-Za-z\s]+$/.test(trimmed) ||
      // Korean headers without colon but standalone
      (trimmed.length < 30 && /^[가-힣A-Za-z0-9\s''""·\-]+$/.test(trimmed) && !trimmed.includes('http'))
    );

    if (looksLikeHeader && !trimmed.startsWith('##')) {
      const headerText = trimmed.replace(/[:：]$/, '');
      enhancedLines.push(`## ${headerText}`);
      continue;
    }

    // Detect quotes - lines that look like direct quotes
    const isQuote = (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith('「') && trimmed.endsWith('」')) ||
      /^"[^"]+"\s*[-–—]/.test(trimmed)
    );

    if (isQuote && !trimmed.startsWith('>')) {
      enhancedLines.push(`> ${trimmed}`);
      continue;
    }

    // Bold important patterns
    let enhanced = line;

    // Bold percentages
    enhanced = enhanced.replace(/(\d+(?:\.\d+)?%)/g, '**$1**');

    // Bold money amounts (Korean)
    enhanced = enhanced.replace(/(\d+(?:,\d{3})*(?:\.\d+)?\s*(?:달러|원|억|조|만|유로|엔))/g, '**$1**');
    enhanced = enhanced.replace(/([\$€£¥]\s*\d+(?:,\d{3})*(?:\.\d+)?(?:\s*(?:billion|million|B|M))?)/gi, '**$1**');

    // Avoid double bold
    enhanced = enhanced.replace(/\*\*\*\*([^*]+)\*\*\*\*/g, '**$1**');
    enhanced = enhanced.replace(/\*\*\*\*/g, '**');

    enhancedLines.push(enhanced);
  }

  // Join and clean up
  let result = enhancedLines.join('\n');

  // Clean up multiple consecutive empty lines
  result = result.replace(/\n{3,}/g, '\n\n');

  // Add separator before headers if not present
  result = result.replace(/([^\n])\n(## )/g, '$1\n\n---\n\n$2');

  // Clean up double separators
  result = result.replace(/---\n+---/g, '---');
  result = result.replace(/\n---\n\n---\n/g, '\n\n---\n\n');

  return result.trim();
}

// Process all articles
let changedCount = 0;
const enhanced = articles.map((article, index) => {
  const originalContent = article.content;
  const enhancedContent = enhanceContent(article.content);

  if (originalContent !== enhancedContent) {
    changedCount++;
    if (changedCount <= 5) {
      console.log(`\n=== Changed Article ${index + 1}: ${article.title.substring(0, 40)}... ===`);
      console.log('Sample of enhanced content:');
      const lines = enhancedContent.split('\n').slice(0, 15);
      console.log(lines.join('\n'));
    }
  }

  return {
    ...article,
    content: enhancedContent
  };
});

// Save enhanced JSON
fs.writeFileSync('./geeknews-crawled.json', JSON.stringify(enhanced, null, 2), 'utf-8');

console.log(`\n${'='.repeat(60)}`);
console.log(`✓ Processed ${enhanced.length} articles`);
console.log(`✓ Enhanced ${changedCount} articles with markdown formatting`);
console.log(`✓ Saved to geeknews-crawled.json`);
