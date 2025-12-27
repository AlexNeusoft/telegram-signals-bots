import 'dotenv/config';

function must(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const config = {
  ADS_BOT_TOKEN: must('ADS_BOT_TOKEN'),
  COMM_BOT_TOKEN: must('COMM_BOT_TOKEN'),
  PUBLIC_URL: process.env.PUBLIC_URL || '',
  VIP_INVITE_LINK: process.env.VIP_INVITE_LINK || '',
  COMMUNITY_LINK: process.env.COMMUNITY_LINK || '',
  ADMIN_IDS: (process.env.ADMIN_IDS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(x => Number(x))
    .filter(n => Number.isFinite(n)),
};
