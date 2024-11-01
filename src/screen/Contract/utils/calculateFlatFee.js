export const calculateFlatFee = (amount) => {
    amount = Number(amount);
    let fee = 0;
    fee = amount * 0.01;

    if (fee < 3760) {
        fee = 3760;
    }
    fee = fee.toFixed(3);
    //remove 0 at the end
    fee = Number(fee);
    return fee;
};
