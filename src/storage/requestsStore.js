// src/storage/requestsStore.js

/**
 * request schema:
 * {
 *   id: string,
 *   userId: number,
 *   username: string | null,
 *   fullName: string,
 *   brokerEmail: string,
 *   proofFileId: string, // Telegram file_id (photo)
 *   status: 'pending' | 'approved' | 'rejected',
 *   createdAt: number,
 *   reviewedBy: number | null,
 *   reviewedAt: number | null,
 * }
 */

const requests = new Map(); // id -> request
const userToPending = new Map(); // userId -> requestId (prevent duplicates)

function makeId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function createRequest(payload) {
  const existing = userToPending.get(payload.userId);
  if (existing) {
    const req = requests.get(existing);
    if (req && req.status === 'pending') return req; // keep one pending per user
  }

  const id = makeId();
  const req = {
    id,
    ...payload,
    status: 'pending',
    createdAt: Date.now(),
    reviewedBy: null,
    reviewedAt: null,
  };
  requests.set(id, req);
  userToPending.set(payload.userId, id);
  return req;
}

export function getRequest(id) {
  return requests.get(id) || null;
}

export function listPending(limit = 20) {
  const arr = [...requests.values()].filter(r => r.status === 'pending');
  arr.sort((a, b) => b.createdAt - a.createdAt);
  return arr.slice(0, limit);
}

export function updateStatus(id, status, reviewerId) {
  const req = requests.get(id);
  if (!req) return null;
  req.status = status;
  req.reviewedBy = reviewerId;
  req.reviewedAt = Date.now();
  requests.set(id, req);
  return req;
}
