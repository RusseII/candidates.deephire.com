require('es6-promise').polyfill();
require('isomorphic-fetch');

const apiUrl = 'https://a.deephire.com/v1/';
// const apiUrl = 'http://localhost:3000/v1/';

export const fetchShortlist = id => {
  console.log('fetchShortlist function ran ' + id);

  return fetch(`${apiUrl}shortlists/${id}`)
    .then(response => response.json())
    .then(data => data);
};

export const trackAnalytics = (id, data) => {
  return fetch(`${apiUrl}shortlists/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => data);
};

export const sendEmail = data => {
  return fetch(`${apiUrl}emails`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => data);
};
