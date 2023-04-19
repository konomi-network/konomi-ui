/* eslint-disable react/no-unescaped-entities */
import { Component, ReactNode } from 'react';
import { reportToLarkBot } from './utils/botHook';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: React.ErrorInfo) {
    reportToLarkBot(error, info);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-1/2 mx-auto mt-4 p-4 font-bold text-base text-center text-primary border border-solid border-primary">
          <span className="block py-2 font-bold ">Sorry, there was an unexpected issue !</span>
          <span className="block py-2 font-bold ">Our team has been notified !</span>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
