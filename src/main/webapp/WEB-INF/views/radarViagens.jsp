<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="true" %> 
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>RADAR</title>
</head>
<body>
	<div id="header">
		<table cellspacing="0" cellpadding="0" width="100%" border="0">
			<tr>
				<td style="border-width: 0px; height: 57px; width: 220px"
					background="${pageContext.request.contextPath}/images/fundo.gif">
					<img
					src="${pageContext.request.contextPath}/images/logo_infolog_riscos.gif"
					style="width: 104px; height:37px; margin: 0 41px 0 41px;" />
				</td>
				<td style="border-width: 0px; text-align: center;"
					background="${pageContext.request.contextPath}/images/fundo.gif">
					<span class="titulo"
					style="color: #2D3866; text-transform: uppercase; font: bold 15px arial, verdana, sans-serif;">
						RADAR </span>
				</td>
				<td style="border-width: 0px; width: 220px; text-align: left;"
					background="${pageContext.request.contextPath}/images/fundo.gif">
<!-- 
					<c:if test="${sessionScope.usuarioLogado != null}">
						<ul class="nav navbar-top-links navbar-right">
						    <li class="dropdown">
						        <a class="dropdown-toggle" data-toggle="dropdown">
						            <i class="fa fa-user fa-fw"></i>  <i class="fa fa-caret-down"></i>
						        </a>
						        <ul class="dropdown-menu dropdown-user">
						            <li><a href="#">${sessionScope.nomVincd}</a>
						            </li>
						            <li><a href="#">${sessionScope.usrName}</a>
						            </li>
						            <li class="divider"></li>
                                    <li><a id="linkVoltar" href="/infolog/Perfil_acesso.asp"><i class="fa fa-arrow-left"></i> VOLTAR</a>
                                    <li><a id="linkSair" href="/infolog/Usuario.asp" ng-click="logout()"><i class="fa fa-sign-out"></i> SAIR</a>
						            </li>
						        </ul>
						        <!-- /.dropdown-user -->
						    </li>
						    <!-- /.dropdown -->
						</ul>
					</c:if>
-->					
				</td>
			</tr>
		</table>
	</div>
	<link rel="stylesheet" href="${pageContext.request.contextPath}/bootstrap/3.3.7/css/bootstrap.min.css" />
	<link rel="stylesheet" href="${pageContext.request.contextPath}/styles/style.css" />
	<link rel="stylesheet" href="${pageContext.request.contextPath}/styles/fontawesome/css/font-awesome.min.css" />
	<link rel="stylesheet" href="${pageContext.request.contextPath}/node_modules/openlayers/dist/ol-debug.css" type="text/css" />
	<link rel="stylesheet" href="${pageContext.request.contextPath}/node_modules/jquery-toast-plugin/dist/jquery.toast.min.css" type="text/css" />
	<link rel="icon" href="${pageContext.request.contextPath}/images/favicon.png" sizes="32x32" />
	<link rel="icon" href="${pageContext.request.contextPath}/images/favicon.png" sizes="192x192" />
	<link rel="apple-touch-icon-precomposed" href="${pageContext.request.contextPath}/images/img/favicon.png" />
	<meta name="msapplication-TileImage" content="${pageContext.request.contextPath}/images/favicon.png" />
	<meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimal-ui" />

<!-- 
	<input type="hidden" id="ctlOperaTipList" value="${sessionScope.ctlOperaTipList}"/>
	<input type="hidden" id="codUsuario" value="${sessionScope.codUsuario}"/>
	<input type="hidden" id="operaTipList" value="${sessionScope.operaTipList}"/>
