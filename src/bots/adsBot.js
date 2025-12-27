// src/bots/adsBot.js
import { Telegraf, Markup } from 'telegraf';
import { config } from '../config.js';

export function buildAdsBot() {
  const bot = new Telegraf(config.ADS_BOT_TOKEN);

  bot.start(async (ctx) => {
    const text =
      `Welcome! 👋\n\n` +
      `This is the official entry bot.\n` +
      `Use the buttons below to join the community and learn how VIP access works.`;

    const kb = Markup.inlineKeyboard([
      [Markup.button.url('✅ Join Free Community', config.COMMUNITY_LINK || 'https://t.me/')],
      [Markup.button.callback('💎 How VIP Works', 'ADS_VIP_INFO')],
    ]);

    await ctx.reply(text, kb);
  });

  bot.action('ADS_VIP_INFO', async (ctx) => {
    await ctx.answerCbQuery();
    const text =
      `VIP Access is granted after manual verification.\n\n` +
      `Steps:\n` +
      `1) Open an account with our broker\n` +
      `2) Deposit the minimum required amount\n` +
      `3) Apply for VIP\n` +
      `4) Our admins verify manually and send you an invite link\n`;
    await ctx.reply(text);
  });

  // helpful: show user id for admin setup
  bot.command('myid', async (ctx) => {
    await ctx.reply(`Your Telegram ID: ${ctx.from.id}`);
  });

  return bot;
}
