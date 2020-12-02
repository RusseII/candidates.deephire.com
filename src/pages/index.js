import styles from './index.css';
import { router } from 'umi';

import React, { Component } from 'react';
import { lowerCaseQueryParams } from '@bit/russeii.deephire.utils.utils'


export default class Shortlist extends Component {
  componentDidMount() {

    const { id } = lowerCaseQueryParams(window.location.search)

    if (id === '5bc4b7dc74468900083644fa')
      router.push(`/candidate?shortList=5c5a518ff2ee174b76f2dc58&num=0`);
  }

  render() {
    return (
      <div className={styles.normal}>
        <div className={styles.welcome} />
        <ul className={styles.list}>
          Email our support at russell@deephire.com if you get to this page and don't know why. 
        </ul>
      </div>
    );
  }
}
