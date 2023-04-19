import { useState } from 'react';
import cx from 'classnames';
import { IOracleWithSubscribeState } from 'types/oracle';
import styles from './ClientDetailSection.module.scss';

type TProps = {
  className?: string;
  token: IOracleWithSubscribeState;
  highlightMissingField: boolean;
  setParachainName: (...args: any) => {} | void;
  setParachainUrl: (...args: any) => {} | void;
  setFeedId: (...args: any) => {} | void;
};

const ClientDetailSection: React.FC<TProps> = ({
  token,
  highlightMissingField = false,
  setParachainName,
  setParachainUrl,
  setFeedId
}) => {
  const [name, setName] = useState(token.parachainName || '');
  const [url, setUrl] = useState(token.parachainUrl || '');
  const [id, setId] = useState(token.feedId || '');
  const onChangeParachainName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setParachainName(e.target.value);
  };

  const onChangeParachainUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setParachainUrl(e.target.value);
  };

  const onChangeFeedID = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
    setFeedId(e.target.value);
  };

  if (token.clientType === 'Substrate') {
    return (
      <div className={styles.substrateClient}>
        <div className={styles.title}>Client details</div>
        <div className={cx(styles.row, 'flex justify-between items-center my-1 mt-2')}>
          <div className={styles.name}>Parachain Name</div>
          <input
            className={cx(styles.input, {
              [styles.missingInput]: highlightMissingField && name === ''
            })}
            type="text"
            placeholder="key in here"
            value={name}
            onChange={onChangeParachainName}></input>
        </div>
        <div className={cx(styles.row, 'flex justify-between items-center my-1')}>
          <div className={styles.name}>Parachain Url</div>
          <input
            className={cx(styles.input, {
              [styles.missingInput]: highlightMissingField && url === ''
            })}
            type="text"
            placeholder="key in here"
            value={url}
            onChange={onChangeParachainUrl}></input>
        </div>
        <div className={cx(styles.row, 'flex justify-between items-center my-1')}>
          <div className={styles.name}>Feed ID</div>
          <input
            className={cx(styles.input, {
              [styles.missingInput]: highlightMissingField && id === ''
            })}
            type="text"
            placeholder="key in here"
            value={id}
            onChange={onChangeFeedID}></input>
        </div>
      </div>
    );
  }
  if (token.clientType === 'Contract') {
    return (
      <div className={styles.contractClient}>
        Contract address will be displayed after confirmation
        <div className={styles.title}>Client details</div>
      </div>
    );
  }

  return <div className={styles.emplyClient}>Please Select Client Type</div>;
};

export default ClientDetailSection;
