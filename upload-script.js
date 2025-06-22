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
          reject(new Error(`Parse error: ${body}`));
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
    if (item.startsWith('.') || item === 'node_modules' || item === 'upload-script.js') continue;
    
    const fullPath = path.join(dir, item);
    const relativePath = path.join(basePath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files = files.concat(getFilesRecursively(fullPath, relativePath));
    } else {
      files.push({
        path: relativePath.replace(/\\/g, '/'),
        fullPath: fullPath
      });
    }
  }
  
  return files;
}

async function uploadFiles() {
  try {
    console.log('Getting file list...');
    const files = getFilesRecursively('.');
    console.log(`Found ${files.length} files to upload`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`[${i + 1}/${files.length}] Uploading: ${file.path}`);
      
      try {
        const content = fs.readFileSync(file.fullPath);
        const base64Content = content.toString('base64');
        
        const url = `${BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${file.path}`;
        const data = {
          message: `Add ${file.path}`,
          content: base64Content
        };
        
        await makeRequest('PUT', url, data);
        console.log(`✓ Uploaded: ${file.path}`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`✗ Failed to upload ${file.path}: ${error.message}`);
      }
    }
    
    console.log('\nUpload complete!');
    console.log(`Repository URL: https://github.com/${REPO_OWNER}/${REPO_NAME}`);
    
  } catch (error) {
    console.error('Upload failed:', error.message);
  }
}

uploadFiles();