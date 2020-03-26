package br.com.pamcary.infolog.radarveiculosviagem.dao.config;


import javax.naming.NamingException;
import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jndi.JndiObjectFactoryBean;

import br.com.pamcary.infolog.radarveiculosviagem.exception.ViagemException;

@Configuration
public class OracleDataSourceConfig {

	private static Logger LOGGER = LoggerFactory.getLogger(OracleDataSourceConfig.class);

	/*
	@Bean
	@Primary
	@ConfigurationProperties(prefix = "spring.datasource.jndi-name")
>>>>>>> Mudança arquitetural: implementação de conexão com BD via JNDI e retirada das propriedades de conexão de dentro da aplicação
	public DataSourceProperties oracleDataSourceProperties() {
		return new DataSourceProperties();
	}

<<<<<<< HEAD
	@Bean
	@Primary
	@ConfigurationProperties(prefix = "spring.oracle.datasource.configuration")
	public HikariDataSource oracleDataSource() {
		return (HikariDataSource) oracleDataSourceProperties().initializeDataSourceBuilder()
				.type(HikariDataSource.class).build();
=======
	 * @Bean
	 * 
	 * @Primary
	 * 
	 * @ConfigurationProperties(prefix = "spring.oracle.datasource.configuration")
	 * public HikariDataSource oracleDataSource() { return (HikariDataSource)
	 * oracleDataSourceProperties().initializeDataSourceBuilder()
	 * .type(HikariDataSource.class).build(); }
	 */
	
	@Value("${spring.datasource.jndi-name}")
	private String oracleJndiConfig;
	
	@Bean
	public DataSource oracleJndiDataSource() {
		JndiObjectFactoryBean bean = new JndiObjectFactoryBean(); // create JNDI data source
		bean.setJndiName(oracleJndiConfig); // jndiDataSource is name of JNDI data source
		bean.setProxyInterface(DataSource.class);
		bean.setLookupOnStartup(false);
		try {
			bean.afterPropertiesSet();
		} catch (IllegalArgumentException e) {
			LOGGER.error("Erro de conexão com banco de dados! " + e);
			throw new ViagemException(
					"Erro de conexão com Banco de Dados! Causa do Erro -> " + e);
			
		} catch (NamingException e) {
			LOGGER.error("Erro de conexão com banco de dados! " + e);
			throw new ViagemException(
					"Erro de conexão com Banco de Dados! Causa do Erro -> " + e);
		}
		return (DataSource) bean.getObject();
	}
}
