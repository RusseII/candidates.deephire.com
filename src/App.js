import React, { Component } from 'react';
import logo from './img/logos/deephirewhite.png';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player'
import { Layout, Container, Row, Col } from 'reactstrap';
import Button from 'material-ui/Button';

import CardComponent from './CardComponent'

import './App.css';
const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 200,
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      questionDataToRender: [],
      questionData: [],
      number: 0
    };

  }
  GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
    }
  }
  // find %20, %40 in a string and replaces with a ' ' and '@' respectively
  CleanVariable(res) {
    if (res === undefined)
      return
    else {
      var res = res.replace(/%20/g, " ");
      var res = res.replace(/%40/g, "@");
      return (res);
    }
  }

  componentDidMount() {
    var company_token = this.CleanVariable(this.GetURLParameter("company"));
    var user_token = this.CleanVariable(this.GetURLParameter("candidate"));

    // var company_token = '436b04b53380061c94c6669fb752c00383a1a4b4dbbc213e4f4602039252ece9:e00821faf1a24d19be748a78b0f5e442'
    // var user_token = 'emerson%20cloud'
    var url = 'https://api.deephire.io/v1.0/get_candidate_videos/'
    fetch(url + company_token + '/' + user_token)
      .then(results => {
        return (results.json())
      }).then(data => {
        let arrayOfResponses = data.map((objKey, index) => {

          this.setState({ questionData: objKey })

          return (
            <Col sm="4">
              <div key={objKey._id.$oid}>
                <CardComponent number={index} thumbnail={objKey.thumbnail} videoURL={objKey.response_url} question_text={objKey.question_text} />
              </div>
            </Col>
          )

        })
        this.setState({ questionDataToRender: arrayOfResponses });
        console.log("state", this.state.questionData)
      })
  }

  render() {
    return (

      <div className="App">

        <Container>
          <Row>
            <Col sm="12" md={{ size: 16, offset: 0 }} style={{ paddingTop: 50 }}>
              <header className="App-header text-center"  >
                <img src={logo} className="App-logo" alt="logo" style={{ marginTop: -30, marginBottom: 50 }} />
                <h1 className="App-title">Meet {this.state.questionData.user_name}!</h1>
                {/* <h2 className="App-title"> <Button variant="raised" style={{ backgroundColor: "#6DC25C", color: "white" }}> View Resume </Button> </h2> */}
              </header>
            </Col>
          </Row>
          <div style={{ marginTop: 20, marginBottom: 20, color: '#9B9B9B', }}>
            <b>Interview Videos</b>
          </div>
          <Row>
            <Col sm="12" md={{ size: 16, offset: 0 }}>
              <Container style={{ backgroundColor: 'white' }}>
                <Row style={{ paddingTop: 30, paddingBottom: 0, paddingRight: 30, paddingLeft: 30 }}>
                  {this.state.questionDataToRender}
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </div >
    );
  }
}

export default App;
