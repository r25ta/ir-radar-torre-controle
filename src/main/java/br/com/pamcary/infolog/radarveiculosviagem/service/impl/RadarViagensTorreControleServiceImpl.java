package br.com.pamcary.infolog.radarveiculosviagem.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.pamcary.infolog.radarveiculosviagem.dao.RadarViagensTorreControleDao;
import br.com.pamcary.infolog.radarveiculosviagem.dao.model.ViagemDetalheModel;
import br.com.pamcary.infolog.radarveiculosviagem.dto.geojson.GeoJsonDTO;
import br.com.pamcary.infolog.radarveiculosviagem.service.RadarViagensTorreControleService;
import br.com.pamcary.infolog.radarveiculosviagem.service.helper.ViagemGeoJson;

@Service
public class RadarViagensTorreControleServiceImpl implements RadarViagensTorreControleService {

	private final Logger LOGGER = LoggerFactory.getLogger(RadarViagensTorreControleServiceImpl.class);

	private static final String FEATURE_COLLECTION = "FeatureCollection";
	
	@Autowired
	private RadarViagensTorreControleDao oRadarViagensTorreControleDAO;

	@Override
	public GeoJsonDTO buscarVeiculosViagemAtiva() {
		GeoJsonDTO oGeoJsonDTO = null;
		
		List<ViagemDetalheModel> lstVeiculosViagemAtiva = oRadarViagensTorreControleDAO.getVeiculosViagemAtiva();

		if (lstVeiculosViagemAtiva.size() > 0) {
			oGeoJsonDTO = ViagemGeoJson.getInstance().viagemGeoJson(FEATURE_COLLECTION, lstVeiculosViagemAtiva);
		} else {
			LOGGER.info("Sistema não encontrou informações no banco de dados!");
		}

		return oGeoJsonDTO;
	}

	
	
}
