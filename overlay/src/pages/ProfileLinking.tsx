import React from 'react';
import { BrowserRouter as Router, HashRouter, Route, Link, Redirect, Switch } from "react-router-dom";
//import './ProfileLinking.css';
import { Icon, Card, Segment, Sticky, Menu, Divider, Button, Checkbox, Form } from 'semantic-ui-react';
import { ProfileCard } from '../components/ProfileCard';
import { TxWaiting } from '../components/TxWaiting';
import { ProvePost } from '../components/ProvePost';
import { ProveWaiting } from '../components/ProveWaiting';
import { Header } from '../components/Header';
import { Profile, dappletInstance } from '../dappletBus';
import { EnsService } from '../services/ensService';
import { findEnsNames } from '../helpers';

interface IProps {
  profile: Profile;
}

enum Stages {
  ProfileSelect, TxWaiting, ProvePost, ProveWaiting
}

interface IState {
  redirect: string | null;
  stage: Stages;
  transaction: {
    message: string;
  } | null;
  txResult: any;
  proveUrl: string;
  availableDomains: string[];
  unavailableDomains: {
    name: string;
    owner: string;
  }[];
  preferedDomain: string;
  currentAccount: string;
}

export class ProfileLinking extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      redirect: null,
      stage: Stages.ProfileSelect,
      transaction: null,
      txResult: null,
      proveUrl: '',
      availableDomains: [],
      unavailableDomains: [],
      preferedDomain: 'rinkeby.eth',
      currentAccount: ''
    }
  }

  async componentDidMount() {
    const ensService = new EnsService();

    const { profile } = this.props;
    // ToDo: 
    const domainsFromFullname = findEnsNames(profile.authorFullname);
    const domainFromUsername = `${profile.authorUsername}.eth`;
    const domainsForChecking = [...domainsFromFullname, domainFromUsername];
    const unavailableDomains = await Promise.all(domainsForChecking.map(d => ensService.getRegistrant(d).then(o => ({ name: d, owner: o }))));

    const account = await dappletInstance.getAccount();
    const availableDomains = await ensService.getDomains(account);
    
    this.setState({ availableDomains, unavailableDomains, currentAccount: account });
  }

  setStage(stage: Stages) {
    this.setState({ stage });
  }

  sendTransaction() {
    this.setState({
      transaction: {
        message: "ethernian.eth"
      },
      stage: Stages.TxWaiting
    });
  }

  render() {
    const { redirect, stage } = this.state;

    if (redirect) return <Redirect to={redirect} />

    switch (stage) {
      case Stages.ProfileSelect: return this.renderProfileSelect();
      case Stages.TxWaiting: return this.renderTxWaiting();
      case Stages.ProvePost: return this.renderProvePost();
      case Stages.ProveWaiting: return this.renderProveWaiting();
    }
  }

  renderProfileSelect() {
    return (
      <React.Fragment>
        <Header
          title='Profile Linking'
          subtitle='Step 1 of 4: Select addreses'
          onBack={() => this.setState({ redirect: '/' })}
        />

        <ProfileCard profile={this.props.profile} />

        <Segment>
          <p>Authentication takes place in two stages:</p>
          <p>1. Via your social network profile</p>
          <p>2. Via the ENS system</p>

          <p>To confirm via your social network profile you need
            to post in the format <b>"Dapplet-Confirmation yourname.eth"</b>
            or <b>Your profile name must contain your ENS</b>.</p>

          <p>The following addresses are available for linking in your account: {this.state.currentAccount}:</p>

          <Form>
            {this.state.availableDomains.map((domain, key) => (
              <Form.Field key={key}>
                <Checkbox
                  label={domain}
                  style={(this.state.preferedDomain === domain) ? { fontWeight: 800 } : {}}
                />
              </Form.Field>
            ))}
          </Form>

          <br />

          <Form>
            <Form.Field>Also there are some addresses which are similar with your username, but are owned by another account:</Form.Field>
            {this.state.unavailableDomains.map((domain, key) => (
              <Form.Field key={key}>
                <Checkbox label={`${domain.name} (${(domain.owner) ? `owned by ${domain.owner}` : 'available'})`} disabled />
              </Form.Field>
            ))}
          </Form>
        </Segment>

        <Button basic>Reset</Button>
        <Button primary onClick={() => this.sendTransaction()}>Continue</Button>
      </React.Fragment>
    );
  }

  renderTxWaiting() {
    return (
      <React.Fragment>
        <Header
          title='Profile Linking'
          subtitle='Step 2 of 4: Message Signing'
          onBack={() => this.setStage(Stages.ProfileSelect)}
        />
        <Segment>
          <TxWaiting
            type='sign'
            transaction={this.state.transaction}
            onSuccess={(r) => (this.setState({ txResult: r }), this.setStage(Stages.ProvePost))}
          />
        </Segment>
      </React.Fragment>
    );
  }

  renderProvePost() {
    dappletInstance.onProvePublished(proveUrl => {
      this.setState({ proveUrl });
      this.setStage(Stages.ProveWaiting);
    });

    return (
      <React.Fragment>
        <Header
          title='Profile Linking'
          subtitle='Step 3 of 4: Prove Publishing'
          onBack={() => this.setStage(Stages.ProfileSelect)}
        />
        <Segment>
          <ProvePost message={this.state.txResult} />
        </Segment>
      </React.Fragment>
    );
  }

  renderProveWaiting() {
    return (
      <React.Fragment>
        <Header
          title='Profile Linking'
          subtitle='Step 4 of 4: Prove Validating'
          onBack={() => this.setStage(Stages.ProvePost)}
        />
        <Segment>
          <ProveWaiting
            profile={this.props.profile}
            proveUrl={this.state.proveUrl}
            onRepost={() => this.setStage(Stages.ProvePost)}
            onGotIt={() => this.setState({ redirect: '/' })}
          />
        </Segment>
      </React.Fragment>
    );
  }
}
