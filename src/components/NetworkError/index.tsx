import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Antd } from 'components';
import commonActions from 'modules/common/actions';
import { getNetworkError, getSupportedNetworks } from 'modules/common/reducer';
import { NetworkErrorIcon } from 'resources/icons';
import styles from './index.module.scss';

const NetworkError: React.FC = () => {
  const dispatch = useDispatch();
  const supportedNetworks = useSelector(getSupportedNetworks);
  const networkError = useSelector(getNetworkError);
  const [isVisible, toggleVisible] = useState(networkError);

  useEffect(() => {
    toggleVisible(networkError);
  }, [networkError]);

  return (
    <Antd.Modal
      onCancel={() => dispatch(commonActions.SET_NETWORK_ERROR(false))}
      className={styles.modal}
      visible={isVisible}
      footer={null}>
      <div className={styles.empty}>
        <NetworkErrorIcon />
        <div className="text-red-500 mt-8 mb-3 text-lg underline">Network Error</div>
        <div className="text-white text-base">Please connect to following networks</div>
        <div className="mt-4 flex justify-center border-primary border-solid border p-2 uppercase">
          {supportedNetworks.map((network: any) => (
            <span className="text-primary px-4" key={network.id}>
              {network.name}
            </span>
          ))}
        </div>
      </div>
    </Antd.Modal>
  );
};

export default NetworkError;
