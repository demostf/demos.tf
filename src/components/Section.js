'use strict';

import React, {Component, PropTypes} from 'react';

require('./Section.css');

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
