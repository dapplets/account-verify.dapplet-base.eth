import React from 'react';
import { Redirect } from "react-router-dom";
import { Table, Button, Loader, Checkbox, Divider, TextArea, Form } from 'semantic-ui-react';
import { Header } from '../components/Header';
import { TxWaiting } from '../components/TxWaiting';
import { TxFailure } from '../components/TxFailure';
import { TxSuccess } from '../components/TxSuccess';
import { IdentityService, Account, Claim, ClaimTypes } from '../services/identityService';
import { Profile, Settings } from '../dappletBus';
import { ProfileCard } from '../components/ProfileCard';
import { TextService } from '../services/textService';

//import './Links.css';

interface IProps {
  context: Profile & Settings
}

interface IState {
  redirect: string | null;
  stage: Stages;
  claims: Claim[];
  loading: boolean;
  checkbox1: boolean;
  checkbox2: boolean;
  checkbox3: boolean;
  text: string;
}

enum Stages {
  Links,
  TxWaiting,
  TxSuccess,
  TxFailure
}

export class CreateClaim extends React.Component<IProps, IState> {

  _identityService: IdentityService;
  _textService: TextService;

  constructor(props: IProps) {
    super(props);
    this.state = {
      redirect: null,
      stage: Stages.Links,
      claims: [],
      loading: true,
      checkbox1: false,
      checkbox2: false,
      checkbox3: false,
      text: ''
    };
    this._identityService = new IdentityService(this.props.context.contractAddress);
    this._textService = new TextService();
  }

  setStage(stage: Stages) {
    this.setState({ stage });
  }

  async componentDidMount() {
    const claims = await this._identityService.getClaimsByAccount({
      domainId: 1,
      name: this.props.context.authorUsername.toLowerCase()
    });
    this.setState({ claims, loading: false });
  }

  private async _createClaim() {
    const currentAccount: Account = {
      domainId: 1,
      name: this.props.context.authorUsername.toLowerCase()
    };

    this.setStage(Stages.TxWaiting);
    const identityService = new IdentityService(this.props.context.contractAddress);

    let claimTypes = 0;
    if (this.state.checkbox1) claimTypes += ClaimTypes.AccountMimicsAnotherOne;
    if (this.state.checkbox2) claimTypes += ClaimTypes.UnusualBehaviour;
    if (this.state.checkbox3) claimTypes += ClaimTypes.ProducesTooManyScams;

    try {
      let link = null;
      if (this.state.text.trim()) {
        link = await this._textService.save(this.state.text);
      }
      await identityService.createClaim(claimTypes, link, currentAccount, this.props.context.oracleAddress);
      this.setStage(Stages.TxSuccess);
    } catch (err) {
      this.setStage(Stages.TxFailure);
    }
  }

  render() {
    const { redirect, stage } = this.state;

    if (redirect) return <Redirect to={redirect} />

    switch (stage) {
      case Stages.Links: return this.renderLinks();
      case Stages.TxWaiting: return this.renderTxWaiting();
      case Stages.TxSuccess: return this.renderTxSuccess();
      case Stages.TxFailure: return this.renderTxFailure();
    }
  }

  renderLinks() {
    return (
      <React.Fragment>
        <Header
          title='Identity Claims'
          onBack={() => this.setState({ redirect: '/' })}
        />

        <p>What is wrong with this account?</p>
        <ProfileCard profile={this.props.context} />

        <Checkbox
          label='Account mimics another one'
          checked={this.state.checkbox1}
          onChange={(e, a) => this.setState({ checkbox1: !!a.checked })}
          style={{ marginBottom: 15 }}
        /><br />
        <Checkbox
          label='Unusual behaviour'
          checked={this.state.checkbox2}
          onChange={(e, a) => this.setState({ checkbox2: !!a.checked })}
          style={{ marginBottom: 15 }}
        /><br />
        <Checkbox
          label='Produces too many scams'
          checked={this.state.checkbox3}
          onChange={(e, a) => this.setState({ checkbox3: !!a.checked })}
          style={{ marginBottom: 20 }}
        /><br />

        <Form style={{ marginBottom: 15 }}>
          <TextArea placeholder='Tell more about the problem' value={this.state.text} onChange={(e, v) => this.setState({ text: v.value as string || '' })} />
        </Form>

        <Button fluid primary onClick={() => this._createClaim()}>Next</Button>
        <Divider hidden fitted />
        <Button fluid primary onClick={() => this.setState({ redirect: '/' })}>Cancel</Button>

      </React.Fragment>
    );
  }

  renderTxWaiting() {
    return (
      <React.Fragment>
        <Header
          title='My accounts'
          onBack={() => this.setStage(Stages.Links)}
        />
        <TxWaiting type='transaction' />
      </React.Fragment>
    );
  }

  renderTxSuccess() {
    return (
      <React.Fragment>
        <Header
          title='My accounts'
          onBack={() => this.setStage(Stages.Links)}
        />
        <TxSuccess
          type='transaction'
          onSuccessOk={() => this.setState({ redirect: '/' })}
        />
      </React.Fragment>
    );
  }

  renderTxFailure() {
    return (
      <React.Fragment>
        <Header
          title='My accounts'
          onBack={() => this.setStage(Stages.Links)}
        />
        <TxFailure
          type='transaction'
          onFailureBack={() => this.setState({ redirect: '/' })}
        />
      </React.Fragment>
    );
  }
}
