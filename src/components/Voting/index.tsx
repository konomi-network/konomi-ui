import { Antd, Input } from 'components';
import { ApproveIcon, RejectIcon } from 'resources/icons';

const VOTE_COLOR_MAP = {
  approve: '#00D7D7',
  reject: '#FF007A',
  disabled: '#8C8C8C'
};

type TVoteInfoProps = { count?: number | string; isApprove?: boolean };

const VoteInfo: React.FC<TVoteInfoProps> = ({ count = 0, isApprove }) => {
  return (
    <div
      className="opacity-50 flex justify-center items-center w-32 gap-2"
      style={{
        color: isApprove ? VOTE_COLOR_MAP.approve : VOTE_COLOR_MAP.reject
      }}>
      <div className="w-2 h-2 rounded-full bg-current" />
      <span className="text-current">{count || 0} Votes</span>
    </div>
  );
};

type TVotingProps = {
  status: number;
  approveCount: number;
  rejectCount: number;
  isProposer: boolean;
  isVoted: boolean;
  isVoting: boolean;
  handleApprove: () => any;
  handleReject: () => any;
  rejectReason: string;
  handleChangeReason: (arg: React.ChangeEvent<HTMLInputElement>) => any;
};

const Voting: React.FC<TVotingProps> = ({
  status,
  approveCount,
  rejectCount,
  isProposer,
  isVoted,
  isVoting,
  rejectReason,
  handleChangeReason,
  handleApprove,
  handleReject
}) => {
  const renderActions = () => {
    if (isProposer) {
      return (
        <div className="ml-2 mt-2 font-bold text-lg text-primary opacity-70">You are proposer</div>
      );
    }

    if (isVoted) {
      return <div className="ml-2 mt-2 font-bold text-lg text-gray-500">You have voted</div>;
    }

    if (isVoting) {
      return (
        <div className="ml-2 mt-2 font-bold text-lg text-primary opacity-70">
          Your vote is processing ...
        </div>
      );
    }

    return (
      <div className="flex w-full">
        <div className="border-r border-primary border-opacity-50">
          <Antd.Button
            type="text"
            size="large"
            className="font-bold text-lg w-32 transition-opacity opacity-70 hover:opacity-100"
            style={{
              color: VOTE_COLOR_MAP.approve
            }}
            onClick={handleApprove}
            icon={<ApproveIcon className="inline-block mr-2 pb-0.5" />}>
            Approve
          </Antd.Button>
        </div>
        <div className="border-r border-primary border-opacity-50">
          <Antd.Button
            type="text"
            size="large"
            className="font-bold text-lg w-32 transition-opacity opacity-70 hover:opacity-100"
            style={{
              color: VOTE_COLOR_MAP.reject
            }}
            onClick={handleReject}
            icon={<RejectIcon className="inline-block mr-2 pb-0.5" />}>
            Reject
          </Antd.Button>
        </div>
        <Input
          bordered={false}
          placeholder="type in your reason of rejection here"
          className="ml-0.5 mt-0.5 hover:border-none"
          onChange={handleChangeReason}
          disabled={isVoted}
          value={rejectReason}
        />
      </div>
    );
  };

  return (
    <>
      <div className="mx-4 mb-4 flex font-medium">
        <VoteInfo isApprove count={approveCount} />
        <VoteInfo count={rejectCount} />
      </div>
      {[0, 1].includes(status) && (
        <div className="mx-4 mb-2 h-11 flex font-medium border-t border-primary border-opacity-50">
          {renderActions()}
        </div>
      )}
    </>
  );
};

export default Voting;
