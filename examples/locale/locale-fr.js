/**
 * @author Shea
 */

if(Ext.ux.GMapPanel){
    Ext.apply(Ext.ux.GMapPanel.prototype, {
        respErrors: [{
                code: 'UNKNOWN_ERROR',
                msg: 'A directions demande n\'a pas pu &ecirc;tre analys&eacute;e avec succ&egrave;s. Par exemple, la demande de mai a &eacute;t&eacute; rejet&eacute;e si elle contient plus que le nombre maximal de points de passage autoris&eacute;s.' 
            },{
                code: 'INVALID_REQUEST',
                msg: 'Le param&egrave;tre q HTTP est absent ou n\'a pas de valeur. Pour le g&eacute;ocodage des demandes, cela signifie qu\'une adresse vide a &eacute;t&eacute; sp&eacute;cifi&eacute; en entr&eacute;e. Pour les directions des demandes, ce qui signifie que la requ&ecirc;te n\'&eacute;tait pas sp&eacute;cifi&eacute; dans l\'entr&eacute;e.'
            },{
                code: 'ZERO_RESULTS',
                msg: 'Ne correspond &agrave; aucun lieu g&eacute;ographique pourrait &ecirc;tre trouv&eacute; pour l\'adresse indiqu&eacute;e. Cette mai-&ecirc;tre d&ucirc; au fait que l\'adresse est relativement nouveau, ou mai-&ecirc;tre incorrects.' 
            },{
                code: 'REQUEST_DENIED',
                msg: 'La cl&eacute; donn&eacute;e est soit invalide ou ne correspond pas au domaine pour lequel il a &eacute;t&eacute; donn&eacute;.' 
            },{
                code: 'OVER_QUERY_LIMIT',
                msg: 'La cl&eacute; a &eacute;t&eacute; donn&eacute; sur la demande dans la limite de 24 heures ou a soumis un trop grand nombre de demandes dans un d&eacute;lai trop court de temps. Si vous envoyez des demandes multiples en parall&egrave;le ou dans une boucle serr&eacute;e, utilisez une minuterie ou d\'une pause dans votre code pour vous assurer de ne pas envoyer trop rapidement les demandes.' 
        }],
        respErrorTitle : 'Erreur',
        geoErrorMsgUnable : 'Impossible de localiser l\'adresse que vous avez fournis',
        geoErrorTitle : 'Adresse Lieu erreur',
        geoErrorMsgAccuracy : 'L\'adresse fournie a une faible pr&eacute;cision. <br> Niveau {0} Pr&eacute;cision (8 = Exact Match, 1 = Vague Match)'
    });
}

Ext.onReady(function(){

    var mapwin;
    var button = Ext.get('show-btn');

    button.on('click', function(){
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
                items: {
                    xtype: 'gmappanel',
                    zoomLevel: 17,
                    gmapType: google.maps.MapTypeId.SATELLITE,
                    id: 'my_map',
                    displayGeoErrors: true,
                    setCenter: {
                        geoCodeAddr: 'Eiffel Tower, Paris, France',
                        marker: {title: 'Eiffel Tower'}
                    },
					buttons: [{
						text: 'Bogus Address',
						handler: function(){
							Ext.getCmp('my_map').geoCodeLookup('Some Fake, Address, For, Errors', undefined, false, true, undefined);
						}
					},{
						text: 'Low Accuracy',
						handler: function(){
							Ext.getCmp('my_map').geoCodeLookup('Paris, France', undefined, false, true, undefined);
						}
					}]
                }
            });
            
        }
        
        mapwin.show();
        
    });
    
 });