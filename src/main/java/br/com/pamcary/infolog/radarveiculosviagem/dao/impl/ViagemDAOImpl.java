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

import br.com.pamcary.infolog.radarveiculosviagem.dao.ViagemDAO;
import br.com.pamcary.infolog.radarveiculosviagem.dao.config.OracleDataSourceConfig;
import br.com.pamcary.infolog.radarveiculosviagem.dao.mapper.ViagemDetalheMapper;
import br.com.pamcary.infolog.radarveiculosviagem.dao.mapper.ViagemMapper;
import br.com.pamcary.infolog.radarveiculosviagem.dao.model.ViagemDetalheModel;
import br.com.pamcary.infolog.radarveiculosviagem.dao.model.ViagemModel;
import br.com.pamcary.infolog.radarveiculosviagem.exception.ViagemException;

@Repository
public class ViagemDAOImpl extends JdbcDaoSupport implements ViagemDAO {

	private static final Logger LOGGER = LoggerFactory.getLogger(ViagemDAOImpl.class);

	private static final String SQL_BUSCAR_VIAGENS_ATIVA = " SELECT PV.CTL_PLVIA "
								+ ", FC_PLACA_VEICULO(PV.CTL_PLVIA) AS PLACA "
								+ "     , TO_CHAR(PV.DHR_POSIC_ULT,'DD/MM/YYYY HH24:MI:SS') AS DHR_POSIC_ULT "
								+ "     , PV.DES_PRACA_ULT "
								+ "     , PV.NUM_LATIT_ULT "
								+ "     , PV.NUM_LONGI_ULT "
								+ "		, PPI.STA_GEREN_RIS ";
	
	private static final String FROM_VIAGENS_ATIVA = " FROM PLANO_VIAGEM PV, TIPO_OPERACAO T, PERFIL_PARAMETRO_INFOLOG PPI "
								+ " WHERE PV.SIT_PLVIA IN (0,1) "
								+ " AND DHR_POSIC_PRM IS NOT NULL "
								+ " AND PV.CTL_OPERA_TIP = T.CTL_OPERA_TIP " 
								+ " AND T.CTL_VINCD_EMB = PPI.CTL_VINCD";
	
	private static final String FROM_VIAGENS_ATIVA_TRANSITO_ORIGEM = " FROM PLANO_VIAGEM PV, TIPO_OPERACAO T, PERFIL_PARAMETRO_INFOLOG PPI "
								+ "    WHERE PV.SIT_PLVIA = 0 "
								+ "    AND PV.DHR_POSIC_PRM IS NOT NULL "
								+ "    AND PV.CTL_OPERA_TIP = T.CTL_OPERA_TIP " 
								+ "    AND T.CTL_VINCD_EMB = PPI.CTL_VINCD "
								+ "    AND 0 = (SELECT COUNT(1) FROM ROTEIRO_MOTORISTA  "
								+ "              WHERE CTL_PLVIA = PV.CTL_PLVIA AND SIT_FASE_REA IN ('R', 'T')) "
								+ "    AND CTL_PLVIA IN (SELECT CTL_PLVIA FROM ROTEIRO_MOTORISTA RM "
								+ " WHERE CTL_PLVIA = PV.CTL_PLVIA "
								+ " AND NUM_SEQUE = ( SELECT MIN(NUM_SEQUE) FROM ROTEIRO_MOTORISTA "
								+ " WHERE CTL_PLVIA = RM.CTL_PLVIA ) )";
	
