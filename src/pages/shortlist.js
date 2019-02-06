// import styles from './ShortListAnalytics.less';
import { List } from 'antd';
import { router } from 'umi';
import ShortListCandidateCard from '@/components/ShortListCandidateCard';
import { fetchShortlist, trackAnalytics } from '@/services/api';
import styles from '@/global.css';

import qs from 'qs';
import moment from 'moment';

import React, { Component } from 'react';

export default class Shortlist extends Component {
  state = { shortListData: null };

  saveShortListClick = () => {
    const { shortListData, id } = this.state;
    let current = new moment();

    if (shortListData['clicks']) {
      const len = shortListData['clicks'].length
      let prev = moment(shortListData['clicks'][len]);
      if (moment.duration(current.diff(prev)).as('minutes') > '30') {
        shortListData['clicks'].push(current.format());
      }
      else {
        shortListData['clicks'][len]=current.format();
      }
    } else {
      shortListData['clicks'] = [current.format()];
    }
    this.setState({ shortListData });
    trackAnalytics(id, shortListData);
  };

  componentDidMount() {
    const { location } = this.props;
    const id = qs.parse(location.search)['?shortlist'];
    console.log(id);
    fetchShortlist(id).then(r =>
      this.setState(
        {
          shortListData: r[0],
          id,
        },
        () => {
          this.saveShortListClick();
        }
      )
    );
  }

  viewCandidate = (id, i) => {
    this.saveCandidateClick(i);
    router.push(`candidate?shortlist=${id}&num=${i}`);
  };

  saveCandidateClick = index => {
    const { shortListData, id } = this.state;
    if (shortListData.interviews[index]['clicks'])
      shortListData.interviews[index]['clicks'].push(new Date().toString());
    else {
      shortListData.interviews[index]['clicks'] = [new Date().toString()];
    }
    this.setState({ shortListData });
    trackAnalytics(id, shortListData);
  };

  render() {
    const { shortListData, id } = this.state;
    console.log(shortListData);
    if (!shortListData) return null;

    return (
      <div className={styles.cardList}>
        <List
          rowKey="id"
          style={{ marginTop: 24 }}
          grid={{ gutter: 24, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 }}
          //   loading={loading}
          dataSource={shortListData.interviews}
          renderItem={(item, index) => (
            <List.Item onClick={() => this.viewCandidate(id, index)} key={item.id}>
              <ShortListCandidateCard item={item} />
            </List.Item>
          )}
        />
      </div>
    );
  }
}
