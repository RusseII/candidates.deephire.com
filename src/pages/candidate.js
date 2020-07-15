import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import InfoCard from '../components/InfoCard';
import qs from 'qs';
import { router } from 'umi';
import { trackAnalytics, sendEmail } from '@/services/api';
import '@/global.css';

import { Card, Col, Row, Icon, Table, Button, Rate, Radio, Input, message } from 'antd';

import './App.css';
import fetch from 'isomorphic-fetch';

// require('es6-promise').polyfill();
// require('isomorphic-fetch');

const { TextArea } = Input;

const RadioGroup = Radio.Group;

// TODO REMOVE CUSTOM CODE FOR SUZANNE START
const customCode = shortListData =>
  shortListData.createdBy === 'suzanne@spectrumconsultancy.co.uk' && (
    <Button
      style={{ float: 'right' }}
      onClick={() => window.open('https://goo.gl/forms/AJWubChCpv8Al2rj2', '_blank')}
      type="primary"
    >
      Book This Candidate Now
      <Icon type="schedule" />
    </Button>
  );
// TODO REMOVE CUSTOM CODE FOR SUZANNE END

const toShortlist = id => router.push(`/shortlist?shortlist=${id}`);

const columns = [
  {
    title: 'Questions',
    dataIndex: 'question',
    key: 'question',
  },
];

