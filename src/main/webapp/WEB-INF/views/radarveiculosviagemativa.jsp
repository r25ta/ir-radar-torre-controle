<%@ page language="java" contentType="text/html; charset=UTF8"
	pageEncoding="UTF8"  
	session="false"  %>
	
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="pt">
<head>
<!-- 
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<meta charset="utf-8">
-->

<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
<title>Monitor de Tecnologias Integradas</title>
<meta name="generator" content="Bootply" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
 
<link  rel="stylesheet" href="<c:url value="/resources/bootstrap/3.3.7/css/bootstrap.min.css"/>">

<script src="<c:url value="/resources/jquery/2.2.4/jquery-2.2.4.min.js"/>"></script>
<script src="<c:url value="/resources/bootstrap/3.3.7/js/bootstrap.min.js"/>"></script>
<script src="<c:url value="/resources/jquery/jquery.quicksearch.min.js"/>"></script>
<script src="<c:url value="/resources/js/monitortecnologia.js"/>"></script>

<!-- Leaflet map -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
      integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
      crossorigin=""/>

    <script src="https://unpkg.com/jquery@3.4.1/dist/jquery.min.js"
      integrity="sha384-vk5WoKIaW/vJyUAd9n/wmopsmNhiy+L2Z+SBxGYnUkunIxVxAv/UtMOhba/xskxh"
      crossorigin=""></script>
    <script src="https://unpkg.com/leaflet@1.5.1/dist/leaflet.js"
      integrity="sha512-GffPMF3RvMeYyc1LWMHtK8EbPv0iNZ8/oTtHPx9/cc2ILxQ+u905qIwdpULaqDkyBKgOaB57QTMg7ztg8Jm2Og=="
      crossorigin=""></script>   

<!--[if IE]>
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<![endif]-->

<!--[if lt IE 9]>
			<script src=<c:url value="/resources/bootstrap/html5shiv.js"/></script>		
			
<![endif]-->

<link href="<c:url value="/resources/styles/styles.css"/>" rel="stylesheet">

<link href="<c:url value="/resources/images/logo_infolog_riscos.gif"/>" rel="icon"  type="image/x-icon"/>

</head>

<body>
	<nav class="navbar navbar-inverse">
		<div class="container-fluid">
			<div class="navbar-header">
				<a href="#" class="navbar-brand">Torre de Controle -> Radar de Veiculos com Viagem Ativa</a>
			</div>
		</div>
	</nav>

	<div class="container-fluid">
		<div class="row row-offcanvas row-offcanvas-left">
			<div class="col-sm-12 col-md-12 main">
			
			 <div id="map" style="width: 800px; height: 440px; border: 1px solid #AAA;"></div>
			
			
				<c:choose>
					<c:when test="${fn:length(veiculosViagemAtiva) > 0}">
						<div class="table-responsive" >
							<table id="tableHeadTeconologias" class="table table-hover">
								<!-- class="table table-striped"-->
								<thead>
									<tr style="background:	#4A75B5; color:#ffffff; font-size:13px;">
									 
										<th colspan="1"></th>
										<th style="text-align: left;">Placa</th>
										<th style="text-align: center;">Terminal</th>
										<th style="text-align: center;">Tecnologia</th>
										<th style="text-align: center;">Latitude</th>
										<th style="text-align: center;">Longitude</th>
										
									</tr>
								</thead>
		
								<tbody id="tableBodyTecnologias">
									<c:forEach items="${veiculosViagemAtiva}" var="veiculosViagemAtiva">
									<tr font-size:11px">
											<td style="text-align: left;"><c:out
													value="${veiculosViagemAtiva.codPlaca}" /></td>

											<td style="text-align: right;"><b><c:out
													value="${veiculosViagemAtiva.codDispoRst}" /></b></td>

											<td style="text-align: right;"><c:out
													value="${veiculosViagemAtiva.nomFants}" /></td>

											<td style="text-align: right;"><c:out
													value="${veiculosViagemAtiva.numLatitUlt}" /></td>

											<td style="text-align: right;"><c:out
													value="${veiculosViagemAtiva.numLongiUlt}" /></td>
									</tr>

									</c:forEach>
								</tbody>
							</table>
						</div>
					</c:when>
					<c:otherwise>
						<div class="alert alert-warning" align="center">
  							<h3>Aten&#xE7;&#xE3;o</h3>
  							<h3>N&#xE3;o existem registros para filtro selecionado!</h3>
  							
						</div>
					</c:otherwise>
				</c:choose>		
			</div>
		</div>
		<!--/row-->
	</div>
	<!--/.container-->

	<footer  style="font-size:10px">
		<p class="pull-right">GPS-Pamcary Log&#xed;stica e Gerenciamento de Riscos</p>
	</footer>
	<script src="<c:url value="/resources/map/markers.js"/>"></script>	
	<script src="<c:url value="/resources/map/leaf-demo.js"/>"></script>
    
</body>
</html>