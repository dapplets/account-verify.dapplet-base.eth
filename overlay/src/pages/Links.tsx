import React from 'react';
import { BrowserRouter as Router, HashRouter, Route, Link, Redirect, Switch } from "react-router-dom";
import { Icon, Divider, Table, Label, Menu, Button } from 'semantic-ui-react';
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
  currentAccount: Account | null;
  removingAccount: Account | null;
}

enum Stages {
  Links,
  TxWaiting
}

export class Links extends React.Component<IProps, IState> {

  _identityService: IdentityService;

  constructor(props: IProps) {
    super(props);
    this.state = {
      redirect: null,
      stage: Stages.Links,
      accounts: [],
      currentAccount: null,
      removingAccount: null
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
    this.setState({ accounts });
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
    this.setState({ currentAccount, removingAccount });
    this.setStage(Stages.TxWaiting);
    //await this._identityService.removeAccount(currentAccount, removingAccount);
  }

  render() {
    const { redirect, stage } = this.state;

    if (redirect) return <Redirect to={redirect} />

    switch (stage) {
      case Stages.Links: return this.renderLinks();
      case Stages.TxWaiting: return this.renderTxWaiting();
    }
  }

  renderLinks() {
    return (
      <React.Fragment>
        <Header
          title='My accounts'
          onBack={() => this.setState({ redirect: '/' })}
        />

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

        </Table>
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
          transaction2={{
            currentAccount: this.state.currentAccount,
            removingAccount: this.state.removingAccount
          }}
          onSuccessOk={() => this.setStage(Stages.Links)}
          onFailureBack={() => this.setStage(Stages.Links)}
        />
      </React.Fragment>
    );
  }
}
