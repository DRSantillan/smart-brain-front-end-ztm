import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

// Local Components ---------------------------------------- //
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

// CSS file imports ---------------------------------------- //
import './App.css';

// Global Variables ---------------------------------------- //
// Clarifai Data for accessing the API
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

// Smart Brain Application
class App extends Component {
	constructor() {
		super();
		// State for the whole application
		this.state = {
			input: '',
			imageUrl: '',
			box: {},
			route: 'signin',
			isSignedIn: false,
		};
	}

	// Functions ---------------------------------------- //
	calculateFaceLocation = (data) => {
		// Get the image to find out the dimensions for bounding box manipulation
		const inputImage = document.getElementById('inputImage');
		const imageWidth = Number(inputImage.width);
		const imageHeight = Number(inputImage.height);

		// return the calculations into an object to pass to the the state for updating.
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

	// Event Listeners ---------------------------------------- //
	// Listen for changes in the input text field and update the state once entered
	onInputChange = (event) => {
		let input = event.target.value;
		this.setState({ input });
	};

	// Detect Face Submit button
	onBtnSubmit = () => {
		// update the state of the imageurl
		this.setState({ imageUrl: this.state.input });

		// send a call to the api with the image for processing
		app.models
			.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
			.then((response) => {
				// store this returned data for processing later
				let boundingBox =
					response.outputs[0].data.regions[0].region_info
						.bounding_box;
				// Update the box state with the response object for display on the ui.
				this.updateBoxStateAndDisplay(
					this.calculateFaceLocation(boundingBox)
				);
			})
			.catch((err) => console.log(err));
	};

	// Route change function
	onRouteChange = (route) => {
		//check to see if the route is signed in or not and process accordingly
		if (route === 'signout') {
			this.setState({ isSignedIn: false });
		} else if (route === 'home') {
			this.setState({ isSignedIn: true });
		}
		this.setState({ route });
	};

	// Render the Application ---------------------------------------- //
	render() {
		// destructure state items to minimize the code
		const { isSignedIn, imageUrl, route, box } = this.state;

		return (
			<div className='App'>
				<Particles className='particles' params={particlesOptions} />
				<Navigation
					isSignedIn={isSignedIn}
					onRouteChange={this.onRouteChange}
				/>
				{route === 'home' ? (
					<>
						<Logo />
						<Rank />
						<ImageLinkForm
							onInputChange={this.onInputChange}
							onBtnSubmit={this.onBtnSubmit}
						/>
						<FaceRecognition box={box} imageUrl={imageUrl} />
					</>
				) : route === 'signin' ? (
					<SignIn onRouteChange={this.onRouteChange} />
				) : (
					<Register onRouteChange={this.onRouteChange} />
				)}
			</div>
		);
	}
}

export default App;
