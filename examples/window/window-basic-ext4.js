Ext.onReady(function(){
    var mapwin;
    
    Ext.get('show-btn').on('click', function() {
        // create the window on the first click and reuse on subsequent clicks
        if(!mapwin){

            mapwin = Ext.create('Ext.Window', {
                layout: 'fit',
                title: 'GMap Window',
                closeAction: 'hide',
                width:450,
                height:450,
                border: false,
                x: 40,
                y: 60,
                items: {
                    xtype: 'gmappanel',
                    id: 'mymap',
                    zoomLevel: 14,
                    gmapType: 'map',
                    mapConfOpts: ['enableScrollWheelZoom','enableDoubleClickZoom','enableDragging'],
                    mapControls: ['GSmallMapControl','GMapTypeControl'],
                    setCenter: {
                        lat: 39.26940,
                        lng: -76.64323
                    },
                    maplisteners: {
                    	click: function(mevt){
                    		Ext.Msg.alert('Lat/Lng of Click', mevt.latLng.lat() + ' / ' + mevt.latLng.lng());
                    		var input = Ext.get('ac').dom,
				    			sw = new google.maps.LatLng(39.26940,-76.64323),
				    			ne = new google.maps.LatLng(39.38904,-76.54848),
				    			bounds = new google.maps.LatLngBounds(sw,ne);
				    		var options = {
				    			location: mevt.latLng,
				    			radius: '1000',
								types: ['geocode']
							};
                    	}
                    }
                }
            });
            
        }
        
        mapwin.show();
        
    });
    
 });