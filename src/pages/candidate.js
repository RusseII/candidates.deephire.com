import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import InfoCard from '../components/InfoCard';
import qs from 'qs';
import { router } from 'umi';

import { Card, Col, Row, Icon, Table, Button, Rate, Radio, Input } from 'antd';

import './App.css';
const { TextArea } = Input;

const RadioGroup = Radio.Group;

const toShortlist = id => router.push(`/shortlist?shortlist=${id}`);

const columns = [
  {
    title: 'Questions',
    dataIndex: 'question',
    key: 'question',
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
    const shortListId = qs.parse(location.search)['?shortlist'];
    const num = qs.parse(location.search)['num'];
    this.setState({ shortListId });

    this.getShortList(shortListId, num);
  }

  getShortList(shortlistId, num) {
    const url = 'https://a.deephire.com/v1/shortlists/';

    fetch(`${url + shortlistId}`)
      .then(results => results.json())
      .then(
        data => {
          this.setState({
            candidateData: data[0].interviews[num],
            activeQuestion: 0,
            currentQuestionText: data[0].interviews[num].responses[0].question,
            videoUrl: data[0].interviews[num].responses[0].response,
          });
        },
        () => {
          this.setState({ requestFailed: true });
        }
      );
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

  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  handleChange = event => {
    this.setState({ text: event.target.value });
  };
  render() {
    var {
      shortListId,
      activeQuestion,
      candidateData,
      currentQuestionText,
      videoUrl,
      
    } = this.state;

    if (!candidateData) return null;

    const { hideInfo } = candidateData;

    var { question } = candidateData.responses[activeQuestion];

    return (
      <div>
        <Row style={{ backgroundColor: '#F0F2F5', padding: '20px 20px 0px 20px' }} gutter={0}>
          <Button onClick={() => toShortlist(shortListId)} type="secondary">
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
              userId={candidateData.userId}
              userName={hideInfo ? 'A Candidate' : candidateData.userName}
              setVideoData={this.setVideoData}
            />

            <Card style={{ marginBottom: '20px' }} hoverable title="Questions">
              <Table
                showHeader={false}
                onRow={(record, index) => ({
                  onClick: () => {
                    this.setVideoData(record.response, question);
                    this.setState({ activeQuestion: index });
                  },
                })}
                rowClassName={(record, index) => (index === activeQuestion ? 'selected' : '')}
                pagination={false}
                bordered
                dataSource={candidateData.responses}
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
            <Card title={currentQuestionText}>
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
