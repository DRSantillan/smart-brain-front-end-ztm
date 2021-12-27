import React from 'react';
// CSS file imports ---------------------------------------- //
import './Navigation.css';

// Simple Component > No state (Pure Function)
const Navigation = ({ onRouteChange, isSignedIn }) => {
	// check to see if signed in and process accordingly
	if (isSignedIn) {
		return (
			<nav className='navigation'>
				<p
					onClick={() => onRouteChange('signin')}
					className='f3 link dim black underline pa3 pointer'
				>
					Sign Out
				</p>
			</nav>
		);
	} else {
		return (
			<nav className='navigation'>
				<p
					onClick={() => onRouteChange('signin')}
					className='f3 link dim black underline pa3 pointer'
				>
					Sign In
				</p>
				<p
					onClick={() => onRouteChange('register')}
					className='f3 link dim black underline pa3 pointer'
				>
					Register
				</p>
			</nav>
		);
	}
};

export default Navigation;
