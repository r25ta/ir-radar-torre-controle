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
import br.com.pamcary.infolog.radarveiculosviagem.service.ReferenciaService;
import br.com.pamcary.infolog.radarveiculosviagem.util.Util;

@RestController
@RequestMapping({ "referencias/" })
@CrossOrigin(origins = { "*" }, allowedHeaders = { "*" })


public class ReferenciaController {
	
	private long initProcess =0;
	private long endProcess=0;

	private final Logger LOGGER = LoggerFactory.getLogger(ReferenciaController.class);

	
	@Autowired
	ReferenciaService oReferenciaService;
	
	@RequestMapping(value = {"postosabastecimento/"}, method = {RequestMethod.GET})
	public ResponseEntity<GeoJsonDTO> getAllPostosAbastecimento(){

		initProcess = System.currentTimeMillis();
	    this.LOGGER.info("************************************************************************************");
	    this.LOGGER.info("Iniciou execução do controller getAllPostosAbastecimento()...");
		
		GeoJsonDTO oGeoJson = oReferenciaService.getAllPostosAbastecimento();
		
		
	    endProcess = Util.getInstance().calcularTempoExecucaoEmSegundos(initProcess, System.currentTimeMillis());
		LOGGER.info("Finalizou execução do controller getAllPostosAbastecimento() em =>  " + endProcess + " segundos!" );
	    this.LOGGER.info("************************************************************************************");
	    return new ResponseEntity<GeoJsonDTO>(oGeoJson, HttpStatus.OK);
		
	}
	
	@RequestMapping(value= {"policiasrodoviaria"})
	public ResponseEntity<GeoJsonDTO> getAllPoliciasRodoviaria(){
		initProcess = System.currentTimeMillis();
	    this.LOGGER.info("************************************************************************************");
	    this.LOGGER.info("Iniciou execução do controller getAllPoliciasRodoviaria()...");
		
		GeoJsonDTO oGeoJson = oReferenciaService.getAllPostosAbastecimento();
		
		
	    endProcess = Util.getInstance().calcularTempoExecucaoEmSegundos(initProcess, System.currentTimeMillis());
		LOGGER.info("Finalizou execução do controller getAllPoliciasRodoviaria() em =>  " + endProcess + " segundos!" );
	    this.LOGGER.info("************************************************************************************");
	    return new ResponseEntity<GeoJsonDTO>(oGeoJson, HttpStatus.OK);
	}
	
	
}
