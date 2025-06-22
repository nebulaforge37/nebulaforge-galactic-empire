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
          resolve({ statusCode: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function getExistingFile(filePath) {
  try {
    const url = `${BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;
    const result = await makeRequest('GET', url);
    if (result.statusCode === 200) {
      return result.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}

function getFilesRecursively(dir, basePath = '') {
  const items = fs.readdirSync(dir);
  let files = [];
  
  for (const item of items) {
    if (item.startsWith('.') || 
        item === 'node_modules' || 
        item.includes('upload') ||
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

async function uploadFile(file) {
  try {
    const content = fs.readFileSync(file.fullPath);
    const base64Content = content.toString('base64');
    
    // Check if file exists
    const existing = await getExistingFile(file.path);
    
    const url = `${BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${file.path}`;
    const data = {
      message: existing ? `Update ${file.path}` : `Add ${file.path}`,
      content: base64Content
    };
    
    // Add SHA if file exists
    if (existing && existing.sha) {
      data.sha = existing.sha;
    }
    
    const result = await makeRequest('PUT', url, data);
    return result.statusCode >= 200 && result.statusCode < 300;
    
  } catch (error) {
    return false;
  }
}

async function uploadCoreFiles() {
  console.log('Starting strategic upload of core files...');
  
  // Priority files to upload
  const priorityPaths = [
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'tailwind.config.ts',
    'drizzle.config.ts',
    'client/src/App.tsx',
    'server/index.ts',
    'server/db.ts',
    'server/storage.ts',
    'shared/schema.ts'
  ];
  
  let uploaded = 0;
  
  for (const filePath of priorityPaths) {
    if (fs.existsSync(filePath)) {
      console.log(`Uploading: ${filePath}`);
      const success = await uploadFile({ path: filePath, fullPath: filePath });
      if (success) {
        uploaded++;
        console.log(`✓ ${filePath}`);
      } else {
        console.log(`✗ ${filePath}`);
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log(`Core files uploaded: ${uploaded}/${priorityPaths.length}`);
  
  // Upload remaining files in batches
  const allFiles = getFilesRecursively('.')
    .filter(file => file.size < 10 * 1024 * 1024) // Skip large files
    .filter(file => !priorityPaths.includes(file.path));
  
  console.log(`\nUploading ${allFiles.length} additional files...`);
  
  const batchSize = 10;
  let totalUploaded = uploaded;
  
  for (let i = 0; i < allFiles.length; i += batchSize) {
    const batch = allFiles.slice(i, i + batchSize);
    console.log(`\nBatch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allFiles.length/batchSize)}`);
    
    for (const file of batch) {
      const success = await uploadFile(file);
      if (success) {
        totalUploaded++;
        console.log(`✓ [${totalUploaded}] ${file.path}`);
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    if (i + batchSize < allFiles.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`\nFinal Summary:`);
  console.log(`Total files uploaded: ${totalUploaded}`);
  console.log(`Repository: https://github.com/${REPO_OWNER}/${REPO_NAME}`);
}

uploadCoreFiles();