import fetch from 'isomorphic-fetch';
// require('es6-promise').polyfill();
// require('isomorphic-fetch');

const apiUrl = 'https://a.deephire.com/v1/';
// const apiUrl = 'http://localhost:3000/v1/';

export const fetchShortlist = id => {
  return fetch(`${apiUrl}shortlists/${id}`)
    .then(response => response.json())
    .then(data => data);
};

export const fetchCompanyInfo = id => {
  return fetch(`${apiUrl}companies/${id}`)
    .then(response => {
      if (response.ok) return response.json();
    })
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

export const sendEmail = (id, clientName, clientEmail, createdBy) => {
  var data = {
    type: 'shortListViewed',
    id,
    clientName,
    recipients: [createdBy || 'noemail@deephire.com'],
    clientEmail,
  };

  fetch(`${apiUrl}emails`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const getCandidateProfile = id => {
  return fetch(`${apiUrl}candidates/${id}`)
    .then(response => response.json())
    .then(data => data);
};
