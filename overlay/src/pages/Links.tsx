import React from 'react';
import { BrowserRouter as Router, HashRouter, Route, Link, Redirect, Switch } from "react-router-dom";
import { Icon, Divider, Table, Label, Menu, Button, Loader } from 'semantic-ui-react';
import { Header } from '../components/Header';
import { ProfileCard } from '../components/ProfileCard';
import { TxWaiting } from '../components/TxWaiting';
import { IdentityService, Account } from '../services/identityService';
import { Profile } from '../dappletBus';

//import './Links.css';

interface IProps {
  profile: Profile
}

interface IState {
  redirect: string | null;
  stage: Stages;
  accounts: Account[];
  loading: boolean;
}

enum Stages {
  Links,
  TxWaiting,
  TxSuccess,
  TxFailure
}

export class Links extends React.Component<IProps, IState> {

  _identityService: IdentityService;

  constructor(props: IProps) {
    super(props);
    this.state = {
      redirect: null,
      stage: Stages.Links,
      accounts: [],
      loading: true
    };
    this._identityService = new IdentityService();
  }

  setStage(stage: Stages) {
    this.setState({ stage });
  }

  async componentDidMount() {
    const accounts = await this._identityService.getAccounts({
      domainId: 1,
      name: this.props.profile.authorUsername.toLowerCase()
    });
    this.setState({ accounts, loading: false });
  }

  private _domainIdToName(domainId: number) {
    const map = [undefined, 'Twitter', 'ENS'];
    return map[domainId] || 'Unknown';
  }

  private async _unlinkAccount(removingAccount: Account) {
    const currentAccount: Account = {
      domainId: 1,
      name: this.props.profile.authorUsername.toLowerCase()
    };

    this.setStage(Stages.TxWaiting);
    const identityService = new IdentityService();

    try {
      await identityService.removeAccount(currentAccount, removingAccount);
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
          title='My accounts'
          onBack={() => this.setState({ redirect: '/' })}
        />

        {(this.state.loading) ? (<Loader active inline='centered'>Loading</Loader>) : (
          (this.state.accounts.length === 0) ? (
            <p>You have no linked accounts yet.</p>
          ) : (
              <Table unstackable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Address</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
  
                <Table.Body>
                  {this.state.accounts.map((a, key) => (
                    <Table.Row key={key}>
                      <Table.Cell>{this._domainIdToName(a.domainId)}</Table.Cell>
                      <Table.Cell>{a.name}</Table.Cell>
                      <Table.Cell>
                        <Button size='mini' onClick={() => this._unlinkAccount(a)}>Unlink</Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
  
              </Table >
            )
        )}
        
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
        <TxWaiting
          type='transaction'
          stage='waiting'
        />
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
        <TxWaiting
          type='transaction'
          stage='success'
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
        <TxWaiting
          type='transaction'
          stage='failure'
          onFailureBack={() => this.setState({ redirect: '/' })}
        />
      </React.Fragment>
    );
  }
}
