function Tiempo() {
    this.apiUrl = 'https://api.openweathermap.org';
    this.API_KEY = '168153a173029b64225560be0d03cde1';
}

Tiempo.prototype.getInfoDia = function(){
    let ciudadInput = $('#ciudad').val();
    console.log('Ciudad ingresada:', ciudadInput);
    
    return $.get(this.apiUrl + '/geo/1.0/direct?q=' + ciudadInput + '&limit=5&appid=' + this.API_KEY);
}

Tiempo.prototype.getEstadoDia = function (lat, lon) {
    var self = this;
    
    $.get(self.apiUrl + '/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + self.API_KEY+'&units=metric', function (ciudad) {
        var result = '';

        if (ciudad.weather.length > 0) {
            var mensajeTiempo = ciudad.weather[0].main;
            var imagen = imagenesTiempo[mensajeTiempo];

            result+= '<div class="container d-flex justify-content-center align-items-center"><div class="card shadow-lg p-3 mb-5 bg-white rounded"><div class="row no-gutters"><div class="col-md-4"><img src="' + imagen + '" class="card-img-top rounded-circle" alt="' + mensajeTiempo + '"><div class="card-body"><h5 class="card-title text-center">'+Math.round(ciudad.main.temp)+'Cº</h5><p class="card-text text-center">' + ciudad.name + '</p></div></div><div class="col-md-8"><div class="card-body"><h5 class="card-title">Detalles del clima</h5><p class="card-text">'+'⬇️'+Math.round(ciudad.main.temp_min)+'º'+ '⬆️'+Math.round(ciudad.main.temp_max)+'º</p><p class="card-text"> ' + Math.round(ciudad.wind.speed) + ' km/h </p></div></div></div></div></div>'

            $('#carta').html(result);

        } else {
            result = '<p class="text-danger">No se han encontrado datos</p>';
            $('#carta').html(result);
        }
    });
};

Tiempo.prototype.getInfoHorasDia = function (lat, lon) {
    var self = this;
    $.get(self.apiUrl + '/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + self.API_KEY+'&units=metric', function (horas) {

        var mensajeTiempo
        var horaDiv;
        var imagen;

        var fechaActual = new Date();
        var diaActual = fechaActual.getDate();
        let horaMinutos;


        horas.list.forEach(function (element) {
            var fechaHora = element.dt_txt.split(" ")[1];
            var fecha = element.dt_txt.split(" ")[0]
            var dia = parseInt(fecha.split("-")[2]);
            var hora = parseInt(fechaHora.split(":")[0]);
            mensajeTiempo = element.weather[0].main;
            imagen = imagenesTiempo[mensajeTiempo];
            horaMinutos = fechaHora.toString().substr(0,5);  
            
            

            if ((dia === diaActual)) {
                horaDiv = `
                <div class="card">
                    <img src="${imagen}" class="card-img-top rounded-circle" alt="${mensajeTiempo}">
                    <div class="card-body">
                        <h5 class="card-title text-center">${Math.round(element.main.temp)}°C</h5>
                        <p class="card-text text-center">${horaMinutos}</p>
                    </div>
                    <div class="card-footer">
                        <p class="text-center">⬇️${Math.round(element.main.temp_min)}° ⬆️${Math.round(element.main.temp_max)}°</p>
                        <p class="text-center">💨${Math.round(element.wind.speed)} km/h</p>
                    </div>
                </div>`;                
                $('#results').append(horaDiv);
            }
            
        });

       
    });
}

function accionMenuHome(){
    let result;
}


function accionesMenuLupa(){
    let results = '<div id="carta" class="container d-flex justify-content-center align-items-center"><div class="card" id="busqueda"><div class="card-body text-center"><h5 class="card-title">Introduce una ciudad</h5><p><input type="text" name="city" id="ciudad" placeholder="📍"></p><button class="btn btn-primary" id="get-tiempo">Buscar</button></div></div></div>';
    $('#carta').html(results);
    $('#results').html(" ");
}

Tiempo.prototype.accionMenuUbicacion = function(){
    var self = this;

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;

            self.getEstadoDia(lat, lon);   
            self.getInfoHorasDia(lat,lon)
        });
    } else {
        console.log("No se pudo obtener la ubicación del usuario.");
    }
}

$(function () {
    var TMPO = new Tiempo();

    $(document).on('click', '#get-tiempo', function () {
        TMPO.getInfoDia().done(function(ciudades) {
            if (ciudades && ciudades.length > 0){
                let lat = ciudades[0].lat;
                let lon = ciudades[0].lon;
                TMPO.getEstadoDia(lat, lon);
                $('#results').html('<p class="text-danger"></p>');
                TMPO.getInfoHorasDia(lat,lon);
            } else {
                $('#results').html('<p class="text-danger">No se han encontrado datos</p>');
            }
        });   
    });

    $('#lupa').on('click', function(){
        accionesMenuLupa();
    })

    $('#ubicacion').on('click', function(){
        TMPO.accionMenuUbicacion();
        TMPO.getInfoHorasDia(lat,lon)
    });

    $('#home').on('click', function(){
        
    })

});
