const apiUrl = 'https://a.deephire.com/v1/';

export const fetchShortlist = id => {
    console.log('fetchShortlist function ran ' + id);

  return fetch(`${apiUrl}shortlists/${id}`)
    .then(response => response.json())
    .then(data => data);
};
