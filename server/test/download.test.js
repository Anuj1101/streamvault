import mediaService from '../services/mediaService.js';
import fs from 'fs';

console.log('Testing live media preparation and conversion pipeline...');

async function testDownload() {
  const job = await mediaService.startJob({
    rawUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    format: 'mp3',
    quality: 'original'
  });

  console.log(`Job started with ID: ${job.jobId}`);

  // Poll until complete
  let finished = false;
  let attempts = 0;

  while (!finished && attempts < 30) {
    await new Promise(r => setTimeout(r, 1000));
    attempts++;
    const status = mediaService.getJob(job.jobId);
    console.log(`[Attempt ${attempts}] Status: ${status.status} (${status.percent}%) - ${status.message}`);

    if (status.status === 'ready') {
      finished = true;
      const result = mediaService.getJobResult(job.jobId);
      console.log('Job completed successfully! Result:', {
        fileName: result.fileName,
        fileSize: result.fileSize,
        mimeType: result.mimeType,
        fileExists: fs.existsSync(result.filePath)
      });
      // Clean up
      await mediaService.cleanupJob(job.jobId);
      console.log('Cleaned up temp job files.');
      console.log('✓ Full media pipeline test passed!');
      process.exit(0);
    } else if (status.status === 'failed') {
      throw new Error(`Job failed: ${status.error}`);
    }
  }

  if (!finished) {
    throw new Error('Test timed out waiting for job completion.');
  }
}

testDownload().catch(err => {
  console.error('Download pipeline test failed:', err);
  process.exit(1);
});
