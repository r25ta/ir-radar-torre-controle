package br.com.pamcary.infolog.radarveiculosviagem.dao.model;

import java.io.Serializable;

public class MotoristaModel implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private int ctlMotot;
	private String nomMotot;
	private String telefone;
	public int getCtlMotot() {
		return ctlMotot;
	}
	public void setCtlMotot(int ctlMotot) {
		this.ctlMotot = ctlMotot;
	}
	public String getNomMotot() {
		return nomMotot;
	}
	public void setNomMotot(String nomMotot) {
		this.nomMotot = nomMotot;
	}
	public String getTelefone() {
		return telefone;
	}
	public void setTelefone(String telefone) {
		this.telefone = telefone;
	}
	

}
