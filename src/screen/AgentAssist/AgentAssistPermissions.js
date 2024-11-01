import React from 'react';
import Header from '../../components/Header';
import { Center, ScrollView, Text } from 'native-base';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import RowAgent from './components/RowAgent';
import useTranslate from '../../i18n/useTranslate';
import Empty from '../../components/Icons/Empty';

const AgentAssistPermissions = () => {
    const map = useShallowEqualSelector((state) => state.map);
    const agentPermissions = map?.agentPermissions || [];
    const t = useTranslate();

    return (
        <>
            <Header title="Agent Assist Permissions"></Header>
            <ScrollView>
                {agentPermissions.map((item, index) => (
                    <RowAgent key={index} data={item}></RowAgent>
                ))}
                {!agentPermissions?.length && (
                    <Center mt="50%" justifyContent={'center'}>
                        <Empty />

                        <Text mt="10px" px="40px" textAlign={'center'}>
                            {t('agentAssist.noAgentPermission')}
                        </Text>
                    </Center>
                )}
            </ScrollView>
        </>
    );
};

export default AgentAssistPermissions;
