import React from 'react';
import { Redirect } from "react-router-dom";
import { Segment, Button, Checkbox, Form, Loader } from 'semantic-ui-react';
import { ProfileCard } from '../components/ProfileCard';
import { TxWaiting } from '../components/TxWaiting';
import { TxFailure } from '../components/TxFailure';
import { ProvePost } from '../components/ProvePost';
import { Header } from '../components/Header';
import { Profile, dappletInstance, Settings } from '../dappletBus';
import { EnsService } from '../services/ensService';
import { findEnsNames } from '../helpers';
import { IdentityService, Account } from '../services/identityService';

//import './ProfileLinking.css';

interface IProps {
  context: Profile & Settings;
}

enum Stages {
  ProfileSelect,
  SignWaiting,
  SignSuccess,
  SignFailure,
  ProvePost,
  TxWaiting,
  TxFailure,
  SuccessLinking
}

interface IState {
  redirect: string | null;
  stage: Stages;
  transaction: {
    message: string;
  } | null;
  signedProve: string;
  proveUrl: string;
  availableDomains: string[];
  unavailableDomains: {
    name: string;
    owner: string;
  }[];
  selectedDomains: string[];
  preferedDomain: string;
  currentAccount: string;
  linkedAccounts: Account[];
  loading: boolean;
}

export class ProfileLinking extends React.Component<IProps, IState> {

  private _identityService: IdentityService;

  constructor(props: IProps) {
    super(props);
    this.state = {
      redirect: null,
      stage: Stages.ProfileSelect,
      transaction: null,
      signedProve: '',
      proveUrl: '',
      availableDomains: [],
      unavailableDomains: [],
      selectedDomains: [],
      linkedAccounts: [],
      preferedDomain: '',
      currentAccount: '',
      loading: true
    }

    this._identityService = new IdentityService(this.props.context.contractAddress);
  }

  async componentDidMount() {
    const ensService = new EnsService();

    const { context: profile } = this.props;
    // ToDo: 
    const domainsFromFullname = findEnsNames(profile.authorFullname);
    const domainFromUsername = `${profile.authorUsername}.eth`;
    const domainsForChecking = [...domainsFromFullname, domainFromUsername];
    const unavailableDomains = await Promise.all(domainsForChecking.map(d => ensService.getRegistrant(d).then(o => ({ name: d, owner: o }))));
    const linkedAccounts = await this._identityService.getAccounts({
      domainId: 1,
      name: this.props.context.authorUsername.toLowerCase()
    });

    const account = await dappletInstance.getAccount();
    const availableDomains = await ensService.getDomains(account);

    this.setState({ availableDomains, unavailableDomains, currentAccount: account, linkedAccounts, loading: false });
  }

  setStage(stage: Stages) {
    this.setState({ stage });
  }

  async signProve() {
    this.setStage(Stages.SignWaiting);
    try {
      const selectedDomain = this.state.selectedDomains[0].toLowerCase();
      const signedProve = await dappletInstance.signProve(selectedDomain);
      this.setState({ signedProve });
      this.setStage(Stages.ProvePost);
      dappletInstance.onProvePublished(async proveUrl => {
        this.setState({ proveUrl });
        const identityService = new IdentityService(this.props.context.contractAddress);
        const currentAccount = { domainId: 1, name: this.props.context.authorUsername.toLowerCase() };
        const newAccount = { domainId: 2, name: selectedDomain };
        this.setStage(Stages.TxWaiting);

        try {
          await identityService.addAccount(currentAccount, newAccount);
          this.setStage(Stages.SuccessLinking);
        } catch (err) {
          this.setStage(Stages.TxFailure);
        }
      });
    } catch (err) {
      this.setStage(Stages.SignFailure);
    }
  }

