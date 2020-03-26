package br.com.pamcary.infolog.radarveiculosviagem.dao;

import java.util.List;

import br.com.pamcary.infolog.radarveiculosviagem.dao.model.ReferenciaModel;

public interface ReferenciaDAO {
	List<ReferenciaModel> getAllPostosAbastecimento();
	List<ReferenciaModel> getAllPoliciaRodoviaria();
	List<ReferenciaModel> getAllPostoPamcary();
	List<ReferenciaModel> getAllPostoFiscalizacaoFazendaria();
	
}
