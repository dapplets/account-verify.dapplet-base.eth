import React from 'react';
import { Link } from "react-router-dom";
import { Button, Divider } from 'semantic-ui-react';
import { ProfileCard } from '../components/ProfileCard';
import { Profile } from '../dappletBus';

interface IProps {
  context: Profile;
}

interface IState { }

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
        <ProfileCard profile={this.props.context} />

        <Divider hidden fitted />
        <Link to="/profile-linking"><Button fluid primary>Link this profile with my ENS</Button></Link>
        <Divider hidden fitted />
        <Link to="/links"><Button fluid primary>Manage my existing links</Button></Link>
        <Divider hidden fitted />
        <Link to="/create-claim"><Button fluid primary>Identity Claims</Button></Link>
        <Divider hidden fitted />
        <Link to="/claims"><Button fluid primary>View Claims</Button></Link>
      </div>
    );
  }
}
