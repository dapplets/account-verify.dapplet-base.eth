import React from 'react';
import { BrowserRouter as Router, HashRouter, Route, Link, Redirect, Switch } from "react-router-dom";
import './App.css';
import { Home } from './Home';
import { ProfileLinking } from './ProfileLinking';
import { Links } from './Links';
import { dappletInstance, Profile } from '../dappletBus';
import { Segment, Loader } from 'semantic-ui-react';

interface IProps {
}

interface IState {
  profile: Profile | null
}

export class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = { profile: null };
    dappletInstance.onProfileSelect((profile) => this.setState({ profile }));
  }

  render() {

    if (!this.state.profile) {
      return (
        <Segment>
            <Loader active inline='centered'>Context waiting</Loader>
        </Segment>
      );
    }

    return (
      <div className="App-container">
        <Router>
            <Switch>
              <Route exact path="/">
                <Home profile={this.state.profile} />
              </Route>
              <Route path="/profile-linking">
                <ProfileLinking profile={this.state.profile} />
              </Route>
              <Route path="/links">
                <Links profile={this.state.profile} />
              </Route>
            </Switch>
        </Router>
      </div>
    );
  }
}
