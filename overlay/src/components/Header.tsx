import React from 'react';
import { BrowserRouter as Router, HashRouter, Route, Link, Redirect, Switch } from "react-router-dom";
import { Card, Icon, Image, Button, Divider, Header as SHeader } from 'semantic-ui-react';
//import './Header.css';

interface IProps {
    title: string;
    subtitle?: string;
    onBack: Function;
}

interface IState {
}

export class Header extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { title, onBack, subtitle } = this.props;

        return (
            <React.Fragment>
                <SHeader as='h2'>
                    <span><Icon onClick={() => onBack()} link name='arrow left' size='small' /></span>
                    <SHeader.Content>
                        {title}
                        {(subtitle) ? <SHeader.Subheader>{subtitle}</SHeader.Subheader> : null}
                    </SHeader.Content>
                </SHeader>
                <Divider />
            </React.Fragment>
        );
    }
}
