import { Actionsheet } from 'native-base';
import React from 'react';
import InvitePeopleForm from '../../../components/InvitePeopleForm';

export default function Index({
    isOpen,
    onClose,
    onPress,
    buttonLabel,
    buttonProps = {},
    list,
    setList,
    validateData,
}) {
    const onInvites = async () => {
        try {
            await onPress();
            onClose();
        } catch (err) {
            throw err;
        }
    };
    return (
        <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
            <Actionsheet.Content>
                <InvitePeopleForm
                    onPress={onInvites}
                    buttonLabel={buttonLabel}
                    buttonProps={buttonProps}
                    list={list}
                    setList={setList}
                    validateData={validateData}
                />
            </Actionsheet.Content>
        </Actionsheet>
    );
}
