/**
 * @author Shea
 */

Ext.onReady(function(){

    var mapwin, maploc;
    var button = Ext.get('show-btn');

    button.on('click', function(){
        
        if (!maploc) {
            maploc = new Ext.Window({
                layout: 'fit',
                title: 'GMap Window Recenter',
                closeAction: 'hide',
                width:270,
                height:223,
                x: 60,
                y: 80,
                resizable: false,
                border: false,
                items: {
                    xtype: 'form',
                    id: 'my_form',
                    border: false,
                    labelAlign: 'right',
                    labelWidth: '60',
                    frame: true,
                    items: [{
                        xtype: 'numberfield',
                        fieldLabel: 'Lattitude',
                        decimalPrecision: 6,
                        minValue: -90.0,
                        maxValue: 90.0,
                        name: 'lat'
                    },{
                        xtype: 'numberfield',
                        fieldLabel: 'Longitude',
                        decimalPrecision: 6,
                        minValue: -90.0,
                        maxValue: 90.0,
                        name: 'lng'
                    },{
                        html: '- OR -',
                        border: false,
                        bodyStyle: 'margin: 0 0 3px 115px;'
                    },{
                        xtype: 'textfield',
                        fieldLabel: 'Address',
                        name: 'addr'
                    },{
                        html: '- CIRCLE -',
                        border: false,
                        bodyStyle: 'margin: 0 0 3px 115px;'
                    },{
                        xtype: 'numberfield',
                        fieldLabel: 'Radius (Miles)',
                        name: 'radius'
                    }]
                },
                buttons: [{
                    text: 'Map It!',
                    handler: function(){
                        var frm = Ext.getCmp('my_form').getForm();
                        var map = Ext.getCmp('my_map');
                        if (frm.findField('addr').getValue() != ''){
                            map.geoCodeLookup(frm.findField('addr').getValue(), {
                              title: 'Center',
                              callback: function(marker, point){
                                var circle = new google.maps.Circle({
                                  map: this.getMap(),
                                  radius: (Ext.getCmp('my_form').getForm().findField('radius').getValue()*1.609)*1000
                                });
                                circle.bindTo('center', marker, 'position');
                                this.getMap().fitBounds(circle.getBounds());
                              }
                            }, false, true, undefined);
                        }else{
                            if (frm.findField('lat').getValue() != '' && frm.findField('lng').getValue() != '' && frm.isValid()){
                                var point = map.fixLatLng(new GLatLng(frm.findField('lat').getValue(), frm.findField('lng').getValue()));
                                map.getMap().setCenter(point, map.zoomLevel);
                            }else{
                                Ext.Msg.alert('Error','What exactly am I suppose to do with that?');
                            }
                        }
                    }
                }]
            });
        }
        // create the window on the first click and reuse on subsequent clicks
        if(!mapwin){

            mapwin = new Ext.Window({
                layout: 'fit',
                title: 'GMap Window',
                closeAction: 'hide',
                width:400,
                height:400,
                x: 40,
                y: 60,
                tools: [{
                    id: 'search',
                    handler: function(){
                        maploc.show();
                    }
                }],
                items: {
                    xtype: 'gmappanel',
                    zoomLevel: 14,
                    gmapType: 'map',
                    id: 'my_map',
                    mapConfOpts: ['enableScrollWheelZoom','enableDoubleClickZoom','enableDragging'],
                    mapControls: ['GSmallMapControl','GMapTypeControl','NonExistantControl'],
                    setCenter: {
                        geoCodeAddr: '4 Yawkey Way, Boston, MA, 02215-3409, USA',
                        marker: {
                          title: 'Fenway Park'
                        }
                    },
					buttons: [{
						text: 'Museum of Fine Arts',
						handler: function(){
							Ext.getCmp('my_map').geoCodeLookup('465 Huntington Avenue, Boston, MA, 02215-5597, USA', undefined, false, true, undefined);
						}
					},{
						text: 'Fenway Park',
						handler: function(){
							Ext.getCmp('my_map').geoCodeLookup('4 Yawkey Way, Boston, MA, 02215-3409, USA', undefined, false, true, undefined);
						}
					},{
						text: 'Zoom Fenway Park',
						handler: function(){
							// this way will apply the zoom level to every map move
							Ext.getCmp('my_map').zoomLevel = 19;
							Ext.getCmp('my_map').geoCodeLookup('4 Yawkey Way, Boston, MA, 02215-3409, USA', undefined, false, true, undefined);
							// or you can set it just once
							// Ext.getCmp('my_map').getMap().setZoom(19);
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
					}],
                    listeners: {
                        resize: function(t){
                          if (window.google && window.google.maps){
                            t.geoCodeLookup('4 Yawkey Way, Boston, MA, 02215-3409, USA', undefined, false, true, undefined);
                          }
                        }
                    }
                }
            });
            
        }
        
        mapwin.show();
        
    });
    
 });