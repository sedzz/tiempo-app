function Tiempo() {
    this.apiUrl = 'http://api.openweathermap.org';
    this.API_KEY = '168153a173029b64225560be0d03cde1';
}

Tiempo.prototype.getEstadoDia = function () {
    let ciudadInput = $('#ciudad').val();
    console.log('Ciudad ingresada:', ciudadInput);

    var self = this;

    $.get(this.apiUrl + '/geo/1.0/direct?q=' + ciudadInput + '&limit=5&appid=' + this.API_KEY, function (ciudades) {
        console.log('Respuesta de la API:', ciudades);

        var result = '';

        if (ciudades && ciudades.length > 0){
            let lat = ciudades[0].lat;
            let lon = ciudades[0].lon;

            $.get(self.apiUrl + '/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + self.API_KEY, function (ciudad) {
                if (ciudad && ciudad.weather && ciudad.weather.length > 0) {
                    result += '<p>' + ciudad.weather[0].description + '</p>';
                } else {
                    result = 'No se han encontrado datos';
                }

                $('#results').html(result);
            });
        } else {
            result = 'No se han encontrado datos';
            
            $('#results').html(result);
        }
    });
};

$(function () {
    var TMPO = new Tiempo();

    $('#get-tiempo').on('click', function () {
        TMPO.getEstadoDia();
    });
});
