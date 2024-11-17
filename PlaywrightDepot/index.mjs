import { chromium } from 'playwright';
import express from 'express';

const app = express();
const port = 3000;

app.get('/find/:item', async (req, res) => {
  const item = req.params.item;
  const url = `https://www.homedepot.ca/search?q=${item}`;

  const browser = await chromium.launch({ 
    headless: false, 
    args: [
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });

  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
  });

  await page.goto(url);
  await page.waitForLoadState('networkidle');

  const articles = await page.locator('article').all();
  let articlesArray = [];
  if (articles.length > 0) {
    for (const articleData of articles) {
      const noPrice = await articleData.locator('.acl-product-card__price-none').all();
      if (noPrice.length > 0) {
        continue;
      }
      
      const image = await articleData.locator('img').evaluate(img => img.getAttribute('src'));
      const title = await articleData.locator('.acl-product-card__title').textContent();
      const originalDolars = await articleData.locator('.acl-product-card__price-dollars').textContent();
      const priceDolars = originalDolars.substring(1, originalDolars.indexOf("And"));
      const originalCents = await articleData.locator('.acl-product-card__price-cents').textContent();
      const priceCents = originalCents.split(' ').at(0);
      const originalUnit = await articleData.locator('.acl-product-card__price-unit').textContent();
      const unit = originalUnit.trim();
      const existingReviews = await articleData.locator('.acl-rating__reviews').all();
      let reviewsCounts = '';
      if (existingReviews.length > 0) {
        reviewsCounts = await articleData.locator('.acl-rating__reviews').textContent();
      }
      const existingStarts = await articleData.locator('.acl-rating__link').all();
      let starts = '';
      if (existingStarts.length > 0) {
        const originalStarts = await articleData.locator('.acl-rating__link').evaluate(start => start.getAttribute('aria-label'));
        starts = originalStarts.split(' ').at(3);
      }
      
      articlesArray.push({
        image,
        title,
        priceDolars,
        priceCents,
        unit,
        reviewsCounts,
        starts
      });
    }
  }

  await browser.close();
  res.send(JSON.stringify(articlesArray));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});