import { useEffect } from 'react';
import cx from 'classnames';
import { Antd } from 'components';
import useTabNavigate from 'hooks/useTabNavigate';
import useGovernorContract from 'hooks/useGovernorContract';
import useBlockTime from 'hooks/useBlockTime';
import { OceanProposals, OracleProposals } from './tabs';

import styles from './GovernanceHome.module.scss';
import useInterval from 'hooks/useInterval';

const { TabPane } = Antd.Tabs;

const TAB_OPTIONS = [
  { label: 'Oracles', value: 'oracles' },
  { label: 'Oceans', value: 'oceans' }
];

const TAB_CONTENT = {
  [TAB_OPTIONS[0].value]: OracleProposals,
  [TAB_OPTIONS[1].value]: OceanProposals
};

const GovernanceHome = () => {
  const { getProposals } = useGovernorContract();
  const { proposalReloadTime } = useBlockTime();
  const { tabSelected, changeTab } = useTabNavigate(TAB_OPTIONS);
  const TabContent = TAB_CONTENT[tabSelected];

  useInterval(() => getProposals(true), proposalReloadTime);

  useEffect(() => {
    getProposals();
  }, [getProposals]);

  return (
    <div className="w-full">
      <Antd.Tabs
        className={cx(styles.tabs, 'text-primary mb-4')}
        activeKey={tabSelected}
        onChange={changeTab}
        destroyInactiveTabPane>
        {TAB_OPTIONS.map((item) => {
          return <TabPane tab={item.label} key={item.value} />;
        })}
      </Antd.Tabs>
      <TabContent />
    </div>
  );
};

export default GovernanceHome;
