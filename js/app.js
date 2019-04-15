window.addEventListener('load', () => {
    let long;
    let lat;
    let secret_key = '';
    let temperatureDescription = document.querySelector('.temperature-description');
    let temperatureDegree = document.querySelector('.temperature-degree');
    let locationTimeZone = document.querySelector('.location-timezone');
    let degreeSection = document.querySelector('.degree-section');
    const degreeSpan = document.querySelector('.degree-section span');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {

                long = position.coords.longitude;
                lat = position.coords.latitude;

                const proxy = 'https://cors-anywhere.herokuapp.com/'

                const api = `${proxy}https://api.darksky.net/forecast/${secret_key}/${lat},${long}`;

                fetch(api)
                    .then(response => {
                        return response.json()
                    })
                    .then(data => {
                        const {
                            temperature,
                            summary,
                            icon
                        } = data.currently;

                        // Set Dom Elements from the API
                        temperatureDegree.textContent = temperature;
                        temperatureDescription.textContent = summary;
                        locationTimeZone.textContent = data.timezone;

                        //Formula for celsius
                        let celsius = (temperature - 32) * (5 / 9);

                        //Set Icon
                        setIcons(icon, document.querySelector('.icon'));

                        //Change temperature to Celsius/Farenheit
                        degreeSection.addEventListener('click', () => {
                            if (degreeSpan.textContent === 'F') {
                                temperatureDegree.textContent = Math.floor(celsius);
                                degreeSpan.textContent = 'C';
                            } else {
                                temperatureDegree.textContent = temperature;
                                degreeSpan.textContent = 'F';
                            }
                        });

                    });

            }, (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        locationTimeZone.textContent = 'El usuario denegó el permiso para la Geolocalización';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        locationTimeZone.textContent = 'La ubicación no está disponible';
                        break;
                    case error.TIMEOUT:
                        locationTimeZone.textContent = 'Se ha excedido el tiempo para obtener la ubicación';
                        break;
                    default:
                        locationTimeZone.textContent = 'Un error desconocido';
                        break;
                }
                degreeSection.textContent = "Permita el acceso a la ubicación."
                temperatureDescription.textContent = ":("
            }, {
                maximumAge: 70000,
                timeout: 10000,
            }
        );
    } else {
        locationTimeZone.textContent = "No hay soporte para la API de geolocalización."
    }

    function setIcons(icon, iconID) {
        const skycons = new Skycons({
            color: "white"
        });
        const currentIcon = icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }
});