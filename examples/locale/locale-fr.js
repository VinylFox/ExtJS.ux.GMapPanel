/**
 * @author Shea
 */

if(Ext.ux.GMapPanel){
    Ext.apply(Ext.ux.GMapPanel.prototype, {
        respErrors: [{
                code: G_GEO_BAD_REQUEST,
                msg: 'A directions demande n\'a pas pu &ecirc;tre analys&eacute;e avec succ&egrave;s. Par exemple, la demande de mai a &eacute;t&eacute; rejet&eacute;e si elle contient plus que le nombre maximal de points de passage autoris&eacute;s.' 
            },{
                code: G_GEO_SERVER_ERROR,
                msg: 'Un g&eacute;ocodage ou directions requ&ecirc;te n\'a pas pu &ecirc;tre trait&eacute;e avec succ&egrave;s, mais la raison exacte de la panne n\'est pas connue.'
            },{
                code: G_GEO_MISSING_QUERY,
                msg: 'Le param&egrave;tre q HTTP est absent ou n\'a pas de valeur. Pour le g&eacute;ocodage des demandes, cela signifie qu\'une adresse vide a &eacute;t&eacute; sp&eacute;cifi&eacute; en entr&eacute;e. Pour les directions des demandes, ce qui signifie que la requ&ecirc;te n\'&eacute;tait pas sp&eacute;cifi&eacute; dans l\'entr&eacute;e.'
            },{
                code: G_GEO_MISSING_ADDRESS,
                msg: 'Synonyme de G_GEO_MISSING_QUERY.' 
            },{
                code: G_GEO_UNKNOWN_ADDRESS,
                msg: 'Ne correspond &agrave; aucun lieu g&eacute;ographique pourrait &ecirc;tre trouv&eacute; pour l\'adresse indiqu&eacute;e. Cette mai-&ecirc;tre d&ucirc; au fait que l\'adresse est relativement nouveau, ou mai-&ecirc;tre incorrects.' 
            },{
                code: G_GEO_UNAVAILABLE_ADDRESS,
                msg: 'Le g&eacute;ocodage de l\'adresse ou l\'itin&eacute;raire donn&eacute; des orientations pour la requ&ecirc;te ne peut pas &ecirc;tre renvoy&eacute; &agrave; cause de raisons juridiques ou contractuelles.' 
            },{
                code: G_GEO_UNKNOWN_DIRECTIONS,
                msg: 'GDirections L\'objet ne peut pas calculer les directions entre les points mentionn&eacute;s dans la requ&ecirc;te. C\'est g&eacute;n&eacute;ralement parce que il n\'ya pas de route, entre les deux points, ou parce que nous n\'avons pas de donn&eacute;es pour le routage dans la r&eacute;gion.'
            },{
                code: G_GEO_BAD_KEY,
                msg: 'La cl&eacute; donn&eacute;e est soit invalide ou ne correspond pas au domaine pour lequel il a &eacute;t&eacute; donn&eacute;.' 
            },{
                code: G_GEO_TOO_MANY_QUERIES,
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
                    gmapType: G_SATELLITE_MAP,
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