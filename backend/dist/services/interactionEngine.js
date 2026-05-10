export const scoreRiskFromTexts = (texts) => {
    const joined = texts.join(' ').toLowerCase();
    if (!joined.trim())
        return 'Unknown';
    if (joined.includes('contraindicated') ||
        joined.includes('reduce contraceptive efficacy') ||
        joined.includes('decrease plasma concentrations') ||
        joined.includes('pregnancy')) {
        return 'High';
    }
    if (joined.includes('monitor') ||
        joined.includes('caution') ||
        joined.includes('may increase') ||
        joined.includes('may decrease') ||
        joined.includes('interaction')) {
        return 'Caution';
    }
    return 'Low';
};
export const guidanceByRisk = (risk) => {
    switch (risk) {
        case 'High':
            return 'High-risk signal found. Use backup contraception and contact your clinician or pharmacist promptly.';
        case 'Caution':
            return 'Potential interaction detected. Discuss with your clinician and monitor for side effects.';
        case 'Low':
            return 'No major interaction signals detected from available sources, but continue routine monitoring.';
        default:
            return 'Not enough data to classify this interaction. Ask a clinician or pharmacist before changing medications.';
    }
};
