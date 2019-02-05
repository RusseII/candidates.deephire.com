import { Col, Row, Layout } from 'antd';
const Header = Layout.Header;

function BasicLayout(props) {
  return (
    <div style={{ backgroundColor: '#F0F2F5', padding: '0px' }}>
      <Header style={{ backgroundColor: 'white' }}>
        {' '}
        <Row type="flex" style={{ height: '60%' }} justify="space-between">
          <Col>Shared by: Tempo</Col>
          <Col>
            <img
              src="https://s3.amazonaws.com/deephire/importantImages/suzanneTempoLogo.png"
              alt="Forge"
              height="100%"
            />
          </Col>
        </Row>
      </Header>
      <div style={{height: "100vh", padding: "20px"}}>
      {props.children}
      </div>
    </div>
  );
}

export default BasicLayout;
