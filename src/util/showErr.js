export const showErr = (err) => {
    if (err?.message) {
        err = err.message;
    }
    if (JSON.stringify(err)?.includes('Network Error')) {
        err = 'Network Error';
    }
    try {
        if (JSON.stringify(err).includes('503')) {
            return;
        }
    } catch (error) {
        return;
    }
    if (typeof err === 'string') {
        alert(err);
        return;
    }
    alert(JSON.stringify(err));
};
