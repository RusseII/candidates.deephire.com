import { Col, Row, Layout } from 'antd';
import React, { Component } from 'react';
import qs from 'qs';
import { fetchShortlist } from '@/services/api';
const Header = Layout.Header;

export default class BasicLayout extends Component {
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
    return (
      <div style={{ backgroundColor: '#F0F2F5', padding: '0px' }}>
        <Header style={{ backgroundColor: 'white' }}>
          {' '}
          <Row type="flex" style={{ height: '60%' }} justify="space-between">
            <Col>Shared by: Tempo</Col>
            <Col>
              {this.state.shortListData.sharedBy === 'mskalak@allectiomedical.com' ? (
                <img
                  src="https://s3.amazonaws.com/deephire/allectio.png"
                  alt="Allectio Medical"
                  height="100%"
                />
              ) : (
                <img
                  src="https://s3.amazonaws.com/deephire/importantImages/suzanneTempoLogo.png"
                  alt="Forge"
                  height="100%"
                />
              )}
            </Col>
          </Row>
        </Header>
        <div />
        <div style={{ height: '100vh', padding: '20px' }}>{this.props.children}</div>
      </div>
    );
  }
}
