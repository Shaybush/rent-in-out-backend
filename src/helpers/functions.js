exports.checkUndefinedOrNull = (value) => {
  return (
    value === undefined ||
    value === null ||
    value === 'undefined' ||
    value === 'null' ||
    value === ''
  );
};
