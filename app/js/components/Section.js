'use strict';

import {Component, PropTypes} from 'react';

export class Section extends Component {
	render = () => {
		return (
			<section className={this.props.title}>
				<div className="title">
					<h3>
						{this.props.title}
					</h3>
				</div>
				{this.props.children}
			</section>
		);
	}
}
