function doLoad() {
	setTimeout("refresh()", 90 * 1000);
}

function refresh() {

	var desativarAtualizacao = document
			.getElementById("chkDesativarAtualizacaoAutomatica");

	if (desativarAtualizacao.checked) {
		//console.log("desativarAtualizacao: " + desativarAtualizacao.checked);
		doLoad();

	} else {
		//console.log("desativarAtualizacao: " + desativarAtualizacao.checked);
		//console.log("Tecnologia ->" + tecnologia);

		var tecnologia = $("#findTecnologia").val().toUpperCase().trim();
		var url = "../monitor/?tecnologia=";
		
		if ((tecnologia != null) && (tecnologia.trim() != "")) {
			var urlComplemento = tecnologia;

			//console.log("url + complemento -> " + url+urlComplemento);
			window.location = url + urlComplemento;

		} else {
			//console.log("URL ->" + url);
			window.location = url;

		}

	}

}

function atualizarIndicador() {
	var chkExibir = document.getElementById('chkExibirIndicadores');
	var displayIndicadores = document.getElementById('indicadores')
	if (sessionStorage.persistIndicador === 'true') {
		//console.log('clicking');
		chkExibir.click();
		displayIndicadores.style.display = 'block';
	} else {
		displayIndicadores.style.display = 'none';

	}
	//console.log("atualizarIndicador() sessionStorage.persistIndicador " + sessionStorage.persistIndicador);

}

function er_replace(pattern, replacement, subject) {
	return subject.replace(pattern, replacement);
}

/**@ Função que executa alerta sonoro, PAUSE se chk == TRUE e PLAY se chk == FALSE 
 */
function alertaSonoro() {
	var chkAlertaSonoro = document.getElementById('chkDesativarAlertaSonoro');
	var tocarAlertaSonoro = document.getElementById('alertaSonoro');
	if (sessionStorage.persistAlertaSonoro === 'true') {
		//console.log('clicking');
		chkDesativarAlertaSonoro.click();
		tocarAlertaSonoro.pause();
	} else {
		tocarAlertaSonoro.play();

	}
	//console.log("AlertaSonoro() sessionStorage.persistAlertaSonoro " + sessionStorage.persistAlertaSonoro);

}

function closeCurrentWindow() {
	window.close();
}

/**@ Função JQuery para armazenar sessionStorage referente ao estado do alerta sonoro  
 */

$(document)
		.ready(
				function() {
					$("#chkDesativarAlertaSonoro")
							.click(
									function() {
										var checado = $(
												"#chkDesativarAlertaSonoro")
												.is(":checked")
										if (checado) {
											document
													.getElementById("chkDesativarAlertaSonoro").checked = true;
											
											$("#tituloAlertaSonoro").html("Ativar Alerta Sonoro");
											sessionStorage.persistAlertaSonoro = true;

										} else {
											document
													.getElementById("chkDesativarAlertaSonoro").checked = false;
											$("#tituloAlertaSonoro").html("Desativar Alerta Sonoro");
											sessionStorage.persistAlertaSonoro = false;

										}
									});
				});

/**@ Função JQuery para pesquisar na tabela de Tecnologias  
 */

//$(function() {
//	$('input#findTecnologia').quicksearch(
//			'table#tableHeadTeconologias tbody tr');

//});

/**@ Função JQuery para exibir os Indicadores  
 */

$(document).ready(function() {
	$("#chkExibirIndicadores").click(function() {
		var checado = $("#chkExibirIndicadores").is(":checked")
		if (checado) {
			document.getElementById("chkExibirIndicadores").checked = true;
			$("#tituloIndicadores").html("Não Exibir Indicadores");
			sessionStorage.persistIndicador = true;
			$("#indicadores").show();
			
			
			

		} else {
			document.getElementById("chkExibirIndicadores").checked = false;
			$("#tituloIndicadores").html("Exibir Indicadores");
			sessionStorage.persistIndicador = false;
			$("#indicadores").hide();
			

		}
	});
});


$(document).ready(function() {
	$("#chkExibirIntegracaoTelerisco").click(function() {
		var checado = $("#chkExibirIntegracaoTelerisco").is(":checked")
		if (checado) {
			document.getElementById("chkExibirIntegracaoTelerisco").checked = true;
			$("#tituloIntegracaoTelerisco").html("Não Exibir Integra&#xE7;&#xE3;o Telerisco");
			sessionStorage.persistIntegracaoTelerisco = true;
			$("#exibeIntegracaoTelerisco").show();
			//console.log(" Exibe Integração Telerisco");
			
			

		} else {
			document.getElementById("chkExibirIntegracaoTelerisco").checked = false;
			$("#tituloIntegracaoTelerisco").html("Exibir Integra&#xE7;&#xE3;o Telerisco");
			sessionStorage.persistIntegracaoTelerisco = false;
			$("#exibeIntegracaoTelerisco").hide();
			//console.log(" Esconde Integração Telerisco");

		}
	});
});


function atualizarIntegracaoTelerisco() {
	var chkExibirIntegracaoTelerisco = document.getElementById('chkExibirIntegracaoTelerisco');
	var displayIntegracaoTelerisco = document.getElementById('exibeIntegracaoTelerisco')
	if (sessionStorage.persistIntegracaoTelerisco === 'true') {
		//console.log('clicking');
		chkExibirIntegracaoTelerisco.click();
		displayIntegracaoTelerisco.style.display = 'block';
	} else {
		displayIntegracaoTelerisco.style.display = 'none';

	}
	//console.log("atualizarIntegracaoTelerisco() sessionStorage.persistIntegracaoTelerisco " + sessionStorage.persistIntegracaoTelerisco);

}


$(document).ready(function(){
	$("#chkDesativarAtualizacaoAutomatica").click(function(){
		var checado = $("#chkDesativarAtualizacaoAutomatica").is(":checked")
		if(checado){
			document.getElementById("chkDesativarAtualizacaoAutomatica").checked = true;
			$("#tituloAtualizacaoAutomatica").html("Ativar Atualiza&#xE7;&#xE3;o autom&#xe1;tica");			
		}else{
			document.getElementById("chkDesativarAtualizacaoAutomatica").checked = false;
			$("#tituloAtualizacaoAutomatica").html("Desativar Atualiza&#xE7;&#xE3;o autom&#xe1;tica");
		}

		//console.log(" Checado = " + checado);
	})
})

