import * as deepl from 'deepl-node';
import fs from 'fs';

const authKey = process.env.DEEPL_API_KEY; // Сложи ключа в .env.local
const translator = new deepl.Translator(authKey);

async function translateFile(inputFile, targetLang) {
  const content = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  const translated = {};

  for (const key in content) {
    if (typeof content[key] === 'string') {
      const result = await translator.translateText(content[key], null, targetLang);
      translated[key] = result.text;
    } else if (typeof content[key] === 'object') {
      translated[key] = {};
      for (const subKey in content[key]) {
        const result = await translator.translateText(content[key][subKey], null, targetLang);
        translated[key][subKey] = result.text;
      }
    }
  }

  fs.writeFileSync(`locales/${targetLang}.json`, JSON.stringify(translated, null, 2));
  console.log(`✅ Translated ${inputFile} → locales/${targetLang}.json`);
}

// Пример: превеждаме bg.json → en.json
translateFile('locales/bg.json', 'EN');
