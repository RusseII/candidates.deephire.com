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
  Input
} from "antd";

import "./App.css";
const { TextArea } = Input;

const RadioGroup = Radio.Group;

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
      shortListIndex: 0
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
    // const shortListData = {
    //   email: "Russell",
    //   interviews: [
    //     [
    //       {
    //         _id: { $oid: "5bb9533971feb40765377204" },
    //         company_id: "5bb9164b7001ec000831d1ab",
    //         interview_name: "Hackathon Student Developer (Intern)",
    //         python_datetime: "2018-10-06 20:28:41",
    //         question_text: "Tell me about yourself ",
    //         response_url: "https://vimeo.com/293754846/e7e1ac1dfa",
    //         timestamp: 1538872124,
    //         user_id: "facebook|1488094364584669",
    //         user_name: "Aron Gates"
    //       },
    //       {
    //         _id: { $oid: "5bb9537d71feb4076537807c" },
    //         company_id: "5bb9164b7001ec000831d1ab",
    //         interview_name: "Hackathon Student Developer (Intern)",
    //         python_datetime: "2018-10-06 20:29:49",
    //         question_text: "What project are you working on? ",
    //         response_url: "https://vimeo.com/293754904/40b1ea37fb",
    //         timestamp: 1538872192,
    //         user_id: "facebook|1488094364584669",
    //         user_name: "Aron Gates"
    //       },
    //       {
    //         _id: { $oid: "5bb953cc71feb4076537911d" },
    //         company_id: "5bb9164b7001ec000831d1ab",
    //         interview_name: "Hackathon Student Developer (Intern)",
    //         python_datetime: "2018-10-06 20:31:07",
    //         question_text: "Is a lazy developer a good developer? ",
    //         response_url: "https://vimeo.com/293754983/922c451d2e",
    //         timestamp: 1538872270,
    //         user_id: "facebook|1488094364584669",
    //         user_name: "Aron Gates"
    //       },
    //       {
    //         _id: { $oid: "5bb9546b71feb4076537b157" },
    //         company_id: "5bb9164b7001ec000831d1ab",
    //         interview_name: "Hackathon Student Developer (Intern)",
    //         python_datetime: "2018-10-06 20:33:47",
    //         question_text: "What is your favorite project you've worked on? ",
    //         response_url: "https://vimeo.com/293755094/b22c0cde17",
    //         timestamp: 1538872429,
    //         user_id: "facebook|1488094364584669",
    //         user_name: "Aron Gates"
    //       },
    //       {
    //         _id: { $oid: "5bb954e071feb4076537c9aa" },
    //         company_id: "5bb9164b7001ec000831d1ab",
    //         interview_name: "Hackathon Student Developer (Intern)",
    //         python_datetime: "2018-10-06 20:35:44",
    //         question_text:
    //           "Name a time you've had to work through a team conflict. ",
    //         response_url: "https://vimeo.com/293755195/d2bda019d0",
    //         timestamp: 1538872547,
    //         user_id: "facebook|1488094364584669",
    //         user_name: "Aron Gates"
    //       }
    //     ],
    //     [
    //       {
    //         _id: { $oid: "5bbf996f22541899c14d12c2" },
    //         candidate_email: "rratcliffe57@yahoo.com",
    //         company_id: "5bbf9950744689000836437d",
    //         interview_name: "Russell Fix Vimeo Loading Error",
    //         python_datetime: "2018-10-11 14:41:51",
    //         question_text: "Does it work?",
    //         response_url: "https://vimeo.com/294641644/079dfdd390",
    //         timestamp: 1539283311,
    //         user_id: "facebook|1948115908830936",
    //         user_name: "Russell Ratcliffe"
    //       },
    //       {
    //         _id: { $oid: "5bbf997b22541899c14d14d1" },
    //         candidate_email: "rratcliffe57@yahoo.com",
    //         comments: [
    //           {
    //             author: "Tester",
    //             message: "Testing\n",
    //             timestamp:
    //               "Thu Oct 11 2018 15:54:03 GMT-0400 (Eastern Daylight Time)"
    //           },
    //           {
    //             author: "Tester",
    //             message: "Testing\n",
    //             timestamp:
    //               "Thu Oct 11 2018 15:54:05 GMT-0400 (Eastern Daylight Time)"
    //           },
    //           {
    //             author: "Tester",
    //             message: "Testing\n",
    //             timestamp:
    //               "Thu Oct 11 2018 15:54:10 GMT-0400 (Eastern Daylight Time)"
    //           }
    //         ],
    //         company_id: "5bbf9950744689000836437d",
    //         interview_name: "Russell Fix Vimeo Loading Error",
    //         python_datetime: "2018-10-11 14:42:03",
    //         question_text: "I sure hope so!",
    //         response_url: "https://vimeo.com/294641673/3199415111",
    //         timestamp: 1539283322,
    //         user_id: "facebook|1948115908830936",
    //         user_name: "Russell Ratcliffe"
    //       }
    //     ]
    //   ]
    // };
    const url = "https://api.deephire.com/v1.0/get_shortlist/";
        // const url = "http://localhost:3001/v1.0/get_shortlist/";

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
    this.setState({ shortListIndex: this.state.shortListIndex - 1 });
    }

  }
  submitAndContinue() {
    if (this.state.shortListIndex + 1 < this.state.shortListData.interviews.length){
    this.setState({ shortListIndex: this.state.shortListIndex + 1 });
    }
  }
  onChange = e => {
    console.log("radio checked", e.target.value);
    this.setState({
      value: e.target.value
    });
  };
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
    
    return <Row style={{ backgroundColor: "#F0F2F5", padding: "20px" }} gutter={24}>
        <Col span={8}>
          <Card style={{ marginBottom: "20px" }} hoverable title={candidateData[0].user_name}>
            <Rate allowClear={false} defaultValue={3} /> <br /> <br />
            <RadioGroup onChange={this.onChange} value={this.state.value}>
              <Radio value={1}>Yes Interview</Radio>
              <Radio value={2}>Maybe Interview</Radio>
              <Radio value={3}>No Interview</Radio>
            </RadioGroup>
            <br />
            <br />
            <TextArea placeholder="Why?" autosize />
            <br />
            <br />
            {this.state.shortListIndex>0 &&
            <Button style={{marginRight:"20px"}} onClick={() => this.back()} type="primary">
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
      </Row>;
  }
}

export default App;
