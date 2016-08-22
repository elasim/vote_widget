export default async function request(...args) {
  try {
    const res = await fetch(...args);
    if (res.headers.get('Content-Type').indexOf('application/json') === 0) {
      const result = await res.json();
      if (res.status >= 400) {
        const error = { message: result.message || res.statusText };
        if (result.errors) {
          error.errors = result.errors;
        }
        throw error;
      } else {
        return result;
      }
    } else {
      if (res.status >= 400) {
        throw {
          message: res.statusText
        };
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      throw { message: 'Network Error' };
    } else {
      throw e;
    }
  }
}
