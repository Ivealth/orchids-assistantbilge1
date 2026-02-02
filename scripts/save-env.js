const fs = require('fs');
const keys = ['CEREBRAS_API_KEY', 'TAVILY_API_KEY'];
let envContent = '';

keys.forEach(key => {
  if (process.env[key]) {
    envContent += `${key}=${process.env[key]}\n`;
    console.log(`Found ${key}`);
  } else {
    console.log(`Missing ${key}`);
  }
});

if (envContent) {
  fs.writeFileSync('.env', envContent);
  console.log('.env file created successfully');
} else {
  console.log('No keys found to write to .env');
}
