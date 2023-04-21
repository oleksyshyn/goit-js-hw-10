import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onCountryName, DEBOUNCE_DELAY));

function onCountryName(event) {
    const countryName = event.target.value.trim();

    if (!countryName) {
        clearHTML();
        return;
    };

    fetchCountries(countryName)
        .then((data) => {
            console.log(data);
            if (data.length === 1) {
                clearHTML();
                countryInfoEl.innerHTML = countryInfoMarkup(data);
            } else if (data.length > 1 && data.length <= 10) {
                clearHTML();
                countryListEl.innerHTML = countryListMarkup(data);
            } else {
                clearHTML();
                Notify.info('Too many matches found. Please enter a more specific name.');
            }
        })
        .catch((error) => {
            clearHTML();
                Notify.failure("Oops, there is no country with that name");
            });
}

function countryInfoMarkup(data) {
    const languages = Object.values(data[0].languages).join(', ');

    return data.map(({ flags, name, capital, population }) => {
        return `
            <div class="country-info-name">
                <img src="${flags.svg}" alt="Country flag" width="30" height="20" class="country-flag">
                <p class="country-name">${name.official}</p>
            </div>
            <p class="country-capital"><span>Capital:</span> ${capital}</p>
            <p class="country-population"><span>Population:</span> ${population}</p>
            <p class="country-languages"><span>Languages:</span> ${languages}</p>`
    }).join('');
}

function countryListMarkup(data) {
    return data.map(({ flags, name }) => {
        return `<li class="country-list-item">
                    <img src="${flags.svg}" alt="Country flag" width="30" height="20" class="country-flag">
                    <p class="country-list-name">${name.official}</p>
                </li>`
    }).join('');
}

function clearHTML() {
    countryInfoEl.innerHTML = '';
    countryListEl.innerHTML = '';
}
