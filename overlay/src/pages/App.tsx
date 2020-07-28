import React from 'react';
import { HashRouter, Route, Switch } from "react-router-dom";
import './App.css';
import { Home } from './Home';
import { ProfileLinking } from './ProfileLinking';
import { Links } from './Links';
import { CreateClaim } from './CreateClaim';
import { Claims } from './Claims';
import { dappletInstance, Profile, Settings } from '../dappletBus';
import { Segment, Loader } from 'semantic-ui-react';

interface IProps {
}

interface IState {
  context: Profile & Settings | null;
}

export class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = { context: null };
    dappletInstance.onProfileSelect((context) => this.setState({ context }));
  }

  componentDidMount() {
    document.getElementsByClassName('loader-container')?.[0]?.remove();
  }

  render() {

    if (!this.state.context) {
      return (
        <Segment>
          <Loader active inline='centered'>Context waiting</Loader>
        </Segment>
      );
    }

    return (
      <div className="App-container">
        <HashRouter>
          <Switch>
            <Route exact path="/">
              <Home context={this.state.context} />
            </Route>
            <Route path="/profile-linking">
              <ProfileLinking context={this.state.context} />
            </Route>
            <Route path="/links">
              <Links context={this.state.context} />
            </Route>
            <Route path="/create-claim">
              <CreateClaim context={this.state.context} />
            </Route>
            <Route path="/claims">
              <Claims context={this.state.context} />
            </Route>
          </Switch>
        </HashRouter>
      </div>
    );
  }
}
