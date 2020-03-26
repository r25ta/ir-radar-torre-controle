var map;
var origensNamesList = [];
var contCarregamento;
var namesList = "";
var time = 5;

/**
 * Radar de Viagens
 * Sistema para listar, visualizar a visar veículos que chegam perto de um ponto
 */
var radarViagensFactory = function () {
    //cria a variavel self para utilizar dentro de outros objetos sem perder a referência
    var self = this;
    //Cria o logo para exibir no canto direito do mapa
    var logoElement = document.createElement('a');
    logoElement.href = 'http://www.gps-pamcary.com.br/';
    logoElement.target = '_blank';

    var logoImage = document.createElement('img');
    logoImage.src = '.images/logotipo.png';
    logoElement.appendChild(logoImage);
    
    var origensList = [];

    //Cria a variável com o audio a ser tocado quando um caminhão se aproxima do ponto
    //this.audio = new Audio('./app/assets/audio/beep.wav');

    this.delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    this.entityId = '';

    this.CenterToEntity = function (opt_options) {

        var options = opt_options || {};

        var button = document.createElement('button');
        button.innerHTML = '<i class="fa fa-location-arrow"></i>';
        button.setAttribute('title', 'Centralizar');

        var this_ = this;
        var handleRotateNorth = function () {
            this_.getMap().getView().setRotation(0);
        };

        button.addEventListener('click', handleRotateNorth, false);
        button.addEventListener('touchstart', handleRotateNorth, false);

        var element = document.createElement('div');
        element.className = 'centralizar-mapa ol-unselectable ol-control';
        element.appendChild(button);

        ol.control.Control.call(this, {
            element: element,
            target: options.target
        });

    };
    ol.inherits(this.CenterToEntity, ol.control.Control);

    //Cria uma linha de escala no canto esquerdo da tela
    var scaleLineControl = new ol.control.ScaleLine();
    var zoomToControl = new this.CenterToEntity();

    //Cria o source dos veiculos, cada objeto representa uma cor e um status do veículo
    
    this.viagensEmCargaRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    this.viagensEmCargaAppSource = new ol.source.Vector({
        features: []
    });
    
    this.viagensEmCargaAppRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    this.viagensEmDescargaRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    this.viagensEmDescargaAppSource = new ol.source.Vector({
        features: []
    });
    
    this.viagensEmDescargaAppRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    this.viagensEmTransitoRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    this.viagensEmTransitoAppSource = new ol.source.Vector({
        features: []
    });
    
    this.viagensEmTransitoAppRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    this.veiculosVazioRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    this.veiculosVazioAppSource = new ol.source.Vector({
        features: []
    });
    
    this.veiculosVazioAppRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    this.entidadeVinculadaSource = new ol.source.Vector({
        features: []
    });
    
    //Cria o source para o ícone que ficara no centro do alvo
    this.companySource = new ol.source.Vector({
        features: []
    });

    //Cria o source para o alvo
    this.radiusSource = new ol.source.Vector({
        features: []
    });

    //Cria o source para a linha do alvo
    this.radarSource = new ol.source.Vector({
        features: []
    });

    this.distanceSource = new ol.source.Vector({
        features: []
    })
    
    
    //Cria uma variável com um estilo representando cada camada do alvo
    this.RADIUSCOLORS = {
        'incoming': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(77, 255, 148, 1)',
                width: 2
            }),
            fill: new ol.style.Fill({
                color: 'rgba(77, 255, 148, .1)'
            })
        }),
        'alert': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(255, 241, 82, 1)',
                width: 2
            }),
            fill: new ol.style.Fill({
                color: 'rgba(255, 241, 82, .1)'
            })
        }),
        'danger': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(255, 160, 82, 1)',
                width: 2
            }),
            fill: new ol.style.Fill({
                color: 'rgba(255, 160, 82, .1)'
            })
        }),
        'extreme': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(255, 82, 82, 1)',
                width: 2
            }),
            fill: new ol.style.Fill({
                color: 'rgba(255, 82, 82, .1)'
            })
        })
    };

    this.AREAS = {
        incoming: 'Area 4',
        alert: 'Area 2',
        danger: 'Area 3',
        extreme: 'Area 1',
    }

    //Cria uma função para facilitar o uso dos estilos
    this.INCOMING = function (size) {
        return this.RADIUSCOLORS["incoming"];
    };
    this.ALERT = function (size) {
        return this.RADIUSCOLORS["alert"];
    };
    this.DANGER = function (size) {
        return this.RADIUSCOLORS["danger"];
    };
    this.EXTREME = function (size) {
        return this.RADIUSCOLORS["extreme"];
    };

    /**
     * Ícones feitos por Nico Mollet
     * @author Nico Mollet
     * https://mapicons.mapsmarker.com/author/nico.mollet
     */

    this.ICONES = {
        //Define o estilo do veículo com sinal
        COM_SINAL: './images/com_sinal.png',
        COM_SINAL_OTM: './images/com_sinal_otm.png',

        //Define o estilo do veículo sem sinal
        SEM_SINAL: './images/sem_sinal.png',
        SEM_SINAL_OTM: './images/sem_sinal_otm.png',

        //Define o estilo do veículo com perda de sinal
        PERDA_SINAL: './images/perda_de_sinal.png',
        PERDA_SINAL_OTM: './images/perda_de_sinal_otm.png',

        //Define o estilo do veículo com tendencia de atraso
        TEND_ATRASO: './images/tendencia_atraso.png',
        TEND_ATRASO_OTM: './images/tendencia_atraso_otm.png',

        //Define o estilo do veículo atrasado
        ATRASO: './images/atraso.png',
        ATRASO_OTM: './images/atraso_otm.png'
    }

    //Define o mapa
    this.mapBackground = new ol.layer.Tile({
        source: new ol.source.OSM()
    })

    this.rasterLayer = new ol.layer.Tile({
        source: new ol.source.TileJSON({
            url: 'http://api.tiles.mapbox.com/v3/mapbox.geography-class.jsonp',
            crossOrigin: ''
        })
    });

    //Seleciona o elemento popup para ser exibido quando o ícone for clicado no mapa
    this.element = document.getElementById('popup');
    //Cria um novo overlay com o popup
    this.popup = new ol.Overlay({
        element: self.element,
        positioning: 'bottom-center',
        stopEvent: true
    });

    //Coloca os layers acima dentro de um array de layers
    this.layers = [];
    this.layers.push(this.rasterLayer)
    this.layers.push(this.mapBackground)

    //Cria o mapa no DOM
    this.map = new ol.Map({
        layers: this.layers,
        target: document.getElementById('map'),
        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */
            ({
                collapsible: false
            })
        }).extend([
            scaleLineControl,
            zoomToControl
        ]),
        view: new ol.View({
            center: ol.proj.transform([-46.523668, -23.542893], 'EPSG:4326', 'EPSG:3857'),
            zoom: 3
        }),
        logo: logoElement
    });

    this.map.addOverlay(this.popup);

    self.mapActions();
};

radarViagensFactory.prototype.radioPlanosAtivos = function (exibir) {
	var self = this;
	contCarregamento = 0;
	$(self.element).popover('destroy');
	
	if(exibir){
		namesList = "";
		$("#entidadesList").empty();
		origensNamesList = [];
		
		$("#exibirEmCarga").prop('checked', true);
		$("#exibirEmDescarga").prop('checked', true);
		$("#exibirEmTransito").prop('checked', true);
		self.toggleViagensEmCarga(true);
		self.toggleViagensEmDescarga(true);
		self.toggleViagensEmTransito(true);
		
		$("#exibirFrotaDedicada").prop('checked', false);
		$("#exibirEmUso").prop('checked', false);
		$("#exibirVazio").prop('checked', false);
		self.removeLayer('viagensEmCargaRastreador');
		self.removeLayer('viagensEmCargaApp');
		self.removeLayer('viagensEmCargaAppRastreador');
		self.removeLayer('viagensEmDescargaRastreador');
		self.removeLayer('viagensEmDescargaApp');
		self.removeLayer('viagensEmDescargaAppRastreador');
		self.removeLayer('viagensEmTransitoRastreador');
		self.removeLayer('viagensEmTransitoApp');
		self.removeLayer('viagensEmTransitoAppRastreador');
		self.removeLayer('veiculoVazioRastreador');
		self.removeLayer('veiculoVazioApp');
		self.removeLayer('veiculoVazioAppRastreador');
		self.removeLayer('entidadeVinculada');
		self.removeLayer('viagensEmCargaRastreadorCluster');
		self.removeLayer('viagensEmCargaAppCluster');
		self.removeLayer('viagensEmCargaAppRastreadorCluster');
		self.removeLayer('viagensEmDescargaRastreadorCluster');
		self.removeLayer('viagensEmDescargaAppCluster');
		self.removeLayer('viagensEmDescargaAppRastreadorCluster');
		self.removeLayer('viagensEmTransitoRastreadorCluster');
		self.removeLayer('viagensEmTransitoAppCluster');
		self.removeLayer('viagensEmTransitoAppRastreadorCluster');
		self.removeLayer('viagensEmCargaRastreadorDedicadoCluster');
		self.removeLayer('viagensEmCargaAppDedicadoCluster');
		self.removeLayer('viagensEmCargaAppRastreadorDedicadoCluster');
		self.removeLayer('viagensEmDescargaRastreadorDedicadoCluster');
		self.removeLayer('viagensEmDescargaAppDedicadoCluster');
		self.removeLayer('viagensEmDescargaAppRastreadorDedicadoCluster');
		self.removeLayer('viagensEmTransitoRastreadorDedicadoCluster');
		self.removeLayer('viagensEmTransitoAppDedicadoCluster');
		self.removeLayer('viagensEmTransitoAppRastreadorDedicadoCluster');
		self.removeLayer('veiculoVazioRastreadorCluster');
		self.removeLayer('veiculoVazioAppCluster');
		self.removeLayer('veiculoVazioAppRastreadorCluster');
		self.removeLayer('entidadeVinculadaCluster');
		
		self.buildYard('#tabelaRadarViagens', '', './buscarViagens', '/app/assets/data/otm.json', time, 'updateTime');
		contCarregamento = 3;
		
		self.toggleRastreador($('#exibirRastreador').is(':checked'));
        self.toggleApp($('#exibirApp').is(':checked'));
        self.toggleAppRastreador($('#exibirAppRastreador').is(':checked'));
        
        self.fecharAguarde();
	}
};

radarViagensFactory.prototype.radioFrotaDedicada = function (exibir) {
	var self = this;
	contCarregamento = 0;
	$(self.element).popover('destroy');
	
	if(exibir){
		namesList = "";
		$("#exibirPlanosAtivos").prop('checked', false);
		
		$("#exibirEmCarga").prop('checked', false);
		$("#exibirEmDescarga").prop('checked', false);
		$("#exibirEmTransito").prop('checked', false);
		self.removeLayer('viagensEmCargaRastreador');
		self.removeLayer('viagensEmCargaApp');
		self.removeLayer('viagensEmCargaAppRastreador');
		self.removeLayer('viagensEmDescargaRastreador');
		self.removeLayer('viagensEmDescargaApp');
		self.removeLayer('viagensEmDescargaAppRastreador');
		self.removeLayer('viagensEmTransitoRastreador');
		self.removeLayer('viagensEmTransitoApp');
		self.removeLayer('viagensEmTransitoAppRastreador');
		self.removeLayer('viagensEmCargaRastreadorCluster');
		self.removeLayer('viagensEmCargaAppCluster');
		self.removeLayer('viagensEmCargaAppRastreadorCluster');
		self.removeLayer('viagensEmDescargaRastreadorCluster');
		self.removeLayer('viagensEmDescargaAppCluster');
		self.removeLayer('viagensEmDescargaAppRastreadorCluster');
		self.removeLayer('viagensEmTransitoRastreadorCluster');
		self.removeLayer('viagensEmTransitoAppCluster');
		self.removeLayer('viagensEmTransitoAppRastreadorCluster');
		self.removeLayer('viagensEmCargaRastreadorDedicadoCluster');
		self.removeLayer('viagensEmCargaAppDedicadoCluster');
		self.removeLayer('viagensEmCargaAppRastreadorDedicadoCluster');
		self.removeLayer('viagensEmDescargaRastreadorDedicadoCluster');
		self.removeLayer('viagensEmDescargaAppDedicadoCluster');
		self.removeLayer('viagensEmDescargaAppRastreadorDedicadoCluster');
		self.removeLayer('viagensEmTransitoRastreadorDedicadoCluster');
		self.removeLayer('viagensEmTransitoAppDedicadoCluster');
		self.removeLayer('viagensEmTransitoAppRastreadorDedicadoCluster');
		
		$("#vinculadoList").empty();
		origensNamesList = [];
		
		$("#exibirEmUso").prop('checked', true);
		$("#exibirVazio").prop('checked', true);
		self.toggleVeiculoVazio(true);
		
		self.buscarVeiculosEmUso('#tabelaRadarViagens', '', './buscarViagens', '/app/assets/data/otm.json', time, 'updateTime');
		self.buscarVeiculosVazios('#tabelaRadarViagens', true, './buscarVeiculosVazios', '/app/assets/data/otm.json', time, 'updateTime');
		
		self.toggleRastreador($('#exibirRastreador').is(':checked'));
        self.toggleApp($('#exibirApp').is(':checked'));
        self.toggleAppRastreador($('#exibirAppRastreador').is(':checked'));
        
        self.fecharAguarde();
	}
};

radarViagensFactory.prototype.toggleViagensEmCarga = function (exibir) {
	var self = this;
	$(self.element).popover('destroy');
	
	if(exibir){
		
		if($('#exibirRastreador').is(':checked')){
			var viagensEmCargaRastreador = new ol.layer.Vector({
			    source: self.viagensEmCargaRastreadorSource,
			    id: 'viagensEmCargaRastreador'
			});
		
			self.map.addLayer(viagensEmCargaRastreador);
			self.setClusters(self.viagensEmCargaRastreadorSource, 'viagensEmCargaRastreadorCluster');
			
		}else{
			self.removeLayer('viagensEmCargaRastreador');
			self.removeLayer('viagensEmCargaRastreadorCluster');
		}
		
		if($('#exibirApp').is(':checked')){
			var viagensEmCargaApp = new ol.layer.Vector({
			    source: self.viagensEmCargaAppSource,
			    id: 'viagensEmCargaApp'
			});
					
			self.map.addLayer(viagensEmCargaApp);
			self.setClusters(self.viagensEmCargaAppSource, 'viagensEmCargaAppCluster');
			
		}else{
			self.removeLayer('viagensEmCargaApp');
			self.removeLayer('viagensEmCargaAppCluster');
		}
		
		if($('#exibirAppRastreador').is(':checked')){
			var viagensEmCargaAppRastreador = new ol.layer.Vector({
			    source: self.viagensEmCargaAppRastreadorSource,
			    id: 'viagensEmCargaAppRastreador'
			});
			
			self.map.addLayer(viagensEmCargaAppRastreador);
			self.setClusters(self.viagensEmCargaAppRastreadorSource, 'viagensEmCargaAppRastreadorCluster');
			
		}else{
			self.removeLayer('viagensEmCargaAppRastreador');
			self.removeLayer('viagensEmCargaAppRastreadorCluster');
		}
		
	} else {
		self.removeLayer('viagensEmCargaRastreador');
		self.removeLayer('viagensEmCargaApp');
		self.removeLayer('viagensEmCargaAppRastreador');
		self.removeLayer('viagensEmCargaRastreadorCluster');
		self.removeLayer('viagensEmCargaAppCluster');
		self.removeLayer('viagensEmCargaAppRastreadorCluster');
	}
};

radarViagensFactory.prototype.toggleViagensEmDescarga = function (exibir) {
	var self = this;
	$(self.element).popover('destroy');
	
	if(exibir){
		if($('#exibirRastreador').is(':checked')){
			var viagensEmDescargaRastreador = new ol.layer.Vector({
			    source: self.viagensEmDescargaRastreadorSource,
			    id: 'viagensEmDescargaRastreador'
			});
			
			self.map.addLayer(viagensEmDescargaRastreador);
			self.setClusters(self.viagensEmDescargaRastreadorSource, 'viagensEmDescargaRastreadorCluster');
			
		}else{
			self.removeLayer('viagensEmDescargaRastreador');
			self.removeLayer('viagensEmDescargaRastreadorCluster');
		}
		
		if($('#exibirApp').is(':checked')){
			var viagensEmDescargaApp = new ol.layer.Vector({
			    source: self.viagensEmDescargaAppSource,
			    id: 'viagensEmDescargaApp'
			});
			
			self.map.addLayer(viagensEmDescargaApp);
			self.setClusters(self.viagensEmDescargaAppSource, 'viagensEmDescargaAppCluster');
			
		}else{
			self.removeLayer('viagensEmDescargaApp');
			self.removeLayer('viagensEmDescargaAppCluster');
		}
		
		if($('#exibirAppRastreador').is(':checked')){
			var viagensEmDescargaAppRastreador = new ol.layer.Vector({
			    source: self.viagensEmDescargaAppRastreadorSource,
			    id: 'viagensEmDescargaAppRastreador'
			});
			
			self.map.addLayer(viagensEmDescargaAppRastreador);
			self.setClusters(self.viagensEmDescargaAppRastreadorSource, 'viagensEmDescargaAppRastreadorCluster');
			
		}else{
			self.removeLayer('viagensEmDescargaAppRastreador');
			self.removeLayer('viagensEmDescargaAppRastreadorCluster');
		}
		
	} else {
		self.removeLayer('viagensEmDescargaRastreador');
		self.removeLayer('viagensEmDescargaApp');
		self.removeLayer('viagensEmDescargaAppRastreador');
		self.removeLayer('viagensEmDescargaRastreadorCluster');
		self.removeLayer('viagensEmDescargaAppCluster');
		self.removeLayer('viagensEmDescargaAppRastreadorCluster');
	}
};

radarViagensFactory.prototype.toggleViagensEmTransito = function (exibir) {
	var self = this;
	$(self.element).popover('destroy');
	
	if(exibir){
		if($('#exibirRastreador').is(':checked')){
			var viagensEmTransitoRastreador = new ol.layer.Vector({
			    source: self.viagensEmTransitoRastreadorSource,
			    id: 'viagensEmTransitoRastreador'
			});
			
			self.map.addLayer(viagensEmTransitoRastreador);
			self.setClusters(self.viagensEmTransitoRastreadorSource, 'viagensEmTransitoRastreadorCluster');
			
		}else{
			self.removeLayer('viagensEmTransitoRastreador');
			self.removeLayer('viagensEmTransitoRastreadorCluster');
		}
		
		if($('#exibirApp').is(':checked')){
			var viagensEmTransitoApp = new ol.layer.Vector({
			    source: self.viagensEmTransitoAppSource,
			    id: 'viagensEmTransitoApp'
			});
			
			self.map.addLayer(viagensEmTransitoApp);
			self.setClusters(self.viagensEmTransitoAppSource, 'viagensEmTransitoAppCluster');
			
		}else{
			self.removeLayer('viagensEmTransitoApp');
			self.removeLayer('viagensEmTransitoAppCluster');
		}
		
		if($('#exibirAppRastreador').is(':checked')){
			var viagensEmTransitoAppRastreador = new ol.layer.Vector({
			    source: self.viagensEmTransitoAppRastreadorSource,
			    id: 'viagensEmTransitoAppRastreador'
			});
			
			self.map.addLayer(viagensEmTransitoAppRastreador);
			self.setClusters(self.viagensEmTransitoAppRastreadorSource, 'viagensEmTransitoAppRastreadorCluster');
			
		}else{
			self.removeLayer('viagensEmTransitoAppRastreador');
			self.removeLayer('viagensEmTransitoAppRastreadorCluster');
		}
	} else {
		self.removeLayer('viagensEmTransitoRastreador');
		self.removeLayer('viagensEmTransitoApp');
		self.removeLayer('viagensEmTransitoAppRastreador');
		self.removeLayer('viagensEmTransitoRastreadorCluster');
		self.removeLayer('viagensEmTransitoAppCluster');
		self.removeLayer('viagensEmTransitoAppRastreadorCluster');
	}
};

radarViagensFactory.prototype.toggleVeiculosEmUso = function (exibir) {
	var self = this;
	$(self.element).popover('destroy');
	
	if(exibir){
		
		if($('#exibirRastreador').is(':checked')){
			var viagensEmCargaRastreador = new ol.layer.Vector({
			    source: self.viagensEmCargaRastreadorSource,
			    id: 'viagensEmCargaRastreador'
			});
		
			self.map.addLayer(viagensEmCargaRastreador);
			self.setClusters(self.viagensEmCargaRastreadorSource, 'viagensEmCargaRastreadorDedicadoCluster');
			
			var viagensEmDescargaRastreador = new ol.layer.Vector({
			    source: self.viagensEmDescargaRastreadorSource,
			    id: 'viagensEmDescargaRastreador'
			});
		
			self.map.addLayer(viagensEmDescargaRastreador);
			self.setClusters(self.viagensEmDescargaRastreadorSource, 'viagensEmDescargaRastreadorDedicadoCluster');
			
			var viagensEmTransitoRastreador = new ol.layer.Vector({
			    source: self.viagensEmTransitoRastreadorSource,
			    id: 'viagensEmTransitoRastreador'
			});
		
			self.map.addLayer(viagensEmTransitoRastreador);
			self.setClusters(self.viagensEmTransitoRastreadorSource, 'viagensEmTransitoRastreadorDedicadoCluster');
			
		}else{
			self.removeLayer('viagensEmCargaRastreador');
			self.removeLayer('viagensEmDescargaRastreador');
			self.removeLayer('viagensEmTransitoRastreador');
			self.removeLayer('viagensEmCargaRastreadorDedicadoCluster');
			self.removeLayer('viagensEmDescargaRastreadorDedicadoCluster');
			self.removeLayer('viagensEmTransitoRastreadorDedicadoCluster');
		}
		
		if($('#exibirApp').is(':checked')){
			var viagensEmCargaApp = new ol.layer.Vector({
			    source: self.viagensEmCargaAppSource,
			    id: 'viagensEmCargaApp'
			});
					
			self.map.addLayer(viagensEmCargaApp);
			self.setClusters(self.viagensEmCargaAppSource, 'viagensEmCargaAppDedicadoCluster');
			
			var viagensEmDescargaApp = new ol.layer.Vector({
			    source: self.viagensEmDescargaAppSource,
			    id: 'viagensEmDescargaApp'
			});
					
			self.map.addLayer(viagensEmDescargaApp);
			self.setClusters(self.viagensEmDescargaAppSource, 'viagensEmDescargaAppDedicadoCluster');
			
			var viagensEmTransitoApp = new ol.layer.Vector({
			    source: self.viagensEmTransitoAppSource,
			    id: 'viagensEmTransitoApp'
			});
					
			self.map.addLayer(viagensEmTransitoApp);
			self.setClusters(self.viagensEmTransitoAppSource, 'viagensEmTransitoAppDedicadoCluster');
			
		}else{
			self.removeLayer('viagensEmCargaApp');
			self.removeLayer('viagensEmDescargaApp');
			self.removeLayer('viagensEmTransitoApp');
			self.removeLayer('viagensEmCargaAppDedicadoCluster');
			self.removeLayer('viagensEmDescargaAppDedicadoCluster');
			self.removeLayer('viagensEmTransitoAppDedicadoCluster');
		}
		
		if($('#exibirAppRastreador').is(':checked')){
			var viagensEmCargaAppRastreador = new ol.layer.Vector({
			    source: self.viagensEmCargaAppRastreadorSource,
			    id: 'viagensEmCargaAppRastreador'
			});
			
			self.map.addLayer(viagensEmCargaAppRastreador);
			self.setClusters(self.viagensEmCargaAppRastreadorSource, 'viagensEmCargaAppRastreadorDedicadoCluster');
			
			var viagensEmDescargaAppRastreador = new ol.layer.Vector({
			    source: self.viagensEmDescargaAppRastreadorSource,
			    id: 'viagensEmDescargaAppRastreador'
			});
			
			self.map.addLayer(viagensEmDescargaAppRastreador);
			self.setClusters(self.viagensEmDescargaAppRastreadorSource, 'viagensEmDescargaAppRastreadorDedicadoCluster');
			
			var viagensEmTransitoAppRastreador = new ol.layer.Vector({
			    source: self.viagensEmTransitoAppRastreadorSource,
			    id: 'viagensEmTransitoAppRastreador'
			});
			
			self.map.addLayer(viagensEmTransitoAppRastreador);
			self.setClusters(self.viagensEmTransitoAppRastreadorSource, 'viagensEmTransitoAppRastreadorDedicadoCluster');
			
		}else{
			self.removeLayer('viagensEmCargaAppRastreador');
			self.removeLayer('viagensEmDescargaAppRastreador');
			self.removeLayer('viagensEmTransitoAppRastreador');
			self.removeLayer('viagensEmCargaAppRastreadorDedicadoCluster');
			self.removeLayer('viagensEmDescargaAppRastreadorDedicadoCluster');
			self.removeLayer('viagensEmTransitoAppRastreadorDedicadoCluster');
		}
		
	} else {
		self.removeLayer('viagensEmCargaRastreador');
		self.removeLayer('viagensEmDescargaRastreador');
		self.removeLayer('viagensEmTransitoRastreador');
		self.removeLayer('viagensEmCargaApp');
		self.removeLayer('viagensEmDescargaApp');
		self.removeLayer('viagensEmTransitoApp');
		self.removeLayer('viagensEmCargaAppRastreador');
		self.removeLayer('viagensEmDescargaAppRastreador');
		self.removeLayer('viagensEmTransitoAppRastreador');
		self.removeLayer('viagensEmCargaRastreadorDedicadoCluster');
		self.removeLayer('viagensEmDescargaRastreadorDedicadoCluster');
		self.removeLayer('viagensEmTransitoRastreadorDedicadoCluster');
		self.removeLayer('viagensEmCargaAppDedicadoCluster');
		self.removeLayer('viagensEmDescargaAppDedicadoCluster');
		self.removeLayer('viagensEmTransitoAppDedicadoCluster');
		self.removeLayer('viagensEmCargaAppRastreadorDedicadoCluster');
		self.removeLayer('viagensEmDescargaAppRastreadorDedicadoCluster');
		self.removeLayer('viagensEmTransitoAppRastreadorDedicadoCluster');
	}
};

radarViagensFactory.prototype.toggleVeiculoVazio = function (exibir) {
	var self = this;
	$(self.element).popover('destroy');
	
	if(exibir){
		if($('#exibirRastreador').is(':checked')){
			var veiculoVazioRastreador = new ol.layer.Vector({
			    source: self.veiculosVazioRastreadorSource,
			    id: 'veiculoVazioRastreador'
			});
			
			self.map.addLayer(veiculoVazioRastreador);
			self.setClusters(self.veiculosVazioRastreadorSource, 'veiculoVazioRastreadorCluster');
		}else{
			self.removeLayer('veiculoVazioRastreador');
			self.removeLayer('veiculoVazioRastreadorCluster');
		}
		
		if($('#exibirApp').is(':checked')){
			var veiculoVazioApp = new ol.layer.Vector({
			    source: self.veiculosVazioAppSource,
			    id: 'veiculoVazioApp'
			});
			
			self.map.addLayer(veiculoVazioApp);
			self.setClusters(self.veiculosVazioAppSource, 'veiculoVazioAppCluster');
		}else{
			self.removeLayer('veiculoVazioApp');
			self.removeLayer('veiculoVazioAppCluster');
		}
		
		if($('#exibirAppRastreador').is(':checked')){
			var veiculoVazioAppRastreador = new ol.layer.Vector({
			    source: self.veiculosVazioAppRastreadorSource,
			    id: 'veiculoVazioAppRastreador'
			});
			
			self.map.addLayer(veiculoVazioAppRastreador);
			self.setClusters(self.veiculosVazioAppRastreadorSource, 'veiculoVazioAppRastreadorCluster');
		}else{
			self.removeLayer('veiculoVazioAppRastreador');
			self.removeLayer('veiculoVazioAppRastreadorCluster');
		}
		
		self.toggleEntidadeVinculada(exibir);
		
	} else {
		self.removeLayer('veiculoVazioRastreador');
		self.removeLayer('veiculoVazioApp');
		self.removeLayer('veiculoVazioAppRastreador');
		self.removeLayer('veiculoVazioRastreadorCluster');
		self.removeLayer('veiculoVazioAppCluster');
		self.removeLayer('veiculoVazioAppRastreadorCluster');
		self.toggleEntidadeVinculada(false);
	}
};

radarViagensFactory.prototype.toggleRastreador = function (exibir) {
	var self = this;
	$(self.element).popover('destroy');
	
	if(exibir){
		if($('#exibirPlanosAtivos').is(':checked')){
			
			if($('#exibirEmCarga').is(':checked')){
				var viagensEmCargaRastreador = new ol.layer.Vector({
				    source: self.viagensEmCargaRastreadorSource,
				    id: 'viagensEmCargaRastreador'
				});
				
				self.map.addLayer(viagensEmCargaRastreador);
				self.setClusters(self.viagensEmCargaRastreadorSource, 'viagensEmCargaRastreadorCluster');
			}else{
				self.removeLayer('viagensEmCargaRastreador');
				self.removeLayer('viagensEmCargaRastreadorCluster');
			}
			
			if($('#exibirEmDescarga').is(':checked')){
				var viagensEmDescargaRastreador = new ol.layer.Vector({
				    source: self.viagensEmDescargaRastreadorSource,
				    id: 'viagensEmDescargaRastreador'
				});
				
				self.map.addLayer(viagensEmDescargaRastreador);
				self.setClusters(self.viagensEmDescargaRastreadorSource, 'viagensEmDescargaRastreadorCluster');
			}else{
				self.removeLayer('viagensEmDescargaRastreador');
				self.removeLayer('viagensEmDescargaRastreadorCluster');
			}
			
			if($('#exibirEmTransito').is(':checked')){
				var viagensEmTransitoRastreador = new ol.layer.Vector({
				    source: self.viagensEmTransitoRastreadorSource,
				    id: 'viagensEmTransitoRastreador'
				});
				
				self.map.addLayer(viagensEmTransitoRastreador);
				self.setClusters(self.viagensEmTransitoRastreadorSource, 'viagensEmTransitoRastreadorCluster');
			}else{
				self.removeLayer('viagensEmTransitoRastreador');
				self.removeLayer('viagensEmTransitoRastreadorCluster');
			}
			
		}else{
			
			if($('#exibirEmUso').is(':checked')){
				var viagensEmCargaRastreador = new ol.layer.Vector({
				    source: self.viagensEmCargaRastreadorSource,
				    id: 'viagensEmCargaRastreador'
				});
				
				self.map.addLayer(viagensEmCargaRastreador);
				self.setClusters(self.viagensEmCargaRastreadorSource, 'viagensEmCargaRastreadorDedicadoCluster');
				
				var viagensEmDescargaRastreador = new ol.layer.Vector({
				    source: self.viagensEmDescargaRastreadorSource,
				    id: 'viagensEmDescargaRastreador'
				});
				
				self.map.addLayer(viagensEmDescargaRastreador);
				self.setClusters(self.viagensEmDescargaRastreadorSource, 'viagensEmDescargaRastreadorDedicadoCluster');
				
				var viagensEmTransitoRastreador = new ol.layer.Vector({
				    source: self.viagensEmTransitoRastreadorSource,
				    id: 'viagensEmTransitoRastreador'
				});
				
				self.map.addLayer(viagensEmTransitoRastreador);
				self.setClusters(self.viagensEmTransitoRastreadorSource, 'viagensEmTransitoRastreadorDedicadoCluster');
			}else{
				self.removeLayer('viagensEmCargaRastreador');
				self.removeLayer('viagensEmDescargaRastreador');
				self.removeLayer('viagensEmTransitoRastreador');
				self.removeLayer('viagensEmCargaRastreadorDedicadoCluster');
				self.removeLayer('viagensEmDescargaRastreadorDedicadoCluster');
				self.removeLayer('viagensEmTransitoRastreadorDedicadoCluster');
			}
			
			if($('#exibirVazio').is(':checked')){
				var veiculoVazioRastreador = new ol.layer.Vector({
				    source: self.veiculosVazioRastreadorSource,
				    id: 'veiculoVazioRastreador'
				});
				
				self.map.addLayer(veiculoVazioRastreador);
				self.setClusters(self.veiculosVazioRastreadorSource, 'veiculoVazioRastreadorCluster');
			}else{
				self.removeLayer('veiculoVazioRastreador');
				self.removeLayer('veiculoVazioRastreadorCluster');
			}
		}
		
	} else {
		self.removeLayer('viagensEmCargaRastreador');
		self.removeLayer('viagensEmDescargaRastreador');
		self.removeLayer('viagensEmTransitoRastreador');
		self.removeLayer('veiculoVazioRastreador');
		self.removeLayer('viagensEmCargaRastreadorCluster');
		self.removeLayer('viagensEmDescargaRastreadorCluster');
		self.removeLayer('viagensEmTransitoRastreadorCluster');
		self.removeLayer('viagensEmCargaRastreadorDedicadoCluster');
		self.removeLayer('viagensEmDescargaRastreadorDedicadoCluster');
		self.removeLayer('viagensEmTransitoRastreadorDedicadoCluster');
		self.removeLayer('veiculoVazioRastreadorCluster');
	}
};

