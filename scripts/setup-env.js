#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');

function createEnvFile() {
  const envContent = `# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Get your API key from: https://makersuite.google.com/app/apikey
# Replace 'your_gemini_api_key_here' with your actual Gemini API key
`;

  try {
    if (fs.existsSync(envPath)) {
      console.log('⚠️  .env.local file already exists');
      console.log('📝 Please make sure GEMINI_API_KEY is set in your .env.local file');
    } else {
      fs.writeFileSync(envPath, envContent);
      console.log('✅ .env.local file created successfully!');
      console.log('📝 Please add your Gemini API key to the .env.local file');
      console.log('🔗 Get your API key from: https://makersuite.google.com/app/apikey');
    }
  } catch (error) {
    console.error('❌ Error creating .env.local file:', error.message);
  }
}

createEnvFile(); 