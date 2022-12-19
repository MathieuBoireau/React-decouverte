import { getEnumSensorType, version, createSensor } from './sensors/FctAux';
import {Data} from './sensors/Data';
import {Datum} from './sensors/Datum';
import {TimeSeries} from './sensors/TimeSeries';
import {Sensor} from './sensors/Sensor';
import {Door} from './sensors/Door';
import {FanSpeed} from './sensors/FanSpeed';
import {Temperature} from './sensors/Temperature';

const fs = require('fs').promises;
let data;
beforeAll(async () => {
	data = await fs.readFile('./public/sensors_data.json', {
		encoding: 'utf8',
	});
	data = JSON.parse(data);
});

describe('Sensor model tests', () => {
	describe('Dummy tests', () => {
		test('data is loaded with 3 elements', () => {
			expect(data.length).toBe(3);
		});
		test('version number from the model', () => {
			expect(version()).toBe('1.0.0');
		});
	});

	describe('Enumeration tests', () => {
		test('Enumerable', () => {
			let myEnum = getEnumSensorType();
			let result = '';
			for(let sensor in myEnum){
				result += sensor+"\n";
			}
			let expected = 'TEMPERATURE\nHUMIDITY\nLIGHT\nSWITCH\nDOOR\nFAN_SPEED\n';
			expect(result).toEqual(expected);
		});
		test('Iterable', () => {
			let myEnum = getEnumSensorType();
			let result = '';
			for(let sensor of myEnum){
				result += sensor+"\n";
			}
			let expected = 'TEMPERATURE\nHUMIDITY\nLIGHT\nSWITCH\nDOOR\nFAN_SPEED\n';
			expect(result).toEqual(expected);
		});
	});

	describe('Data tests', () => {
		test('Data instantiated', () => {
			expect(() => new Data()).toThrow();
		});
	});

	describe('Datum tests', () => {
		test('Value not instantiated', () => {
			expect(() => new Datum()).toThrow();
		});

		test('Value not a number', () => {
			expect(() => new Datum('test')).toThrow();
		});

		test('Get value', () => {
			expect(new Datum(5).value).toBe(5);
		});

		test('Change value', () => {
			expect(() => new Datum(5).value = 6).toThrow();
		});

		test('toString', () => {
			expect(new Datum(5).toString()).toBe('5');
		});
	});

	describe('TimeSeries tests', () => {
		test('Values not instantiated', () => {
			expect(() => new TimeSeries()).toThrow();
		});

		test('Different sizes for values and labels', () => {
			expect(() => new TimeSeries([1,2],[1])).toThrow();
		});

		test('Value not a number', () => {
			expect(() => new TimeSeries([1,'2'],[1,2])).toThrow();
		});

		test('Get labels and values', () => {
			let expectedLabels = ['date1','date2','date3','date4', 'date5'];
			let expectedValues = [1,5,2,6,0];
			let timeSeries = new TimeSeries(
				expectedValues, expectedLabels
			);
			expect(timeSeries.labels).toEqual(expectedLabels);
			expect(timeSeries.values).toEqual(expectedValues);
		});

		test('toString', () => {
			let labels = ['date1','date2','date3','date4', 'date5'];
			let values = [1,5,2,6,0];
			let timeSeries = new TimeSeries(values, labels);
			let expected = 'date1 : 1\ndate2 : 5\ndate3 : 2\ndate4 : 6\ndate5 : 0\n';
			expect(timeSeries.toString()).toEqual(expected);
		});
	});

	describe('Sensors tests', () => {
		test('Id not a number', () => {
			expect(() => new Sensor('test')).toThrow();
		});
		test('Name not a string', () => {
			expect(() => new Sensor(1,[])).toThrow();
		});
		test('Data not of Data type', () => {
			expect(() => new Sensor(1,'test', 2)).toThrow();
		});
		test('Get id, name, type, data', () => {
			let sensor = new Sensor(12, 'Name, test', new Datum(5));
			let expected = '12 - Name, test - 5';
			expect(sensor.id+" - "+sensor.name+sensor.unite+' - '+sensor.data.value).toEqual(expected);
		});
		test('toString', () => {
			let sensor = new Sensor(12, 'Name, test', new Datum(5));
			let expected = '12 - Name, test\n5';
			expect(sensor.toString()).toEqual(expected);
		});
		test('Unite Temperature', () => {
			let sensor = new Temperature(12, 'Name, test', new Datum(5));
			expect(sensor.unite).toEqual('°C');
		});
		test('Unite Door', () => {
			let sensor = new Door(12, 'Name, test', new Datum(5));
			expect(sensor.unite).toEqual('ouverte/fermée');
		});
		test('Unite FanSpeed', () => {
			let sensor = new FanSpeed(12, 'Name, test', new Datum(5));
			expect(sensor.unite).toEqual('tr/min');
		});
		test('Create door sensor with value', () => {
			let sensor = createSensor(
				data[1].id, data[1].name, data[1].type, data[1].data);
			let expectedData = new Datum(data[1].data.value);
			let expectedSensor = new Door(data[1].id, data[1].name, expectedData);
			expect(sensor).toEqual(expectedSensor);
		});
		test('Create temperature sensor with values', () => {
			let sensor = createSensor(
				data[0].id, data[0].name, data[0].type, data[0].data);
			let expectedData = new TimeSeries(data[0].data.values, data[0].data.labels);
			let expectedSensor = new Temperature(data[0].id, data[0].name, expectedData);
			expect(sensor).toEqual(expectedSensor);
		});
		test('Create sensor without values', () => {
			expect(
				() => createSensor(data[0].id, data[0].name, data[0].type, [])
			).toThrow();
		});
		test('Create fan speed sensor', () => {
			let sensor = createSensor(
				data[2].id, data[2].name, data[2].type, data[2].data);
			let expectedData = new TimeSeries(data[2].data.values, data[2].data.labels);
			let expectedSensor = new FanSpeed(data[2].id, data[2].name, expectedData);
			expect(sensor).toEqual(expectedSensor);
		});
		test('Create sensor with a non-appropriate type', () => {
			expect(
				() => createSensor(data[0].id, data[0].name, 'test', data[0].data)
			).toThrow();
		});
	});
});
