import React, { useEffect, useState, useContext } from 'react';
// import InfoCard from '../components/InfoCard';

import CandidateVideo from '@bit/russeii.deephire.candidate.video';
import CommentsCard from '@bit/russeii.deephire.candidate.comments-card'
import CandidateDataCard from '@bit/russeii.deephire.candidate.data-card'
import CandidateQuestions from '@bit/russeii.deephire.candidate.questions'

import { useVideo, useAsync } from '@bit/russeii.deephire.hooks';


// import { router } from 'umi';
import { trackAnalytics, getShortList, getCandidateProfile} from '@/services/api';
import '@/global.css';
import 'antd/dist/antd.css'

import { Col, Row,  } from 'antd';

import './App.css';
import FeedbackCard from '../components/FeedbackCard';
import { ShortListContext } from '../layouts';

import { lowerCaseQueryParams } from '@bit/russeii.deephire.utils.utils'




// saveQuestionClick = () => {
//   const { shortListData, num, shortListId, activeQuestion } = this.state;
//   if (shortListData.interviews[num].responses[activeQuestion]['clicks'])
//     shortListData.interviews[num].responses[activeQuestion]['clicks'].push(new Date().toString());
//   else {
//     shortListData.interviews[num].responses[activeQuestion]['clicks'] = [new Date().toString()];
//   }
//   this.setState({ shortListData });
//   trackAnalytics(shortListId, shortListData);
// };



// const columns = [
//   {
//     title: 'Questions',
//     dataIndex: 'question',
//     key: 'question',
//   },
// ];




