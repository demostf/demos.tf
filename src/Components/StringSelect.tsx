import * as React from 'react';
import Select, {StylesConfig} from "react-select";

export interface StringOptionType {
	value: string;
	label: string;
}

class StringTypeSelect extends Select<StringOptionType> {

}

export interface StringSelectProps {
	onChange: (value: string) => void;
	value: string;
	options: string[];
	className?: string;
	placeholder?: string;
	isClearable?: boolean;
	isSearchable?: boolean;
	styles?: StylesConfig
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
