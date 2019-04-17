import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import InfoCard from '../components/InfoCard';
import qs from 'qs';
import { router } from 'umi';
import { trackAnalytics } from '@/services/api';
import '@/global.css';

import { Upload, Card, Col, Row, Icon, Table, Button, Rate, Radio, Input, message } from 'antd';

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



// const props = {
//   action: '//jsonplaceholder.typicode.com/posts/',
//   onChange({ file, fileList }) {
//     if (file.status !== 'uploading') {
//       console.log(file, fileList);
//     }
//   },
//   defaultFileList: [{
//     uid: '1',
//     name: 'Russell_Resume.pdf',
//     url: 'https://s3-us-west-2.amazonaws.com/landing.deephire.com/Resume.pdf',
//   }, {
//     uid: '2',
//     name: 'Russell_Cover_Letter.pdf',
//       url: 'http://blogs.vault.com/media/2869818/cover_letter_2_660x854.jpg',
//   }],
// };


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
            shortListData: data[0],
            activeQuestion: 0,
            currentQuestionText: data[0].interviews[num].responses[0].question,
            videoUrl: data[0].interviews[num].responses[0].response,
            text: data[0].interviews[num].text,
            value: data[0].interviews[num].interest,
            rating: data[0].interviews[num].rating,
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
    } = this.state;
    if (!shortListData) return null;
    const candidateData = shortListData.interviews[num];

    const { hideInfo } = candidateData;

    return (
      <div>
        <Row style={{ backgroundColor: '#F0F2F5', padding: '20px 20px 0px 20px' }} gutter={0}>
          <Button onClick={() => toShortlist(shortListId)} type="secondary">
            <Icon type="left" />
            Back to Candidates
          </Button>

          {/* TODO REMOVE CUSTOM CODE FOR SUZANNE  START*/}
          {customCode(shortListData)}
          {/* TODO REMOVE CUSTOM CODE FOR SUZANNE END */}
        </Row>

        <Row type="flex" style={{ backgroundColor: '#F0F2F5', padding: '20px' }} gutter={24}>
          <Col xs={{ span: 24, order: 2 }} sm={24} md={8} lg={8} xl={8}>
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
                    this.setVideoData(record.response, record.question);
                    this.setState({ activeQuestion: index });
                    this.saveQuestionClick();
                  },
                })}
                rowClassName={(record, index) => (index === activeQuestion ? 'selected' : '')}
                pagination={false}
                bordered
                dataSource={candidateData.responses}
                columns={columns}
              />
              {candidateData.candidateEmail === "russell@deephire.com" &&
              <Upload {...props}/>}

                
            
            </Card>

            <Card style={{ marginBottom: '20px' }} hoverable title="Leave Feedback">
              <Rate
                onChange={this.leaveRating}
                allowClear={false}
                defaultValue={this.state.rating}
              />{' '}
              <br /> <br />
              <RadioGroup onChange={this.onChange} value={value}>
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
              <Button onClick={() => this.leaveFeedBackButton()} type="primary">
                Leave FeedBack
                <Icon type="right" />
              </Button>
            </Card>
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
