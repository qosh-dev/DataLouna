let { parentPort } = require('worker_threads');
let axios = require('axios');
let path = require('path');

async function streamToJson(stream) {
  return new Promise((resolve, reject) => {
    let jsonString = '';
    stream.on('data', (chunk) => {
      jsonString += chunk;
    });

    stream.on('error', (err) => {
      reject(`Error reading the file: ${err.message}`);
    });

    stream.on('end', () => {
      try {
        const parsedJson = JSON.parse(jsonString);
        resolve(parsedJson);
      } catch (err) {
        reject(`Error parsing JSON: ${err.message}`);
      }
    });
  });
}

// ---------------------------------------------------------------------------------------------

async function fetchItems(app_id, currency, tradable) {
  const response = await axios.get('https://api.skinport.com/v1/items', {
    params: { app_id, currency, tradable },
    responseType: 'stream'
  });
  return response.data;
}

async function getItems(app_id, currency) {
  let tradableDataStream = [];
  let nonTradableDataStream = [];
  try {
    const resp = await Promise.all([
      fetchItems(app_id, currency, 0),
      fetchItems(app_id, currency, 1)
    ]);

    tradableData = resp[0];
    nonTradableData = resp[1];
  } catch (e) {
    if (e?.status === 429) {
      throw { statusCode: 429, message: 'Too many requests, try later' };
    }
    throw { statusCode: 400, message: 'Error on requests, try later' };
  }
  try {
    const [tradableData, nonTradableData] = await Promise.all([
      streamToJson(tradableDataStream),
      streamToJson(nonTradableDataStream)
    ]);
    return mergeItems(tradableData, nonTradableData);
  } catch (e) {
    throw { statusCode: 400, message: 'Error on requests, try later' };
  }
}

function mergeItems(tradableData, nonTradableData) {
  return tradableData.map((tradableItem, index) => {
    const nonTradableItem = nonTradableData[index];
    return {
      name: tradableItem.market_hash_name,
      min_prices: {
        tradable_price: tradableItem.min_price,
        non_tradable_price: nonTradableItem.min_price
      }
    };
  });
}

// ---------------------------------------------------------------------------------------------

async function bootstrap() {
  parentPort.on('message', async ({ app_id, currency }) => {
    let processedData = await getItems(app_id, currency);
    parentPort.postMessage(processedData);
  });
}

bootstrap();
