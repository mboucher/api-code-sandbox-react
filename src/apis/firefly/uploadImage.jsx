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
import { Flex, Button, Image, View } from '@adobe/react-spectrum';
import {FileTrigger} from 'react-aria-components';
import { fileUpload } from '../../utils/firefly-api-client';


const ImportImage = () => {
    const [fileSrc, setFileSrc] = React.useState(null);

    const handleFileUpload = async (selection) => {
        const files = Array.from(selection);
        files.map(file => {
            console.log(file.path);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                setFileSrc(event.target.result);
            }
            setFileSrc(file);
            const ref = fileUpload(file);
        })
    }
    return (
        <Flex direction={'column'}>
            <FileTrigger onSelect={(files) => handleFileUpload(files)}>
                <Button variant='primary'>Upload File</Button>
            </FileTrigger>
            <View maxWidth={400}>
                <Image src={fileSrc}/>
            </View>
        </Flex>
    )

}

export default ImportImage;