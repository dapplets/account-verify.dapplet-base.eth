import React from 'react';
import { Message, Button, Icon } from 'semantic-ui-react';
import { Profile, Settings } from '../dappletBus';
//import './ProvePost.css';

interface IProps {
  message: string;
  context: Profile & Settings;
}

interface IState {
}

export class ProvePost extends React.Component<IProps, IState> {
  render() {
    const { message, context } = this.props;

    return (
      <React.Fragment>
        <p>Publish a post with following text to prove the ownership of the @{context.authorUsername} account.</p>
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
