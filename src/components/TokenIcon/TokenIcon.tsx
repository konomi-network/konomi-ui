import { useSelector } from 'react-redux';
import cx from 'classnames';
import { FallbackCoinIcon } from 'resources/icons';
import { getImageMap } from 'modules/common/reducer';
import { displayFloat } from 'utils/formatter';
import styles from './TokenIcon.module.scss';

type TProps = {
  style?: object;
  className?: string;
  withBackground?: boolean;
  isVertical?: boolean; // default veritcal, could be horizontal
  name?: string;
  text?: string;
  size?: number;
  showName?: boolean;
  showPrice?: boolean;
  price?: number | string;
  borderWidth?: number;
  children?: any;
  imageMap?: { [key: string]: any };
};

const TokenIcon: React.FC<TProps> = ({
  className = '',
  withBackground = true,
  isVertical,
  name = '',
  text = '',
  size = 40,
  children,
  showName = false,
  showPrice = false,
  borderWidth = 2,
  price = '0',
  ...rest
}: TProps) => {
  const imageMap = useSelector(getImageMap);

  const getLogoBinary = () => {
    const imageObj = imageMap[name.toLowerCase()];
    return imageObj?.image;
  };

  const renderLogoImage = () => {
    if (!!getLogoBinary()) {
      return <img src={`data:image/png;base64,${getLogoBinary()}`} alt={name} />;
    }

    return <FallbackCoinIcon />;
  };

  return (
    <div
      className={cx(
        styles.container,
        'flex justify-center items-center bg-transparent',
        className,
        {
          [styles.vertical]: isVertical
        }
      )}
      {...rest}>
      <div
        className={cx('rounded-full', styles.iconWrapper, {
          [styles.gradient]: withBackground
        })}
        style={{
          padding: borderWidth
        }}>
        <div
          className={cx(styles.icon, 'relative overflow-hidden rounded-full')}
          style={{
            width: size,
            height: size
          }}>
          {children || renderLogoImage()}
        </div>
      </div>
      <div className="flex flex-col">
        {showName && <div className="ml-2">{text || name} </div>}
        {showPrice && (
          <div className="ml-2 text-gray-400 text-xs">{!!price ? displayFloat(+price) : '--'}</div>
        )}
      </div>
    </div>
  );
};

export default TokenIcon;
