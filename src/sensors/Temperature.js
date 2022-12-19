import {Sensor} from "./Sensor";

export class Temperature extends Sensor {
	constructor(id, name, data){
		super(id, name, data);
		this._unite = '°C';
	}
}