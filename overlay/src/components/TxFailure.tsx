import React from 'react';
import { Button } from 'semantic-ui-react';
//import './TxFailure.css';

interface IProps {
  onFailureBack?: Function;
  type: 'sign' | 'transaction';
}

interface IState {
}

export class TxFailure extends React.Component<IProps, IState> {
  render() {
    return (
      <React.Fragment>
        <p>{(this.props.type === 'sign') ? 'Signing was rejected' : 'Transaction was rejected'}</p>
        <Button primary onClick={() => this.props.onFailureBack?.()}>Back</Button>
      </React.Fragment>
    );
  }
}
