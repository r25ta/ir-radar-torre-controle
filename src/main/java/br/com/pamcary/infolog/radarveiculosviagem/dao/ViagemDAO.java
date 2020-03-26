package br.com.pamcary.infolog.radarveiculosviagem.dao;

import java.util.List;

import br.com.pamcary.infolog.radarveiculosviagem.dao.model.ViagemDetalheModel;
import br.com.pamcary.infolog.radarveiculosviagem.dao.model.ViagemModel;

public interface ViagemDAO {
	public List<ViagemModel> getViagemTransitoOrigem();
	public List<ViagemModel> getViagemTransitoDestino();
	public List<ViagemModel> getViagensAtiva();
	public ViagemDetalheModel getDetalhePorViagem(long ctlPlvia);
}
