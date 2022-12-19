import {Sensor} from "./Sensor";

export class FanSpeed extends Sensor {
	constructor(id, name, data){
		super(id, name, data);
		this._unite = 'tr/min';
	}
}