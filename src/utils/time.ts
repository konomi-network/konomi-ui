import { BlockNumber } from 'web3-core';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const getUpdateTimeDisplay = (updatedTimestamp?: string, thresholdTime = 15): string => {
  if (!updatedTimestamp) {
    return '';
  }
  // in min
  const diffTime = dayjs.utc().diff(dayjs(updatedTimestamp), 'minutes');

  // if < 15mins ago
  if (diffTime <= thresholdTime) {
    return `${diffTime} mins ago`;
  } else {
    return dayjs.utc(updatedTimestamp).local().format('DD/MMM/YYYY HH:mm');
  }
};

const getBlockDate = async (
  blockNumber: BlockNumber,
  library: any,
  blockDateFormat = 'DD/MM/YYYY'
) => {
  const result: any = await library?.eth.getBlock(blockNumber);
  return getTimestampDate(result.timestamp, blockDateFormat);
};

const getTimestampDate = (timestamp: number, dateFormat = 'DD/MM/YYYY') => {
  return dayjs.unix(timestamp).local().format(dateFormat);
};

export { getUpdateTimeDisplay, getBlockDate, getTimestampDate };
