/**
 * @author Shea
 */

Ext.onReady(function(){

    new Ext.TabPanel({
		renderTo: 'tabs',
		width:600,
		height:400,
		activeTab: 0,
		deferredRender: false, // set this so we have access to the map on the second tab before its been activated
		defaults: {
			xtype: 'gmappanel',
			zoomLevel: 14,
			gmapType: 'map',
			mapConfOpts: ['enableScrollWheelZoom','enableDoubleClickZoom','enableDragging'],
			mapControls: ['GSmallMapControl','GMapTypeControl','NonExistantControl']
		},
		items: [{
			xtype: 'panel',
			title: 'Tab Without Map',
			html: 'The other maps have been rendered but not displayed yet'
		},{
			title: 'Fenway Park',
			id: 'my_map1',
			setCenter: {
				geoCodeAddr: '4 Yawkey Way, Boston, MA, 02215-3409, USA',
				marker: {title: 'Fenway Park'}
			},
      buttons: [{
        text: 'Hide Markers',
        handler: function(){
          Ext.getCmp('my_map1').hideMarkers();
        }
      },{
        text: 'Show Markers',
        handler: function(){
          Ext.getCmp('my_map1').showMarkers();
        }
      }]
		},{
			title: 'Boston Museum of Fine Arts',
			id: 'my_map2',
			setCenter: {
				geoCodeAddr: '465 Huntington Avenue, Boston, MA, 02215-5597, USA',
				marker: {title: 'Boston Museum of Fine Arts'}
      },
      buttons: [{
        text: 'Hide Markers',
        handler: function(){
          Ext.getCmp('my_map2').hideMarkers();
        }
      },{
        text: 'Show Markers',
        handler: function(){
          Ext.getCmp('my_map2').showMarkers();
        }
      }]
		}]
	});

 });