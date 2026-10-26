/** @param {{ createdAt: string, _id: string }} left @param {{ createdAt: string, _id: string }} right */
const compareRemindersByCreatedAt = (left, right) =>
  Date.parse(right.createdAt) - Date.parse(left.createdAt) ||
  right._id.localeCompare(left._id);

module.exports = compareRemindersByCreatedAt;
