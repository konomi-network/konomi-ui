import { Antd } from 'components';
import { OracleIcon, ProposalIcon } from 'resources/icons';
import { OracleSubscription, OceanLend, Proposals } from './tabs';
import styles from './Summary.module.scss';
import useTabNavigate from 'hooks/useTabNavigate';

const { TabPane } = Antd.Tabs;

const TAB_OPTIONS = [
  {
    label: (
      <>
        <OracleIcon /> Oracle
      </>
    ),
    value: 'oracles'
  },
  {
    label: (
      // TODO: update with new icon, or remove all icons
      <>
        <OracleIcon /> Ocean Lend
      </>
    ),
    value: 'oceanLend'
  },
  {
    label: (
      <>
        <ProposalIcon /> Proposals
      </>
    ),
    value: 'proposals'
  }
];

const TAB_CONTENT = {
  [TAB_OPTIONS[0].value]: OracleSubscription,
  [TAB_OPTIONS[1].value]: OceanLend,
  [TAB_OPTIONS[2].value]: Proposals
};

const Summary = () => {
  const { tabSelected, changeTab } = useTabNavigate(TAB_OPTIONS);
  const TabContent = TAB_CONTENT[tabSelected];

  return (
    <div className={styles.container}>
      <Antd.Tabs className={styles.tabs} activeKey={tabSelected} onChange={changeTab}>
        {TAB_OPTIONS.map((item) => {
          return <TabPane tab={item.label} key={item.value} />;
        })}
      </Antd.Tabs>
      <div className={styles.content}>
        <div className={styles.innerContent}>
          <TabContent />
        </div>
      </div>
    </div>
  );
};

export default Summary;
