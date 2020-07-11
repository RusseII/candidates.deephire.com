import { fetchCompanyInfo, fetchShortlist } from '@/services/api';
import { PageHeader } from 'antd';
import * as Sentry from '@sentry/browser';

import qs from 'qs';
import React, { useEffect, useState } from 'react';
import styles from './index.css';

import { router } from 'umi';

Sentry.init({ dsn: "https://ba050977b865461497954ae331877145@sentry.io/5187820" });

export const ShortListContext = React.createContext();

const BasicLayout = ({ location, children }) => {
  const [shortListData, setShortListData] = useState(null)
  const [companyInfo, setCompanyInfo] = useState({ companyName: 'Loading...', logo: '' });
  const id = qs.parse(location.search)['?shortlist'];

  useEffect(() => {
    const getShortListData = async (id) => {
      const data = await fetchShortlist(id)
      setShortListData(data)
      const { companyId } = data[0]
      const companyData = await fetchCompanyInfo(companyId)
      setCompanyInfo(companyData)
    }
    getShortListData(id)
  }, [id]);


const contextValue = () => {
  return {companyInfo, shortListData}
}

  return (
    <div style={{ backgroundColor: '#F0F2F5' }}>
      <ShortListContext.Provider value={contextValue()}>
        <PageHeader ghost={false} extra={<img
          src={companyInfo.logo || 'https://s3.amazonaws.com/deephire/dh_vertical.png'}
          alt={companyInfo.companyName}
          height="32px"
        />} title={companyInfo.companyName}
        
        onBack={window.location.pathname !== '/shortlist' && shortListData ? () => router.push(`/shortlist?shortlist=${id}`) : null}
        
        />
        <div className={styles.container}> {children}</div>
      </ShortListContext.Provider>
    </div>

  );
};

export default BasicLayout;
