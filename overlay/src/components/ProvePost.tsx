import React from 'react';
import { BrowserRouter as Router, HashRouter, Route, Link, Redirect, Switch } from "react-router-dom";
import { Message, Button, Icon } from 'semantic-ui-react';
//import './ProvePost.css';

interface IProps {
  message: string;
}

interface IState {
}

export class ProvePost extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { message } = this.props;

    return (
      <React.Fragment>
        <p>Publish a post with following text to prove the ownership of the @ethernian account.</p>
        <Message>
          <p>{message}</p>
        </Message>
        <Button primary onClick={() => {navigator.clipboard.writeText(message)}}>
          <Icon name='copy' />
          Copy
        </Button>
      </React.Fragment>
    );
  }
}
