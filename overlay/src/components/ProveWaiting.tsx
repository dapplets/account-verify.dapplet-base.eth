import React from 'react';
import { BrowserRouter as Router, HashRouter, Route, Link, Redirect, Switch } from "react-router-dom";
//import './ProveWaiting.css';
import { Segment, Loader, Divider, Button } from 'semantic-ui-react';
import { ProfileCard } from './ProfileCard';
import { Profile } from '../dappletBus';

interface IProps {
  onGotIt?: Function;
  onRepost?: Function;
  profile: Profile;
  proveUrl: string;
}

enum Stages {
  Waiting, Success, Failure
}

interface IState {
  stage: Stages
}

export class ProveWaiting extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      stage: Stages.Waiting
    }
    setTimeout(() => this.setStage(Stages.Success), 10000);
  }

  setStage(stage: Stages) {
    this.setState({ stage });
  }

  render() {
    switch (this.state.stage) {
      case Stages.Waiting:
        return (
          <React.Fragment>
            <p>Post is published at the following URL:</p>
            <p>{this.props.proveUrl}</p>

            <Loader active inline='centered'>Waiting of oracle confirmation</Loader>

            <Button basic onClick={() => this.props.onRepost?.()}>Repost</Button>
          </React.Fragment>
        );
      case Stages.Success:
        return (<React.Fragment>
          <ProfileCard profile={this.props.profile}/>

          <Divider hidden fitted />

          <p>Confirmation via your social network profile was successful.</p>
          <p>You can proceed to the next verification step.</p>

          <Button primary onClick={() => this.props.onGotIt?.()}>Got it!</Button>

        </React.Fragment>)
      case Stages.Failure:
        return (<React.Fragment>
          Failure
        </React.Fragment>)
    }

  }
}
