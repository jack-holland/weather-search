$("form").submit(function (e) {
    // Stop page from refreshing when form is submitted
    e.preventDefault();

    // Clear existing error messages
    $("#error").empty();

    // Check if latitude and longitude is empty
    if($("#latitude").val().length === 0 && $("#longitude").val().length === 0) {
        $error = "You must enter a location.";
        $("#error").append($error).removeClass("d-none");
    } else {
        $latitude = $("#latitude").val();
        $longitude = $("#longitude").val();
        $locationName = $("#locationName").val();

        getWeather(latitude, longitude, locationName);
    }

    function getWeather(latitude, longitude, locationName) {
        // API Key for Visual Crossing
        $apiKey = "FDJJH6ZYP8VJYWVV453HWERN2";

        // Get Weather from Visual Crossing as a JSON Object
        $.getJSON("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"+ $latitude +"%2C"+ $longitude +"/today?unitGroup=uk&key=" + $apiKey + "&contentType=json", function (data) {
        }).done(function (data) {

            // Convert the date from Epoch to normal date
            var date = new Date(data.currentConditions.datetimeEpoch * 1000);

            // Array for Day names and Month names
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesdasy", "Thursday", "Friday", "Saturday"];
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            // Create a div for Weather data
            var div = $(`
                <div class="card">
                    <div class="card-body">
                        <!-- Weather and Date-->
                        <div class="row">
                            <div class="col-sm-6">
                                <h5 class="card-title">`+ locationName + `</h5>
                            </div>
                            <div class="col-sm-6 d-flex justify-content-end">
                                <p class="card-text small">` + dayNames[date.getDay()] + ` ` + date.getDate() + ` ` + monthNames[date.getMonth()] + ` ` + date.getFullYear() + `</p>
                            </div>
                        </div>
                
                        <!-- Weather Description-->
                        <p class="card-text m-0">`+ data.description + `</p>
                
                        <div class="row">
                            <!-- Temperature-->
                            <div class="col d-flex align-items-center flex-column justify-content-center">
                                <p class="display-4 fw-bold m-0">`+ Math.floor(data.currentConditions.temp) + `<sup>°C</sup></p>
                            </div>
                
                            <!-- Weather Icon-->
                            <div class="col d-flex align-items-center justify-content-center">
                                <img src="/images/icons/`+ data.currentConditions.icon + `.png" height="64" width="64" alt="` + data.currentConditions.conditions + `">
                            </div>
                
                            <!-- Pressure, Humidity and Wind Speed -->
                            <div class="col-sm-4">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item p-1">
                                        <div class="row">
                                            <div class="col-4">
                                                <p class="fw-bold text-secondary">Feels like</p>
                                            </div>
                                            <div class="col-8">
                                                <p>`+ Math.floor(data.currentConditions.feelslike) + `<sup>°C</sup></p>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="list-group-item p-1">
                                        <div class="row">
                                            <div class="col-4">
                                                <p class="fw-bold text-secondary">Humidity</p>
                                            </div>
                                            <div class="col-8">
                                                <p>`+ Math.floor(data.currentConditions.humidity) + `%</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="list-group-item p-1">
                                        <div class="row">
                                            <div class="col-4">
                                                <p class="fw-bold text-secondary">Wind speed</p>
                                            </div>
                                            <div class="col-8">
                                                <p>`+ data.currentConditions.windspeed + ` mph</p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                
                            <!-- Sun rise, Sun set and Cloud Cover -->
                            <div class="col-sm-4">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item p-1">
                                        <div class="row">
                                            <div class="col-4">
                                                <p class="fw-bold text-secondary">Sun Rise</p>
                                            </div>
                                            <div class="col-8">
                                                <p>`+ data.currentConditions.sunrise + `</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="list-group-item p-1">
                                        <div class="row">
                                            <div class="col-4">
                                                <p class="fw-bold text-secondary">Sun Set</p>
                                            </div>
                                            <div class="col-8">
                                                <p>`+ data.currentConditions.sunset + `</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="list-group-item p-1">
                                        <div class="row">
                                            <div class="col-4">
                                                <p class="fw-bold text-secondary">Cloud Cover</p>
                                            </div>
                                            <div class="col-8">
                                                <p>`+ data.currentConditions.cloudcover + `%</p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                
                        </div>
                    </div>
                
                    <!-- Hourly Weather -->
                    <div class="card-footer text-muted pb-0">
                        <p class="text-center p-0 mb-2 small">Hourly Forecast</p>
                        <hr class="mb-2 m-0" />
                        <div class="row p-1 d-flex justify-content-center text-center" id="hourly-forecast">
                        </div>
                    </div>
                </div>
            `);

            // Add the Weather div
            $("#weather").html(div);

            // Hourly Forecast
            // Get the current time and create a JS date object
            var currentTime = data.currentConditions.datetimeEpoch * 1000;
            var currentTime = new Date(currentTime);

            // For loop for the next 8 hours
            for (let i = 1; i < 13; i++) {
                // If the current time is 24 or above, minus 24 so the clock starts back at 0
                if (currentTime.getHours() + i > 23) {
                    var time = data.days[0].hours[currentTime.getHours() + i - 24].datetimeEpoch * 1000;
                    var time = new Date(time);

                    var hourly = $(`
                        <div class="col">
                            <img src="/images/icons/`+ data.days[0].hours[currentTime.getHours() + i - 24].icon + `.png" height="48" width="48" alt="` + data.days[0].hours[currentTime.getHours() + i - 24].conditions + `" />
                            <p class="pt-2 m-0 fw-bold">`+ Math.floor(data.days[0].hours[currentTime.getHours() + i - 24].temp) + `<sup>°C</sup></p>
                            <p class="pb-2 m-0">`+ time.toLocaleString('en-US', { hour: 'numeric', hour12: true }) + `</p>
                        </div>
                    `);
                } else {
                    var time = data.days[0].hours[currentTime.getHours() + i].datetimeEpoch * 1000;
                    var time = new Date(time);

                    var hourly = $(`
                        <div class="col">
                            <img src="/images/icons/`+ data.days[0].hours[currentTime.getHours() + i].icon + `.png" height="48" width="48" alt="` + data.days[0].hours[currentTime.getHours() + i].conditions + `" />
                            <p class="pt-2 m-0 fw-bold">`+ Math.floor(data.days[0].hours[currentTime.getHours() + i].temp) + `<sup>°C</sup></p>
                            <p class="pb-2 m-0">`+ time.toLocaleString('en-US', { hour: 'numeric', hour12: true }) + `</p>
                        </div>
                    `);
                }

                // Append div to Hourly Forecast div
                $("#hourly-forecast").append(hourly);
            }
        })

        .fail(function () {
            // Clear existing error messages
            $("#error").empty();

            // Error grabbing JSON
            $error = "There was a problem retrieving the Weather, please try again at a later time."
            $("#error").append($error).removeClass("d-none");
        });
    }
});