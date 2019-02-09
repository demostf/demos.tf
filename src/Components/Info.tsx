import * as React from 'react';
import {Component, ReactNode} from "react";

import './Info.css';

export interface InfoProps {
	title: string;
	children: any;
}

export interface InfoState {
	expanded: boolean;
}

export class Info extends Component<InfoProps, InfoState> {
	state: InfoState = {
		expanded: true
	};

	render(): ReactNode {
		return <div class="info-popup" onClick={() => this.setState({expanded: !this.state.expanded})}>
			<h2>{this.props.title}</h2>
			{this.state.expanded ? this.props.children : []}
		</div>;
	}
}
