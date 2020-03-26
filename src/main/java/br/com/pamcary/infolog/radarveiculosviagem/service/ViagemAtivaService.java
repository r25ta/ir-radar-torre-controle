package br.com.pamcary.infolog.radarveiculosviagem.service;

import br.com.pamcary.infolog.radarveiculosviagem.dto.geojson.GeoJsonDTO;

public interface ViagemAtivaService {
	GeoJsonDTO getAllViagensAtiva();
	GeoJsonDTO getViagensAtivaTransitoOrigem();
	GeoJsonDTO getViagensAtivaTransitoDestino();
	
}
