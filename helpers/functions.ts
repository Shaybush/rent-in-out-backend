exports.checkUndefinedOrNull = (value: string | null | undefined) => {
  return (
    value === undefined ||
    value === null ||
    value === 'undefined' ||
    value === 'null' ||
    value === ''
  );
};
