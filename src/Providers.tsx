import { Provider as ReduxProvider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import { configureStore } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';
import { Web3ReactProvider } from '@web3-react/core';
import { IPFSClientProvider, WebSocketProvider } from 'contexts';
import { getLibrary } from 'utils/web3';
import { ErrorBoundary, NetworkError } from 'components';
import reducer from 'modules/rootReducer';

const isDevelopmentMode = process.env.NODE_ENV === 'development';

const store = configureStore({
  reducer,
  devTools: isDevelopmentMode,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: {
        ignoredPaths: ['connection']
      }
    }).concat(isDevelopmentMode ? [logger] : [])
});

type TProps = {
  children: any;
};

const Providers: React.FC<TProps> = (props: TProps) => {
  return (
    <ErrorBoundary>
      <CookiesProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <ReduxProvider store={store}>
            <WebSocketProvider>
              <IPFSClientProvider>
                <NetworkError />
                {props.children}
              </IPFSClientProvider>
            </WebSocketProvider>
          </ReduxProvider>
        </Web3ReactProvider>
      </CookiesProvider>
    </ErrorBoundary>
  );
};

export default Providers;
