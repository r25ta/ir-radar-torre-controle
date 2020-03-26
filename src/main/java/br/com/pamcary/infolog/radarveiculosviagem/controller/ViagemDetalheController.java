package br.com.pamcary.infolog.radarveiculosviagem.controller;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.pamcary.infolog.radarveiculosviagem.dto.ViagemDetalheDTO;
import br.com.pamcary.infolog.radarveiculosviagem.service.ViagemDetalheService;
import br.com.pamcary.infolog.radarveiculosviagem.util.Util;

@RestController
@RequestMapping({ "viagem/" })
@CrossOrigin(origins = { "*" }, allowedHeaders = { "*" })

public class ViagemDetalheController {
	private long initProcess =0;
	private long endProcess=0;

	private final Logger LOGGER = LoggerFactory.getLogger(ViagemAtivaController.class);
	
	@Autowired
	ViagemDetalheService oViagemDetalhe;
	
	@RequestMapping(value = {"detalhe/"}, params = {"ctlplvia"}, method = {RequestMethod.GET})
	public ResponseEntity<ViagemDetalheDTO> getViagemDetalhe(@RequestBody @Valid @RequestParam("ctlplvia") long ctlPlvia){
		ViagemDetalheDTO oViagemDetalheDTO = null;
		
		initProcess = System.currentTimeMillis();
	    this.LOGGER.info("************************************************************************************");
	    this.LOGGER.info("Iniciou execução do controller getViagemDetalhe()...");
		
	    if(ctlPlvia>0) {
			oViagemDetalheDTO = oViagemDetalhe.getViagemDetalhe(ctlPlvia);
	    	
	    }else {
	    	return null;
	    }
	    
		
		
	    endProcess = Util.getInstance().calcularTempoExecucaoEmSegundos(initProcess, System.currentTimeMillis());
		LOGGER.info("Finalizou execução do controller getViagemDetalhe() em =>  " + endProcess + " segundos!" );
	    this.LOGGER.info("************************************************************************************");
	    return new ResponseEntity<ViagemDetalheDTO>(oViagemDetalheDTO, HttpStatus.OK);
		
	}

}
