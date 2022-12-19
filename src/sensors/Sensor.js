import {Data} from "./Data"

export class Sensor {
	#id;
	#name;
	#data;
	_unite;

	constructor(id, name, data){
		if(id === undefined || typeof id !== 'number'){
			throw new Error('Id must be a number!');
		}
		if(name === undefined || typeof name !== 'string'){
			throw new Error('Name must be a string!');
		}
		if(!(data instanceof Data)){
			throw new Error("The data of sensor must be of Data type!");
		}
		this.#id = id;
		this.#name = name;
		this.#data = data;
		this._unite = '';
	}

	get id(){
		return this.#id;
	}

	get name(){
		return this.#name;
	}

	get data(){
		return this.#data;
	}

	get unite(){
		return this._unite;
	}

	set unite(newUnite){}

	toString(){
		return this.#id+" - "+this.#name+"\n"+this.#data;
	}
}