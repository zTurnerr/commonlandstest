import React from 'react';
import { HStack, Text } from 'native-base';
import CheckCircle from '../Icons/CheckCircle';
import useTranslate from '../../i18n/useTranslate';
import { useModalAttestInfo } from '../Modal/ModalAttestInfo';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { isAttested } from '../../util/plot/attestation';

const AttestedTag = ({ _container = {}, noModal = false, plotData = {} }) => {
    const t = useTranslate();
    const modalAttestInfoHook = useModalAttestInfo();
    if (!isAttested(plotData)) return null;
    return (
        <>
            {!noModal &&
                modalAttestInfoHook.Component({
                    plotData: plotData,
                })}
            <TouchableOpacity onPress={noModal ? null : modalAttestInfoHook.open}>
                <HStack
                    px="10px"
                    borderRadius={'17px'}
                    alignItems={'center'}
                    bg={'#E0FFF4'}
                    space={1}
                    py="5px"
                    {..._container}
                >
                    <CheckCircle width={16} height={16} color="#155244" />
                    <Text color="#155244" fontWeight={500} fontSize={'10px'}>
                        {t('plot.attested')}
                    </Text>
                </HStack>
            </TouchableOpacity>
        </>
    );
};

export default AttestedTag;
