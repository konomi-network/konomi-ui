import { Antd } from 'components';

const UnsupportedMobile: React.FC = () => (
  <Antd.Modal visible centered footer={null} closable={false} keyboard={false}>
    <span className="block">Sorry for this inconvenience.</span>
    <span className="block">We are only supporting desktop version for now.</span>
    <span className="block">Please comeback later.</span>
  </Antd.Modal>
);

export default UnsupportedMobile;
