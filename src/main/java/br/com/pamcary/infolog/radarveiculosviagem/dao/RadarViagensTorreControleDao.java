package br.com.pamcary.infolog.radarveiculosviagem.dao;

import java.util.List;

import br.com.pamcary.infolog.radarveiculosviagem.dao.model.ViagemDetalheModel;

public interface RadarViagensTorreControleDao {

	
	List<ViagemDetalheModel> getVeiculosViagemAtiva();
	
	
}