-->
	
	<div id="map" class="map" tabindex="0">
	
		<div id="menu_aguarde" class="menu_aguarde">
           	<div width="100%">
               	<i class="fa fa-refresh fa-spin fa-4x fa-fw loading" style="position: inherit;"></i>
               </div>
               <div width="100%">
                   <h6>Por favor aguarde</h6>
               </div>
		</div>
		
		
		<div id="timer" class="timer" title="Tempo para atualizar as informações">
            <i class="fa fa-clock-o"></i> <span id="updateTime">5:00</span><br/>
	        <div id="icon">    
	            <img id="icon" src="${pageContext.request.contextPath}/images/icon_on.png" title="Desligar atualização automática" onclick="document.getElementById('icon_closed').style.display='block'; document.getElementById('icon').style.display='none'"/>
	        </div>
	        <div id="icon_closed" style="display: none">
	            <img id="icon_closed" src="${pageContext.request.contextPath}/images/icon_off.png" title="Ligar atualização automática" onclick="document.getElementById('icon').style.display='block'; document.getElementById('icon_closed').style.display='none'"/>
	        </div>
	        <span id="botao" style="display: none">on</span>
        </div>

		<div class="customLogo hide" id="customLogo"></div>
    	<div id="menu1_closed" class="resumo_closed" style="display: none">
    		<img src="${pageContext.request.contextPath}/images/exibir_menu.png" title="Exibir menu" onclick="document.getElementById('menu1').style.display='block'; document.getElementById('menu1_closed').style.display='none'"/>
    	</div>
        <div id="menu1" class="resumo" style="display: block">
        	<img src="${pageContext.request.contextPath}/images/esconder_menu.png" title="Esconder menu" onclick="document.getElementById('menu1').style.display='none'; document.getElementById('menu1_closed').style.display='block'"/>
        	<b>FILTROS</b><hr/>
