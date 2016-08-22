function param(params) {
  const keys = Object.keys(params);
  const errors = [];
  
  for (const key of keys) {
    if (typeof params[key].value === 'undefined') {
      errors.push({
        field: key,
        code: 'missing_field'
      });
    } else if (!params[key].test(params[key].value)) {
      errors.push({
        field: key,
        code: 'invalid'
      });
    }
  }

  return errors;
}

export default {
  param
};
