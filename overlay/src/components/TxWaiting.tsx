import React from 'react';
import { Loader } from 'semantic-ui-react';
//import './TxWaiting.css';

interface IProps {
  type: 'sign' | 'transaction';
}

interface IState {
}

export class TxWaiting extends React.Component<IProps, IState> {
  render() {
    if (this.props.type === 'sign') {
      return <React.Fragment>
        <p>Waiting of the message signing in your wallet.</p>
        <Loader active inline='centered'>Signing</Loader>
      </React.Fragment>;
    } else {
      return <React.Fragment>
        <p>Waiting of the transaction confirmation in your wallet.</p>
        <Loader active inline='centered'>Mining</Loader>
      </React.Fragment>;
    }
  }
}
