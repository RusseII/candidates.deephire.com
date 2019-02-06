import styles from './index.css';

export default function() {
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
