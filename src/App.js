import './App.css';
import React from 'react';
import { createSensor } from './sensors/FctAux';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	NavLink
} from "react-router-dom";
import { ReactSensor } from './ReactSensor'

export class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sensors: []
		}
		this.getJSON = this.getJSON.bind(this);
	}

	async getJSON(name) {
		try {
			const jsonData = await fetch('../'+name)
				.then((response) => response.json());
			
			const sensors = [];
			for (let i = 0; i < jsonData.length; i++) {
				const sensor = createSensor(
					jsonData[i].id, jsonData[i].name, jsonData[i].type, jsonData[i].data);
				sensors.push(sensor);
			}
			this.setState( (state) => (Object.assign({}, state, {sensors : sensors}) ) );
		} catch (error) {}
	}

	render(){
		const links = this.state.sensors.map(sensor => {
			let name = sensor.name.toLowerCase().replaceAll(' ','_');
			return (<NavLink to={'/'+encodeURIComponent(name)}
				className={({ isActive }) =>'content-space name-sensor ' + (isActive ? 'name-sensor-active' : '')}
				key={sensor.id} data-testid='links'>{sensor.name}</NavLink>)
		});

		const routes = this.state.sensors.map(sensor => {
			let name = sensor.name.toLowerCase().replaceAll(' ','_');
			return (<Route key={sensor.id} path={'/'+encodeURIComponent(name)}
				element={<ReactSensor name={sensor.name} type={sensor.constructor.name} unite={sensor.unite} data={sensor.data} />} />)
		});

		return (
			<Router>
				<div className='flex-container column content-big-space'>
					<span className='content-space'>URL :</span>
					<input type='text' placeholder='sensors_data.json' data-testid='input-json'
						onChange={(e) => this.getJSON(e.target.value)} />
				</div>
				<div className='flex-container start'>
					<nav className='App flex-container column'>
						{links}
					</nav>

					<Routes>
						<Route path='/' element={<span></span>} />
						{routes}
					</Routes>
				</div>
			</Router>
		)
	}
}