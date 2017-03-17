/* eslint no-param-reassign: 0 */
/* global fetch */

const prepareFormData = (values) => {
  const body = new FormData();
  Object.keys(values).forEach((key) => {
    if (values[key] instanceof FileList) {
      for (let i = 0; i < values[key].length; i += 1) {
        body.append(key, values[key][i]);
      }
    } else {
      body.append(key, values[key]);
    }
  });
  return body;
};

export default (url, options) => {
  const { values, headers } = options;
  if (values instanceof Object && Object.keys(values).length > 0) {
    options.body =
      (headers && headers['Content-Type'] && headers['Content-Type'] === 'application/json') ?
      JSON.stringify(values) :
      prepareFormData(values);
  }
  options.credentials = 'same-origin';
  return fetch(url, options)
    .then((response) => {
      return response.json().then(
        (body) => {
          return { status: response.status, body };
        },
        () => {
          return { status: response.status, body: {} };
        },
      );
    })
    .then((res) => {
      if (res.status >= 400) {
        throw res;
      } else {
        return res;
      }
    });
};
