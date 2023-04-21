export const fetchCountries = (countryName) => {
    return fetch(`https://restcountries.com/v3.1/name/${countryName}?fields=name,capital,population,languages,flags`)
        .then(response => {
            console.log(response);
            if (!response.ok) {
                return Promise.reject();
            }
            return response.json();
        })
}