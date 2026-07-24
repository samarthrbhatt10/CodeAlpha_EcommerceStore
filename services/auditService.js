const AuditLog = require('../models/AuditLog');

const logAction = async (actorId, action, targetType, targetId, details = {}) => {
  try {
    const log = new AuditLog({
      actorId,
      action,
      targetType,
      targetId,
      details
    });
    await log.save();
    console.log(`[AUDIT] User ${actorId} performed ${action} on ${targetType} ${targetId}`);
  } catch (err) {
    console.error('[AUDIT ERROR]', err);
  }
};

module.exports = { logAction };
