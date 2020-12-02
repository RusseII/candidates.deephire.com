// import styles from './ShortListAnalytics.less';
import { List, } from 'antd';
import { router } from 'umi';
import ShortListCandidateCard from '@/components/ShortListCandidateCard';
import { trackAnalytics, sendEmail } from '@/services/api';

import { lowerCaseQueryParams } from '@bit/russeii.deephire.utils.utils'


import moment from 'moment';

import React, { useContext, useEffect } from 'react';

import { ShortListContext } from '../layouts';

const Shortlist = () => {
  // const num = qs.parse(window.location.search)['num']
  const { shortlist: id } = lowerCaseQueryParams(window.location.search)

  const shortList = useContext(ShortListContext)
  const {name: viewerName} = shortList

  const shortListData = shortList.shortListData?.[0]
  const { setShortListData } = shortList

  console.log(shortListData)

  useEffect(() => {
    console.log(shortListData, "s")
    if (shortListData?.interviews) {
      if (shortListData.interviews.length === 1) {
        console.log("h")
        viewCandidate(id, 0)
      }
      saveShortListClick()
    }
  }, [shortListData])




  const viewCandidate = async (id, i) => {
    await saveCandidateClick(i);
    router.push(`candidate?shortList=${id}&num=${i}`);
  };


  const saveCandidateClick = async index => {
    if (shortListData.interviews[index]['clicks'])
      shortListData.interviews[index]['clicks'].push(new Date().toString());
    else {
      shortListData.interviews[index]['clicks'] = [new Date().toString()];
    }
    setShortListData([shortListData])
    await trackAnalytics(id, shortListData);
  };


  const saveShortListClick = () => {
    if (!shortListData) return
    const { createdBy, name, email, description } = shortListData;

    let current = new moment();

    if (shortListData['clicks']) {
      const len = shortListData['clicks'].length;
      let prev = moment(shortListData['clicks'][len - 1]);
      if (moment.duration(current.diff(prev)).as('minutes') > '30') {
        shortListData['clicks'].push(current.format());
        shortListData['trackedClicks'].push({name: viewerName, timestamp: current.format()});

        sendEmail('share-link-has-been-viewed', id, name, email, createdBy, description);
      } else {
        shortListData['clicks'][len - 1] = current.format();
        shortListData['trackedClicks'].push({name: viewerName, timestamp: current.format()});
      }
    } else {
      shortListData['clicks'] = [current.format()];
      shortListData['trackedClicks'] = [{name: viewerName, timestamp: current.format()}];

      sendEmail('share-link-has-been-viewed', id, name, email, createdBy, description);
    }
    console.log(shortListData, "SL")
    setShortListData([shortListData])
    trackAnalytics(id, shortListData);
  };

  if (shortListData?.interviews) {
    if (shortListData.interviews.length === 1) {
      return null
    }
  }
  return (
    <div>
      <div>
        <List loading={!shortListData}
          rowKey="id"
          grid={{ gutter: 24, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 }}
          dataSource={shortListData?.interviews}
          renderItem={(item, index) => (
            <List.Item onClick={() => viewCandidate(id, index)} key={index}>
              <ShortListCandidateCard hideInfo={shortListData?.hideInfo} item={item} index={index + 1} />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}

export default Shortlist





