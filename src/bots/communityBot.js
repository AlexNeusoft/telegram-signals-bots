// src/bots/communityBot.js
import { Telegraf, Markup } from 'telegraf';
import { config } from '../config.js';
import { isAdminUserId } from '../utils/admin.js';
import { listPending } from '../storage/requestsStore.js';

export function buildCommunityBot() {
  const bot = new Telegraf(config.COMM_BOT_TOKEN);

  // Welcome new members (works in groups/supergroups)
  bot.on('new_chat_members', async (ctx) => {
    const newcomers = ctx.message.new_chat_members || [];
    for (const u of newcomers) {
      const name = [u.first_name, u.last_name].filter(Boolean).join(' ');
      const text =
        `Welcome ${name}! 👋\n\n` +
        `To get VIP access:\n` +
        `1) Create a broker account\n` +
        `2) Deposit the minimum amount\n` +
        `3) Apply here and upload proof\n\n` +
        `Click below to start the application.`;

      const kb = Markup.inlineKeyboard([
        [Markup.button.callback('📝 Apply for VIP Access', 'VIP_APPLY_START')],
      ]);

      await ctx.reply(text, kb);
    }
  });

  // Admin: list pending (placeholder)
  bot.command('pending', async (ctx) => {
    if (!isAdminUserId(ctx.from.id)) return ctx.reply('Admins only.');
    const pending = listPending(10);
    if (!pending.length) return ctx.reply('No pending requests.');
    const lines = pending.map((r, i) => `${i + 1}. @${r.username || 'no_username'} | ${r.fullName} | ${r.brokerEmail} | id=${r.id}`);
    await ctx.reply(`Pending requests:\n${lines.join('\n')}`);
  });

  // helpful: show user id for admin setup
  bot.command('myid', async (ctx) => {
    await ctx.reply(`Your Telegram ID: ${ctx.from.id}`);
  });

  // (apply flow + approve/reject îl facem în Pasul 3 și 4)
  bot.action('VIP_APPLY_START', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('Application flow will be enabled next step (email + screenshot).');
  });

  return bot;
}
