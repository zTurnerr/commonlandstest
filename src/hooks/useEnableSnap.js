import { useDisclose } from 'native-base';

const useEnableSnap = () => {
    const { isOpen: isEnableSnap, onClose: turnOffSnap, onOpen: turnOnSnap } = useDisclose(true);
    const { isOpen: isOpenModalEnable, onClose: onCloseModal, onOpen: onOpenModal } = useDisclose();

    const onToggleSwitch = () => {
        if (isEnableSnap) {
            turnOffSnap();
        } else {
            turnOnSnap();
            onOpenModal();
        }
    };

    return {
        isEnableSnap,
        isOpenModalEnable,
        onOpenModal,
        onToggleSwitch,
        onCloseModal,
    };
};

export default useEnableSnap;