radarViagensFactory.prototype.toggleApp = function (exibir) {
	var self = this;
	$(self.element).popover('destroy');
	
	if(exibir){
		if($('#exibirPlanosAtivos').is(':checked')){
			
			if($('#exibirEmCarga').is(':checked')){
				var viagensEmCargaApp = new ol.layer.Vector({
				    source: self.viagensEmCargaAppSource,
				    id: 'viagensEmCargaApp'
				});
				
				self.map.addLayer(viagensEmCargaApp);
				self.setClusters(self.viagensEmCargaAppSource, 'viagensEmCargaAppCluster');
			}else{
				self.removeLayer('viagensEmCargaApp');
				self.removeLayer('viagensEmCargaAppCluster');
			}
			
			if($('#exibirEmDescarga').is(':checked')){
				var viagensEmDescargaApp = new ol.layer.Vector({
				    source: self.viagensEmDescargaAppSource,
				    id: 'viagensEmDescargaApp'
				});
				
				self.map.addLayer(viagensEmDescargaApp);
				self.setClusters(self.viagensEmDescargaAppSource, 'viagensEmDescargaAppCluster');
			}else{
				self.removeLayer('viagensEmDescargaApp');
				self.removeLayer('viagensEmDescargaAppCluster');
			}
			
			if($('#exibirEmTransito').is(':checked')){
				var viagensEmTransitoApp = new ol.layer.Vector({
				    source: self.viagensEmTransitoAppSource,
				    id: 'viagensEmTransitoApp'
				});
				
				self.map.addLayer(viagensEmTransitoApp);
				self.setClusters(self.viagensEmTransitoAppSource, 'viagensEmTransitoAppCluster');
			}else{
				self.removeLayer('viagensEmTransitoApp');
				self.removeLayer('viagensEmTransitoAppCluster');
			}
		
		}else{
			if($('#exibirEmUso').is(':checked')){
				var viagensEmCargaApp = new ol.layer.Vector({
				    source: self.viagensEmCargaAppSource,
				    id: 'viagensEmCargaApp'
				});
				
				self.map.addLayer(viagensEmCargaApp);
				self.setClusters(self.viagensEmCargaAppSource, 'viagensEmCargaAppDedicadoCluster');
				
				var viagensEmDescargaApp = new ol.layer.Vector({
				    source: self.viagensEmDescargaAppSource,
				    id: 'viagensEmDescargaApp'
				});
				
				self.map.addLayer(viagensEmDescargaApp);
				self.setClusters(self.viagensEmDescargaAppSource, 'viagensEmDescargaAppDedicadoCluster');
				
				var viagensEmTransitoApp = new ol.layer.Vector({
				    source: self.viagensEmTransitoAppSource,
				    id: 'viagensEmTransitoApp'
				});
				
				self.map.addLayer(viagensEmTransitoApp);
				self.setClusters(self.viagensEmTransitoAppSource, 'viagensEmTransitoAppDedicadoCluster');
			}else{
				self.removeLayer('viagensEmCargaApp');
				self.removeLayer('viagensEmDescargaApp');
				self.removeLayer('viagensEmTransitoApp');
				self.removeLayer('viagensEmCargaAppDedicadoCluster');
				self.removeLayer('viagensEmDescargaAppDedicadoCluster');
				self.removeLayer('viagensEmTransitoAppDedicadoCluster');
			}
			
			if($('#exibirVazio').is(':checked')){
				var veiculoVazioApp = new ol.layer.Vector({
				    source: self.veiculosVazioAppSource,
				    id: 'veiculoVazioApp'
				});
				
				self.map.addLayer(veiculoVazioApp);
				self.setClusters(self.veiculosVazioAppSource, 'veiculoVazioAppCluster');
			}else{
				self.removeLayer('veiculoVazioApp');
				self.removeLayer('veiculoVazioAppCluster');
			}
		}
	} else {
		self.removeLayer('viagensEmCargaApp');
		self.removeLayer('viagensEmDescargaApp');
		self.removeLayer('viagensEmTransitoApp');
		self.removeLayer('veiculoVazioApp');
		self.removeLayer('viagensEmCargaAppCluster');
		self.removeLayer('viagensEmDescargaAppCluster');
		self.removeLayer('viagensEmTransitoAppCluster');
		self.removeLayer('veiculoVazioAppCluster');
		self.removeLayer('viagensEmCargaAppDedicadoCluster');
		self.removeLayer('viagensEmDescargaAppDedicadoCluster');
		self.removeLayer('viagensEmTransitoAppDedicadoCluster');
	}
};

radarViagensFactory.prototype.toggleAppRastreador = function (exibir) {
	var self = this;
	$(self.element).popover('destroy');
	
	if(exibir){
		if($('#exibirPlanosAtivos').is(':checked')){
			
			if($('#exibirEmCarga').is(':checked')){
				var viagensEmCargaAppRastreador = new ol.layer.Vector({
				    source: self.viagensEmCargaAppRastreadorSource,
				    id: 'viagensEmCargaAppRastreador'
				});
				
				self.map.addLayer(viagensEmCargaAppRastreador);
				self.setClusters(self.viagensEmCargaAppRastreadorSource, 'viagensEmCargaAppRastreadorCluster');
			}else{
				self.removeLayer('viagensEmCargaAppRastreador');
				self.removeLayer('viagensEmCargaAppRastreadorCluster');
			}
			
			if($('#exibirEmDescarga').is(':checked')){
				var viagensEmDescargaAppRastreador = new ol.layer.Vector({
				    source: self.viagensEmDescargaAppRastreadorSource,
				    id: 'viagensEmDescargaAppRastreador'
				});
				
				self.map.addLayer(viagensEmDescargaAppRastreador);
				self.setClusters(self.viagensEmDescargaAppRastreadorSource, 'viagensEmDescargaAppRastreadorCluster');
			}else{
				self.removeLayer('viagensEmDescargaAppRastreador');
				self.removeLayer('viagensEmDescargaAppRastreadorCluster');
			}
	
			if($('#exibirEmTransito').is(':checked')){
				var viagensEmTransitoAppRastreador = new ol.layer.Vector({
				    source: self.viagensEmTransitoAppRastreadorSource,
				    id: 'viagensEmTransitoAppRastreador'
				});
				
				self.map.addLayer(viagensEmTransitoAppRastreador);
				self.setClusters(self.viagensEmTransitoAppRastreadorSource, 'viagensEmTransitoAppRastreadorCluster');
			}else{
				self.removeLayer('viagensEmTransitoAppRastreador');
				self.removeLayer('viagensEmTransitoAppRastreadorCluster');
			}
		}else{
			
			if($('#exibirEmUso').is(':checked')){
				var viagensEmCargaAppRastreador = new ol.layer.Vector({
				    source: self.viagensEmCargaAppRastreadorSource,
				    id: 'viagensEmCargaAppRastreador'
				});
				
				self.map.addLayer(viagensEmCargaAppRastreador);
				self.setClusters(self.viagensEmCargaAppRastreadorSource, 'viagensEmCargaAppRastreadorDedicadoCluster');
				
				var viagensEmDescargaAppRastreador = new ol.layer.Vector({
				    source: self.viagensEmDescargaAppRastreadorSource,
				    id: 'viagensEmDescargaAppRastreador'
				});
				
				self.map.addLayer(viagensEmDescargaAppRastreador);
				self.setClusters(self.viagensEmDescargaAppRastreadorSource, 'viagensEmDescargaAppRastreadorDedicadoCluster');
				
				var viagensEmTransitoAppRastreador = new ol.layer.Vector({
				    source: self.viagensEmTransitoAppRastreadorSource,
				    id: 'viagensEmTransitoAppRastreador'
				});
				
				self.map.addLayer(viagensEmTransitoAppRastreador);
				self.setClusters(self.viagensEmTransitoAppRastreadorSource, 'viagensEmTransitoAppRastreadorDedicadoCluster');
			}else{
				self.removeLayer('viagensEmCargaAppRastreador');
				self.removeLayer('viagensEmDescargaAppRastreador');
				self.removeLayer('viagensEmTransitoAppRastreador');
				self.removeLayer('viagensEmCargaAppRastreadorDedicadoCluster');
				self.removeLayer('viagensEmDescargaAppRastreadorDedicadoCluster');
				self.removeLayer('viagensEmTransitoAppRastreadorDedicadoCluster');
			}
			
			if($('#exibirVazio').is(':checked')){
				var veiculoVazioAppRastreador = new ol.layer.Vector({
				    source: self.veiculosVazioAppRastreadorSource,
				    id: 'veiculoVazioAppRastreador'
				});
				
				self.map.addLayer(veiculoVazioAppRastreador);
				self.setClusters(self.veiculosVazioAppRastreadorSource, 'veiculoVazioAppRastreadorCluster');
			}else{
				self.removeLayer('veiculoVazioAppRastreador');
				self.removeLayer('veiculoVazioAppRastreadorCluster');
			}
		}
	} else {
		self.removeLayer('viagensEmCargaAppRastreador');
		self.removeLayer('viagensEmDescargaAppRastreador');
		self.removeLayer('viagensEmTransitoAppRastreador');
		self.removeLayer('veiculoVazioAppRastreador');
		self.removeLayer('viagensEmCargaAppRastreadorCluster');
		self.removeLayer('viagensEmDescargaAppRastreadorCluster');
		self.removeLayer('viagensEmTransitoAppRastreadorCluster');
		self.removeLayer('veiculoVazioAppRastreadorCluster');
		self.removeLayer('viagensEmCargaAppRastreadorDedicadoCluster');
		self.removeLayer('viagensEmDescargaAppRastreadorDedicadoCluster');
		self.removeLayer('viagensEmTransitoAppRastreadorDedicadoCluster');
	}
};

radarViagensFactory.prototype.toggleEntidadeVinculada = function (exibir) {
	var self = this;
	$(self.element).popover('destroy');
	
	if(exibir){
		if($('#exibirPlanosAtivos').is(':checked')){
			
			self.removeLayer('entidadeVinculada');
			self.removeLayer('entidadeVinculadaCluster');
		
		}else{
			
			var entidadeVinculada = new ol.layer.Vector({
			    source: self.entidadeVinculadaSource,
			    id: 'entidadeVinculada'
			});
				
			self.map.addLayer(entidadeVinculada);
			self.setClusters(self.entidadeVinculadaSource, 'entidadeVinculadaCluster');
			
		}
	} else {
		self.removeLayer('entidadeVinculada');
		self.removeLayer('entidadeVinculadaCluster');
	}
};

/**
 * Cria o básico do mapa
 */

radarViagensFactory.prototype.mapActions = function () {
    //Cria a variavel self para não perder a referência dentro do objeto
    var self = this;

    //Criando uma referência à variavel map
    var map = this.map;

    //Ações que acontecem quando o mapa se movimenta, como a ação de ZOOM
    map.on("moveend", function () {
        //Seleciona o zoom atual
        var currentZoom = self.map.getView().getZoom();
        //Seleciona os layers
        var layers = self.map.getLayers();
        //Seleciona os overlays
        var overlays = self.map.getOverlays();

        //Para cada overlay faça..
        overlays.forEach(function (overlay) {
            //Pega a lista de classes do elemento
            var classList = overlay.getElement().classList;
            //Caso haja a classe radiusLabel e caso o zoom seja menor do que 7, esconda os labels do radar
            if (classList.toString().indexOf('radiusLabel') > -1) {
                if (currentZoom < 7) {
                    overlay.setOffset([-1000, -1000]);
                }
                else {
                    overlay.setOffset([0, 0]);
                }
            }
        });

        //para cada layer, caso tenha a id, esconda o layer caso o zoom seja menor do que 4
        layers.forEach(function (layer) {
        	if($('#exibirPlanosAtivos').is(':checked')){
	        	if (layer.get('id') == 'viagensEmCargaRastreador' ||
	            	layer.get('id') == 'viagensEmCargaApp' ||
	            	layer.get('id') == 'viagensEmCargaAppRastreador' ||
	            	layer.get('id') == 'viagensEmDescargaRastreador' ||
	            	layer.get('id') == 'viagensEmDescargaApp' ||
	            	layer.get('id') == 'viagensEmDescargaAppRastreador' ||
	            	layer.get('id') == 'viagensEmTransitoRastreador' ||
	            	layer.get('id') == 'viagensEmTransitoApp' ||
	            	layer.get('id') == 'viagensEmTransitoAppRastreador') {
	            	
	        		if (currentZoom < 4) {
	                    layer.setVisible(false);
	                    $('.popover').hide();
	                } else {
	                    layer.setVisible(true);
	                    $('.radiusLabel').fadeIn();
	                    $('.popover').show();
	                }
	        	}else{
	        		self.removeLayer('viagensEmCargaRastreadorDedicadoCluster');
	        		self.removeLayer('viagensEmCargaAppDedicadoCluster');
	        		self.removeLayer('viagensEmCargaAppRastreadorDedicadoCluster');
	        		self.removeLayer('viagensEmDescargaRastreadorDedicadoCluster');
	        		self.removeLayer('viagensEmDescargaAppDedicadoCluster');
	        		self.removeLayer('viagensEmDescargaAppRastreadorDedicadoCluster');
	        		self.removeLayer('viagensEmTransitoRastreadorDedicadoCluster');
	        		self.removeLayer('viagensEmTransitoAppDedicadoCluster');
	        		self.removeLayer('viagensEmTransitoAppRastreadorDedicadoCluster');
	        		self.removeLayer('veiculoVazioRastreadorCluster');
	        		self.removeLayer('veiculoVazioAppCluster');
	        		self.removeLayer('veiculoVazioAppRastreadorCluster');
	        		self.removeLayer('entidadeVinculadaCluster');
	        	}
        	}else{
	        	if (layer.get('id') == 'viagensEmCargaRastreador' ||
		            layer.get('id') == 'viagensEmCargaApp' ||
		            layer.get('id') == 'viagensEmCargaAppRastreador' ||
		            layer.get('id') == 'viagensEmDescargaRastreador' ||
		            layer.get('id') == 'viagensEmDescargaApp' ||
		            layer.get('id') == 'viagensEmDescargaAppRastreador' ||
		            layer.get('id') == 'viagensEmTransitoRastreador' ||
		            layer.get('id') == 'viagensEmTransitoApp' ||
		            layer.get('id') == 'viagensEmTransitoAppRastreador' ||
	        		layer.get('id') == 'veiculoVazioRastreador' ||
	            	layer.get('id') == 'veiculoVazioApp' ||
	            	layer.get('id') == 'veiculoVazioAppRastreador' ||
	            	layer.get('id') == 'entidadeVinculada') {
	            
	                if (currentZoom < 4) {
	                    layer.setVisible(false);
	                    $('.popover').hide();
	                } else {
	                    layer.setVisible(true);
	                    $('.radiusLabel').fadeIn();
	                    $('.popover').show();
	                }
	        	}else{
	        		self.removeLayer('viagensEmCargaRastreadorCluster');
	        		self.removeLayer('viagensEmCargaAppCluster');
	        		self.removeLayer('viagensEmCargaAppRastreadorCluster');
	        		self.removeLayer('viagensEmDescargaRastreadorCluster');
	        		self.removeLayer('viagensEmDescargaAppCluster');
	        		self.removeLayer('viagensEmDescargaAppRastreadorCluster');
	        		self.removeLayer('viagensEmTransitoRastreadorCluster');
	        		self.removeLayer('viagensEmTransitoAppCluster');
	        		self.removeLayer('viagensEmTransitoAppRastreadorCluster');
	        	}
        	}
        });

    });

    // display popup on click
    map.on('click', function (evt) {
        //referencia o this para não perder a referência
        var informationPopup = this;
        self.removeLayer('distance');

        //Pega a feature que estiver no alvo do click
        informationPopup.feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            return feature;
        });

        //Caso não seja indefinido e caso as informações não sejam indefinidas, coloca o popup no mapa
        if (typeof informationPopup.feature !== 'undefined' && typeof informationPopup.feature.get('informations') !== 'undefined') {
            //Pega as informações da feature
            var informations = informationPopup.feature.get('informations');
            var entity = informationPopup.feature.get('entity');
            //Caso exista a feature
            if (informationPopup.feature) {
                var geometry = informationPopup.feature.getGeometry();
                var coord = geometry.getCoordinates();
                self.popup.setPosition(coord);

                //Posiciona o popup
                $(self.element).popover({
                    'placement': 'right',
                    'html': true
                });

                function checkNullOrUndefined(data) {
                	if (typeof data === 'undefined' || typeof data === null || data === 'undefined' || data === null ) {
                        return '-';
                    }
                    else {
                        return data;
                    }
                }

                if (!informations.vazio){
	                //Caso sejam informações da Origem
                	
                	//Viagens agrupadas na Origem. Sem Posicao
	                if (informations.desSitua == 'EM CARGA'){
	                	if(!informations.possuiPosicao){
	                		
		                	var viagensOrigem = informations.viagensOrigem;
		                    var veiculosOrigem = informations.veiculosOrigem;
		                    var utilizaSateliteOrigem = informations.utilizaSateliteOrigem;
		                    var utilizaAppInfologOrigem = informations.utilizaAppInfologOrigem;
		                    var sinalSateliteOrigem = informations.sinalSateliteOrigem;
		                    var sinalAppInfologOrigem = informations.sinalAppInfologOrigem;
		                    var dedicadoOrigem = informations.dedicadoOrigem;
		                    var corGrupoVeiculoOrigem = informations.corGrupoVeiculoOrigem;
		                    var imagem = '';
		                    var title = '';
		                    var color = '#FFFFFF';
		                	
		                    var conteudo = '<div class="mapBubble">'
	                    	if(informations.dedicado){
                    			conteudo += '<div class="line" style="background-color: #0A19B3; color:#F2F2F2"><t style="width: 90%">VEICULOS NA ORIGEM</p></div>'
                    		}else{
                    			conteudo += '<div class="line" style="background-color: #3186E1; color:#F2F2F2"><t style="width: 90%">VEICULOS NA ORIGEM</p></div>'
                    		}
	                    	conteudo += '<div class="line"><b style="width: 35%">Entidade de Origem:</b><p style="width: 55%">' + checkNullOrUndefined(informations.nomRemet) + "</p></div>",
	                        conteudo += '<div class="line"><b style="width: 35%">Latitude:</b><p style="width: 55%">' + checkNullOrUndefined(informations.ultimaPosicao.lat) + "</p></div>",
	                        conteudo += '<div class="line"><b style="width: 35%">Longitude:</b><p style="width: 55%">' + checkNullOrUndefined(informations.ultimaPosicao.lon) + "</p></div>"
	                        
	                        conteudo += '<div class="line"><b style="width: 35%">Qtde Total:</b><p style="width: 55%">' + viagensOrigem.length + '</p></div>'
	                        
	                        conteudo += '<div class="line limit-height">';
		                    
		                    var contador = 0;
		                    
		                    viagensOrigem.forEach(function (v) {
		                    	contador++;
		                    	
		                    	//verificacao da imagem correta
		                    	if(dedicadoOrigem[contador-1]){
		                    		
		                    		//verificacao da cor do grupo do veiculo correta
				                	if(corGrupoVeiculoOrigem[contador-1] != null ){
				                		color = corGrupoVeiculoOrigem[contador-1];
				                	}else{
				                		color = '#000099';
				                	}
				                	
			                    	if(utilizaSateliteOrigem[contador-1] && !utilizaAppInfologOrigem[contador-1]){
			                    		if(sinalSateliteOrigem[contador-1] == 'COM_SINAL'){
			                	    		imagem = './images/logistics-truck-carga-dedicado-rastreador_inv.png';
			                	    		title = 'Dedicado com Sinal Satélite';
			                    		}else{
			                	    		imagem = './images/logistics-truck-carga-dedicado-rastreador-perda-sinal_inv.png';
			                	    		title = 'Dedicado Perda Sinal Satélite';
			                	    	}
			                	    }else if(!utilizaSateliteOrigem[contador-1] && utilizaAppInfologOrigem[contador-1]){
			                			if(sinalAppInfologOrigem[contador-1] == 'COM_SINAL'){
			                				imagem = './images/logistics-truck-carga-dedicado-app_inv.png';
			                				title = 'Dedicado com Sinal App';
			                	    	}else{
			                	    		imagem = './images/logistics-truck-carga-dedicado-app-perda-sinal_inv.png';
			                	    		title = 'Dedicado Perda Sinal App';
			                	    	}
			                	    }else if(utilizaSateliteOrigem[contador-1] && utilizaAppInfologOrigem[contador-1]){
			                    		if(sinalSateliteOrigem[contador-1] != 'COM_SINAL' && sinalAppInfologOrigem[contador-1] == 'COM_SINAL'){
			                	    		imagem = './images/logistics-truck-carga-dedicado-app-sinal-rastreador-perda-sinal_inv.png';
			                	    		title = 'Dedicado Perda Sinal Satélite - App Ok';
			                	    	}else if(sinalSateliteOrigem[contador-1] == 'COM_SINAL' && sinalAppInfologOrigem[contador-1] != 'COM_SINAL'){
			                	    		imagem = './images/logistics-truck-carga-dedicado-app-perda-sinal-rastreador-sinal_inv.png';
			                	    		title = 'Dedicado Perda Sinal App - Satélite Ok';
			                	    	}else if(sinalSateliteOrigem[contador-1] == 'COM_SINAL' && sinalAppInfologOrigem[contador-1] == 'COM_SINAL'){
			                	    		imagem = './images/logistics-truck-carga-dedicado-app-rastreador_inv.png';
			                	    		title = 'Dedicado com Sinal Satélite e App';
			                	    	}else{
			                	    		imagem = './images/logistics-truck-carga-dedicado-app-rastreador-perda-sinal_inv.png';
			                	    		title = 'Dedicado Perda Sinal Satélite e App';
			                	    	}
			                	    }else{
			                	    	imagem = './images/logistics-truck-carga-dedicado-rastreador_inv.png';
			                	    	title = 'Dedicado com Sinal Satélite';
			                	    }
		                    	}else{
		                    		color = '#FFFFFF';
		                    		
			                    	if(utilizaSateliteOrigem[contador-1] && !utilizaAppInfologOrigem[contador-1]){
			                    		if(sinalSateliteOrigem[contador-1] == 'COM_SINAL'){
			                	    		imagem = './images/logistics-truck-carga-rastreador.png';
			                	    		title = 'Sinal Satélite';
			                    		}else{
			                	    		imagem = './images/logistics-truck-carga-rastreador-perda-sinal.png';
			                	    		title = 'Perda Sinal Satélite';
			                	    	}
			                	    }else if(!utilizaSateliteOrigem[contador-1] && utilizaAppInfologOrigem[contador-1]){
			                			if(sinalAppInfologOrigem[contador-1] == 'COM_SINAL'){
			                				imagem = './images/logistics-truck-carga-app.png';
			                				title = 'Sinal App';
			                	    	}else{
			                	    		imagem = './images/logistics-truck-carga-app-perda-sinal.png';
			                	    		title = 'Perda Sinal App';
			                	    	}
			                	    }else if(utilizaSateliteOrigem[contador-1] && utilizaAppInfologOrigem[contador-1]){
			                    		if(sinalSateliteOrigem[contador-1] != 'COM_SINAL' && sinalAppInfologOrigem[contador-1] == 'COM_SINAL'){
			                	    		imagem = './images/logistics-truck-carga-app-sinal-rastreador-perda-sinal.png';
			                	    		title = 'Perda Sinal Satélite - App Ok';
			                	    	}else if(sinalSateliteOrigem[contador-1] == 'COM_SINAL' && sinalAppInfologOrigem[contador-1] != 'COM_SINAL'){
			                	    		imagem = './images/logistics-truck-carga-app-perda-sinal-rastreador-sinal.png';
			                	    		title = 'Perda Sinal App - Satélite Ok';
			                	    	}else if(sinalSateliteOrigem[contador-1] == 'COM_SINAL' && sinalAppInfologOrigem[contador-1] == 'COM_SINAL'){
			                	    		imagem = './images/logistics-truck-carga-app-rastreador.png';
			                	    		title = 'Sinal Satélite e App';
			                	    	}else{
			                	    		imagem = './images/logistics-truck-carga-app-rastreador-perda-sinal.png';
			                	    		title = 'Perda Sinal Satélite e App';
			                	    	}
			                	    }else{
			                	    	imagem = './images/logistics-truck-carga-rastreador.png';
			                	    	title = 'Sinal Satélite';
			                	    }
		                    	}
		                    	
		                    	
		                    	if(contador % 2 == 1){
		                    		conteudo += '<div class="estacionamento">';                    
		    	                    conteudo += '<table>';
		    	                    conteudo += '<tbody>';
		    	                    conteudo += '	<tr>';
		                    		conteudo += '        <td>';
		                    		conteudo += '          <img style="width: 30px;background-color:'+ color + ';" src="'+ imagem +'" title="'+title+'">';
		    	                    conteudo += '          <span>' + v + '</span>';
		    	                    conteudo += '          <span>' + veiculosOrigem[contador-1] + '</span>';
		    	                    conteudo += '        </td>';
		                    	}
		                    	if(contador % 2 == 0){
		                    		conteudo += '        <td>';
		    	                    conteudo += '          <img style="width: 30px;background-color:'+ color + ';" src="'+ imagem +'" title="'+title+'">';
		    	                    conteudo += '          <span>' + v + '</span>';
		    	                    conteudo += '          <span>' + veiculosOrigem[contador-1] + '</span>';
		    	                    conteudo += '        </td>';
		    	                    conteudo += '      </tr>';
		    	                    conteudo += '    </tbody>';
		    	                    conteudo += '  </table>';
		    	                    conteudo += '</div>';
		    	            	}
		                    });
		                    
		                    if(viagensOrigem.length % 2 == 1){
		                    	conteudo += '        <td>';
		                    	conteudo += '          <span style="width: 30px;">&nbsp;</span>';
		                    	conteudo += '        </td>';
		                    	conteudo += '      </tr>';
	    	                    conteudo += '    </tbody>';
	    	                    conteudo += '  </table>';
	    	                    conteudo += '</div>';
		                    }
		                    
		                    conteudo += '</div>';
		                    
		                    //Viagem na Origem com posicao
	                	}else{
	                		var destinos = informations.destino
		                    var conteudo = '<div class="mapBubble">'
	                    	if(informations.dedicado){
                    			conteudo += '<div class="line" style="background-color: #0A19B3; color:#F2F2F2"><t style="width: 90%">PLACA: ' + checkNullOrUndefined(informations.numPlacaVei) + ' - [VIAGEM NA ORIGEM]</p></div>'
                    		}else{
                    			conteudo += '<div class="line" style="background-color: #3186E1; color:#F2F2F2"><t style="width: 90%">PLACA: ' + checkNullOrUndefined(informations.numPlacaVei) + ' - [VIAGEM NA ORIGEM]</p></div>'
                    		}
	                    	conteudo += '<div class="line"><b style="width: 35%">Transportadora:</b><p style="width: 55%">' + checkNullOrUndefined(informations.nomTrnsp) + "</p></div>"
	                        conteudo += '<div class="line"><b style="width: 35%">Nº Plano:</b><p style="width: 55%">' + checkNullOrUndefined(informations.ctlPlvia) + "</p></div>",
	    	                conteudo += '<div class="line"><b style="width: 35%">Dhr Última Posição:</b><p style="width: 55%">' + checkNullOrUndefined(informations.ultimaPosicao.dataFormatada) + "</p></div>",
	    	                conteudo += '<div class="line"><b style="width: 35%">Desc.Última Posição:</b><p style="width: 55%">' + checkNullOrUndefined(informations.ultimaPosicao.descricao) + "</p></div>",
	    	                conteudo += '<div class="line"><b style="width: 35%">Latitude:</b><p style="width: 55%">' + checkNullOrUndefined(informations.ultimaPosicao.lat) + "</p></div>",
	                        conteudo += '<div class="line"><b style="width: 35%">Longitude:</b><p style="width: 55%">' + checkNullOrUndefined(informations.ultimaPosicao.lon) + "</p></div>",
	                        conteudo += '<div class="line"><b style="width: 35%">Embarcador:</b><p style="width: 55%">' + checkNullOrUndefined(informations.nomRemet) + "</p></div>"
	                        
	                        //if(informations.dedicado){
	                        	//conteudo += '<div class="line"><b style="width: 35%">Entidade Vinculada:</b><p style="width: 55%">' + checkNullOrUndefined(informations.entidadeVinculada.nome) + "</p></div>"
	                        //}
	                    	
	                        destinos.forEach(function (d) {
	                          	conteudo += '<div class="line"><b style="width: 35%">Destino ' + d.ordem + ':</b><p style="width: 55%">' + checkNullOrUndefined(d.descricao) + "</p></div>"
	    	                });
	                        	
	    	                conteudo += "</div>"
	                	}
	                	
		            //Caso sejam informações de Planos em Trânsito ou No Destino        
	                } else {
	                	var destinos = informations.destino
	                    var conteudo = '<div class="mapBubble">'
                    	if(informations.desSitua == 'EM DESCARGA'){
                    		if(informations.dedicado){
                    			conteudo += '<div class="line" style="background-color: #0A19B3; color:#F2F2F2"><t style="width: 90%">PLACA: ' + checkNullOrUndefined(informations.numPlacaVei) + ' - [VIAGEM NO DESTINO]</p></div>'
                    		}else{
                    			conteudo += '<div class="line" style="background-color: #3186E1; color:#F2F2F2"><t style="width: 90%">PLACA: ' + checkNullOrUndefined(informations.numPlacaVei) + ' - [VIAGEM NO DESTINO]</p></div>'
                    		}
                    	}
	                    if(informations.desSitua == 'EM TRANSITO'){
	                    	if(informations.dedicado){
                    			conteudo += '<div class="line" style="background-color: #0A19B3; color:#F2F2F2"><t style="width: 90%">PLACA: ' + checkNullOrUndefined(informations.numPlacaVei) + ' - [VIAGEM EM TRANSITO]</p></div>'
                    		}else{
                    			conteudo += '<div class="line" style="background-color: #3186E1; color:#F2F2F2"><t style="width: 90%">PLACA: ' + checkNullOrUndefined(informations.numPlacaVei) + ' - [VIAGEM NO TRANSITO]</p></div>'
                    		}
	                	}
	                    conteudo += '<div class="line"><b style="width: 35%">Transportadora:</b><p style="width: 55%">' + checkNullOrUndefined(informations.nomTrnsp) + "</p></div>"
                    	conteudo += '<div class="line"><b style="width: 35%">Nº Plano:</b><p style="width: 55%">' + checkNullOrUndefined(informations.ctlPlvia) + "</p></div>",
	                    conteudo += '<div class="line"><b style="width: 35%">Dhr Última Posição:</b><p style="width: 55%">' + checkNullOrUndefined(informations.ultimaPosicao.dataFormatada) + "</p></div>",
	                    conteudo += '<div class="line"><b style="width: 35%">Desc.Última Posição:</b><p style="width: 55%">' + checkNullOrUndefined(informations.ultimaPosicao.descricao) + "</p></div>",
	                    conteudo += '<div class="line"><b style="width: 35%">Latitude:</b><p style="width: 55%">' + checkNullOrUndefined(informations.ultimaPosicao.lat) + "</p></div>",
                        conteudo += '<div class="line"><b style="width: 35%">Longitude:</b><p style="width: 55%">' + checkNullOrUndefined(informations.ultimaPosicao.lon) + "</p></div>",
                        conteudo += '<div class="line"><b style="width: 35%">Embarcador:</b><p style="width: 55%">' + checkNullOrUndefined(informations.nomRemet) + "</p></div>",
                                                
                        destinos.forEach(function (d) {
                        	conteudo += '<div class="line"><b style="width: 35%">Destino ' + d.ordem + ':</b><p style="width: 55%">' + checkNullOrUndefined(d.descricao) + "</p></div>"
	                    });
                    	
	                    conteudo += "</div>"
	                }
	                
            	//Caso seja as informações de entidade com veículos vazios
            	}else{
            		if ((informations.utilizaSatelite && !informations.utilizaAppInfolog && informations.sinalSatelite != 'COM_SINAL') || 
            				(!informations.utilizaSatelite && informations.utilizaAppInfolog && informations.sinalAppInfolog != 'COM_SINAL') ||
            				(informations.utilizaSatelite && informations.utilizaAppInfolog && informations.sinalSatelite != 'COM_SINAL' && informations.sinalAppInfolog != 'COM_SINAL') ||
                    		(!informations.utilizaSatelite && !informations.utilizaAppInfolog)){
	                	var veiculosVazios = informations.veiculosVazios;
	                    var utilizaSateliteVazios = informations.utilizaSateliteVazios;
	                    var utilizaAppInfologVazios = informations.utilizaAppInfologVazios;
	                    var sinalSateliteVazios = informations.sinalSateliteVazios;
	                    var sinalAppInfologVazios = informations.sinalAppInfologVazios;
	                    var corGrupoVeiculosVazios = informations.corGrupoVeiculosVazios;
	                    
	                    var contador = 0;
	                    var qtdSatPerdaSinal = 0;
	                    var qtdAppPerdaSinal = 0;
	                    var qtdSatPerdaSinalAppOk = 0;
	                    var qtdAppPerdaSinalSatOk = 0;
	                    var qtdSatPerdaSinalAppPerdaSinal = 0;
	                    var qtdPerdaSinal = 0;
	                    var qtdSemSinal = 0;
		                var complemento = '';
		                var imagem = '';
		                var title = '';
		                var color = '#000099';
		                
		                veiculosVazios.forEach(function (v) {
		                	contador++;
		                    
		                	//verificacao da cor do grupo do veiculo correta
		                	if(corGrupoVeiculosVazios[contador-1] != null ){
		                		color = corGrupoVeiculosVazios[contador-1];
		                	}else{
		                		color = '#000099';
		                	}
		                	
	                    	//verificacao da imagem correta
	                    	if(utilizaSateliteVazios[contador-1] && !utilizaAppInfologVazios[contador-1]){
	                			if(sinalSateliteVazios[contador-1] == 'PERDA_SINAL'){
	                	    		imagem = './images/delivery-truck-vazio-dedicado-rastreador-perda-sinal_inv.png';
	                	    		title = 'Perda Sinal Satélite';
	                	    		qtdSatPerdaSinal++;
	                	    	}else{
	                	    		imagem = './images/delivery-truck-vazio-dedicado_maior24_inv.png';
	                	    		title = 'Perda Sinal Acima 24hrs';
	                	    		qtdPerdaSinal++;
	                	    	}
	                	    }else if(!utilizaSateliteVazios[contador-1] && utilizaAppInfologVazios[contador-1]){
	                			if(sinalAppInfologVazios[contador-1] == 'PERDA_SINAL'){
	                				imagem = './images/delivery-truck-vazio-dedicado-app-perda-sinal_inv.png';
	                				title = 'Perda Sinal App';
	                				qtdAppPerdaSinal++;
	                	    	}else{
	                	    		imagem = './images/delivery-truck-vazio-dedicado_maior24_inv.png';
	                	    		title = 'Perda Sinal Acima 24hrs';
	                	    		qtdPerdaSinal++;
	                	    	}
	                	    }else if(utilizaSateliteVazios[contador-1] && utilizaAppInfologVazios[contador-1]){
	                    		if(sinalSateliteVazios[contador-1] != 'PERDA_SINAL' && sinalAppInfologVazios[contador-1] == 'PERDA_SINAL'){
	                	    		imagem = './images/delivery-truck-vazio-dedicado-app-perda-sinal-rastreador_inv.png';
	                	    		title = 'Perda Sinal App - Satélite Ok';
	                	    		qtdAppPerdaSinalSatOk++;
	                	    	}else if(sinalSateliteVazios[contador-1] == 'PERDA_SINAL' && sinalAppInfologVazios[contador-1] != 'PERDA_SINAL'){
	                	    		imagem = './images/delivery-truck-vazio-dedicado-app-rastreador-perda-sinal_inv.png';
	                	    		title = 'Perda Sinal Satélite - App Ok';
	                	    		qtdSatPerdaSinalAppOk++;
	                	    	}else if(sinalSateliteVazios[contador-1] == 'PERDA_SINAL' && sinalAppInfologVazios[contador-1] == 'PERDA_SINAL'){
	                	    		imagem = './images/delivery-truck-vazio-dedicado-app-perda-sinal-rastreador-perda-sinal_inv.png';
	                	    		title = 'Perda Sinal Satélite e App';
	                	    		qtdSatPerdaSinalAppPerdaSinal++;
	                	    	}else{
	                	    		imagem = './images/delivery-truck-vazio-dedicado_maior24_inv.png';
	                	    		title = 'Perda Sinal Acima 24hrs';
	                	    		qtdPerdaSinal++;
	                	    	}
	                	    }else{
	                	    	imagem = './images/delivery-truck-vazio-dedicado-sem-sinal_inv.png';
	                	    	title = 'Sem Sinal';
	                	    	qtdSemSinal++;
	                	    }
	                    	
	                    	if(contador % 2 == 1){
	                    		complemento += '<div class="estacionamento">';                    
	                    		complemento += '<table class="limit-height">';
	                    		complemento += '<tbody>';
	                    		complemento += '	<tr>';
	                    		complemento += '        <td>';
	                    		complemento += '          <img style="width: 30px;background-color:'+ color +'" src="'+ imagem +'" title="'+ title + '">';
	                    		complemento += '          <span>' + v + '</span>';
	                    		complemento += '        </td>';
	                    	}
	                    	if(contador % 2 == 0){
	                    		complemento += '        <td>';
	                    		complemento += '          <img style="width: 30px;background-color:'+ color +'" src="'+ imagem +'" title="'+ title + '">';
	                    		complemento += '          <span>' + v + '</span>';
	                    		complemento += '        </td>';
	                    		complemento += '      </tr>';
	                    		complemento += '    </tbody>';
	                    		complemento += '  </table>';
	                    		complemento += '</div>';
	    	            	}
	                    });
		                    
		                var conteudo = '<div class="mapBubble">'
		                	conteudo += '<div class="line" style="background-color: #B2B2B2;"><t style="width: 100%">VEICULOS COM PERDA/SEM SINAL</p></div>',
	                    	conteudo += '<div class="line"><b style="width: 35%">Entidade Vinculada:</b><p style="width: 55%">' + checkNullOrUndefined(informations.entidadeVinculada.nome) + "</p></div>",
	                        conteudo += '<div class="line"><b style="width: 35%">Latitude:</b><p style="width: 55%">' + checkNullOrUndefined(informations.ultimaPosicao.lat) + "</p></div>",
	                        conteudo += '<div class="line"><b style="width: 35%">Longitude:</b><p style="width: 55%">' + checkNullOrUndefined(informations.ultimaPosicao.lon) + "</p></div>",
	                        conteudo += '<div class="line"><b style="width: 35%">Qtde Total Vazios:</b><p style="width: 55%">' + veiculosVazios.length + "</p></div>"
	                        
	                        if(contador>0){
	                        	conteudo += '<div class="line"><b style="width: 35%">Qtde Perda Sinal:</b><p style="width: 55%">&nbsp;</p></div>'
	                        }
	                        if(qtdSatPerdaSinal>0){
	                        	conteudo += '<div class="line"><b style="width: 35%"><img style="width: 20px;background-color:#000099;" src="./images/delivery-truck-vazio-dedicado-rastreador-perda-sinal_inv.png" title="Perda Sinal Satélite"></b>',
	                        	conteudo += '<p style="width: 55%">' + qtdSatPerdaSinal + "</p></div>"
	                        }
		                	if(qtdAppPerdaSinal>0){
		                		conteudo += '<div class="line"><b style="width: 35%"><img style="width: 20px;background-color:#000099;" src="./images/delivery-truck-vazio-dedicado-app-perda-sinal_inv.png" title="Perda Sinal App"></b>',
		                		conteudo += '<p style="width: 55%">' + qtdAppPerdaSinal + "</p></div>"
		                	}
		                	if(qtdSatPerdaSinalAppOk>0){
		                		conteudo += '<div class="line"><b style="width: 35%"><img style="width: 20px;background-color:#000099;" src="./images/delivery-truck-vazio-dedicado-app-rastreador-perda-sinal_inv.png" title="Perda Sinal Satélite - App Ok"></b>',
		                		conteudo += '<p style="width: 55%">' + qtdSatPerdaSinalAppOk + "</p></div>"
	                        }
		                	if(qtdAppPerdaSinalSatOk>0){
		                		conteudo += '<div class="line"><b style="width: 35%"><img style="width: 20px;background-color:#000099;" src="./images/delivery-truck-vazio-dedicado-app-perda-sinal-rastreador_inv.png" title="Perda Sinal App - Satélite Ok"></b>',
		                		conteudo += '<p style="width: 55%">' + qtdAppPerdaSinalSatOk + "</p></div>"
	                        }
		                	if(qtdSatPerdaSinalAppPerdaSinal>0){
		                		conteudo += '<div class="line"><b style="width: 35%"><img style="width: 20px;background-color:#000099;" src="./images/delivery-truck-vazio-dedicado-app-perda-sinal-rastreador-perda-sinal_inv.png" title="Perda Sinal Satélite e App"></b>',
		                		conteudo += '<p style="width: 55%">' + qtdSatPerdaSinalAppPerdaSinal + "</p></div>"
	                        }
		                	if(qtdPerdaSinal>0){
		                		conteudo += '<div class="line"><b style="width: 35%"><img style="width: 20px;background-color:#000099;" src="./images/delivery-truck-vazio-dedicado_maior24_inv.png" title="Perda Sinal Acima 24hrs"></b>',
		                		conteudo += '<p style="width: 55%">' + qtdPerdaSinal + "</p></div>"
	                        }
		                	if(qtdSemSinal>0){
		                		conteudo += '<div class="line"><b style="width: 35%"><img style="width: 20px;background-color:#000099;" src="./images/delivery-truck-vazio-dedicado-sem-sinal_inv.png" title="Sem Sinal"></b>',
		                		conteudo += '<p style="width: 55%">' + qtdSemSinal + "</p></div>"
		                	}
		                	
		                	if(contador>0){
		                		conteudo += '<div class="line limit-height">' + complemento;
		                	}
			            if((contador>0) && (veiculosVazios.length % 2 == 1)){
			            	conteudo += '        <td>';
			            	conteudo += '          <span style="width: 30px;">&nbsp;</span>';
			            	conteudo += '        </td>';
			            	conteudo += '      </tr>';
			            	conteudo += '    </tbody>';
			            	conteudo += '  </table>';
			            	conteudo += '</div>';
	                    }
	                        
			            conteudo += '</div>';
		            
			        //Caso seja as informações de veículos vazio
	                }else{
	                	var conteudo = '<div class="mapBubble">'
	                	conteudo += '<div class="line" style="background-color: #B2B2B2;"><t style="width: 100%">PLACA: ' + checkNullOrUndefined(informations.placa) + ' - [VEICULO VAZIO]</p></div>',
                    	conteudo += '<div class="line"><b style="width: 35%">Entidade Vinculada:</b><p style="width: 55%">' + checkNullOrUndefined(informations.entidadeVinculada.nome) + "</p></div>",
	                    conteudo += '<div class="line"><b style="width: 35%">Latitude:</b><p style="width: 55%">' + checkNullOrUndefined(informations.ultimaPosicao.lat) + "</p></div>",
	                    conteudo += '<div class="line"><b style="width: 35%">Longitude:</b><p style="width: 55%">' + checkNullOrUndefined(informations.ultimaPosicao.lon) + "</p></div>"
	                    conteudo += '<div class="line"><b style="width: 35%">Dhr Última Posição:</b><p style="width: 55%">' + checkNullOrUndefined(informations.ultimaPosicao.dataFormatada) + "</p></div>",
	                    conteudo += '<div class="line"><b style="width: 35%">Desc.Última Posição:</b><p style="width: 55%">' + checkNullOrUndefined(informations.ultimaPosicao.descricao) + "</p></div>",
                        conteudo += "</div>"
	                }
            	}

                //Mostra o popup
                $(self.element).data('bs.popover').options.content = conteudo;
                $(self.element).popover('show');
            }
            
            //Caso a feature mude de posição, coloca o popup na posição correta
            informationPopup.feature.on('change', function () {
                var geometry = informationPopup.feature.getGeometry();
                var coord = geometry.getCoordinates();
                self.popup.setPosition(coord);

                $(self.element).popover({
                    'placement': 'right',
                    'html': true
                });
            })
        }
        else {
            //Destroi o popup caso seja clicado fora de um alvo
            $(self.element).popover('destroy');
        }
    });

    // Muda o cursor quando estiver sob o alvo
    map.on('pointermove', function (evt) {
        pixel = map.getEventPixel(evt.originalEvent);
        hit = map.hasFeatureAtPixel(pixel);
        map.getTarget().style.cursor = hit ? 'pointer' : '';
        if (hit) {
            self.delay(function () {
                //self.matriz
                //Pega a feature que estiver no alvo do click
                this.feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
                    var type = feature.get('type');
                    if (type == 'vehicle') {
                        var coordinates = feature.getGeometry().getCoordinates();
                    }
                });
            }, 50);
        }
    });
}

