import React, {Component} from 'react';
import {Duration} from './Duration.js';

export class ChatTable extends Component {
	render () {
		const rows = this.props.messages.map((message, i) => {
			return (
				<tr key={i}>
					<td className="user">{message.user}</td>
					<td className="message">{message.message}</td>
					<td className="duration"><Duration duration={message.time}/></td>
				</tr>
			);
		});
		return (
			<table className="chat">
				<tbody>
				{rows}
				</tbody>
			</table>
		);
	}

}
