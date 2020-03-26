package br.com.pamcary.infolog.radarveiculosviagem.dto.geojson;

import java.util.Objects;

public class FeatureDTO{
	private String type;
	private int id;
	private Object properties;	
	
	private GeometryDTO geometry;

	

	public FeatureDTO(String type, int id, Object properties, GeometryDTO geometry) {
		super();
		this.type = type;
		this.id = id;
		this.properties = properties;
		this.geometry = geometry;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Object getProperties() {
		return properties;
	}

	public void setProperties(Objects properties) {
		this.properties = properties;
	}

	public GeometryDTO getGeometry() {
		return geometry;
	}

	public void setGeometry(GeometryDTO geometry) {
		this.geometry = geometry;
	}
	


	
}