/**
 * Adiciona um raio ao mapa
 * @param {string} elementID - Nome do elemento, é por ele que é identificado o raio, como uma
 * @param {string} radiusName - Nome do raio
 * @param {array} coordenadas - coordenadas onde deve centralizar o raio
 * @param {number} raio - o tamanho do raio
 * @param {function} styleType - o estilo a ser aplicado ao raio
 */

radarViagensFactory.prototype.addTarget = function (elementId, radiusName, coordenadas, raio, styleType) {
    // referencia o mapa em uma var
    var map = this.map;

    this.radiusGeometry = new ol.Feature({
        geometry: new ol.geom.Circle(ol.proj.transform(coordenadas, 'EPSG:4326', 'EPSG:3857'), raio),
        name: elementId,
        id: elementId
    });

    this.radiusGeometry.setId(elementId);
    this.radiusGeometry.setStyle(styleType);
    this.radiusSource.addFeature(this.radiusGeometry);
}

/**
 * Adiciona uma linha para simular a rotação de um ponteiro de radar
 * @param {array} coordenadas - as cordenadas do centro do ponteiro
 */

radarViagensFactory.prototype.radarPointer = function (coordenadas) {
    var map = this.map;
    var findBorder = 300000 / 122222;

    this.radarGeometry = new ol.Feature({
        geometry: new ol.geom.LineString([
            ol.proj.transform(coordenadas, 'EPSG:4326', 'EPSG:3857'),
            ol.proj.transform([coordenadas[0], coordenadas[1] + findBorder], 'EPSG:4326', 'EPSG:3857')
        ]),
    });

    this.radarGeometry.setId('radarPointer');

    this.radarGeometry.setStyle(new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'green',
            width: 2
        })
    }))

    this.radarSource.addFeature(this.radarGeometry);
}

/**
 * Adiciona 4 circulos simulando um alvo
 * @param {string} - id para ser usado como prefixo no nome do raio
 * @param {array} - coordenadas do centro do alvo
 * @param {number} - raio tamanho do raio
 */

radarViagensFactory.prototype.addNewTargetRadius = function (id, coordenadas, raio) {
    var lon = coordenadas[0];
    var lat = coordenadas[1];

    this.addTarget(id + '_incoming', id + '_radiusName1', coordenadas, raio[3], this.INCOMING(raio[3]));
    this.addTarget(id + '_alert', id + '_radiusName2', coordenadas, raio[2], this.ALERT(raio[2]));
    this.addTarget(id + '_danger', id + '_radiusName3', coordenadas, raio[1], this.DANGER(raio[1]));
    this.addTarget(id + '_extreme', id + '_radiusName4', coordenadas, raio[0], this.EXTREME(raio[0]));
    this.radarPointer(coordenadas);


    //Calcula aproximadamente a borda de cada alvo
    var calcLat = function (size, position) {
        var oneDeg = 122222;
        var findBorder = size / oneDeg;
        calc = 0;
        switch (position) {
            case 'top':
                calc = lat + findBorder;
                break;
            case 'bottom':
                calc = lat - findBorder;
                break;
        }
        return calc;
    }

    //Calcula aproximadamente a borda de cada alvo
    var calcLon = function (size, position) {
        return lon;
    }

    //Coloca um label com o tamanho de cada alvo no final dela, no topo
    var setRadiusLabels = function (map, positioning) {
        var position = positioning;
        var overlayLabels = ['raio1', 'raio2', 'raio3', 'raio4'];

        this.raioLabels = [
            document.getElementById('radius0_label'),
            document.getElementById('radius1_label'),
            document.getElementById('radius2_label'),
            document.getElementById('radius3_label')
        ]

        for (r in raio) {
            this.raioLabels[r].innerHTML = raio[r] / 1000 + 'km';
        }

        this.raioLabelsOverlay = {
            raio1: new ol.Overlay({
                element: raioLabels[0],
                positioning: 'center-left',
                stopEvent: false
            }),
            raio2: new ol.Overlay({
                element: raioLabels[1],
                positioning: 'bottom-center',
                stopEvent: false
            }),
            raio3: new ol.Overlay({
                element: raioLabels[2],
                positioning: 'bottom-center',
                stopEvent: false
            }),
            raio4: new ol.Overlay({
                element: raioLabels[3],
                positioning: 'bottom-center',
                stopEvent: false
            })
        };

        for (r in raio) {
            map.addOverlay(this.raioLabelsOverlay[overlayLabels[r]]);
            this.raioLabelsOverlay[overlayLabels[r]].setPosition(
                ol.proj.transform([calcLon(raio[r], position), calcLat(raio[r], position)],
                    'EPSG:4326', 'EPSG:3857')
            );
            $(this.raioLabels[r]).show();
        };
    };

    setRadiusLabels(this.map, 'top');
}

/**
 * Adiciona um ícone de veículo no mapa
 * @param {string} elementId - nome único de cada veículo
 * @param {any} viagemData - Dados relacionados a viagem
 * @param {array} coordenadas - Coordenadas de onde o caminhão está
 */

radarViagensFactory.prototype.addNewViagemEmCargaRastreador = function (elementId, viagemData, entity, coordenadas) {
    var map = this.map;
    var self = this;
    //Define um novo caminhão com localização, nome e informações
    this.viagensEmCargaRastreadorFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform(coordenadas, 'EPSG:4326', 'EPSG:3857')),
        name: elementId,
        id: elementId
    });
    //seta uma id unica para o elemento
    this.viagensEmCargaRastreadorFeature.setId(elementId);
    //adiciona as informações para serem utilizadas no popup
    this.viagensEmCargaRastreadorFeature.set('type', 'vehicle');
    this.viagensEmCargaRastreadorFeature.set('informations', viagemData);
    this.viagensEmCargaRastreadorFeature.set('entity', entity);
    var isOTM = (viagemData.protocoloOtm) ? '_OTM' : '';
    
    var imagem = './images/logistics-truck-carga-rastreador.png';
    var cor = '#FFFFFF';
    
    if(!viagemData.possuiPosicao){
    	imagem = './images/entidade_origem.png';
    }else{
	    if(viagemData.dedicado){
	    	if(viagemData.entidadeVinculada.corGrupoVeiculo != null){
	    		cor = viagemData.entidadeVinculada.corGrupoVeiculo;
	    	}else{
	    		cor = '#000099';
	    	}
	    	
	    	if(viagemData.utilizaSatelite && !viagemData.utilizaAppInfolog){
		    	if(viagemData.sinalSatelite == 'COM_SINAL'){
		    		imagem = './images/logistics-truck-carga-dedicado-rastreador.png';
		    	}else if(viagemData.sinalSatelite == 'PERDA_SINAL' || viagemData.sinalSatelite == 'SEM_SINAL'){
		    		imagem = './images/logistics-truck-carga-dedicado-rastreador-perda-sinal.png';
		    	}
		    }
	    }else{
		    if(viagemData.utilizaSatelite && !viagemData.utilizaAppInfolog){
		    	if(viagemData.sinalSatelite == 'COM_SINAL'){
		    		imagem = './images/logistics-truck-carga-rastreador.png';
		    	}else if(viagemData.sinalSatelite == 'PERDA_SINAL' || viagemData.sinalSatelite == 'SEM_SINAL'){
		    		imagem = './images/logistics-truck-carga-rastreador-perda-sinal.png';
		    	}
		    }
	    }
    }
   
    var style = new ol.style.Style({
        image: new ol.style.Icon(({
            anchor: [
                0.5, 46
            ],
            opacity: 1,
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: imagem,
            scale: 0.6,
            color: cor
        })),
        text: new ol.style.Text({
            text: '',
            font: 'Bold 12px Arial',
            fill: new ol.style.Fill({
                color: '#000'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 3
            })
        })
    });
    this.viagensEmCargaRastreadorFeature.setStyle(style);
    //Adiciona uma feature
    this.viagensEmCargaRastreadorSource.addFeature(this.viagensEmCargaRastreadorFeature);
}

radarViagensFactory.prototype.addNewViagemEmCargaApp = function (elementId, viagemData, entity, coordenadas) {
    var map = this.map;
    var self = this;
    //Define um novo caminhão com localização, nome e informações
    this.viagensEmCargaAppFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform(coordenadas, 'EPSG:4326', 'EPSG:3857')),
        name: elementId,
        id: elementId
    });
    //seta uma id unica para o elemento
    this.viagensEmCargaAppFeature.setId(elementId);
    //adiciona as informações para serem utilizadas no popup
    this.viagensEmCargaAppFeature.set('type', 'vehicle');
    this.viagensEmCargaAppFeature.set('informations', viagemData);
    this.viagensEmCargaAppFeature.set('entity', entity);
    var isOTM = (viagemData.protocoloOtm) ? '_OTM' : '';
    
    var imagem = './images/logistics-truck-carga-rastreador.png';
    var cor = '#FFFFFF';
    
    if(!viagemData.possuiPosicao){
    	imagem = './images/entidade_origem.png';
    }else{
	    if(viagemData.dedicado){
	    	if(viagemData.entidadeVinculada.corGrupoVeiculo != null){
	    		cor = viagemData.entidadeVinculada.corGrupoVeiculo;
	    	}else{
	    		cor = '#000099';
	    	}
	    	
	    	if(!viagemData.utilizaSatelite && viagemData.utilizaAppInfolog){
		    	if(viagemData.sinalAppInfolog == 'COM_SINAL'){
		    		imagem = './images/logistics-truck-carga-dedicado-app.png';
		    	}else if(viagemData.sinalAppInfolog == 'PERDA_SINAL' || viagemData.sinalAppInfolog == 'SEM_SINAL'){
		    		imagem = './images/logistics-truck-carga-dedicado-app-perda-sinal.png';
		    	}
		    }
	    }else{
		 	if(!viagemData.utilizaSatelite && viagemData.utilizaAppInfolog){
		    	if(viagemData.sinalAppInfolog == 'COM_SINAL'){
		    		imagem = './images/logistics-truck-carga-app.png';
		    	}else if(viagemData.sinalAppInfolog == 'PERDA_SINAL' || viagemData.sinalAppInfolog == 'SEM_SINAL'){
		    		imagem = './images/logistics-truck-carga-app-perda-sinal.png';
		    	}
		    }
	    }
    }
    
    var style = new ol.style.Style({
        image: new ol.style.Icon(({
            anchor: [
                0.5, 46
            ],
            opacity: 1,
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: imagem,
            scale: 0.6,
            color: cor
        })),
        text: new ol.style.Text({
            text: '',
            font: 'Bold 12px Arial',
            fill: new ol.style.Fill({
                color: '#000'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 3
            })
        })
    });
    this.viagensEmCargaAppFeature.setStyle(style);
    //Adiciona uma feature
    this.viagensEmCargaAppSource.addFeature(this.viagensEmCargaAppFeature);
}

radarViagensFactory.prototype.addNewViagemEmCargaAppRastreador = function (elementId, viagemData, entity, coordenadas) {
    var map = this.map;
    var self = this;
    //Define um novo caminhão com localização, nome e informações
    this.viagensEmCargaAppRastreadorFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform(coordenadas, 'EPSG:4326', 'EPSG:3857')),
        name: elementId,
        id: elementId
    });
    //seta uma id unica para o elemento
    this.viagensEmCargaAppRastreadorFeature.setId(elementId);
    //adiciona as informações para serem utilizadas no popup
    this.viagensEmCargaAppRastreadorFeature.set('type', 'vehicle');
    this.viagensEmCargaAppRastreadorFeature.set('informations', viagemData);
    this.viagensEmCargaAppRastreadorFeature.set('entity', entity);
    var isOTM = (viagemData.protocoloOtm) ? '_OTM' : '';
    
    var imagem = './images/logistics-truck-carga-rastreador.png';
    var cor = '#FFFFFF';
    
    if(!viagemData.possuiPosicao){
    	imagem = './images/entidade_origem.png';
    }else{
	    if(viagemData.dedicado){
	    	if(viagemData.entidadeVinculada.corGrupoVeiculo != null){
	    		cor = viagemData.entidadeVinculada.corGrupoVeiculo;
	    	}else{
	    		cor = '#000099';
	    	}
	    	
	    	if(viagemData.utilizaSatelite && viagemData.utilizaAppInfolog){
		    	if(viagemData.sinalSatelite == 'COM_SINAL' && viagemData.sinalAppInfolog == 'COM_SINAL'){
		    		imagem = './images/logistics-truck-carga-dedicado-app-rastreador.png';
		    	}else if(viagemData.sinalSatelite == 'COM_SINAL' && (viagemData.sinalAppInfolog == 'PERDA_SINAL' || viagemData.sinalAppInfolog == 'SEM_SINAL')){
		    		imagem = './images/logistics-truck-carga-dedicado-app-perda-sinal-rastreador-sinal.png';
		    	}else if((viagemData.sinalSatelite == 'PERDA_SINAL' || viagemData.sinalSatelite == 'SEM_SINAL') && viagemData.sinalAppInfolog == 'COM_SINAL'){
		    		imagem = './images/logistics-truck-carga-dedicado-app-sinal-rastreador-perda-sinal.png';
		    	}else if((viagemData.sinalSatelite == 'PERDA_SINAL' || viagemData.sinalSatelite == 'SEM_SINAL') && (viagemData.sinalAppInfolog == 'PERDA_SINAL' || viagemData.sinalAppInfolog == 'SEM_SINAL')){
		    		imagem = './images/logistics-truck-carga-dedicado-app-rastreador-perda-sinal.png';
		    	}
		    }
	    }else{
		    if(viagemData.utilizaSatelite && viagemData.utilizaAppInfolog){
		    	if(viagemData.sinalSatelite == 'COM_SINAL' && viagemData.sinalAppInfolog == 'COM_SINAL'){
		    		imagem = './images/logistics-truck-carga-app-rastreador.png';
		    	}else if(viagemData.sinalSatelite == 'COM_SINAL' && (viagemData.sinalAppInfolog == 'PERDA_SINAL' || viagemData.sinalAppInfolog == 'SEM_SINAL')){
		    		imagem = './images/logistics-truck-carga-app-perda-sinal-rastreador-sinal.png';
		    	}else if((viagemData.sinalSatelite == 'PERDA_SINAL' || viagemData.sinalSatelite == 'SEM_SINAL') && viagemData.sinalAppInfolog == 'COM_SINAL'){
		    		imagem = './images/logistics-truck-carga-app-sinal-rastreador-perda-sinal.png';
		    	}else if((viagemData.sinalSatelite == 'PERDA_SINAL' || viagemData.sinalSatelite == 'SEM_SINAL') && (viagemData.sinalAppInfolog == 'PERDA_SINAL' || viagemData.sinalAppInfolog == 'SEM_SINAL')){
		    		imagem = './images/logistics-truck-carga-app-rastreador-perda-sinal.png';
		    	}
		    }
	    }
    }
   
    var style = new ol.style.Style({
        image: new ol.style.Icon(({
            anchor: [
                0.5, 46
            ],
            opacity: 1,
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: imagem,
            scale: 0.6,
            color: cor
        })),
        text: new ol.style.Text({
            text: '',
            font: 'Bold 12px Arial',
            fill: new ol.style.Fill({
                color: '#000'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 3
            })
        })
    });
    this.viagensEmCargaAppRastreadorFeature.setStyle(style);
    //Adiciona uma feature
    this.viagensEmCargaAppRastreadorSource.addFeature(this.viagensEmCargaAppRastreadorFeature);
}

