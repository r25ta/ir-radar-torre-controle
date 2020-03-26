package br.com.pamcary.infolog.radarveiculosviagem.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.pamcary.infolog.radarveiculosviagem.dto.geojson.GeoJsonDTO;
import br.com.pamcary.infolog.radarveiculosviagem.service.RadarViagensTorreControleService;
import br.com.pamcary.infolog.radarveiculosviagem.service.ViagemAtivaService;
import br.com.pamcary.infolog.radarveiculosviagem.util.Util;

@RestController
@RequestMapping({ "/" })
@CrossOrigin(origins = { "*" }, allowedHeaders = { "*" })


public class ViagemAtivaController {
	
	private long initProcess =0;
	private long endProcess=0;

	private final Logger LOGGER = LoggerFactory.getLogger(ViagemAtivaController.class);

	@Autowired
	RadarViagensTorreControleService oRadarService;
	
	@Autowired
	ViagemAtivaService oViagemAtivaService;
	
	@RequestMapping(value = {"viagens/ativa"}, method = {RequestMethod.GET})
	public ResponseEntity<GeoJsonDTO> getAllViagensAtiva(){

		initProcess = System.currentTimeMillis();
	    this.LOGGER.info("************************************************************************************");
	    this.LOGGER.info("Iniciou execução do controller getAllViagensAtiva()...");
		
		GeoJsonDTO oGeoJson = oViagemAtivaService.getAllViagensAtiva();
		
		
	    endProcess = Util.getInstance().calcularTempoExecucaoEmSegundos(initProcess, System.currentTimeMillis());
		LOGGER.info("Finalizou execução do controller getAllViagensAtiva() em =>  " + endProcess + " segundos!" );
	    this.LOGGER.info("************************************************************************************");
	    return new ResponseEntity<GeoJsonDTO>(oGeoJson, HttpStatus.OK);
		
	}

	@RequestMapping(value = {"viagens/ativa/transito/origem"}, method = {RequestMethod.GET})
	public ResponseEntity<GeoJsonDTO> getViagensAtivaTransitoOrigem(){

		initProcess = System.currentTimeMillis();
	    this.LOGGER.info("************************************************************************************");
	    this.LOGGER.info("Iniciou execução do controller getViagensAtivaTransitoOrigem()...");
		
		GeoJsonDTO oGeoJson = oViagemAtivaService.getViagensAtivaTransitoOrigem();
		
		
	    endProcess = Util.getInstance().calcularTempoExecucaoEmSegundos(initProcess, System.currentTimeMillis());
		LOGGER.info("Finalizou execução do controller getViagensAtivaTransitoOrigem() em =>  " + endProcess + " segundos!" );
	    this.LOGGER.info("************************************************************************************");
	    return new ResponseEntity<GeoJsonDTO>(oGeoJson, HttpStatus.OK);
		
	}

	@RequestMapping(value = {"viagens/ativa/transito/destino"}, method = {RequestMethod.GET})
	public ResponseEntity<GeoJsonDTO> getViagensAtivaTransitoDestino(){

		initProcess = System.currentTimeMillis();
	    this.LOGGER.info("************************************************************************************");
	    this.LOGGER.info("Iniciou execução do controller getViagensAtivaTransitoDestino()...");
		
		GeoJsonDTO oGeoJson = oViagemAtivaService.getViagensAtivaTransitoDestino();
		
		
	    endProcess = Util.getInstance().calcularTempoExecucaoEmSegundos(initProcess, System.currentTimeMillis());
		LOGGER.info("Finalizou execução do controller getViagensAtivaTransitoDestino() em =>  " + endProcess + " segundos!" );
	    this.LOGGER.info("************************************************************************************");
	    return new ResponseEntity<GeoJsonDTO>(oGeoJson, HttpStatus.OK);
		
	}
	
}
