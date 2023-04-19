import { BrowserRouter } from 'react-router-dom';
import { PageLayout, UnsupportedMobile, Web3ReactManager } from 'components';
import Routes from 'App.routes';
import useFetchConfigData from 'hooks/useFetchConfigData';
import useMobileDetect from 'hooks/useMobileDetect';

const App: React.FC = () => {
  const { isMobile } = useMobileDetect();
  const [isFetching] = useFetchConfigData();

  if (isMobile()) {
    return <UnsupportedMobile />;
  }

  if (isFetching) return <div>...</div>;

  return (
    <Web3ReactManager>
      <BrowserRouter>
        <PageLayout>
          <Routes />
        </PageLayout>
      </BrowserRouter>
    </Web3ReactManager>
  );
};

export default App;
