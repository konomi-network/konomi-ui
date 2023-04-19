import { Antd, Button } from 'components';
import styles from './index.module.scss';

type TProps = {
  isVisible?: boolean;
  toggleVisible: (input: boolean) => any;
  onSubmit: () => {} | void;
  content: any;
};

const ConfirmModal: React.FC<TProps> = ({
  onSubmit = () => {},
  toggleVisible,
  isVisible,
  content
}) => {
  const handleSubmit = async () => {
    onSubmit();
    toggleVisible(false);
  };

  const handleCancel = () => {
    toggleVisible(false);
  };

  return (
    <Antd.Modal
      onCancel={handleCancel}
      className={styles.modal}
      width={300}
      visible={isVisible}
      destroyOnClose
      footer={null}
      centered>
      <span className="block mt-2">{content}</span>
      <Button className={styles.confirm} onClick={handleSubmit}>
        Confirm
      </Button>
    </Antd.Modal>
  );
};

export default ConfirmModal;
