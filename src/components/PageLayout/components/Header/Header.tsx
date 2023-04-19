import { useCallback, useEffect, useState } from 'react';
import { WalletConnector, Antd } from 'components';
import { Link, useLocation } from 'react-router-dom';
import { routes as getRoutes } from 'App.routes';
import { LogoIcon } from 'resources/icons';
import styles from './Header.module.scss';
import useCheckDisabledFeatures from 'hooks/useCheckDisabledFeatures';

const { Header } = Antd.Layout;

const externalFeatures = [
  {
    key: 'bridge',
    label: (
      <a href="https://app.multichain.org/#/router" target="_blank" rel="noreferrer">
        Bridge
      </a>
    )
  },
  {
    key: 'dex',
    label: (
      <a href="https://swap.konomi.tech" target="_blank" rel="noreferrer">
        Dex
      </a>
    )
  }
];

const routes = getRoutes();

const PageHeader: React.FC = () => {
  const { pathname } = useLocation();
  const { isDisabledFeature } = useCheckDisabledFeatures();
  const [selectedKey, setSelectedKey] = useState<string>('');

  const getNavSelected = useCallback(() => {
    const rootPath = pathname.split('/')[1];
    const pageName = routes.find((r) => r?.path === rootPath)?.name || routes[0].name;
    if (pageName !== selectedKey) {
      setSelectedKey(pageName);
    }
  }, [pathname, selectedKey, setSelectedKey]);

  const renderNavItems = () => {
    return routes.map(({ name, path, hidden }) => {
      if (path === '*' || hidden) return null;
      if (path && isDisabledFeature(path))
        return {
          key: name,
          label: name,
          className: styles.disabledItem
        };

      return {
        key: name,
        label: <Link to={path || '/'}>{name}</Link>
      };
    });
  };

  useEffect(() => {
    getNavSelected();
  }, [getNavSelected]);

  return (
    <Header className={styles.header}>
      <Link to="/oracle" className={styles.logo}>
        <LogoIcon />
      </Link>
      <Antd.Menu
        mode="horizontal"
        theme="dark"
        className={styles.menu}
        selectedKeys={[selectedKey]}
        items={[...renderNavItems(), ...externalFeatures]}
      />
      <WalletConnector />
    </Header>
  );
};

export default PageHeader;