<!--         		
        	<div>	        	
        		 <div>
        		 	<h6>
        		 	<b>Operação </b>
        		 	<br/>
        		 	<select id="operacao" name="comboOperacao">
					    <c:forEach items="${sessionScope.operaTipList}" var="operacao">
					        <option value="${operacao.key}">${operacao.key} - ${operacao.value}</option>
					    </c:forEach>
					</select>
					</h6>
        		 </div>
                
	             <div>
	              	<h6>
	               	<input type="radio" id="exibirPlanosAtivos" name="exibirPlanosAtivos" value="exibirPlanosAtivos" checked
	               	onchange="document.getElementById('menu_frota_dedicada').style.display='none'; document.getElementById('menu_planos_ativos').style.display='block'">
	               	<b>Planos de Viagem Ativos</b>
	               	</h6>
	             </div>
	                
	             <div id="menu_planos_ativos">
		            <div>
		            	<div id="menu_origem">
		            		<h6>
			            		<b>Origem </b><img src="${pageContext.request.contextPath}/app/assets/img/open_menu.png" title="Esconder menu origem" onclick="document.getElementById('menu_origem').style.display='none'; document.getElementById('menu_origem_closed').style.display='block'"/>
				            	<input type="text" placeholder="Buscar Origem" id="destinySearch" style="width: 90%"; /><span> </span><i class="fa fa-refresh fa-spin fa-1x loading hide"></i>
						        <ul class="autoComplete" id="autoComplete">
						        </ul>
						        <i class="glyphicon glyphicon-search" style="visibility: hidden;"></i>
						        
						        <select name="entidadesList" id="entidadesList" class="inputText" multiple="multiple" size="5" style="width: 90%">
						        </select>
						        <a class="btn select" id="selecionarTudoOrigem">selecionar tudo</a>
            					<a class="btn clean"id="limparTudoOrigem">limpar filtro</a>
						        
					        </h6>
					    </div>
					    <div id="menu_origem_closed" style="display: none">
					    	<h6>
			            		<b>Origem </b><img src="${pageContext.request.contextPath}/app/assets/img/closed_menu.png" title="Exibir menu origem" onclick="document.getElementById('menu_origem').style.display='block'; document.getElementById('menu_origem_closed').style.display='none'"/>
			            	</h6>	
				    	</div>
				        
				    </div>

					<br/>
					
					<div id="cheks">
						<div id="menu_situacao_planos">
		            		<h6>
			            		<b>Situação </b><img src="${pageContext.request.contextPath}/app/assets/img/open_menu.png" title="Esconder menu situação" onclick="document.getElementById('menu_situacao_planos').style.display='none'; document.getElementById('menu_situacao_planos_closed').style.display='block'"/>
			            		<br>
			            		<input type="checkbox" id="exibirEmTransito" name="exibirEmTransito" value="exibirEmTransito" checked>
			            		Em Transito [<span id="TRANSITO">0</span>]
			            		<br>
			            		<input type="checkbox" id="exibirEmCarga" name="exibirEmCarga" value="exibirEmCarga" checked>
			            		Na Origem [<span id="CARGA">0</span>]
			            		<br>
			            		<input type="checkbox" id="exibirEmDescarga" name="exibirEmDescarga" value="exibirEmDescarga" checked>
			            		No Destino [<span id="DESCARGA">0</span>]
		            		</h6>
	            		</div>
					    <div id="menu_situacao_planos_closed" style="display: none">
					    	<h6>
			            		<b>Situação </b><img src="${pageContext.request.contextPath}/app/assets/img/closed_menu.png" title="Exibir menu situação" onclick="document.getElementById('menu_situacao_planos').style.display='block'; document.getElementById('menu_situacao_planos_closed').style.display='none'"/>
			            	</h6>	
				    	</div>
	            	</div>
            	</div>
            	
            	<div>
	               	<h6>
	               	<input type="radio" id="exibirFrotaDedicada" name="exibirFrotaDedicada" value="exibirFrotaDedicada"
	               	onchange="document.getElementById('menu_planos_ativos').style.display='none'; document.getElementById('menu_frota_dedicada').style.display='block'">
	               	<b>Frota Dedicada</b> 
	               	</h6>
	            </div>
	            
	            <div id="menu_frota_dedicada" style="display: none">
		            <div>
		            	<div id="menu_entidade_vinculada">
		            		<h6>
			            		<b>Entidade Vinculada </b><img src="${pageContext.request.contextPath}/app/assets/img/open_menu.png" title="Esconder menu entidade vinculada" onclick="document.getElementById('menu_entidade_vinculada').style.display='none'; document.getElementById('menu_entidade_vinculada_closed').style.display='block'"/>
				            	<input type="text" placeholder="Buscar Entidade" id="entidadeSearch" style="width: 90%"; /><span> </span><i class="fa fa-refresh fa-spin fa-1x loading hide"></i>
						        <ul class="autoComplete2" id="autoComplete2">
						        </ul>
						        <i class="glyphicon glyphicon-search" style="visibility: hidden;"></i>
						        
						        <select name="vinculadoList" id="vinculadoList" class="inputText" multiple="multiple" size="5" style="width: 90%">
						        </select>
						        <a class="btn select" id="selecionarTudoVinculado">selecionar tudo</a>
            					<a class="btn clean"id="limparTudoVinculado">limpar filtro</a>
						        
					        </h6>
					    </div>
					    <div id="menu_entidade_vinculada_closed" style="display: none">
					    	<h6>
			            		<b>Entidade Vinculada </b><img src="${pageContext.request.contextPath}/app/assets/img/closed_menu.png" title="Exibir menu entidade vinculada" onclick="document.getElementById('menu_entidade_vinculada').style.display='block'; document.getElementById('menu_entidade_vinculada_closed').style.display='none'"/>
			            	</h6>	
				    	</div>
				        
				    </div>

					<br/>
					
					<div id="cheks">
						<div id="menu_situacao_frota">
		            		<h6>
			            		<b>Situação </b><img src="${pageContext.request.contextPath}/app/assets/img/open_menu.png" title="Esconder menu situação" onclick="document.getElementById('menu_situacao_frota').style.display='none'; document.getElementById('menu_situacao_frota_closed').style.display='block'"/>
			            		<br>
			            		<input type="checkbox" id="exibirEmUso" name="exibirEmUso" value="exibirEmUso">
			            		Em Uso [<span id="USO">0</span>]
			            		<br>
			            		<input type="checkbox" id="exibirVazio" name="exibirVazio" value="exibirVazio">
			            		Vazio [<span id="VAZIO">0</span>]
		            		</h6>
	            		</div>
					    <div id="menu_situacao_frota_closed" style="display: none">
					    	<h6>
			            		<b>Situação </b><img src="${pageContext.request.contextPath}/app/assets/img/closed_menu.png" title="Exibir menu situação" onclick="document.getElementById('menu_situacao_frota').style.display='block'; document.getElementById('menu_situacao_frota_closed').style.display='none'"/>
			            	</h6>	
				    	</div>
	            	</div>
            	</div>

            	
            	<div id="menu_monitoramento">
		            <div>
		            	<h6>
		            	<b>Dispositivo de Monitoramento </b><img src="${pageContext.request.contextPath}/app/assets/img/open_menu.png" title="Esconder menu monitoramento" onclick="document.getElementById('menu_monitoramento').style.display='none'; document.getElementById('menu_monitoramento_closed').style.display='block'"/>
		            	<br>
			            
			            <input type="checkbox" id="exibirRastreador" name="exibirRastreador" value="exibirRastreador" checked>
			            Rastreador
			            <br>
			            <input type="checkbox" id="exibirApp" name="exibirApp" value="exibirApp" checked>
			            App Infolog 
			            <br>
			            <input type="checkbox" id="exibirAppRastreador" name="exibirAppRastreador" value="exibirAppRastreador" checked>
			            App Infolog + Rastreador
		            	</h6>
	            	</div>
            	</div>
            	<div id="menu_monitoramento_closed" style="display: none">
			    	<div>
			    		<h6>
	            		<b>Dispositivo de Monitoramento </b><img src="${pageContext.request.contextPath}/app/assets/img/closed_menu.png" title="Exibir menu monitoramento" onclick="document.getElementById('menu_monitoramento').style.display='block'; document.getElementById('menu_monitoramento_closed').style.display='none'"/>
	            		</h6>
	            	</div>
		    	</div>
            </div>
            
            <div>
			<h6><a id="modalLegenda">Legenda</a></h6>
			</div>
        </div>
