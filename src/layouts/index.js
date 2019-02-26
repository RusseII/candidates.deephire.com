import { Col, Row, Layout } from 'antd';
import React, { Component } from 'react';
import qs from 'qs';
import { fetchShortlist } from '@/services/api';
const Header = Layout.Header;

export default class BasicLayout extends Component {
  state = { shortListData: null };

  componentDidMount() {
    const { location } = this.props;
    const id = qs.parse(location.search)['?shortlist'];
    console.log(id);
    fetchShortlist(id).then(r =>
      this.setState({
        shortListData: r[0],
        id,
      })
    );
  }

  render() {
    let { shortListData } = this.state;
    if (!shortListData) shortListData = {};
    console.log(shortListData.createdBy);
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
        <div style={{ height: '100vh', padding: '20px' }}>{this.props.children}</div>
      </div>
    );
  }
}
