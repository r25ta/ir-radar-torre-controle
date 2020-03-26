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

import br.com.pamcary.infolog.radarveiculosviagem.dao.ReferenciaDAO;
import br.com.pamcary.infolog.radarveiculosviagem.dao.config.OracleDataSourceConfig;
import br.com.pamcary.infolog.radarveiculosviagem.dao.mapper.ReferenciaMapper;
import br.com.pamcary.infolog.radarveiculosviagem.dao.model.ReferenciaModel;
import br.com.pamcary.infolog.radarveiculosviagem.exception.ViagemException;

@Repository

public class ReferenciaDAOImpl extends JdbcDaoSupport implements ReferenciaDAO {
	private static final Logger LOGGER = LoggerFactory.getLogger(ReferenciaDAOImpl.class);

	private static final String SQL_BUSCAR_REFERENCIA = " select AT.COD_ATIVI "
								+ " ,AT.DES_ATIVI " 
								+ " ,VC.CTL_VINCD " 
								+ " ,FC_VINCULADO_NOM_GUERR(VC.CTL_VINCD) AS NOM_VINCD "
								+ " ,EV.NUM_LATIT " 
								+ " ,EV.NUM_LONGI " 
								+ " ,NVL(EV.DES_ENDER,' NAO INFORMADO ') || NVL(EV.DES_NUMER_END,' S/N ') AS DES_ENDER "
								+ " ,NVL(EV.DES_BAIRR_END,' NÃO INFORMADO ') AS DES_BAIRR_END " 
								+ " ,PR.DES_PRACA AS PRACA " 
								+ " ,UF.SIG_UNFED AS UF " 
								+ " from vinculado VC, " 
								+ " ATIVIDADE AT, " 
								+ " ENDERECO_VINCULADO EV, " 
								+ " UNIDADE_FEDERAL UF, " 
								+ " PRACA PR " 
								+ " WHERE 1=1 " 
								+ " AND AT.COD_ATIVI = VC.COD_ATIVI " 
								+ " AND VC.CTL_VINCD = EV.CTL_VINCD " 
								+ " AND PR.COD_PRACA = EV.COD_PRACA " 
								+ " AND UF.COD_UNFED = PR.COD_UNFED ";
	
	private static final String WHERE_POSTO_ABASTECIMENTO = "AND VC.cod_ativi IN ( 7,28,29,30) ";
	private static final String WHERE_POSTO_POLICIA = "AND VC.cod_ativi IN (9,10) ";
	private static final String WHERE_POSTO_PAMCARY = "AND VC.cod_ativi IN (11,13)";
	private static final String WHERE_POSTO_FISCALIZACAO = "AND VC.cod_ativi = 16";
	
	@Autowired
	private OracleDataSourceConfig oracleDataSource;

	@PostConstruct
	private void initialize() {
		setDataSource(oracleDataSource.oracleJndiDataSource());
	}

	List<ReferenciaModel> lstReferencias = null;
	
	@Override
	public List<ReferenciaModel> getAllPostosAbastecimento() {
		lstReferencias = new ArrayList<>();		
		try{
			LOGGER.info("SQL-> " + SQL_BUSCAR_REFERENCIA + WHERE_POSTO_ABASTECIMENTO);
			lstReferencias = getJdbcTemplate().query(SQL_BUSCAR_REFERENCIA + WHERE_POSTO_ABASTECIMENTO, new ReferenciaMapper()); 
												
			getJdbcTemplate().getDataSource().getConnection().close();		
			
		
		}catch(EmptyResultDataAccessException e) {
			LOGGER.info("Sistema não encontrou informações no banco de dados!");
			LOGGER.info("=> " + e);
			return null;

		}catch(SQLException e){
			throw new ViagemException("Erro na execução! " + SQL_BUSCAR_REFERENCIA + WHERE_POSTO_ABASTECIMENTO +" Causa do Erro -> ",e);
			
		}

		return lstReferencias;
	}

	@Override
	public List<ReferenciaModel> getAllPoliciaRodoviaria() {
		lstReferencias = new ArrayList<>();		
		try{
			LOGGER.info("SQL-> " + SQL_BUSCAR_REFERENCIA + WHERE_POSTO_POLICIA);
			lstReferencias = getJdbcTemplate().query(SQL_BUSCAR_REFERENCIA + WHERE_POSTO_POLICIA, new ReferenciaMapper()); 
												
			getJdbcTemplate().getDataSource().getConnection().close();		
			
		
		}catch(EmptyResultDataAccessException e) {
			LOGGER.info("Sistema não encontrou informações no banco de dados!");
			LOGGER.info("=> " + e);
			return null;

		}catch(SQLException e){
			throw new ViagemException("Erro na execução! " + SQL_BUSCAR_REFERENCIA + WHERE_POSTO_POLICIA +" Causa do Erro -> ",e);
			
		}

		return lstReferencias;
	}

	@Override
	public List<ReferenciaModel> getAllPostoPamcary() {
		lstReferencias = new ArrayList<>();		
		try{
			LOGGER.info("SQL-> " + SQL_BUSCAR_REFERENCIA + WHERE_POSTO_PAMCARY);
			lstReferencias = getJdbcTemplate().query(SQL_BUSCAR_REFERENCIA + WHERE_POSTO_PAMCARY, new ReferenciaMapper()); 
												
			getJdbcTemplate().getDataSource().getConnection().close();		
			
		
		}catch(EmptyResultDataAccessException e) {
			LOGGER.info("Sistema não encontrou informações no banco de dados!");
			LOGGER.info("=> " + e);
			return null;

		}catch(SQLException e){
			throw new ViagemException("Erro na execução! " + SQL_BUSCAR_REFERENCIA + WHERE_POSTO_PAMCARY +" Causa do Erro -> ",e);
			
		}

		return lstReferencias;
	}

	@Override
	public List<ReferenciaModel> getAllPostoFiscalizacaoFazendaria() {
		lstReferencias = new ArrayList<>();		
		try{
			LOGGER.info("SQL-> " + SQL_BUSCAR_REFERENCIA + WHERE_POSTO_FISCALIZACAO);
			lstReferencias = getJdbcTemplate().query(SQL_BUSCAR_REFERENCIA + WHERE_POSTO_FISCALIZACAO, new ReferenciaMapper()); 
												
			getJdbcTemplate().getDataSource().getConnection().close();		
			
		
		}catch(EmptyResultDataAccessException e) {
			LOGGER.info("Sistema não encontrou informações no banco de dados!");
			LOGGER.info("=> " + e);
			return null;

		}catch(SQLException e){
			throw new ViagemException("Erro na execução! " + SQL_BUSCAR_REFERENCIA + WHERE_POSTO_FISCALIZACAO +" Causa do Erro -> ",e);
			
		}

		return lstReferencias;
	}

}
