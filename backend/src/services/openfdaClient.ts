import axios from 'axios';

const openFdaApi = axios.create({
  baseURL: 'https://api.fda.gov/drug/label.json',
  timeout: 10000
});

export const getDrugLabelInteractions = async (drugName: string) => {
  try {
    const response = await openFdaApi.get('', {
      params: {
        search: `openfda.generic_name:"${drugName}"`,
        limit: 1
      }
    });

    const firstResult = response.data?.results?.[0];
    const interactions = firstResult?.drug_interactions?.[0] ?? '';
    return interactions as string;
  } catch {
    return '';
  }
};
