import {Sensor} from "./Sensor";

export class Door extends Sensor {
	constructor(id, name, data){
		super(id, name, data);
		this._unite = 'ouverte/fermée';
	}
}