/**
 * Delay para quando for utilizar o autocomplete não executar a função enquanto o usuário ainda digita
 */
var delay = (function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

var fitFixedHeader = (function() {
        var linha = $('#incomingTrucks').find('tbody tr').first();

        if (linha.attr('id') !== 'emptyTable') {
            $.each(linha.find('td'), function(key, value) {
                var width = $(value).width();
                var outerWidth = $(value).outerWidth(true);

                $('#reflectTable').find('th:eq(' + key + ')').css({
                    'minWidth': outerWidth + 'px',
                    'fontSize': '10px'
                });
            });

            $('.dataTable.current').scroll(function(e) {
                var scroll = $('.dataTable.current').scrollLeft();
                $('.dataTable.title').scrollLeft(scroll);
            });
        }
});

/**
 * Função para mostrar o showbox e quando houver a tabela de caminhões fixar o titulo no topo
 * @param {string} target -  alvo que será aberto quando clicado
 */
$.fn.showBox = function(target) {
    var self = this;
    self.on('click', function() {
        var isVisible = $(target).is(':visible');
        self.hide();
        $(target).fadeIn();

        //adiciona a ação de fechar ao icone X
        $(target).find('.glyphicon-remove').on('click', function() {
            self.find('p').html(self.attr('defaultTitle'));
            self.show();
            $(target).hide();
        });

        fitFixedHeader();
    });
}

/**
 * Realiza a ação de dar zoom em algum lugar especifico do mapa
 * @param {any} mapPrototype - Objeto relacionado as funções do mapa. ex: map = new radarColetaFactory();
 * @param {any} coordinates - Coordenadas onde será dado o zoom
 * @param {number} zoom - distancia do zoom
 * @param {string} tableName - Muda a cor na tabela quando clica no zoom 
 */

$.fn.zoomTo = function(mapPrototype, coordinates, zoom, tableName) {
    var self = this;
    self.on('click', function() {
        if (tableName) {
            $(tableName).find('tr').removeClass('active');
            var line = self.closest('tr');
            line.addClass('active');
        }
        mapPrototype.zoomTo(coordinates, zoom);
    })
}

/**
 * Realiza a busca com autocomplete e quando clica no resultado monta o mapa
 * @param {string} target - Input de busca
 * @param {any} mapPrototype - Objeto relacionado as funções do mapa. ex: map = new radarColetaFactory();
 * @param {string} entityUrl - URL que será feita a busca
 * @param {string} tableId - ID da tabela que será populada ao carregar o mapa
 * @param {number} timeToUpdate - tempo que será colocado no relógio para atualizar o serviço
 * @param {string} timerTarget - Elemento no qual será renderizado o relógio 
 */

$.fn.entitySearch = function(target, mapPrototype, entityUrl, yardUrl, otmUrl, tableId, timeToUpdate, timerTarget) {
    var self = this;
    var max = 50;

    var showMaximumChar = function(target) {
        var length = target.val().length;
        var remaining = (length - max) - 1;
        $('#count').text(((length > 50) ? 50 : length) + '/' + max + ' caracteres');
    }

    this.on('blur', function(e) {
        showMaximumChar(self);
    })

    this.on('keydown', function(e) {
        $('.loading').removeClass('hide');
        $('.glyphicon-search').addClass('hide');
        var length = self.val().length;
        var remaining = (length - max) - 1;
        showMaximumChar(self);

        if(self.val().length > max) {
            var valor = self.val().slice(0, '-' + remaining + 1);
            self.val(valor);

            $('.loading').addClass('hide');
            $('.glyphicon-search').removeClass('hide');
        }

        delay(function() {
            var value = self.val();

            if (value.length > 2) {
                mapPrototype.findEntity(target, self.val(), entityUrl, yardUrl, otmUrl, tableId, timeToUpdate, timerTarget);
            }
            else {
                $('.loading').addClass('hide');
                $('.glyphicon-search').removeClass('hide');
            }
        }, 600);
    });
}

/**
 * Realiza uma filtragem local na tabela
 * @param {string} type - referencia a ser colocada na tabela para busca.
 */

$.fn.searchTable = function(type) {
    var self = this;

    this.on('keydown', function(e) {
        delay(function() {
            var value = self.val();
            if (type === 'placa') {
                var upperCase = value.toUpperCase();
                value = upperCase;
            }
            var target = $('.' + type);
            $.each(target, function(k, v) {
                var text = this.innerHTML;
                if (text.toUpperCase().indexOf(value) > -1) {
                    this.parentElement.classList.remove('hide');
                }
                else {
                    this.parentElement.classList.add('hide');
                }
            });

            fitFixedHeader();

        }, 200);
    });
}