radarViagensFactory.prototype.addNewViagemEmDescargaRastreador = function (elementId, viagemData, entity, coordenadas) {
    var map = this.map;
    var self = this;
    //Define um novo caminhão com localização, nome e informações
    this.viagensEmDescargaRastreadorFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform(coordenadas, 'EPSG:4326', 'EPSG:3857')),
        name: elementId,
        id: elementId
    });
    //seta uma id unica para o elemento
    this.viagensEmDescargaRastreadorFeature.setId(elementId);
    //adiciona as informações para serem utilizadas no popup
    this.viagensEmDescargaRastreadorFeature.set('type', 'vehicle');
    this.viagensEmDescargaRastreadorFeature.set('informations', viagemData);
    this.viagensEmDescargaRastreadorFeature.set('entity', entity);
    var isOTM = (viagemData.protocoloOtm) ? '_OTM' : '';
   
    var imagem = './images/logistics-truck-descarga-rastreador.png';
    var cor = '#FFFFFF';
    
    if(viagemData.dedicado){
    	if(viagemData.entidadeVinculada.corGrupoVeiculo != null){
    		cor = viagemData.entidadeVinculada.corGrupoVeiculo;
    	}else{
    		cor = '#000099';
    	}
    	
    	if(viagemData.utilizaSatelite && !viagemData.utilizaAppInfolog){
	    	if(viagemData.sinalSatelite == 'COM_SINAL'){
	    		imagem = './images/logistics-truck-descarga-dedicado-rastreador.png';
	    	}else if(viagemData.sinalSatelite == 'PERDA_SINAL' || viagemData.sinalSatelite == 'SEM_SINAL'){
	    		imagem = './images/logistics-truck-descarga-dedicado-rastreador-perda-sinal.png';
	    	}
	    }
    }else{
	    if(viagemData.utilizaSatelite && !viagemData.utilizaAppInfolog){
	    	if(viagemData.sinalSatelite == 'COM_SINAL'){
	    		imagem = './images/logistics-truck-descarga-rastreador.png';
	    	}else if(viagemData.sinalSatelite == 'PERDA_SINAL' || viagemData.sinalSatelite == 'SEM_SINAL'){
	    		imagem = './images/logistics-truck-descarga-rastreador-perda-sinal.png';
	    	}
	    }
    }
    
    var style = new ol.style.Style({
        image: new ol.style.Icon(({
            anchor: [
                0.5, 46
            ],
            opacity: 1,
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: imagem,
            scale: 0.6,
            color: cor
        })),
        text: new ol.style.Text({
            text: '',
            font: 'Bold 12px Arial',
            fill: new ol.style.Fill({
                color: '#000'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 3
            })
        })
    });
    this.viagensEmDescargaRastreadorFeature.setStyle(style);
    //Adiciona uma feature
    this.viagensEmDescargaRastreadorSource.addFeature(this.viagensEmDescargaRastreadorFeature);
}

radarViagensFactory.prototype.addNewViagemEmDescargaApp = function (elementId, viagemData, entity, coordenadas) {
    var map = this.map;
    var self = this;
    //Define um novo caminhão com localização, nome e informações
    this.viagensEmDescargaAppFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform(coordenadas, 'EPSG:4326', 'EPSG:3857')),
        name: elementId,
        id: elementId
    });
    //seta uma id unica para o elemento
    this.viagensEmDescargaAppFeature.setId(elementId);
    //adiciona as informações para serem utilizadas no popup
    this.viagensEmDescargaAppFeature.set('type', 'vehicle');
    this.viagensEmDescargaAppFeature.set('informations', viagemData);
    this.viagensEmDescargaAppFeature.set('entity', entity);
    var isOTM = (viagemData.protocoloOtm) ? '_OTM' : '';
   
    var imagem = './images/logistics-truck-descarga-rastreador.png';
    var cor = '#FFFFFF';
    
    if(viagemData.dedicado){
    	if(viagemData.entidadeVinculada.corGrupoVeiculo != null){
    		cor = viagemData.entidadeVinculada.corGrupoVeiculo;
    	}else{
    		cor = '#000099';
    	}
    	
    	if(!viagemData.utilizaSatelite && viagemData.utilizaAppInfolog){
	    	if(viagemData.sinalAppInfolog == 'COM_SINAL'){
	    		imagem = './images/logistics-truck-descarga-dedicado-app.png';
	    	}else if(viagemData.sinalAppInfolog == 'PERDA_SINAL' || viagemData.sinalAppInfolog == 'SEM_SINAL'){
	    		imagem = './images/logistics-truck-descarga-dedicado-app-perda-sinal.png';
	    	}
	    }
    }else{
	    if(!viagemData.utilizaSatelite && viagemData.utilizaAppInfolog){
	    	if(viagemData.sinalAppInfolog == 'COM_SINAL'){
	    		imagem = './images/logistics-truck-descarga-app.png';
	    	}else if(viagemData.sinalAppInfolog == 'PERDA_SINAL' || viagemData.sinalAppInfolog == 'SEM_SINAL'){
	    		imagem = './images/logistics-truck-descarga-app-perda-sinal.png';
	    	}
	    }
    }
    
    var style = new ol.style.Style({
        image: new ol.style.Icon(({
            anchor: [
                0.5, 46
            ],
            opacity: 1,
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: imagem,
            scale: 0.6,
            color: cor
        })),
        text: new ol.style.Text({
            text: '',
            font: 'Bold 12px Arial',
            fill: new ol.style.Fill({
                color: '#000'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 3
            })
        })
    });
    this.viagensEmDescargaAppFeature.setStyle(style);
    //Adiciona uma feature
    this.viagensEmDescargaAppSource.addFeature(this.viagensEmDescargaAppFeature);
}

radarViagensFactory.prototype.addNewViagemEmDescargaAppRastreador = function (elementId, viagemData, entity, coordenadas) {
    var map = this.map;
    var self = this;
    //Define um novo caminhão com localização, nome e informações
    this.viagensEmDescargaAppRastreadorFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform(coordenadas, 'EPSG:4326', 'EPSG:3857')),
        name: elementId,
        id: elementId
    });
    //seta uma id unica para o elemento
    this.viagensEmDescargaAppRastreadorFeature.setId(elementId);
    //adiciona as informações para serem utilizadas no popup
    this.viagensEmDescargaAppRastreadorFeature.set('type', 'vehicle');
    this.viagensEmDescargaAppRastreadorFeature.set('informations', viagemData);
    this.viagensEmDescargaAppRastreadorFeature.set('entity', entity);
    var isOTM = (viagemData.protocoloOtm) ? '_OTM' : '';
   
    var imagem = './images/logistics-truck-descarga-rastreador.png';
    var cor = '#FFFFFF';
    
    if(viagemData.dedicado){
    	if(viagemData.entidadeVinculada.corGrupoVeiculo != null){
    		cor = viagemData.entidadeVinculada.corGrupoVeiculo;
    	}else{
    		cor = '#000099';
    	}
    	
    	if(viagemData.utilizaSatelite && viagemData.utilizaAppInfolog){
	    	if(viagemData.sinalSatelite == 'COM_SINAL' && viagemData.sinalAppInfolog == 'COM_SINAL'){
	    		imagem = './images/logistics-truck-descarga-dedicado-app-rastreador.png';
	    	}else if(viagemData.sinalSatelite == 'COM_SINAL' && (viagemData.sinalAppInfolog == 'PERDA_SINAL' || viagemData.sinalAppInfolog == 'SEM_SINAL')){
	    		imagem = './images/logistics-truck-descarga-dedicado-app-perda-sinal-rastreador-sinal.png';
	    	}else if((viagemData.sinalSatelite == 'PERDA_SINAL' || viagemData.sinalSatelite == 'SEM_SINAL') && viagemData.sinalAppInfolog == 'COM_SINAL'){
	    		imagem = './images/logistics-truck-descarga-dedicado-app-sinal-rastreador-perda-sinal.png';
	    	}else if((viagemData.sinalSatelite == 'PERDA_SINAL' || viagemData.sinalSatelite == 'SEM_SINAL') && (viagemData.sinalAppInfolog == 'PERDA_SINAL' || viagemData.sinalAppInfolog == 'SEM_SINAL')){
	    		imagem = './images/logistics-truck-descarga-dedicado-app-rastreador-perda-sinal.png';
	    	}
	    }
    }else{
	    if(viagemData.utilizaSatelite && viagemData.utilizaAppInfolog){
	    	if(viagemData.sinalSatelite == 'COM_SINAL' && viagemData.sinalAppInfolog == 'COM_SINAL'){
	    		imagem = './images/logistics-truck-descarga-app-rastreador.png';
	    	}else if(viagemData.sinalSatelite == 'COM_SINAL' && (viagemData.sinalAppInfolog == 'PERDA_SINAL' || viagemData.sinalAppInfolog == 'SEM_SINAL')){
	    		imagem = './images/logistics-truck-descarga-app-perda-sinal-rastreador-sinal.png';
	    	}else if((viagemData.sinalSatelite == 'PERDA_SINAL' || viagemData.sinalSatelite == 'SEM_SINAL') && viagemData.sinalAppInfolog == 'COM_SINAL'){
	    		imagem = './images/logistics-truck-descarga-app-sinal-rastreador-perda-sinal.png';
	    	}else if((viagemData.sinalSatelite == 'PERDA_SINAL' || viagemData.sinalSatelite == 'SEM_SINAL') && (viagemData.sinalAppInfolog == 'PERDA_SINAL' || viagemData.sinalAppInfolog == 'SEM_SINAL')){
	    		imagem = './images/logistics-truck-descarga-app-rastreador-perda-sinal.png';
	    	}
	    }
    }
    
    var style = new ol.style.Style({
        image: new ol.style.Icon(({
            anchor: [
                0.5, 46
            ],
            opacity: 1,
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: imagem,
            scale: 0.6,
            color: cor
        })),
        text: new ol.style.Text({
            text: '',
            font: 'Bold 12px Arial',
            fill: new ol.style.Fill({
                color: '#000'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 3
            })
        })
    });
    this.viagensEmDescargaAppRastreadorFeature.setStyle(style);
    //Adiciona uma feature
    this.viagensEmDescargaAppRastreadorSource.addFeature(this.viagensEmDescargaAppRastreadorFeature);
}

radarViagensFactory.prototype.addNewViagemEmTransitoRastreador = function (elementId, viagemData, entity, coordenadas) {
    var map = this.map;
    var self = this;
    //Define um novo caminhão com localização, nome e informações
    this.viagensEmTransitoRastreadorFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform(coordenadas, 'EPSG:4326', 'EPSG:3857')),
        name: elementId,
        id: elementId
    });
    //seta uma id unica para o elemento
    this.viagensEmTransitoRastreadorFeature.setId(elementId);
    //adiciona as informações para serem utilizadas no popup
    this.viagensEmTransitoRastreadorFeature.set('type', 'vehicle');
    this.viagensEmTransitoRastreadorFeature.set('informations', viagemData);
    this.viagensEmTransitoRastreadorFeature.set('entity', entity);
    var isOTM = (viagemData.protocoloOtm) ? '_OTM' : '';
   
    var imagem = './images/delivery-truck-transito-rastreador.png';
    var cor = '#FFFFFF';
    
    if(viagemData.dedicado){
    	if(viagemData.entidadeVinculada.corGrupoVeiculo != null){
    		cor = viagemData.entidadeVinculada.corGrupoVeiculo;
    	}else{
    		cor = '#000099';
    	}
    	
    	if(viagemData.utilizaSatelite && !viagemData.utilizaAppInfolog){
	    	if(viagemData.sinalSatelite == 'COM_SINAL'){
	    		imagem = './images/delivery-truck-transito-dedicado-rastreador.png';
	    	}else if(viagemData.sinalSatelite == 'PERDA_SINAL' || viagemData.sinalSatelite == 'SEM_SINAL'){
	    		imagem = './images/delivery-truck-transito-dedicado-rastreador-perda-sinal.png';
	    	}
	    }
    }else{
	    if(viagemData.utilizaSatelite && !viagemData.utilizaAppInfolog){
	    	if(viagemData.sinalSatelite == 'COM_SINAL'){
	    		imagem = './images/delivery-truck-transito-rastreador.png';
	    	}else if(viagemData.sinalSatelite == 'PERDA_SINAL' || viagemData.sinalSatelite == 'SEM_SINAL'){
	    		imagem = './images/delivery-truck-transito-rastreador-perda-sinal.png';
	    	}
	    }
    }
    
    var style = new ol.style.Style({
        image: new ol.style.Icon(({
            anchor: [
                0.5, 46
            ],
            opacity: 1,
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: imagem,
            scale: 0.6,
            color: cor
        })),
        text: new ol.style.Text({
            text: '',
            font: 'Bold 12px Arial',
            fill: new ol.style.Fill({
                color: '#000'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 3
            })
        })
    });
    this.viagensEmTransitoRastreadorFeature.setStyle(style);
    //Adiciona uma feature
    this.viagensEmTransitoRastreadorSource.addFeature(this.viagensEmTransitoRastreadorFeature);
}

radarViagensFactory.prototype.addNewViagemEmTransitoApp = function (elementId, viagemData, entity, coordenadas) {
    var map = this.map;
    var self = this;
    //Define um novo caminhão com localização, nome e informações
    this.viagensEmTransitoAppFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform(coordenadas, 'EPSG:4326', 'EPSG:3857')),
        name: elementId,
        id: elementId
    });
    //seta uma id unica para o elemento
    this.viagensEmTransitoAppFeature.setId(elementId);
    //adiciona as informações para serem utilizadas no popup
    this.viagensEmTransitoAppFeature.set('type', 'vehicle');
    this.viagensEmTransitoAppFeature.set('informations', viagemData);
    this.viagensEmTransitoAppFeature.set('entity', entity);
    var isOTM = (viagemData.protocoloOtm) ? '_OTM' : '';
   
    var imagem = './images/delivery-truck-transito-rastreador.png';
    var cor = '#FFFFFF'
    
    if(viagemData.dedicado){
    	if(viagemData.entidadeVinculada.corGrupoVeiculo != null){
    		cor = viagemData.entidadeVinculada.corGrupoVeiculo;
    	}else{
    		cor = '#000099';
    	}
    	
    	if(!viagemData.utilizaSatelite && viagemData.utilizaAppInfolog){
	    	if(viagemData.sinalAppInfolog == 'COM_SINAL'){
	    		imagem = './images/delivery-truck-transito-dedicado-app.png';
	    	}else if(viagemData.sinalAppInfolog == 'PERDA_SINAL' || viagemData.sinalAppInfolog == 'SEM_SINAL'){
	    		imagem = './images/delivery-truck-transito-dedicado-app-perda-sinal.png';
	    	}
	    }
    }else{
	    if(!viagemData.utilizaSatelite && viagemData.utilizaAppInfolog){
	    	if(viagemData.sinalAppInfolog == 'COM_SINAL'){
	    		imagem = './images/delivery-truck-transito-app.png';
	    	}else if(viagemData.sinalAppInfolog == 'PERDA_SINAL' || viagemData.sinalAppInfolog == 'SEM_SINAL'){
	    		imagem = './images/delivery-truck-transito-app-perda-sinal.png';
	    	}
	    }
    }
    
    var style = new ol.style.Style({
        image: new ol.style.Icon(({
            anchor: [
                0.5, 46
            ],
            opacity: 1,
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: imagem,
            scale: 0.6,
            color: cor
        })),
        text: new ol.style.Text({
            text: '',
            font: 'Bold 12px Arial',
            fill: new ol.style.Fill({
                color: '#000'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 3
            })
        })
    });
    this.viagensEmTransitoAppFeature.setStyle(style);
    //Adiciona uma feature
    this.viagensEmTransitoAppSource.addFeature(this.viagensEmTransitoAppFeature);
}

radarViagensFactory.prototype.addNewViagemEmTransitoAppRastreador = function (elementId, viagemData, entity, coordenadas) {
    var map = this.map;
    var self = this;
    //Define um novo caminhão com localização, nome e informações
    this.viagensEmTransitoAppRastreadorFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform(coordenadas, 'EPSG:4326', 'EPSG:3857')),
        name: elementId,
        id: elementId
    });
    //seta uma id unica para o elemento
    this.viagensEmTransitoAppRastreadorFeature.setId(elementId);
    //adiciona as informações para serem utilizadas no popup
    this.viagensEmTransitoAppRastreadorFeature.set('type', 'vehicle');
    this.viagensEmTransitoAppRastreadorFeature.set('informations', viagemData);
    this.viagensEmTransitoAppRastreadorFeature.set('entity', entity);
    var isOTM = (viagemData.protocoloOtm) ? '_OTM' : '';
   
    var imagem = './images/delivery-truck-transito-rastreador.png';
    var cor = '#FFFFFF';
    
    if(viagemData.dedicado){
    	if(viagemData.entidadeVinculada.corGrupoVeiculo != null){
    		cor = viagemData.entidadeVinculada.corGrupoVeiculo;
    	}else{
    		cor = '#000099';
    	}
    	
    	if(viagemData.utilizaSatelite && viagemData.utilizaAppInfolog){
	    	if(viagemData.sinalSatelite == 'COM_SINAL' && viagemData.sinalAppInfolog == 'COM_SINAL'){
	    		imagem = './images/delivery-truck-transito-dedicado-app-rastreador.png';
	    	}else if(viagemData.sinalSatelite == 'COM_SINAL' && (viagemData.sinalAppInfolog == 'PERDA_SINAL' || viagemData.sinalAppInfolog == 'SEM_SINAL')){
	    		imagem = './images/delivery-truck-transito-dedicado-app-perda-sinal-rastreador-sinal.png';
	    	}else if((viagemData.sinalSatelite == 'PERDA_SINAL' || viagemData.sinalSatelite == 'SEM_SINAL') && viagemData.sinalAppInfolog == 'COM_SINAL'){
	    		imagem = './images/delivery-truck-transito-dedicado-app-sinal-rastreador-perda-sinal.png';
	    	}else if((viagemData.sinalSatelite == 'PERDA_SINAL' || viagemData.sinalSatelite == 'SEM_SINAL') && (viagemData.sinalAppInfolog == 'PERDA_SINAL' || viagemData.sinalAppInfolog == 'SEM_SINAL')){
	    		imagem = './images/delivery-truck-transito-dedicado-app-rastreador-perda-sinal.png';
	    	}
	    }
    }else{
	    if(viagemData.utilizaSatelite && viagemData.utilizaAppInfolog){
	    	if(viagemData.sinalSatelite == 'COM_SINAL' && viagemData.sinalAppInfolog == 'COM_SINAL'){
	    		imagem = './images/delivery-truck-transito-app-rastreador.png';
	    	}else if(viagemData.sinalSatelite == 'COM_SINAL' && (viagemData.sinalAppInfolog == 'PERDA_SINAL' || viagemData.sinalAppInfolog == 'SEM_SINAL')){
	    		imagem = './images/delivery-truck-transito-app-perda-sinal-rastreador-sinal.png';
	    	}else if((viagemData.sinalSatelite == 'PERDA_SINAL' || viagemData.sinalSatelite == 'SEM_SINAL') && viagemData.sinalAppInfolog == 'COM_SINAL'){
	    		imagem = './images/delivery-truck-transito-app-sinal-rastreador-perda-sinal.png';
	    	}else if((viagemData.sinalSatelite == 'PERDA_SINAL' || viagemData.sinalSatelite == 'SEM_SINAL') && (viagemData.sinalAppInfolog == 'PERDA_SINAL' || viagemData.sinalAppInfolog == 'SEM_SINAL')){
	    		imagem = './images/delivery-truck-transito-app-rastreador-perda-sinal.png';
	    	}
	    }
    }
    
    var style = new ol.style.Style({
        image: new ol.style.Icon(({
            anchor: [
                0.5, 46
            ],
            opacity: 1,
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: imagem,
            scale: 0.6,
            color: cor
        })),
        text: new ol.style.Text({
            text: '',
            font: 'Bold 12px Arial',
            fill: new ol.style.Fill({
                color: '#000'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 3
            })
        })
    });
    this.viagensEmTransitoAppRastreadorFeature.setStyle(style);
    //Adiciona uma feature
    this.viagensEmTransitoAppRastreadorSource.addFeature(this.viagensEmTransitoAppRastreadorFeature);
}

radarViagensFactory.prototype.addNewVeiculoVazioRastreador = function (elementId, truckData, entity, coordenadas) {
    var map = this.map;
    var self = this;
    //Define um novo caminhão com localização, nome e informações
    this.veiculoVazioRastreadorFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform(coordenadas, 'EPSG:4326', 'EPSG:3857')),
        name: elementId,
        id: elementId
    });
    //seta uma id unica para o elemento
    this.veiculoVazioRastreadorFeature.setId(elementId);
    //adiciona as informações para serem utilizadas no popup
    this.veiculoVazioRastreadorFeature.set('type', 'vehicle');
    this.veiculoVazioRastreadorFeature.set('informations', truckData);
    this.veiculoVazioRastreadorFeature.set('entity', entity);
    var isOTM = (truckData.protocoloOtm) ? '_OTM' : '';
   
    var imagem = './images/delivery-truck-vazio-dedicado_maior24.png';
    var cor = '#FFFFFF';
    
    if(truckData.vazio){
    	if(truckData.utilizaSatelite && !truckData.utilizaAppInfolog){
    		if(truckData.corGrupoVeiculo != null){
        		cor = truckData.corGrupoVeiculo;
        	}else{
        		cor = '#000099';
        	}
    		
	    	if(truckData.sinalSatelite == 'COM_SINAL'){
	    		imagem = './images/delivery-truck-vazio-dedicado-rastreador.png';
	    	}else{ 
	    		imagem = './images/delivery-truck-vazio-dedicado-rastreador-perda-sinal.png';
	    	}
	    }
    }
    
    var style = new ol.style.Style({
        image: new ol.style.Icon(({
            anchor: [
                0.5, 46
            ],
            opacity: 1,
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: imagem,
            scale: 0.6,
            color: cor
        })),
        text: new ol.style.Text({
            text: '',
            font: 'Bold 12px Arial',
            fill: new ol.style.Fill({
                color: '#000'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 3
            })
        })
    });
    this.veiculoVazioRastreadorFeature.setStyle(style);
    //Adiciona uma feature
    this.veiculosVazioRastreadorSource.addFeature(this.veiculoVazioRastreadorFeature);
}

radarViagensFactory.prototype.addNewVeiculoVazioApp = function (elementId, truckData, entity, coordenadas) {
    var map = this.map;
    var self = this;
    //Define um novo caminhão com localização, nome e informações
    this.veiculoVazioAppFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform(coordenadas, 'EPSG:4326', 'EPSG:3857')),
        name: elementId,
        id: elementId
    });
    //seta uma id unica para o elemento
    this.veiculoVazioAppFeature.setId(elementId);
    //adiciona as informações para serem utilizadas no popup
    this.veiculoVazioAppFeature.set('type', 'vehicle');
    this.veiculoVazioAppFeature.set('informations', truckData);
    this.veiculoVazioAppFeature.set('entity', entity);
    var isOTM = (truckData.protocoloOtm) ? '_OTM' : '';
   
    var imagem = './images/delivery-truck-vazio-dedicado_maior24.png';
    var cor = '#FFFFFF';
    
    if(truckData.vazio){
    	if(!truckData.utilizaSatelite && truckData.utilizaAppInfolog){
    		if(truckData.corGrupoVeiculo != null){
        		cor = truckData.corGrupoVeiculo;
        	}else{
        		cor = '#000099';
        	}
    		
	    	if(truckData.sinalAppInfolog == 'COM_SINAL'){
	    		imagem = './images/delivery-truck-vazio-dedicado-app.png';
	    	}else{ 
	    		imagem = './images/delivery-truck-vazio-dedicado-app-perda-sinal.png';
	    	}
	    }
    }
    
    var style = new ol.style.Style({
        image: new ol.style.Icon(({
            anchor: [
                0.5, 46
            ],
            opacity: 1,
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: imagem,
            scale: 0.6,
            color: cor
        })),
        text: new ol.style.Text({
            text: '',
            font: 'Bold 12px Arial',
            fill: new ol.style.Fill({
                color: '#000'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 3
            })
        })
    });
    this.veiculoVazioAppFeature.setStyle(style);
    //Adiciona uma feature
    this.veiculosVazioAppSource.addFeature(this.veiculoVazioAppFeature);
}

radarViagensFactory.prototype.addNewVeiculoVazioAppRastreador = function (elementId, truckData, entity, coordenadas) {
    var map = this.map;
    var self = this;
    //Define um novo caminhão com localização, nome e informações
    this.veiculoVazioAppRastreadorFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform(coordenadas, 'EPSG:4326', 'EPSG:3857')),
        name: elementId,
        id: elementId
    });
    //seta uma id unica para o elemento
    this.veiculoVazioAppRastreadorFeature.setId(elementId);
    //adiciona as informações para serem utilizadas no popup
    this.veiculoVazioAppRastreadorFeature.set('type', 'vehicle');
    this.veiculoVazioAppRastreadorFeature.set('informations', truckData);
    this.veiculoVazioAppRastreadorFeature.set('entity', entity);
    var isOTM = (truckData.protocoloOtm) ? '_OTM' : '';
   
    var imagem = './images/delivery-truck-vazio-dedicado_maior24.png';
    var cor = '#FFFFFF';
    
    if(truckData.vazio){
    	if(truckData.utilizaSatelite && truckData.utilizaAppInfolog){
    		if(truckData.corGrupoVeiculo != null){
        		cor = truckData.corGrupoVeiculo;
        	}else{
        		cor = '#000099';
        	}
    		
	    	if(truckData.sinalSatelite == 'COM_SINAL' && truckData.sinalAppInfolog == 'COM_SINAL'){
	    		imagem = './images/delivery-truck-vazio-dedicado-app-rastreador.png';
	    	}else if(truckData.sinalSatelite == 'COM_SINAL' && truckData.sinalAppInfolog != 'COM_SINAL'){
	    		imagem = './images/delivery-truck-vazio-dedicado-app-perda-sinal-rastreador.png';
	    	}else if(truckData.sinalSatelite != 'COM_SINAL' && truckData.sinalAppInfolog == 'COM_SINAL'){
	    		imagem = './images/delivery-truck-vazio-dedicado-app-rastreador-perda-sinal.png';
	    	}
	    }
    }
    
    var style = new ol.style.Style({
        image: new ol.style.Icon(({
            anchor: [
                0.5, 46
            ],
            opacity: 1,
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: imagem,
            scale: 0.6,
            color: cor
        })),
        text: new ol.style.Text({
            text: '',
            font: 'Bold 12px Arial',
            fill: new ol.style.Fill({
                color: '#000'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 3
            })
        })
    });
    this.veiculoVazioAppRastreadorFeature.setStyle(style);
    //Adiciona uma feature
    this.veiculosVazioAppRastreadorSource.addFeature(this.veiculoVazioAppRastreadorFeature);
}

radarViagensFactory.prototype.addEntidadeVinculadaRastreador = function (elementId, entidadeData, entity, coordenadas) {
    var map = this.map;
    var self = this;
    //Define um novo caminhão com localização, nome e informações
    this.entidadeVinculadaFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform(coordenadas, 'EPSG:4326', 'EPSG:3857')),
        name: elementId,
        id: elementId
    });
    //seta uma id unica para o elemento
    this.entidadeVinculadaFeature.setId(elementId);
    //adiciona as informações para serem utilizadas no popup
    this.entidadeVinculadaFeature.set('type', 'vehicle');
    this.entidadeVinculadaFeature.set('informations', entidadeData);
    this.entidadeVinculadaFeature.set('entity', entity);
    var isOTM = (entidadeData.protocoloOtm) ? '_OTM' : '';
   
    var imagem = './images/entidade_dedicada.png';
    
    var style = new ol.style.Style({
        image: new ol.style.Icon(({
            anchor: [
                0.5, 46
            ],
            opacity: 1,
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: imagem,
            scale: 0.6
        })),
        text: new ol.style.Text({
            text: '',
            font: 'Bold 12px Arial',
            fill: new ol.style.Fill({
                color: '#000'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 3
            })
        })
    });
    this.entidadeVinculadaFeature.setStyle(style);
    //Adiciona uma feature
    this.entidadeVinculadaSource.addFeature(this.entidadeVinculadaFeature);
}

/**
 * Constrói os dados na tabela
 * @param {string} tableId - id da tabela para pegar com jquery, usar # na frete
 * @param {object} data - dados a serem exibidos na tabela
 */

radarViagensFactory.prototype.buildTable = function (tableId, data, otmUrl) {
    var self = this;
    var layers = this.map.getLayers();

    //CRIA OS PONTOS
    var tableBody = $(tableId).find('tbody');
    var tableHead = $(tableId).find('thead');

    tableBody.html('');
    tableHead.removeClass('hide');
    $('.table-search').removeClass('hide');
    $('.fixed-headers').removeClass('empty');

    function setStatus(status) {
        if (status === 'Não') {
            return '<i class="glyphicon glyphicon-ok"></i> 0378'
        }
        else {
            return ''
        }
    };

    function isYpe() {
        if ($('#ctlOperaTipList').val() == 321 || $('#ctlOperaTipList').val() == 334) {
            return '';
        } else {
            return 'hide';
        }
    }

    function noSignalCheck(signal) {
        if (signal === 'SEM_SINAL') {
            return '<i title="VEÍCULO SEM SINAL" class="fa fa-exclamation-circle" aria-hidden="true"></i>';
        }
        else {
            return '';
        }
    }

    function resta(tempoRestante) {
        if (tempoRestante.indexOf('-') > -1) {
            if (tempoRestante.indexOf('b') > -1) {
                var tempo = tempoRestante.split(' ');
                var tempoRestante = tempo[0] + ' ' + tempo[1];
                return '<span class="text-danger" style="font-weight: bold;">' + tempoRestante.replace(/-/g, '') + '</span>';
            }
            else {
                return '<span class="text-danger" style="font-weight: bold;">' + tempoRestante.replace(/-/g, '') + '</span>';
            }
        }
        else {
            return '<span>' + tempoRestante + '</span>';
        }
    }

    function checkNullOrUndefined(data) {
        if (typeof data === 'undefined' || typeof data === null || data === 'undefined' || data === null ) {
            return '-';
        }
        else {
            return data;
        }
    }

    var CORES_SEMAFORO = [
        'gray-color',
        'green-color',
        'yellow-color',
        'red-color'
    ]

    data.viagens.map(function (informations) {
        var template = '<tr oldTarget="" id="" class="' + checkNullOrUndefined(informations.ctlPlvia) + '">';
        template += '<td class="actions" style="max-width: 30px;cursor: default;">';
        template += noSignalCheck(informations.staViagem);
        template += '<form class="form-external" title="Painel logistico" name="form_painel_logistico" method="post" target="_blank">';
        template += '<img src="./images/PCL.png" width="21" height="21" id="external' + checkNullOrUndefined(informations.ctlPlvia) + '"/>';
        template += '<input type="hidden" class="hidden-ctlPlvia" name="ctlPlvia" value="" />';
        template += '<input type="hidden" class="hidden-codUsuario" name="codUsuario" value="" />';
        template += '<input type="hidden" name="tipoPesquisa" value="" />';
        template += '</form>';
        if (informations.staViagem !== 'SEM_SINAL') {
            template += '<i id="' + informations.ctlPlvia + '" title="Localizar veículo" class="fa fa-location-arrow cursor" style="color:#0d79be"></i>';
        }
        else {
            template += '<i title="Localizar veículo" class="fa fa-location-arrow cursor" style="color:#c4cace; cursor: default;"></i>';
        }
        if (informations.protocoloOtm < 1 || typeof informations.protocoloOtm === 'undefined') {
            template += '<i title="Impressão separação de cargas" id="protocolo_' + informations.ctlPlvia + '" relacionado="otm_' + informations.ctlPlvia + '"  class="fa fa-cogs ' + isYpe() + '" style=" cursor: pointer;"></i>';
        }
        else {
            template += '<i class="fa fa-cogs ' + isYpe() + '" style="opacity:0.5; cursor: default;"></i>';
        }
        template += '</td>';
        template += '<td class="avisos">' + checkNullOrUndefined(informations.staVeicu) + '</td>';
        template += '<td class="plano">' + checkNullOrUndefined(informations.ctlPlvia) + '</td>';
        template += '<td class="shipment">' + checkNullOrUndefined(informations.numShipment) + '</td>';
        template += '<td class="placa">' + checkNullOrUndefined(informations.placaVei) + '</td>';
        template += '<td style="text-align: left;">' + checkNullOrUndefined(informations.nomTrnsp) + '</td>';
        template += '<td><span style="float: left;line-height: 21px;">' + checkNullOrUndefined(informations.dhrEfetiRea) + '</span><i style="float: right;line-height: 21px;" class="fa fa-circle ' + CORES_SEMAFORO[informations.codSemaforoChegada] + '" aria-hidden="true"></i></td>';
        template += '<td>' + resta(informations.tempoRestante) + '</td>';
        template += '<td>' + checkNullOrUndefined(informations.dhrPrevSis) + '</td>';
        template += '<td id="otm_' + informations.ctlPlvia + '" class="otm ' + isYpe() + '">' + checkNullOrUndefined(informations.protocoloOtm) + '</td>';
        template += '</tr>';
        tableBody.append(template);

        if (informations.protocoloOtm < 1 || typeof informations.protocoloOtm === 'undefined') {
            $('#protocolo_' + informations.ctlPlvia).click(function (e) {
                if (informations.autorizacaoSaida == null) {
                    var alerta = $.toast({
                        showHideTransition: 'slide',
                        hideAfter: 2000,
                        text: "Viagem sem Shipment atrelado",
                        textColor: '#fff',
                        bgColor: 'red',
                        stack: 5,
                        position: 'bottom-right'
                    });
                } else {
                    self.updateTableOtm(informations, otmUrl, this, self);
                }
            });
        }

        $('#' + informations.ctlPlvia).zoomTo(self, [
            informations.numLongi, informations.numLatit
        ], 12, tableId);

        $('#external' + informations.ctlPlvia).on('click', function () {
            $(this).parent().attr('action', '/iw-painel-logistico/pages/pesquisa.jsf?tipoPesquisa=pesquisa');
            $(this).parent().find('.hidden-ctlPlvia').val(informations.ctlPlvia);
            $(this).parent().find('.hidden-codUsuario').val($('#codUsuario').val());
            $(this).parent().submit();
        });
    });

    $('.openSubMenu').on('click', function () {
        $(document).find('.subMenu').hide();
        $(this).find('.subMenu').show();
    });


    var linha = $('#incomingTrucks').find('tbody tr').first();

    if (linha.attr('id') !== 'emptyTable') {
        $.each(linha.find('td'), function (key, value) {
            var width = $(value).width();
            var outerWidth = $(value).outerWidth(true);

            $('#reflectTable').find('th:eq(' + key + ')').css({
                'minWidth': outerWidth + 'px',
                'fontSize': '10px'
            });
        });

        $('.dataTable.current').scroll(function (e) {
            var scroll = $('.dataTable.current').scrollLeft();
            $('.dataTable.title').scrollLeft(scroll);
        });
    }
}


