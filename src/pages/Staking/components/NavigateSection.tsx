import cx from 'classnames';
import { Antd } from 'components';
import useTabNavigate from 'hooks/useTabNavigate';
import { getSelectedAccount } from 'modules/account/reducer';
import { useSelector } from 'react-redux';
import styles from './NavigateSection.module.scss';

const TAB_OPTIONS = [
  { label: 'Deposit', value: 'deposit' },
  { label: 'Withdraw', value: 'withdraw' }
];

const NavigateSection: React.FC = () => {
  const { tabSelected, changeTab } = useTabNavigate(TAB_OPTIONS);
  const selectedAccount = useSelector(getSelectedAccount);

  return (
    <div className={cx(styles.container, !selectedAccount ? 'opacity-50' : 'opacity-100')}>
      <Antd.Tabs
        centered
        size="large"
        className={styles.tabs}
        activeKey={tabSelected}
        onChange={changeTab}
        destroyInactiveTabPane>
        {TAB_OPTIONS.map((item) => {
          return <Antd.Tabs.TabPane tab={item.label} key={item.value} />;
        })}
      </Antd.Tabs>
    </div>
  );
};

export default NavigateSection;
