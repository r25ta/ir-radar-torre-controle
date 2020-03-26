package br.com.pamcary.infolog.radarveiculosviagem.dto;

public class ViagemDTO {
	private long ctlPlvia;
	private String placa;
	private String dhrPosicUlt;
	private String desPosicUlt;
	private double numLatit;
	private double numLongi;
	
	

	
	public String getPlaca() {
		return placa;
	}
	public void setPlaca(String placa) {
		this.placa = placa;
	}
	public long getCtlPlvia() {
		return ctlPlvia;
	}
	public void setCtlPlvia(long ctlPlvia) {
		this.ctlPlvia = ctlPlvia;
	}
	public String getDhrPosicUlt() {
		return dhrPosicUlt;
	}
	public void setDhrPosicUlt(String dhrPosicUlt) {
		this.dhrPosicUlt = dhrPosicUlt;
	}
	public String getDesPosicUlt() {
		return desPosicUlt;
	}
	public void setDesPosicUlt(String desPosicUlt) {
		this.desPosicUlt = desPosicUlt;
	}
	public double getNumLatit() {
		return numLatit;
	}
	public void setNumLatit(double numLatit) {
		this.numLatit = numLatit;
	}
	public double getNumLongi() {
		return numLongi;
	}
	public void setNumLongi(double numLongi) {
		this.numLongi = numLongi;
	}

	

}
