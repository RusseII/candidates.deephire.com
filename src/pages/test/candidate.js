import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import InfoCard from '../../components/InfoCard';
import qs from "qs"

import { Card, Col, Row, Icon, Table, Button, Rate, Checkbox, Radio, Input, Layout } from 'antd';

import './App.css';
const { TextArea } = Input;

const RadioGroup = Radio.Group;
const Header = Layout.Header;

const columns = [
  {
    title: 'Questions',
    dataIndex: 'question_text',
    key: 'question_text',
  },
];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeQuestion: null,
      shortListIndex: 0,
      rating: 3,
    };
  }

  componentDidMount() {
    const { location } = this.props;
    const shortList = qs.parse(location.search)['?shortlist'];
    this.getShortList(shortList);
  }

  getShortList(shortlist_id) {
    const url = 'https://a.deephire.com/v1/shortlists/';
    console.log(url)
    // const url = "http://localhost:3001/v1y.0/get_shortlist/";

    fetch(`${url + shortlist_id}`)
      .then(results => results.json())
      .then(
        data => {
          // console.log(data, "shortlist endpoint data", data.interviews[0].question_text, data.interviews, data.interviews[this.state.shortListIndex].response_url);
          this.setState({
            shortListData: data,
            activeQuestion: 0,
            currentQuestionText: data.interviews[this.state.shortListIndex][0].question_text,
            videoUrl: data.interviews[this.state.shortListIndex][0].response_url,
          });
        },
        () => {
          this.setState({ requestFailed: true });
        },
      );

    // return { email: "Russell", interviews: [{}, {}] };
  }

  openInterview = () => {
    const url = `https://candidates.deephire.com/?id=${this.state.id}&candidate=${
      this.state.userToken
      }`;

    window.open(url, '_blank');
  };

  getName() {
    return this.state.candidateData[0].user_name;
  }

  setVideoData = (videoUrl, currentQuestionText) => {
    this.setState({ videoUrl, currentQuestionText });
  };

  back() {
    if (this.state.shortListIndex > 0) {
      this.setState({
        rating: 3,
        value: '',
        text: '',
        activeQuestion: 0,
        shortListIndex: this.state.shortListIndex - 1,
      });
    }
  }
  submitAndContinue() {
    if (this.state.shortListIndex + 1 < this.state.shortListData.interviews.length) {
      this.setState({
        rating: 3,
        value: '',
        text: '',
        activeQuestion: 0,
        shortListIndex: this.state.shortListIndex + 1,
      });
    }
  }
  onChange = e => {
    // console.log("radio checked", e.target.value);
    this.setState({
      value: e.target.value,
    });
  };

  handleChange = event => {
    this.setState({ text: event.target.value });
  };
  render() {
    var {
      candidateData,
      comments,
      activeQuestion,
      requestFailed,
      shortListData,
      currentQuestionText,
      videoUrl,
    } = this.state;

    // console.log(shortListData, "SSH");

    if (shortListData) {
      candidateData = shortListData.interviews[this.state.shortListIndex];
      var { hideInfo } = shortListData;
      // console.log(shortListData);
    } else if (!candidateData) return <p>Loading...</p>;
    else if (comments === null) return <p> Loading! </p>;
    else if (activeQuestion === null) return <p> Loading questions... </p>;
    else if (requestFailed) return <p>Failed!</p>;
    else if (candidateData.length === 0) {
      return <p>There is no data for this user, please message our support</p>;
    }
    var { response_url: responseUrl, question_text } = candidateData[activeQuestion];

    // console.log(ReactPlayer.canPlay(responseUrl));
    // console.log(candidateData, activeQuestion);

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

        <Row style={{ backgroundColor: '#F0F2F5', padding: '20px 20px 0px 20px' }} gutter={0}>
          <Button onClick={this.goToCandidates} type="secondary">
            <Icon type="left" />
            Back to Candidates
          </Button>
          <Button
            style={{ float: 'right' }}
            onClick={() => window.open('https://goo.gl/forms/AJWubChCpv8Al2rj2', '_blank')}
            type="primary"
          >
            Book This Candidate Now
            <Icon type="schedule" />
          </Button>
        </Row>

        <Row style={{ backgroundColor: '#F0F2F5', padding: '20px' }} gutter={24}>
          <Col span={8}>
            <InfoCard
              userId={candidateData[0].user_id}
              userName={hideInfo ? 'A Candidate' : candidateData[0].user_name}
              setVideoData={this.setVideoData}
            />

            <Card style={{ marginBottom: '20px' }} hoverable title="Questions">
              <Table
                showHeader={false}
                onRow={(record, index) => ({
                  onClick: () => {
                    // console.log(record, "record");
                    this.setVideoData(record.response_url, question_text);
                    this.setState({ activeQuestion: index });
                  },
                })}
                rowClassName={(record, index) => (index === activeQuestion ? 'selected' : '')}
                pagination={false}
                bordered
                dataSource={candidateData}
                columns={columns}
              />
            </Card>

            <Card style={{ marginBottom: '20px' }} hoverable title="Leave Feedback">
              <Rate allowClear={false} defaultValue={this.state.rating} /> <br /> <br />
              <RadioGroup onChange={this.onChange} value={this.state.value}>
                <Radio value={1}>Yes Interview</Radio>
                <Radio value={2}>Maybe Interview</Radio>
                <Radio value={3}>No Interview</Radio>
              </RadioGroup>
              <br />
              <br />
              <TextArea
                onChange={this.handleChange}
                value={this.state.text}
                placeholder="Why?"
                autosize
              />
              <br />
              <br />
              {this.state.shortListIndex > 0 && (
                <Button style={{ marginRight: '20px' }} onClick={() => this.back()} type="primary">
                  <Icon type="left" />
                </Button>
              )}
              <Button onClick={() => this.submitAndContinue()} type="primary">
                Leave FeedBack
                <Icon type="right" />
              </Button>
            </Card>
          </Col>
          <Col span={16}>
            {/* <Button shape="circle" icon="search" /> */}
            <Card title={currentQuestionText}>
              {/* // actions={[<Icon type="setting" />, <Icon type="share-alt" />]} */}
              <div className="playerWrapper">
                <ReactPlayer
                  onError={() =>
                    this.setState({
                      errorinVid: true,
                    })
                  }
                  preload
                  controls
                  playing
                  className="reactPlayer"
                  height="100%"
                  width="100%"
                  url={videoUrl}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
