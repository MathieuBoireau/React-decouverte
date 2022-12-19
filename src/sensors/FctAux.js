import {Datum} from "./Datum"
import {TimeSeries} from "./TimeSeries"
import {Temperature} from "./Temperature"
import {Door} from "./Door"
import {FanSpeed} from "./FanSpeed";

export const version = () => '1.0.0';

const Enumeration = function (keys) {
	const enumeration = Object.create(null);
	for (const key of keys) {
		enumeration[key] = key;
	}
	enumeration[Symbol.iterator] = function* () {
		for (const key of keys) {
			yield enumeration[key];
		}
	};
	Object.freeze(enumeration);
	return enumeration;
};

export const getEnumSensorType = function () {
	return new Enumeration([
		'TEMPERATURE','HUMIDITY','LIGHT',
		'SWITCH','DOOR', 'FAN_SPEED'
	]);
};

export const createSensor = (id, name, type, data) => {
	let dataObj;
	if(data.value !== undefined){
		dataObj = new Datum(data.value);
	} else {
		if(data.values !== undefined && data.labels !== undefined){
			dataObj = new TimeSeries(data.values, data.labels);
		} else {
			throw new Error('Data is not well-formed!');
		}
	}

	let sensor;
	switch (type) {
		case 'TEMPERATURE':
			sensor = new Temperature(id,name,dataObj);
			break;
		case 'DOOR':
			sensor = new Door(id,name,dataObj);
			break;
		case 'FAN_SPEED':
			sensor = new FanSpeed(id,name,dataObj);
			break;
		default:
			throw new Error('The type '+type+' is not implemented as a sensor.');
	}
	return sensor;
};