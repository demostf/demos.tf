import * as React from 'react';

export interface TeamBannerProps {
	redName: string;
	redScore: number;
	blueName: string;
	blueScore: number;
}

export function TeamBanner(props: TeamBannerProps) {
	return (
		<div className="teams">
			<div className="red">
					<span className="name">
						{props.redName}
					</span>
				<span className="score">{props.redScore}</span>
			</div>
			<div className="blue">
				<span className="score">{props.blueScore}</span>
				<span className="name">
						{props.blueName}
					</span>
			</div>
			<div className="clearfix"/>
		</div>
	);
}
