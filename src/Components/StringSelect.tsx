import * as React from 'react';
import Select from "react-select";
import {Props} from "react-select/lib/Select";

export interface StringOptionType {
	value: string;
	label: string;
}

class StringTypeSelect extends Select<StringOptionType | string> {

}

export interface StringSelectProps extends Props<StringOptionType | string> {
	onChange: (value: string) => void;
	value: string;
	options: string[];
}

export function StringSelect({options, value, onChange, ...props}: StringSelectProps) {
	return <StringTypeSelect
		options={options.map(option => {
			return {
				value: option,
				label: option
			}
		})}
		value={value ? {value: value, label: value} : null}
		onChange={(option: StringOptionType) => onChange(option ? option.value : '')}
		placeholder={props.placeholder}
		{...props}
	/>;
}
