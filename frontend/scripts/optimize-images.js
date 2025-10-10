import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

async function optimizeDirectory(dir) {
  const files = await readdir(dir);
  const pngFiles = files.filter(f => f.endsWith('.png'));

  for (const file of pngFiles) {
    const inputPath = join(dir, file);
    const outputPath = join(dir, file.replace('.png', '.webp'));

    try {
      const inputStats = await stat(inputPath);
      
      await sharp(inputPath)
        .webp({ quality: 85 })
        .toFile(outputPath);

      const outputStats = await stat(outputPath);
      const reduction = Math.round((1 - outputStats.size / inputStats.size) * 100);
      
      console.log(`✓ ${file} -> ${file.replace('.png', '.webp')} (${reduction}% smaller)`);
    } catch (error) {
      console.error(`✗ Failed to convert ${file}:`, error.message);
    }
  }
}

async function optimizeImages() {
  console.log('Optimizing images in public/...');
  await optimizeDirectory('./public');
  
  console.log('\nOptimizing images in public/step/...');
  await optimizeDirectory('./public/step');

  console.log('\nOptimization complete!');
}

optimizeImages();
