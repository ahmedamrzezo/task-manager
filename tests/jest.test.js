const calcTip = (total, tipPercent) => {
	const tip = total * (tipPercent / 100);
	return total + tip;
};

test('Should calculate total with tip', () => {
	expect(calcTip(10, 20)).toEqual(12);
});

const fhToCl = (temp) => (temp - 32) / 1.8;

const clToFh = (temp) => (temp * 1.8) + 32;

test('should convert 32 F to 0 C', () => {
	expect(fhToCl(32)).toEqual(0);
});

test('should convert 0 C to 32 F', () => {
	expect(clToFh(0)).toEqual(32);
});