/**
 * Realiza a ação de busca na barra do topo no mapa
 * @param {string} target - Seleciona o input que realizara a busca
 * @param {string} search - valor da busca
 * @param {string} entityUrl - url que faz a busca das entidades e que será utilizada na chamada GET
 * @param {string} yardUrl - url que após clicar em um resultado busca as informações de viagem daquela entidade
 * @param {string} tableId - id da id da tabela para pegar com jquery, usar # na frete
 * @param {string} timeToUpdate -  tempo em minutos para atualizar o relógio e chamar o serviço para atualizar a tabela novamente
 * @param {string} timerTarget - id do elemento em html que será atualizado o tempo
 */



radarViagensFactory.prototype.findEntity = function (target, search, entityUrl, yardUrl, otmUrl, tableId, timeToUpdate, timerTarget) {
    var self = this;
    
    $.ajax({
        method: 'GET',
        url: entityUrl,
        data: {
        	entidade: search
        }
    }).done(function (resp) {
    	
    	var template = [];
    	
    	$('.loading').addClass('hide');
        $('.glyphicon-search').removeClass('hide');
        $(target).html('');

        resp.map(function (entidade) {
            template.push('<li id="' + entidade.id + '"><i class="fa fa-map-marker"></i>' + entidade.nome + '</li>');
        });

        $(target).append(template).addClass('active');

        $(target + ' li').click(function () {
            var entidadeId = $(this).attr('id');
            var entidadeNome = $(this).text();
            namesList = "";
            var repeticao = false;
            
            self.entidadeId = entidadeId;
            self.entidadeNome = entidadeNome;
            origensNamesList.push(entidadeNome);

            $.each(origensNamesList, function(e,i){
            	if(!namesList.includes(i)){
	            	if(namesList == ""){
	            		namesList = i
	            	}else{
	            		namesList = namesList + "," + i;
	            	}
            	}else{
            		repeticao = true;
            	}
            });
            
            if (repeticao){
            	origensNamesList.pop();
            }
            
            
            
            if(target == '.autoComplete'){
            	self.selecionaVeiculoViagens(tableId, namesList, './buscarViagensFiltroOrigem', otmUrl, time, timerTarget);
            	
            	$('#destinySearch').val(entidadeNome);
                var length = $('#destinySearch').val().length;
                var remaining = (length - 50) - 1;
                $('#count').text(((length > 50) ? 50 : length) + '/' + 50 + ' caracteres');
                $(target).removeClass('active');
                
                $("#entidadesList").empty();
                $.each(origensNamesList, function(e,i){
                	$("#entidadesList").append("<option value='" + i + "' title='Dê um duplo clique para retirar a Entidade da lista, ou selecione-a e clique no botão Delete do teclado'>" + i + "</option>");
                });
                
                $('#destinySearch').val("");
            }else{
            	self.buscarVeiculosEmUsoVinculado(tableId, namesList, './buscarVeiculosEmUsoEntidadeVinculada', otmUrl, time, timerTarget);
            	
            	self.buscarVeiculosVaziosVinculado(tableId, namesList, './buscarVeiculosVaziosEntidadeVinculada', otmUrl, time, timerTarget);
                
            	$('#entidadeSearch').val(entidadeNome);
                var length = $('#entidadeSearch').val().length;
                var remaining = (length - 50) - 1;
                $('#count').text(((length > 50) ? 50 : length) + '/' + 50 + ' caracteres');
                $(target).removeClass('active');
                
                $("#vinculadoList").empty();
                $.each(origensNamesList, function(e,i){
                   	$("#vinculadoList").append("<option value='" + i + "' title='Dê um duplo clique para retirar a Entidade da lista, ou selecione-a e clique no botão Delete do teclado'>" + i + "</option>");
                });
                
                $('#entidadeSearch').val("");
            }
            
            self.toggleRastreador($('#exibirRastreador').is(':checked'));
            self.toggleApp($('#exibirApp').is(':checked'));
            self.toggleAppRastreador($('#exibirAppRastreador').is(':checked'));
        })
    });
}


