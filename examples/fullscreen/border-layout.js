/**
 * @author Shea
 */

Ext.onReady(function(){

	Ext.ux.LocSelectionList = Ext.extend(Ext.DataView, {
		listItemTpl: '<tpl for="."><div class="ux-locitem-selector"><div>{title}</div></div></tpl>',
		initComponent: function(){
			
			this.liTpl = new Ext.XTemplate(this.listItemTpl);
			
			Ext.applyIf(this, {
				store: new Ext.data.JsonStore({
	                fields: ['lat','lng','title'],
	        		root: 'Data',
	                data: {
						Data: this.locations
					}
	            }),
	            tpl: this.liTpl,
	            multiSelect: false,
	            itemSelector: 'div.ux-locitem-selector',
	            overClass:'ux-locitem-selector-over',
	            emptyText: '',
	            deferEmptyText: false
			});
			
			this.on('click', function(t,i){
				var map = Ext.getCmp(this.mapTargetCmpId);
	            var rec = t.store.getAt(i);
				var point = map.fixLatLng(new google.maps.LatLng(rec.data.lat, rec.data.lng));
				map.getMap().setCenter(point);
	        }, this);
			
			Ext.ux.LocSelectionList.superclass.initComponent.call(this);
			
		}
	});

	Ext.reg('locselectionlist', Ext.ux.LocSelectionList);

	new Ext.Viewport({
		layout: 'border',
		items: [{
			region: 'west',
			title: 'Locations',
			id: 'my_sel_list',
			width: 200,
			split: true,
			layout: 'fit',
			bodyStyle: 'padding: 5px;',
            collapsible: true,
			items: [{
				xtype: 'locselectionlist',
				mapTargetCmpId: 'my_map',
				width: 160,
				locations: [{
	                lat: 42.339641,
	                lng: -71.094224,
	                title: 'Boston Museum of Fine Arts'
	            },{
	                lat: 42.339419,
	                lng: -71.09077,
	                title: 'Northeastern University'
	            }]
			}]
		},{
			region: 'center',
			xtype: 'gmappanel',
            zoomLevel: 16,
            gmapType: 'map',
            id: 'my_map',
			border: true,
            mapConfOpts: ['enableScrollWheelZoom','enableDoubleClickZoom','enableDragging'],
            mapControls: ['GSmallMapControl','GMapTypeControl'],
            setCenter: {
                lat: 42.339641,
                lng: -71.094224
            },
			markers: [{
                lat: 42.339641,
                lng: -71.094224,
                marker: {title: 'Boston Museum of Fine Arts'}
            },{
                lat: 42.339419,
                lng: -71.09077,
                marker: {title: 'Northeastern University'}
            }]
		}]
	});
    
 });