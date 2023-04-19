import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getSelectedAccount } from 'modules/account/reducer';
import { EmptyConnection, EmptyData } from 'components';

type TProps = {
  content?: string;
};

const Empty: React.FC<TProps> = () => {
  const selectedAccount = useSelector(getSelectedAccount);

  if (!selectedAccount) {
    return <EmptyConnection content="view proposals" />;
  }

  return (
    <EmptyData
      content={
        <>
          There is no proposal yet. Please click <Link to="new-proposal">here</Link> to create a new
          one
        </>
      }
    />
  );
};

export default Empty;
