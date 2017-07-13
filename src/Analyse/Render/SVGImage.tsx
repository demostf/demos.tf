import * as React from "react";
import {SVGProps} from "react";

export interface ImageProps extends SVGProps<SVGImageElement> {
	href: string;
}

export function SVGImage(props: ImageProps) {
	return <image {...props}/>
}
