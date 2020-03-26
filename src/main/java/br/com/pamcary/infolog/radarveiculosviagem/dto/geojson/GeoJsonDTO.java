package br.com.pamcary.infolog.radarveiculosviagem.dto.geojson;

import java.io.Serializable;
import java.util.List;

public class GeoJsonDTO  implements Serializable {

	public GeoJsonDTO() {
		super();
	}
	private static final long serialVersionUID = 1L;
	
	
	private String type;
	private List<FeatureDTO> features;

	
	
	
	
	public GeoJsonDTO(String type, List<FeatureDTO> features) {
		super();
		this.type = type;
		this.features = features;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}

	
	public List<FeatureDTO> getFeatures() {
		return features;
	}
	public void setFeatures(List<FeatureDTO> features) {
		this.features = features;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	@Override
	public String toString() {
		return "GeoJsonDTO [type=" + type + ", features=" + features + "]";
	}
	
	
	
	
}
