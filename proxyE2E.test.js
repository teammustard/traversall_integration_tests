const puppeteer = require('puppeteer');

describe(
	'Proxy Integration/End-to-End Tests',
	() => {
		let page;
		let browser;
		beforeAll(async () => {
			jest.setTimeout(10000);

			browser = await puppeteer.launch({
				headless: false,
				devtools: false,
				slowMo: 100
			});
			page = await browser.newPage();

			page.emulate({
				viewport: {
					width: 1200,
					height: 900
				},
				userAgent: ''
			});

			await page.goto('http://52.15.92.43/tours/60/');
		});

		afterAll(() => {
			browser.close();
		});

		it('should load the page and tour name', async () => {
			await page.waitForSelector('.c-trip-detail-info-top__left h1');

			const tourName = await page.$eval('.c-trip-detail-info-top__left h1', (e) => e.innerHTML);
			expect(tourName).toBe('magna ac consequat');
		});

		it('should open calendar modal when clicked', async () => {
			await page.click('.soleil-cta-button-pink.c-trip-detail-info-middle__calendar-btn.prop-has-uplift');

			await page.waitForSelector('.modal-content');
			const calendarExists = !!await page.$('.ui-datepicker-calendar');
			expect(calendarExists).toBe(true);
		});

		it('should show updated trip price after a trip has been clicked', async () => {
			await page.click('.c-trip-detail-calendar-booking__calendar-span-p.pRed');
			const bookingPrice = await page.$eval(
				'.c-trip-detail-calendar-booking__details-accomodation-box-total-price.c-trip-detail-calendar-booking__details-accomodation-box-total-price-discounted',
				(e) => e.innerHTML
			);
			expect(bookingPrice).toBe('$2,639');
		});

		it('should exit modal if the close button is clicked', async () => {
			await page.click('.c-modal__header-close');
			const modalExists = !!await page.$('.modal-content');
			expect(modalExists).toBe(false);
		});

		it('should load the review component and review name', async () => {
			await page.waitForSelector('.mainBox');

			const tourName = await page.$eval('.mainBoxTitleTour', (e) => e.innerHTML);
			expect(tourName).toBe('Nullam');
		});
	},
	30000
);
