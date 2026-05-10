import axios from 'axios';
const rxnavApi = axios.create({
    baseURL: 'https://rxnav.nlm.nih.gov/REST',
    timeout: 10000
});
export const searchMedicationByName = async (query) => {
    const response = await rxnavApi.get('/drugs.json', {
        params: { name: query }
    });
    const groups = response.data?.drugGroup?.conceptGroup ?? [];
    const concepts = groups.flatMap((group) => group.conceptProperties ?? []);
    return concepts.slice(0, 10).map((item) => ({
        rxcui: item.rxcui,
        name: item.name,
        tty: item.tty
    }));
};
export const getInteractionsForRxcuis = async (rxcuis) => {
    if (rxcuis.length < 2)
        return [];
    const response = await rxnavApi.get('/interaction/list.json', {
        params: { rxcuis: rxcuis.join('+') }
    });
    const groups = response.data?.fullInteractionTypeGroup ?? [];
    return groups.flatMap((group) => group.fullInteractionType ?? []);
};
