import { fetchCompanyInfo, fetchShortlist } from '@/services/api';
import { Col, Layout, Row } from 'antd';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import styles from './index.css';
const Header = Layout.Header;

const BasicLayout = ({ location, children }) => {
  const [companyInfo, setCompanyInfo] = useState({ companyName: 'Loading...', logo: '' });
  const id = qs.parse(location.search)['?shortlist'];

  useEffect(() => {
    fetchShortlist(id).then(r => {
      if (r) {
      fetchCompanyInfo(r[0].createdBy).then(r => setCompanyInfo(r || {}));
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
