import * as React from 'react';
import Select, {StylesConfig, SelectInstance} from "react-select";

export interface StringOptionType {
	value: string;
	label: string;
}

export interface StringSelectProps {
	onChange: (value: string) => void;
	value: string;
	options: string[];
	className?: string;
	placeholder?: string;
	isClearable?: boolean;
	isSearchable?: boolean;
	styles?: StylesConfig<StringOptionType, false>
}

export function StringSelect({options, value, onChange, ...props}: StringSelectProps) {
	return <Select
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
