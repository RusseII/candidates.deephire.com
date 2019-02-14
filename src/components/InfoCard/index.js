import React from 'react';

import { Button, Card } from 'antd';
require('isomorphic-fetch');

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
    const { userName, setVideoData } = this.props;
    const { candidateProfileData } = this.state;

    if (!candidateProfileData) return null;
    const { youTubeLinks } = candidateProfileData;
    if (!youTubeLinks) return null;

    return (
      <Card style={{ marginBottom: '20px' }} hoverable title={userName}>
        {youTubeLinks.map((item, index) => (
          <Button
            onClick={() => setVideoData(item, 'YouTube Video ' + (1 + index))}
            style={{ margin: 2 }}
            type="secondary"
            icon="youtube"
          >
            Youtube Video {+1 + index}
          </Button>
        ))}
      </Card>
    );
  }
}

export default InfoCard;