	private static final String FROM_VIAGENS_ATIVATRANSITO_DESTINO = " FROM PLANO_VIAGEM PV, TIPO_OPERACAO T, PERFIL_PARAMETRO_INFOLOG PPI "
								+ " WHERE PV.SIT_PLVIA = 1 "
								+ "    AND PV.DHR_POSIC_PRM IS NOT NULL "
								+ "    AND PV.CTL_OPERA_TIP = T.CTL_OPERA_TIP " 
								+ "    AND T.CTL_VINCD_EMB = PPI.CTL_VINCD "
								+ "    AND PV.CTL_PLVIA IN (SELECT RM1.CTL_PLVIA FROM ROTEIRO_MOTORISTA RM1, ROTEIRO_MOTORISTA RM2 "
								+ " WHERE RM1.CTL_PARAD IN (10, 12, 13, 25) "
								+ " AND RM2.ORD_DESTI = (SELECT MIN(ORD_DESTI) FROM DESTINATARIO_PLANO_VIAGEM "
								+ " WHERE CTL_PLVIA = RM1.CTL_PLVIA "
								+ " AND SIT_PLVIA IN (0, 1) ) "
								+ " AND RM2.CTL_PARAD = (SELECT MAX(CTL_PARAD) FROM ROTEIRO_MOTORISTA "
								+ " WHERE CTL_PLVIA = RM2.CTL_PLVIA "
								+ " AND CTL_PTOPD = RM2.CTL_PTOPD "
								+ " AND ORD_DESTI = RM2.ORD_DESTI "
								+ " AND CTL_PARAD IN (10, 12, 24) ) "
								+ " AND RM2.SIT_FASE_REA IN ('S', 'M') "
								+ " AND PV.CTL_PLVIA = RM1.CTL_PLVIA "
								+ " AND PV.CTL_PLVIA = RM2.CTL_PLVIA)";
	
	
	
	private static final String SQL_BUSCA_DETALHE_VIAGEM = " SELECT  " 
			+ " PV.CTL_PLVIA , "
			+ " TO_CHAR(PV.DHR_POSIC_ULT,'DD/MM/YYYY HH24:MI:SS') AS DHR_POSIC_ULT , "
			+ "  PV.DES_PRACA_ULT , " 
			+ "  PV.CTL_OPERA_TIP , "
			+ "  T.DES_OPERA_TIP , " 
			+ "  V.CTL_VEICU , " 
			+ "  V.COD_PLACA , " 
			+ "  PV.NUM_LATIT_ULT , " 
			+ "  PV.NUM_LONGI_ULT , " 
			+ "  fc_id_veiculo(pv.ctl_plvia) AS TERMINAL, " 
			+ "  fc_relatorio_provedor_nome(pv.ctl_plvia) AS PROVEDOR, " 
			+ "  SPV.DES_SITUA, " 
			+ "  FC_VINCULADO_NOM_GUERR(PV.CTL_TRNSP) AS TRNSP , " 
			+ "  FC_VINCULADO_NOM_GUERR(PV.CTL_REMET) AS ORIGEM , " 
			+ "  FC_VINCULADO_NOM_GUERR(PV.CTL_DESTI) AS DESTINO " 
			+ " FROM " 
			+ "  PLANO_VIAGEM PV ," 
			+ "  INF_VEICU_PLANO_VIAGEM VPV , "
			+ "  TIPO_OPERACAO T , " 
			+ "  V_CRP_VEICULO V , " 
			+ "  SITUACAO_PLANO_VIAGEM SPV " 
			+ " WHERE 1 = 1 " 
			+ " AND PV.CTL_PLVIA = ? " 
			+ " AND  PV.CTL_PLVIA = VPV.CTL_PLVIA " 
			+ " AND PV.SIT_PLVIA         = SPV.SIT_PLVIA " 
			+ " AND PV.SIT_PLVIA        IN (0, 1) " 
			+ " AND PV.CTL_OPERA_TIP     = T.CTL_OPERA_TIP " 
			+ " AND VPV.CTL_VEICU        = V.CTL_VEICU " 
			+ " AND V.NUM_CATEG_VEI NOT IN (3) " 
			+ " AND DHR_POSIC_PRM       IS NOT NULL";

	
	
	@Autowired
	private OracleDataSourceConfig oracleDataSource;

	@PostConstruct
	private void initialize() {
		setDataSource(oracleDataSource.oracleJndiDataSource());
	}

	List<ViagemModel> lstViagens=null;
	
