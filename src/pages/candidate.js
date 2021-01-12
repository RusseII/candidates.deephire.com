import React, { useEffect, useContext } from 'react';
// import InfoCard from '../components/InfoCard';

import CandidateVideo from '@bit/russeii.deephire.candidate.video';
import CommentsCard from '@bit/russeii.deephire.candidate.comments-card';
import CandidateDataCard from '@bit/russeii.deephire.candidate.data-card';
import CandidateQuestions from '@bit/russeii.deephire.candidate.questions';


import { getCandidateProfile } from '@/services/api';
import '@/global.css';
import 'antd/dist/antd.css';

import { Col, Row } from 'antd';

import './App.css';
import FeedbackCard from '../components/FeedbackCard';
import { ShortListContext } from '../layouts';

import { lowerCaseQueryParams } from '@bit/russeii.deephire.utils.utils';

const Candidate = () => {
  const { num } = lowerCaseQueryParams(window.location.search);

  const shortList = useContext(ShortListContext);
  const { name, videoPlayerData } = shortList;

  const hideInfo = shortList?.shortListData?.[0]?.hideInfo;
  const shortListData = shortList.shortListData?.[0]?.interviews[num];
  const liveInterview = shortListData?.liveInterviewData?.recordingUrl;
  const oneWayInterview = shortListData?._id;
  const liveInterviewUrl = liveInterview ? liveInterview[liveInterview.length - 1] : null;


  useEffect(() => {
    if (shortListData) {
      if (liveInterviewUrl) {
        videoPlayerData.setVideoUrl(liveInterviewUrl);
      } else {
        videoPlayerData.setVideoUrl(shortListData?.responses?.[0]?.response);
      }
    }
  }, [shortListData]);

  return (
    <div>
      <Row type="flex" style={{ backgroundColor: '#F0F2F5' }} gutter={24}>
        <Col xs={{ span: 24, order: 2 }} sm={24} md={12} lg={12} xl={12}>
          {/* <CandidateDocumentCard/> */}
          {!oneWayInterview && (
            <CommentsCard
              {...videoPlayerData}
              liveInterviewData={shortListData?.liveInterviewData}
              style={{ marginBottom: 24 }}
            />
          )}

          {!liveInterview && (
            <CandidateQuestions
              candidateData={shortListData}
              {...videoPlayerData}
              style={{ marginBottom: 24 }}
            />
          )}
          <CandidateDataCard
            userId={shortListData?.userId}
            userName={
              hideInfo
                ? 'A Candidate'
                : shortListData?.userName
                ? shortListData.userName
                : shortListData?.liveInterviewData?.candidateName
            }
            interviewName={
              shortListData?.interviewName || shortListData?.liveInterviewData?.interviewName
            }
            email={
              shortListData?.candidateEmail || shortListData?.liveInterviewData?.candidateEmail
            }
            getCandidateProfile={getCandidateProfile}
            style={{ marginBottom: 24 }}
          />
          {shortListData && (
            <FeedbackCard
              setShortListData={shortList.setShortListData}
              rating={shortListData.fb?.[name]?.rating}
              feedback={shortListData?.fb?.[name]?.feedback}
              {...videoPlayerData}
              shortList={shortList}
              num={num}
            />
          )}
        </Col>
        <Col
          xs={{ span: 24, order: 1 }}
          sm={{ span: 24, order: 1 }}
          md={{ span: 12, order: 2 }}
          lg={{ span: 12, order: 2 }}
          xl={{ span: 12, order: 2 }}
        >
          <CandidateVideo {...videoPlayerData} interval={10000} />
        </Col>
      </Row>
    </div>
  );
};
export default Candidate;
