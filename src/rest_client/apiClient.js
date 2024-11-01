import axios from 'axios';
import Constants from '../util/Constants';
import Client from './baseClient';
import randomUseragent from 'random-useragent';
import { getBackendServer } from '.';
const http = new Client();

export const updateBackendServer = (url) => {
    http.updateBackend(url);
};

const _upload = (data) => {
    return fetch(http.url + 'api/image/mock', {
        body: data,
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const uploadImage = async (form) =>
    new Promise((r, rj) => {
        _upload(form)
            .then((res) => {
                r(res.json());
            })
            .catch((err) => {
                rj(err);
            });
    });
const CancelToken = axios.CancelToken;
let source;
export const createPlot = (data, navigation, dispatch) => {
    if (source) {
        source.cancel('create plot cancel');
    }
    source = CancelToken.source();
    return http.post(
        'api/plot',
        data,
        navigation,
        {
            cancelToken: source.token,
        },
        dispatch,
    );
};
export const getUserPlots = (id, navigation, dispatch) => {
    return http.get('api/plot?creatorID=' + id, '', navigation, dispatch);
};
export const invitesUser = (data, navigation, dispatch) => {
    return http.post('api/invite', data, navigation, dispatch);
};
// api/plot/remove-claimant
export const removeClaimant = (data, navigation, dispatch) => {
    return http.post('api/plot/remove-claimant', data, navigation, {}, dispatch);
};
// api/plot/remove-claimant/self-vote/:requestId"
export const voteRemoveClaimantSelf = (requestId, data, navigation, dispatch) => {
    return http.post(
        'api/plot/remove-claimant/self-vote/' + requestId,
        data,
        navigation,
        {},
        dispatch,
    );
};
// api/plot/remove-claimant/voter
export const getRemoveClaimantRequest = (plotId, navigation, dispatch) => {
    return http.get('api/plot/remove-claimant/voter?plotId=' + plotId, null, navigation, dispatch);
};
//  api/plot/remove-claimant/vote/:requestId
export const voteRemoveClaimant = (requestId, data, navigation, dispatch) => {
    return http.post('api/plot/remove-claimant/vote/' + requestId, data, navigation, {}, dispatch);
};

export const getAllPlot = ({ idPlot = '', page = 1, perPage = 10 }, navigation, dispatch) => {
    return http.get(
        `api/plot/all?page=${page}&perPage=${perPage}&search=${idPlot}`,
        '',
        navigation,
        dispatch,
    );
};
export const deletePlot = (id, navigation, dispatch) => {
    return http.delete('api/plot/' + id, '', navigation, {}, dispatch);
};
export const getPlotByID = (id, navigation, dispatch) => {
    return http.get(
        'api/plot/' + id + '?getClosePlots=true&includeDisputes=true',
        null,
        navigation,
        dispatch,
    );
};

// const cachedClaimchainByPlot = {};

export const getClaimchainByPlotID = async (id, navigation, dispatch) => {
    // if (cachedClaimchainByPlot[id]) {
    //     return {
    //         data: cachedClaimchainByPlot[id],
    //     };
    // }

    const res = await http.get('api/claimchain/plot/' + id, null, navigation, dispatch);
    // const plots = res.data.plots;

    // for (const plot of plots) {
    //     cachedClaimchainByPlot[plot._id] = res.data;
    // }

    return res;
};

export const getPlotByIDCompact = (id, navigation, dispatch) => {
    return http.get(
        'api/plot/' + id + '/public?getClosePlots=true&includeDisputes=true',
        null,
        navigation,
        dispatch,
    );
};
// /check-claimant-of-plot/:plotID
export const checkClaimantOfPlot = (id, data, navigation, dispatch) => {
    return http.post('api/plot/check-claimant-of-plot/' + id, data, navigation, dispatch);
};
export const getPlotByRectangle = (data, navigation, config = {}, dispatch) => {
    return http.post('api/claimchain/by-rectangle', data, navigation, config, dispatch);
};
export const getPlotByRectanglePublic = (data, navigation, config = {}, dispatch) => {
    return http.post('api/claimchain/by-rectangle/public', data, navigation, config, dispatch);
};
export const uploadBoundary = ({ data, plotId, long, lat }, navigation, dispatch) => {
    return http.post(
        `api/plot/boundary?plotID=${plotId}&long=${long}&lat=${lat}`,
        data,
        navigation,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
        dispatch,
    );
};
export const updateBoundary = ({ data, plotId, long, lat }, navigation, dispatch) => {
    return http.post(
        `api/plot/update-boundary?plotID=${plotId}&long=${long}&lat=${lat}`,
        data,
        navigation,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
        dispatch,
    );
};

export const uploadDocument = (data, navigation, dispatch) => {
    return http.post(`api/user/documentation`, data, navigation, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        dispatch,
    });
};
// is public
export const getPlotBoundaryImage = (id, navigation, dispatch) => {
    return http.get(`api/plot/${id}/all-boundary`, null, navigation, dispatch);
};
// is public
export const getImageS3 = (id, navigation, dispatch) => {
    return http.get(`api/services/s3?imageAWSKey=${id}`, null, navigation, dispatch);
};
export const postImageS3 = (data, navigation, dispatch) => {
    return http.post(
        `api/services/s3`,
        data,
        navigation,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
        dispatch,
    );
};

export const postImageS3V2 = (data) => {
    return axios.post(getBackendServer() + 'api/services/s3-secret', data, {
        headers: {
            authorization:
                'Bearer ' + '36d17398a417b8a2405c38bd0dac90e9e0d517ded77ac7e4008dd24f8931c9f6',
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const inviteNeightbor = (data, navigation, dispatch) => {
    return http.post(`api/invite/neighbor`, data, navigation, {}, dispatch);
};
export const inviteClaimants = (data, navigation, dispatch) => {
    return http.post(`api/invite/claimant`, data, navigation, {}, dispatch);
};
export const updateStatusInviteNeightbor = (data, navigation, dispatch) => {
    return http.post(`api/invite/update-neighbor`, data, navigation, {}, dispatch);
};
export const updateStatusInviteClaimant = (data, navigation, dispatch) => {
    return http.post(
        `api/invite/update-claimant${data?.isSub ? '/sub-plot' : ''}`,
        data,
        navigation,
        {},
        dispatch,
    );
};

export const getInvites = ({ page = 1, perPage = 100 }, navigation, dispatch) => {
    return http.get(`api/invite/user?page=${page}&perPage=${perPage}`, null, navigation, dispatch);
};
export const getInvitesByPlotID = ({ id, page = 1, perPage = 100 }, navigation, dispatch) => {
    return http.get(
        `api/invite/plot/${id}?page=${page}&perPage=${perPage}`,
        {},
        navigation,
        dispatch,
    );
};

/**
 * @description Cancel invite
 * @param {string} inviteID
 * @param {import('@react-navigation/native').NavigationProp} navigation
 * @param {import('@reduxjs/toolkit').Dispatch} dispatch
 */
export const cancelInvite = async (inviteID, navigation, dispatch) => {
    return await http.post(`api/invite/cancel/${inviteID}`, null, navigation, {}, dispatch);
};

export const updateAvatar = (data, navigation, dispatch) => {
    return http.patch(
        `api/user/updateAvatar`,
        data,
        navigation,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
        dispatch,
    );
};

// is public
export const getNeighborByPlotID = (id, navigation, dispatch) => {
    return http.get(`api/neighbor/${id}`, null, navigation, dispatch);
};

export const getVersionAppApi = () => {
    return http.get('api/version');
};

// contract
// contract/rate/contractId
export const rateContract = (contractId, data, navigation, dispatch) => {
    return http.post(`api/contracts/rate/${contractId}`, data, navigation, {}, dispatch);
};

// /contracts/{contractId}/transfer-creator-right
export const getContractTransferRequest = (contractId, navigation, dispatch) => {
    return http.get(
        `api/contracts/${contractId}/transfer-creator-right`,
        null,
        navigation,
        dispatch,
    );
};
// /contract/:contractId/history
export const getContractHistory = (contractId, navigation, dispatch) => {
    return http.get(`api/contracts/${contractId}/history`, null, navigation, dispatch);
};

// /contracts/:contractId/signer-certificates
export const getSignerCertificates = (contractId, navigation, dispatch) => {
    return http.get(`api/contracts/${contractId}/signer-certificates`, null, navigation, dispatch);
};

// /contracts/{contractId}/transfer-creator-right
export const transferCreatorRight = (contractId, data, navigation, dispatch) => {
    return http.post(
        `api/contracts/${contractId}/transfer-creator-right`,
        data,
        navigation,
        {},
        dispatch,
    );
};

// /v2/contracts/{contractId}/transfer-creator-right
export const acceptTransferReq = (contractId, data, navigation, dispatch) => {
    return http.put(
        `api/v2/contracts/${contractId}/transfer-creator-right`,
        data,
        navigation,
        {},
        dispatch,
    );
};

// /v2/contracts/{contractId}/sign-contract
export const signContractV2 = (contractId, data, navigation, dispatch) => {
    return http.post(
        `api/v2/contracts/${contractId}/sign-contract`,
        data,
        navigation,
        {},
        dispatch,
    );
};

export const replyTransferReq = (contractId, data, navigation, dispatch) => {
    return http.put(
        `api/contracts/${contractId}/transfer-creator-right`,
        data,
        navigation,
        {},
        dispatch,
    );
};

export const createContract = (data, navigation, dispatch) => {
    return http.post(
        'api/contracts',
        data,
        navigation,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
        dispatch,
    );
};
export const getContractById = (contractId) => {
    return http.get(`api/contracts/${contractId}`);
};
export const getContractByDID = (did) => {
    return http.get(`api/contracts/${did}/by-did`);
};
export const signContractByBorrower = (did, data, navigation, dispatch) => {
    return http.post(`api/contracts/${did}/borrower`, data, navigation, {}, dispatch);
};
export const getAllContractOfUser = () => {
    return http.get('api/contracts/by-user');
};
export const updateContractCosigner = (did, data, navigation, dispatch) => {
    return http.put(`api/contracts/${did}/borrower`, data, navigation, {}, dispatch);
};
export const signContractByUnderwriter = (contractId, data, navigation, dispatch) => {
    return http.post(`api/v2/contracts/${contractId}/activate`, data, navigation, {}, dispatch);
};
export const signContractByCosigner = (did, data, navigation, dispatch) => {
    return http.post(`api/contracts/${did}/co-signer`, data, navigation, {}, dispatch);
};
export const cosignerDeclineContract = (did, navigation, dispatch) => {
    return http.delete(`api/contracts/${did}/co-signer`, {}, navigation, dispatch);
};
export const choseActionNotification = (data, navigation, dispatch) => {
    return http.post(`api/notification/chose-action`, data, navigation, {}, dispatch);
};
export const borrowerRequestUnlock = (did, navigation, dispatch) => {
    return http.post(
        `api/contracts/borrower/request-to-unlock`,
        {
            contractDid: did,
        },
        navigation,
        {},
        dispatch,
    );
};
export const contractCreatorResponseUnlock = (data, navigation, dispatch) => {
    return http.post('api/contracts/underwriter/accept-or-reject', data, navigation, {}, dispatch);
};
export const borrowerRequestCmlUnlock = (data, navigation, dispatch) => {
    return http.post(
        'api/contracts/borrower/request-cml-to-unlock',
        data,
        navigation,
        {},
        dispatch,
    );
};
export const updateContractProof = (data, navigation, dispatch) => {
    return http.put(
        'api/contracts/request-cml-to-unlock/upload-proof',
        data,
        navigation,
        {},
        dispatch,
    );
};
export const inviteContractSigners = (contractId, data, navigation, dispatch) => {
    return http.post(`api/contracts/${contractId}/invites`, data, navigation, {}, dispatch);
};

// get invites by contract id, /contracts/{contractId}/invites
export const getInvitesByContractId = (contractId, navigation, dispatch) => {
    return http.get(`api/contracts/${contractId}/invites`, null, navigation, dispatch);
};

// revoke invite, /contracts/{contractId}/invites/revoke
export const revokeInvite = (contractId, data, navigation, dispatch) => {
    return http.post(`api/contracts/${contractId}/invites/revoke`, data, navigation, {}, dispatch);
};
// sign contract by pass, /contracts/{contractId}/invites/by-password
export const signContractByPass = (contractId, data, navigation, dispatch) => {
    return http.put(
        `api/contracts/${contractId}/invites/by-password`,
        data,
        navigation,
        {},
        dispatch,
    );
};
// /contracts/{contractId}/mark
export const markContract = (contractId, data, navigation, dispatch) => {
    return http.post(`api/contracts/${contractId}/mark`, data, navigation, {}, dispatch);
};

// creator unlock contract, /contracts/{contractDid}/completed
export const unlockContract = (contractId, navigation, dispatch) => {
    return http.post(`api/contracts/${contractId}/completed`, null, navigation, {}, dispatch);
};

// get invite belong to user, /contracts/invites
export const getInvitesByUser = (navigation, dispatch) => {
    return http.get(`api/contracts/invites`, null, navigation, dispatch);
};

// signer accept or reject, /contracts/{contractId}/invites
export const acceptOrRejectInvite = (contractId, data, navigation, dispatch) => {
    return http.put(`api/contracts/${contractId}/invites`, data, navigation, {}, dispatch);
};
// search and filter contract, /contracts/search-filters
export const searchAndFilterContract = (
    data,
    query = {
        page: 1,
        perPage: 1000000000,
    },
    navigation,
    dispatch,
) => {
    let queryString = '';
    for (let key in query) {
        queryString += `${key}=${query[key]}&`;
    }
    return http.post(`api/contracts/search-filters?${queryString}`, data, navigation, {}, dispatch);
};
// /plot/become-claimant/{plotId}
export const becomeClaimant = (plotId, data, navigation, dispatch) => {
    return http.post(`api/plot/become-claimant/${plotId}`, data, navigation, {}, dispatch);
};
// /plot/claimant-requests/requestor
export const getClaimantRequests = (navigation, dispatch) => {
    return http.get(`api/plot/claimant-requests/requestor`, null, navigation, dispatch);
};

// /plot/claimant-requests/claimant
export const getClaimantRequestsAsClaimant = (navigation, dispatch) => {
    return http.get(`api/plot/claimant-requests/claimant`, null, navigation, dispatch);
};
// /plot/approve-claimant/{claimantRequestId}
export const approveClaimant = (claimantRequestId, navigation, dispatch) => {
    return http.post(
        `api/plot/approve-claimant/${claimantRequestId}`,
        null,
        navigation,
        {},
        dispatch,
    );
};

// /plot/reject-claimant/{claimantRequestId}
export const rejectClaimant = (claimantRequestId, navigation, dispatch) => {
    return http.post(
        `api/plot/reject-claimant/${claimantRequestId}`,
        null,
        navigation,
        {},
        dispatch,
    );
};

// momo api
export const checkMomoPayment = (txId, navigation, dispatch) => {
    return http.get(
        'api/payment/momo/request-to-pay-status?transactionId=' + txId,
        null,
        navigation,
        dispatch,
    );
};
export const addMomoAccount = (data, navigation, dispatch) => {
    return http.post('api/user/update-msisdn', data, navigation, {}, dispatch);
};
export const deleteMomoAccount = (id, navigation, dispatch) => {
    return http.delete(`api/user/delete-msisdn/${id}`, {}, navigation, dispatch);
};
export const momoChargeCreator = (data, navigation, dispatch) => {
    return http.post(`api/payment/momo/request-to-pay`, data, navigation, {}, dispatch);
};
export const checkContractPaymentStatus = (did, navigation, dispatch) => {
    return http.post(
        `api/payment/momo/request-to-pay/by-did`,
        {
            did,
        },
        navigation,
        dispatch,
    );
};

//
export const searchPeople = (data) => {
    return http.post('api/user/search-by-phone', data);
};

export const getCertificateOfUser = (data) => {
    return http.get('api/user/certificates', data);
};
export const getSeedPhrase = (navigation, dispatch) => {
    return http.get('api/user/seed-phrase', null, navigation, dispatch);
};
export const updateSeedPhrase = (data, navigation, dispatch) => {
    return http.put('api/user/seed-phrase', data, navigation, {}, dispatch);
};
export const updateProfile = (data, navigation, dispatch) => {
    return http.put('api/user/update-profile', data, navigation, {}, dispatch);
};
export const updatePhoneNumber = (data, navigation, dispatch) => {
    return http.put('api/v2/user/update-sim', data, navigation, {}, dispatch);
};
// is public
export const getSecretQuestion = () => {
    return http.get('api/user/secret-question');
};

export const getUserProfileHistory = (data, navigation, dispatch) => {
    return http.post('api/user/get-public-profile-history', data, navigation, {}, dispatch);
};

export const addSecretQuestionToUser = (data, navigation, dispatch) => {
    return http.post('api/user/secret-question', data, navigation, {}, dispatch);
};
export const updateSecretQuestionToUser = (data, navigation, dispatch) => {
    return http.put('api/user/secret-question', data, navigation, {}, dispatch);
};
export const checkUserHasSecretQuestion = (navigation, dispatch) => {
    return http.get('api/user/secret-question/exist', null, navigation, dispatch);
};
export const verifySecretQuestion = (data, navigation, dispatch) => {
    return http.post('api/user/secret-question/verify', data, navigation, {}, dispatch);
};

export const verifySecretQuestionWithoutAuth = (data, navigation, dispatch) => {
    return http.post(
        'api/user/secret-question/verify-without-auth',
        data,
        navigation,
        {},
        dispatch,
    );
};

export const replacePhoneNumber = (data, navigation, dispatch) => {
    return http.put('api/user/v2/update-sim-sq', data, navigation, {}, dispatch);
};

export const getPlotsByRectangleLimited = (data, navigation, dispatch) => {
    return http.post('api/claimchain/by-rectangle/public/limited', data, navigation, {}, dispatch);
};
export const registerFcmToken = (data, navigation, dispatch) => {
    return http.post('api/user/update-fcm-token', data, navigation, {}, dispatch);
};
export const _deleteFcmToken = (data, navigation, dispatch) => {
    return http.post('api/user/delete-fcm-token', data, navigation, {}, dispatch);
};

export const logoutApi = (data) => {
    return http.post('api/user/signout', data);
};

// export const getFcmToken = () => {
//     return http.get('api/user/get-fcm-token');
// };

export const getUserCert = (navigation, dispatch) => {
    return http.get('api/user/certificates', null, navigation, dispatch);
};

export const getCenterLargestClaimChain = (data, navigation, dispatch) => {
    return http.get('api/claimchain/largest-claimchain', data, navigation, {}, dispatch);
};

export const getAllPlotFlagged = (data, navigation, dispatch) => {
    return http.get('api/plot/get-flagged-plot/all', data, navigation, {}, dispatch);
};

export const inviteClaimantPlotFlagged = (data, navigation, dispatch) => {
    return http.post('api/invite/claimant', data, navigation, {}, dispatch);
};

export const getInvitesByPlotFlagged = ({ id, page = 1, perPage = 100 }, navigation) => {
    return http.get(
        `api/invite/plot/${id}?forFlag=true&page=${page}&perPage=${perPage}`,
        {},
        navigation,
    );
};
// /credentials/view-user-certificate/{userId}
export const getAllUserCert = (userID, navigation, dispatch) => {
    return http.get('api/credentials/view-user-certificate/' + userID, navigation, dispatch);
};
export const viewCertification = (id, navigation, dispatch) => {
    return http.get('api/credentials/view-certificate/' + id, navigation, {}, dispatch);
};

export const requestCertByToken = (id, navigation, dispatch) => {
    return http.post(
        `api/credentials/request-land-certificate/${id}/by-token`,
        {},
        navigation,
        {},
        dispatch,
    );
};

export const getPlotFlaggedBoundaryImage = (id, navigation, dispatch) => {
    return http.get(`api/plot/${id}/all-boundary?forFlag=true`, null, navigation, dispatch);
};

export const uploadBoundaryFlagged = ({ data, plotId, long, lat }, navigation, dispatch) => {
    return http.post(
        `api/plot/boundary?plotID=${plotId}&long=${long}&lat=${lat}&forFlag=true`,
        data,
        navigation,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
        dispatch,
    );
};
export const updateBoundaryFlagged = ({ data, plotId, long, lat }, navigation) => {
    return http.post(
        `api/plot/update-boundary?plotID=${plotId}&long=${long}&lat=${lat}&forFlag=true`,
        data,
        navigation,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );
};
export const getUserCertificates = (navigation, dispatch) => {
    return http.get('api/user/certificates', navigation, {}, dispatch);
};

export const getViewCertificationByPlot = (id, navigation, dispatch) => {
    return http.get(`api/credentials/view-certificate/${id}/by-plot`, navigation, {}, dispatch);
};

export const requestLandCertificate = (id, navigation, dispatch) => {
    return http.post(
        'api/credentials/request-land-certificate/' + id,
        {},
        navigation,
        {},
        dispatch,
    );
};

export const requestLandCertificateByClaimant = (claimantId, navigation, dispatch) => {
    return http.post(
        `api/credentials/request-land-certificate/${claimantId}/by-claimant`,
        {},
        navigation,
        {},
        dispatch,
    );
};
export const getAllNotification = ({ page = 1, perPage = 20 }, config) => {
    return http.get(`api/notification?page=${page}&perPage=${perPage}`, config);
};

export const markReadNotification = (data) => {
    return http.put(`api/notification/`, data);
};

export const searchByPhone = (data, navigation, dispatch) => {
    return http.post('api/user/search-by-phone', data, navigation, {}, dispatch);
};

export const createSubPlot = (data) => {
    return http.post('api/sub-plots', data);
};

export const signinFromTrainer = (data, navigation, dispatch) => {
    return http.post('api/v2/user/sign-in-from-trainer', data, navigation, {}, dispatch);
};
export const signinFromTrainerWithPassword = (data, navigation, dispatch) => {
    return http.post('api/user/sign-in-from-trainer', data, navigation, {}, dispatch);
};

export const getTrainerLog = () => {
    return http.get('api/user/get-trainer-log');
};

export const getCertHash = (claimantId, navigation, dispatch) => {
    return http.get(`api/credentials/the-hash/${claimantId}`, navigation, {}, dispatch);
};

/**
 * Transfers ownership of a plot to the claimant.
 *
 * @param {Object} data - The data required for the transfer.
 * @param {string} plotId - The ID of the plot to transfer ownership.
 * @param {Object} navigation - The navigation object for redirecting after the transfer.
 * @param {Object} dispatch - The dispatch function for dispatching actions after the transfer.
 * @return {Promise} A promise that resolves with the result of the transfer.
 *
 * @example
 * data = {
 *    "nominatedOwnerId": '6115b5a5f32d3f3c5e28a7f0',
 * }
 */
export const transferOwnershipToClaimant = ({ data, plotId }, navigation, dispatch) => {
    return http.post(
        `api/plot/${plotId}/transfer-ownership/request/otp`,
        data,
        navigation,
        {},
        dispatch,
    );
};

export const responseToTransferOwnership = ({ data, plotId }, navigation, dispatch) => {
    return http.put(
        `api/plot/${plotId}/transfer-ownership/request`,
        data,
        navigation,
        {},
        dispatch,
    );
};

export const assignOfflinePlot = (data, navigation, dispatch) => {
    return http.post(`api/plot/assign-plot`, data, navigation, {}, dispatch);
};

export const getPlotWaitAssign = (id, navigation, dispatch) => {
    return http.get(`api/plot/assign-plot?id=${id}`, navigation, {}, dispatch);
};

export const getCountedPlot = (id, navigation, dispatch) => {
    return http.get(`api/plot/count-plot/by-id?id=${id}`, navigation, {}, dispatch);
};

export const getClosedCenterPlots = ({ long, lat }, navigation, dispatch) => {
    return http.get(
        `api/plot/get-closed/by-points?long=${long}&lat=${lat}`,
        navigation,
        {},
        dispatch,
    );
};

export const respondAssignOfflinePlot = (data, navigation, dispatch) => {
    return http.post(`api/plot/assign-plot/respond`, data, navigation, {}, dispatch);
};

export const voteTransferOwnership = ({ data, plotId }, navigation, dispatch) => {
    return http.post(`api/plot/${plotId}/transfer-ownership/vote`, data, navigation, {}, dispatch);
};

export const requestWithdrawOwnership = ({ data, plotId }, navigation, dispatch) => {
    return http.post(`api/plot/${plotId}/withdraw-claim/otp`, data, navigation, {}, dispatch);
};

export const voteWithdrawOwnership = ({ data, plotId }, navigation, dispatch) => {
    return http.post(`api/plot/${plotId}/withdraw-claim/vote`, data, navigation, {}, dispatch);
};

export const createEditPlotPolygon = ({ data, plotId }, navigation, dispatch) => {
    const url = `api/plot/edit-plot/${plotId}`;
    return http.post(url, data, navigation, {}, dispatch);
};

export const getEditPlotPolygon = (plotId, navigation, dispatch) => {
    return http.get(`api/plot/edit-plot/${plotId}`, navigation, {}, dispatch);
};

export const voteEditPlotPolygon = ({ data, voteId }, navigation, dispatch) => {
    return http.put(`api/plot/edit-plot/vote/${voteId}`, data, navigation, {}, dispatch);
};

export const getEditPlotPolygonHistory = (plotId, navigation, dispatch) => {
    return http.get(`api/plot/edit-plot/${plotId}/history`, navigation, {}, dispatch);
};

export const getEditPlotPolygonBeDispute = (plotId, navigation, dispatch) => {
    return http.get(`api/plot/dispute-with-edit-plot/${plotId}`, navigation, {}, dispatch);
};

// plot/claimrank-text-helper
export const getClaimRankText = (data, navigation, dispatch) => {
    return http.post(`api/plot/claimrank-text-helper`, data, navigation, {}, dispatch);
};

// /mark-history/:contractId
export const getMarkHistory = (contractId, navigation, dispatch) => {
    return http.get(`api/mark-history/${contractId}`, navigation, {}, dispatch);
};

export const getRecommendation = (navigation, dispatch) => {
    return http.get('api/user/ask-for-recommendation', null, navigation, dispatch);
};

export const createRecommendation = (data, navigation, dispatch) => {
    return http.post('api/user/ask-for-recommendation', data, navigation, {}, dispatch);
};

// api/user/attestation-stamp POST
export const attestPlot = (data, navigation, dispatch) => {
    return http.post('api/user/attestation-stamp', data, navigation, {}, dispatch);
};

/**
 * @description Get the IP address of the device.
 * @returns {Promise<import('../types/FreeIpApiRes').FreeIpApiRes>}
 */
export const getDeviceIp = async () => {
    // random user agent
    let userAgent = randomUseragent.getRandom();
    return await axios
        .get(Constants.freeIpApi, {
            headers: {
                'user-agent': userAgent,
            },
        })
        .then((res) => res.data);
};

// /api/user/face-search
export const faceSearch = (data) => {
    return axios.post(getBackendServer() + 'api/user/face-search', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            authorization:
                'Bearer ' + '36d17398a417b8a2405c38bd0dac90e9e0d517ded77ac7e4008dd24f8931c9f6',
        },
    });
};
export const faceDetect = (data) => {
    return axios.post(getBackendServer() + 'api/user/face-detect/object-key', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            authorization:
                'Bearer ' + '36d17398a417b8a2405c38bd0dac90e9e0d517ded77ac7e4008dd24f8931c9f6',
        },
        timeout: 120000, // 60 seconds timeout
    });
};

// api/user/face-compare
export const faceCompare = (data) => {
    return axios.post(getBackendServer() + 'api/user/face-compare', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            authorization:
                'Bearer ' + '36d17398a417b8a2405c38bd0dac90e9e0d517ded77ac7e4008dd24f8931c9f6',
        },
    });
};

// /face-compare/object-key
export const faceCompareObjectKey = (data) => {
    return axios.post(getBackendServer() + 'api/user/face-compare/object-key', data, {
        headers: {
            authorization:
                'Bearer ' + '36d17398a417b8a2405c38bd0dac90e9e0d517ded77ac7e4008dd24f8931c9f6',
        },
    });
};
