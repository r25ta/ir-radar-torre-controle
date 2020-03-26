package br.com.pamcary.infolog.radarveiculosviagem.dao.impl;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.support.JdbcDaoSupport;
import org.springframework.stereotype.Repository;

import br.com.pamcary.infolog.radarveiculosviagem.dao.MotoristaDAO;
import br.com.pamcary.infolog.radarveiculosviagem.dao.config.OracleDataSourceConfig;
import br.com.pamcary.infolog.radarveiculosviagem.dao.mapper.MotoristaMapper;
import br.com.pamcary.infolog.radarveiculosviagem.dao.model.MotoristaModel;
import br.com.pamcary.infolog.radarveiculosviagem.exception.ViagemException;

@Repository
public class MotoristaDAOImpl extends JdbcDaoSupport implements MotoristaDAO {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(MotoristaDAOImpl.class);

	
	private static final String SQL_MOTORISTA_BY_CTL_PLVIA = " SELECT MPV.CTL_PLVIA " + 
			"       ,M.CTL_MOTOT " + 
			"       ,M.NOM_MOTORISTA AS MOTORISTA " + 
			"       ,NVL(TM.NUM_DDD || '-' || TM.COD_TELEF,'TELEFONE NAO INFORMADO') AS TELEFONE " + 
			"FROM INF_MOTORISTA_PLANO_VIAGEM MPV " + 
			"     ,V_CRP_MOTORISTA M " + 
			"     ,PAMAIS_PRD.TCRP_TELEFONE_CONTATO TM " + 
			"WHERE 1=1 " + 
			"AND MPV.CTL_PLVIA = ? " + 
			"AND MPV.CTL_MOTOT = M.CTL_MOTOT " + 
			"AND M.CTL_MOTOT = TM.CTL_PESSO " + 
			"AND TM.NUM_TELEF_PES = 1 ";

	@Autowired
	private OracleDataSourceConfig oracleDataSource;

	@PostConstruct
	private void initialize() {
		setDataSource(oracleDataSource.oracleJndiDataSource());
	}

	
	@Override
	public List<MotoristaModel> getMotoristaByCtlPlvia(long ctlPlvia) {
		LOGGER.debug("Executando metodo getMotoristaByCtlPlvia...");
		List<MotoristaModel> lstMotoristas = new ArrayList<>();
		
		try{
			LOGGER.debug("SQL-> " + SQL_MOTORISTA_BY_CTL_PLVIA);
			lstMotoristas = getJdbcTemplate().query(SQL_MOTORISTA_BY_CTL_PLVIA,new Object[] {ctlPlvia}, new MotoristaMapper()); 
												
			getJdbcTemplate().getDataSource().getConnection().close();		
			
		
		}catch(EmptyResultDataAccessException e) {
			LOGGER.info("Sistema não encontrou informações no banco de dados!");
			LOGGER.info("=> " + e);
			return null;

		}catch(SQLException e){
			throw new ViagemException("Erro na execução! " + SQL_MOTORISTA_BY_CTL_PLVIA +" Causa do Erro -> ",e);
			
		}
		
		return lstMotoristas;
	}

}
