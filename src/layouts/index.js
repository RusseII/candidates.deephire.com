import { Col, Row, Layout } from 'antd';
import React, { useState, useEffect } from 'react';
import qs from 'qs';
import { fetchShortlist, fetchCompanyInfo } from '@/services/api';
const Header = Layout.Header;

const BasicLayout = ({ location, children }) => {
  const [shortListData, setShortListData] = useState({});
  const [companyInfo, setCompanyInfo] = useState({ companyName: 'Loading...', logo: '' });
  const id = qs.parse(location.search)['?shortlist'];

  useEffect(() => {
    fetchShortlist(id).then(r => {
      setShortListData(r[0]);
      fetchCompanyInfo(r[0].createdBy).then(r => setCompanyInfo(r || {}));
    });
  }, []);

  console.log(companyInfo);
  return (
    <div style={{ backgroundColor: '#F0F2F5', padding: '0px' }}>
      <Header style={{ backgroundColor: 'white' }}>
        {' '}
        <Row type="flex" style={{ height: '60px' }} justify="space-between">
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
      <div style={{ height: '100vh', padding: '20px' }}>{children}</div>
    </div>
  );
};

export default BasicLayout;
