import React, { Component } from 'react';
import Particles from 'react-particles-js';
//import Particles from 'react-tsparticles';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App({
	apiKey: '889a201a71cd40498bbe4ff050e39308',
});

// Particle Options object for React Particles
const particlesOptions = {
	particles: {
		number: {
			value: 50,
			density: {
				enable: true,
				value_area: 800,
			},
		},
		opacity: {
			value: 0.5,
		},
		shape: {
			type: 'circle',
		},
		size: {
			random: true,
			value: 5,
		},
	},
};

class App extends Component {
	constructor() {
		super();
		// State for the whole application
		this.state = {
			input: '',
		};
	}

	// Event Listeners
	// Listen for changes in the input text field and update the state once entered
	onInputChange = (event) => {
		let input = event.target.value;
		this.setState({ input });
	};

	// Detect Face Submit button
	onBtnSubmit = () => {
		console.log(this.state.input);

		app.models
			.predict(
				Clarifai.FACE_DETECT_MODEL,
				'https://samples.clarifai.com/face-det.jpg'
			)
			.then(
				function (response) {
					console.log(response);
				},
				function (err) {
					console.log(err);
				}
			);
	};

	// Render the Application
	render() {
		return (
			<div className='App'>
				<Particles className='particles' params={particlesOptions} />
				<Navigation />
				<Logo />
				<Rank />
				<ImageLinkForm
					onInputChange={this.onInputChange}
					onBtnSubmit={this.onBtnSubmit}
				/>
				<FaceRecognition />
			</div>
		);
	}
}

export default App;
