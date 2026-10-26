const assert = require('node:assert/strict');
const { test } = require('node:test');
const compareRemindersByCreatedAt = require('../src/utils/compareRemindersByCreatedAt.js');

test('orders reminders newest first without using edited timestamps', () => {
  const older = {
    _id: '000000000000000000000002',
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-12-01T10:00:00.000Z',
  };
  const newer = {
    _id: '000000000000000000000001',
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-02-01T10:00:00.000Z',
  };

  assert.deepEqual([older, newer].sort(compareRemindersByCreatedAt), [newer, older]);
});

test('uses descending reminder IDs as a deterministic creation-time tie-break', () => {
  const first = { _id: '000000000000000000000001', createdAt: '2026-01-01T00:00:00.000Z' };
  const second = { _id: '000000000000000000000002', createdAt: '2026-01-01T00:00:00.000Z' };

  assert.deepEqual([first, second].sort(compareRemindersByCreatedAt), [second, first]);
});
