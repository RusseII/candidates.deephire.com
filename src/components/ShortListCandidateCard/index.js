import React from 'react';

import { Card, Row, Col, Rate } from 'antd';
import styles from './index.less';

const ShortListAnalyticsCard = ({ item }) => (
  <Card
    hoverable
    id={item.id}
    className={styles.candidateAnalyticsCard}
    subTitle={item.candidateEmail}
    bordered={false}
    style={{ backgroundColor: '#fff' }}
  >
    <Row type="flex" justify="start" gutter={24}>
      <Col>
        <div className={styles.title}>{item.userName}</div>
      </Col>
      {/* <Col>
        {item.interview === 'yes' && (
          <Tooltip title="I want to interview this candidate">
            <Icon type="check-circle" style={{ fontSize: '24px', color: '#08c', marginTop: 5 }} />
          </Tooltip>
        )}
        {item.interview === 'maybe' && (
          <Tooltip title="Client unsure about candidate">
            <Icon
              type="question-circle"
              style={{ fontSize: '24px', color: '#f2ea09', marginTop: 5 }}
            />
          </Tooltip>
        )}
        {item.interview === 'no' && (
          <Tooltip title="I do not want to interview this candidate">
            <Icon
              type="close-circle"
              style={{ fontSize: '24px', color: '#d33d3d', marginTop: 5 }}
            />
          </Tooltip>
        )}
        {!item.interview && (
          <Tooltip title="I have not viewed this candidate">
            <Icon
              type="clock-circle"
              style={{ fontSize: '24px', color: '#b2b2b2', marginTop: 5 }}
            />
          </Tooltip>
        )}
      </Col> */}
    </Row>

    <div className={styles.subtitle}>{item.candidateEmail}</div>

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
        // item.feedback.map(feedback => (
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
