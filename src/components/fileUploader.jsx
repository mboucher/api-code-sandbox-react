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
import { Button, Flex, Image, Text, ProgressCircle } from '@adobe/react-spectrum';
import {FileTrigger} from 'react-aria-components';
import { fileUpload } from '../utils/firefly-api-client';
import { displayError } from '../utils/display-utils';

const FileUploader = ({onUpload, label}) => {
    const [fileSrc, setFileSrc] = React.useState(null);
    const [fileName, setFileName] = React.useState(null);
    const [uploadState, setUploadState] = React.useState(null);

    const handleFileUpload = async (selection) => {
        const files = Array.from(selection);
        const file = files[0];
        try{
            setUploadState('uploading');
            const ref = await fileUpload(file);
            setUploadState('uploaded');
            
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                setFileSrc(event.target.result);
            }
            setFileName(file.name);
            onUpload(ref);
        } catch (e) {
            displayError(`Unable to upload file: ${e}`);
        }
    }

    return(
        <Flex direction={'column'} gap={20}>
            <FileTrigger onSelect={(files) => handleFileUpload(files)}>
                <Button variant='primary'>{label}</Button>
            </FileTrigger>

            {uploadState === 'uploading' &&
                <Flex direction={'column'} alignItems={'center'}>
                    <ProgressCircle isIndeterminate size='M'/>
                </Flex>                
            }
            {uploadState === 'uploaded' && 
                <>
                    <Text>{fileName}</Text>
                    <Image src={fileSrc}/>
                </>
            }
            
        </Flex>
    )
}

export default FileUploader;