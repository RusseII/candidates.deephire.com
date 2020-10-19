import { fetchCompanyInfo, fetchShortlist } from '@/services/api';
import { PageHeader } from 'antd';
import { lowerCaseQueryParams } from '@bit/russeii.deephire.utils.utils';
import * as Sentry from '@sentry/browser';

import React, { useEffect, useState } from 'react';
import styles from './index.css';

import { router } from 'umi';
import AskName from '../components/AskName';

Sentry.init({ dsn: 'https://ba050977b865461497954ae331877145@sentry.io/5187820' });

export const ShortListContext = React.createContext();

const BasicLayout = ({ children }) => {
  const [shortListData, setShortListData] = useState(null);
  // TODO - get from localstorageHere
  const [name, setName] = useState(localStorage.getItem('name'));
    // const [name, setName] = useState(false);

  const [companyInfo, setCompanyInfo] = useState({ companyName: 'Loading...', logo: '' });
  const { shortlist: id } = lowerCaseQueryParams(window.location.search);

  useEffect(() => {
    const getShortListData = async id => {
      const data = await fetchShortlist(id);
      setShortListData(data);
      const { companyId } = data?.[0];
      const companyData = await fetchCompanyInfo(companyId);
      setCompanyInfo(companyData);
    };
    getShortListData(id);
  }, []);

  const contextValue = () => {
    return { companyInfo, shortListData, setShortListData };
  };

  const onSuccess = values => {
    const { name } = values;
    localStorage.setItem('name', name);
    setName(name);
  };

  const interviews = shortListData?.[0]?.interviews;

  const multipleCandidates = interviews && interviews.length > 1;
  return (
    <div style={{ backgroundColor: '#F0F2F5' }}>
      <ShortListContext.Provider value={contextValue()}>
        <PageHeader
          ghost={false}
          extra={
            <img
              src={companyInfo.logo || 'https://s3.amazonaws.com/deephire/dh_vertical.png'}
              alt={companyInfo.companyName}
              height="48px"
              style={{ marginTop: -8, marginBottom: -8 }}
            />
          }
          title={companyInfo.companyName}
          onBack={
            window.location.pathname !== '/shortlist' && multipleCandidates
              ? () => router.push(`/shortlist?shortlist=${id}`)
              : null
          }
        />
        <AskName companyName={companyInfo.companyName} visible={!name} onSuccess={onSuccess} />
        <div className={styles.container}> {children}</div>
      </ShortListContext.Provider>
    </div>
  );
};

export default BasicLayout;
