const toPlainObject = (value) => {
  if (!value) return value;
  if (typeof value.toObject === 'function') {
    return value.toObject();
  }

  return { ...value };
};

const sanitizeUser = (user) => {
  const plainUser = toPlainObject(user);
  if (!plainUser) return plainUser;

  delete plainUser.password;
  return plainUser;
};

const pickAllowedFields = (payload, allowedFields) => Object.fromEntries(
  Object.entries(payload || {}).filter(([key, value]) => allowedFields.includes(key) && value !== undefined)
);

module.exports = {
  sanitizeUser,
  pickAllowedFields
};
