/**
 * @class Ext.ux.GMapPanel
 * @extends Ext.Panel
 * @author Shea Frederick
 */
Ext.ux.GMapPanelStatic = Ext.extend(Ext.Panel, {    
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
        
        this.geo = this.geo || new Ext.util.GeoLocation();
        
        Ext.applyIf(this,defConfig);
        
        Ext.ux.GMapPanelStatic.superclass.initComponent.call(this);
                
    },
    
    afterRender : function(){
        
        this.addMarkers(this.markers);
        
        Ext.ux.GMapPanelStatic.superclass.afterRender.call(this);    
        
    },
    afterComponentLayout : function(w, h){

        if (w && h) {
            if (w > 640 || h > 640){
                Ext.Msg.alert('error','The map can be no larger than 640px in either direction');
            }
            this.updateMap();
        }
        
        Ext.ux.GMapPanelStatic.superclass.afterComponentLayout.call(this);

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
        return (this.center.geoCodeAddr)?this.center.geoCodeAddr:this.center.lat+','+this.center.lng;
    },
    getMarkerString: function(){
        return this.markerStr;
    },
    getMap : function(){
        
        return this;
        
    },
    setCenter: function(ctr){
        this.center.lat = ctr.lat();
        this.center.lng = ctr.lng();
        this.updateMap();
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

Ext.reg('mappanelstatic',Ext.ux.GMapPanelStatic);