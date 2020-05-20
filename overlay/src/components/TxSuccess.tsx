import React from 'react';
import { BrowserRouter as Router, HashRouter, Route, Link, Redirect, Switch } from "react-router-dom";
import { Segment, Loader, Button } from 'semantic-ui-react';

//import './TxSuccess.css';

interface IProps {
  onSuccessOk?: Function;
  type: 'sign' | 'transaction';
}

interface IState {
}

export class TxSuccess extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <p>{(this.props.type === 'sign') ? 'Successful signing' : 'Successful transaction'}</p>
        <Button primary onClick={() => this.props.onSuccessOk?.()}>OK</Button>
      </React.Fragment>
    );
  }
}
