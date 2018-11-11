const functions = require('firebase-functions');
const fetch = require('node-fetch');
const admin = require('firebase-admin');
const geolib = require('geolib');
const cors = require('cors')({origin: true});
admin.initializeApp();

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyA3WvtqcOacHZdoMkAieW_ly3IRAr7Vg8E',
    Promise: Promise
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.getNearestAirports = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        try {
            admin.database().ref(`${request.body.id}/data`)
                .once('value').then((snapshot) => {
                const data = snapshot.val();
                const newData = data.map(airport => {
                    const newAirport = Object.assign({}, airport);
                    newAirport.latitude = Number(airport.latitudeAirport);
                    newAirport.longitude = Number(airport.longitudeAirport);
                    return newAirport;
                });
                const nearestAirports = geolib.orderByDistance(request.body.location, newData);
                const finalList = [];
                for (let i = 0; i < 5; i++) {
                    finalList.push(nearestAirports[i]);
                }
                const promises = [];
                finalList.forEach(airport => promises.push(googleMapsClient.distanceMatrix({
                    origins: [request.body.location],
                    destinations: [airport]
                }).asPromise()));
                Promise.all(promises)
                    .then(results => {
                        const newData = [];
                        results.forEach((result, index) => {
                            const airport = Object.assign({},finalList[index]);
                            airport.distance = result.json.rows[0].elements[0].distance.text;
                            newData.push(airport);
                        });
                        response.status(200).send(newData);
                        admin.database().ref(`${request.body.id}`).set(null);
                    });
            });
        } catch (e) {
            response.status(500).send({error: e.message});
            admin.database().ref(`${request.body.id}`).set(null);
        }
    });
});

exports.OnShortNameAdded = functions.database.ref(`{id}/shortName`)
    .onWrite((change, context) => {
        console.log(change);
        const shortName = change.after.val();
        console.log(shortName);
        if (shortName)
            return fetch(`https://aviation-edge.com/v2/public/airportDatabase?key=07c4d4-82055c&codeIso2Country=${shortName}`)
                .then(res => res.json())
                .then(data => change.after.ref.parent.update({data}))
                .catch(error => console.log(error));
        else return 'ok';
    });
