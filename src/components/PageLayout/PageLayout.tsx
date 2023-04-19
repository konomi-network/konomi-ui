import { Antd } from 'components';
import GlobalTransactions from 'components/GlobalTransactions';
import { Footer, Header } from './components';
import styles from './PageLayout.module.scss';

const { Content } = Antd.Layout;

type TProps = {
  children: React.ReactNode;
};

const PageLayout: React.FC<TProps> = ({ children }) => {
  return (
    <Antd.Layout className={styles.pageLayout}>
      <Header></Header>
      <Content className={styles.content}>
        <GlobalTransactions />
        {children}
      </Content>
      <Footer></Footer>
    </Antd.Layout>
  );
};

export default PageLayout;
