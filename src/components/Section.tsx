import * as React from 'react';

import './Section.css';

export interface SectionProps {
	title: string;
	children: any[];
}

export function Section(props) {
	return (
		<section className={props.title}>
			<div className="title">
				<h3>
					{props.title}
				</h3>
			</div>
			{props.children}
		</section>
	);
}
