import { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import Web3 from 'web3';
import cx from 'classnames';
import { Button, ConfirmModal, Antd } from 'components';
import { displayFloat } from 'utils/formatter';
import useKonoAllowance from 'hooks/useKonoAllowance';
import styles from './OracleNewSubscriptions.module.scss';
import { IAccount } from 'pages/Oracle/types';
import { convertBNtoTokens } from 'utils/web3';
import { IOracleWithSubscribeState } from 'types/oracle';
import { SubscribeItem } from './components';
import { getToSubscribeOracles } from 'modules/oracles/reducer';
import { getSelectedAccount } from 'modules/account/reducer';
import { RootState } from 'modules/rootReducer';
import { getOracleSubscriptionContract } from 'modules/connection/reducer';

type TProps = {
  tokens: IOracleWithSubscribeState[];
  selectedAccount: IAccount | null;
  currentOracleAddress?: string;
};

const OracleNewSubscriptions: React.FC<TProps> = ({
  tokens,
  selectedAccount,
  currentOracleAddress
}: TProps) => {
  const navigate = useNavigate();
  const oracleSubscriptionContract = useSelector(getOracleSubscriptionContract);
  const [isConfirmModalVisible, toggleConfirmModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState<IOracleWithSubscribeState[]>(tokens);
  const [estimatedFee, setEstimatedFee] = useState(0);
  const [highlightMissingField, setHighlightMissingField] = useState(false);
  const { allowance, onClickIncreaseAllowance, isIncreasing } =
    useKonoAllowance(currentOracleAddress);

  useEffect(() => {
    if (tokens.length) {
      setSelectedTokens(tokens);
    }
  }, [tokens]);

  useEffect(() => {
    // Calculate estimated fee.
    if (oracleSubscriptionContract && !!selectedTokens.length) {
      const callArr = [];
      for (const token of selectedTokens) {
        if (token.leasePeriod)
          callArr.push(
            oracleSubscriptionContract.methods
              .deriveOraclePayable(token.sources.length, token.leasePeriod)
              .call()
          );
      }
      if (callArr.length)
        Promise.all(callArr).then((values) => {
          const feeArray = values.map((v) => convertBNtoTokens(v));
          setEstimatedFee(feeArray.reduce((a, b) => a + b));
        });
    }
  }, [selectedTokens, oracleSubscriptionContract]);

  const validateFields = () => {
    for (const token of selectedTokens) {
      if (!token.leasePeriod || !token.clientType) {
        setHighlightMissingField(true);
        return false;
      }
      if (token.clientType === 'Substrate') {
        if (!token.parachainName || !token.parachainUrl || !token.feedId) {
          setHighlightMissingField(true);
          return false;
        } else {
          // TODO: validate parachain info
        }
      }
    }
    return true;
  };

  const onClickConfirm = () => {
    const sendBatchSubscribe = (inputTokens: IOracleWithSubscribeState[]) => {
      if (selectedAccount && oracleSubscriptionContract) {
        const web3 = new Web3(window.ethereum);
        const batch = new web3.eth.BatchRequest();
        for (const token of inputTokens) {
          setIsSending(true);
          batch.add(
            oracleSubscriptionContract.methods
              .subscribeByExisting(token.subscriptionId, token.leasePeriod)
              .send.request({ from: selectedAccount.address || '' }, (error: any, hash: any) => {
                console.log('error', error);
                console.log('hash', hash);
                setIsSending(false);
              })
          );
        }
        batch.execute();
      }
    };
    if (validateFields()) {
      sendBatchSubscribe(selectedTokens);
    }
  };

  const renderConfirmButton = () => {
    if (!selectedAccount || !selectedAccount.address) {
      return (
        <Button className="py-2 capitalize" disabled>
          Connect a Wallet to Subscribe
        </Button>
      );
    }
    // TODO: Should compare with the estimated fee.
    if (allowance === 0 || allowance < estimatedFee) {
      return (
        <Button
          className="py-2 capitalize"
          isLoading={isIncreasing}
          onClick={() => onClickIncreaseAllowance()}>
          Increase Your KONO Allowance
        </Button>
      );
    }
    return (
      <div className={cx(styles.confirmGroup, 'flex justify-between')}>
        <Button
          className={cx(styles.back, styles.button)}
          onClick={() => {
            navigate(-1);
          }}>
          Back
        </Button>
        <Button
          className={styles.button}
          isLoading={isSending}
          onClick={() => {
            if (validateFields()) {
              toggleConfirmModal(true);
            }
          }}>
          Confirm
        </Button>
        <ConfirmModal
          content="Confirm your KONO transaction"
          onSubmit={onClickConfirm}
          isVisible={isConfirmModalVisible}
          toggleVisible={toggleConfirmModal}
        />
      </div>
    );
  };

  if (!selectedTokens.length) {
    return <Navigate to="/oracle" />;
  }

  return (
    <div className={styles.container}>
      <Antd.PageHeader
        className="py-4 px-0"
        onBack={() => navigate('/oracle')}
        backIcon={<ArrowLeftOutlined className="text-primary text-xl" />}
        title={<div className={styles.title}>Subscription Details</div>}
      />
      <div className={styles.table}>
        <div className={styles.tableInner}>
          {selectedTokens?.map((token) => (
            <SubscribeItem
              key={token.subscriptionId}
              token={{ ...token }}
              highlightMissingField={highlightMissingField}
            />
          ))}
        </div>
      </div>
      <div className={cx(styles.buttonGroupRow, 'flex justify-end mt-7')}>
        <div className={cx(styles.buttonGroup, 'flex flex-col')}>
          <div className={cx(styles.estimated, 'relative mb-2')}>
            <div className="absolute top-2 left-3 font-normal text-sm text-primary">
              Estimated operation fee:
            </div>
            <div className="absolute right-3 bottom-2 font-bold text-primary">{`${displayFloat(
              estimatedFee,
              4
            )} KONO`}</div>
          </div>
          {renderConfirmButton()}
        </div>
      </div>
    </div>
  );
};

// TODO: recorrect state type
const mapStateToProps = (state: RootState) => ({
  tokens: getToSubscribeOracles(state),
  selectedAccount: getSelectedAccount(state),
  currentOracleAddress: state.connection.currentOracleAddress
});

export default connect(mapStateToProps)(OracleNewSubscriptions);
