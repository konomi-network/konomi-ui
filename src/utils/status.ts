type StatusItem = { color: string; text: string; [key: string]: any };

const CURRENCY_STATUS_MAP = {
  0: { color: '#8C8C8C', text: 'Disabled' },
  1: { color: '#76FCB3', text: 'Active' },
  2: { color: '#FFE500', text: 'Terminated' },
  3: { color: '#FF007A', text: 'Suspended' }
} as {
  [key: number]: StatusItem;
};

const PROPOSAL_STATUS_MAP = {
  0: { color: '#00D7D7', text: 'Active' },
  1: { color: '#FF007A', text: 'Rejected' },
  2: { color: '#76FCB3', text: 'Approved' },
  3: { color: '#a07eff', text: 'Executed' },
  4: { color: '#8C8C8C', text: 'Canceled' }
} as { [key: number]: { color: string; text: string } };

const PROPOSAL_STATUS_STYLE = {
  0: { backgroundColor: '#00D7D7', color: '#282749' },
  1: { backgroundColor: 'rgba(255, 0, 122, 0.2)', color: '#FF007A' },
  2: { backgroundColor: '#76FCB3', color: '#282749' },
  3: { backgroundColor: 'rgba(160,126,255, 0.2)', color: '#a07eff' },
  4: { backgroundColor: 'rgba(188, 188, 188, 0.2)', color: '#8C8C8C' }
} as { [key: number]: { backgroundColor: string; color: string } };

export { CURRENCY_STATUS_MAP, PROPOSAL_STATUS_MAP, PROPOSAL_STATUS_STYLE };
