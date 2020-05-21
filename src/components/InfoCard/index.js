import React from 'react';

import { Button, Card } from 'antd';

import fetch from 'isomorphic-fetch';
// require('es6-promise').polyfill();
// require('isomorphic-fetch');
import Documents from '@/components/Documents';

class InfoCard extends React.Component {
  state = { modalVisible: false };

  componentDidMount() {
    const { userId } = this.props;

    this.getYouTubeVideos(userId);
  }

  getYouTubeVideos = userId => {
    const url = 'https://a.deephire.com/v1/candidates/';

    fetch(`${url + userId}`)
      .then(results => results.json())
      .then(
        candidateProfileData => {
          this.setState({ candidateProfileData });
        },
        () => {
          this.setState({ requestFailed: true });
        }
      );
  };

  render() {
    const { userName, userId: candidateEmail, interviewName} = this.props;


    return (
      <Card style={{ marginBottom: '20px' }} hoverable title={userName} extra={ interviewName}>
      
   
        <Documents email={candidateEmail} />
      </Card>
    );
  }
}

export default InfoCard;
