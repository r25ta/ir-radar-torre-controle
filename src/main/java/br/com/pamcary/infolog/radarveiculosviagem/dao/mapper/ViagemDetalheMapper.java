package br.com.pamcary.infolog.radarveiculosviagem.dao.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import br.com.pamcary.infolog.radarveiculosviagem.dao.model.ViagemDetalheModel;

public class ViagemDetalheMapper implements RowMapper<ViagemDetalheModel> {

	@Override
	public ViagemDetalheModel mapRow(ResultSet rs, int rowNum) throws SQLException {
		ViagemDetalheModel oViagemDetalhe = new ViagemDetalheModel();
		
		oViagemDetalhe.setCtlPlvia(rs.getLong("CTL_PLVIA"));
		oViagemDetalhe.setDhrPosicUlt(rs.getString("DHR_POSIC_ULT"));
		oViagemDetalhe.setDesPracaUlt(rs.getString("DES_PRACA_ULT"));
		oViagemDetalhe.setCtlOperaTip(rs.getInt("CTL_OPERA_TIP"));
		oViagemDetalhe.setDesOperaTip(rs.getString("DES_OPERA_TIP"));
		oViagemDetalhe.setCtlVeicu(rs.getInt("CTL_VEICU"));
		oViagemDetalhe.setCodPlaca(rs.getString("COD_PLACA"));
		oViagemDetalhe.setNumLatitUlt(rs.getDouble("NUM_LATIT_ULT"));
		oViagemDetalhe.setNumLongiUlt(rs.getDouble("NUM_LONGI_ULT"));
		oViagemDetalhe.setCodDispoRst(rs.getString("TERMINAL"));
		oViagemDetalhe.setProvedor(rs.getString("PROVEDOR"));
		oViagemDetalhe.setDesSitua(rs.getString("DES_SITUA"));
		oViagemDetalhe.setTrnsp(rs.getString("TRNSP"));
		oViagemDetalhe.setOrigem(rs.getString("ORIGEM"));
		oViagemDetalhe.setDestinoFinal(rs.getString("DESTINO"));
		
		return oViagemDetalhe;
	}

}
