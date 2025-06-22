import fs from 'fs';
import path from 'path';
import https from 'https';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'nebulaforge37';
const REPO_NAME = 'nebulaforge-galactic-empire';
const BASE_URL = 'https://api.github.com';

function makeRequest(method, url, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'NebulaForge-Upload'
      }
    };

    if (data) {
      options.headers['Content-Type'] = 'application/json';
    }

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${parsed.message || body}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(body);
          } else {
            reject(new Error(`Parse error: ${body}`));
          }
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

function getFilesRecursively(dir, basePath = '') {
  const items = fs.readdirSync(dir);
  let files = [];
  
  for (const item of items) {
    if (item.startsWith('.') || 
        item === 'node_modules' || 
        item === 'upload-script.js' || 
        item === 'batch-upload.js' ||
        item.includes('.log')) continue;
    
    const fullPath = path.join(dir, item);
    const relativePath = path.join(basePath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files = files.concat(getFilesRecursively(fullPath, relativePath));
    } else {
      files.push({
        path: relativePath.replace(/\\/g, '/'),
        fullPath: fullPath,
        size: stat.size
      });
    }
  }
  
  return files;
}

async function uploadBatch() {
  try {
    console.log('Getting remaining files...');
    const allFiles = getFilesRecursively('.');
    
    // Filter out files that are too large (GitHub has 100MB limit, but we'll use 50MB to be safe)
    const files = allFiles.filter(file => file.size < 50 * 1024 * 1024);
    const skippedFiles = allFiles.filter(file => file.size >= 50 * 1024 * 1024);
    
    if (skippedFiles.length > 0) {
      console.log(`Skipping ${skippedFiles.length} large files:`);
      skippedFiles.forEach(file => console.log(`  - ${file.path} (${(file.size / 1024 / 1024).toFixed(2)}MB)`));
    }
    
    console.log(`Found ${files.length} files to upload (${skippedFiles.length} skipped)`);

    // Upload in smaller batches to avoid overwhelming the API
    const batchSize = 20;
    let uploaded = 0;
    let failed = 0;

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      console.log(`\nProcessing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(files.length/batchSize)}`);
      
      const promises = batch.map(async (file, index) => {
        try {
          const content = fs.readFileSync(file.fullPath);
          const base64Content = content.toString('base64');
          
          const url = `${BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${file.path}`;
          const data = {
            message: `Add ${file.path}`,
            content: base64Content
          };
          
          await makeRequest('PUT', url, data);
          uploaded++;
          console.log(`✓ [${uploaded}] ${file.path}`);
          
        } catch (error) {
          if (error.message.includes('422') && error.message.includes('already exists')) {
            console.log(`- [${uploaded + failed + 1}] ${file.path} (already exists)`);
          } else {
            failed++;
            console.error(`✗ [${uploaded + failed}] ${file.path}: ${error.message}`);
          }
        }
      });
      
      await Promise.all(promises);
      
      // Wait between batches
      if (i + batchSize < files.length) {
        console.log('Waiting 2 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`\nUpload Summary:`);
    console.log(`✓ Uploaded: ${uploaded} files`);
    console.log(`✗ Failed: ${failed} files`);
    console.log(`- Skipped: ${skippedFiles.length} large files`);
    console.log(`\nRepository: https://github.com/${REPO_OWNER}/${REPO_NAME}`);
    
  } catch (error) {
    console.error('Batch upload failed:', error.message);
  }
}

uploadBatch();