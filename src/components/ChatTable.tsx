import * as React from 'react';
import {Duration} from './Duration';
import {ChatMessage} from "../Providers/DemoProvider";

export interface ChatTableProps {
	messages: ChatMessage[];
}

export function ChatTable(props: ChatTableProps) {
	const rows = props.messages.map((message, i) => {
		return (
			<tr key={i}>
				<td className="user">{message.user}</td>
				<td className="message">{message.message}</td>
				<td className="duration"><Duration duration={message.time}/>
				</td>
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
