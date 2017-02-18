import * as React from 'react';

export interface LoginButtonProps {
	loginHandler: Function;
}

export function LoginButton(props: LoginButtonProps) {
	const click = (e) => {
		e.preventDefault();
		props.loginHandler();
	};
	return (
		<a className="pure-menu-link steam-login"
		   onClick={click}>
			Sign in through Steam
		</a>
	);
}
