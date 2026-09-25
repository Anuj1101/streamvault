import mediaService from '../services/mediaService.js';

console.log('Testing live YouTube metadata extraction on public sample...');

async function testAnalyze() {
  const result = await mediaService.analyze('https://www.youtube.com/watch?v=jNQXAC9IVRw');
  console.log('Analysis Result:');
  console.log('Title:', result.title);
  console.log('Channel:', result.channel);
  console.log('Duration:', result.duration, `(${result.formattedDuration})`);
  console.log('Thumbnail:', result.thumbnail ? 'Found' : 'Missing');
  console.log('Qualities:', result.qualities.map(q => `${q.key}: ${q.available ? 'Available' : 'Unavailable'}`).join(', '));
  console.log('Formats:', Object.keys(result.formats).join(', '));
  console.log('✓ Analyze test passed successfully!');
  process.exit(0);
}

testAnalyze().catch(err => {
  console.error('Analyze test failed:', err);
  process.exit(1);
});
