package br.com.pamcary.infolog.radarveiculosviagem.dto.geojson;

public class GeometryDTO {
	private String type;
	private double[] coordinates;
	
	
	public GeometryDTO(String type, double[] coordinates) {
		super();
		this.type = type;
		this.coordinates = coordinates;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public double[] getCoordinates() {
		return coordinates;
	}
	public void setCoordinates(double[] coordinates) {
		this.coordinates = coordinates;
	}
	
	
	
	
	
	
	
	
	
}