	@Override
	public List<ViagemModel> getViagemTransitoOrigem() {
		lstViagens = new ArrayList<>();
		
		try{
			LOGGER.info("SQL-> " + SQL_BUSCAR_VIAGENS_ATIVA + FROM_VIAGENS_ATIVA_TRANSITO_ORIGEM);
			lstViagens = getJdbcTemplate().query(SQL_BUSCAR_VIAGENS_ATIVA + FROM_VIAGENS_ATIVA_TRANSITO_ORIGEM, new ViagemMapper()); 
												
			getJdbcTemplate().getDataSource().getConnection().close();		
			
		
		}catch(EmptyResultDataAccessException e) {
			LOGGER.info("Sistema não encontrou informações no banco de dados!");
			LOGGER.info("=> " + e);
			return null;

		}catch(SQLException e){
			throw new ViagemException("Erro na execução! " + SQL_BUSCAR_VIAGENS_ATIVA + FROM_VIAGENS_ATIVA_TRANSITO_ORIGEM +" Causa do Erro -> ",e);
			
		}
		
		
		return lstViagens;
		
	}

	@Override
	public List<ViagemModel> getViagemTransitoDestino() {
		lstViagens = new ArrayList<>();		
		try{
			LOGGER.info("SQL-> " + SQL_BUSCAR_VIAGENS_ATIVA + FROM_VIAGENS_ATIVATRANSITO_DESTINO);
			lstViagens = getJdbcTemplate().query(SQL_BUSCAR_VIAGENS_ATIVA + FROM_VIAGENS_ATIVATRANSITO_DESTINO, new ViagemMapper()); 
												
			getJdbcTemplate().getDataSource().getConnection().close();		
			
		
		}catch(EmptyResultDataAccessException e) {
			LOGGER.info("Sistema não encontrou informações no banco de dados!");
			LOGGER.info("=> " + e);
			return null;

		}catch(SQLException e){
			throw new ViagemException("Erro na execução! " + SQL_BUSCAR_VIAGENS_ATIVA + FROM_VIAGENS_ATIVATRANSITO_DESTINO +" Causa do Erro -> ",e);
			
		}

		return lstViagens;
		
	}

	@Override
	public List<ViagemModel> getViagensAtiva() {
		lstViagens = new ArrayList<>();		
		try{
			LOGGER.info("SQL-> " + SQL_BUSCAR_VIAGENS_ATIVA + FROM_VIAGENS_ATIVA);
			lstViagens = getJdbcTemplate().query(SQL_BUSCAR_VIAGENS_ATIVA + FROM_VIAGENS_ATIVA, new ViagemMapper()); 
												
			getJdbcTemplate().getDataSource().getConnection().close();		
			
		
		}catch(EmptyResultDataAccessException e) {
			LOGGER.info("Sistema não encontrou informações no banco de dados!");
			LOGGER.info("=> " + e);
			return null;

		}catch(SQLException e){
			throw new ViagemException("Erro na execução! " + SQL_BUSCAR_VIAGENS_ATIVA + FROM_VIAGENS_ATIVA +" Causa do Erro -> ",e);
			
		}

		return lstViagens;
		
	}

	
	public ViagemDetalheModel getDetalhePorViagem(long ctlPlvia) {
		ViagemDetalheModel oViagemDetalheModel = new ViagemDetalheModel();
		try{
			LOGGER.info("SQL-> " + SQL_BUSCA_DETALHE_VIAGEM);
			oViagemDetalheModel = getJdbcTemplate().queryForObject(SQL_BUSCA_DETALHE_VIAGEM, new Object[] {ctlPlvia}, new ViagemDetalheMapper()); 
												
			getJdbcTemplate().getDataSource().getConnection().close();		
			
		
		}catch(EmptyResultDataAccessException e) {
			LOGGER.info("Sistema não encontrou informações no banco de dados!");
			LOGGER.info("=> " + e);
			return null;

		}catch(SQLException e){
			throw new ViagemException("Erro na execução! " + SQL_BUSCA_DETALHE_VIAGEM +" Causa do Erro -> ",e);
			
		}
		
		
		return oViagemDetalheModel;
	}

}
