import React from 'react';
import { BrowserRouter as Router, HashRouter, Route, Link, Redirect, Switch } from "react-router-dom";
import { Icon, Divider, Table, Label, Menu, Button } from 'semantic-ui-react';
import { Header } from '../components/Header';
import { ProfileCard } from '../components/ProfileCard';
import { TxWaiting } from '../components/TxWaiting';

//import './Links.css';

interface IProps {
}

interface IState {
  redirect: string | null;
  stage: Stages;
  addresses: {
    type: string;
    address: string;
  }[];
}

enum Stages {
  Links,
  TxWaiting
}

export class Links extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      redirect: null,
      stage: Stages.Links,
      addresses: [{
        type: 'Twitter',
        address: 'ethernian'
      }, {
        type: 'ENS',
        address: 'ethernian.eth'
      }, {
        type: 'Ethereum',
        address: '0xDead...Beef'
      }]
    };
  }

  setStage(stage: Stages) {
    this.setState({ stage });
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

        <p>

        </p>
        {/* 
        <a href="#" onClick={() => window.open('https://twitter.com/ethernian', '_blank')}><Icon name='twitter' />ethernian</a><br />
        <a href="#" onClick={() => window.open('https://ethernian.eth', '_blank')}><Icon name='linkify' />ethernian.eth</a><br />
        <a href="#" onClick={() => window.open('https://ethernian.eth', '_blank')}><Icon name='ethereum' />0xDead...Beef</a><br /> */}

        <Table unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Address</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.addresses.map((a, key) => (
              <Table.Row key={key}>
                <Table.Cell>{a.type}</Table.Cell>
                <Table.Cell>{a.address}</Table.Cell>
                <Table.Cell>
                  <Button size='mini' onClick={() => this.setStage(Stages.TxWaiting)}>Unlink</Button>
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
          onSuccessOk={() => this.setStage(Stages.Links)}
          onFailureBack={() => this.setStage(Stages.Links)}
        />
      </React.Fragment>
    );
  }
}
