package br.com.pamcary.infolog.radarveiculosviagem.dao.model;

import java.io.Serializable;

public class ReferenciaModel implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private int codAtivi;
    private String desAtivi;
    private long ctlVincd;
    private String nomVincd;
    private double numLatit;
    private double numLongi;
    private String desEnder;
    private String desBairrEnd;
    private String desPraca;
    private String sigUf;
    
	public int getCodAtivi() {
		return codAtivi;
	}
	public void setCodAtivi(int codAtivi) {
		this.codAtivi = codAtivi;
	}
	public String getDesAtivi() {
		return desAtivi;
	}
	public void setDesAtivi(String desAtivi) {
		this.desAtivi = desAtivi;
	}
	public long getCtlVincd() {
		return ctlVincd;
	}
	public void setCtlVincd(long ctlVincd) {
		this.ctlVincd = ctlVincd;
	}
	public String getNomVincd() {
		return nomVincd;
	}
	public void setNomVincd(String nomVincd) {
		this.nomVincd = nomVincd;
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
	public String getDesEnder() {
		return desEnder;
	}
	public void setDesEnder(String desEnder) {
		this.desEnder = desEnder;
	}
	public String getDesBairrEnd() {
		return desBairrEnd;
	}
	public void setDesBairrEnd(String desBairrEnd) {
		this.desBairrEnd = desBairrEnd;
	}
	public String getDesPraca() {
		return desPraca;
	}
	public void setDesPraca(String desPraca) {
		this.desPraca = desPraca;
	}
	public String getSigUf() {
		return sigUf;
	}
	public void setSigUf(String sigUf) {
		this.sigUf = sigUf;
	}
	@Override
	public String toString() {
		return "ReferenciaModel [codAtivi=" + codAtivi + ", desAtivi=" + desAtivi + ", ctlVincd=" + ctlVincd
				+ ", nomVincd=" + nomVincd + ", numLatit=" + numLatit + ", numLongi=" + numLongi + ", desEnder="
				+ desEnder + ", desBairrEnd=" + desBairrEnd + ", desPraca=" + desPraca + ", sigUf=" + sigUf + "]";
	}
    
   
    
    
	
}
