/* eslint-disable */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple .env parser to avoid extra dependency
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.error('Error: .env file not found.');
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.trim().match(/^([^=]+)=(.*)$/);
    if (match) {
      env[match[1].trim()] = match[2].trim();
    }
  });
  return env;
}

async function uploadAssets() {
  const env = loadEnv();
  const supabaseUrl = env.VITE_SUPABASE_URL;
  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Supabase credentials missing from .env');
    process.exit(1);
  }

  console.log('Connecting to Supabase at:', supabaseUrl);
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const gifs = ['success_dance_1.gif', 'success_dance_2.gif'];
  
  for (const gif of gifs) {
    const filePath = path.join(__dirname, 'public', gif);
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: Local file ${filePath} not found, skipping.`);
      continue;
    }

    console.log(`Reading local file: ${gif}`);
    const fileBuffer = fs.readFileSync(filePath);

    console.log(`Uploading ${gif} to bucket "assets"...`);
    // Note: This expects the "assets" storage bucket to exist and be public.
    const { error } = await supabase.storage
      .from('assets')
      .upload(gif, fileBuffer, {
        contentType: 'image/gif',
        upsert: true
      });

    if (error) {
      console.error(`Error uploading ${gif}:`, error.message);
      console.log('Make sure you have created a public bucket named "assets" in Supabase Storage with public upload access policies enabled.');
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(gif);
      console.log(`Success! Public URL for ${gif}:`);
      console.log(`  ${publicUrl}\n`);
    }
  }
}

uploadAssets().catch(err => {
  console.error('Unexpected error:', err);
});
