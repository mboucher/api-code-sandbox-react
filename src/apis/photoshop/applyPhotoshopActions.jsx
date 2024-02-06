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

import React, { useEffect } from "react";
import {Button, Heading, Flex, View, ComboBox, Item, TextField, Image} from '@adobe/react-spectrum';
import { getSignedURL, listObjects } from "~/utils/aws-client";
import { initSDK } from "~/utils/ps-api-client";
import psApiLib from '@adobe/aio-lib-photoshop-api';
import { displayError} from "~/utils/display-utils";

const ApplyPhotoshopActions = () => {
    const [fileList, setFileList] = React.useState([]);
    const [actionList, setActionList] = React.useState([]);
    const [inputFileName, setInputFileName] = React.useState(null);
    const [inputActionFileName, setInputActionFileName] = React.useState(null);
    const [outputFileName, setOuputFileName] = React.useState(null);
    const [imageSrc, setImageSrc] = React.useState(null);
    const [inputImageURL, setInputImageURL] = React.useState(null);


    const applyActions = async () => {
        const sdk = await initSDK();
        if(inputFileName === null || outputFileName === null || inputActionFileName === null) {
            displayError('Input file, preset file and output filename must be provided');
        } else {
            try {
                const input = {
                    href: inputImageURL,
                    storage: psApiLib.Storage.EXTERNAL,
                  }
                  const options = {
                    actions: [
                      {
                        href: await getSignedURL('getObject',`inputs/${inputActionFileName}`),
                        storage: psApiLib.Storage.EXTERNAL,
                      }
                    ]
                  }
                  const output = {
                    href: await getSignedURL('putObject', `output/${outputFileName}`),
                    storage: psApiLib.Storage.EXTERNAL,
                    type: psApiLib.MimeType.PNG
                  }
                  await sdk.applyPhotoshopActions(input, output, options);
                  const imageURL = await getSignedURL('getObject', `output/${outputFileName}`);
                  setImageSrc(imageURL);
            } catch (e) {
                console.log(e);
                displayError(`Create Mask Error: ${e}`);
            }
        }
    }

    const getFileList = async () => {
        const files = await listObjects('inputs');
        const images = [];
        const actions = [];
        files.map((file, index) => {
            const filename = file.Key.split('/')[1];
            if(filename.toLowerCase().endsWith('atn')) {
                actions.push({id:index, name: filename});
            } else if(!filename.toLowerCase().endsWith('psd') && !filename.toLowerCase().endsWith('xmp') ) {
                images.push({id:index, name: filename})
            }
        });
        setFileList(images);
        setActionList(actions);
    }

    useEffect(() => {
        getFileList();
    },[]);

    const handleInputImageSelection = async (selection) => {
        setInputFileName(selection);
        const signedURL = await getSignedURL('getObject',`inputs/${selection}`);
        setInputImageURL(signedURL);
    }

    return(
        <Flex direction={'column'} gap={10}>
            <Heading level={1}>Apply Photoshop Actions</Heading>
            <Flex direction={'row'} gap={10} alignItems={'end'}>
                <ComboBox label='Select an input image' defaultItems={fileList} isRequired onInputChange={handleInputImageSelection}>
                    {item => <Item>{item.name}</Item>}
                </ComboBox>
                <ComboBox label='Select an action file' defaultItems={actionList} isRequired onInputChange={setInputActionFileName}>
                    {item => <Item>{item.name}</Item>}
                </ComboBox>
                <TextField label='Output Image File Name' name='outputFileName' isRequired onChange={setOuputFileName}/>
                <Button variant='cta' onPress={() => applyActions()}>Apply Actions</Button>
            </Flex>
            <Flex direction={'row'} gap={20} alignItems={'end'}>
                <View>
                    <Flex direction={'column'} gap={10}>
                        
                        {inputImageURL !== null && 
                        <>
                            <Heading>Selected Input Image</Heading>
                            <Image src={inputImageURL}/>
                        </>
                        }
                    </Flex>
                    
                </View>
                <View>
                    {imageSrc !== null &&
                        <>
                            <Heading>Result from Photoshop API</Heading>
                            <Image src={imageSrc}/>
                        </>
                    }
                </View>
            </Flex>
            
        </Flex>
    );
}
export default ApplyPhotoshopActions;
