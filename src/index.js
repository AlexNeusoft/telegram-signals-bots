// src/index.js
import express from 'express';
import { config } from './config.js';
import { buildAdsBot } from './bots/adsBot.js';
import { buildCommunityBot } from './bots/communityBot.js';

const app = express();
app.use(express.json({ limit: '2mb' }));

const adsBot = buildAdsBot();
const commBot = buildCommunityBot();

// Webhook endpoints (Telegram will POST updates here)
app.post('/webhook/ads', (req, res) => {
  adsBot.handleUpdate(req.body);
  res.sendStatus(200);
});

app.post('/webhook/community', (req, res) => {
  commBot.handleUpdate(req.body);
  res.sendStatus(200);
});

// health check
app.get('/', (_, res) => res.send('OK'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // local dev: we won't set webhook (no public URL)
  if (!config.PUBLIC_URL) {
    console.log('PUBLIC_URL not set -> skipping webhook setup (local mode).');
    console.log('Next: run ngrok OR deploy and set PUBLIC_URL.');
    return;
  }

  const adsWebhook = `${config.PUBLIC_URL}/webhook/ads`;
  const commWebhook = `${config.PUBLIC_URL}/webhook/community`;

  await adsBot.telegram.setWebhook(adsWebhook);
  await commBot.telegram.setWebhook(commWebhook);

  console.log('Webhooks set:');
  console.log('ADS:', adsWebhook);
  console.log('COMM:', commWebhook);
});
