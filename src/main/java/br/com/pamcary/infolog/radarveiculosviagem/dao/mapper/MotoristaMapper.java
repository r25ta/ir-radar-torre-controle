package br.com.pamcary.infolog.radarveiculosviagem.dao.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import br.com.pamcary.infolog.radarveiculosviagem.dao.model.MotoristaModel;

public class MotoristaMapper implements RowMapper<MotoristaModel> {

	@Override
	public MotoristaModel mapRow(ResultSet rs, int rowNum) throws SQLException {
		MotoristaModel oMotorista = new MotoristaModel();
		oMotorista.setCtlMotot(rs.getInt("CTL_MOTOT"));
		oMotorista.setNomMotot(rs.getString("MOTORISTA"));
		oMotorista.setTelefone(rs.getString("TELEFONE"));
		return oMotorista;
	}

}
