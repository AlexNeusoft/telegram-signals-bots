import { config } from '../config.js';

export function isAdminUserId(userId) {
  return config.ADMIN_IDS.includes(Number(userId));
}
