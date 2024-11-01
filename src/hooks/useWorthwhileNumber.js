import useShallowEqualSelector from '../redux/customHook/useShallowEqualSelector';
export default function useWorthwhileNumber() {
    const worthwhileNumber = useShallowEqualSelector((state) => state.map.worthwhileNumber);
    return worthwhileNumber;
}
