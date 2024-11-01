export const getUserRating = (contract, userId) => {
    const ratingObj = contract?.rating;
    let res = null;
    ratingObj?.signerRating?.forEach((ratingItem) => {
        if (ratingItem?.signer === userId && ratingItem?.isRated) {
            res = ratingItem?.rating;
        }
    });

    // ratingObj?.creatorRating?.forEach((ratingItem) => {
    //     if (ratingItem?.signer === userId && ratingItem?.isRated) {
    //         res = ratingItem?.rating;
    //     }
    // });
    return res;
};
