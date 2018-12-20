import React, { Component } from "react";
import { render } from "react-dom";
import ReactPlayer from "react-player";

import {
  Card,
  Col,
  Row,
  Icon,
  Table,
  Button,
  Rate,
  Checkbox,
  Radio,
  Input,
  Layout
} from "antd";

import "./App.css";
const { TextArea } = Input;

const RadioGroup = Radio.Group;
const Header = Layout.Header;


const columns = [
  {
    title: "Questions",
    dataIndex: "question_text",
    key: "question_text"
  }
];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeQuestion: null,
      shortListIndex: 0,
      rating: 3
    };
  }

  componentDidMount() {
    const shortList = this.CleanVariable(this.GetURLParameter("shortlist"));

    if (shortList) {
      this.getShortList(shortList);
    } else {
      var id = this.CleanVariable(this.GetURLParameter("id"));
      var userToken = this.CleanVariable(this.GetURLParameter("candidate"));
      this.setState({ id, userToken });
    }
    // var url = "https://localhost:3001/v1.0/get_candidate_videos/";
    this.getVideosOld(id, userToken);
  }

  getShortList(shortlist_id) {
    const url = "https://api.deephire.com/v1.0/get_shortlist/";
        // const url = "http://localhost:3001/v1y.0/get_shortlist/";

    // this.setState({ shortListData, activeQuestion: 0 });

    fetch(`${url + shortlist_id}`)
      .then(results => results.json())
      .then(
        data => {
          this.setState({ shortListData: data, activeQuestion: 0 });
        },
        () => {
          this.setState({ requestFailed: true });
        }
      );

    // return { email: "Russell", interviews: [{}, {}] };
  }

  getVideosOld(id, userToken) {
    const url = "https://api.deephire.com/v1.0/get_candidate_videos/";

    fetch(`${url + id}/${userToken}`)
      .then(results => results.json())
      .then(
        data => {
          this.setState({ candidateData: data, activeQuestion: 0 });
        },
        () => {
          this.setState({ requestFailed: true });
        }
      );
  }

  openInterview = () => {
    // const { company_id, user_id } = data;
    // const {$oid} = _id
    // console.log($oid)
    const url = `https://candidates.deephire.com/?id=${
      this.state.id
    }&candidate=${this.state.userToken}`;

    window.open(url, "_blank");
  };

  getName() {
    return this.state.candidateData[0].user_name;
  }

  GetURLParameter(sParam) {
    const sPageURL = window.location.search.substring(1);
    const sURLVariables = sPageURL.split("&");
    for (let i = 0; i < sURLVariables.length; i++) {
      const sParameterName = sURLVariables[i].split("=");
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
    }
    return null;
  }

  // find %20, %40 in a string and replaces with a ' ' and '@' respectively
  CleanVariable(res) {
    // if (res === null) return;
    if (res == undefined) return;

    var res = res.replace(/%20/g, " ");
    var res = res.replace(/%40/g, "@");
    return res;
  }

  back() {
     if (this.state.shortListIndex > 0){
    this.setState({ rating: 3, value: "", text: "",activeQuestion: 0, shortListIndex: this.state.shortListIndex - 1  });
    
    }

  }
  submitAndContinue() {
    if (this.state.shortListIndex + 1 < this.state.shortListData.interviews.length){
    this.setState({ rating: 3, value: "", text: "", activeQuestion: 0, shortListIndex: this.state.shortListIndex + 1 });
    }
  }
  onChange = e => {
    console.log("radio checked", e.target.value);
    this.setState({
      value: e.target.value
    });
  };

 handleChange= event => {
    this.setState({text: event.target.value});
  }
  render() {
    var {
      candidateData,
      comments,
      activeQuestion,
      requestFailed,
      shortListData
    } = this.state;

    console.log(shortListData, "SSH");

    if (shortListData) {
       candidateData = shortListData.interviews[this.state.shortListIndex];
       var { hideInfo } = shortListData
       console.log(shortListData)
      // console.log(candidateData);
      // this.setState({ candidateData });
    } else if (!candidateData) return <p>Loading...</p>;
    else if (comments === null) return <p> Loading! </p>;
    else if (activeQuestion === null) return <p> Loading questions... </p>;
    else if (requestFailed) return <p>Failed!</p>;
    else if (candidateData.length === 0) {
      return <p>There is no data for this user, please message our support</p>;
    } 
      var { response_url: responseUrl, question_text } = candidateData[
        activeQuestion
      ];

      console.log(ReactPlayer.canPlay(responseUrl));
      console.log(candidateData, activeQuestion);
    

    return <div style={{ backgroundColor: "#F0F2F5", padding: "0px" }}>
        <Header style={{ backgroundColor: "white" }}>
          {" "}
          <Row type="flex" style={{ height: "60%" }} justify="space-between">
            <Col>Shared by: Tempo</Col>
            <Col>
              <img src="https://s3.amazonaws.com/deephire/importantImages/suzanneTempoLogo.png" alt="Forge" height="100%" />
            </Col>
          </Row>
        </Header>

        {/* <Row style={{ backgroundColor: "#F0F2F5", padding: "20px" }} gutter={24}>
    <Card hoverable title="Questions">
            <Table showHeader={false} onRow={(record, index) => ({ onClick: () => {
                  this.setState({ activeQuestion: index });
                } })} rowClassName={(record, index) => (index === activeQuestion ? "selected" : "")} pagination={false} bordered dataSource={candidateData} columns={columns} />
          </Card>
    </Row> */}

        <Row style={{ backgroundColor: "#F0F2F5", padding: "20px" }} gutter={24}>
          <Col span={8}>
            <Card style={{ marginBottom: "20px" }} hoverable title={hideInfo ? "A Candidate" : candidateData[0].user_name}>
              <Rate allowClear={false} defaultValue={this.state.rating} /> <br /> <br />
              <RadioGroup onChange={this.onChange} value={this.state.value}>
                <Radio value={1}>Yes Interview</Radio>
                <Radio value={2}>Maybe Interview</Radio>
                <Radio value={3}>No Interview</Radio>
              </RadioGroup>
              <br />
              <br />
              <TextArea onChange={this.handleChange} value={this.state.text} placeholder="Why?" autosize />
              <br />
              <br />
              {this.state.shortListIndex > 0 && <Button style={{ marginRight: "20px" }} onClick={() => this.back()} type="primary">
                  <Icon type="left" />
                </Button>}
              <Button onClick={() => this.submitAndContinue()} type="primary">
                Submit & Continue
                <Icon type="right" />
              </Button>
            </Card>

            <Card hoverable title="Questions">
              <Table showHeader={false} onRow={(record, index) => ({ onClick: () => {
                    this.setState({ activeQuestion: index });
                  } })} rowClassName={(record, index) => (index === activeQuestion ? "selected" : "")} pagination={false} bordered dataSource={candidateData} columns={columns} />
            </Card>
          </Col>
          <Col span={16}>
            {/* <Button shape="circle" icon="search" /> */}
            <Card title={question_text}>
              {/* // actions={[<Icon type="setting" />, <Icon type="share-alt" />]} */}
              <div className="playerWrapper">
                <ReactPlayer onError={() => this.setState({
                      errorinVid: true
                    })} preload controls playing className="reactPlayer" height="100%" width="100%" url={responseUrl // onEnded={() => this.setState({activeQuestion: activeQuestion + 1})}
                  } />
              </div>
            </Card>
          </Col>
        </Row>
      </div>;
  }
}

export default App;
