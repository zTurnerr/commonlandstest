// export const TITLE = [
//     '//Plot View',
//     '//Invite People',
//     '//Edit Plot',
//     '//Photos',
//     '//Manage Claimants',
//     '//Manage Neighbors',
//     '//Create a Sub Plot',
// ];
export const SPACIAL_TAB = [2, 3, 6];
export const INVITE_TAB = [1, 4, 5];
export const around_plot_id = 'around_plot';
export const isPlotView = (step) => {
    return step === 0;
};
export const isInvitePeople = (step) => {
    return INVITE_TAB.includes(step);
};
export const isManagerClaimants = (step, tab) => {
    return step === 4 || (step === 1 && tab === 1);
};
export const isManagerNeighbors = (step, tab) => {
    return step === 5 || (step === 1 && tab === 2);
};

export const isEditPlot = (step) => {
    return step === 2;
};

export const isEditPolygon = (step) => {
    return step === 7;
};

export const isCreateSubplot = (step) => {
    return step === 6;
};

export const isViewPhotos = (step) => {
    return step === 3;
};
