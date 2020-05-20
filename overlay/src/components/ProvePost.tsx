import React from 'react';
import { Message, Button, Icon } from 'semantic-ui-react';
//import './ProvePost.css';

interface IProps {
  message: string;
}

interface IState {
}

export class ProvePost extends React.Component<IProps, IState> {
  render() {
    const { message } = this.props;

    return (
      <React.Fragment>
        <p>Publish a post with following text to prove the ownership of the @ethernian account.</p>
        <Message>
          <p style={{ overflowWrap: 'break-word' }}>{message}</p>
        </Message>
        <Button primary onClick={() => { navigator.clipboard.writeText(message) }}>
          <Icon name='copy' />
          Copy
        </Button>
      </React.Fragment>
    );
  }
}
