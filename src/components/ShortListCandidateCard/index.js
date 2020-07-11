import React from 'react';

import { Card, Row, Col, Rate, Tooltip, Icon, Avatar } from 'antd';
import styles from './index.less';

const ShortListAnalyticsCard = ({ item, hideInfo, index }) => (
  <Card
    id={item.id}
    className={styles.candidateAnalyticsCard}
    subTitle={hideInfo ? `Candidate ${item.key}` : item.userName}
    bordered={false}
    hoverable
    style={{ backgroundColor: '#fff' }}
    title="Click to View Candidate"
    extra={ <Avatar shape="circle" size="large" icon="user" src={ item.responses?.[0].thumbnail100x100 }/>}
  >
    <Row type="flex" justify="start" gutter={24}>
      <Col>
        <div className={styles.title}>{hideInfo ? `Candidate ${index}` : item.userName}</div>
      </Col>
      <Col>
        {/* Yes */}
        {(item.interest ? item.interest === 1 : item.rating > 3) && (
          <Tooltip title="I want to interview this candidate">
            {' '}
            <Icon
              type="check-circle"
              style={{ fontSize: '24px', color: '#54ed1c', marginTop: 5 }}
            />
          </Tooltip>
        )}
        {/* maybe */}
        {(item.interest ? item.interest === 2 : item.rating < 4 && item.rating > 1) && (
          <Tooltip title="I could be interested in this candidate">
            <Icon
              type="question-circle"
              style={{ fontSize: '24px', color: '#e8e819', marginTop: 5 }}
            />
          </Tooltip>
        )}
        {/* no */}
        {(item.interest ? item.interest === 3 : item.rating < 2 && item.rating > 0) && (
          <Tooltip title="I do not want to interview this candidate">
            {' '}
            <Icon
              type="close-circle"
              style={{ fontSize: '24px', color: '#f04764', marginTop: 5 }}
            />
          </Tooltip>
        )}
        {!item.interest && !item.rating && (
          <Tooltip title="I have not viewed this candidate">
            <Icon
              type="clock-circle"
              style={{ fontSize: '24px', color: '#808080', marginTop: 5 }}
            />
          </Tooltip>
        )}
      </Col>
    </Row>

    <div className={styles.subtitle}>{hideInfo ? 'Email Hidden' : item.candidateEmail}</div>

    <Row type="flex" justify="start" gutter={24}>
      <Col />
      <Col>
        <div className={styles.statHeading}>Rating Provided</div>
        <Rate disabled defaultValue={item.rating} />
      </Col>
    </Row>
    <div>
      {!item.feedback ? (
        <Row>
          <Col span={24}>
            <div className={styles.candidateFeedback}>No feedback provided</div>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col span={24}>
            <div className={styles.candidateFeedback}>{item.feedback}</div>
          </Col>
        </Row>
        // ))
      )}
    </div>
  </Card>
);

export default ShortListAnalyticsCard;
