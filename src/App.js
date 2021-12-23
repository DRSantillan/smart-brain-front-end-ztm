import React, { Component } from 'react';
import Particles from 'react-particles-js';
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
			imageUrl: '',
			box: {},
		};
	}

	// Functions
	calculateFaceLocation = (data) => {
		console.log(data);

		// Get the image to find out the dimensions for bounding box manipulation
		const inputImage = document.getElementById('inputImage');
		const imageWidth = Number(inputImage.width);
		const imageHeight = Number(inputImage.height);
		console.log(imageHeight, imageWidth);

		return {
			left_col: data.left_col * imageWidth,
			top_row: data.top_row * imageHeight,
			right_col: imageWidth - data.right_col * imageWidth,
			bottom_row: imageHeight - data.bottom_row * imageHeight,
		};
	};

	// set state of bounding box and display
	updateBoxStateAndDisplay = (box) => {
		this.setState({ box });
	};
	// Event Listeners
	// Listen for changes in the input text field and update the state once entered
	onInputChange = (event) => {
		let input = event.target.value;
		this.setState({ input });
	};

	// Detect Face Submit button
	onBtnSubmit = () => {
		console.log(this.state.input);
		this.setState({ imageUrl: this.state.input });

		app.models
			.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
			.then((response) => {
				let boundingBox =
					response.outputs[0].data.regions[0].region_info
						.bounding_box;
				console.log(boundingBox);
				this.updateBoxStateAndDisplay(
					this.calculateFaceLocation(boundingBox)
				);
			})
			.catch((err) => console.log(err));
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
				<FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
			</div>
		);
	}
}

export default App;
