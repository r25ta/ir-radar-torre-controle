package br.com.pamcary.infolog.radarveiculosviagem.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.pamcary.infolog.radarveiculosviagem.dao.ViagemDAO;
import br.com.pamcary.infolog.radarveiculosviagem.dao.model.ViagemModel;
import br.com.pamcary.infolog.radarveiculosviagem.dto.geojson.GeoJsonDTO;
import br.com.pamcary.infolog.radarveiculosviagem.service.helper.ViagemGeoJson;
@Service
public class ViagemAtivaServiceImpl implements br.com.pamcary.infolog.radarveiculosviagem.service.ViagemAtivaService {

	private static final String FEATURE_COLLECTION = "FeatureCollection";

	private final Logger LOGGER = LoggerFactory.getLogger(ViagemAtivaServiceImpl.class);

	@Autowired
	private ViagemDAO oViagemDAO;
	
	
	private List<ViagemModel> lstViagens = null;
	
	private	GeoJsonDTO oGeoJsonDTO=null;
	
	
	
	@Override
	public GeoJsonDTO getAllViagensAtiva() {
		lstViagens = oViagemDAO.getViagensAtiva();
		if(lstViagens.size() > 0) {
			oGeoJsonDTO = ViagemGeoJson.getInstance().viagemGeoJson(FEATURE_COLLECTION, lstViagens);
			
		}else {
			LOGGER.info("Sistema não encontrou informações no banco de dados!");
			
		}
		
		return oGeoJsonDTO;
	}

	@Override
	public GeoJsonDTO getViagensAtivaTransitoOrigem() {
		lstViagens = oViagemDAO.getViagemTransitoOrigem();
		if(lstViagens.size() > 0) {
			oGeoJsonDTO = ViagemGeoJson.getInstance().viagemGeoJson(FEATURE_COLLECTION, lstViagens);
			
		}else {
			LOGGER.info("Sistema não encontrou informações no banco de dados!");
			
		}
		
		return oGeoJsonDTO;
	}

	@Override
	public GeoJsonDTO getViagensAtivaTransitoDestino() {
		lstViagens = oViagemDAO.getViagemTransitoDestino();
		if(lstViagens.size() > 0) {
			oGeoJsonDTO = ViagemGeoJson.getInstance().viagemGeoJson(FEATURE_COLLECTION, lstViagens);
			
		}else {
			LOGGER.info("Sistema não encontrou informações no banco de dados!");
			
		}
		
		return oGeoJsonDTO;
	}

}
