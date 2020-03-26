package br.com.pamcary.infolog.radarveiculosviagem.service.helper;

import java.util.ArrayList;
import java.util.List;

import br.com.pamcary.infolog.radarveiculosviagem.dto.geojson.FeatureDTO;
import br.com.pamcary.infolog.radarveiculosviagem.dto.geojson.GeoJsonDTO;
import br.com.pamcary.infolog.radarveiculosviagem.dto.geojson.GeometryDTO;
import br.com.pamcary.infolog.radarveiculosviagem.util.Util;

public class ViagemGeoJson {

	private static final String TYPE_POINT = "Point";
	private static ViagemGeoJson instance = null;

	protected ViagemGeoJson() {
		
	}
	
	public static ViagemGeoJson getInstance(){
		if(instance==null){
			instance = new ViagemGeoJson();
		}
		return instance;
		
	}

	
	public GeoJsonDTO viagemGeoJson(String feature, List<?> elements) {
		return new GeoJsonDTO(feature, getInstance().popularFeaturePoint(elements));
	}


	private List<FeatureDTO> popularFeaturePoint(List<?> elements) {
		
		List<FeatureDTO> lstFeature = new ArrayList<>();
		
		int i = 0;
		try {
			for (Object oProperties : elements) {
				
				FeatureDTO oFeatureDTO = new FeatureDTO( 
						"Feature"
						, i
						, oProperties
						, new GeometryDTO (
								TYPE_POINT
								, new double []{ (double) Util.getInstance().buscarElemento(oProperties, "numLongi")
												,(double) Util.getInstance().buscarElemento(oProperties, "numLatit")
												}
								)
						);
			
				i++;
				
				lstFeature.add(oFeatureDTO);
			}
			
		}catch (Exception e) {
			// TODO: handle exception
		}
		
			
		return lstFeature;
	}

}