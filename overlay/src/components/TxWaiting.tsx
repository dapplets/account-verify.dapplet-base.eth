import React from 'react';
import { BrowserRouter as Router, HashRouter, Route, Link, Redirect, Switch } from "react-router-dom";
import { Segment, Loader, Button } from 'semantic-ui-react';
import { dappletInstance } from '../dappletBus';
import { IdentityService } from '../services/identityService';
//import './TxWaiting.css';

interface IProps {
  onSuccess?: (result: any) => void;
  onFailure?: (result: any) => void;
  onSuccessOk?: (result: any) => void;
  onFailureBack?: (result: any) => void;
  type: 'sign' | 'transaction';
  transaction?: {
    message: string;
  } | null;
  transaction2? : any;
  stage?: 'waiting' | 'success' | 'failure';
}

interface IState {
  stage: Stages;
  result: any;
}

enum Stages {
  Waiting, Success, Failure
}

export class TxWaiting extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    if (this.props.stage) {
      const map = {
        'waiting': Stages.Waiting,
        'success': Stages.Success,
        'failure': Stages.Failure
      };
      this.state = { stage: map[this.props.stage], result: null };
    } else {
      this.state = { stage: Stages.Waiting, result: null };
    }
  }

  componentDidMount() {
    if (this.props.transaction) {
      
    } else if (this.props.transaction2) {
      const identityService = new IdentityService();
      identityService.removeAccount(this.props.transaction2.currentAccount, this.props.transaction2.removingAccount)
        .then((result) => {
          this.setState({ result });
          this.onSuccess();
        });
    }
  }

  setStage(stage: Stages) {
    this.setState({ stage });
  }

  onSuccess() {
    if (this.props.onSuccess) {
      this.props.onSuccess(this.state.result);
    } else {
      this.setStage(Stages.Success);
    }
  }

  onFailure() {
    if (this.props.onFailure) {
      this.props.onFailure(this.state.result);
    } else {
      this.setStage(Stages.Failure);
    }
  }

  render() {
    const { stage } = this.state;

    switch (stage) {
      case Stages.Waiting: return this.renderWaiting();
      case Stages.Success: return this.renderSuccess();
      case Stages.Failure: return this.renderFailure();
    }
  }

  renderWaiting() {
    const content = (this.props.type === 'sign') ?
      <React.Fragment>
        <p>Waiting of the message signing in your wallet.</p>
        <Loader active inline='centered'>Signing</Loader>
      </React.Fragment> :
      <React.Fragment>
        <p>Waiting of the transaction confirmation in your wallet.</p>
        <Loader active inline='centered'>Mining</Loader>
      </React.Fragment>;

    return (
      <React.Fragment>
        {content}
      </React.Fragment>
    );
  }

  renderSuccess() {
    const { type } = this.props;
    return (
      <React.Fragment>
        <p>{(type === 'sign') ? 'Successful signing' : 'Successful transaction'}</p>
        <Button primary onClick={() => this.props.onSuccessOk?.(this.state.result)}>OK</Button>
      </React.Fragment>
    );
  }

  renderFailure() {
    const { type } = this.props;
    return (
      <React.Fragment>
        <p>{(type === 'sign') ? 'Signing was rejected' : 'Transaction was rejected'}</p>
        <Button primary onClick={() => this.props.onFailureBack?.(this.state.result)}>Back</Button>
      </React.Fragment>
    );
  }
}