-->        
        <div id="popup"></div>
        
        <!-- Modal Legenda-->
		<div id="legenda" class="legenda" 
			onmousedown='mydragg.startMoving(this,"map",event);' onmouseup='mydragg.stopMoving("map");'>
	        <div class="titulo-legenda">
	          <b>LEGENDA</b>
	          <img id="abrirFecharLegenda" src="${pageContext.request.contextPath}/app/assets/img/fechar.png"
	           style="float: right; margin-top: 5px; margin-right: 20px; cursor: pointer;"/>
	        </div>
	        <div class="corpo-legenda">
	          	<div class="linha-div-legenda">
					<div class="coluna-imagem-legenda">
						<img src="${pageContext.request.contextPath}/app/assets/img/logistics-truck-carga-dedicado.png">
					</div>
					<div class="coluna-descricao-legenda">
						Veículo <b>Dedicado</b> na Origem.		
					</div>
				</div>
				<div class="linha-div-legenda">
					<div class="coluna-imagem-legenda">
						<img src="${pageContext.request.contextPath}/app/assets/img/delivery-truck-transito-dedicado.png">
					</div>
					<div class="coluna-descricao-legenda">
						Veículo <b>Dedicado</b> em Trânsito.		
					</div>
				</div>
				<div class="linha-div-legenda">
					<div class="coluna-imagem-legenda">
						<img src="${pageContext.request.contextPath}/app/assets/img/logistics-truck-descarga-dedicado.png">
					</div>
					<div class="coluna-descricao-legenda">
						Veículo <b>Dedicado</b> no Destino.		
					</div>
				</div>
				<div class="linha-div-legenda">
					<div class="coluna-imagem-legenda">
						<img src="${pageContext.request.contextPath}/app/assets/img/delivery-truck-vazio-dedicado_menor24.png">
					</div>
					<div class="coluna-descricao-legenda">
						Veículo <b>Dedicado</b> Vazio.		
					</div>
				</div>
				<div class="linha-div-legenda">
					<div class="coluna-imagem-legenda">
						<img src="${pageContext.request.contextPath}/app/assets/img/delivery-truck-vazio-dedicado_maior24_legenda.png">
					</div>
					<div class="coluna-descricao-legenda">
						Veículo <b>Dedicado</b> Vazio sem sinal a mais de 24 horas.	
					</div>
				</div>
				<div class="linha-div-legenda">
					<div class="coluna-imagem-legenda">
						<img src="${pageContext.request.contextPath}/app/assets/img/logistics-truck-carga.png">
					</div>
					<div class="coluna-descricao-legenda">
						Veículo <b>Contratado</b> na Origem.
					</div>
				</div>
				<div class="linha-div-legenda">
					<div class="coluna-imagem-legenda">
						<img src="${pageContext.request.contextPath}/app/assets/img/delivery-truck-transito.png">
					</div>
					<div class="coluna-descricao-legenda">
						Veículo <b>Contratado</b> em Trânsito.
					</div>
				</div>
				<div class="linha-div-legenda">
					<div class="coluna-imagem-legenda">
						<img src="${pageContext.request.contextPath}/app/assets/img/logistics-truck-descarga.png">
					</div>
					<div class="coluna-descricao-legenda">
						Veículo <b>Contratado</b> no Destino.
					</div>
				</div>
				<div class="linha-div-legenda">
					<div class="coluna-imagem-legenda">
						<img src="${pageContext.request.contextPath}/app/assets/img/rastreador.png">
					</div>
					<div class="coluna-descricao-legenda">
						Rastreador com sinal.
					</div>
				</div>
				<div class="linha-div-legenda">
					<div class="coluna-imagem-legenda">
						<img src="${pageContext.request.contextPath}/app/assets/img/rastreador-perda-sinal.png">
					</div>
					<div class="coluna-descricao-legenda">
						Rastreador perda sinal.
					</div>
				</div>
				<div class="linha-div-legenda">
					<div class="coluna-imagem-legenda">
						<img src="${pageContext.request.contextPath}/app/assets/img/app-infolog-mini.png">
					</div>
					<div class="coluna-descricao-legenda">
						App Infolog com sinal.
					</div>
				</div>
				<div class="linha-div-legenda">
					<div class="coluna-imagem-legenda">
						<img src="${pageContext.request.contextPath}/app/assets/img/app-infolog-mini-perda-sinal.png">
					</div>
					<div class="coluna-descricao-legenda">
						App Infolog perda sinal.
					</div>
				</div>
				<div class="linha-div-legenda">
					<div class="coluna-imagem-legenda">
						<img src="${pageContext.request.contextPath}/app/assets/img/rastreador.png">+<img src="${pageContext.request.contextPath}/app/assets/img/app-infolog-mini.png">
					</div>
					<div class="coluna-descricao-legenda">
						Rastreador e App Infolog com sinal.
					</div>
				</div>
				<div class="linha-div-legenda">
					<div class="coluna-imagem-legenda">
						<img src="${pageContext.request.contextPath}/app/assets/img/rastreador.png">+<img src="${pageContext.request.contextPath}/app/assets/img/app-infolog-mini-perda-sinal.png">
					</div>
					<div class="coluna-descricao-legenda">
						Rastreador com sinal e App Infolog perda Sinal.
					</div>
				</div>
				<div class="linha-div-legenda">
					<div class="coluna-imagem-legenda">
						<img src="${pageContext.request.contextPath}/app/assets/img/rastreador-perda-sinal.png">+<img src="${pageContext.request.contextPath}/app/assets/img/app-infolog-mini.png">
					</div>
					<div class="coluna-descricao-legenda">
						Rastreador perda sinal e App Infolog com sinal.
					</div>
				</div>
				<div class="linha-div-legenda">
					<div class="coluna-imagem-legenda">
						<img src="${pageContext.request.contextPath}/app/assets/img/rastreador-perda-sinal.png">+<img src="${pageContext.request.contextPath}/app/assets/img/app-infolog-mini-perda-sinal.png">
					</div>
					<div class="coluna-descricao-legenda">
						Rastreador e App Infolog perda sinal.
					</div>
				</div>
				<div class="linha-div-legenda">
					<div class="coluna-imagem-legenda">
						<img src="${pageContext.request.contextPath}/app/assets/img/rastreador-sem-sinal-mini.png">
					</div>
					<div class="coluna-descricao-legenda">
						Rastreador sem sinal.
					</div>
				</div>
				<div class="linha-div-legenda">
					<div class="coluna-imagem-legenda">
						<img src="${pageContext.request.contextPath}/app/assets/img/entidade_dedicada.png">
					</div>
					<div class="coluna-descricao-legenda">
						Entidade contendo veículos vazios.
					</div>
				</div>
				<div class="linha-div-legenda">
					<div class="coluna-imagem-legenda">
						<img src="${pageContext.request.contextPath}/app/assets/img/entidade_origem.png">
					</div>
					<div class="coluna-descricao-legenda">
						Entidade contendo veículos na origem.
					</div>
				</div>
				<span id="TITULO"></span>
			</div>
	      </div>
    </div>
    
	
	<script src="${pageContext.request.contextPath}/jquery/3.2.1/jquery-3.2.1.min.js" type="text/javascript"></script>
	<script src="${pageContext.request.contextPath}/bootstrap/3.3.7/js/bootstrap.min.js" type="text/javascript"></script>
	<script src="${pageContext.request.contextPath}/node_modules/jquery-toast-plugin/dist/jquery.toast.min.js" type="text/javascript"></script>
	<script src="${pageContext.request.contextPath}/js/mapActions.js" type="text/javascript"></script>
	
