document.addEventListener('DOMContentLoaded', function() {

    const API = "https://date.nager.at/api/v3/AvailableCountries";

        fetch(API)
           .then(response => response.json())
           .then(data => {
                localStorage.setItem('localData', JSON.stringify(data));
                let citiesArr = JSON.parse(localStorage.getItem('localData'));
                // console.log(citiesArr);
                const CITIES_LIST = document.querySelector('.cities-list');
                const TITLE = document.querySelector('h3');
                TITLE.textContent = 'Countries list:';
                
                const HOLIDAYS_LIST = document.querySelector('.info-list');
                const SUBTITLE = document.querySelector('h2');
            
                // #1 Display full list of items fethced from the API
                citiesArr.forEach(city => {
                    const ListItem = document.createElement("li");
                    ListItem.textContent = `name: ${city.name} - country code: ${city.countryCode}`;
                    CITIES_LIST.appendChild(ListItem);
                })

                // #2 Filter fetched items based on 'Search text' input.
                const INPUT = document.getElementById('search');
                INPUT.addEventListener("input", filterCitiesArr);
                
                function filterCitiesArr(elem) {
                    let search_value = elem.target.value;
                    const filterArr = [];

                    citiesArr.forEach(item => {
                        if (item.name.toLowerCase().startsWith(search_value.toLowerCase())) {
                            filterArr.push(item)
                        }
                    })

                    CITIES_LIST.innerHTML = ''; 
                    filterArr.forEach(city => { 
                        const ListItem = document.createElement("li");
                        ListItem.textContent = `name: ${city.name} -  country code: ${city.countryCode}`;
                        CITIES_LIST.appendChild(ListItem)
                    })
                }

                // #3 By clicking on country from the 'Search text' need to fetch and display 
                // holidays(selectedCountryHolidays) in the selected county.
                // Виконав не зовсім коректно, зробив так щоб при натисканні на елемент списку, 
                // інформація відображалась і input і потім виводилися свята по коду країни.
                // Щоб виконати коректно можливо знадобиться більше часу.

                CITIES_LIST.addEventListener('click', selectCity);

                function selectCity(event) {
                    const LIST_ITEMS = document.querySelector('li');

                    if (event.target = LIST_ITEMS) {
                        INPUT.value = event.target.textContent
                        var ID = `${INPUT.value[INPUT.value.length - 2]}${INPUT.value[INPUT.value.length - 1]}`;
                        // console.log(ID)
                        const API_HOLIDAYS = `https://date.nager.at/api/v3/NextPublicHolidays/${ID}`;

                        if (ID.length > 0) {
                            fetch(API_HOLIDAYS)
                                .then(response => response.json())
                                .then(data => {
                                    localStorage.setItem('localCityHoliday', JSON.stringify(data));
                                    let COUNTRY_HOLIDAYS = JSON.parse(localStorage.getItem('localCityHoliday'));
                                    SUBTITLE.textContent = 'Holidays of current county:';
                                    
                                    HOLIDAYS_LIST.innerHTML = '';
                                    COUNTRY_HOLIDAYS.forEach(item => { 
                                        const ListItem = document.createElement("span");
                                        ListItem.textContent = `date: ${item.date} - local name: ${item.localName}`;
                                        HOLIDAYS_LIST.appendChild(ListItem)
                                    })
                                    // console.log(COUNTRY_HOLIDAYS)
                                })
        
                                .catch((error) => {
                                    console.log("Axios holiday error: ", error);
                                })
                        } 
                    }
                }
                    
                // #4 Add a Sort button next to the input. It should sort the list of countries that the user 
                // sees on the screen in desc or asc order. Default order os desc. The name of the button should 
                // indicate what type of sorting will be performed when clicked.

                const SORT_BUTTON = document.querySelector(".sort-btn")
                SORT_BUTTON.addEventListener('click', sortCitiesArr)

                function sortCitiesArr() {
                    if (!SORT_BUTTON.classList.contains('os')) {
                        SORT_BUTTON.classList.add('os');
                        SORT_BUTTON.classList.remove('desc');
                        SORT_BUTTON.textContent = 'Os';

                        const SORT_LIST = document.querySelectorAll('li');
                        const SORT_LIST_2 = [];
                        SORT_LIST.forEach(item => {
                            SORT_LIST_2.push(item.textContent)
                        })

                        SORT_LIST_2.sort().reverse()
                        CITIES_LIST.innerHTML = ''; 
                        SORT_LIST_2.forEach(city => { 
                            const ListItem = document.createElement("li");
                            ListItem.textContent = `${city}`;
                            CITIES_LIST.appendChild(ListItem)
                        })
                    } else {
                        SORT_BUTTON.classList.add('desc');
                        SORT_BUTTON.classList.remove('os');
                        SORT_BUTTON.textContent = 'Desc';

                        const SORT_LIST = document.querySelectorAll('li');
                        const SORT_LIST_2 = [];
                        SORT_LIST.forEach(item => {
                            SORT_LIST_2.push(item.textContent)
                        })

                        SORT_LIST_2.sort()
                        CITIES_LIST.innerHTML = ''; 
                        SORT_LIST_2.forEach(city => { 
                            const ListItem = document.createElement("li")
                            ListItem.textContent = `${city}`
                            CITIES_LIST.appendChild(ListItem)
                        })
                    }
                }

                // #5 Next to the Sort button, add a Reset button to empty the app
                const RESET_BUTTON = document.querySelector(".reset-btn");
                RESET_BUTTON.addEventListener('click', resetProg);

                function resetProg() {
                    INPUT.value = '';
                    CITIES_LIST.innerHTML = '';
                    SORT_BUTTON.classList.remove('os');
                    SORT_BUTTON.classList.remove('desc');
                    SORT_BUTTON.textContent = 'Sort';
                    HOLIDAYS_LIST.textContent = '';
                    TITLE.textContent = '';
                    SUBTITLE.textContent = '';
                }       
           })

           .catch((error) => {
               console.log("Axios error: ", error);
           })
   
})