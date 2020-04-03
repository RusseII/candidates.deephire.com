import { fetchCompanyInfo, fetchShortlist } from '@/services/api';
import { Col, Layout, Row } from 'antd';
import * as Sentry from '@sentry/browser';

import qs from 'qs';
import React, { useEffect, useState } from 'react';
import styles from './index.css';
const Header = Layout.Header;

Sentry.init({dsn: "https://ba050977b865461497954ae331877145@sentry.io/5187820"});


const BasicLayout = ({ location, children }) => {
  const [companyInfo, setCompanyInfo] = useState({ companyName: 'Loading...', logo: '' });
  const id = qs.parse(location.search)['?shortlist'];

  useEffect(() => {
    fetchShortlist(id).then(r => {
      if (r) {
        fetchCompanyInfo(r[0].companyId).then(r => setCompanyInfo(r || {}));
      }
    });
  }, []);

  return (
    <div style={{ backgroundColor: '#F0F2F5' }}>
      <Header style={{ backgroundColor: 'white' }}>
        <Row type="flex" justify="space-between">
          <Col>Shared by: {companyInfo.companyName || 'DeepHire'}</Col>
          <Col>
            <img
              src={companyInfo.logo || 'https://s3.amazonaws.com/deephire/dh_vertical.png'}
              alt={companyInfo.companyName}
              height="50px"
            />
          </Col>
        </Row>
      </Header>
      <div />
      <div className={styles.container}> {children}</div>
    </div>
  );
};

export default BasicLayout;
