package br.com.pamcary.infolog.radarveiculosviagem.dao.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import br.com.pamcary.infolog.radarveiculosviagem.dao.model.ViagemModel;

public class ViagemMapper implements RowMapper<ViagemModel> {

	@Override
	public ViagemModel mapRow(ResultSet rs, int rowNum) throws SQLException {
		ViagemModel oViagem = new ViagemModel();
		oViagem.setCtlPlvia(rs.getLong("ctl_plvia"));
		oViagem.setPlaca(rs.getString("placa"));
		oViagem.setDhrPosicUlt(rs.getString("dhr_posic_ult"));
		oViagem.setDesPosicUlt(rs.getString("des_praca_ult"));
		oViagem.setNumLatit(rs.getDouble("num_latit_ult"));
		oViagem.setNumLongi(rs.getDouble("num_longi_ult"));
		if(rs.getString("sta_geren_ris").equals("S")) {
			oViagem.setGerenciamentoRiscos(true);
		}else {
			oViagem.setGerenciamentoRiscos(false);
		}
		
		
		return oViagem;
	}
	
}
