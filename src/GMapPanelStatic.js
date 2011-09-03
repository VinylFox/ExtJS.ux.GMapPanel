Ext.ns('Ext.ux');
/**
 * @class Ext.ux.GMapPanel
 * @extends Ext.Panel
 * @author Shea Frederick
 */
Ext.define('Ext.ux.GMapPanelStatic', {
	
    extend: 'Ext.panel.Panel',
    
    alias: 'widget.gmappanelstatic',
    
    requires: ['Ext.window.MessageBox'],
    
    mapUrl: 'http://maps.googleapis.com/maps/api/staticmap?center={2}&zoom={3}&size={0}x{1}&maptype={4}&markers={5}&sensor={6}',
    sensor: false,
    markerStr: 'size:mid|color:red|',

    initComponent : function(){
        
        var defConfig = {
            plain: true,
            zoomLevel: 3,
            yaw: 180,
            pitch: 0,
            zoom: 0,
            gmapType: 'roadmap',
            border: false
        };
        
        Ext.applyIf(this,defConfig);
        
        this.callParent();
                
    },
    
    afterRender : function(){
        
        this.addMarkers(this.markers);
        
        this.callParent();    
        
    },
    afterComponentLayout : function(w, h){

        if (w && h) {
            if (w > 640 || h > 640){
                Ext.Msg.alert('error','The map can be no larger than 640px in either direction');
            }
            this.updateMap();
        }
        
        this.callParent(arguments);

    },
    updateMap: function(){
        
        var url = this.getMapUrl();
        if (this.rendered) {
            this.el.update('<img src="' + url + '">');
        }else{
            this.html = '<img src="'+url+'">';
        }
        
    },
    getMapUrl: function(){
        var wh = this.el.getSize();
        console.log('getMapUrl',wh.width,wh.height);
        var url = Ext.String.format(this.mapUrl,wh.width,wh.height,this.getCenterString(),this.zoomLevel,this.mapType,this.getMarkerString(),this.sensor);
        if (url.split().length > 2048){
            Ext.Msg.alert('Error','The URL to request a map image is too long');
        }else{
            return url;
        }
    },
    getCenterString: function(){
        return (this.setCenter.geoCodeAddr)?this.setCenter.geoCodeAddr:this.setCenter.lat+','+this.setCenter.lng;
    },
    getMarkerString: function(){
        return this.markerStr;
    },
    getMap : function(){
        
        return this;
        
    },
    addMarkers : function(markers) {
        
        if (Ext.isArray(markers)){
            for (var i = 0; i < markers.length; i++) {
                if (markers[i]) {
                    if (typeof markers[i].geoCodeAddr == 'string') {
                        this.markerStr += markers[i].geoCodeAddr+'|';
                    } else {
                        var mkr_point = {lat:markers[i].lat, lng:markers[i].lng};
                        this.addMarker(mkr_point, markers[i].marker, false, markers[i].setCenter, markers[i].listeners);
                    }
                }
            }
            this.updateMap();
        }
        
    },
    addMarker : function(point, marker, clear, center, listeners){

        this.markerStr += point.lat+','+point.lng+'|';

    },
    geoCodeLookup : function(addr) {

        
        
    }
 
});

