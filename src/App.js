import React, {Component} from 'react';
import GoogleMap from 'google-map-react';
import {Typography} from '@rmwc/typography';
import {Card} from '@rmwc/card';
import {TextField} from '@rmwc/textfield';
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from 'react-places-autocomplete';
import {Button} from '@rmwc/button';
import './App.css';
import ReactLoading from 'react-loading';
import firebase from './firebase';
import {Snackbar} from '@rmwc/snackbar';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            latLng: {lat: 0, lng: 0},
            address: '',
            zoom: 5,
            cityLocation: {},
            city: '',
            airports: [],
            loading: false,
            isAddressSelected: false,
            isCitySelected: false,
            showSnack: false
        }
        this.markers = [];
    }

    onCitySelected = (city) => {
        geocodeByAddress(city)
            .then(results => {
                this.setState({
                    city: results[0].formatted_address
                });
                return getLatLng(results[0])
            })
            .then(latLng => this.setState({cityLocation: latLng, isCitySelected: true}))
            .catch(error => console.log(error));
    };

    onSelect = (address) => {
        geocodeByAddress(address)
            .then(results => {
                this.setState({
                    address: results[0].formatted_address
                });
                this.id = results[0].place_id;
                const addresses = results[0].address_components;
                addresses.forEach(address => {
                    if (address.types[0] === 'country') {
                        firebase.database().ref(this.id).set({shortName: address.short_name})
                            .then(value => console.log(value))
                            .catch(error => console.log(error));
                    }
                });
                return getLatLng(results[0])
            })
            .then(latLng => this.setState({latLng, zoom: 5, isAddressSelected: true}))
            .catch(error => console.log(error));
    };

    findNearest = (event) => {
        if (this.state.isAddressSelected && this.state.isCitySelected) {
            event.preventDefault();
            this.setState({loading: true});
            fetch('https://us-central1-airports-222008.cloudfunctions.net/getNearestAirports', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: this.id,
                    location: {
                        latitude: Number(this.state.cityLocation.lat),
                        longitude: Number(this.state.cityLocation.lng)
                    }
                })
            }).then(res => res.json())
                .then(data => {
                    this.setState({
                        loading: false,
                        airports: data,
                        address: '',
                        cityLocation: {},
                        city: '',
                        isCitySelected: false,
                        isAddressSelected: false
                    });
                    this.markers.forEach(marker => {
                        marker.setMap(null);
                    });
                    this.markers.length = 0;
                    data.forEach(airport => {
                        this.markers.push(new this.mainMap.Marker({
                            title: airport.nameAirport,
                            map: this.map,
                            position: {lat: airport.latitude, lng: airport.longitude},
                            animation: this.mainMap.Animation.DROP
                        }));
                    })
                })
                .catch(error => {
                    this.setState({
                        loading: false,
                        address: '',
                        cityLocation: {},
                        city: '',
                        isCitySelected: false,
                        isAddressSelected: false
                    });
                });
        } else {
            this.setState({
                showSnack: true
            });
        }
    };

    render() {
        if (this.state.isCitySelected)
            this.marker.setPosition(this.state.cityLocation);
        return (
            <div className={'app-container'}>
                <Snackbar
                    show={this.state.showSnack}
                    onHide={evt => this.setState({showSnack: false})}
                    message="Select the country from the list"
                    timeout={3000}
                    dismissesOnAction={false}
                />
                <div className={'input-container'}>
                    <Typography className={'title'} use={'headline4'}>Nearest Airports</Typography>
                    <Card className={'input-card'}>
                        <div>
                            <PlacesAutocomplete
                                value={this.state.address}
                                onChange={(address) => this.setState({address})}
                                onSelect={this.onSelect}>
                                {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                                    <div>
                                        <TextField
                                            outlined
                                            {...getInputProps({
                                                placeholder: 'Enter Country Name',
                                                className: 'location-search-input',
                                            })}
                                        />
                                        <div className="autocomplete-dropdown-container">
                                            {loading && <div>Loading...</div>}
                                            {suggestions.map(suggestion => {
                                                const className = suggestion.active
                                                    ? 'suggestion-item--active'
                                                    : 'suggestion-item';
                                                // inline style for demonstration purpose
                                                const style = suggestion.active
                                                    ? {backgroundColor: '#fafafa', cursor: 'pointer'}
                                                    : {backgroundColor: '#ffffff', cursor: 'pointer'};
                                                return (
                                                    <div
                                                        {...getSuggestionItemProps(suggestion, {
                                                            className,
                                                            style,
                                                        })}
                                                    >
                                                        <span>{suggestion.description}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </PlacesAutocomplete>
                        </div>
                        <div className={'lat-lng-input'}>
                            <PlacesAutocomplete
                                value={this.state.city}
                                onChange={(city) => this.setState({city})}
                                onSelect={this.onCitySelected}>
                                {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                                    <div>
                                        <TextField
                                            outlined
                                            {...getInputProps({
                                                placeholder: 'Enter City Name',
                                                className: 'location-search-input',
                                            })}
                                        />
                                        <div className="autocomplete-dropdown-container">
                                            {loading && <div>Loading...</div>}
                                            {suggestions.map(suggestion => {
                                                const className = suggestion.active
                                                    ? 'suggestion-item--active'
                                                    : 'suggestion-item';
                                                // inline style for demonstration purpose
                                                const style = suggestion.active
                                                    ? {backgroundColor: '#fafafa', cursor: 'pointer'}
                                                    : {backgroundColor: '#ffffff', cursor: 'pointer'};
                                                return (
                                                    <div
                                                        {...getSuggestionItemProps(suggestion, {
                                                            className,
                                                            style,
                                                        })}
                                                    >
                                                        <span>{suggestion.description}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </PlacesAutocomplete>
                            <Button disabled={this.state.loading} onClick={this.findNearest} style={{marginLeft: '5%'}}
                                    raised>Find</Button>
                        </div>
                    </Card>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>City</th>
                            <th>IATA</th>
                            <th>ICAO</th>
                            <th>Location</th>
                            <th>Airport Distance</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.loading ? <ReactLoading type={'spin'} color={'#000000'}/> :
                            this.state.airports.map(airport => {
                                return <tr key={airport.key}>
                                    <td>{airport.nameAirport}</td>
                                    <td>{airport.codeIataCity}</td>
                                    <td>{airport.codeIataAirport}</td>
                                    <td>{airport.codeIcaoAirport}</td>
                                    <td>{`${airport.latitude}, ${airport.longitude}`}</td>
                                    <td>{`${airport.distance}`}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
                <div className={'map-container'}>
                    <GoogleMap
                        bootstrapURLKeys={{
                            key: 'AIzaSyA3WvtqcOacHZdoMkAieW_ly3IRAr7Vg8E'
                        }}
                        resetBoundsOnResize={true}
                        defaultCenter={{lat: 0, lng: 0}}
                        defaultZoom={5}
                        zoom={this.state.zoom}
                        center={this.state.latLng}
                        onGoogleApiLoaded={({map, maps}) => {
                            this.mainMap = maps;
                            this.map = map;
                            this.marker = new maps.Marker({
                                title: 'Selected City',
                                map: map,
                                zoom: 2,
                                animation: maps.Animation.DROP
                            });
                        }}/>
                </div>
            </div>
        );
    }
}

export default App;
