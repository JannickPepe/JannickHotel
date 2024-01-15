
import { Country, State, City } from 'country-state-city';


const useLocation = () => {

    //
    const getCountryByCode = (countryCode: string) => {
        return Country.getAllCountries().find((country) => country.isoCode === countryCode);
    };

    //
    const getStateByCode = (countryCode: string, stateCode: string) => {
        const state = State.getAllStates().find((state) => state.countryCode === countryCode && state.isoCode === stateCode);

        if (!state) return null;

        return state;
    };

    //
    const getCountrystates = (countrCode: string) => {
        return State.getAllStates().filter((state => state.countryCode === countrCode));
    };

    //
    const getStateCities = (countrCode: string, stateCode?: string) => {
        return City.getAllCities().filter((city) => city.countryCode === countrCode && city.stateCode === stateCode);
    };

    return {
        getAllCountries: Country.getAllCountries,
        getCountryByCode,
        getStateByCode,
        getCountrystates,
        getStateCities,
    };

};


export default useLocation;