import React, { useState, useEffect } from 'react';
import { Upload } from 'antd';

import { getCandidateProfile } from '@/services/api';

const Documents = ({ email }) => {
  const [candidateProfileData, setCandidateProfileData] = useState({});

  useEffect(() => {
    getCandidateProfile(email).then(r => {
      const candidateProfile = r;
      if (r) {
        if (candidateProfile.files) {
          candidateProfile.files = r.files.map(r => ({
            ...r,
            url: `https://a.deephire.com/v1/candidates/${email}/documents/${r.uid}`,
          }));
        }
        setCandidateProfileData(candidateProfile);
      }
    });
  }, []);

  return <div><Upload key={candidateProfileData.files} defaultFileList={candidateProfileData.files}/></div>;
};
export default Documents;
