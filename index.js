const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();

    for (let i = 19; i < 35; i++) {

        // i already know that there are 18 cars per page and that there are more than 35 available pages. this code is not error-proof;
        // it's just a quick and dirty scraper

        await page.goto(`https://www.edmunds.com/inventory/srp.html?inventorytype=used%2Ccpo&make=toyota&model=rav4&pagenumber=${i}`);

        // generate random number

        let randomNumber = Math.round(Math.random() * 18);

        console.log(randomNumber);

        // click on the randomNumber vehicle

        await page.evaluate(x => {
            document.querySelectorAll(".visible-vehicle-info .usurp-inventory-card-vdp-link")[x].click();
            return;
        }, randomNumber);


        // await for the page navigation

        await page.waitForNavigation();


        // get car details

        // carNum

        let carNum = await page.evaluate(() => {
            return document.querySelector(".mr-1").textContent.replace("VIN: ", "");
        });

        console.log(carNum);

        // make

        let make = "Toyota";

        // model

        let model = "RAV4";

        // price

        let price = await page.evaluate(() => {
            return document.querySelector('body > div.venom-app > div > main > div > div.pb-md-3_25 > div.vdp-content-wrapper.container > div > div.p-0.col-12.col-md-5.offset-md-0.col-lg-4.col-xl-4 > div > div > div > div > div > div.price-summary-section.align-items-baseline.pt-0_75.row > div:nth-child(1) > div > span').textContent.replace("$", "").replace(/,/g, "");
        });

        // color

        let color = await page.evaluate(() => {
            return document.querySelector("body > div.venom-app > div > main > div > div.pb-md-3_25 > div.vdp-content-wrapper.container > div > div.mt-md-1.pr-xl-2.col-12.col-md-7.offset-md-0.col-lg-8 > div:nth-child(4) > div.row > div > section.vehicle-summary.text-gray-darker > div > div:nth-child(1) > div:nth-child(2) > div.col > span").textContent.replace("Ext: ", "");
        });

        // year; note: assuming that the year is always the leading value in the title

        let year = await page.evaluate(() => {
            return document.querySelector("body > div.venom-app > div > main > div > div.pb-md-3_25 > div.vdp-content-wrapper.container > div > div.mt-md-1.pr-xl-2.col-12.col-md-7.offset-md-0.col-lg-8 > div.vdp-group.mb-2 > section > h1").textContent.slice(0, 4);
        });

        // miles

        let miles = await page.evaluate(() => {
            return document.querySelector("body > div.venom-app > div > main > div > div.pb-md-3_25 > div.vdp-content-wrapper.container > div > div.mt-md-1.pr-xl-2.col-12.col-md-7.offset-md-0.col-lg-8 > div:nth-child(4) > div.row > div > section.vehicle-summary.text-gray-darker > div > div:nth-child(1) > div:nth-child(1) > div.col").textContent.replace(" Miles", "").replace(" miles", "").replace(/,/g, "");
        });

        // drive

        let drive = await page.evaluate(() => {
            return document.querySelector("body > div.venom-app > div > main > div > div.pb-md-3_25 > div.vdp-content-wrapper.container > div > div.mt-md-1.pr-xl-2.col-12.col-md-7.offset-md-0.col-lg-8 > div:nth-child(4) > div.row > div > section.vehicle-summary.text-gray-darker > div > div:nth-child(2) > div:nth-child(1) > div.col").textContent;
        });

        let cityMpg;
        let hwyMpg;

        try {
            // cityMpg

            cityMpg = await page.evaluate(() => {
                return document.querySelector("body > div.venom-app > div > main > div > div.pb-md-3_25 > div.vdp-content-wrapper.container > div > div.mt-md-1.pr-xl-2.col-12.col-md-7.offset-md-0.col-lg-8 > div:nth-child(4) > div.row > div > section.vehicle-summary.text-gray-darker > div > div:nth-child(2) > div:nth-child(3) > div.col").textContent.split(" / ")[0].replace(" City", "").replace(" city", "");
            });

            // hwyMpg

            hwyMpg = await page.evaluate(() => {
                return document.querySelector("body > div.venom-app > div > main > div > div.pb-md-3_25 > div.vdp-content-wrapper.container > div > div.mt-md-1.pr-xl-2.col-12.col-md-7.offset-md-0.col-lg-8 > div:nth-child(4) > div.row > div > section.vehicle-summary.text-gray-darker > div > div:nth-child(2) > div:nth-child(3) > div.col").textContent.split(" / ")[1].replace(" Hwy", "").replace(" hwy", "");
            });
        }

        catch {
            // cityMpg

            cityMpg = await page.evaluate(() => {
                return document.querySelector("body > div.venom-app > div > main > div > div.pb-md-3_25 > div.vdp-content-wrapper.container > div > div.mt-md-1.pr-xl-2.col-12.col-md-7.offset-md-0.col-lg-8 > div:nth-child(4) > div.row > div > section.vehicle-summary.text-gray-darker > div > div:nth-child(2) > div:nth-child(4) > div.col").textContent.split(" / ")[0].replace(" City", "").replace(" city", "");
            });

            // hwyMpg

            hwyMpg = await page.evaluate(() => {
                return document.querySelector("body > div.venom-app > div > main > div > div.pb-md-3_25 > div.vdp-content-wrapper.container > div > div.mt-md-1.pr-xl-2.col-12.col-md-7.offset-md-0.col-lg-8 > div:nth-child(4) > div.row > div > section.vehicle-summary.text-gray-darker > div > div:nth-child(2) > div:nth-child(4) > div.col").textContent.split(" / ")[1].replace(" Hwy", "").replace(" hwy", "");
            });

        }


        // transmission

        let transmission = await page.evaluate(() => {
            return document.querySelector("body > div.venom-app > div > main > div > div.pb-md-3_25 > div.vdp-content-wrapper.container > div > div.mt-md-1.pr-xl-2.col-12.col-md-7.offset-md-0.col-lg-8 > div:nth-child(4) > div.row > div > section.vehicle-summary.text-gray-darker > div > div:nth-child(1) > div:nth-child(4) > div.col").textContent;
        });

        // write all of that stuff to file

        fs.appendFileSync('./data.csv', `${carNum},${make},${model},${price},${color},${year},${miles},${drive},${cityMpg},${hwyMpg},${transmission}\n`);
    }




    await browser.close();
})();