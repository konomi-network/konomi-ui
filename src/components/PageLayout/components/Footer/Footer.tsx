import { Antd } from 'components';

import {
  KonomiIcon,
  GithubIcon,
  WhitepaperIcon,
  MediumIcon,
  TwitterIcon,
  TelegramIcon
} from 'resources/icons';

import styles from './Footer.module.scss';

const { Footer } = Antd.Layout;

const URLs = {
  homepage: 'https://www.konomi.network',
  blog: 'https://konomi-network.medium.com/',
  github: 'https://github.com/konomi-network',
  whitepaper: 'https://www.konomi.network/pdf/KonomiWhitepaper_Final-2.pdf',
  medium: 'https://konomi-network.medium.com/',
  twitter: 'https://twitter.com/KonomiNetwork',
  telegram: 'https://t.me/konominetwork'
};

const Link = (props: { href: string; children: any }) => {
  return <a target="_blank" rel="noreferrer" {...props}></a>;
};

const PageFooter: React.FC = () => {
  return (
    <Footer className={styles.footer}>
      <Antd.Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
        <KonomiIcon className="mt-1 w-24" />
        <div className={styles.links}>
          <Link href={URLs.homepage}>Home</Link>
          <Link href={URLs.homepage}>Contact Us</Link>
          <Link href={URLs.blog}>Blog</Link>
        </div>
      </Antd.Col>

      <Antd.Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
        <span>For Developers</span>
        <div className={styles.links}>
          <Link href={URLs.github}>
            <GithubIcon /> Github
          </Link>
          <Link href={URLs.whitepaper}>
            <WhitepaperIcon /> Whitepaper
          </Link>
        </div>
      </Antd.Col>

      <Antd.Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
        <span>Find us on</span>
        <div className={styles.links}>
          <Link href={URLs.medium}>
            <MediumIcon /> medium
          </Link>
          <Link href={URLs.twitter}>
            <TwitterIcon />
            twitter
          </Link>
          <Link href={URLs.telegram}>
            <TelegramIcon /> telegram
          </Link>
        </div>
      </Antd.Col>
    </Footer>
  );
};

export default PageFooter;