<!-- 	
	<script>
	   var map = document.getElementById('map');
	   map.style.setProperty('height', window.innerHeight - 57 + 'px');
	   if($('#ctlOperaTipList').val() == 321 || $('#ctlOperaTipList').val() == 334) {
           $('#customLogo').removeClass('hide');
           $('.ypeOnly').removeClass('hide');
       } else {
           $('#customLogo').addClass('hide');
           $('.ypeOnly').addClass('hide');
       }
	</script>
-->	
	<script>
        var mydragg = function(){
            return {
                move : function(divid,xpos,ypos){
                    divid.style.left = xpos + 'px';
                    divid.style.top = ypos + 'px';
                },
                startMoving : function(divid,map,evt){
                    evt = evt || window.event;
                    var posX = evt.clientX,
                        posY = evt.clientY,
                    divTop = divid.style.top,
                    divLeft = divid.style.left,
                    eWi = parseInt(divid.style.width),
                    eHe = parseInt(divid.style.height),
                    cWi = parseInt(document.getElementById(map).style.width),
                    cHe = parseInt(document.getElementById(map).style.height);
                    document.getElementById(map).style.cursor='move';
                    divTop = divTop.replace('px','');
                    divLeft = divLeft.replace('px','');
                    var diffX = posX - divLeft,
                        diffY = posY - divTop;
                    document.onmousemove = function(evt){
                        evt = evt || window.event;
                        var posX = evt.clientX,
                            posY = evt.clientY,
                            aX = posX - diffX,
                            aY = posY - diffY;
                            if (aX < 0) aX = 0;
                            if (aY < 0) aY = 0;
                            if (aX + eWi > cWi) aX = cWi - eWi;
                            if (aY + eHe > cHe) aY = cHe -eHe;
                        mydragg.move(divid,aX,aY);
                    }
                },
                stopMoving : function(map){
                    var a = document.createElement('script');
                    document.getElementById(map).style.cursor='default';
                    document.onmousemove = function(){}
                },
            }
        }();

    </script>
	<script src="${pageContext.request.contextPath}/node_modules/openlayers/dist/ol-debug.js" type="text/javascript"></script>
	<script src="${pageContext.request.contextPath}/js/criaMapa.js" type="text/javascript"></script>
	<script src="${pageContext.request.contextPath}/map/map.js" type="text/javascript"></script>
	

</body>
</html>