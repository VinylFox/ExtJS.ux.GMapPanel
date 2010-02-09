/**
 * @author Shea
 */

Ext.onReady(function(){

    var mapwin;
    var button = Ext.get('show-btn');

    button.on('click', function(){
        // create the window on the first click and reuse on subsequent clicks
        if(!mapwin){

            mapwin = new Ext.Window({
                layout: 'fit',
                title: 'GMap Window (Sky View From Location)',
                closeAction: 'hide',
                width:400,
                height:400,
                x: 40,
                y: 60,
                items: {
                    xtype: 'gmappanel',
                    zoomLevel: 6,
					minGeoAccuracy: 3,
                    gmapType: G_SKY_VISIBLE_MAP,
                    id: 'my_map',
                    setCenter: {
                        geoCodeAddr: 'Denver, CO, USA'
                    },
					buttons: [{
						text: 'Boston',
						handler: function(){
							Ext.getCmp('my_map').geoCodeLookup('Boston, MA, USA', undefined, false, true, undefined);
						}
					},{
						text: 'San Francisco',
						handler: function(){
							Ext.getCmp('my_map').geoCodeLookup('San Francisco, CA, USA', undefined, false, true, undefined);
						}
					},{
						text: 'Denver',
						handler: function(){
							Ext.getCmp('my_map').geoCodeLookup('Denver, CO, USA', undefined, false, true, undefined);
						}
					},{
						text: '+',
						minWidth: 30,
						handler: function(){
							var c = Ext.getCmp('my_map');
							var m = c.getMap();
							m.setZoom(m.getZoom()+1);
							c.zoomLevel = m.getZoom();
						}
					},{
						text: '-',
						minWidth: 30,
						handler: function(){
							var c = Ext.getCmp('my_map');
							var m = c.getMap();
							m.setZoom(m.getZoom()-1);
							c.zoomLevel = m.getZoom();
						}
					}]
                }
            });
            
        }
        
        mapwin.show();
        
    });
    
 });