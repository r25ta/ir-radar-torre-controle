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

import br.com.pamcary.infolog.radarveiculosviagem.dao.RadarViagensTorreControleDao;
import br.com.pamcary.infolog.radarveiculosviagem.dao.config.OracleDataSourceConfig;
import br.com.pamcary.infolog.radarveiculosviagem.dao.mapper.ViagemDetalheMapper;
import br.com.pamcary.infolog.radarveiculosviagem.dao.model.ViagemDetalheModel;
import br.com.pamcary.infolog.radarveiculosviagem.exception.ViagemException;

@Repository
public class RadarViagensTorreControleDaoImpl extends JdbcDaoSupport implements RadarViagensTorreControleDao {

	private static final Logger LOGGER = LoggerFactory.getLogger(RadarViagensTorreControleDaoImpl.class);

	
	private static final String SQL_BUSCAR_ULTIMA_POSICAO_VEICULO_VIAGEM = " SELECT PV.CTL_PLVIA "
			+ ",TO_CHAR(PV.DHR_POSIC_ULT,'DD/MM/YYYY HH24:MI:SS') AS DHR_POSIC_ULT , PV.DES_PRACA_ULT " + ", PV.CTL_OPERA_TIP " + ", T.DES_OPERA_TIP "
			+ ", V.CTL_VEICU " + ", V.COD_PLACA " + ", PV.NUM_LATIT_ULT "
			+ ", PV.NUM_LONGI_ULT " + ", DI.COD_DISPO_RST " + ", TEC.NOM_FANTS "
			+ ", SPV.DES_SITUA"
			+ ", FC_VINCULADO_NOM_GUERR(PV.CTL_TRNSP) AS TRNSP "
			+ ", FC_VINCULADO_NOM_GUERR(PV.CTL_REMET) AS ORIGEM "
			+ ", FC_VINCULADO_NOM_GUERR(PV.CTL_DESTI) AS DESTINO "
			+ " FROM PLANO_VIAGEM PV " + " ,INF_VEICU_PLANO_VIAGEM VPV " + " ,TIPO_OPERACAO T " + " ,V_CRP_VEICULO V "
			+ " ,INF_RELAC_VEICU_DISPO_PLANO IRVDP " + " ,INF_DISPOSITIVO DI " + " ,V_CRP_PROVEDOR_TECNOLOGIA TEC "
			+ " ,INF_RELAC_PROVE_RASTR_DISPO PRD "
			+" ,SITUACAO_PLANO_VIAGEM SPV "
			+ " WHERE PV.CTL_PLVIA = VPV.CTL_PLVIA "
			+ " AND PV.SIT_PLVIA = SPV.SIT_PLVIA "
			+ " AND PV.SIT_PLVIA IN (0, 1) "
			+ " 	AND PV.CTL_OPERA_TIP = T.CTL_OPERA_TIP " + " 	AND VPV.CTL_VEICU = V.CTL_VEICU "
			+ " 	AND V.NUM_CATEG_VEI NOT IN (3) " + " 	AND PV.CTL_PLVIA = IRVDP.CTL_PLVIA "
			+ " 	AND IRVDP.CTL_DISPO_RST = DI.CTL_DISPO_RST " + " 	AND DI.CTL_DISPO_RST = PRD.CTL_DISPO_RST "
			+ " 	AND PRD.CTL_PROVE_TEN = TEC.CTL_PROVE_TEN "
			+"		AND DHR_POSIC_PRM IS NOT NULL";

	@Autowired
	private OracleDataSourceConfig oracleDataSource;

	@PostConstruct
	private void initialize() {
		setDataSource(oracleDataSource.oracleJndiDataSource());
	}

	@Override
	public List<ViagemDetalheModel> getVeiculosViagemAtiva() {
		LOGGER.debug("Executando metodo getVeiculosViagensAtivas...");
		List<ViagemDetalheModel> lstVeiculosViagensAtiva = new ArrayList<>();
		
		try{
			LOGGER.info("SQL-> " + SQL_BUSCAR_ULTIMA_POSICAO_VEICULO_VIAGEM);
			lstVeiculosViagensAtiva = getJdbcTemplate().query(SQL_BUSCAR_ULTIMA_POSICAO_VEICULO_VIAGEM, new ViagemDetalheMapper()); 
												
			getJdbcTemplate().getDataSource().getConnection().close();		
			
		
		}catch(EmptyResultDataAccessException e) {
			LOGGER.info("Sistema não encontrou informações no banco de dados!");
			LOGGER.info("=> " + e);
			return null;

		}catch(SQLException e){
			throw new ViagemException("Erro na execução! " + SQL_BUSCAR_ULTIMA_POSICAO_VEICULO_VIAGEM +" Causa do Erro -> ",e);
			
		}
		
		return lstVeiculosViagensAtiva;
	}

}
