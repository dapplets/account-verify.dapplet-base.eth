import React from 'react';
import { Redirect } from "react-router-dom";
import { Table, Button, Loader, Card, List, Label } from 'semantic-ui-react';
import { Header } from '../components/Header';
import { TxWaiting } from '../components/TxWaiting';
import { TxFailure } from '../components/TxFailure';
import { TxSuccess } from '../components/TxSuccess';
import { IdentityService, Account, Claim, ClaimTypes, ClaimStatus } from '../services/identityService';
import { Profile, dappletInstance, Settings } from '../dappletBus';
import { ProfileCard } from '../components/ProfileCard';
import { EthAddress } from '../components/EthAddress';
import { TextService } from '../services/textService';

const IS_LOADING = Symbol();

interface IProps {
  context: Profile & Settings
}

interface IState {
  redirect: string | null;
  stage: Stages;
  claims: (Claim & { text?: string | Symbol })[];
  loading: boolean;
  account: string | null;
}

enum Stages {
  Links,
  TxWaiting,
  TxSuccess,
  TxFailure
}

export class Claims extends React.Component<IProps, IState> {

  _identityService: IdentityService;
  _textService: TextService;

  constructor(props: IProps) {
    super(props);
    this.state = {
      redirect: null,
      stage: Stages.Links,
      claims: [],
      loading: true,
      account: null
    };
    this._identityService = new IdentityService(this.props.context.contractAddress);
    this._textService = new TextService();
  }

  setStage(stage: Stages) {
    this.setState({ stage });
  }

  async componentDidMount() {
    dappletInstance.getAccount().then(a => this.setState({ account: a }));
    const claims: (Claim & { text?: string | Symbol })[] = await this._identityService.getClaimsByAccount({
      domainId: 1,
      name: this.props.context.authorUsername.toLowerCase()
    });
    this.setState({ claims, loading: false });
    claims.forEach(c => {
      if (c.link !== null) {
        c.text = IS_LOADING;
        this.setState(this.state);
        this._textService.load(c.link).then(t => (c.text = t, this.setState(this.state)));
      }
    });
  }

  private async _approveClaim(claimId: number) {
    this.setStage(Stages.TxWaiting);
    const identityService = new IdentityService(this.props.context.contractAddress);

    try {
      await identityService.approveClaim(claimId);
      this.setStage(Stages.TxSuccess);
    } catch (err) {
      this.setStage(Stages.TxFailure);
    }
  }

  private async _rejectClaim(claimId: number) {
    this.setStage(Stages.TxWaiting);
    const identityService = new IdentityService(this.props.context.contractAddress);

    try {
      await identityService.rejectClaim(claimId);
      this.setStage(Stages.TxSuccess);
    } catch (err) {
      this.setStage(Stages.TxFailure);
    }
  }


  private async _cancelClaim(claimId: number) {
    this.setStage(Stages.TxWaiting);
    const identityService = new IdentityService(this.props.context.contractAddress);

    try {
      await identityService.cancelClaim(claimId);
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
          title='Claims'
          onBack={() => this.setState({ redirect: '/' })}
        />

        <p>Claims about this profile:</p>
        <ProfileCard profile={this.props.context} />

        {(this.state.loading) ? (<Loader active inline='centered'>Loading</Loader>) : (
          (this.state.claims.length === 0) ? (
            <p>You have no linked accounts yet.</p>
          ) : (
              <div>
                <Card.Group>
                  {this.state.claims.map((a, key) => (
                    <Card key={key} fluid>
                      <Card.Content>
                        <Card.Header>
                          Claim #{a.id}
                          {(a.status === ClaimStatus.InProgress) ? <Label style={{ margin: 0, float: 'right' }} color='blue' horizontal >In Progress</Label> : null}
                          {(a.status === ClaimStatus.Canceled) ? <Label style={{ margin: 0, float: 'right' }} color='grey' horizontal >Canceled</Label> : null}
                          {(a.status === ClaimStatus.Approved) ? <Label style={{ margin: 0, float: 'right' }} color='green' horizontal >Approved</Label> : null}
                          {(a.status === ClaimStatus.Rejected) ? <Label style={{ margin: 0, float: 'right' }} color='red' horizontal >Rejected</Label> : null}
                        </Card.Header>
                        <Card.Meta>
                          Author: <EthAddress address={a.author} />  Oracle: <EthAddress address={a.oracle} /><br />
                          {a.timestamp.toLocaleString()}
                        </Card.Meta>
                        <Card.Description>
                          <List bulleted>
                            {(this._isContains(a.claimTypes, ClaimTypes.AccountMimicsAnotherOne)) ? <List.Item>account mimics another one;</List.Item> : null}
                            {(this._isContains(a.claimTypes, ClaimTypes.UnusualBehaviour)) ? <List.Item>unusual behaviour;</List.Item> : null}
                            {(this._isContains(a.claimTypes, ClaimTypes.ProducesTooManyScams)) ? <List.Item>produces too many scams;</List.Item> : null}
                          </List>
                          {(a.text) ? ((a.text === IS_LOADING) ? "Loading..." : <p style={{ wordBreak: 'break-word' }}>{a.text}</p>) : null}
                        </Card.Description>
                      </Card.Content>
                      {(a.status === ClaimStatus.InProgress) ? <Card.Content extra>
                        {(this.state.account) ? <div className={(this.state.account === a.oracle && this.state.account === a.author) ? 'ui three buttons' : ((this.state.account === a.oracle) ? 'ui two buttons' : 'ui one buttons')}>
                          {(this.state.account === a.oracle) ? <Button basic color='green' onClick={() => this._approveClaim(a.id)}>Approve</Button> : null}
                          {(this.state.account === a.oracle) ? <Button basic color='red' onClick={() => this._rejectClaim(a.id)}>Reject</Button> : null}
                          {(this.state.account === a.author) ? <Button basic color='blue' onClick={() => this._cancelClaim(a.id)}>Cancel</Button> : null}
                        </div> : null}
                      </Card.Content> : null}
                    </Card>
                  ))}
                </Card.Group>
              </div>
            )
        )}

      </React.Fragment>
    );
  }

  _isContains(a: number, b: number) {
    return (a & b) === b;
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
