import useShallowEqualSelector from '../redux/customHook/useShallowEqualSelector';

const useUserInfo = () => {
    const user = useShallowEqualSelector((state) => state.user.userInfo);
    return user;
};

export default useUserInfo;
