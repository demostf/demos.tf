import * as React from 'react';

import './Section.css';

export interface SectionProps {
	title: string;
	children: any[] | any;
	className?: string;
}

export function Section(props: SectionProps) {
	return (
		<section key={props.title} className={props.title + (props.className ? ' ' + props.className : '')}>
			<div className="title">
				<h3>
					{props.title}
				</h3>
			</div>
			{props.children}
		</section>
	);
}