radarViagensFactory.prototype.buscarVeiculosViagemAtiva = function (tableId, entidade, urlVeiculosViagemAtiva, otmUrl, timeToUpdate, timerTarget) {
	var self = this;
	var statusQTD = {
        CARGA: 0
    }
	contCarregamento = 0;
	
	self.viagensEmCargaRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.viagensEmCargaAppSource = new ol.source.Vector({
        features: []
    });
    
    self.viagensEmCargaAppRastreadorSource = new ol.source.Vector({
        features: []
    });

    self.removeLayer('viagensEmCargaRastreador');
    self.removeLayer('viagensEmCargaApp');
    self.removeLayer('viagensEmCargaAppRastreador');
    
    self.removeLayer('viagensEmCargaRastreadorCluster');
    self.removeLayer('viagensEmCargaAppCluster');
    self.removeLayer('viagensEmCargaAppRastreadorCluster');
	
    for (item in statusQTD) {
        var element = document.getElementById(item);
        if (typeof element !== undefined && element !== null) {
            element.innerHTML = statusQTD[item];
        }
    }
    
    $.ajax({
        method: 'GET',
        url: urlVeiculosViagemAtiva
    }).done(function (resp) {
        if (resp.length < 1) {
            $('.searchContainer').addClass('erro');
            contCarregamento++;
            return;
        } else {
            $('.searchContainer').removeClass('erro');

        }

        resp.forEach(function (veiculosViagemAtiva) {
        	
        	var listVeiculosViagemAtiva = [];
        	var listVeiculosOrigem = [];
        	var utilizaSateliteOrigem = [];
        	var sinalSateliteOrigem = [];
        	var utilizaAppInfologOrigem = [];
        	var sinalAppInfologOrigem = [];
        	var dedicadoOrigem = [];
        	var corGrupoVeiculoOrigem = [];
        	
    		resp.forEach(function (listVeiculosViagemAtiva) {
    			if(!viagem.possuiPosicao){
	    			if(viagemList.desSitua == "EM CARGA" && !viagemList.possuiPosicao 
	    					&& (viagemList.nomRemet == viagem.nomRemet)){
	    				listVeiculosViagemAtiva.push(viagemList.ctlPlvia);
	    				listVeiculosOrigem.push(viagemList.numPlacaVei);
        				utilizaSateliteOrigem.push(viagemList.utilizaSatelite);
        				sinalSateliteOrigem.push(viagemList.sinalSatelite);
        				utilizaAppInfologOrigem.push(viagemList.utilizaAppInfolog);
        				sinalAppInfologOrigem.push(viagemList.sinalAppInfolog);
        				dedicadoOrigem.push(viagemList.dedicado);
        				if(viagemList.dedicado){
        					corGrupoVeiculoOrigem.push(viagemList.entidadeVinculada.corGrupoVeiculo);
        				}else{
        					corGrupoVeiculoOrigem.push(null);
        				}
	                }
    			}
    			
    		});
    		
    		viagem.viagensOrigem = listVeiculosViagemAtiva;
    		
    		
    		
    		viagem.veiculosOrigem = listVeiculosOrigem;
    		viagem.utilizaSateliteOrigem = utilizaSateliteOrigem;
    		viagem.sinalSateliteOrigem = sinalSateliteOrigem;
    		viagem.utilizaAppInfologOrigem = utilizaAppInfologOrigem;
    		viagem.sinalAppInfologOrigem = sinalAppInfologOrigem;
    		viagem.dedicadoOrigem = dedicadoOrigem;
    		viagem.corGrupoVeiculoOrigem = corGrupoVeiculoOrigem;
    		
        	if(viagem.utilizaSatelite && !viagem.utilizaAppInfolog){
        		console.log(viagem);
            	//adiciona uma nova viagem no mapa
                self.addNewViagemEmCargaRastreador(viagem.ctlPlvia, viagem, {
                    'nomeDaEmpresa': '',
                    'codDocum': '',
                    'paisUfPraca': ''
                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
                statusQTD['CARGA']++;
        	}  
        	
        	if(!viagem.utilizaSatelite && viagem.utilizaAppInfolog){
        		console.log(viagem);
            	//adiciona uma nova viagem no mapa
                self.addNewViagemEmCargaApp(viagem.ctlPlvia, viagem, {
                    'nomeDaEmpresa': '',
                    'codDocum': '',
                    'paisUfPraca': ''
                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
                statusQTD['CARGA']++;
        	}  
        	
        	if(viagem.utilizaSatelite && viagem.utilizaAppInfolog){
        		console.log(viagem);
            	//adiciona uma nova viagem no mapa
                self.addNewViagemEmCargaAppRastreador(viagem.ctlPlvia, viagem, {
                    'nomeDaEmpresa': '',
                    'codDocum': '',
                    'paisUfPraca': ''
                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
                statusQTD['CARGA']++;
        	} 
        });
        
        for (item in statusQTD) {
            var element = document.getElementById(item);
            if (typeof element !== undefined && element !== null) {
                element.innerHTML = statusQTD[item];
            }
        }
        
        var viagensEmCargaRastreador = new ol.layer.Vector({
            source: self.viagensEmCargaRastreadorSource,
            id: 'viagensEmCargaRastreador'
        });
        
        var viagensEmCargaApp = new ol.layer.Vector({
            source: self.viagensEmCargaAppSource,
            id: 'viagensEmCargaApp'
        });
        
        var viagensEmCargaAppRastreador = new ol.layer.Vector({
            source: self.viagensEmCargaAppRastreadorSource,
            id: 'viagensEmCargaAppRastreador'
        });
        
        if($('#exibirRastreador').is(':checked')){
        	self.map.addLayer(viagensEmCargaRastreador);
        	self.setClusters(self.viagensEmCargaRastreadorSource, 'viagensEmCargaRastreadorCluster');
        }else{
        	self.removeLayer('viagensEmCargaRastreador');
        	self.removeLayer('viagensEmCargaRastreadorCluster');
        }
        if($('#exibirApp').is(':checked')){
        	self.map.addLayer(viagensEmCargaApp);	
        	self.setClusters(self.viagensEmCargaAppSource, 'viagensEmCargaAppCluster');
        }else{
        	self.removeLayer('viagensEmCargaApp');
        	self.removeLayer('viagensEmCargaAppCluster');
        }
        if($('#exibirAppRastreador').is(':checked')){
        	self.map.addLayer(viagensEmCargaAppRastreador);	
        	self.setClusters(self.viagensEmCargaAppRastreadorSource, 'viagensEmCargaAppRastreadorCluster');
        }else{
        	self.removeLayer('viagensEmCargaAppRastreador');
        	self.removeLayer('viagensEmCargaAppRastreadorCluster');
        }
        contCarregamento++;
        
    }).catch(function (err) {
        alert(err)
    });
}

radarViagensFactory.prototype.buscarViagensEmCarga = function (tableId, entidade, urlViagensEmCarga, otmUrl, timeToUpdate, timerTarget) {
	var self = this;
	var statusQTD = {
        CARGA: 0
    }
	contCarregamento = 0;
	
	self.viagensEmCargaRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.viagensEmCargaAppSource = new ol.source.Vector({
        features: []
    });
    
    self.viagensEmCargaAppRastreadorSource = new ol.source.Vector({
        features: []
    });

    self.removeLayer('viagensEmCargaRastreador');
    self.removeLayer('viagensEmCargaApp');
    self.removeLayer('viagensEmCargaAppRastreador');
    
    self.removeLayer('viagensEmCargaRastreadorCluster');
    self.removeLayer('viagensEmCargaAppCluster');
    self.removeLayer('viagensEmCargaAppRastreadorCluster');
	
    for (item in statusQTD) {
        var element = document.getElementById(item);
        if (typeof element !== undefined && element !== null) {
            element.innerHTML = statusQTD[item];
        }
    }
    
    $.ajax({
        method: 'GET',
        url: urlViagensEmCarga
    }).done(function (resp) {
        if (resp.length < 1) {
            $('.searchContainer').addClass('erro');
            contCarregamento++;
            return;
        } else {
            $('.searchContainer').removeClass('erro');

        }

        resp.forEach(function (viagem) {
        	
        	var listViagensOrigem = [];
        	var listVeiculosOrigem = [];
        	var utilizaSateliteOrigem = [];
        	var sinalSateliteOrigem = [];
        	var utilizaAppInfologOrigem = [];
        	var sinalAppInfologOrigem = [];
        	var dedicadoOrigem = [];
        	var corGrupoVeiculoOrigem = [];
        	
    		resp.forEach(function (viagemList) {
    			if(!viagem.possuiPosicao){
	    			if(viagemList.desSitua == "EM CARGA" && !viagemList.possuiPosicao 
	    					&& (viagemList.nomRemet == viagem.nomRemet)){
	    				listViagensOrigem.push(viagemList.ctlPlvia);
	    				listVeiculosOrigem.push(viagemList.numPlacaVei);
        				utilizaSateliteOrigem.push(viagemList.utilizaSatelite);
        				sinalSateliteOrigem.push(viagemList.sinalSatelite);
        				utilizaAppInfologOrigem.push(viagemList.utilizaAppInfolog);
        				sinalAppInfologOrigem.push(viagemList.sinalAppInfolog);
        				dedicadoOrigem.push(viagemList.dedicado);
        				if(viagemList.dedicado){
        					corGrupoVeiculoOrigem.push(viagemList.entidadeVinculada.corGrupoVeiculo);
        				}else{
        					corGrupoVeiculoOrigem.push(null);
        				}
	                }
    			}
    			
    		});
    		
    		viagem.viagensOrigem = listViagensOrigem;
    		viagem.veiculosOrigem = listVeiculosOrigem;
    		viagem.utilizaSateliteOrigem = utilizaSateliteOrigem;
    		viagem.sinalSateliteOrigem = sinalSateliteOrigem;
    		viagem.utilizaAppInfologOrigem = utilizaAppInfologOrigem;
    		viagem.sinalAppInfologOrigem = sinalAppInfologOrigem;
    		viagem.dedicadoOrigem = dedicadoOrigem;
    		viagem.corGrupoVeiculoOrigem = corGrupoVeiculoOrigem;
    		
        	if(viagem.utilizaSatelite && !viagem.utilizaAppInfolog){
        		console.log(viagem);
            	//adiciona uma nova viagem no mapa
                self.addNewViagemEmCargaRastreador(viagem.ctlPlvia, viagem, {
                    'nomeDaEmpresa': '',
                    'codDocum': '',
                    'paisUfPraca': ''
                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
                statusQTD['CARGA']++;
        	}  
        	
        	if(!viagem.utilizaSatelite && viagem.utilizaAppInfolog){
        		console.log(viagem);
            	//adiciona uma nova viagem no mapa
                self.addNewViagemEmCargaApp(viagem.ctlPlvia, viagem, {
                    'nomeDaEmpresa': '',
                    'codDocum': '',
                    'paisUfPraca': ''
                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
                statusQTD['CARGA']++;
        	}  
        	
        	if(viagem.utilizaSatelite && viagem.utilizaAppInfolog){
        		console.log(viagem);
            	//adiciona uma nova viagem no mapa
                self.addNewViagemEmCargaAppRastreador(viagem.ctlPlvia, viagem, {
                    'nomeDaEmpresa': '',
                    'codDocum': '',
                    'paisUfPraca': ''
                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
                statusQTD['CARGA']++;
        	} 
        });
        
        for (item in statusQTD) {
            var element = document.getElementById(item);
            if (typeof element !== undefined && element !== null) {
                element.innerHTML = statusQTD[item];
            }
        }
        
        var viagensEmCargaRastreador = new ol.layer.Vector({
            source: self.viagensEmCargaRastreadorSource,
            id: 'viagensEmCargaRastreador'
        });
        
        var viagensEmCargaApp = new ol.layer.Vector({
            source: self.viagensEmCargaAppSource,
            id: 'viagensEmCargaApp'
        });
        
        var viagensEmCargaAppRastreador = new ol.layer.Vector({
            source: self.viagensEmCargaAppRastreadorSource,
            id: 'viagensEmCargaAppRastreador'
        });
        
        if($('#exibirRastreador').is(':checked')){
        	self.map.addLayer(viagensEmCargaRastreador);
        	self.setClusters(self.viagensEmCargaRastreadorSource, 'viagensEmCargaRastreadorCluster');
        }else{
        	self.removeLayer('viagensEmCargaRastreador');
        	self.removeLayer('viagensEmCargaRastreadorCluster');
        }
        if($('#exibirApp').is(':checked')){
        	self.map.addLayer(viagensEmCargaApp);	
        	self.setClusters(self.viagensEmCargaAppSource, 'viagensEmCargaAppCluster');
        }else{
        	self.removeLayer('viagensEmCargaApp');
        	self.removeLayer('viagensEmCargaAppCluster');
        }
        if($('#exibirAppRastreador').is(':checked')){
        	self.map.addLayer(viagensEmCargaAppRastreador);	
        	self.setClusters(self.viagensEmCargaAppRastreadorSource, 'viagensEmCargaAppRastreadorCluster');
        }else{
        	self.removeLayer('viagensEmCargaAppRastreador');
        	self.removeLayer('viagensEmCargaAppRastreadorCluster');
        }
        contCarregamento++;
        
    }).catch(function (err) {
        alert(err)
    });
}

radarViagensFactory.prototype.buscarViagensEmDescarga = function (tableId, entidade, urlViagensEmDescarga, otmUrl, timeToUpdate, timerTarget) {
	var self = this;
	var statusQTD = {
	    DESCARGA: 0
	}
	
	self.viagensEmDescargaRastreadorSource = new ol.source.Vector({
        features: []
    });

    self.removeLayer('viagensEmDescargaRastreador');
    
    self.viagensEmDescargaAppSource = new ol.source.Vector({
        features: []
    });

    self.removeLayer('viagensEmDescargaApp');
    
    self.viagensEmDescargaAppRastreadorSource = new ol.source.Vector({
        features: []
    });

    self.removeLayer('viagensEmDescargaAppRastreador');
    
    self.removeLayer('viagensEmDescargaRastreadorCluster');
    self.removeLayer('viagensEmDescargaAppCluster');
    self.removeLayer('viagensEmDescargaAppRastreadorCluster');
    
	for (item in statusQTD) {
        var element = document.getElementById(item);
        if (typeof element !== undefined && element !== null) {
            element.innerHTML = statusQTD[item];
        }
    }
	
    $.ajax({
        method: 'GET',
        url: urlViagensEmDescarga
    }).done(function (resp) {
        if (resp.length < 1) {
            $('.searchContainer').addClass('erro');
            contCarregamento++;
            return;
        } else {
            $('.searchContainer').removeClass('erro');
 
        }

        resp.forEach(function (viagem) {
        	if(viagem.utilizaSatelite && !viagem.utilizaAppInfolog){
        		console.log(viagem);
            	//adiciona uma nova viagem no mapa
                self.addNewViagemEmDescargaRastreador(viagem.ctlPlvia, viagem, {
                    'nomeDaEmpresa': '',
                    'codDocum': '',
                    'paisUfPraca': ''
                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
                statusQTD['DESCARGA']++;
        	}      
        	
        	if(!viagem.utilizaSatelite && viagem.utilizaAppInfolog){
        		console.log(viagem);
            	//adiciona uma nova viagem no mapa
                self.addNewViagemEmDescargaApp(viagem.ctlPlvia, viagem, {
                    'nomeDaEmpresa': '',
                    'codDocum': '',
                    'paisUfPraca': ''
                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
                statusQTD['DESCARGA']++;
        	}   
        	
        	if(viagem.utilizaSatelite && viagem.utilizaAppInfolog){
        		console.log(viagem);
            	//adiciona uma nova viagem no mapa
                self.addNewViagemEmDescargaAppRastreador(viagem.ctlPlvia, viagem, {
                    'nomeDaEmpresa': '',
                    'codDocum': '',
                    'paisUfPraca': ''
                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
                statusQTD['DESCARGA']++;
        	}   
        	
        });
        
        for (item in statusQTD) {
            var element = document.getElementById(item);
            if (typeof element !== undefined && element !== null) {
                element.innerHTML = statusQTD[item];
            }
        }
        
        var viagensEmDescargaRastreador = new ol.layer.Vector({
            source: self.viagensEmDescargaRastreadorSource,
            id: 'viagensEmDescargaRastreador'
        });
        
        var viagensEmDescargaApp = new ol.layer.Vector({
            source: self.viagensEmDescargaAppSource,
            id: 'viagensEmDescargaApp'
        });
        
        var viagensEmDescargaAppRastreador = new ol.layer.Vector({
            source: self.viagensEmDescargaAppRastreadorSource,
            id: 'viagensEmDescargaAppRastreador'
        });
        
        if($('#exibirRastreador').is(':checked')){
        	self.map.addLayer(viagensEmDescargaRastreador);	
        	self.setClusters(self.viagensEmDescargaRastreadorSource, 'viagensEmDescargaRastreadorCluster');
        }else{
        	self.removeLayer('viagensEmDescargaRastreador');
        	self.removeLayer('viagensEmDescargaRastreadorCluster');
        }
        if($('#exibirApp').is(':checked')){
        	self.map.addLayer(viagensEmDescargaApp);	
        	self.setClusters(self.viagensEmDescargaAppSource, 'viagensEmDescargaAppCluster');
        }else{
        	self.removeLayer('viagensEmDescargaApp');
        	self.removeLayer('viagensEmDescargaAppCluster');
        }
        if($('#exibirAppRastreador').is(':checked')){
        	self.map.addLayer(viagensEmDescargaAppRastreador);	
        	self.setClusters(self.viagensEmDescargaAppRastreadorSource, 'viagensEmDescargaAppRastreadorCluster');
        }else{
        	self.removeLayer('viagensEmDescargaAppRastreador');
        	self.removeLayer('viagensEmDescargaAppRastreadorCluster');
        }
        
        contCarregamento++;
    }).catch(function (err) {
        alert(err)
    });
}

radarViagensFactory.prototype.buscarViagensEmTransito = function (tableId, entidade, urlViagensEmTransito, otmUrl, timeToUpdate, timerTarget) {
	var self = this;
	var statusQTD = {
		TRANSITO: 0
	}
	
	self.viagensEmTransitoRastreadorSource = new ol.source.Vector({
        features: []
    });

    self.viagensEmTransitoAppSource = new ol.source.Vector({
        features: []
    });
    
    self.viagensEmTransitoAppRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmTransitoRastreador');
    self.removeLayer('viagensEmTransitoApp');
    self.removeLayer('viagensEmTransitoAppRastreador');
    
    self.removeLayer('viagensEmTransitoRastreadorCluster');
    self.removeLayer('viagensEmTransitoAppCluster');
    self.removeLayer('viagensEmTransitoAppRastreadorCluster');
	
	for (item in statusQTD) {
        var element = document.getElementById(item);
        if (typeof element !== undefined && element !== null) {
            element.innerHTML = statusQTD[item];
        }
    }
	
    $.ajax({
        method: 'GET',
        url: urlViagensEmTransito
    }).done(function (resp) {
        if (resp.length < 1) {
            $('.searchContainer').addClass('erro');
            contCarregamento++;
            return;
        } else {
            $('.searchContainer').removeClass('erro');

        }

        resp.forEach(function (viagem) {
        	if(viagem.utilizaSatelite && !viagem.utilizaAppInfolog){
        		console.log(viagem);
	            //adiciona uma nova viagem no mapa
	            self.addNewViagemEmTransitoRastreador(viagem.ctlPlvia, viagem, {
	                'nomeDaEmpresa': '',
	                'codDocum': '',
	                'paisUfPraca': ''
	            }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
	            statusQTD['TRANSITO']++;
        	} 
        	
        	if(!viagem.utilizaSatelite && viagem.utilizaAppInfolog){
        		console.log(viagem);
	            //adiciona uma nova viagem no mapa
	            self.addNewViagemEmTransitoApp(viagem.ctlPlvia, viagem, {
	                'nomeDaEmpresa': '',
	                'codDocum': '',
	                'paisUfPraca': ''
	            }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
	            statusQTD['TRANSITO']++;
        	} 
        	
        	if(viagem.utilizaSatelite && viagem.utilizaAppInfolog){
        		console.log(viagem);
	            //adiciona uma nova viagem no mapa
	            self.addNewViagemEmTransitoAppRastreador(viagem.ctlPlvia, viagem, {
	                'nomeDaEmpresa': '',
	                'codDocum': '',
	                'paisUfPraca': ''
	            }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
	            statusQTD['TRANSITO']++;
        	} 
        });

        for (item in statusQTD) {
            var element = document.getElementById(item);
            if (typeof element !== undefined && element !== null) {
                element.innerHTML = statusQTD[item];
            }
        }
        
        var viagensEmTransitoRastreador = new ol.layer.Vector({
            source: self.viagensEmTransitoRastreadorSource,
            id: 'viagensEmTransitoRastreador'
        });
        
        var viagensEmTransitoApp = new ol.layer.Vector({
            source: self.viagensEmTransitoAppSource,
            id: 'viagensEmTransitoApp'
        });
        
        var viagensEmTransitoAppRastreador = new ol.layer.Vector({
            source: self.viagensEmTransitoAppRastreadorSource,
            id: 'viagensEmTransitoAppRastreador'
        });
        
        if($('#exibirRastreador').is(':checked')){
        	self.map.addLayer(viagensEmTransitoRastreador);	
        	self.setClusters(self.viagensEmTransitoRastreadorSource, 'viagensEmTransitoRastreadorCluster');
        }else{
        	self.removeLayer('viagensEmTransitoRastreador');
        	self.removeLayer('viagensEmTransitoRastreadorCluster');
        }
        if($('#exibirApp').is(':checked')){
        	self.map.addLayer(viagensEmTransitoApp);	
        	self.setClusters(self.viagensEmTransitoAppSource, 'viagensEmTransitoAppCluster');
        }else{
        	self.removeLayer('viagensEmTransitoApp');
        	self.removeLayer('viagensEmTransitoAppCluster');
        }
        if($('#exibirAppRastreador').is(':checked')){
        	self.map.addLayer(viagensEmTransitoAppRastreador);	
        	self.setClusters(self.viagensEmTransitoAppRastreadorSource, 'viagensEmTransitoAppRastreadorCluster');
        }else{
        	self.removeLayer('viagensEmTransitoAppRastreador');
        	self.removeLayer('viagensEmTransitoAppRastreadorCluster');
        }
        
        contCarregamento++;
       
        
    }).catch(function (err) {
        alert(err)
    });


}

radarViagensFactory.prototype.buscarVeiculosEmUso = function (tableId, entidadeNome, yardUrl, otmUrl, timeToUpdate, timerTarget) {
	var self = this;
    var statusQTD = {
        USO: 0
    }    
    
    self.viagensEmCargaRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmCargaRastreador');
    
    self.viagensEmCargaAppSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmCargaApp');
    
    self.viagensEmCargaAppRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmCargaAppRastreador');
    
    self.viagensEmDescargaRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmDescargaRastreador');
    
    self.viagensEmDescargaAppSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmDescargaApp');
    
    self.viagensEmDescargaAppRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmDescargaAppRastreador');
    
    self.viagensEmTransitoRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmTransitoRastreador');
    
    self.viagensEmTransitoAppSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmTransitoApp');
    
    self.viagensEmTransitoAppRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmTransitoAppRastreador');
    
    self.removeLayer('viagensEmCargaRastreadorDedicadoCluster');
    self.removeLayer('viagensEmCargaAppDedicadoCluster');
    self.removeLayer('viagensEmCargaAppRastreadorDedicadoCluster');
    self.removeLayer('viagensEmDescargaRastreadorDedicadoCluster');
    self.removeLayer('viagensEmDescargaAppDedicadoCluster');
    self.removeLayer('viagensEmDescargaAppRastreadorDedicadoCluster');
    self.removeLayer('viagensEmTransitoRastreadorDedicadoCluster');
    self.removeLayer('viagensEmTransitoAppDedicadoCluster');
    self.removeLayer('viagensEmTransitoAppRastreadorDedicadoCluster');
    
    for (item in statusQTD) {
        var element = document.getElementById(item);
        if (typeof element !== undefined && element !== null) {
            element.innerHTML = statusQTD[item];
        }
    }
    
    $.ajax({
        method: 'GET',
        url: yardUrl
    }).done(function (resp) {
    	
    	
    	
    	console.log(resp);
    	
        if (resp.length < 1) {
            $('.searchContainer').addClass('erro');
            contCarregamento++;
            self.fecharAguarde();
            return;
        }
        else {
            $('.searchContainer').removeClass('erro');
        }

        resp.forEach(function (viagem) {
        	
        	var listViagensOrigem = [];
        	var listVeiculosOrigem = [];
        	var utilizaSateliteOrigem = [];
        	var sinalSateliteOrigem = [];
        	var utilizaAppInfologOrigem = [];
        	var sinalAppInfologOrigem = [];
        	var dedicadoOrigem = [];
        	var corGrupoVeiculoOrigem = [];
        	
    		resp.forEach(function (viagemList) {
    			if(!viagem.possuiPosicao){
	    			if(viagemList.desSitua == "EM CARGA" && !viagemList.possuiPosicao && viagemList.dedicado
	    					&& (viagemList.nomRemet == viagem.nomRemet)){
	    				listViagensOrigem.push(viagemList.ctlPlvia);
	    				listVeiculosOrigem.push(viagemList.numPlacaVei);
        				utilizaSateliteOrigem.push(viagemList.utilizaSatelite);
        				sinalSateliteOrigem.push(viagemList.sinalSatelite);
        				utilizaAppInfologOrigem.push(viagemList.utilizaAppInfolog);
        				sinalAppInfologOrigem.push(viagemList.sinalAppInfolog);
        				dedicadoOrigem.push(viagemList.dedicado);
        				corGrupoVeiculoOrigem.push(viagemList.entidadeVinculada.corGrupoVeiculo);
	                }
    			}
    			
    		});
    		
    		viagem.viagensOrigem = listViagensOrigem;
    		viagem.veiculosOrigem = listVeiculosOrigem;
    		viagem.utilizaSateliteOrigem = utilizaSateliteOrigem;
    		viagem.sinalSateliteOrigem = sinalSateliteOrigem;
    		viagem.utilizaAppInfologOrigem = utilizaAppInfologOrigem;
    		viagem.sinalAppInfologOrigem = sinalAppInfologOrigem;
    		viagem.dedicadoOrigem = dedicadoOrigem;
    		viagem.corGrupoVeiculoOrigem = corGrupoVeiculoOrigem;
    		
        	if(viagem.dedicado){
        		if(viagem.utilizaSatelite && !viagem.utilizaAppInfolog){
            		if(viagem.desSitua == 'EM CARGA'){
    	        		console.log(viagem);
    	            	//adiciona uma nova viagem no mapa
    	                self.addNewViagemEmCargaRastreador(viagem.ctlPlvia, viagem, {
    	                    'nomeDaEmpresa': '',
    	                    'codDocum': '',
    	                    'paisUfPraca': ''
    	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
    	                statusQTD['USO']++;
            		}
            		
            		if(viagem.desSitua == 'EM DESCARGA'){
    	        		console.log(viagem);
    	            	//adiciona uma nova viagem no mapa
    	                self.addNewViagemEmDescargaRastreador(viagem.ctlPlvia, viagem, {
    	                    'nomeDaEmpresa': '',
    	                    'codDocum': '',
    	                    'paisUfPraca': ''
    	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
    	                statusQTD['USO']++;
            		}
            		
            		if(viagem.desSitua == 'EM TRANSITO'){
    	        		console.log(viagem);
    	            	//adiciona uma nova viagem no mapa
    	                self.addNewViagemEmTransitoRastreador(viagem.ctlPlvia, viagem, {
    	                    'nomeDaEmpresa': '',
    	                    'codDocum': '',
    	                    'paisUfPraca': ''
    	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
    	                statusQTD['USO']++;
            		}
            	}  
            	
            	if(!viagem.utilizaSatelite && viagem.utilizaAppInfolog){
            		if(viagem.desSitua == 'EM CARGA'){
    	        		console.log(viagem);
    	            	//adiciona uma nova viagem no mapa
    	                self.addNewViagemEmCargaApp(viagem.ctlPlvia, viagem, {
    	                    'nomeDaEmpresa': '',
    	                    'codDocum': '',
    	                    'paisUfPraca': ''
    	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
    	                statusQTD['USO']++;
            		}
            		
            		if(viagem.desSitua == 'EM DESCARGA'){
    	        		console.log(viagem);
    	            	//adiciona uma nova viagem no mapa
    	                self.addNewViagemEmDescargaApp(viagem.ctlPlvia, viagem, {
    	                    'nomeDaEmpresa': '',
    	                    'codDocum': '',
    	                    'paisUfPraca': ''
    	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
    	                statusQTD['USO']++;
            		}
            		
            		if(viagem.desSitua == 'EM TRANSITO'){
    	        		console.log(viagem);
    	            	//adiciona uma nova viagem no mapa
    	                self.addNewViagemEmTransitoApp(viagem.ctlPlvia, viagem, {
    	                    'nomeDaEmpresa': '',
    	                    'codDocum': '',
    	                    'paisUfPraca': ''
    	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
    	                statusQTD['USO']++;
            		}
            	}  
            	
            	if(viagem.utilizaSatelite && viagem.utilizaAppInfolog){
            		if(viagem.desSitua == 'EM CARGA'){
    	        		console.log(viagem);
    	            	//adiciona uma nova viagem no mapa
    	                self.addNewViagemEmCargaAppRastreador(viagem.ctlPlvia, viagem, {
    	                    'nomeDaEmpresa': '',
    	                    'codDocum': '',
    	                    'paisUfPraca': ''
    	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
    	                statusQTD['USO']++;
            		}
            		
            		if(viagem.desSitua == 'EM DESCARGA'){
    	        		console.log(viagem);
    	            	//adiciona uma nova viagem no mapa
    	                self.addNewViagemEmDescargaAppRastreador(viagem.ctlPlvia, viagem, {
    	                    'nomeDaEmpresa': '',
    	                    'codDocum': '',
    	                    'paisUfPraca': ''
    	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
    	                statusQTD['USO']++;
            		}
            		
            		if(viagem.desSitua == 'EM TRANSITO'){
    	        		console.log(viagem);
    	            	//adiciona uma nova viagem no mapa
    	                self.addNewViagemEmTransitoAppRastreador(viagem.ctlPlvia, viagem, {
    	                    'nomeDaEmpresa': '',
    	                    'codDocum': '',
    	                    'paisUfPraca': ''
    	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
    	                statusQTD['USO']++;
            		}
            	} 
        	}
        });

        for (item in statusQTD) {
            var element = document.getElementById(item);
            if (typeof element !== undefined && element !== null) {
                element.innerHTML = statusQTD[item];
            }
        }

        $('.resumo').addClass('ativo');

        var viagensEmCargaRastreador = new ol.layer.Vector({
            source: self.viagensEmCargaRastreadorSource,
            id: 'viagensEmCargaRastreador'
        });
        
        var viagensEmCargaApp = new ol.layer.Vector({
            source: self.viagensEmCargaAppSource,
            id: 'viagensEmCargaApp'
        });
        
        var viagensEmCargaAppRastreador = new ol.layer.Vector({
            source: self.viagensEmCargaAppRastreadorSource,
            id: 'viagensEmCargaAppRastreador'
        });
        
        var viagensEmDescargaRastreador = new ol.layer.Vector({
            source: self.viagensEmDescargaRastreadorSource,
            id: 'viagensEmDescargaRastreador'
        });
        
        var viagensEmDescargaApp = new ol.layer.Vector({
            source: self.viagensEmDescargaAppSource,
            id: 'viagensEmDescargaApp'
        });
        
        var viagensEmDescargaAppRastreador = new ol.layer.Vector({
            source: self.viagensEmDescargaAppRastreadorSource,
            id: 'viagensEmDescargaAppRastreador'
        });
        
        var viagensEmTransitoRastreador = new ol.layer.Vector({
            source: self.viagensEmTransitoRastreadorSource,
            id: 'viagensEmTransitoRastreador'
        });
        
        var viagensEmTransitoApp = new ol.layer.Vector({
            source: self.viagensEmTransitoAppSource,
            id: 'viagensEmTransitoApp'
        });
        
        var viagensEmTransitoAppRastreador = new ol.layer.Vector({
            source: self.viagensEmTransitoAppRastreadorSource,
            id: 'viagensEmTransitoAppRastreador'
        });
        
        var botao = document.getElementById('botao');
        self.timer(timeToUpdate, timerTarget, yardUrl, tableId, botao.innerHTML);
        contCarregamento++;
        self.fecharAguarde();
        
    }).catch(function (err) {
        alert(err)
    });
}


radarViagensFactory.prototype.buscarVeiculosEmUsoVinculado = function (tableId, entidadeNome, yardUrl, otmUrl, timeToUpdate, timerTarget) {
	var self = this;
    var statusQTD = {
        USO: 0
    }    
    
    self.viagensEmCargaRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmCargaRastreador');
    
    self.viagensEmCargaAppSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmCargaApp');
    
    self.viagensEmCargaAppRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmCargaAppRastreador');
    
    self.viagensEmDescargaRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmDescargaRastreador');
    
    self.viagensEmDescargaAppSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmDescargaApp');
    
    self.viagensEmDescargaAppRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmDescargaAppRastreador');
    
    self.viagensEmTransitoRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmTransitoRastreador');
    
    self.viagensEmTransitoAppSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmTransitoApp');
    
    self.viagensEmTransitoAppRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmTransitoAppRastreador');
    
    self.removeLayer('viagensEmCargaRastreadorDedicadoCluster');
    self.removeLayer('viagensEmCargaAppDedicadoCluster');
    self.removeLayer('viagensEmCargaAppRastreadorDedicadoCluster');
    self.removeLayer('viagensEmDescargaRastreadorDedicadoCluster');
    self.removeLayer('viagensEmDescargaAppDedicadoCluster');
    self.removeLayer('viagensEmDescargaAppRastreadorDedicadoCluster');
    self.removeLayer('viagensEmTransitoRastreadorDedicadoCluster');
    self.removeLayer('viagensEmTransitoAppDedicadoCluster');
    self.removeLayer('viagensEmTransitoAppRastreadorDedicadoCluster');
    
    for (item in statusQTD) {
        var element = document.getElementById(item);
        if (typeof element !== undefined && element !== null) {
            element.innerHTML = statusQTD[item];
        }
    }
    
    $.ajax({
        method: 'GET',
        url: yardUrl,
        data: {
        	entidade: entidadeNome
        }
    }).done(function (resp) {
    	
    	
    	
    	console.log(resp);
    	
        if (resp.length < 1) {
            $('.searchContainer').addClass('erro');
            contCarregamento++;
            self.fecharAguarde();
            return;
        }
        else {
            $('.searchContainer').removeClass('erro');
        }

        resp.forEach(function (viagem) {
        	
        	var listViagensOrigem = [];
        	var listVeiculosOrigem = [];
        	var utilizaSateliteOrigem = [];
        	var sinalSateliteOrigem = [];
        	var utilizaAppInfologOrigem = [];
        	var sinalAppInfologOrigem = [];
        	var dedicadoOrigem = [];
        	var corGrupoVeiculoOrigem = [];
        	
    		resp.forEach(function (viagemList) {
    			if(!viagem.possuiPosicao){
	    			if(viagemList.desSitua == "EM CARGA" && !viagemList.possuiPosicao && viagemList.dedicado
	    					&& (viagemList.nomRemet == viagem.nomRemet)){
	    				listViagensOrigem.push(viagemList.ctlPlvia);
	    				listVeiculosOrigem.push(viagemList.numPlacaVei);
        				utilizaSateliteOrigem.push(viagemList.utilizaSatelite);
        				sinalSateliteOrigem.push(viagemList.sinalSatelite);
        				utilizaAppInfologOrigem.push(viagemList.utilizaAppInfolog);
        				sinalAppInfologOrigem.push(viagemList.sinalAppInfolog);
        				dedicadoOrigem.push(viagemList.dedicado);
        				corGrupoVeiculoOrigem.push(viagemList.entidadeVinculada.corGrupoVeiculo);
	                }
    			}
    			
    		});
    		
    		viagem.viagensOrigem = listViagensOrigem;
    		viagem.veiculosOrigem = listVeiculosOrigem;
    		viagem.utilizaSateliteOrigem = utilizaSateliteOrigem;
    		viagem.sinalSateliteOrigem = sinalSateliteOrigem;
    		viagem.utilizaAppInfologOrigem = utilizaAppInfologOrigem;
    		viagem.sinalAppInfologOrigem = sinalAppInfologOrigem;
    		viagem.dedicadoOrigem = dedicadoOrigem;
    		viagem.corGrupoVeiculoOrigem = corGrupoVeiculoOrigem;
    		
        	if(viagem.dedicado){
        		if(viagem.utilizaSatelite && !viagem.utilizaAppInfolog){
            		if(viagem.desSitua == 'EM CARGA'){
    	        		console.log(viagem);
    	            	//adiciona uma nova viagem no mapa
    	                self.addNewViagemEmCargaRastreador(viagem.ctlPlvia, viagem, {
    	                    'nomeDaEmpresa': '',
    	                    'codDocum': '',
    	                    'paisUfPraca': ''
    	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
    	                statusQTD['USO']++;
            		}
            		
            		if(viagem.desSitua == 'EM DESCARGA'){
    	        		console.log(viagem);
    	            	//adiciona uma nova viagem no mapa
    	                self.addNewViagemEmDescargaRastreador(viagem.ctlPlvia, viagem, {
    	                    'nomeDaEmpresa': '',
    	                    'codDocum': '',
    	                    'paisUfPraca': ''
    	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
    	                statusQTD['USO']++;
            		}
            		
            		if(viagem.desSitua == 'EM TRANSITO'){
    	        		console.log(viagem);
    	            	//adiciona uma nova viagem no mapa
    	                self.addNewViagemEmTransitoRastreador(viagem.ctlPlvia, viagem, {
    	                    'nomeDaEmpresa': '',
    	                    'codDocum': '',
    	                    'paisUfPraca': ''
    	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
    	                statusQTD['USO']++;
            		}
            	}  
            	
            	if(!viagem.utilizaSatelite && viagem.utilizaAppInfolog){
            		if(viagem.desSitua == 'EM CARGA'){
    	        		console.log(viagem);
    	            	//adiciona uma nova viagem no mapa
    	                self.addNewViagemEmCargaApp(viagem.ctlPlvia, viagem, {
    	                    'nomeDaEmpresa': '',
    	                    'codDocum': '',
    	                    'paisUfPraca': ''
    	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
    	                statusQTD['USO']++;
            		}
            		
            		if(viagem.desSitua == 'EM DESCARGA'){
    	        		console.log(viagem);
    	            	//adiciona uma nova viagem no mapa
    	                self.addNewViagemEmDescargaApp(viagem.ctlPlvia, viagem, {
    	                    'nomeDaEmpresa': '',
    	                    'codDocum': '',
    	                    'paisUfPraca': ''
    	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
    	                statusQTD['USO']++;
            		}
            		
            		if(viagem.desSitua == 'EM TRANSITO'){
    	        		console.log(viagem);
    	            	//adiciona uma nova viagem no mapa
    	                self.addNewViagemEmTransitoApp(viagem.ctlPlvia, viagem, {
    	                    'nomeDaEmpresa': '',
    	                    'codDocum': '',
    	                    'paisUfPraca': ''
    	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
    	                statusQTD['USO']++;
            		}
            	}  
            	
            	if(viagem.utilizaSatelite && viagem.utilizaAppInfolog){
            		if(viagem.desSitua == 'EM CARGA'){
    	        		console.log(viagem);
    	            	//adiciona uma nova viagem no mapa
    	                self.addNewViagemEmCargaAppRastreador(viagem.ctlPlvia, viagem, {
    	                    'nomeDaEmpresa': '',
    	                    'codDocum': '',
    	                    'paisUfPraca': ''
    	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
    	                statusQTD['USO']++;
            		}
            		
            		if(viagem.desSitua == 'EM DESCARGA'){
    	        		console.log(viagem);
    	            	//adiciona uma nova viagem no mapa
    	                self.addNewViagemEmDescargaAppRastreador(viagem.ctlPlvia, viagem, {
    	                    'nomeDaEmpresa': '',
    	                    'codDocum': '',
    	                    'paisUfPraca': ''
    	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
    	                statusQTD['USO']++;
            		}
            		
            		if(viagem.desSitua == 'EM TRANSITO'){
    	        		console.log(viagem);
    	            	//adiciona uma nova viagem no mapa
    	                self.addNewViagemEmTransitoAppRastreador(viagem.ctlPlvia, viagem, {
    	                    'nomeDaEmpresa': '',
    	                    'codDocum': '',
    	                    'paisUfPraca': ''
    	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
    	                statusQTD['USO']++;
            		}
            	} 
        	}
        });

        for (item in statusQTD) {
            var element = document.getElementById(item);
            if (typeof element !== undefined && element !== null) {
                element.innerHTML = statusQTD[item];
            }
        }

        $('.resumo').addClass('ativo');

        var viagensEmCargaRastreador = new ol.layer.Vector({
            source: self.viagensEmCargaRastreadorSource,
            id: 'viagensEmCargaRastreador'
        });
        
        var viagensEmCargaApp = new ol.layer.Vector({
            source: self.viagensEmCargaAppSource,
            id: 'viagensEmCargaApp'
        });
        
        var viagensEmCargaAppRastreador = new ol.layer.Vector({
            source: self.viagensEmCargaAppRastreadorSource,
            id: 'viagensEmCargaAppRastreador'
        });
        
       
        var viagensEmDescargaRastreador = new ol.layer.Vector({
            source: self.viagensEmDescargaRastreadorSource,
            id: 'viagensEmDescargaRastreador'
        });
        
        var viagensEmDescargaApp = new ol.layer.Vector({
            source: self.viagensEmDescargaAppSource,
            id: 'viagensEmDescargaApp'
        });
        
        var viagensEmDescargaAppRastreador = new ol.layer.Vector({
            source: self.viagensEmDescargaAppRastreadorSource,
            id: 'viagensEmDescargaAppRastreador'
        });
        
     
        var viagensEmTransitoRastreador = new ol.layer.Vector({
            source: self.viagensEmTransitoRastreadorSource,
            id: 'viagensEmTransitoRastreador'
        });
        
        var viagensEmTransitoApp = new ol.layer.Vector({
            source: self.viagensEmTransitoAppSource,
            id: 'viagensEmTransitoApp'
        });
        
        var viagensEmTransitoAppRastreador = new ol.layer.Vector({
            source: self.viagensEmTransitoAppRastreadorSource,
            id: 'viagensEmTransitoAppRastreador'
        });
        
        contCarregamento++;
        self.fecharAguarde();
        
    }).catch(function (err) {
        alert(err)
    });
}

radarViagensFactory.prototype.buscarVeiculosVazios = function (tableId, filtro, urlViagensVazio, otmUrl, timeToUpdate, timerTarget) {
	var self = this;
	var statusQTD = {
		VAZIO: 0
	}
	
	self.veiculosVazioRastreadorSource = new ol.source.Vector({
        features: []
    });
	
	self.veiculosVazioAppSource = new ol.source.Vector({
        features: []
    });
	
	self.veiculosVazioAppRastreadorSource = new ol.source.Vector({
        features: []
    });
	
	self.entidadeVinculadaSource = new ol.source.Vector({
        features: []
    });

    self.removeLayer('veiculoVazioRastreador');
    self.removeLayer('veiculoVazioApp');
    self.removeLayer('veiculoVazioAppRastreador');
    self.removeLayer('entidadeVinculada');
    
    self.removeLayer('veiculoVazioRastreadorCluster');
    self.removeLayer('veiculoVazioAppCluster');
    self.removeLayer('veiculoVazioAppRastreadorCluster');
    self.removeLayer('entidadeVinculadaCluster');
    
    for (item in statusQTD) {
        var element = document.getElementById(item);
        if (typeof element !== undefined && element !== null) {
            element.innerHTML = statusQTD[item];
        }
    }
    
    $.ajax({
        method: 'GET',
        url: urlViagensVazio
    }).done(function (resp) {
        if (resp.length < 1) {
            $('.searchContainer').addClass('erro');
            contCarregamento = contCarregamento + 2;
            self.fecharAguarde();
            return;
        } else {
            $('.searchContainer').removeClass('erro');

            
        }

        resp.forEach(function (veiculo) {
        	if(veiculo.vazio){
        		
        		var listVeiculosVazios = [];
        		var utilizaSateliteVazios = [];
            	var sinalSateliteVazios = [];
            	var utilizaAppInfologVazios = [];
            	var sinalAppInfologVazios = [];
            	var corGrupoVeiculosVazios = [];
        		
        		if((veiculo.utilizaSatelite && !veiculo.utilizaAppInfolog) && veiculo.sinalSatelite == 'COM_SINAL'){
	        		console.log(veiculo);
		            //adiciona uma nova viagem no mapa
		            self.addNewVeiculoVazioRastreador(veiculo.id, veiculo, {
		                'nomeDaEmpresa': '',
		                'codDocum': '',
		                'paisUfPraca': ''
		            }, [veiculo.ultimaPosicao.lon, veiculo.ultimaPosicao.lat]);
		            statusQTD['VAZIO']++;
        		}
        		
        		if((!veiculo.utilizaSatelite && veiculo.utilizaAppInfolog) && veiculo.sinalAppInfolog == 'COM_SINAL'){
	        		console.log(veiculo);
		            //adiciona uma nova viagem no mapa
		            self.addNewVeiculoVazioApp(veiculo.id, veiculo, {
		                'nomeDaEmpresa': '',
		                'codDocum': '',
		                'paisUfPraca': ''
		            }, [veiculo.ultimaPosicao.lon, veiculo.ultimaPosicao.lat]);
		            statusQTD['VAZIO']++;
        		}
        		
        		if((veiculo.utilizaSatelite && veiculo.utilizaAppInfolog) &&
        			(veiculo.sinalSatelite == 'COM_SINAL' || veiculo.sinalAppInfolog == 'COM_SINAL')){
	        		console.log(veiculo);
		            //adiciona uma nova viagem no mapa
		            self.addNewVeiculoVazioAppRastreador(veiculo.id, veiculo, {
		                'nomeDaEmpresa': '',
		                'codDocum': '',
		                'paisUfPraca': ''
		            }, [veiculo.ultimaPosicao.lon, veiculo.ultimaPosicao.lat]);
		            statusQTD['VAZIO']++;
        		}
        		
        		if(filtro){
        			resp.forEach(function (veiculoList) {
            			if(((veiculoList.utilizaSatelite && !veiculoList.utilizaAppInfolog && veiculoList.sinalSatelite != 'COM_SINAL') || 
            				(!veiculoList.utilizaSatelite && veiculoList.utilizaAppInfolog && veiculoList.sinalAppInfolog != 'COM_SINAL') ||
            				(veiculoList.utilizaSatelite && veiculoList.utilizaAppInfolog && veiculoList.sinalSatelite != 'COM_SINAL' && veiculoList.sinalAppInfolog != 'COM_SINAL') ||
                    		(!veiculoList.utilizaSatelite && !veiculoList.utilizaAppInfolog)) && 
            				(veiculoList.entidadeVinculada.id == veiculo.entidadeVinculada.id)){
            				listVeiculosVazios.push(veiculoList.placa);
            				utilizaSateliteVazios.push(veiculoList.utilizaSatelite);
            				sinalSateliteVazios.push(veiculoList.sinalSatelite);
            				utilizaAppInfologVazios.push(veiculoList.utilizaAppInfolog);
            				sinalAppInfologVazios.push(veiculoList.sinalAppInfolog);
            				corGrupoVeiculosVazios.push(veiculoList.corGrupoVeiculo);
                        }
            			
            		});
            		            		
        			veiculo.veiculosVazios = listVeiculosVazios;
            		veiculo.utilizaSateliteVazios = utilizaSateliteVazios;
            		veiculo.sinalSateliteVazios = sinalSateliteVazios;
            		veiculo.utilizaAppInfologVazios = utilizaAppInfologVazios;
            		veiculo.sinalAppInfologVazios = sinalAppInfologVazios;
            		veiculo.corGrupoVeiculosVazios = corGrupoVeiculosVazios;
        			
            		if((veiculo.utilizaSatelite && !veiculo.utilizaAppInfolog && veiculo.sinalSatelite != 'COM_SINAL') || 
            				(!veiculo.utilizaSatelite && veiculo.utilizaAppInfolog && veiculo.sinalAppInfolog != 'COM_SINAL') ||
            				(veiculo.utilizaSatelite && veiculo.utilizaAppInfolog && veiculo.sinalSatelite != 'COM_SINAL' && veiculo.sinalAppInfolog != 'COM_SINAL') ||
            				(!veiculo.utilizaSatelite && !veiculo.utilizaAppInfolog)){
	        			console.log(veiculo);
			            //adiciona uma nova viagem no mapa (Empresa)
			            self.addEntidadeVinculadaRastreador(veiculo.id, veiculo, {
			                'nomeDaEmpresa': '',
			                'codDocum': '',
			                'paisUfPraca': ''
			            }, [veiculo.ultimaPosicao.lon, veiculo.ultimaPosicao.lat]);
			            statusQTD['VAZIO']++;
        			}
        		}
        	}        	
        });

        for (item in statusQTD) {
            var element = document.getElementById(item);
            if (typeof element !== undefined && element !== null) {
                element.innerHTML = statusQTD[item];
            }
        }
        
        var veiculoVazioRastreador = new ol.layer.Vector({
            source: self.veiculosVazioRastreadorSource,
            id: 'veiculoVazioRastreador'
        });
        
        var veiculoVazioApp = new ol.layer.Vector({
            source: self.veiculosVazioAppSource,
            id: 'veiculoVazioApp'
        });
        
        var veiculoVazioAppRastreador = new ol.layer.Vector({
            source: self.veiculosVazioAppRastreadorSource,
            id: 'veiculoVazioAppRastreador'
        });
        
        var entidadeVinculada = new ol.layer.Vector({
            source: self.entidadeVinculadaSource,
            id: 'entidadeVinculada'
        });
        
        self.toggleEntidadeVinculada($('#exibirVazio').is(':checked'));
       
        var botao = document.getElementById('botao');
       	self.timer(timeToUpdate, timerTarget, urlViagensVazio, tableId, botao.innerHTML);
        contCarregamento = contCarregamento + 2;
        self.fecharAguarde();
        
    }).catch(function (err) {
        alert(err)
    });
}

radarViagensFactory.prototype.buscarVeiculosVaziosVinculado = function (tableId, entidade, urlViagensVazio, otmUrl, timeToUpdate, timerTarget) {
	var self = this;
	var statusQTD = {
		VAZIO: 0
	}
	
	self.veiculosVazioRastreadorSource = new ol.source.Vector({
        features: []
    });
	
	self.veiculosVazioAppSource = new ol.source.Vector({
        features: []
    });
	
	self.veiculosVazioAppRastreadorSource = new ol.source.Vector({
        features: []
    });
	
	self.entidadeVinculadaSource = new ol.source.Vector({
        features: []
    });

    self.removeLayer('veiculoVazioRastreador');
    self.removeLayer('veiculoVazioApp');
    self.removeLayer('veiculoVazioAppRastreador');
    self.removeLayer('entidadeVinculada');
    
    self.removeLayer('veiculoVazioRastreadorCluster');
    self.removeLayer('veiculoVazioAppCluster');
    self.removeLayer('veiculoVazioAppRastreadorCluster');
    self.removeLayer('entidadeVinculadaCluster');
    
    for (item in statusQTD) {
        var element = document.getElementById(item);
        if (typeof element !== undefined && element !== null) {
            element.innerHTML = statusQTD[item];
        }
    }
    
    $.ajax({
        method: 'GET',
        url: urlViagensVazio,
        data: {
        	entidade: entidade
        }
    }).done(function (resp) {
        if (resp.length < 1) {
            $('.searchContainer').addClass('erro');
            contCarregamento = contCarregamento + 2;
            self.fecharAguarde();
            return;
        } else {
            $('.searchContainer').removeClass('erro');
        }

        resp.forEach(function (veiculo) {
        	
        	var listVeiculosVazios = [];
        	var utilizaSateliteVazios = [];
        	var sinalSateliteVazios = [];
        	var utilizaAppInfologVazios = [];
        	var sinalAppInfologVazios = [];
        	var corGrupoVeiculosVazios = [];
        	
    		resp.forEach(function (veiculoList) {
    			if(((veiculoList.utilizaSatelite && !veiculoList.utilizaAppInfolog && veiculoList.sinalSatelite != 'COM_SINAL') || 
        				(!veiculoList.utilizaSatelite && veiculoList.utilizaAppInfolog && veiculoList.sinalAppInfolog != 'COM_SINAL') ||
        				(veiculoList.utilizaSatelite && veiculoList.utilizaAppInfolog && veiculoList.sinalSatelite != 'COM_SINAL' && veiculoList.sinalAppInfolog != 'COM_SINAL') ||
                		(!veiculoList.utilizaSatelite && !veiculoList.utilizaAppInfolog)) && 
        				(veiculoList.entidadeVinculada.id == veiculo.entidadeVinculada.id)){
        				listVeiculosVazios.push(veiculoList.placa);
        				utilizaSateliteVazios.push(veiculoList.utilizaSatelite);
        				sinalSateliteVazios.push(veiculoList.sinalSatelite);
        				utilizaAppInfologVazios.push(veiculoList.utilizaAppInfolog);
        				sinalAppInfologVazios.push(veiculoList.sinalAppInfolog);
        				corGrupoVeiculosVazios.push(veiculoList.corGrupoVeiculo);
                    }
    			
    		});
    		
    		veiculo.veiculosVazios = listVeiculosVazios;
    		veiculo.utilizaSateliteVazios = utilizaSateliteVazios;
    		veiculo.sinalSateliteVazios = sinalSateliteVazios;
    		veiculo.utilizaAppInfologVazios = utilizaAppInfologVazios;
    		veiculo.sinalAppInfologVazios = sinalAppInfologVazios;
    		veiculo.corGrupoVeiculosVazios = corGrupoVeiculosVazios;
    		
        	if(veiculo.vazio){
        		if((veiculo.utilizaSatelite && !veiculo.utilizaAppInfolog) && veiculo.sinalSatelite == 'COM_SINAL'){
	        		console.log(veiculo);
		            //adiciona uma nova viagem no mapa
		            self.addNewVeiculoVazioRastreador(veiculo.id, veiculo, {
		                'nomeDaEmpresa': '',
		                'codDocum': '',
		                'paisUfPraca': ''
		            }, [veiculo.ultimaPosicao.lon, veiculo.ultimaPosicao.lat]);
		            statusQTD['VAZIO']++;
        		}
        		
        		if((!veiculo.utilizaSatelite && veiculo.utilizaAppInfolog) && veiculo.sinalAppInfolog == 'COM_SINAL'){
	        		console.log(veiculo);
		            //adiciona uma nova viagem no mapa
		            self.addNewVeiculoVazioApp(veiculo.id, veiculo, {
		                'nomeDaEmpresa': '',
		                'codDocum': '',
		                'paisUfPraca': ''
		            }, [veiculo.ultimaPosicao.lon, veiculo.ultimaPosicao.lat]);
		            statusQTD['VAZIO']++;
        		}
        		
        		if((veiculo.utilizaSatelite && veiculo.utilizaAppInfolog) &&
        			(veiculo.sinalSatelite == 'COM_SINAL' || veiculo.sinalSatelite == 'COM_SINAL')){
	        		console.log(veiculo);
		            //adiciona uma nova viagem no mapa
		            self.addNewVeiculoVazioAppRastreador(veiculo.id, veiculo, {
		                'nomeDaEmpresa': '',
		                'codDocum': '',
		                'paisUfPraca': ''
		            }, [veiculo.ultimaPosicao.lon, veiculo.ultimaPosicao.lat]);
		            statusQTD['VAZIO']++;
        		}
        		
        		if((veiculo.utilizaSatelite && !veiculo.utilizaAppInfolog && veiculo.sinalSatelite != 'COM_SINAL') || 
        				(!veiculo.utilizaSatelite && veiculo.utilizaAppInfolog && veiculo.sinalAppInfolog != 'COM_SINAL') ||
        				(veiculo.utilizaSatelite && veiculo.utilizaAppInfolog && veiculo.sinalSatelite != 'COM_SINAL' && veiculo.sinalAppInfolog != 'COM_SINAL') ||
        				(!veiculo.utilizaSatelite && !veiculo.utilizaAppInfolog)){
        			console.log(veiculo);
		            //adiciona uma nova viagem no mapa (Empresa)
		            self.addEntidadeVinculadaRastreador(veiculo.id, veiculo, {
		                'nomeDaEmpresa': '',
		                'codDocum': '',
		                'paisUfPraca': ''
		            }, [veiculo.ultimaPosicao.lon, veiculo.ultimaPosicao.lat]);
		            statusQTD['VAZIO']++;
        		}
        	}        	
        });

        for (item in statusQTD) {
            var element = document.getElementById(item);
            if (typeof element !== undefined && element !== null) {
                element.innerHTML = statusQTD[item];
            }
        }
        
        var veiculoVazioRastreador = new ol.layer.Vector({
            source: self.veiculosVazioRastreadorSource,
            id: 'veiculoVazioRastreador'
        });
        
        var veiculoVazioApp = new ol.layer.Vector({
            source: self.veiculosVazioAppSource,
            id: 'veiculoVazioApp'
        });
        
        var veiculoVazioAppRastreador = new ol.layer.Vector({
            source: self.veiculosVazioAppRastreadorSource,
            id: 'veiculoVazioAppRastreador'
        });
        
        var entidadeVinculada = new ol.layer.Vector({
            source: self.entidadeVinculadaSource,
            id: 'entidadeVinculada'
        });
        
        self.toggleEntidadeVinculada($('#exibirVazio').is(':checked'));
        
        contCarregamento = contCarregamento + 2;
        self.fecharAguarde();
    }).catch(function (err) {
        alert(err)
    });
}

radarViagensFactory.prototype.selecionaVeiculoViagens = function (tableId, entidadeIds, yardUrl, otmUrl, timeToUpdate, timerTarget) {
	var self = this;
    var statusQTD = {
        CARGA: 0,
        DESCARGA: 0,
        TRANSITO: 0
    }
    
    self.viagensEmCargaRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmCargaRastreador');
    
    self.viagensEmCargaAppSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmCargaApp');
    
    self.viagensEmCargaAppRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmCargaAppRastreador');
    
    self.viagensEmDescargaRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmDescargaRastreador');
    
    self.viagensEmDescargaAppSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmDescargaApp');
    
    self.viagensEmDescargaAppRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmDescargaAppRastreador');
    
    self.viagensEmTransitoRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmTransitoRastreador');
    
    self.viagensEmTransitoAppSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmTransitoApp');
    
    self.viagensEmTransitoAppRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.removeLayer('viagensEmTransitoAppRastreador');

    self.removeLayer('viagensEmCargaRastreadorCluster');
    self.removeLayer('viagensEmCargaAppCluster');
    self.removeLayer('viagensEmCargaAppRastreadorCluster');
    self.removeLayer('viagensEmDescargaRastreadorCluster');
    self.removeLayer('viagensEmDescargaAppCluster');
    self.removeLayer('viagensEmDescargaAppRastreadorCluster');
    self.removeLayer('viagensEmTransitoRastreadorCluster');
    self.removeLayer('viagensEmTransitoAppCluster');
    self.removeLayer('viagensEmTransitoAppRastreadorCluster');
    
    $.ajax({
        method: 'GET',
        url: yardUrl,
        data: {
            entidade: entidadeIds
        }
    }).done(function (resp) {
    	
    	console.log(resp);
    	
        if (resp.length < 1) {
            $('.searchContainer').addClass('erro');
            contCarregamento = 3;
            return;
        }
        else {
            $('.searchContainer').removeClass('erro');

        }

        resp.forEach(function (viagem) {
        	
        	var listViagensOrigem = [];
        	var listVeiculosOrigem = [];
        	var utilizaSateliteOrigem = [];
        	var sinalSateliteOrigem = [];
        	var utilizaAppInfologOrigem = [];
        	var sinalAppInfologOrigem = [];
        	var dedicadoOrigem = [];
        	var corGrupoVeiculoOrigem = [];
        	
    		resp.forEach(function (viagemList) {
    			if(!viagem.possuiPosicao){
	    			if(viagemList.desSitua == "EM CARGA" && !viagemList.possuiPosicao 
	    					&& (viagemList.nomRemet == viagem.nomRemet)){
	    				listViagensOrigem.push(viagemList.ctlPlvia);
	    				listVeiculosOrigem.push(viagemList.numPlacaVei);
        				utilizaSateliteOrigem.push(viagemList.utilizaSatelite);
        				sinalSateliteOrigem.push(viagemList.sinalSatelite);
        				utilizaAppInfologOrigem.push(viagemList.utilizaAppInfolog);
        				sinalAppInfologOrigem.push(viagemList.sinalAppInfolog);
        				dedicadoOrigem.push(viagemList.dedicado);
        				if(viagemList.dedicado){
        					corGrupoVeiculoOrigem.push(viagemList.entidadeVinculada.corGrupoVeiculo);
        				}else{
        					corGrupoVeiculoOrigem.push(null);
        				}
	                }
    			}
    			
    		});
    		
    		viagem.viagensOrigem = listViagensOrigem;
    		viagem.veiculosOrigem = listVeiculosOrigem;
    		viagem.utilizaSateliteOrigem = utilizaSateliteOrigem;
    		viagem.sinalSateliteOrigem = sinalSateliteOrigem;
    		viagem.utilizaAppInfologOrigem = utilizaAppInfologOrigem;
    		viagem.sinalAppInfologOrigem = sinalAppInfologOrigem;
    		viagem.dedicadoOrigem = dedicadoOrigem;
    		viagem.corGrupoVeiculoOrigem = corGrupoVeiculoOrigem;
    		
        	if(viagem.utilizaSatelite && !viagem.utilizaAppInfolog){
        		if(viagem.desSitua == 'EM CARGA'){
	        		console.log(viagem);
	            	//adiciona uma nova viagem no mapa
	                self.addNewViagemEmCargaRastreador(viagem.ctlPlvia, viagem, {
	                    'nomeDaEmpresa': '',
	                    'codDocum': '',
	                    'paisUfPraca': ''
	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
	                statusQTD['CARGA']++;
        		}
        		
        		if(viagem.desSitua == 'EM DESCARGA'){
	        		console.log(viagem);
	            	//adiciona uma nova viagem no mapa
	                self.addNewViagemEmDescargaRastreador(viagem.ctlPlvia, viagem, {
	                    'nomeDaEmpresa': '',
	                    'codDocum': '',
	                    'paisUfPraca': ''
	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
	                statusQTD['DESCARGA']++;
        		}
        		
        		if(viagem.desSitua == 'EM TRANSITO'){
	        		console.log(viagem);
	            	//adiciona uma nova viagem no mapa
	                self.addNewViagemEmTransitoRastreador(viagem.ctlPlvia, viagem, {
	                    'nomeDaEmpresa': '',
	                    'codDocum': '',
	                    'paisUfPraca': ''
	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
	                statusQTD['TRANSITO']++;
        		}
        	}  
        	
        	if(!viagem.utilizaSatelite && viagem.utilizaAppInfolog){
        		if(viagem.desSitua == 'EM CARGA'){
	        		console.log(viagem);
	            	//adiciona uma nova viagem no mapa
	                self.addNewViagemEmCargaApp(viagem.ctlPlvia, viagem, {
	                    'nomeDaEmpresa': '',
	                    'codDocum': '',
	                    'paisUfPraca': ''
	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
	                statusQTD['CARGA']++;
        		}
        		
        		if(viagem.desSitua == 'EM DESCARGA'){
	        		console.log(viagem);
	            	//adiciona uma nova viagem no mapa
	                self.addNewViagemEmDescargaApp(viagem.ctlPlvia, viagem, {
	                    'nomeDaEmpresa': '',
	                    'codDocum': '',
	                    'paisUfPraca': ''
	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
	                statusQTD['DESCARGA']++;
        		}
        		
        		if(viagem.desSitua == 'EM TRANSITO'){
	        		console.log(viagem);
	            	//adiciona uma nova viagem no mapa
	                self.addNewViagemEmTransitoApp(viagem.ctlPlvia, viagem, {
	                    'nomeDaEmpresa': '',
	                    'codDocum': '',
	                    'paisUfPraca': ''
	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
	                statusQTD['TRANSITO']++;
        		}
        	}  
        	
        	if(viagem.utilizaSatelite && viagem.utilizaAppInfolog){
        		if(viagem.desSitua == 'EM CARGA'){
	        		console.log(viagem);
	            	//adiciona uma nova viagem no mapa
	                self.addNewViagemEmCargaAppRastreador(viagem.ctlPlvia, viagem, {
	                    'nomeDaEmpresa': '',
	                    'codDocum': '',
	                    'paisUfPraca': ''
	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
	                statusQTD['CARGA']++;
        		}
        		
        		if(viagem.desSitua == 'EM DESCARGA'){
	        		console.log(viagem);
	            	//adiciona uma nova viagem no mapa
	                self.addNewViagemEmDescargaAppRastreador(viagem.ctlPlvia, viagem, {
	                    'nomeDaEmpresa': '',
	                    'codDocum': '',
	                    'paisUfPraca': ''
	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
	                statusQTD['DESCARGA']++;
        		}
        		
        		if(viagem.desSitua == 'EM TRANSITO'){
	        		console.log(viagem);
	            	//adiciona uma nova viagem no mapa
	                self.addNewViagemEmTransitoAppRastreador(viagem.ctlPlvia, viagem, {
	                    'nomeDaEmpresa': '',
	                    'codDocum': '',
	                    'paisUfPraca': ''
	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
	                statusQTD['TRANSITO']++;
        		}
        	} 
        	
        });
        
        for (item in statusQTD) {
            var element = document.getElementById(item);
            if (typeof element !== undefined && element !== null) {
                element.innerHTML = statusQTD[item];
            }
        }

        $('.resumo').addClass('ativo');
        
        var viagensEmCargaRastreador = new ol.layer.Vector({
            source: self.viagensEmCargaRastreadorSource,
            id: 'viagensEmCargaRastreador'
        });
        
        var viagensEmCargaApp = new ol.layer.Vector({
            source: self.viagensEmCargaAppSource,
            id: 'viagensEmCargaApp'
        });
        
        var viagensEmCargaAppRastreador = new ol.layer.Vector({
            source: self.viagensEmCargaAppRastreadorSource,
            id: 'viagensEmCargaAppRastreador'
        });
        
        var viagensEmDescargaRastreador = new ol.layer.Vector({
            source: self.viagensEmDescargaRastreadorSource,
            id: 'viagensEmDescargaRastreador'
        });
        
        var viagensEmDescargaApp = new ol.layer.Vector({
            source: self.viagensEmDescargaAppSource,
            id: 'viagensEmDescargaApp'
        });
        
        var viagensEmDescargaAppRastreador = new ol.layer.Vector({
            source: self.viagensEmDescargaAppRastreadorSource,
            id: 'viagensEmDescargaAppRastreador'
        });
        
        var viagensEmTransitoRastreador = new ol.layer.Vector({
            source: self.viagensEmTransitoRastreadorSource,
            id: 'viagensEmTransitoRastreador'
        });
        
        var viagensEmTransitoApp = new ol.layer.Vector({
            source: self.viagensEmTransitoAppSource,
            id: 'viagensEmTransitoApp'
        });
        
        var viagensEmTransitoAppRastreador = new ol.layer.Vector({
            source: self.viagensEmTransitoAppRastreadorSource,
            id: 'viagensEmTransitoAppRastreador'
        });
        
        contCarregamento = 3;

    }).catch(function (err) {
        alert(err)
    });
}

/**
 * Atalho que chama outras funções e monta todos itens necessários para ter um mapa funcional.
 * @param {string} tableId - id da id da tabela para pegar com jquery, usar # na frete
 * @param {string} entidade - id da entidade para ser passada ao serviço
 * @param {string} yardUrl - url que após clicar em um resultado busca as informações de viagem daquela entidade
 * @param {string} timeToUpdate -  tempo em minutos para atualizar o relógio e chamar o serviço para atualizar a tabela novamente
 * @param {string} timerTarget - id do elemento em html que será atualizado o tempo
 */
radarViagensFactory.prototype.buildYard = function (tableId, entidadeNome, yardUrl, otmUrl, timeToUpdate, timerTarget) {
	contCarregamento = 0;
	var self = this;
    var statusQTD = {
        CARGA: 0,
        DESCARGA: 0,
        TRANSITO: 0
    }    
    
    self.viagensEmCargaRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.viagensEmCargaAppSource = new ol.source.Vector({
        features: []
    });
    
    self.viagensEmCargaAppRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.viagensEmDescargaRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.viagensEmDescargaAppSource = new ol.source.Vector({
        features: []
    });
    
    self.viagensEmDescargaAppRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.viagensEmTransitoRastreadorSource = new ol.source.Vector({
        features: []
    });
    
    self.viagensEmTransitoAppSource = new ol.source.Vector({
        features: []
    });
    
    self.viagensEmTransitoAppRastreadorSource = new ol.source.Vector({
        features: []
    });

    self.removeLayer('viagensEmCargaRastreador');
    self.removeLayer('viagensEmCargaApp');
    self.removeLayer('viagensEmCargaAppRastreador');
    self.removeLayer('viagensEmDescargaRastreador');
    self.removeLayer('viagensEmDescargaApp');
    self.removeLayer('viagensEmDescargaAppRastreador');
    self.removeLayer('viagensEmTransitoRastreador');
    self.removeLayer('viagensEmTransitoApp');
    self.removeLayer('viagensEmTransitoAppRastreador');
    
    self.removeLayer('viagensEmCargaRastreadorCluster');
    self.removeLayer('viagensEmCargaAppCluster');
    self.removeLayer('viagensEmCargaAppRastreadorCluster');
    self.removeLayer('viagensEmDescargaRastreadorCluster');
    self.removeLayer('viagensEmDescargaAppCluster');
    self.removeLayer('viagensEmDescargaAppRastreadorCluster');
    self.removeLayer('viagensEmTransitoRastreadorCluster');
    self.removeLayer('viagensEmTransitoAppCluster');
    self.removeLayer('viagensEmTransitoAppRastreadorCluster');
    
    $.ajax({
        method: 'GET',
        url: yardUrl
    }).done(function (resp) {
    	
    	
    	
    	console.log(resp);
    	
        if (resp.length < 1) {
            $('.searchContainer').addClass('erro');
            return;
        }
        else {
            $('.searchContainer').removeClass('erro');

        }

        resp.forEach(function (viagem) {
        	
        	var listViagensOrigem = [];
        	var listVeiculosOrigem = [];
        	var utilizaSateliteOrigem = [];
        	var sinalSateliteOrigem = [];
        	var utilizaAppInfologOrigem = [];
        	var sinalAppInfologOrigem = [];
        	var dedicadoOrigem = [];
        	var corGrupoVeiculoOrigem = [];
        	
    		resp.forEach(function (viagemList) {
    			if(!viagem.possuiPosicao){
	    			if(viagemList.desSitua == "EM CARGA" && !viagemList.possuiPosicao 
	    					&& (viagemList.nomRemet == viagem.nomRemet)){
	    				listViagensOrigem.push(viagemList.ctlPlvia);
	    				listVeiculosOrigem.push(viagemList.numPlacaVei);
        				utilizaSateliteOrigem.push(viagemList.utilizaSatelite);
        				sinalSateliteOrigem.push(viagemList.sinalSatelite);
        				utilizaAppInfologOrigem.push(viagemList.utilizaAppInfolog);
        				sinalAppInfologOrigem.push(viagemList.sinalAppInfolog);
        				dedicadoOrigem.push(viagemList.dedicado);
        				if(viagemList.dedicado){
        					corGrupoVeiculoOrigem.push(viagemList.entidadeVinculada.corGrupoVeiculo);
        				}else{
        					corGrupoVeiculoOrigem.push(null);
        				}
	                }
    			}
    			
    		});
    		
    		viagem.viagensOrigem = listViagensOrigem;
    		viagem.veiculosOrigem = listVeiculosOrigem;
    		viagem.utilizaSateliteOrigem = utilizaSateliteOrigem;
    		viagem.sinalSateliteOrigem = sinalSateliteOrigem;
    		viagem.utilizaAppInfologOrigem = utilizaAppInfologOrigem;
    		viagem.sinalAppInfologOrigem = sinalAppInfologOrigem;
    		viagem.dedicadoOrigem = dedicadoOrigem;
    		viagem.corGrupoVeiculoOrigem = corGrupoVeiculoOrigem;
    		
        	if(viagem.utilizaSatelite && !viagem.utilizaAppInfolog){
        		if(viagem.desSitua == 'EM CARGA'){
	        		console.log(viagem);
	            	//adiciona uma nova viagem no mapa
	                self.addNewViagemEmCargaRastreador(viagem.ctlPlvia, viagem, {
	                    'nomeDaEmpresa': '',
	                    'codDocum': '',
	                    'paisUfPraca': ''
	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
	                statusQTD['CARGA']++;
        		}
        		
        		if(viagem.desSitua == 'EM DESCARGA'){
	        		console.log(viagem);
	            	//adiciona uma nova viagem no mapa
	                self.addNewViagemEmDescargaRastreador(viagem.ctlPlvia, viagem, {
	                    'nomeDaEmpresa': '',
	                    'codDocum': '',
	                    'paisUfPraca': ''
	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
	                statusQTD['DESCARGA']++;
        		}
        		
        		if(viagem.desSitua == 'EM TRANSITO'){
	        		console.log(viagem);
	            	//adiciona uma nova viagem no mapa
	                self.addNewViagemEmTransitoRastreador(viagem.ctlPlvia, viagem, {
	                    'nomeDaEmpresa': '',
	                    'codDocum': '',
	                    'paisUfPraca': ''
	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
	                statusQTD['TRANSITO']++;
        		}
        	}  
        	
        	if(!viagem.utilizaSatelite && viagem.utilizaAppInfolog){
        		if(viagem.desSitua == 'EM CARGA'){
	        		console.log(viagem);
	            	//adiciona uma nova viagem no mapa
	                self.addNewViagemEmCargaApp(viagem.ctlPlvia, viagem, {
	                    'nomeDaEmpresa': '',
	                    'codDocum': '',
	                    'paisUfPraca': ''
	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
	                statusQTD['CARGA']++;
        		}
        		
        		if(viagem.desSitua == 'EM DESCARGA'){
	        		console.log(viagem);
	            	//adiciona uma nova viagem no mapa
	                self.addNewViagemEmDescargaApp(viagem.ctlPlvia, viagem, {
	                    'nomeDaEmpresa': '',
	                    'codDocum': '',
	                    'paisUfPraca': ''
	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
	                statusQTD['DESCARGA']++;
        		}
        		
        		if(viagem.desSitua == 'EM TRANSITO'){
	        		console.log(viagem);
	            	//adiciona uma nova viagem no mapa
	                self.addNewViagemEmTransitoApp(viagem.ctlPlvia, viagem, {
	                    'nomeDaEmpresa': '',
	                    'codDocum': '',
	                    'paisUfPraca': ''
	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
	                statusQTD['TRANSITO']++;
        		}
        	}  
        	
        	if(viagem.utilizaSatelite && viagem.utilizaAppInfolog){
        		if(viagem.desSitua == 'EM CARGA'){
	        		console.log(viagem);
	            	//adiciona uma nova viagem no mapa
	                self.addNewViagemEmCargaAppRastreador(viagem.ctlPlvia, viagem, {
	                    'nomeDaEmpresa': '',
	                    'codDocum': '',
	                    'paisUfPraca': ''
	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
	                statusQTD['CARGA']++;
        		}
        		
        		if(viagem.desSitua == 'EM DESCARGA'){
	        		console.log(viagem);
	            	//adiciona uma nova viagem no mapa
	                self.addNewViagemEmDescargaAppRastreador(viagem.ctlPlvia, viagem, {
	                    'nomeDaEmpresa': '',
	                    'codDocum': '',
	                    'paisUfPraca': ''
	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
	                statusQTD['DESCARGA']++;
        		}
        		
        		if(viagem.desSitua == 'EM TRANSITO'){
	        		console.log(viagem);
	            	//adiciona uma nova viagem no mapa
	                self.addNewViagemEmTransitoAppRastreador(viagem.ctlPlvia, viagem, {
	                    'nomeDaEmpresa': '',
	                    'codDocum': '',
	                    'paisUfPraca': ''
	                }, [viagem.ultimaPosicao.lon, viagem.ultimaPosicao.lat]);
	                statusQTD['TRANSITO']++;
        		}
        	}
        });

        for (item in statusQTD) {
            var element = document.getElementById(item);
            if (typeof element !== undefined && element !== null) {
                element.innerHTML = statusQTD[item];
            }
        }

        $('.resumo').addClass('ativo');

        var viagensEmCargaRastreador = new ol.layer.Vector({
            source: self.viagensEmCargaRastreadorSource,
            id: 'viagensEmCargaRastreador'
        });
        
        var viagensEmCargaApp = new ol.layer.Vector({
            source: self.viagensEmCargaAppSource,
            id: 'viagensEmCargaApp'
        });
        
        var viagensEmCargaAppRastreador = new ol.layer.Vector({
            source: self.viagensEmCargaAppRastreadorSource,
            id: 'viagensEmCargaAppRastreador'
        });
        
        var viagensEmDescargaRastreador = new ol.layer.Vector({
            source: self.viagensEmDescargaRastreadorSource,
            id: 'viagensEmDescargaRastreador'
        });
        
        var viagensEmDescargaApp = new ol.layer.Vector({
            source: self.viagensEmDescargaAppSource,
            id: 'viagensEmDescargaApp'
        });
        
        var viagensEmDescargaAppRastreador = new ol.layer.Vector({
            source: self.viagensEmDescargaAppRastreadorSource,
            id: 'viagensEmDescargaAppRastreador'
        });
        
        var viagensEmTransitoRastreador = new ol.layer.Vector({
            source: self.viagensEmTransitoRastreadorSource,
            id: 'viagensEmTransitoRastreador'
        });
        
        var viagensEmTransitoApp = new ol.layer.Vector({
            source: self.viagensEmTransitoAppSource,
            id: 'viagensEmTransitoApp'
        });
        
        var viagensEmTransitoAppRastreador = new ol.layer.Vector({
            source: self.viagensEmTransitoAppRastreadorSource,
            id: 'viagensEmTransitoAppRastreador'
        });
        
        var botao = document.getElementById('botao');
       	self.timer(timeToUpdate, timerTarget, yardUrl, tableId, botao.innerHTML);
        self.fecharAguarde();
    }).catch(function (err) {
        alert(err)
    });
}

/**
 * Cria os clusters (círculos que agrupam a quantidade de pontos dentro de uma determindada distancia)
 */
radarViagensFactory.prototype.setClusters = function (source, idCluster) {
    var self = this;

    var clusterSource = new ol.source.Cluster({
        distance: parseInt(self.map.getView().getZoom() * 8),
        source: source
    });

    var styleCache = {};
    
    var clusters = new ol.layer.Vector({
        source: clusterSource,
    
        style: function (feature) {
            validFeatures = [];
        
            feature.get('features').map(function (key, val) {
                validFeatures.push(key);  
            });
            
            var size = validFeatures.length;
            var style = styleCache[size];
            var zoomRadius = self.map.getView().getZoom() * (size * 2);
            var features = clusterSource.getFeatures();

            if (!style && size > 1) {
                style = new ol.style.Style({
                    text: new ol.style.Text({
                        text: size.toString(),
                        font: '20px Arial',
                        fill: new ol.style.Fill({
                            color: 'black'
                        })
                    }),
                   image: new ol.style.Circle({
                	   	radius: 16,
                        fill: new ol.style.Fill({
                        	color: 'rgba(230,120,30,0.7)'
                        })
                    })
                });
                styleCache[size] = style;
            }

            return style;
        },
        id: idCluster
    });

    this.map.addLayer(clusters);
}

/**
 * Muda a coordenada de determinada FEATURE no mapa
 * @param {string} id - ID do LAYER que se encontra a feature
 * @param {array} coordenada - Coordenadas em LONLAT
 * @param {string} layerId - ID da FEATURE a ser atualizada
 */

radarViagensFactory.prototype.updateVehiclePosition = function (vehicle) {
    var self = this;
    var layers = this.map.getLayers();
    var isOTM = (vehicle.protocoloOtm) ? '_OTM' : '';

    layers.forEach(function (layer, i, layerId) {
        if (layer.get('id') == 'veiculos') {
            var feature = layer.getSource().getFeatureById(vehicle.ctlPlvia);
            if (feature !== null) {
                feature.set('informations', vehicle);
                var style = new ol.style.Style({
                    image: new ol.style.Icon(({
                        anchor: [
                            0.5, 46
                        ],
                        opacity: (vehicle.staViagem === 'SEM_SINAL') ? 0 : 1,
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        src: self.ICONES[vehicle.staViagem + isOTM]
                    })),
                    text: new ol.style.Text({
                        text: (vehicle.staViagem === 'SEM_SINAL') ? '' : vehicle.placaVei,
                        font: 'Bold 12px Arial',
                        fill: new ol.style.Fill({
                            color: '#000'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#fff',
                            width: 3
                        })
                    })
                });
                self.removeLayer('distance');
                feature.setStyle(style);
                feature.getGeometry().setCoordinates(ol.proj.transform([vehicle.numLongi, vehicle.numLatit], 'EPSG:4326', 'EPSG:3857'));
            }
        }
    });
}

/**
 * Detecta se o alvo está dentro de determinada coordenada
 * @param {string} intersectionCoordinate - coordenada que será verificada
 * @param {string} Id do veículo caso seja necessário exibir mais informações
 */

radarViagensFactory.prototype.detectIntersection = function (intersectionCoordinate, vehicle) {
    var self = this;

    self.status = {
        status: false,
        msg: 'Carga em andamento'
    }

    var layers = this.map.getLayers();


    layers.forEach(function (layer) {
        if (layer.get('id') == 'alvo') {
            var features = layer.getSource().getFeatures();
            if (features !== null) {
                features.map(function (feature) {
                    var id = feature.getId();
                    //remove o prefixo e deixa apenas o nome puro para ser exibido ex: nome_radius1 = radius1
                    id = id.split('_')[1];

                    var intersect = feature.getGeometry().intersectsCoordinate(ol.proj.transform(intersectionCoordinate, 'EPSG:4326', 'EPSG:3857'));
                    if (intersect) {
                        self.status = {
                            status: true,
                            msg: 'O veículo com a placa <b>' + vehicle.placaVei + '</b> chegou na <b>' + self.AREAS[id] + '</b>',
                            currentTarget: id,
                            color: self.RADIUSCOLORS[id].getFill().getColor().slice(0, -3) + '1)',
                            vehicle: vehicle,
                            area: self.AREAS[id]
                        }
                    }
                });
            }
        }
    });

    if (self.status.status === true && self.status.vehicle.staViagem != 'SEM_SINAL') {
        var storeStatus = JSON.parse(localStorage.getItem('messages'));
        var tableLine = $('tr.' + self.status.vehicle.ctlPlvia);
        var oldTarget = tableLine.attr('oldTarget');
        var oldCoordinates = tableLine.attr('old-coordinates');
        var area = tableLine.attr('area');
        var oldValue = tableLine.attr('oldTarget');
        var hidetimer = 5000;

        var incomingAlert = function (status) {
            tableLine.attr('old-coordinates', vehicle.numLatit + ', ' + vehicle.numLongi);
            tableLine.attr('area', self.status.area);
            tableLine.attr('oldTarget', self.status.currentTarget);
            tableLine.attr('target', self.status.currentTarget);
            tableLine.find('.avisos').removeClass().addClass('avisos ' + self.status.currentTarget);

            //self.audio.play();
            var alertaCaminhao = $.toast({
                showHideTransition: 'slide',
                hideAfter: 5000,
                text: status.msg,
                textColor: '#000',
                bgColor: status.color,
                stack: 10
            });
            setTimeout(function () {
                $.toast().reset('all');
            }, 5000)
        };

        if (oldValue.length < 1) {
            incomingAlert(self.status);
        }
        else {
            var oldCord = tableLine.attr('old-coordinates');
            var oldArea = tableLine.attr('area');

            if (oldCord !== vehicle.numLatit + ', ' + vehicle.numLongi && self.status.area !== oldArea) {
                incomingAlert(self.status);
            }
        }

        storeStatus.push(self.status);
        localStorage.setItem('messages', JSON.stringify(storeStatus));
    }
}

/**
 * Remove o layer pelo id
 * @param {string} - layerId, lembre-se de sempre adicionar um ID na hora de adicionar um layer
 */

radarViagensFactory.prototype.removeLayer = function (layerId) {
    var self = this;
    var map = self.map;
    var layers = map.getLayers();
    layers.forEach(function (layer, i) {
    	if (layer.get('id') == layerId) {
            map.removeLayer(layer);
        }
    });

    layers.forEach(function (layer, i) {
    	if (layer.get('id') == layerId) {
            map.removeLayer(layer);
        }
    });
    
    
}

/**
 * Remove um ponto especifico do mapa
 * @param {string} layerId - ID do layer no qual o ponto se encontra
 * @param {string} id - ID do ponto a ser removido
 */

radarViagensFactory.prototype.removePoint = function (layerId, pointId) {
    var self = this;
    var map = self.map;
    var layers = map.getLayers();
    layers.forEach(function (layer, i) {
        if (layer.get('id') == layerId) {
            var source = layer.getSource();
            var feature = layer.getSource().getFeatureById(pointId);
            source.removeFeature(feature);
        }
    });
}

/**
 * Da zoom em uma determinada área
 * @param {string} coordinates - coordenada a ser centralizado
 * @param {string} zoom - distancia do zoom
 */

radarViagensFactory.prototype.zoomTo = function (coordinates, zoom) {
    var self = this;
    var map = self.map;
    map.getView().setCenter(ol.proj.transform(coordinates, 'EPSG:4326', 'EPSG:3857'));
    map.getView().setZoom(zoom);
}

/**
 * Calcula a distancia entre dois pontos e exibe uma reta entre os dois com um label determinando a distancia
 * @param {any} matriz - coordenada da matriz/entidade
 * @param {any} alvo - coordenada do alvo/veículo
 */

radarViagensFactory.prototype.calculateDistanceBetween = function (matriz, alvo) {
    var self = this;

    this.formatDistance = function (line) {
        length = (line * 100) / 100;
        if (length >= 1000) {
            length = (Math.round(length / 1000 * 100) / 100) +
                ' ' + 'km';
        }
        else {
            length = Math.round(length) +
                ' ' + 'm';
        }
        return length;
    }

    self.distanceSource = new ol.source.Vector({
        features: []
    });

    this.distanceBetween = new ol.Feature({
        geometry: new ol.geom.GeometryCollection([
            new ol.geom.Point(alvo),
            new ol.geom.LineString([
                alvo,
                ol.proj.transform(self.matriz, 'EPSG:4326', 'EPSG:3857')
            ])
        ])
    });

    var geometries = this.distanceBetween.getGeometry();

    var styleFunction = function (feature, resolution) {
        var geometries = feature.getGeometry().getGeometries();
        var point = geometries[0];
        var line = geometries[1];

        var iconStyle = new ol.style.Style({
            geometry: point,
            text: new ol.style.Text({
                text: 'Distancia' + 2000 + 'km',
                font: 'Bold 12px Arial',
                fill: new ol.style.Fill({
                    color: 'black'
                }),
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 1
                }),
                offsetX: 0,
                offsetY: -58
            })
        });

        var lineStyle = new ol.style.Style({
            geometry: line,
            stroke: new ol.style.Stroke( /** @type {olx.style.IconOptions} */({
                color: 'black',
                width: 1
            }))
        });

        iconStyle.getText().setText(self.formatDistance(lineStyle.getGeometry().getLength().toString()));

        return [iconStyle, lineStyle];
    };

    this.distanceSource.addFeature(this.distanceBetween);

    var distance = new ol.layer.Vector({
        source: self.distanceSource,
        id: 'distance',
        style: styleFunction
    });

    self.map.addLayer(distance);
}

radarViagensFactory.prototype.updateTableOtm = function (vehicle, otmUrl, ref, self) {
	var layers = this.map.getLayers();
	
    if (!$('#protocolo_' + vehicle.ctlPlvia).hasClass('processado')) {
        $(ref).addClass('processado');
        $.ajax({
            url: otmUrl,
            method: 'GET',
            data: {
                "ctlPlvia": vehicle.ctlPlvia,
                "autoSaida": vehicle.autorizacaoSaida
            }
        }).done(function (resp) {
        	if(resp.protocoloOtm > 0){
	            $('#otm_' + vehicle.ctlPlvia).text(resp.protocoloOtm);
	            $(ref).addClass('processado');
	            $(ref).unbind('click').css({
	                opacity: 0.5,
	                cursor: 'default'
	            });
	
	            layers.forEach(function (layer, i, layerId) {
	                if (layer.get('id') == 'veiculos') {
	                    var feature = layer.getSource().getFeatureById(vehicle.ctlPlvia);
	                    if (feature !== null) {
	                        var style = new ol.style.Style({
	                            image: new ol.style.Icon(({
	                                anchor: [
	                                    0.5, 46
	                                ],
	                                opacity: (vehicle.staViagem === 'SEM_SINAL') ? 0 : 1,
	                                anchorXUnits: 'fraction',
	                                anchorYUnits: 'pixels',
	                                src: self.ICONES[vehicle.staViagem + '_OTM']
	                            })),
	                            text: new ol.style.Text({
	                                text: (vehicle.staViagem === 'SEM_SINAL') ? '' : vehicle.placaVei,
	                                font: 'Bold 12px Arial',
	                                fill: new ol.style.Fill({
	                                    color: '#000'
	                                }),
	                                stroke: new ol.style.Stroke({
	                                    color: '#fff',
	                                    width: 3
	                                })
	                            })
	                        });
	                        self.removeLayer('distance');
	                        feature.setStyle(style);
	                    }
	                }
	            });
        	} else {
        		$('#protocolo_' + vehicle.ctlPlvia).removeClass('processado');
                var alerta = $.toast({
                    showHideTransition: 'slide',
                    hideAfter: 5000,
                    text: '<b>Ocorreu um erro ao tentar processar o seguinte plano:' + vehicle.ctlPlvia + '</b>',
                    textColor: '#fff',
                    bgColor: 'red',
                    stack: 5,
                    position: 'bottom-right'
                });
        	}
        }).catch(function (error) {
            $('#protocolo_' + vehicle.ctlPlvia).removeClass('processado');
            var alerta = $.toast({
                showHideTransition: 'slide',
                hideAfter: 5000,
                text: '<b>Ocorreu um erro ao tentar processar o seguinte plano:' + vehicle.ctlPlvia + '</b>',
                textColor: '#fff',
                bgColor: 'red',
                stack: 5,
                position: 'bottom-right'
            });
        });
    }
}

radarViagensFactory.prototype.updateTable = function (tableId, veiculo, otmUrl) {
    var self = this;
    var tableLine = $('tr.' + veiculo.ctlPlvia);
    tableLine.find('.otm').text(veiculo.protocoloOtm);
    if (veiculo.protocoloOtm.length > 0) {
        $('#protocolo_' + veiculo.ctlPlvia).unbind('click').css({
            opacity: 0.5,
            cursor: 'default'
        });
    } else {
        $('#protocolo_' + veiculo.ctlPlvia).unbind('click').click(function (e) {
            if (veiculo.autorizacaoSaida == null) {
                var alerta = $.toast({
                    showHideTransition: 'slide',
                    hideAfter: 2000,
                    text: "Viagem sem Shipment atrelado",
                    textColor: '#fff',
                    bgColor: 'red',
                    stack: 5,
                    position: 'bottom-right'
                });
            } else {
                self.updateTableOtm(veiculo, otmUrl, this, self);
            }
        });
    }
}

/**
 * Cria um relógio na tela e ao zerar recarrega o mapa
 * @param {string} minutos - Tempo do cronometro em minutos, min de 1 minuto
 * @param {string} target - element HTML onde o relógio vai ser renderizado
 */

radarViagensFactory.prototype.timer = function (minutos, target, url, tableId, icon) {
    var self = this;
    
    var timerElement = document.getElementById(target);
    var defaultMinutes = minutos;
    var segundos = 00;
    var timeout = {};

    var id = window.setTimeout(function () { }, 0);

    while (id--) {
        window.clearTimeout(id); // will do nothing if no timeout with id is present
    }

    timerElement.innerHTML = minutos + ':00';
    var timer = function () {
    	
    	if(icon == 'on'){
	        segundos--;
	
	        if (segundos < 0) {
	            segundos = 59;
	            minutos--;
	
	            if (minutos < 0) {
	                minutos = defaultMinutes;
	                segundos = 0;
	                timerElement.innerHTML = minutos + ':00';
	
	                $.ajax({
	                    method: 'GET',
	                    url: url,
	                    data: {
	                        entidadeId: self.entityId
	                    }
	                }).done(function (resp) {
	                    if (typeof resp === 'undefined' || resp.length < 1) {
	                        $('.searchContainer').addClass('erro');
	                        return;
	                    }
	                    
	                    contCarregamento = 0;
	                    
	                    self.removeLayer('viagensEmCargaRastreador');
	            		self.removeLayer('viagensEmCargaApp');
	            		self.removeLayer('viagensEmCargaAppRastreador');
	            		self.removeLayer('viagensEmDescargaRastreador');
	            		self.removeLayer('viagensEmDescargaApp');
	            		self.removeLayer('viagensEmDescargaAppRastreador');
	            		self.removeLayer('viagensEmTransitoRastreador');
	            		self.removeLayer('viagensEmTransitoApp');
	            		self.removeLayer('viagensEmTransitoAppRastreador');
	            		self.removeLayer('veiculoVazioRastreador');
	            		self.removeLayer('veiculoVazioApp');
	            		self.removeLayer('veiculoVazioAppRastreador');
	            		self.removeLayer('entidadeVinculada');
	            		
	            		self.removeLayer('viagensEmCargaRastreadorCluster');
	            		self.removeLayer('viagensEmCargaAppCluster');
	            		self.removeLayer('viagensEmCargaAppRastreadorCluster');
	            		self.removeLayer('viagensEmDescargaRastreadorCluster');
	            		self.removeLayer('viagensEmDescargaAppCluster');
	            		self.removeLayer('viagensEmDescargaAppRastreadorCluster');
	            		self.removeLayer('viagensEmTransitoRastreadorCluster');
	            		self.removeLayer('viagensEmTransitoAppCluster');
	            		self.removeLayer('viagensEmTransitoAppRastreadorCluster');
	            		self.removeLayer('viagensEmCargaRastreadorDedicadoCluster');
	            		self.removeLayer('viagensEmCargaAppDedicadoCluster');
	            		self.removeLayer('viagensEmCargaAppRastreadorDedicadoCluster');
	            		self.removeLayer('viagensEmDescargaRastreadorDedicadoCluster');
	            		self.removeLayer('viagensEmDescargaAppDedicadoCluster');
	            		self.removeLayer('viagensEmDescargaAppRastreadorDedicadoCluster');
	            		self.removeLayer('viagensEmTransitoRastreadorDedicadoCluster');
	            		self.removeLayer('viagensEmTransitoAppDedicadoCluster');
	            		self.removeLayer('viagensEmTransitoAppRastreadorDedicadoCluster');
	            		self.removeLayer('veiculoVazioRastreadorCluster');
	            		self.removeLayer('veiculoVazioAppCluster');
	            		self.removeLayer('veiculoVazioAppRastreadorCluster');
	            		self.removeLayer('entidadeVinculadaCluster');
	            		
	            		
	                    if($('#exibirPlanosAtivos').is(':checked')){
	                    	//origensNamesList = [];
		            		
		                    self.toggleRastreador($('#exibirEmCarga').is(':checked'));
		                    self.toggleRastreador($('#exibirEmDescarga').is(':checked'));
		                    self.toggleRastreador($('#exibirEmTransito').is(':checked'));
		            		
		            		$("#exibirFrotaDedicada").prop('checked', false);
		            		$("#exibirEmUso").prop('checked', false);
		            		$("#exibirVazio").prop('checked', false);
		            		
		            		if(namesList == ""){
			            		if($('#exibirEmCarga').is(':checked')){
			            			self.buscarViagensEmCarga('#tabelaRadarViagens', '', './buscarViagensEmCarga', '/app/assets/data/otm.json', time, 'updateTime');
			            		}else{
			            			contCarregamento++;
			            		}
			            		
			            		if($('#exibirEmDescarga').is(':checked')){
			            			self.buscarViagensEmDescarga('#tabelaRadarViagens', '', './buscarViagensEmDescarga', '/app/assets/data/otm.json', time, 'updateTime');
			            		}else{
			            			contCarregamento++;
			            		}
			            		
			            		if($('#exibirEmTransito').is(':checked')){
			            			self.buscarViagensEmTransito('#tabelaRadarViagens', '', './buscarViagensEmTransito', '/app/assets/data/otm.json', time, 'updateTime');
			            		}else{
			            			contCarregamento++;
			            		}

		            		}else{
		            			
		            			self.selecionaVeiculoViagens(tableId, namesList, './buscarViagensFiltroOrigem', '/app/assets/data/otm.json', time, 'updateTime');
		            			contCarregamento = 3;
		            		}
	                	}
	                
	                	if($('#exibirFrotaDedicada').is(':checked')){
	                    
	                		$("#exibirPlanosAtivos").prop('checked', false);
		            		
		            		$("#exibirEmCarga").prop('checked', false);
		            		$("#exibirEmDescarga").prop('checked', false);
		            		$("#exibirEmTransito").prop('checked', false);
		            		
		            		//origensNamesList = [];
		            		
		            		self.toggleRastreador($('#exibirEmUso').is(':checked'));
		                    self.toggleRastreador($('#exibirVazio').is(':checked'));
		                    
		                    if(namesList == ""){
		                    	if($('#exibirEmUso').is(':checked')){
			                       	self.buscarVeiculosEmUso('#tabelaRadarViagens', '', './buscarViagens', '/app/assets/data/otm.json', time, 'updateTime');
			                    }else{
			                    	contCarregamento++;
			                    }
			                    
			                    if($('#exibirVazio').is(':checked')){
			                    	self.buscarVeiculosVazios('#tabelaRadarViagens', true, './buscarVeiculosVazios', '/app/assets/data/otm.json', time, 'updateTime');
			                    }else{
			                    	contCarregamento = contCarregamento + 2;
			                    }
		                    }else{
		            			
		                    	self.buscarVeiculosEmUsoVinculado(tableId, namesList, './buscarVeiculosEmUsoEntidadeVinculada', '/app/assets/data/otm.json', time, 'updateTime');
		                    	self.buscarVeiculosVaziosVinculado(tableId, namesList, './buscarVeiculosVaziosEntidadeVinculada', '/app/assets/data/otm.json', time, 'updateTime');
		                    	contCarregamento = 3;
		            		}	
		                    
		              	}
	                	self.toggleRastreador($('#exibirRastreador').is(':checked'));
	                    self.toggleApp($('#exibirApp').is(':checked'));
	                    self.toggleAppRastreador($('#exibirAppRastreador').is(':checked'));	            		
	                    
	                    self.fecharAguarde();
	
	                });
	            }
	        }
	
	        segundos = (segundos < 10) ? '0' + segundos : segundos;
	        timerElement.innerHTML = minutos + ':' + segundos;
	
	        timeout = setTimeout(function () {
	            timer();
	        }, 1000);
    	}else{
    		timerElement.innerHTML = '0:00';
    	}
    	
    };

    timer();
    
}

/**
 * Realiza a animação de girar o ponteiro no radar
 * @param {any} coordenadas - coordenadas que se referem ao eixo da animação
 */

radarViagensFactory.prototype.rotatePointer = function (coordenadas) {
    var self = this;
    var layers = this.map.getLayers();
    var line = 0;
    var source = 0;
    var deg = 0;
    var secondsToUpdate = 0;

    Math.radians = function (degrees) {
        return degrees * Math.PI / 180;
    };

    layers.forEach(function (layer) {
        if (layer.get('id') == 'ponteiro') {
            source = layer.getSource();
            line = source.getFeatureById('radarPointer');
            return;
        }
    });

    var rotateLine = function (line) {
        var radians = Math.radians(deg).toFixed(4);
        var findBorder = (self.raio4 * 1000) / 122222;
        var lineGeometry = line.getGeometry();

        lineGeometry.setCoordinates([
            ol.proj.transform(coordenadas, 'EPSG:4326', 'EPSG:3857'),
            ol.proj.transform([coordenadas[0], coordenadas[1] + findBorder], 'EPSG:4326', 'EPSG:3857')
        ]);

        lineGeometry.rotate('-' + radians, ol.proj.transform(coordenadas, 'EPSG:4326', 'EPSG:3857'));

        deg += 1;
        secondsToUpdate += 1;

        setTimeout(function () {
            if (secondsToUpdate >= 360) {
                deg = 0;
                secondsToUpdate = 0;
            }
            rotateLine(line);
        }, 20)
    };

    rotateLine(line);
}

radarViagensFactory.prototype.selectAllOrigins = function () {
	var self = this;
	$("#entidadesList").empty();
	origensNamesList = [];
	namesList = "";
	
	self.returnAllOrigins('./buscarOrigens', '/app/assets/data/otm.json', time, 'updateTime');
	
	self.buildYard('#tabelaRadarViagens', '', './buscarViagens', '/app/assets/data/otm.json', time, 'updateTime');
	contCarregamento = 3;
	
	self.toggleRastreador($('#exibirRastreador').is(':checked'));
    self.toggleApp($('#exibirApp').is(':checked'));
    self.toggleAppRastreador($('#exibirAppRastreador').is(':checked'));
}

radarViagensFactory.prototype.removeAllOrigins = function () {
	var self = this;
	$("#entidadesList").empty();
	origensNamesList = [];
	namesList = "";
	
	self.buildYard('#tabelaRadarViagens', '', './buscarViagens', '/app/assets/data/otm.json', time, 'updateTime');
	contCarregamento = 3;
	
	self.toggleRastreador($('#exibirRastreador').is(':checked'));
    self.toggleApp($('#exibirApp').is(':checked'));
    self.toggleAppRastreador($('#exibirAppRastreador').is(':checked'));
}

radarViagensFactory.prototype.removeOrigin = function (originToRemove) {
	var self = this;
	namesList = "";
	
	$.each(origensNamesList, function(e,i){
    	if(!originToRemove.includes(i)){
        	if(namesList == ""){
        		namesList = i
        	}else{
        		namesList = namesList + "," + i;
        	}
    	}
    });
    
	origensNamesList = [];
	origensNamesList = namesList.split(",");
	
	$("#entidadesList").empty();
    $.each(origensNamesList, function(e,i){
    	$("#entidadesList").append("<option value='" + i + "' title='Dê um duplo clique para retirar a Entidade da lista, ou selecione-a e clique no botão Delete do teclado'>" + i + "</option>");
    });
    
    $('#destinySearch').val("");

    if(namesList == ""){
    	self.removeAllOrigins();
    }else{
		self.selecionaVeiculoViagens('#tabelaRadarViagens', namesList, './buscarViagensFiltroOrigem', '/app/assets/data/otm.json', time, 'updateTime');
		contCarregamento = 3;
	}
	
	
	self.toggleRastreador($('#exibirRastreador').is(':checked'));
    self.toggleApp($('#exibirApp').is(':checked'));
    self.toggleAppRastreador($('#exibirAppRastreador').is(':checked'));
}

radarViagensFactory.prototype.returnAllOrigins = function (yardUrl, otmUrl, timeToUpdate, timerTarget) {
    var self = this;
    
    $.ajax({
        method: 'GET',
        url: yardUrl
    }).done(function (resp) {
    	
    	console.log(resp);
    	
        if (resp.length < 1) {
            $('.searchContainer').addClass('erro');
            return;
        }
        else {
            $('.searchContainer').removeClass('erro');
        }
        
        resp.forEach(function (entidade) {
        	origensNamesList.push(entidade.nome);
        	$("#entidadesList").append("<option value='" + entidade.nome + "' title='Dê um duplo clique para retirar a Entidade da lista, ou selecione-a e clique no botão Delete do teclado'>" + entidade.nome + "</option>");
            
            if(namesList == ""){
        		namesList = entidade.nome
        	}else{
        		namesList = namesList + "," + entidade.nome;
        	}
        });
    });
}

radarViagensFactory.prototype.selectAllVinculado = function () {
	var self = this;
	$("#vinculadoList").empty();
	origensNamesList = [];
	namesList = "";
	
	self.returnAllVinculado('./buscarEntidades', '/app/assets/data/otm.json', time, 'updateTime');
	
	self.buscarVeiculosEmUso('#tabelaRadarViagens', '', './buscarViagens', '/app/assets/data/otm.json', time, 'updateTime');
	self.buscarVeiculosVazios('#tabelaRadarViagens', true, './buscarVeiculosVazios', '/app/assets/data/otm.json', time, 'updateTime');
	
	self.toggleVeiculosEmUso($('#exibirEmUso').is(':checked'));
	self.toggleVeiculoVazio($('#exibirVazio').is(':checked'));
		
	self.toggleRastreador($('#exibirRastreador').is(':checked'));
    self.toggleApp($('#exibirApp').is(':checked'));
    self.toggleAppRastreador($('#exibirAppRastreador').is(':checked'));
}

radarViagensFactory.prototype.removeAllVinculado = function () {
	var self = this;
	$("#vinculadoList").empty();
	origensNamesList = [];
	namesList = "";
	
	self.buscarVeiculosEmUso('#tabelaRadarViagens', '', './buscarViagens', '/app/assets/data/otm.json', time, 'updateTime');
	self.buscarVeiculosVazios('#tabelaRadarViagens', true, './buscarVeiculosVazios', '/app/assets/data/otm.json', time, 'updateTime');
	
	
	self.removeLayer('entidadeVinculada');
	self.removeLayer('entidadeVinculadaCluster');
	
	self.toggleVeiculosEmUso($('#exibirEmUso').is(':checked'));
	self.toggleVeiculoVazio($('#exibirVazio').is(':checked'));
		
	self.toggleRastreador($('#exibirRastreador').is(':checked'));
    self.toggleApp($('#exibirApp').is(':checked'));
    self.toggleAppRastreador($('#exibirAppRastreador').is(':checked'));
}

radarViagensFactory.prototype.removeVinculado = function (vinculadoToRemove) {
	var self = this;
	namesList = "";
	
	$.each(origensNamesList, function(e,i){
    	if(!vinculadoToRemove.includes(i)){
        	if(namesList == ""){
        		namesList = i
        	}else{
        		namesList = namesList + "," + i;
        	}
    	}
    });
    
	origensNamesList = [];
	origensNamesList = namesList.split(",");
	
	$("#vinculadoList").empty();
    $.each(origensNamesList, function(e,i){
    	$("#vinculadoList").append("<option value='" + i + "' title='Dê um duplo clique para retirar a Entidade da lista, ou selecione-a e clique no botão Delete do teclado'>" + i + "</option>");
    });
    
    $('#vinculadoList').val("");

    if(namesList == ""){
    	self.removeAllVinculado();
    }else{
    	self.buscarVeiculosEmUsoVinculado('#tabelaRadarViagens', namesList, './buscarVeiculosEmUsoEntidadeVinculada', '/app/assets/data/otm.json', time, 'updateTime');
    	self.buscarVeiculosVaziosVinculado('#tabelaRadarViagens', namesList, './buscarVeiculosVaziosEntidadeVinculada', '/app/assets/data/otm.json', time, 'updateTime');
    	contCarregamento = 3;
	}
	
	
	self.toggleRastreador($('#exibirRastreador').is(':checked'));
    self.toggleApp($('#exibirApp').is(':checked'));
    self.toggleAppRastreador($('#exibirAppRastreador').is(':checked'));
}

radarViagensFactory.prototype.returnAllVinculado = function (yardUrl, otmUrl, timeToUpdate, timerTarget) {
    var self = this;
        
    $.ajax({
        method: 'GET',
        url: yardUrl
    }).done(function (resp) {
    	
    	console.log(resp);
    	
        if (resp.length < 1) {
            $('.searchContainer').addClass('erro');
            return;
        }
        else {
            $('.searchContainer').removeClass('erro');
        }
        
        resp.forEach(function (entidade) {
        	origensNamesList.push(entidade.nome);
        	$("#vinculadoList").append("<option value='" + entidade.nome + "' title='Dê um duplo clique para retirar a Entidade da lista, ou selecione-a e clique no botão Delete do teclado'>" + entidade.nome + "</option>");
                       
            if(namesList == ""){
        		namesList = entidade.nome
        	}else{
        		namesList = namesList + "," + entidade.nome;
        	}
        });
                
    });
}

radarViagensFactory.prototype.toggleIcon = function () {
	var self = this;
	
	var botao = document.getElementById('botao');
	self.timer(time, 'updateTime', './buscarViagens', '#tabelaRadarViagens', botao.innerHTML);
}

radarViagensFactory.prototype.exibirLayer = function (idLayer) {
    self = this;
    
    var layers = self.map.getLayers();

    //para cada layer, caso tenha a id veiculos, esconda o layer caso o zoom seja menor do que 4
	 layers.forEach(function (layer) {
	     if (layer.get('id') == idLayer) {
	          
	          var currentZoom = self.map.getView().getZoom();
	          
	         if (currentZoom < 4) {
	             layer.setVisible(false);
	             $('.popover').hide();
	         } else {
	             layer.setVisible(true);
	             $('.radiusLabel').fadeIn();
	             $('.popover').show();
	         }
	     } 
	 });
}

radarViagensFactory.prototype.fecharAguarde = function () {
	self = this;
	$(self.element).popover('destroy');
	
    document.getElementById("menu_aguarde").style.display = "block";
    document.getElementById("exibirPlanosAtivos").disabled = true;
    document.getElementById("exibirEmCarga").disabled = true;
    document.getElementById("exibirEmDescarga").disabled = true;
    document.getElementById("exibirEmTransito").disabled = true;
    document.getElementById("exibirFrotaDedicada").disabled = true;
    document.getElementById("exibirEmUso").disabled = true;
    document.getElementById("exibirVazio").disabled = true;
    document.getElementById("exibirRastreador").disabled = true;
    document.getElementById("exibirApp").disabled = true;
    document.getElementById("exibirAppRastreador").disabled = true;
    document.getElementById("selecionarTudoOrigem").setAttribute('disabled', 'true');
    document.getElementById("limparTudoOrigem").setAttribute('disabled', 'true');
    document.getElementById("selecionarTudoVinculado").setAttribute('disabled', 'true');
    document.getElementById("limparTudoVinculado").setAttribute('disabled', 'true');
    document.getElementById("destinySearch").disabled = true;
    document.getElementById("entidadesList").disabled = true;
    document.getElementById("entidadeSearch").disabled = true;
    document.getElementById("vinculadoList").disabled = true;
    document.getElementById('icon').style.display='none';
    self.timer(time, 'updateTime', './buscarViagens', '#tabelaRadarViagens', 'off');
        
    timeout = setTimeout(function () {
          if(contCarregamento > 2){
                 document.getElementById("menu_aguarde").style.display = "none";
                 document.getElementById("exibirPlanosAtivos").disabled = false;
                 document.getElementById("exibirEmCarga").disabled = false;
                 document.getElementById("exibirEmDescarga").disabled = false;
                 document.getElementById("exibirEmTransito").disabled = false;
                 document.getElementById("exibirFrotaDedicada").disabled = false;
                 document.getElementById("exibirEmUso").disabled = false;
                 document.getElementById("exibirVazio").disabled = false;
                 document.getElementById("exibirRastreador").disabled = false;
                 document.getElementById("exibirApp").disabled = false;
                 document.getElementById("exibirAppRastreador").disabled = false;
                 document.getElementById("selecionarTudoOrigem").removeAttribute('disabled');
                 document.getElementById("limparTudoOrigem").removeAttribute('disabled');
                 document.getElementById("selecionarTudoVinculado").removeAttribute('disabled');
                 document.getElementById("limparTudoVinculado").removeAttribute('disabled');
                 document.getElementById("destinySearch").disabled = false;
                 document.getElementById("entidadesList").disabled = false;
                 document.getElementById("entidadeSearch").disabled = false;
                 document.getElementById("vinculadoList").disabled = false;
                 document.getElementById('icon').style.display='block';
                 self.timer(time, 'updateTime', './buscarViagens', '#tabelaRadarViagens', botao.innerHTML);
                 contCarregamento = 0;
          } else {
                 self.fecharAguarde();
          }
    }, 1000);
}

radarViagensFactory.prototype.buscarLegendaDinamica = function (urlLegendaDinamica) {
	var statusQTD = {
	    TITULO: ''
	}
	
    $.ajax({
        method: 'GET',
        url: urlLegendaDinamica
    }).done(function (resp) {
        if (resp.length < 1) {
            $('.searchContainer').addClass('erro');
            return;
        } else {
            $('.searchContainer').removeClass('erro');

        }

        resp.forEach(function (grupoVeiculo) {
        
        	statusQTD['TITULO']+= "<div class='linha-div-legenda'> ";
        	statusQTD['TITULO']+= "		<div class='coluna-imagem-legenda'> ";
        	statusQTD['TITULO']+= "			<img style='background-color:"+ grupoVeiculo.cor + ";'src='./images/grupo_box.png'> ";
        	statusQTD['TITULO']+= "		</div> ";
        	statusQTD['TITULO']+= "		<div class='coluna-descricao-legenda'>Grupo de Veículos Dedicados " + grupoVeiculo.nome + "</div> ";
        	statusQTD['TITULO']+= "</div>";
        
        });
        
        for (item in statusQTD) {
            var element = document.getElementById(item);
            if (typeof element !== undefined && element !== null) {
                element.innerHTML = statusQTD[item];
            }
        }
        
    }).catch(function (err) {
        alert(err)
    });
}

radarViagensFactory.prototype.fixarParametroOperacao = function (urlFixarParametroOperacao, ctlOperaTip) {
	var statusQTD = {
        CARGA: 0,
        DESCARGA: 0,
        TRANSITO: 0
    }
	var self = this;
	$(self.element).popover('destroy');
	$("#entidadesList").empty();
	$("#vinculadoList").empty();
	origensNamesList = [];
	namesList = "";
	
    $.ajax({
        method: 'GET',
        url: urlFixarParametroOperacao, 
        data: {
            "ctlOperaTip": ctlOperaTip
        }
    }).done(function (resp) {
    	
    	self.removeLayer('viagensEmCargaRastreador');
		self.removeLayer('viagensEmCargaApp');
		self.removeLayer('viagensEmCargaAppRastreador');
		self.removeLayer('viagensEmDescargaRastreador');
		self.removeLayer('viagensEmDescargaApp');
		self.removeLayer('viagensEmDescargaAppRastreador');
		self.removeLayer('viagensEmTransitoRastreador');
		self.removeLayer('viagensEmTransitoApp');
		self.removeLayer('viagensEmTransitoAppRastreador');
		self.removeLayer('veiculoVazioRastreador');
		self.removeLayer('veiculoVazioApp');
		self.removeLayer('veiculoVazioAppRastreador');
		self.removeLayer('entidadeVinculada');
		
		self.removeLayer('viagensEmCargaRastreadorCluster');
		self.removeLayer('viagensEmCargaAppCluster');
		self.removeLayer('viagensEmCargaAppRastreadorCluster');
		self.removeLayer('viagensEmDescargaRastreadorCluster');
		self.removeLayer('viagensEmDescargaAppCluster');
		self.removeLayer('viagensEmDescargaAppRastreadorCluster');
		self.removeLayer('viagensEmTransitoRastreadorCluster');
		self.removeLayer('viagensEmTransitoAppCluster');
		self.removeLayer('viagensEmTransitoAppRastreadorCluster');
		self.removeLayer('viagensEmCargaRastreadorDedicadoCluster');
		self.removeLayer('viagensEmCargaAppDedicadoCluster');
		self.removeLayer('viagensEmCargaAppRastreadorDedicadoCluster');
		self.removeLayer('viagensEmDescargaRastreadorDedicadoCluster');
		self.removeLayer('viagensEmDescargaAppDedicadoCluster');
		self.removeLayer('viagensEmDescargaAppRastreadorDedicadoCluster');
		self.removeLayer('viagensEmTransitoRastreadorDedicadoCluster');
		self.removeLayer('viagensEmTransitoAppDedicadoCluster');
		self.removeLayer('viagensEmTransitoAppRastreadorDedicadoCluster');
		self.removeLayer('veiculoVazioRastreadorCluster');
		self.removeLayer('veiculoVazioAppCluster');
		self.removeLayer('veiculoVazioAppRastreadorCluster');
		self.removeLayer('entidadeVinculadaCluster');
    	
		
		$("#exibirPlanosAtivos").prop('checked', true);
        $("#exibirEmCarga").prop('checked', true);
		$("#exibirEmDescarga").prop('checked', true);
		$("#exibirEmTransito").prop('checked', true);
		self.toggleViagensEmCarga(true);
		self.toggleViagensEmDescarga(true);
		self.toggleViagensEmTransito(true);
		$("#exibirFrotaDedicada").prop('checked', false);
		$("#exibirEmUso").prop('checked', false);
		$("#exibirVazio").prop('checked', false);
		self.toggleVeiculoVazio(false);
    	self.toggleRastreador($('#exibirRastreador').is(':checked'));
        self.toggleApp($('#exibirApp').is(':checked'));
        self.toggleAppRastreador($('#exibirAppRastreador').is(':checked'));
    	    	
    	self.buscarViagensEmCarga('#tabelaRadarViagens', '', './buscarViagensEmCarga', '/app/assets/data/otm.json', time, 'updateTime');
        self.buscarViagensEmDescarga('#tabelaRadarViagens', '', './buscarViagensEmDescarga', '/app/assets/data/otm.json', time, 'updateTime');
        self.buscarViagensEmTransito('#tabelaRadarViagens', '', './buscarViagensEmTransito', '/app/assets/data/otm.json', time, 'updateTime');
        self.toggleIcon();
        self.fecharAguarde();
        self.buscarLegendaDinamica('./buscarLegendaDinamica');
    }).catch(function (err) {
        alert(err)
    });
}