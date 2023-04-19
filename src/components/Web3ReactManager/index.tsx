import useEagerConnect from 'hooks/useEagerConnect';
import useWeb3InactiveListener from 'hooks/useWeb3InactiveListener';

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect();
  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useWeb3InactiveListener(!triedEager);

  return children;
}
