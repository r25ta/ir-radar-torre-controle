package br.com.pamcary.infolog.radarveiculosviagem.dao;

import java.util.List;

import br.com.pamcary.infolog.radarveiculosviagem.dao.model.MotoristaModel;

public interface MotoristaDAO {
	public List<MotoristaModel> getMotoristaByCtlPlvia(long ctlPlvia);
}
