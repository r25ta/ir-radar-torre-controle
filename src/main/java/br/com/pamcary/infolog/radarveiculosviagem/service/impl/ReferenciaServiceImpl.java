package br.com.pamcary.infolog.radarveiculosviagem.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.pamcary.infolog.radarveiculosviagem.dao.ReferenciaDAO;
import br.com.pamcary.infolog.radarveiculosviagem.dao.model.ReferenciaModel;
import br.com.pamcary.infolog.radarveiculosviagem.dto.geojson.GeoJsonDTO;
import br.com.pamcary.infolog.radarveiculosviagem.service.ReferenciaService;
import br.com.pamcary.infolog.radarveiculosviagem.service.helper.ViagemGeoJson;
@Service
public class ReferenciaServiceImpl implements ReferenciaService {

	private static final String FEATURE_COLLECTION = "FeatureCollection";

	private final Logger LOGGER = LoggerFactory.getLogger(ReferenciaServiceImpl.class);

	@Autowired
	private ReferenciaDAO oReferenciaDAO;
	
	
	private List<ReferenciaModel> lstReferencias = null;
	
	private	GeoJsonDTO oGeoJsonDTO=null;

	@Override
	public GeoJsonDTO getAllPostosAbastecimento() {
		
		lstReferencias = oReferenciaDAO.getAllPostosAbastecimento();
		
		if(lstReferencias.size() > 0) {
			oGeoJsonDTO = ViagemGeoJson.getInstance().viagemGeoJson(FEATURE_COLLECTION, lstReferencias);
		}else {
			LOGGER.info("Sistema não encontrou informações no banco de dados!");
		}
		
		return oGeoJsonDTO;
	}

	
/*	
	@Override
	public GeoJsonDTO getAllViagensAtiva() {
		lstReferencias = oReferenciaDAO.getViagensAtiva();
		if(lstReferencias.size() > 0) {
			
			oGeoJsonDTO = ViagemGeoJson.getInstance().viagemGeoJson(FEATURE_COLLECTION, lstReferencias);
		}
		
		return oGeoJsonDTO;
	}

	@Override
	public GeoJsonDTO getViagensAtivaTransitoOrigem() {
		lstReferencias = oReferenciaDAO.getViagemTransitoOrigem();
		if(lstReferencias.size() > 0) {
			oGeoJsonDTO = ViagemGeoJson.getInstance().viagemGeoJson(FEATURE_COLLECTION, lstReferencias);
		}
		
		return oGeoJsonDTO;
	}

	@Override
	public GeoJsonDTO getViagensAtivaTransitoDestino() {
		lstReferencias = oReferenciaDAO.getViagemTransitoDestino();
		if(lstReferencias.size() > 0) {
			oGeoJsonDTO = ViagemGeoJson.getInstance().viagemGeoJson(FEATURE_COLLECTION, lstReferencias);
		}
		
		return oGeoJsonDTO;
	}
*/
}
