// Var Firebase Functions
var functions = require('firebase-functions');
const admin = require('firebase-admin');

// Imports the Google Cloud client library
const {BigQuery} = require('@google-cloud/bigquery');

admin.initializeApp(functions.config().firebase);

// Intialise Firebase
const db = admin.database();

/**
 * Receive data from pubsub, then 
 * Write raw data to bigquery
 * Maintain last data on firebase realtime database
 */

exports.iotWeather = functions.pubsub
  .topic('iot-topic')
  .onPublish((message, context) => {
    const attributes = message.attributes;
    const payload = message.json;

    const deviceId = attributes['deviceId'];

    const data = {
      humidity: payload.hum,
      temp: payload.temp,
      deviceId: deviceId,
      timestamp: context.timestamp,
      free_ram: payload.free_ram,
      total_ram: payload.total_ram
    };

    if (
      payload.hum < 0 ||
      payload.hum > 100 ||
      payload.temp > 100 ||
      payload.temp < -50
    ) {
      // Validate and do nothing
        console.log("Wrong Temp or Humitidy value");
      return;
    }

    console.log("Updating Firebase & BigQuery Tables");

    return Promise.all([
      insertIntoBigquery(data),
      updateCurrentDataFirebase(data)
    ]);
  });

/** 
 * Maintain last status in firebase
*/
function updateCurrentDataFirebase(data) {
  return db.ref(`/devices/${data.deviceId}`).set({
    humidity: data.humidity,
    temp: data.temp,
    free_ram: data.free_ram,
    total_ram: data.total_ram,
    lastTimestamp: data.timestamp
  });
}

/**
 * Store all the raw data in bigquery
 */
function insertIntoBigquery(data) {

  // Create a client
  const bigqueryClient = new BigQuery();

  //Make use of a dataset
  const datasetId = 'weather_data';

  //Make use of a table
  const tableId = 'raw_data';

  // Insert into BigQuery
  return bigqueryClient
    .dataset(datasetId)
    .table(tableId)
    .insert(data)
    .catch(err => {
      if (err && err.name === 'PartialFailureError') {
          if (err.errors && err.errors.length > 0) {
              console.log('Insert errors:');
              err.errors.forEach(err => console.error(err));
          }
      } else {
          console.error('ERROR:', err);
      }
    });
}