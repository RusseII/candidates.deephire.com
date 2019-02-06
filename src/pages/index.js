import styles from './index.css';
import qs from 'qs';
import { router } from 'umi';

import React, { Component } from 'react';

export default class Shortlist extends Component {
  componentDidMount() {
    const { location } = this.props;

    const id = qs.parse(location.search)['?id'];
    if (id === '5bc4b7dc74468900083644fa')
      router.push(`/candidate?shortlist=5c5a518ff2ee174b76f2dc58&num=0`);
  }

  render() {
    return (
      <div className={styles.normal}>
        <div className={styles.welcome} />
        <ul className={styles.list}>
          <li>Hmm... Howed you get here??</li>
          <li>Email me at Russell@deephire.com if you are lost!</li>
        </ul>
      </div>
    );
  }
}
