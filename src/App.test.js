import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { ReactSensor } from "./ReactSensor";

function mockFetch() {
	global.fetch = jest.fn(() =>
		Promise.resolve({
			ok: true,
			json: () => Promise.resolve([{
				"id": 12,
				"name": "test",
				"type": "TEMPERATURE",
				"data": {
					"values": [23, 23, 22],
					"labels": [
						"2021-01-19T08:00:00.000Z",
						"2021-01-19T09:00:00.000Z",
						"2021-01-19T10:00:00.000Z"
					]
				}
			}]),
		})
	);
}

describe('ReactSensor tests', () => {
	test('ReactSensor with history', () => {
		let data = {value:1, values:[0,1,5,3,4], labels:['0','1','2','3','4']};
		render(<ReactSensor name='test' unite='°C' data={data} />);
		const elt = screen.getByText('5 °C');
		expect(elt).toBeInTheDocument();
	});
	
	test('ReactSensor with a different number of labels and values in history', () => {
		let data = {value:1, values:[0,1,2], labels:['0','1']};
		render(<ReactSensor unite='°C' data={data} />);
		expect(() => screen.getByText('0 °C')).toThrow();
	});

	test('ReactSensor with an icon as value', () => {
		render(<ReactSensor type='Door' unite='ouverte/fermée' data={{value:0}} />);
		expect(() => screen.getByAltText('../door_closed.jpeg')).not.toThrow();
	});
});

describe('App tests', () => {
	test('Links generated after loading a json file', async () => {
		render(<App />)
		mockFetch();
		const spy = jest.spyOn(global, 'fetch');

		userEvent.type(screen.getByTestId('input-json'), 'test.json')
		await waitFor(() => {
			expect(spy).toHaveBeenCalled();
		});
		const links = await screen.findAllByTestId('links');
		expect(links).toHaveLength(1);
		global.fetch.mockRestore();
	});

	test('Link is activated after clicking on it', async () => {
		render(<App />)
		mockFetch();
		jest.spyOn(global, 'fetch');

		userEvent.type(screen.getByTestId('input-json'), 'test.json')

		const link = await screen.findByTestId(/links/i);
		userEvent.click(link);
		expect(link.className).toContain("name-sensor-active");
		global.fetch.mockRestore();
	});
});