Ext.namespace('Ext.ux.panel');

Ext.ux.GMapPanel = Ext.extend(Ext.Panel, {
    /**
     * @cfg {Boolean} border
     * Defaults to <tt>false</tt>.  See {@link Ext.Panel}.<code>{@link Ext.Panel#border border}</code>.
     */
    border: false,

    /**
     * @cfg {Array} respErrors
     * An array of msg/code pairs.
     */
    respErrors: [{
            code: 'UNKNOWN_ERROR',
            msg: 'A geocoding or directions request could not be successfully processed, yet the exact reason for the failure is not known.' 
        },{
            code: 'ERROR',
            msg: 'There was a problem contacting the Google servers.'
        },{
            code: 'ZERO_RESULTS',
            msg: 'The request did not encounter any errors but returns zero results.'
        },{
            code: 'INVALID_REQUEST',
            msg: 'This request was invalid.' 
        },{
            code: 'REQUEST_DENIED',
            msg: 'The webpage is not allowed to use the geocoder for some reason.' 
        },{
            code: 'OVER_QUERY_LIMIT',
            msg: 'The webpage has gone over the requests limit in too short a period of time.' 
    }],
    /**
     * @cfg {String} respErrorTitle
     * Defaults to <tt>'Error'</tt>.
     */
    respErrorTitle : 'Error',
    /**
     * @cfg {String} geoErrorMsgUnable
     * Defaults to <tt>'Unable to Locate the Address you provided'</tt>.
     */
    geoErrorMsgUnable : 'Unable to Locate the Address you provided',
    /**
     * @cfg {String} geoErrorTitle
     * Defaults to <tt>'Address Location Error'</tt>.
     */
    geoErrorTitle : 'Address Location Error',
    /**
     * @cfg {String} geoErrorMsgAccuracy
     * Defaults to <tt>'The address provided has a low accuracy.<br><br>Level {0} Accuracy (8 = Exact Match, 1 = Vague Match)'</tt>.
     */
    geoErrorMsgAccuracy : 'The address provided has a low accuracy.<br><br>Level {0} Accuracy (8 = Exact Match, 1 = Vague Match)',
    /**
     * @cfg {String} gmapType
     * The type of map to display, generic options available are: 'map', 'panorama'.
     * Defaults to <tt>'map'</tt>. 
     * More specific maps can be used by specifying the google map type:
     * <div class="mdetail-params"><ul>
     * <li><b><code>G_NORMAL_MAP</code></b> : <div class="sub-desc"><p>
     * Displays the default road map view
     * </p></div></li>
     * <li><b><code>G_SATELLITE_MAP</code></b> : <div class="sub-desc"><p>
     * Displays Google Earth satellite images
     * </p></div></li>
     * <li><b><code>G_HYBRID_MAP</code></b> : <div class="sub-desc"><p>
     * Displays a mixture of normal and satellite views
     * </p></div></li>
     * <li><b><code>G_DEFAULT_MAP_TYPES</code></b> : <div class="sub-desc"><p>
     * Contains an array of the above three types, useful for iterative processing.
     * </p></div></li>
     * <li><b><code>G_PHYSICAL_MAP</code></b> : <div class="sub-desc"><p>
     * Displays a physical map based on terrain information. 
     * </p></div></li>
     * <li><b><code>G_MOON_ELEVATION_MAP</code></b> : <div class="sub-desc"><p>
     * Displays a shaded terrain map of the surface of the Moon, color-coded by altitude.
     * </p></div></li>
     * <li><b><code>G_MOON_VISIBLE_MAP</code></b> : <div class="sub-desc"><p>
     * Displays photographic imagery taken from orbit around the moon.
     * </p></div></li>
     * <li><b><code>G_MARS_ELEVATION_MAP</code></b> : <div class="sub-desc"><p>
     * Displays a shaded terrain map of the surface of Mars, color-coded by altitude.
     * </p></div></li>
     * <li><b><code>G_MARS_VISIBLE_MAP</code></b> : <div class="sub-desc"><p>
     * Displays photographs taken from orbit around Mars.
     * </p></div></li>
     * <li><b><code>G_MARS_INFRARED_MAP</code></b> : <div class="sub-desc"><p>
     * Displays a shaded infrared map of the surface of Mars, where warmer areas appear brighter and colder areas appear darker.
     * </p></div></li>
     * <li><b><code>G_SKY_VISIBLE_MAP</code></b> : <div class="sub-desc"><p>
     * Displays a mosaic of the sky, as seen from Earth, covering the full celestial sphere.
     * </p></div></li>
     * </ul></div>
     * Sample usage:
     * <pre><code>
     * gmapType: G_MOON_VISIBLE_MAP
     * </code></pre>
     */
    gmapType : 'map',
    /**
     * @cfg {Object} setCenter
     * The initial center location of the map. The map needs to be centered before it can be used.
     * A marker is not required to be specified. 
     * More markers can be added to the map using the <code>{@link #markers}</code> array.
     * For example:
     * <pre><code>
setCenter: {
    geoCodeAddr: '4 Yawkey Way, Boston, MA, 02215-3409, USA',
    marker: {title: 'Fenway Park'}
},

// or just specify lat/long
setCenter: {
    lat: 42.345573,
    lng: -71.098326
}
     * </code></pre>
     */
    /**
     * @cfg {Number} zoomLevel
     * The zoom level to initialize the map at, generally between 1 (whole planet) and 40 (street).
     * Also used as the zoom level for panoramas, zero specifies no zoom at all.
     * Defaults to <tt>3</tt>.
     */
    zoomLevel: 3,
    /**
     * @cfg {Number} yaw
     * The Yaw, or rotational direction of the users perspective in degrees. Only applies to panoramas.
     * Defaults to <tt>180</tt>.
     */
    yaw: 180,
    /**
     * @cfg {Number} pitch
     * The pitch, or vertical direction of the users perspective in degrees.
     * Defaults to <tt>0</tt> (straight ahead). Valid values are between +90 (straight up) and -90 (straight down). 
     */
    pitch: 0,
    /**
     * @cfg {Boolean} displayGeoErrors
     * True to display geocoding errors to the end user via a message box.
     * Defaults to <tt>false</tt>.
     */
    displayGeoErrors: false,
    /**
     * @cfg {Boolean} minGeoAccuracy
     * The level (between 1 & 8) to display an accuracy error below. Defaults to <tt>7</tt>. For additional information
     * see <a href="http://code.google.com/apis/maps/documentation/reference.html#GGeoAddressAccuracy">here</a>.
     */
    minGeoAccuracy: 7,
    /**
     * @cfg {Array} mapConfOpts
     * Array of strings representing configuration methods to call, a full list can be found
     * <a href="http://code.google.com/apis/maps/documentation/reference.html#GMap2">here</a>.
     * For example:
     * <pre><code>
     * mapConfOpts: ['enableScrollWheelZoom','enableDoubleClickZoom','enableDragging'],
     * </code></pre>
     */
    /**
     * @cfg {Array} mapControls
     * Array of strings representing map controls to initialize, a full list can be found
     * <a href="http://code.google.com/apis/maps/documentation/reference.html#GControlImpl">here</a>.
     * For example:
     * <pre><code>
     * mapControls: ['GSmallMapControl','GMapTypeControl','NonExistantControl']
     * </code></pre>
     */
    /**
     * @cfg {Array} markers
     * Markers may be added to the map. Instead of specifying <code>lat</code>/<code>lng</code>,
     * geocoding can be specified via a <code>geoCodeAddr</code> string.
     * For example:
     * <pre><code>
markers: [{
    //lat: 42.339641,
    //lng: -71.094224,
    // instead of lat/lng:
    geoCodeAddr: '465 Huntington Avenue, Boston, MA, 02215-5597, USA',
    marker: {title: 'Boston Museum of Fine Arts'},
    listeners: {
        click: function(e){
            Ext.Msg.alert('Its fine', 'and its art.');
        }
    }
},{
    lat: 42.339419,
    lng: -71.09077,
    marker: {title: 'Northeastern University'}
}]
     * </code></pre>
     */
    // private
    mapDefined: false,
    // private
    mapDefinedGMap: false,
    // private
    markers:[],
    // private
    initComponent : function(){
        
        this.addEvents(
            /**
             * @event mapready
             * Fires when the map is ready for interaction
             * @param {GMapPanel} this
             * @param {GMap} map
             */
            'mapready'
        );
        Ext.ux.GMapPanel.superclass.initComponent.call(this);        

    },
    // private
    afterRender : function(){
        
        var wh = this.ownerCt.getSize();
        Ext.applyIf(this, wh);
        
        Ext.ux.GMapPanel.superclass.afterRender.call(this);    
        
        if (this.gmapType === 'map'){
            this.gmap = new google.maps.Map(this.body.dom, {zoom:this.zoomLevel,mapTypeId: google.maps.MapTypeId.ROADMAP});
			this.mapDefined = true;
			this.mapDefinedGMap = true;
        }
        
        if (this.gmapType === 'panorama'){
            this.gmap = new GStreetviewPanorama(this.body.dom);
			this.mapDefined = true;
        }

		if (!this.mapDefined && this.gmapType){
			this.gmap = new google.maps.Map(this.body.dom, {zoom:this.zoomLevel,mapTypeId: google.maps.MapTypeId.ROADMAP});
			this.gmap.setMapType(this.gmapType);
			this.mapDefined = true;
			this.mapDefinedGMap = true;
		}
        
        google.maps.event.addListenerOnce(this.getMap(), 'tilesloaded', this.onMapReady.createDelegate(this));
        
        if (typeof this.setCenter === 'object') {
            if (typeof this.setCenter.geoCodeAddr === 'string'){
                this.geoCodeLookup(this.setCenter.geoCodeAddr, this.setCenter.marker, false, true, this.setCenter.listeners);
            }else{
                if (this.gmapType === 'map'){
                    var point = this.fixLatLng(new google.maps.LatLng(this.setCenter.lat,this.setCenter.lng));
                    this.getMap().setCenter(point, this.zoomLevel);    
                }
                if (typeof this.setCenter.marker === 'object' && typeof point === 'object') {
                    this.addMarker(point, this.setCenter.marker, this.setCenter.marker.clear);
                }
            }
            if (this.gmapType === 'panorama'){
                this.getMap().setLocationAndPOV(new google.maps.LatLng(this.setCenter.lat,this.setCenter.lng), {yaw: this.yaw, pitch: this.pitch, zoom: this.zoomLevel});
            }
        }

    },
    // private
    onMapReady : function(){
                
        this.addMapControls();
        this.addOptions();
        
        this.addMarkers(this.markers);
        
        this.fireEvent('mapready', this, this.getMap());
        
    },
    // private
    onResize : function(w, h){
        
        Ext.ux.GMapPanel.superclass.onResize.call(this, w, h);

        // check for the existance of the google map in case the onResize fires too early
        if (typeof this.getMap() == 'object') {
            google.maps.event.trigger(this.getMap(), 'resize');
        }

    },
    // private
    setSize : function(width, height, animate){
        
        Ext.ux.GMapPanel.superclass.setSize.call(this, width, height, animate);

        // check for the existance of the google map in case setSize is called too early
        if (Ext.isObject(this.getMap())) {
            google.maps.event.trigger(this.getMap(), 'resize');
        }
        
    },
    /**
     * Returns the current google map which can be used to call Google Maps API specific handlers.
     * @return {GMap} this
     */
    getMap : function(){
        
        return this.gmap;
        
    },
    /**
     * Returns the maps center as a GLatLng object
     * @return {GLatLng} this
     */
    getCenter : function(){
        
        return this.fixLatLng(this.getMap().getCenter());
        
    },
    /**
     * Returns the maps center as a simple object
     * @return {Object} this has lat and lng properties only
     */
    getCenterLatLng : function(){
        
        var ll = this.getCenter();
        return {lat: ll.lat(), lng: ll.lng()};
        
    },
    /**
     * Creates markers from the array that is passed in. Each marker must consist of at least
     * <code>lat</code> and <code>lng</code> properties or a <code>geoCodeAddr</code>.
     * @param {Array} markers an array of marker objects
     */
    addMarkers : function(markers) {
        if (Ext.isArray(markers)){
            for (var i = 0; i < markers.length; i++) {
                if (markers[i]) {
                    if (typeof markers[i].geoCodeAddr == 'string') {
                        this.geoCodeLookup(markers[i].geoCodeAddr, markers[i].marker, false, markers[i].setCenter, markers[i].listeners);
                    } else {
                        var mkr_point = this.fixLatLng(new google.maps.LatLng(markers[i].lat, markers[i].lng));
                        this.addMarker(mkr_point, markers[i].marker, false, markers[i].setCenter, markers[i].listeners);
                    }
                }
            }
        }
        
    },
    /**
     * Creates a single marker.
     * @param {Object} point a GLatLng point
     * @param {Object} marker a marker object consisting of at least lat and lng
     * @param {Boolean} clear clear other markers before creating this marker
     * @param {Boolean} center true to center the map on this marker
     * @param {Object} listeners a listeners config
     */
    addMarker : function(point, marker, clear, center, listeners){
        
        this.markers.push(marker);
        
        Ext.applyIf(marker,{});

        if (clear === true){
            this.clearMarkers();
        }
        if (center === true) {
            this.getMap().setCenter(point, this.zoomLevel);
        }

        var mark = new google.maps.Marker(Ext.apply(marker, {
            position: point,
            map: this.getMap()
        }));

        if (typeof listeners === 'object'){
            for (evt in listeners) {
                google.maps.event.addListener(mark, evt, this, listeners[evt]);
            }
        }

    },
    // private
    clearMarkers : function(){
        
        if (infowindow) {
            infowindow.close();
        }
        
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].set_map(null);
        }

    },
    // private
    addMapControls : function(){
        
        if (this.gmapType === 'map') {
            if (Ext.isArray(this.mapControls)) {
                for(i=0;i<this.mapControls.length;i++){
                    //this.addMapControl(this.mapControls[i]);
                }
            }else if(typeof this.mapControls === 'string'){
                //this.addMapControl(this.mapControls);
            }else if(typeof this.mapControls === 'object'){
                //this.getMap().add_control(this.mapControls);
            }
        }
        
    },
    /**
     * Adds a GMap control to the map.
     * @param {String} mc a string representation of the control to be instantiated.
     */
    addMapControl : function(mc){
        
        var mcf = window[mc];
        if (typeof mcf === 'function') {
            //this.getMap().addControl(new mcf());
        }    
        
    },
    // private
    addOptions : function(){
        
        if (Ext.isArray(this.mapConfOpts)) {
            var mc;
            for(i=0;i<this.mapConfOpts.length;i++){
                //this.addOption(this.mapConfOpts[i]);
            }
        }else if(typeof this.mapConfOpts === 'string'){
            //this.addOption(this.mapConfOpts);
        }        
        
    },
    /**
     * Adds a GMap option to the map.
     * @param {String} mo a string representation of the option to be instantiated.
     */
    addOption : function(mo){
        
        var mof = this.getMap()[mo];
        if (typeof mof === 'function') {
            this.getMap()[mo]();
        }    
        
    },
    /**
     * Looks up and address and optionally add a marker, center the map to this location, or
     * clear other markers. Sample usage:
     * <pre><code>
buttons: [
    {
        text: 'Fenway Park',
        handler: function(){
            var addr = '4 Yawkey Way, Boston, MA, 02215-3409, USA';
            Ext.getCmp('my_map').geoCodeLookup(addr, undefined, false, true, undefined);
        }
    },{
        text: 'Zoom Fenway Park',
        handler: function(){
            Ext.getCmp('my_map').zoomLevel = 19;
            var addr = '4 Yawkey Way, Boston, MA, 02215-3409, USA';
            Ext.getCmp('my_map').geoCodeLookup(addr, undefined, false, true, undefined);
        }
    },{
        text: 'Low Accuracy',
        handler: function(){
            Ext.getCmp('my_map').geoCodeLookup('Paris, France', undefined, false, true, undefined);
        }
    },{

        text: 'Bogus Address',
        handler: function(){
            var addr = 'Some Fake, Address, For, Errors';
            Ext.getCmp('my_map').geoCodeLookup(addr, undefined, false, true, undefined);
        }
    }
]
     * </code></pre>
     * @param {String} addr the address to lookup.
     * @param {Object} marker the marker to add (optional).
     * @param {Boolean} clear clear other markers before creating this marker
     * @param {Boolean} center true to set this point as the center of the map.
     * @param {Object} listeners a listeners config
     */
    geoCodeLookup : function(addr, marker, clear, center, listeners) {
        
        if (!this.geocoder) {
            this.geocoder = new google.maps.Geocoder();
        }
        this.geocoder.geocode({
			address: addr
		}, this.addAddressToMap.createDelegate(this, [addr, marker, clear, center, listeners], true));
        
    },
	// private 
	centerOnClientLocation : function(){
		this.getClientLocation(function(loc){
			var point = this.fixLatLng(new google.maps.LatLng(loc.latitude,loc.longitude));
            this.getMap().setCenter(point, this.zoomLevel);
		});
	},
	// private
	getClientLocation : function(fn, errorFn){
		if (!errorFn) {
            errorFn = Ext.emptyFn;
        }
		if (!this.clientGeo) {
			this.clientGeo = google.gears.factory.create('beta.geolocation');
		}
		geo.getCurrentPosition(fn.createDelegate(this), errorFn);
	},
    // private
    addAddressToMap : function(response, status, addr, marker, clear, center, listeners){
        if (!response || status !== 'OK') {
            this.respErrorMsg(status);
        }else{
            var place = response[0].geometry.location;
			var accuracy;
            if (false && accuracy === 0) {
                this.geoErrorMsg(this.geoErrorTitle, this.geoErrorMsgUnable);
            }else{
                if (false && accuracy < this.minGeoAccuracy) {
                    this.geoErrorMsg(this.geoErrorTitle, String.format(this.geoErrorMsgAccuracy, accuracy));
                }else{
                    point = this.fixLatLng(place);
                    if (center){
                        this.getMap().setCenter(point, this.zoomLevel);
                    }
                    if (typeof marker === 'object') {
                        if (!marker.title){
                            marker.title = response.formatted_address;
                        }
                        Ext.applyIf(marker, {});
                        this.addMarker(point, marker, clear, false, listeners);
                    }
                }
            }
        }
        
    },
    // private
    geoErrorMsg : function(title,msg){
        if (this.displayGeoErrors) {
            Ext.MessageBox.alert(title,msg);
        }
    },
    // private
    respErrorMsg : function(code){
        Ext.each(this.respErrors, function(obj){
            if (code == obj.code){
                Ext.MessageBox.alert(this.respErrorTitle, obj.msg);
            }
        }, this);
    },
 	// private
	// used to inverse the lat/lng coordinates to correct locations on the sky map
	fixLatLng : function(llo){
        if (this.getMap().getMapTypeId() === 'SKY') {
            if (this.getMap().getCurrentMapType().QO == 'visible') {
                llo.lat(180 - llo.lat());
                llo.lng(180 - llo.lng());
            }
        }
		return llo;
	}
});

Ext.reg('gmappanel',Ext.ux.GMapPanel); 