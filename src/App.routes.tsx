import { Navigate, RouteObject, useRoutes } from 'react-router-dom';

import Summary from 'pages/Summary';
import OracleHome from 'pages/Oracle/OracleHome';
import OracleNewSubscriptions from 'pages/Oracle/OracleNewSubscriptions';
import Staking from 'pages/Staking';
import Oceans from 'pages/Oceans';
import GovernanceHome from 'pages/Governance/GovernanceHome';
import NewOracle from 'pages/Governance/NewOracle';
import NewOcean from 'pages/Governance/NewOcean';

import useCheckDisabledFeatures from 'hooks/useCheckDisabledFeatures';

type TRoute = RouteObject & {
  name: string;
  hidden?: boolean; //to hide the visibility in header menu
};

export const routes = (fallbackPath: string = '/governance'): TRoute[] => [
  {
    path: 'oracle',
    name: 'Oracle',
    children: [
      {
        index: true,
        element: <OracleHome />
      },
      {
        path: 'new-subscriptions',
        element: <OracleNewSubscriptions />
      }
    ]
  },
  {
    path: 'oceanLend',
    name: 'Ocean Lend',
    element: <Oceans />
  },
  {
    path: 'governance',
    name: 'Governance',
    children: [
      {
        index: true,
        element: <GovernanceHome />
      },
      {
        path: 'new-oracle',
        element: <NewOracle />
      },
      {
        path: 'new-ocean',
        element: <NewOcean />
      }
    ]
  },
  {
    path: 'staking',
    name: 'Staking',
    element: <Staking />
  },
  {
    path: 'summary',
    name: 'My Dashboard',
    element: <Summary />,
    hidden: true
  },
  {
    path: '*',
    name: '404',
    element: <Navigate replace to={fallbackPath} />
  }
];

const Routes = () => {
  const { isDisabledFeature } = useCheckDisabledFeatures();

  // SWITCH FALLBACK BETWEEN GOVERNANCE AND STAKING
  // BY DISABLED FEATURE ON NETWORK
  const defaultRoutes = routes(isDisabledFeature('governance') ? '/staking' : '/governance');

  const activeRoutes = defaultRoutes.filter(
    (route) => route.path && !isDisabledFeature(route.path)
  );

  const elements = useRoutes(activeRoutes as RouteObject[]);
  return elements;
};

export default Routes;
