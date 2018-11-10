(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{108:function(e,t,a){"use strict";a.r(t);var n=a(0),o=a.n(n),r=a(7),i=a.n(r),s=(a(43),a(45),a(27)),c=a(28),l=a(36),d=a(29),u=a(37),m=a(30),p=a.n(m),g=a(31),h=a(32),f=a(9),y=a(10),E=a.n(y),v=a(8),S=(a(90),a(33)),b=a.n(S),L=a(34),A=a.n(L).a.initializeApp({apiKey:"AIzaSyCh_v8Ug7VwpJGJBrZyMJqnO8pbyp9RAY4",authDomain:"airports-222008.firebaseapp.com",databaseURL:"https://airports-222008.firebaseio.com",projectId:"airports-222008",storageBucket:"airports-222008.appspot.com",messagingSenderId:"522583867627"}),k=a(35),w=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(l.a)(this,Object(d.a)(t).call(this,e))).onSelect=function(e){Object(y.geocodeByAddress)(e).then(function(e){return a.setState({address:e[0].formatted_address}),a.id=e[0].place_id,e[0].address_components.forEach(function(e){"country"===e.types[0]&&A.database().ref(a.id).set({shortName:e.short_name}).then(function(e){return console.log(e)}).catch(function(e){return console.log(e)})}),Object(y.getLatLng)(e[0])}).then(function(e){return a.setState({latLng:e,zoom:5,isAddressSelected:!0})}).catch(function(e){return console.log(e)})},a.findNearest=function(e){a.state.isAddressSelected?(e.preventDefault(),a.setState({loading:!0}),fetch("https://us-central1-airports-222008.cloudfunctions.net/getNearestAirports",{method:"POST",mode:"cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:a.id,location:{latitude:Number(a.state.cityLat),longitude:Number(a.state.cityLong)}})}).then(function(e){return e.json()}).then(function(e){a.setState({loading:!1,airports:e,address:"",cityLat:"",cityLong:"",isAddressSelected:!1}),a.markers.forEach(function(e){e.setMap(null)}),a.markers.length=0,e.forEach(function(e){a.markers.push(new a.mainMap.Marker({title:e.nameAirport,map:a.map,position:{lat:e.latitude,lng:e.longitude},animation:a.mainMap.Animation.DROP}))})}).catch(function(e){a.setState({loading:!1,address:"",cityLat:"",cityLong:"",isAddressSelected:!1})})):a.setState({showSnack:!0})},a.state={latLng:{lat:0,lng:0},address:"",zoom:5,cityLat:"",cityLong:"",airports:[],loading:!1,isAddressSelected:!1,showSnack:!1},a.markers=[],a}return Object(u.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this,t=this.state,a=t.cityLat,n=t.cityLong;return""!==a&&""!==n&&this.marker.setPosition({lat:Number(a),lng:Number(n)}),o.a.createElement("div",{className:"app-container"},o.a.createElement(k.Snackbar,{show:this.state.showSnack,onHide:function(t){return e.setState({showSnack:!1})},message:"Select the country from the list",timeout:3e3,dismissesOnAction:!1}),o.a.createElement("div",{className:"input-container"},o.a.createElement(g.Typography,{className:"title",use:"headline4"},"Nearest Airports"),o.a.createElement(h.Card,{className:"input-card"},o.a.createElement("div",null,o.a.createElement(E.a,{value:this.state.address,onChange:function(t){return e.setState({address:t})},onSelect:this.onSelect},function(e){var t=e.getInputProps,a=e.suggestions,n=e.getSuggestionItemProps,r=e.loading;return o.a.createElement("div",null,o.a.createElement(f.TextField,Object.assign({outlined:!0},t({placeholder:"Enter Country Name",className:"location-search-input"}))),o.a.createElement("div",{className:"autocomplete-dropdown-container"},r&&o.a.createElement("div",null,"Loading..."),a.map(function(e){var t=e.active?"suggestion-item--active":"suggestion-item",a=e.active?{backgroundColor:"#fafafa",cursor:"pointer"}:{backgroundColor:"#ffffff",cursor:"pointer"};return o.a.createElement("div",n(e,{className:t,style:a}),o.a.createElement("span",null,e.description))})))})),o.a.createElement("div",{className:"lat-lng-input"},o.a.createElement(f.TextField,{value:this.state.cityLat,onChange:function(t){return e.setState({cityLat:t.target.value})},outlined:!0,label:"Latitude of City"}),o.a.createElement(f.TextField,{value:this.state.cityLong,onChange:function(t){return e.setState({cityLong:t.target.value})},style:{marginLeft:"5%"},outlined:!0,label:"Longitude of City"}),o.a.createElement(v.Button,{disabled:this.state.loading,onClick:this.findNearest,style:{marginLeft:"5%"},raised:!0},"Find"))),o.a.createElement("table",null,o.a.createElement("thead",null,o.a.createElement("tr",null,o.a.createElement("th",null,"Name"),o.a.createElement("th",null,"City"),o.a.createElement("th",null,"IATA"),o.a.createElement("th",null,"ICAO"),o.a.createElement("th",null,"Location"),o.a.createElement("th",null,"Airport Distance"))),o.a.createElement("tbody",null,this.state.loading?o.a.createElement(b.a,{type:"spin",color:"#000000"}):this.state.airports.map(function(e){return o.a.createElement("tr",null,o.a.createElement("td",null,e.nameAirport),o.a.createElement("td",null,e.codeIataCity),o.a.createElement("td",null,e.codeIataAirport),o.a.createElement("td",null,e.codeIcaoAirport),o.a.createElement("td",null,"".concat(e.latitude,", ").concat(e.longitude)),o.a.createElement("td",null,"".concat(e.distance/1e3," KM")))})))),o.a.createElement("div",{className:"map-container"},o.a.createElement(p.a,{bootstrapURLKeys:{key:"AIzaSyA3WvtqcOacHZdoMkAieW_ly3IRAr7Vg8E"},resetBoundsOnResize:!0,defaultCenter:{lat:0,lng:0},defaultZoom:5,zoom:this.state.zoom,center:this.state.latLng,onGoogleApiLoaded:function(t){var a=t.map,n=t.maps;e.mainMap=n,e.map=a,e.marker=new n.Marker({title:"Selected City",map:a,zoom:2,animation:n.Animation.DROP})}})))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(o.a.createElement(w,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},38:function(e,t,a){e.exports=a(108)},45:function(e,t,a){},90:function(e,t,a){}},[[38,2,1]]]);
//# sourceMappingURL=main.b9c51617.chunk.js.map