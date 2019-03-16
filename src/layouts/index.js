import { Col, Row, Layout } from 'antd';
import React, {  useState, useEffect } from 'react';
import qs from 'qs';
import { fetchShortlist } from '@/services/api';
const Header = Layout.Header;

const BasicLayout = ({ location, children }) => {
  const [shortListData, setShortListData] = useState({})
  const id = qs.parse(location.search)['?shortlist'];


  useEffect(() => {
    fetchShortlist(id).then(r =>
        setShortListData(r[0])
        
      )
  }, [])

    return (
      <div style={{ backgroundColor: '#F0F2F5', padding: '0px' }}>
        <Header style={{ backgroundColor: 'white' }}>
          {' '}
          <Row type="flex" style={{ height: '60px' }} justify="space-between">
            <Col>
              Shared by:{' '}
              {shortListData.createdBy === 'mskalak@allectiomedical.com'
                ? 'Allectio Medical'
                : shortListData.createdBy === 'dbrennan@assistinghands.com' ? "Assisting Hands":'Tempo'}
            </Col>
            <Col>
              {shortListData.createdBy === 'mskalak@allectiomedical.com' ? (
                <img
                  src="https://s3.amazonaws.com/deephire/allectio.png"
                  alt="Allectio Medical"
                  height="50px"
                />
              ) : 
                
                shortListData.createdBy === 'dbrennan@assistinghands.com' ? 

              (
                <img
                  src="https://s3.amazonaws.com/deephire/logos/AssistingHandsLogo.jpg"
                  alt="assistingHands"
                  height="50px"
                />
                  ) : <img
                    src="https://s3.amazonaws.com/deephire/importantImages/suzanneTempoLogo.png"
                    alt="Forge"
                    height="50px"
                  />}
            </Col>
          </Row>
        </Header>
        <div />
        <div style={{ height: '100vh', padding: '20px' }}>{children}</div>
      </div>
    );
  }

  export default BasicLayout