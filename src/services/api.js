import fetch from 'isomorphic-fetch';
// require('es6-promise').polyfill();
// require('isomorphic-fetch');

const apiUrl = 'https://a.deephire.com/v1/';
// const apiUrl = 'https://dev-a.deephire.com/v1/';

// const apiUrl = 'http://localhost:3000/v1/';

export const fetchShortlist = async id => {
  const resp = await fetch(`${apiUrl}shortlists/${id}`);
  if (resp.ok) {
    return await resp.json();
  }
  return null;
};

export const fetchCompanyInfo = companyId => {
  return fetch(`${apiUrl}companies/${companyId}`)
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

export const sendEmail = (template, id, clientName, clientEmail, createdBy, description) => {
  var data = {
    template,
    analyticsUrl: `https://recruiter.deephire.com/sharelinks/analytics/?id=${id}`,
    clientName,
    recipients: [createdBy || 'noemail@deephire.com'],
    clientEmail,
    sharelinkDescription: description,
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
