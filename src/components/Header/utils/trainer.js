export const CheckExistTrainer = (trainer, user) => {
    const res =
        !trainer || Object.keys(trainer).length === 0 || trainer?._id === user?.userInfo?._id;
    return res;
};