const fb = qs.parse(window.location.search)['feedback'];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeQuestion: null,
      shortListIndex: 0,
      rating: 3,
      playing: false,
      feedbackEmailSent: false,
    };
  }

  componentDidMount() {
    const { location } = this.props;
    const shortListId = qs.parse(location.search)['?shortlist'];
    const num = qs.parse(location.search)['num'];

    this.setState({ shortListId, num });

    this.getShortList(shortListId, num);
  }

  getShortList(shortlistId, num) {
    const url = 'https://a.deephire.com/v1/shortlists/';

    fetch(`${url + shortlistId}`)
      .then(results => results.json())
      .then(
        data => {
          this.setState({
            shortListData: data?.[0],
            activeQuestion: 0,
            currentQuestionText: data?.[0]?.interviews[num]?.responses?.[0]?.question,
            videoUrl: data[0]?.interviews?.[num]?.responses?.[0]?.response ? data[0]?.interviews[num]?.responses?.[0]?.response : data[0].interviews[num].liveInterviewData.recordingUrl.slice(-1)[0],
            text: data?.[0]?.interviews[num]?.feedback,
            value: data?.[0]?.interviews[num]?.interest,
            rating: data?.[0]?.interviews[num]?.rating,
          });
        },
        () => {
          this.setState({ requestFailed: true });
        }
      );
  }

  setVideoData = async (videoUrl, currentQuestionText) => {
    // console.log(videoUrl)
    // const uuid = `v-${/((\w{4,12}-?)){5}/.exec(videoUrl)[0]}`
    // console.log(uuid)
    // // const url = await fetch(`https://a.deephire.com/v1/videos/proxy/${uuid}`)
    // const url = `http://localhost:3000/v1/videos/proxy/${uuid}`
  
    this.setState({ videoUrl, currentQuestionText });
  };

  url = (videoUrl) => {
    const uuid = `v-${/((\w{4,12}-?)){5}/.exec(videoUrl)[0]}`
    const url = `https://a.deephire.com/v1/videos/proxy/${uuid}`
    return url
  }

  saveQuestionClick = () => {
    const { shortListData, num, shortListId, activeQuestion } = this.state;
    if (shortListData.interviews[num].responses[activeQuestion]['clicks'])
      shortListData.interviews[num].responses[activeQuestion]['clicks'].push(new Date().toString());
    else {
      shortListData.interviews[num].responses[activeQuestion]['clicks'] = [new Date().toString()];
    }
    this.setState({ shortListData });
    trackAnalytics(shortListId, shortListData);
  };

  onChange = e => {
    this.setState({
      value: e.target.value,
    });
    this.storeFeedback();
  };

  handleChange = event => {
    this.setState({ text: event.target.value });
    this.storeFeedback();
  };

  leaveRating = rating => {
    this.setState({ rating });
    this.storeFeedback(rating);
  };

  leaveFeedBackButton = () => {
    message.success('Feedback Submitted');
    this.storeFeedback();
    if (this.state.feedbackEmailSent === false) {
      this.setState({ feedbackEmailSent: true });
      const { _id, name, email, createdBy, description } = this.state.shortListData;
      sendEmail('feeback-left-on-share-link', _id, name, email, createdBy, description);
    }
  };

  storeFeedback = (r = null) => {
    const { shortListData, num, shortListId, text, rating, value } = this.state;
    shortListData.interviews[num]['feedback'] = text;
    shortListData.interviews[num]['rating'] = r ? r : rating;
    shortListData.interviews[num]['interest'] = value;

    this.setState({ shortListData });
    trackAnalytics(shortListId, shortListData);
  };
  render() {
    var {
      num,
      shortListId,
      activeQuestion,
      shortListData,
      currentQuestionText,
      videoUrl,
      value,
      playing,
    } = this.state;
    if (!shortListData) return null;
    const candidateData = shortListData?.interviews?.[num];

    const { hideInfo } = shortListData;
    return (
      <div>
        {shortListData.interviews.length !== 1 && (
          <Row style={{ backgroundColor: '#F0F2F5', padding: '20px 20px 0px 20px' }} gutter={0}>
            <Button onClick={() => toShortlist(shortListId)} type="secondary">
              <Icon type="left" />
              Back to Candidates
            </Button>

            {/* TODO REMOVE CUSTOM CODE FOR SUZANNE  START*/}
            {customCode(shortListData)}
            {/* TODO REMOVE CUSTOM CODE FOR SUZANNE END */}
          </Row>
        )}
        <Row type="flex" style={{ backgroundColor: '#F0F2F5', padding: '20px' }} gutter={24}>
          <Col xs={{ span: 24, order: 2 }} sm={24} md={8} lg={8} xl={8}>
            <InfoCard
              userId={candidateData?.userId ? candidateData.userId : candidateData?.liveInterviewData.candidateEmail}
              userName={hideInfo === true ? 'A Candidate' : (candidateData?.userName) ?  candidateData.userName : candidateData?.liveInterviewData.candidateName }
              setVideoData={this.setVideoData}
              interviewName={candidateData?.interviewName}
            />
            {candidateData?.responses && <Card style={{ marginBottom: '20px' }} hoverable title="Questions">
              <Table
                showHeader={false}
                onRow={(record, index) => ({
                  onClick: () => {
                    this.setVideoData(record.response, record.question);
                    this.setState({ activeQuestion: index, playing: true });
                    this.saveQuestionClick();
                  },
                })}
                rowClassName={(record, index) => (index === activeQuestion ? 'selected' : '')}
                pagination={false}
                bordered
                dataSource={candidateData.responses}
                columns={columns}
              />
            </Card>
  }

            {fb !== '0' && (
              <Card style={{ marginBottom: '20px' }} hoverable title="Please Indicate Next Steps">
                <Rate
                  onChange={this.leaveRating}
                  allowClear={false}
                  defaultValue={this.state.rating}
                />{' '}
                <br /> <br />
                {/* <RadioGroup onChange={this.onChange} value={value}>
                  <Radio value={1}>Yes Interview</Radio>
                  <Radio value={2}>Maybe Interview</Radio>
                  <Radio value={3}>No Interview</Radio>
                </RadioGroup>
                <br />
                <br /> */}
                <TextArea
                  onChange={this.handleChange}
                  value={this.state.text}
                  placeholder="What did you think of this candidate?"
                  autosize
                />
                <br />
                <br />
                <Button onClick={() => this.leaveFeedBackButton()} type="primary">
                  Submit Next Steps
                  <Icon type="right" />
                </Button>
              </Card>
            )}
          </Col>
          <Col
            xs={{ span: 24, order: 1 }}
            sm={{ span: 24, order: 1 }}
            md={{ span: 16, order: 2 }}
            lg={{ span: 16, order: 2 }}
            xl={{ span: 16, order: 2 }}
          >
            <Card style={{ marginBottom: 20 }} title={currentQuestionText}>
              <div className="playerWrapper">
                <ReactPlayer
           
                  onError={(err) => {
                    console.log("error", err)
                    this.setState({
                      errorinVid: true,
                    })
                  }
                  }
                  preload
                  controls
                  playing={playing}
                  className="reactPlayer"
                  height="100%"
                  width="100%"
                  url={this.state.errorinVid ? this.url(videoUrl) : videoUrl}
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
