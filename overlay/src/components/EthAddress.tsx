import React from 'react';

interface IProps {
    address: string;
}

interface IState {
}

export class EthAddress extends React.Component<IProps, IState> {
    render() {
        return <span title={this.props.address}>{this._crop(this.props.address)}</span>;
    }

    private _crop(a: string): string {
        return a.substring(0, 6) + '....' + a.substring(a.length - 4);
    }
}
