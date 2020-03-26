package br.com.pamcary.infolog.radarveiculosviagem.service.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.pamcary.infolog.radarveiculosviagem.dao.MotoristaDAO;
import br.com.pamcary.infolog.radarveiculosviagem.dao.ViagemDAO;
import br.com.pamcary.infolog.radarveiculosviagem.dao.model.ViagemDetalheModel;
import br.com.pamcary.infolog.radarveiculosviagem.dto.ViagemDetalheDTO;
import br.com.pamcary.infolog.radarveiculosviagem.service.ViagemDetalheService;

@Service
public class ViagemDetalheServiceImpl implements ViagemDetalheService {

	@Autowired
	ViagemDAO oViagem;
	
	@Autowired
	MotoristaDAO oMotorista;
	
	
	
	@Override
	public ViagemDetalheDTO getViagemDetalhe(long ctlPlvia) {
		// TODO Auto-generated method stub
		ViagemDetalheModel oViagemModel = oViagem.getDetalhePorViagem(ctlPlvia);
		oViagemModel.setMotoristas(oMotorista.getMotoristaByCtlPlvia(ctlPlvia));
		
		ViagemDetalheDTO oViagemDetalheDTO = new ViagemDetalheDTO();
		
		BeanUtils.copyProperties(oViagemModel, oViagemDetalheDTO);
		
		return oViagemDetalheDTO;
	}

}
