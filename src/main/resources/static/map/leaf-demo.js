// See post: http://asmaloney.com/2014/01/code/creating-an-interactive-map-with-leaflet-and-openstreetmap/

var map = L.map( 'map', {
  center: [20.0, 5.0],
  minZoom: 8,
  zoom: 12
})

L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: ['a', 'b', 'c']
}).addTo( map )

var myURL = jQuery( 'script[src$="leaf-demo.js"]' ).attr( 'src' ).replace( 'leaf-demo.js', '' )

var myIcon = L.icon({
  iconUrl: myURL + 'images/delivery-truck-transito-rastreador.png',
  iconRetinaUrl: myURL + 'images/delivery-truck-transito-rastreador.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14]
})



for ( var i=0; i < markers.length; ++i )
{
 L.marker( [markers[i].numLatitUlt, markers[i].numLongiUlt], {icon: myIcon} )
  //.bindPopup( '<a href="' + markers[i].desPracaUlt + '" target="_blank">' + markers[i].codPlaca + '</a>' )
 .bindPopup(  markers[i].codPlaca 
		 		+'<p>'+ markers[i].codDispoRst 
		 		+'<p>'+ markers[i].desPracaUlt 
		 		+'<p>'+ markers[i].nomFants     )
  .addTo( map );
}
