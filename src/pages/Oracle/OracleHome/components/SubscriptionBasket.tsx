import cx from 'classnames';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { TokenIconList } from 'components';

import styles from './SubscriptionBasket.module.scss';
import { getToSubscribeOracles } from 'modules/oracles/reducer';
import { RootState } from 'modules/rootReducer';

type TProps = {
  tokens: any[];
};

const SubscriptionBasket: React.FC<TProps> = ({ tokens = [] }) => {
  const isEmpty = tokens.length === 0;
  const navigate = useNavigate();

  const renderContent = () => {
    if (isEmpty) return 'Add Currency to Your Subscription';
    return (
      <>
        Make Subscription
        <TokenIconList data={tokens} />
      </>
    );
  };

  return (
    <div
      className={cx(
        'flex justify-between items-center cursor-pointer rounded text-primary',
        styles.lining,
        {
          [styles.disabled]: isEmpty
        }
      )}
      onClick={() => {
        if (!isEmpty) {
          navigate('new-subscriptions');
        } else {
          navigate('new-proposal');
        }
      }}>
      {renderContent()}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  tokens: getToSubscribeOracles(state)
});

export default connect(mapStateToProps)(SubscriptionBasket);
