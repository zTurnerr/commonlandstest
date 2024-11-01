import { useDisclose } from 'native-base';
import React, { useEffect } from 'react';
import { checkUserHasSecretQuestion } from '../../../rest_client/apiClient';
import ModalUpdateSecretQuestion from './ModalUpdateSecretQuestion';
import SheetRequireUpdate from './SheetRequireUpdate';

export default function Index() {
    const { isOpen, onOpen, onClose } = useDisclose();
    const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclose();
    const _checkUserHasSecretQuestion = async () => {
        try {
            const res = await checkUserHasSecretQuestion();
            if (!res.data?.hasAnsweredSecretQuestion) {
                onOpen();
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        _checkUserHasSecretQuestion();
    }, []);
    return (
        <>
            <SheetRequireUpdate
                isOpen={isOpen}
                onUpdate={() => {
                    onClose();
                    onOpenModal();
                }}
            />
            <ModalUpdateSecretQuestion isOpen={isOpenModal} onClose={onCloseModal} />
        </>
    );
}
