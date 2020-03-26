package br.com.pamcary.infolog.radarveiculosviagem.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import br.com.pamcary.infolog.radarveiculosviagem.service.RadarViagensTorreControleService;
import br.com.pamcary.infolog.radarveiculosviagem.util.Util;

@Controller
@RequestMapping("/")
public class RadarViagensTorreControleController {

	private long initProcess = 0;
	private long endProcess = 0;

	private static final Logger LOGGER = LoggerFactory.getLogger(RadarViagensTorreControleController.class);

	@Autowired
	private RadarViagensTorreControleService oRadarVeiculosViagemService;

	@SuppressWarnings("finally")
	@RequestMapping(value = "/")
	public @ResponseBody ModelAndView buscarVeiculosViagemAtiva() {
		ModelAndView oModelAndView = new ModelAndView();
		try {
			initProcess = System.currentTimeMillis();
			LOGGER.info("Iniciou execução do controller RadarViagensTorreControleService ");

			oModelAndView.addObject("veiculosViagemAtiva", oRadarVeiculosViagemService.buscarVeiculosViagemAtiva());
			oModelAndView.setViewName("radarveiculosviagemativa");

			endProcess = Util.getInstance().calcularTempoExecucaoEmSegundos(initProcess, System.currentTimeMillis());
			LOGGER.info("Finalizou execução do controller RadarViagensTorreControleService -> " + endProcess
					+ " segundos!");

		} catch (Exception e) {
			LOGGER.error("Erro de execução no metodo getVeiculosViagemAtiva -> ");
			LOGGER.error("Causa do Erro ->" + e);
			e.printStackTrace();
			oModelAndView.setViewName("radarveiculosviagemativaerro");

		} finally {
			return oModelAndView;

		}

	}

	@RequestMapping("/hi")
	public @ResponseBody String hiThere() {
		return "Teste de Conectividade!";
	}

}