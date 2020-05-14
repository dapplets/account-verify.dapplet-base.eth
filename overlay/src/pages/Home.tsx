import React from 'react';
import { BrowserRouter as Router, HashRouter, Route, Link, Redirect, Switch } from "react-router-dom";
import { Card, Icon, Image, Button, Divider, Loader, Dimmer, Segment } from 'semantic-ui-react';
import { ProfileCard } from '../components/ProfileCard';
import { dappletInstance, Profile } from '../dappletBus';

interface IProps {
  profile: Profile;
}

interface IState {
  
}

export class Home extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      profile: null
    }
  }

  render() {
    return (
      <div>
        <ProfileCard profile={this.props.profile} />

        <Divider hidden fitted />

        <Link to="/profile-linking"><Button fluid primary>Link this profile with my ENS</Button></Link>

        <Divider hidden fitted />

        <Link to="/links"><Button fluid primary>Manage my existing links</Button></Link>
      </div>
    );
  }
}