const Candidate = () => {
  // const shortListId = qs.parse(window.location.search)['?shortList'];
  const { num } = lowerCaseQueryParams(window.location.search)

  const shortList = useContext(ShortListContext)
  const shortListData = shortList.shortListData?.[0]?.interviews[num]
  // console.log(shortList)
  const liveInterview = shortListData?.liveInterviewData?.recordingUrl
  const oneWayInterview = shortListData?._id
  const liveInterviewUrl = liveInterview ? liveInterview[liveInterview.length - 1 ] : null
  // console.log(liveInterview, "li")
  // console.log(shortListData, "sd")
  const videoPlayerData = useVideo();
  // const [shortlistData, setShortlistData] = useState(null)

  useEffect(() => {
    if (shortListData) {
    if (liveInterviewUrl) {

    videoPlayerData.setVideoUrl(liveInterviewUrl);
    }
    else {
    videoPlayerData.setVideoUrl(shortListData?.responses?.[0]?.response);
    }
  }
  }, [shortListData])


  return (
    <div>

      <Row type="flex" style={{ backgroundColor: '#F0F2F5' }} gutter={24}>
        <Col xs={{ span: 24, order: 2 }} sm={24} md={12} lg={12} xl={12}>
          {/* <CandidateDocumentCard/> */}
        {!oneWayInterview &&
          <CommentsCard {...videoPlayerData} liveInterviewData={shortListData?.liveInterviewData} style={{marginBottom: 24}} />}
          
         {!liveInterview && 
         <CandidateQuestions
            candidateData={shortListData}
            {...videoPlayerData}
            style={{ marginBottom: 24 }}
            />
         }
            <CandidateDataCard
            userId={shortListData?.userId}
            userName={shortListData?.hideInfo ? 'A Candidate' : (shortListData?.userName) ? shortListData.userName : shortListData?.liveInterviewData?.candidateName}
            interviewName={shortListData?.interviewName ||shortListData?.liveInterviewData.interviewName }
            email={shortListData?.candidateEmail || shortListData?.liveInterviewData?.candidateEmail}
            getCandidateProfile={getCandidateProfile}
            style={{marginBottom: 24}}
           
          />
         {shortListData && 
          <FeedbackCard  setShortListData={shortList.setShortListData} rating={shortListData.rating} feedback={shortListData.feedback} {...videoPlayerData} shortList={shortList} num={num} />}

        </Col>
        <Col
          xs={{ span: 24, order: 1 }}
          sm={{ span: 24, order: 1 }}
          md={{ span: 12, order: 2 }}
          lg={{ span: 12, order: 2 }}
          xl={{ span: 12, order: 2 }}
        >

          <CandidateVideo {...videoPlayerData}  interval={10000} />

        </Col>
      </Row>
    </div>
  );

  }
  export default Candidate
  // class Candidate extends Component {
  //   constructor(props) {
  //     super(props);

  //     this.state = {
  //       activeQuestion: null,
  //       shortListIndex: 0,
  //       rating: 3,
  //       playing: false,
  //       feedbackEmailSent: false,
  //     };
  //   }

  // componentDidMount() {
  //   const { location } = this.props;
  //   const shortListId = qs.parse(location.search)['?shortList'];
  //   const num = qs.parse(location.search)['num'];

  //   this.setState({ shortListId, num });

  //   this.getShortList(shortListId, num);
  // }



  // setVideoData = (videoUrl, currentQuestionText) => {
  //   this.setState({ videoUrl, currentQuestionText });
  // };


  // onChange = e => {
  //   this.setState({
  //     value: e.target.value,
  //   });
  //   this.storeFeedback();
  // };

  // handleChange = event => {
  //   this.setState({ text: event.target.value });
  //   this.storeFeedback();
  // };

  // leaveRating = rating => {
  //   this.setState({ rating });
  //   this.storeFeedback(rating);
  // };



  // render() {
  //   var {
  //     num,
  //     shortListId,
  //     activeQuestion,
  //     shortListData,
  //     currentQuestionText,
  //     videoUrl,
  //     value,
  //     playing,
  //   } = this.state;
  //   if (!shortListData) return null;
  //   const candidateData = shortListData?.interviews?.[num];

  //   const { hideInfo } = shortListData;
  //   return (
  //     <div>

  //       <Row type="flex" style={{ backgroundColor: '#F0F2F5' }} gutter={24}>
  //         <Col xs={{ span: 24, order: 2 }} sm={24} md={10} lg={10} xl={10}>

  //           {candidateData?.responses && <Card style={{ marginBottom: '20px' }} title="Questions">
  //             <Table
  //               showHeader={false}
  //               onRow={(record, index) => ({
  //                 onClick: () => {
  //                   this.setVideoData(record.response, record.question);
  //                   this.setState({ activeQuestion: index, playing: true });
  //                   this.saveQuestionClick();
  //                 },
  //               })}
  //               rowClassName={(record, index) => (index === activeQuestion ? 'selected' : '')}
  //               pagination={false}
  //               bordered
  //               dataSource={candidateData.responses}
  //               columns={columns}
  //             />
  //           </Card>
  //           }

  //           <InfoCard
  //             userId={candidateData?.userId ? candidateData.userId : candidateData?.liveInterviewData.candidateEmail}
  //             userName={hideInfo === true ? 'A Candidate' : (candidateData?.userName) ? candidateData.userName : candidateData?.liveInterviewData.candidateName}
  //             setVideoData={this.setVideoData}
  //             interviewName={candidateData?.interviewName}
  //           />

  //           {fb !== '0' && (
  //             <Card style={{ marginBottom: '20px' }} title="Please Indicate Next Steps">
  //               <Rate
  //                 onChange={this.leaveRating}
  //                 allowClear={false}
  //                 defaultValue={this.state.rating}
  //               />{' '}
  //               <br /> <br />
  //               {/* <RadioGroup onChange={this.onChange} value={value}>
  //                 <Radio value={1}>Yes Interview</Radio>
  //                 <Radio value={2}>Maybe Interview</Radio>
  //                 <Radio value={3}>No Interview</Radio>
  //               </RadioGroup>
  //               <br />
  //               <br /> */}
  //               <TextArea
  //                 onChange={this.handleChange}
  //                 value={this.state.text}
  //                 placeholder="What did you think of this candidate?"
  //                 autosize
  //               />
  //               <br />
  //               <br />
  //               <Button onClick={() => this.leaveFeedBackButton()} type="primary">
  //                 Submit Next Steps
  //                 <Icon type="right" />
  //               </Button>
  //             </Card>
  //           )}
  //         </Col>
  //         <Col
  //           xs={{ span: 24, order: 1 }}
  //           sm={{ span: 24, order: 1 }}
  //           md={{ span: 14, order: 2 }}
  //           lg={{ span: 14, order: 2 }}
  //           xl={{ span: 14, order: 2 }}
  //         >
  //           <Card title={currentQuestionText}>
  //             {/* <div className="playerWrapper">
  //               <ReactPlayer
  //                 onError={() =>
  //                   this.setState({
  //                     errorinVid: true,
  //                   })
  //                 }
  //                 preload
  //                 controls
  //                 playing={playing}
  //                 className="reactPlayer"
  //                 height="100%"
  //                 width="100%"
  //                 url={videoUrl}
  //               />
  //             </div> */}
  //           </Card>
  //         </Col>
  //       </Row>
  //     </div>
  //   );
  // }

// export default Candidate;
