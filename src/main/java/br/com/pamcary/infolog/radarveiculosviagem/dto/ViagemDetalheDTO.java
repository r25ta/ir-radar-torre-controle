package br.com.pamcary.infolog.radarveiculosviagem.dto;

import java.util.List;

public class ViagemDetalheDTO {
	private long ctlPlvia;
	private String dhrPosicUlt;
	private String desPracaUlt;
	private int ctlOperaTip;
	private String desOperaTip;
	private int ctlVeicu;
	private String codPlaca;
	private double numLatitUlt;
	private double numLongiUlt;
	private String codDispoRst;
	private String provedor;
	private String desSitua;
	private String trnsp;
	private String origem;
	private String destinoFinal;
	private List<MotoristaDTO> motoristas;
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
	public String getDesPracaUlt() {
		return desPracaUlt;
	}
	public void setDesPracaUlt(String desPracaUlt) {
		this.desPracaUlt = desPracaUlt;
	}
	public int getCtlOperaTip() {
		return ctlOperaTip;
	}
	public void setCtlOperaTip(int ctlOperaTip) {
		this.ctlOperaTip = ctlOperaTip;
	}
	public String getDesOperaTip() {
		return desOperaTip;
	}
	public void setDesOperaTip(String desOperaTip) {
		this.desOperaTip = desOperaTip;
	}
	public int getCtlVeicu() {
		return ctlVeicu;
	}
	public void setCtlVeicu(int ctlVeicu) {
		this.ctlVeicu = ctlVeicu;
	}
	public String getCodPlaca() {
		return codPlaca;
	}
	public void setCodPlaca(String codPlaca) {
		this.codPlaca = codPlaca;
	}
	public double getNumLatitUlt() {
		return numLatitUlt;
	}
	public void setNumLatitUlt(double numLatitUlt) {
		this.numLatitUlt = numLatitUlt;
	}
	public double getNumLongiUlt() {
		return numLongiUlt;
	}
	public void setNumLongiUlt(double numLongiUlt) {
		this.numLongiUlt = numLongiUlt;
	}
	public String getCodDispoRst() {
		return codDispoRst;
	}
	public void setCodDispoRst(String codDispoRst) {
		this.codDispoRst = codDispoRst;
	}
	public String getProvedor() {
		return provedor;
	}
	public void setProvedor(String provedor) {
		this.provedor = provedor;
	}
	public String getDesSitua() {
		return desSitua;
	}
	public void setDesSitua(String desSitua) {
		this.desSitua = desSitua;
	}
	public String getTrnsp() {
		return trnsp;
	}
	public void setTrnsp(String trnsp) {
		this.trnsp = trnsp;
	}
	public String getOrigem() {
		return origem;
	}
	public void setOrigem(String origem) {
		this.origem = origem;
	}
	public String getDestinoFinal() {
		return destinoFinal;
	}
	public void setDestinoFinal(String destinoFinal) {
		this.destinoFinal = destinoFinal;
	}
	public List<MotoristaDTO> getMotoristas() {
		return motoristas;
	}
	public void setMotoristas(List<MotoristaDTO> motoristas) {
		this.motoristas = motoristas;
	}
	
	
	
}
