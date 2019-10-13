// import styles from './ShortListAnalytics.less';
import { List, Card, Row, Col } from 'antd';
import { router } from 'umi';
import ShortListCandidateCard from '@/components/ShortListCandidateCard';
import { fetchShortlist, trackAnalytics, sendEmail } from '@/services/api';
import styles from './shortlist.css';

import qs from 'qs';
import moment from 'moment';

import React, { Component } from 'react';

export default class Shortlist extends Component {
  state = { shortListData: null };

  saveShortListClick = () => {
    const { shortListData, id } = this.state;
    const { createdBy, name, email, description } = shortListData;

    let current = new moment();

    if (shortListData['clicks']) {
      const len = shortListData['clicks'].length;
      let prev = moment(shortListData['clicks'][len - 1]);
      if (moment.duration(current.diff(prev)).as('minutes') > '30') {
        shortListData['clicks'].push(current.format());
        sendEmail(id, name, email, createdBy, description);
      } else {
        shortListData['clicks'][len - 1] = current.format();
      }
    } else {
      shortListData['clicks'] = [current.format()];
      sendEmail(id, name, email, createdBy, description);
    }
    this.setState({ shortListData });
    trackAnalytics(id, shortListData);
  };

  componentDidMount() {
    const { location } = this.props;
    const id = qs.parse(location.search)['?shortlist'];
    console.log(id);
    fetchShortlist(id).then(r => {
      this.setState(
        {
          shortListData: r[0],
          id,
        },
        () => {
          this.saveShortListClick();
        }
      );
      if (r[0] && r[0].interviews) {
        if (r[0].interviews.length === 1) {
          this.viewCandidate(id, 0);
        }
      }
    });
  }

  viewCandidate = async (id, i) => {
    await this.saveCandidateClick(i);
    router.push(`candidate?shortlist=${id}&num=${i}`);
  };

  saveCandidateClick = async index => {
    const { shortListData, id } = this.state;
    if (shortListData.interviews[index]['clicks'])
      shortListData.interviews[index]['clicks'].push(new Date().toString());
    else {
      shortListData.interviews[index]['clicks'] = [new Date().toString()];
    }
    this.setState({ shortListData });
    await trackAnalytics(id, shortListData);
  };

  render() {
    const { shortListData, id } = this.state;
    console.log(shortListData);
    if (!shortListData) return null;
    const { hideInfo } = shortListData;

    return (
      <div>
        <Card>
          <Row type="flex">
            <Col>
              <div className={styles.pageHeader}>Short List of Candidates</div>
            </Col>
            <Col>
              <div className={styles.divider}>|</div>
            </Col>
            <Col>
              <div className={styles.pageSubHeading}>Created by {shortListData.createdBy}</div>
            </Col>
          </Row>
        </Card>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            style={{ marginTop: 24 }}
            grid={{ gutter: 24, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 }}
            //   loading={loading}
            dataSource={shortListData.interviews}
            renderItem={(item, index) => (
              <List.Item onClick={() => this.viewCandidate(id, index)} key={index}>
                <ShortListCandidateCard hideInfo={hideInfo} item={item} index={index + 1} />
              </List.Item>
            )}
          />
        </div>
      </div>
    );
  }
}
