import { randomString } from './Data';

test('generate random', () => {
	expect(randomString()).toBeTruthy();
});
