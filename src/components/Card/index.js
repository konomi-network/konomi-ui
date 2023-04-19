import React from 'react';

import styles from './Card.module.scss';

const Card = ({ children, className = '' }) => (
  <div className={[styles.container, className].join(' ')}>{children}</div>
);

export default Card;
