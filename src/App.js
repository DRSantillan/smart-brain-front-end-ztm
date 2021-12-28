import React, { Component } from 'react';
import Particles from 'react-particles-js';

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
const initialState = {
	input: '',
	imageUrl: '',
	box: {},
	route: 'signin',
	isSignedIn: false,
	user: {
		id: '',
		name: '',
		email: '',
		entries: '',
		joined: '',
	},
};
// Smart Brain Application
class App extends Component {
	constructor() {
		super();
		// State for the whole application
		this.state = initialState;
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
	loadUser = (user) => {
		this.setState({
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				entries: user.entries,
				joined: user.joined,
			},
		});
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

		fetch('http://localhost:8000/imageurl', {
			method: 'post',
			headers: {'Content-type': 'application/json'},
			body: JSON.stringify({
				input: this.state.input
			})
		})
		.then(response => response.json())
			.then((response) => {
				// store this returned data for processing later
				let boundingBox =
					response.outputs[0].data.regions[0].region_info
						.bounding_box;

				fetch('http://localhost:8000/image', {
					method: 'put',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id: this.state.user.id }),
				})
					.then((response) => response.json())
					.then((user) => {
						this.setState(
							Object.assign(this.state.user, {
								entries: user.entries,
							})
						);
					}).catch(console.log)
				// Update the box state with the response object for display on the ui.
				this.updateBoxStateAndDisplay(
					this.calculateFaceLocation(boundingBox)
				);
			})
			.catch((err) => console.log(err));
	};

	// Route change function
	onRouteChange = (route) => {
		console.log(route ,  'route')
		//check to see if the route is signed in or not and process accordingly
		if (route === 'signout') {
			this.setState(initialState);
		} else if (route === 'home') {
			this.setState({ isSignedIn: true });
		}
		this.setState({ route });
	};

	// Render the Application ---------------------------------------- //
	render() {
		// destructure state items to minimize the code
		const { isSignedIn, imageUrl, route, box } = this.state;
		console.log(isSignedIn, ' inside render')
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
						<Rank
							name={this.state.user.name}
							entries={this.state.user.entries}
						/>
						<ImageLinkForm
							onInputChange={this.onInputChange}
							onBtnSubmit={this.onBtnSubmit}
						/>
						<FaceRecognition box={box} imageUrl={imageUrl} />
					</>
				) : route === 'signin' ? (
					<SignIn
						loadUser={this.loadUser}
						onRouteChange={this.onRouteChange}
					/>
				) : (
					<Register
						loadUser={this.loadUser}
						onRouteChange={this.onRouteChange}
					/>
				)}
			</div>
		);
	}
}

export default App;
