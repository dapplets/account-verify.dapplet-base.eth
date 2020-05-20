import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import { Profile } from '../dappletBus';
//import './ProfileCard.css';

interface IProps {
    profile: Profile;
}

interface IState {
}

export class ProfileCard extends React.Component<IProps, IState> {
    render() {
        return (
            <Card fluid >
                <Card.Content>
                    <Image
                        floated='left'
                        size='mini'
                        src={this.props.profile.authorImg}
                    />
                    <Card.Header>{this.props.profile.authorFullname}</Card.Header>
                    <Card.Meta>{this.props.profile.authorUsername}</Card.Meta>
                </Card.Content>
            </Card>
        );
    }
}
