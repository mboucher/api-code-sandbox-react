/* ************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2024 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
**************************************************************************/

import React from 'react';
import {Heading, Flex, Text} from '@adobe/react-spectrum';

const LandingPage = () => {
    return(
        <Flex direction={'column'} width={'100%'}>
            <Heading level={1}>Welcome to the Creative Cloud API Kitchen Sink</Heading>
            <Text>Select one of the menu options in the navigation bar. Each API page contains the instructions and information about what options to choose.</Text>
        </Flex>
        
    )
}

export default LandingPage;