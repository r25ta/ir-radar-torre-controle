package br.com.pamcary.infolog.radarveiculosviagem.dao.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import br.com.pamcary.infolog.radarveiculosviagem.dao.model.ReferenciaModel;

public class ReferenciaMapper implements RowMapper<ReferenciaModel> {

	@Override
	public ReferenciaModel mapRow(ResultSet rs, int rowNum) throws SQLException {
		ReferenciaModel oReferencia = new ReferenciaModel();
		oReferencia.setCodAtivi(rs.getInt("COD_ATIVI"));
		oReferencia.setDesAtivi(rs.getString("DES_ATIVI"));
		oReferencia.setCtlVincd(rs.getLong("CTL_VINCD"));
		oReferencia.setNomVincd(rs.getString("NOM_VINCD"));
		oReferencia.setNumLatit(rs.getDouble("NUM_LATIT"));
		oReferencia.setNumLongi(rs.getDouble("NUM_LONGI"));
		oReferencia.setDesEnder(rs.getString("DES_ENDER"));
		oReferencia.setDesBairrEnd(rs.getString("DES_BAIRR_END"));
		oReferencia.setDesPraca(rs.getString("PRACA"));
		oReferencia.setSigUf(rs.getString("UF"));
		
		return oReferencia;
	}

}
