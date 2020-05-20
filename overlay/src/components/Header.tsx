import React from 'react';
import { Icon, Divider, Header as SHeader } from 'semantic-ui-react';
//import './Header.css';

interface IProps {
    title: string;
    subtitle?: string;
    onBack: Function;
}

interface IState {
}

export class Header extends React.Component<IProps, IState> {

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
