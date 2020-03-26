package br.com.pamcary.infolog.radarveiculosviagem.util;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import br.com.pamcary.infolog.radarveiculosviagem.dao.model.ReferenciaModel;
import br.com.pamcary.infolog.radarveiculosviagem.dao.model.ViagemModel;

public class Util {

	private static Util instance = null;

	protected Util() {

	}

	public static Util getInstance() {
		if (instance == null) {
			instance = new Util();
		}
		return instance;

	}

	public long calcularTempoExecucaoEmSegundos(long tempoIncial, long tempoFinal) {

		if (tempoFinal > tempoIncial) {
			return Math.round(tempoFinal - tempoIncial) / 1000;

		}
		return 0;
	}

	public String fomatarDataHoraPadraoInfolog(String dataForaDoPadrao) {
		DateTimeFormatter format = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
		LocalDateTime dataFormatada = LocalDateTime.parse(dataForaDoPadrao);

		return dataFormatada.format(format);

	}

	public String fomatarHoraPadraoInfolog(String horaForaDoPadrao) {
		DateTimeFormatter format = DateTimeFormatter.ofPattern("HH:mm");
		LocalTime horaFormatada = LocalTime.parse(horaForaDoPadrao);

		return horaFormatada.format(format);

	}

	public String adicionarToleranciaNaData(String data, String tolerancia) {
		DateTimeFormatter format = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
		LocalDateTime dataFormatada = null;

		if ((data != null) && (!data.trim().equals(""))) {
			dataFormatada = LocalDateTime.parse(data, format);

		} else {
			return null;

		}

		if ((tolerancia == null) || (tolerancia.trim().equals(""))) {
			tolerancia = "00:00:00";

		}

		LocalTime horaFormatada = LocalTime.parse(tolerancia);

		return dataFormatada.plusHours(horaFormatada.getHour()).plusMinutes(horaFormatada.getMinute())
				.plusSeconds(horaFormatada.getSecond()).format(format);
	}

	public boolean comparaDataUltProcETolerComDataSistema(String dataProcComToler, String dataServidor) {
		DateTimeFormatter format = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
		LocalDateTime data1, data2;

		data1 = LocalDateTime.parse(dataProcComToler, format);
		data2 = LocalDateTime.parse(dataServidor, format);

		return data1.isAfter(data2);
	}

	public static void main(String args[]) {
		/*
		 * String data = "04/01/2019 14:00:01"; String tolerancia = "00:15:01";
		 * 
		 * String dataPlusTolerancia =
		 * Util.getInstance().adicionarToleranciaNaData(data, tolerancia);
		 * 
		 * System.out.println("\n data entrada " + data);
		 * System.out.println("\n tolerancia   " + tolerancia);
		 * System.out.println("\n data + tolerancia  " + dataPlusTolerancia);
		 * System.out.println("\n Atualização + Tolerancia > Servidor " +
		 * Util.getInstance().comparaDataUltProcETolerComDataSistema(dataPlusTolerancia,
		 * "04/01/2019 18:16:01"));
		 */

		ViagemModel o1 = new ViagemModel();
		o1.setCtlPlvia(1);
		o1.setDesPosicUlt("Rua A");
		o1.setDhrPosicUlt("02/02/2020");
		o1.setNumLatit(-10.2);
		o1.setNumLongi(-20.1);
		o1.setPlaca("XXX0001");

		ViagemModel o2 = new ViagemModel();
		o2.setCtlPlvia(2);
		o2.setDesPosicUlt("Rua B");
		o2.setDhrPosicUlt("02/02/2020");
		o2.setNumLatit(-1.2);
		o2.setNumLongi(-2.1);
		o2.setPlaca("AAA0001");

		List<ViagemModel> lstViagem = new ArrayList<>();
		lstViagem.add(o1);
		lstViagem.add(o2);
		Util.getInstance().buscarElementoLista(lstViagem, new String[] {"numLatit","numLongi"});

		ReferenciaModel ref = new ReferenciaModel();
		ref.setCodAtivi(6);
		ref.setDesAtivi("Posto Abastecimento");
		ref.setCtlVincd(123);
		ref.setDesBairrEnd("Jd Frizzo");
		ref.setDesEnder("Rua Soldado Antonio Patrocinio Fernandes, 115");
		ref.setNomVincd("Posto Trevo");
		ref.setDesPraca("Sao Paulo");
		ref.setSigUf("SP");
		ref.setNumLatit(-33.4);
		ref.setNumLongi(-55.9);

		ReferenciaModel ref1 = new ReferenciaModel();
		ref1.setCodAtivi(8);
		ref1.setDesAtivi("Policia Rodoviaria Federal");
		ref1.setCtlVincd(987);
		ref1.setDesBairrEnd("Divino");
		ref1.setDesEnder("Rua Sobe desce e não aparece");
		ref1.setNomVincd("Base RJ");
		ref1.setDesPraca("Rio de Janeiro");
		ref1.setSigUf("RJ");
		ref1.setNumLatit(-55.4);
		ref1.setNumLongi(-66.9);

		List<ReferenciaModel> lstReferencias = new ArrayList<ReferenciaModel>();
		lstReferencias.add(ref);
		lstReferencias.add(ref1);

		System.out.println(Util.getInstance().buscarElementoLista(lstReferencias, new String[] {"numLatit","numLongi"}));

	}

	public Object buscarElementoLista(List<?> elements, String[] atributos) {
		Object ret = null;
		for (Object elemento : elements) {
			System.out.println(elemento.getClass().toString());
			try {
				Class<?> clazz = Class.forName(elemento.getClass().getName());
				System.out.println(elemento.toString());

				for (String atributo : atributos) {
					Field field = clazz.getDeclaredField(atributo);

					field.setAccessible(true);

					System.out.println(ret = (Object) field.get(elemento));
					
				}
				

			} catch (Exception e) {
				e.printStackTrace();
			}

		}
		return ret;

	}

	public Object buscarElemento(Object elemento, String atributo) {
		Object ret = null;
		try {
			Class<?> clazz = Class.forName(elemento.getClass().getName());
			Field field = clazz.getDeclaredField(atributo);
			field.setAccessible(true);
			ret = (Object) field.get(elemento);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ret;

	}

}