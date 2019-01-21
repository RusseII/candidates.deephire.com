import React from 'react';

import { Button, Card, Row, Icon, List, Popconfirm } from 'antd';

import styles from './index.less';

const youtubeLinks = [
  "https://www.youtube.com/watch?v=aMk5j0xV1Rw",
    "https://www.youtube.com/watch?v=5EGacrmhxn8",'https://www.youtube.com/watch?v=aMk5j0xV1Rw',
    'https://www.youtube.com/watch?v=5EGacrmhxn8',
];

class InfoCard extends React.Component {
    state = { modalVisible: false };

    render() {
        const { userName, setVideoData } = this.props;

        return (
            <Card style={{ marginBottom: '20px' }} hoverable title={userName}>
                {youtubeLinks.map((item, index) => <Button onClick={() => setVideoData(item, 'YouTube Video ' + (1 + index)) } style={{ margin: 2 }} type="secondary" icon="youtube">Youtube Video {+ 1 + index}</Button>)}
            </Card>
        );
    }
}

export default InfoCard;
