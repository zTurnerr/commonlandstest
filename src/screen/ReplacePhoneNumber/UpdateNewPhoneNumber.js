import { Box } from 'native-base';
import React from 'react';
import { UpdateSimContext } from '.';
import GetPinForm from '../Welcome/GetPinForm';

export default function Index({ onVerifiedOTP }) {
    const updateSimContext = React.useContext(UpdateSimContext);
    return (
        <Box h={'full'} alignItems="center" justifyContent="center" w="full">
            <GetPinForm
                containerProps={{ w: 'full', pt: '20%', px: '0px', scrollEnabled: false }}
                hideLogo={true}
                onVerifiedOTP={onVerifiedOTP}
                type="updateSim"
                setBackToGetPinFunction={(f) => {
                    updateSimContext?.setBackToGetPinFunction(() => f);
                }}
                saveCountryCode={true}
            />
        </Box>
    );
}
