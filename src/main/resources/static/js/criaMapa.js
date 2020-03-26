$(document).ready(function() {
    localStorage.setItem('messages', '[]')
    var radarViagens = new radarViagensFactory();
    var time = 5;

    $('#openMenu').showBox('#menuBox');
    
    radarViagens.buscarViagensEmCarga('#tabelaRadarViagens', '', './buscarViagensEmCarga', '/app/assets/data/otm.json', time, 'updateTime');
    
    radarViagens.buscarViagensEmDescarga('#tabelaRadarViagens', '', './buscarViagensEmDescarga', '/app/assets/data/otm.json', time, 'updateTime');
    
    radarViagens.buscarViagensEmTransito('#tabelaRadarViagens', '', './buscarViagensEmTransito', '/app/assets/data/otm.json', time, 'updateTime');
    
    radarViagens.buscarVeiculosViagemAtiva('#tabelaRadarViagens', '', './buscarVeiculosViagemAtiva', '/app/assets/data/otm.json', time, 'updateTime');
    
    
    radarViagens.buildYard('#tabelaRadarViagens', '', './buscarViagens', '/app/assets/data/otm.json', time, 'updateTime');
    
    radarViagens.toggleIcon();
    
    radarViagens.fecharAguarde();
    
    radarViagens.buscarLegendaDinamica('./buscarLegendaDinamica');
    

    $('#destinySearch').focus(function() {
        var length = $(this).parent().find('.autoComplete li').length;
        if (length > 0) {
            $(this).parent().find('.autoComplete').addClass('active');
        }
    }).focus().entitySearch('.autoComplete', radarViagens,'./buscarOrigem','./buscarViagensAgendadas', './impressaoOTM', '#tabelaRadarViagens', time,'updateTime');
    
    $('#entidadeSearch').focus(function() {
        var length = $(this).parent().find('.autoComplete2 li').length;
        if (length > 0) {
            $(this).parent().find('.autoComplete2').addClass('active');
        }
    }).focus().entitySearch('.autoComplete2', radarViagens,'./buscarEntidadesVinculadas','./buscarViagensAgendadas', './impressaoOTM', '#tabelaRadarViagens', time,'updateTime');

    
    $(window).on('click', function(e) {
        if (e.target.getAttribute('id') != 'autoComplete' && e.target.getAttribute('id') != 'destinySearch') {
            $('#autoComplete').removeClass('active');
        }
        
        if (e.target.getAttribute('id') != 'autoComplete2' && e.target.getAttribute('id') != 'entidadeSearch') {
            $('#autoComplete2').removeClass('active');
        }
    });
    
    $('#entidadesList').dblclick(function(e){
    	if(document.getElementById("entidadesList").value != null && document.getElementById("entidadesList").value != ""){
    		radarViagens.removeOrigin(document.getElementById("entidadesList").value);
    	}
    });
    
    $('#entidadesList').keydown(function(e){
    	const key = event.key; 
    	if(document.getElementById("entidadesList").value != null && document.getElementById("entidadesList").value != ""){
	    	if (key === "Delete") {
	        	radarViagens.removeOrigin(document.getElementById("entidadesList").value);
	        }
    	}
    });
    
    $('#vinculadoList').dblclick(function(e){
    	if(document.getElementById("vinculadoList").value != null && document.getElementById("vinculadoList").value != ""){
    		radarViagens.removeVinculado(document.getElementById("vinculadoList").value);
    	}
    });
    
    $('#vinculadoList').keydown(function(e){
    	const key = event.key; 
    	if(document.getElementById("vinculadoList").value != null && document.getElementById("vinculadoList").value != ""){
	    	if (key === "Delete") {
	        	radarViagens.removeVinculado(document.getElementById("vinculadoList").value);
	        }
    	}
    });
    
    $('#exibirPlanosAtivos').change(function(e){
    	radarViagens.radioPlanosAtivos($('#exibirPlanosAtivos').is(':checked'));
    });
    
    $('#exibirEmCarga').change(function(e){
    	radarViagens.toggleViagensEmCarga($('#exibirEmCarga').is(':checked'));
    });     
    
    $('#exibirEmDescarga').change(function(e){
    	radarViagens.toggleViagensEmDescarga($('#exibirEmDescarga').is(':checked'));
    }); 
    
    $('#exibirEmTransito').change(function(e){
    	radarViagens.toggleViagensEmTransito($('#exibirEmTransito').is(':checked'));
    }); 
    
    $('#exibirFrotaDedicada').change(function(e){
    	radarViagens.radioFrotaDedicada($('#exibirFrotaDedicada').is(':checked'));
    });
    
    $('#exibirEmUso').change(function(e){
    	radarViagens.toggleVeiculosEmUso($('#exibirEmUso').is(':checked'));
    });
    
    $('#exibirVazio').change(function(e){
    	radarViagens.toggleVeiculoVazio($('#exibirVazio').is(':checked'));
    });
    
    $('#selecionarTudoOrigem').click(function(e){
    	radarViagens.selectAllOrigins();
    });
    
    $('#limparTudoOrigem').click(function(e){
    	radarViagens.removeAllOrigins();
    });
    
    $('#selecionarTudoVinculado').click(function(e){
    	radarViagens.selectAllVinculado();
    });
    
    $('#limparTudoVinculado').click(function(e){
    	radarViagens.removeAllVinculado();
    });
    
    $('#exibirRastreador').change(function(e){
    	radarViagens.toggleRastreador($('#exibirRastreador').is(':checked'));
    });
    
    $('#exibirApp').change(function(e){
    	radarViagens.toggleApp($('#exibirApp').is(':checked'));
    });
    
    $('#exibirAppRastreador').change(function(e){
    	radarViagens.toggleAppRastreador($('#exibirAppRastreador').is(':checked'));
    });
    
    $('#icon').click(function(e){
    	document.getElementById("botao").innerHTML = "off";
    	radarViagens.toggleIcon();
    });
    
    $('#icon_closed').click(function(e){
    	document.getElementById("botao").innerHTML = "on";
    	radarViagens.toggleIcon();
    });
    
    $( "#modalLegenda" ).click(function() {
    	if(document.getElementById("legenda").style.display != "block"){
    		$("#legenda").css("display","block");
	    }else{
	    	$("#legenda").css("display","none");
	    	$("#legenda").css("left","10px");
	    	$("#legenda").css("top","10px");
	    }	
    });
    
    $( "#abrirFecharLegenda" ).click(function() {
    	if(document.getElementById("legenda").style.display != "block"){
    		$("#legenda").css("display","block");
	    }else{
	    	$("#legenda").css("display","none");
	    	$("#legenda").css("left","10px");
	    	$("#legenda").css("top","10px");
	    }	
    });
    
    $('#operacao').change(function(e){
    	radarViagens.fixarParametroOperacao('./fixarParametroOperacao', document.getElementById("operacao").value);
    	document.getElementById('menu_frota_dedicada').style.display = 'none'; 
    	document.getElementById('menu_planos_ativos').style.display = 'block';
    });
});