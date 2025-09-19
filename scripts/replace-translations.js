const fs = require('fs');
const path = require('path');

// 读取文件
const filePath = path.join(__dirname, '../app/[locale]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 定义替换规则
const replacements = [
  // Hero section
  { from: 'translations.hero.title', to: 't.hero.title' },
  { from: 'translations.hero.subtitle', to: 't.hero.subtitle' },
  { from: 'translations.hero.cta', to: 't.hero.cta' },
  { from: 'translations.hero.trustedBy', to: 't.hero.trustedBy' },
  
  // Features section
  { from: 'translations.features.title', to: 't.features.title' },
  { from: 'translations.features.subtitle', to: 't.features.subtitle' },
  { from: 'translations.features.fast.title', to: 't.features.fast.title' },
  { from: 'translations.features.fast.description', to: 't.features.fast.description' },
  { from: 'translations.features.secure.title', to: 't.features.secure.title' },
  { from: 'translations.features.secure.description', to: 't.features.secure.description' },
  { from: 'translations.features.quality.title', to: 't.features.quality.title' },
  { from: 'translations.features.quality.description', to: 't.features.quality.description' },
  { from: 'translations.features.free.title', to: 't.features.free.title' },
  { from: 'translations.features.free.description', to: 't.features.free.description' },
  
  // How it works section
  { from: 'translations.howItWorks.title', to: 't.howItWorks.title' },
  { from: 'translations.howItWorks.step1.title', to: 't.howItWorks.step1.title' },
  { from: 'translations.howItWorks.step1.description', to: 't.howItWorks.step1.description' },
  { from: 'translations.howItWorks.step2.title', to: 't.howItWorks.step2.title' },
  { from: 'translations.howItWorks.step2.description', to: 't.howItWorks.step2.description' },
  { from: 'translations.howItWorks.step3.title', to: 't.howItWorks.step3.title' },
  { from: 'translations.howItWorks.step3.description', to: 't.howItWorks.step3.description' },
  
  // FAQ section
  { from: 'translations.faq.title', to: 't.faq.title' },
  { from: 'translations.faq.subtitle', to: 't.faq.subtitle' },
  { from: 'translations.faq.questions.privacy.question', to: 't.faq.questions.privacy.question' },
  { from: 'translations.faq.questions.privacy.answer', to: 't.faq.questions.privacy.answer' },
  { from: 'translations.faq.questions.fileSize.question', to: 't.faq.questions.fileSize.question' },
  { from: 'translations.faq.questions.fileSize.answer', to: 't.faq.questions.fileSize.answer' },
  { from: 'translations.faq.questions.compression.question', to: 't.faq.questions.compression.question' },
  { from: 'translations.faq.questions.compression.answer', to: 't.faq.questions.compression.answer' },
  { from: 'translations.faq.questions.account.question', to: 't.faq.questions.account.question' },
  { from: 'translations.faq.questions.account.answer', to: 't.faq.questions.account.answer' },
  { from: 'translations.faq.questions.browsers.question', to: 't.faq.questions.browsers.question' },
  { from: 'translations.faq.questions.browsers.answer', to: 't.faq.questions.browsers.answer' },
  
  // Footer section
  { from: 'translations.footer.quickLinks', to: 't.footer.quickLinks' },
  { from: 'translations.footer.legal', to: 't.footer.legal' },
  { from: 'translations.footer.links.privacy', to: 't.footer.links.privacy' },
  { from: 'translations.footer.links.terms', to: 't.footer.links.terms' },
  { from: 'translations.footer.copyright', to: 't.footer.copyright' }
];

// 执行替换
replacements.forEach(({ from, to }) => {
  const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, to);
});

// 写回文件
fs.writeFileSync(filePath, content, 'utf8');

console.log('Translation replacements completed!');
