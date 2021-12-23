import React, { Component } from 'react';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

class App extends Component {
	render() {
		return (
			<div className='App'>
				<Navigation />
				<Logo />
				<Rank />
				<ImageLinkForm />
				<FaceRecognition />
			</div>
		);
	}
}

export default App;
