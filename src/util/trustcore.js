export const getTrustScoreBgCode = (type) => {
    switch (type) {
        case 'N/A':
            return 'na';
        case 'Very Poor':
            return 'veryPoor';
        case 'Poor':
            return 'poor';
        case 'Okay':
            return 'okay';
        case 'Good':
            return 'good';
        case 'Very Good':
            return 'veryGood';
        case 'Excellent':
            return 'excellent';
        default:
            return 'na';
    }
};