  render() {
    const { redirect, stage } = this.state;

    if (redirect) return <Redirect to={redirect} />

    switch (stage) {
      case Stages.ProfileSelect: return this.renderProfileSelect();
      case Stages.SignWaiting: return this.renderSignWaiting();
      case Stages.SignFailure: return this.renderSignFailure();
      case Stages.ProvePost: return this.renderProvePost();
      case Stages.TxWaiting: return this.renderTxWaiting();
      case Stages.TxFailure: return this.renderTxFailure();
      case Stages.SuccessLinking: return this.renderSuccessLinking();
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

        <ProfileCard profile={this.props.context} />

        <Segment>
          <p>Authentication takes place in two stages:</p>
          <p>1. Via your social network profile</p>
          <p>2. Via the ENS system</p>

          <p>To confirm via your social network profile you need
            to post in the format <b>"Dapplet-Confirmation yourname.eth"</b>
            or <b>Your profile name must contain your ENS</b>.</p>

          <p>The following addresses are available for linking in your account: {this.state.currentAccount}:</p>

          {(this.state.loading) ? (<Loader inline active size='mini' />) : (
            (this.state.unavailableDomains.length > 0) ? (
              <Form>
                {this.state.availableDomains.map((domain, key) => (
                  <Form.Field key={key}>
                    <Checkbox
                      label={this.state.linkedAccounts.filter(a => a.domainId === 2).map(a => a.name).includes(domain) ? `${domain} (already linked)`: domain}
                      style={(this.state.preferedDomain === domain) ? { fontWeight: 800 } : {}}
                      checked={this.state.selectedDomains.includes(domain) || this.state.linkedAccounts.filter(a => a.domainId === 2).map(a => a.name).includes(domain)}
                      disabled={this.state.linkedAccounts.filter(a => a.domainId === 2).map(a => a.name).includes(domain)}
                      onChange={(e, data) => {
                        if (data.checked) {
                          this.setState({ selectedDomains: [...this.state.selectedDomains, domain] });
                        } else {
                          this.setState({ selectedDomains: this.state.selectedDomains.filter(d => d !== domain) });
                        }
                      }}
                    />
                  </Form.Field>
                ))}
              </Form>
            ) : (<p>You do not have your own ens names. Register at least one to continue.</p>)
          )}

          {(this.state.unavailableDomains.length > 0) ? (
            <React.Fragment>
              <br />
              <Form>
                <Form.Field>Also there are some addresses which are similar with your username, but are owned by another account:</Form.Field>
                {this.state.unavailableDomains.map((domain, key) => (
                  <Form.Field key={key}>
                    <Checkbox label={`${domain.name} (${(domain.owner) ? `owned by ${domain.owner}` : 'available'})`} disabled />
                  </Form.Field>
                ))}
              </Form>
            </React.Fragment>
          ) : null}
        </Segment>

        <Button basic onClick={() => this.setState({ selectedDomains: [] })}>Reset</Button>
        <Button
          primary
          onClick={() => this.signProve()}
          disabled={this.state.selectedDomains.length === 0}
        >Continue</Button>
      </React.Fragment>
    );
  }

  renderSignWaiting() {
    return (
      <React.Fragment>
        <Header
          title='Profile Linking'
          subtitle='Step 2 of 4: Message Signing'
          onBack={() => this.setStage(Stages.ProfileSelect)}
        />
        <Segment>
          <TxWaiting type='sign' />
        </Segment>
      </React.Fragment>
    );
  }

  renderSignFailure() {
    return (
      <React.Fragment>
        <Header
          title='Profile Linking'
          subtitle='Step 2 of 4: Message Signing'
          onBack={() => this.setStage(Stages.ProfileSelect)}
        />
        <Segment>
          <TxFailure type='sign' />
        </Segment>
      </React.Fragment>
    );
  }

  renderProvePost() {
    return (
      <React.Fragment>
        <Header
          title='Profile Linking'
          subtitle='Step 3 of 4: Prove Publishing'
          onBack={() => this.setStage(Stages.ProfileSelect)}
        />
        <Segment>
          <ProvePost message={this.state.signedProve} />
        </Segment>
      </React.Fragment>
    );
  }

  renderTxWaiting() {
    return (
      <React.Fragment>
        <Header
          title='Profile Linking'
          subtitle='Step 4 of 4: Account Registration'
          onBack={() => this.setStage(Stages.ProfileSelect)}
        />
        <Segment>
          <TxWaiting type='transaction' />
        </Segment>
      </React.Fragment>
    );
  }

  renderTxFailure() {
    return (
      <React.Fragment>
        <Header
          title='Profile Linking'
          subtitle='Step 4 of 4: Account Registration'
          onBack={() => this.setStage(Stages.ProfileSelect)}
        />
        <Segment>
          <TxFailure type='transaction' />
        </Segment>
      </React.Fragment>
    );
  }

  renderSuccessLinking() {
    return (
      <React.Fragment>
        <Header
          title='Profile Linking'
          subtitle='Step 4 of 4: Account Registration'
          onBack={() => this.setStage(Stages.ProfileSelect)}
        />
        <Segment>
          <p>Congratulations! You have linked your account to your ENS name.</p>
        </Segment>

        <Button
          primary
          onClick={() => this.setState({ redirect: '/' })}
        >Got it</Button>
      </React.Fragment>
    );
  }

  // renderProveWaiting() {
  //   return (
  //     <React.Fragment>
  //       <Header
  //         title='Profile Linking'
  //         subtitle='Step 4 of 4: Prove Validating'
  //         onBack={() => this.setStage(Stages.ProvePost)}
  //       />
  //       <Segment>
  //         <ProveWaiting
  //           profile={this.props.profile}
  //           proveUrl={this.state.proveUrl}
  //           onRepost={() => this.setStage(Stages.ProvePost)}
  //           onGotIt={() => this.setState({ redirect: '/' })}
  //         />
  //       </Segment>
  //     </React.Fragment>
  //   );
  // }
}
