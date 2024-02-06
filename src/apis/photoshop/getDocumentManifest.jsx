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
import {Button, Heading, Flex, View, ComboBox, Item, TextArea, Image} from '@adobe/react-spectrum';
import { getSignedURL, listObjects } from "~/utils/aws-client";
import { initSDK } from "~/utils/ps-api-client";
import psApiLib from '@adobe/aio-lib-photoshop-api';
import { displayError} from "~/utils/display-utils";

const GetDocumentManifest = () => {
    const [fileList, setFileList] = React.useState([]);
    const [inputFileName, setInputFileName] = React.useState(null);
    const [outputFileName, setOuputFileName] = React.useState(null);
    const [imageSrc, setImageSrc] = React.useState(null);
    const [inputImageURL, setInputImageURL] = React.useState(null);


    const getManifest = async () => {
        const sdk = await initSDK();
        if(inputFileName === null) {
            displayError('Input file must be provided');
        } else {
            try {
                const input = {
                    href: inputImageURL,
                    storage: psApiLib.Storage.EXTERNAL,
                }
                  
                  const manifest = await sdk.getDocumentManifest(input);
                  console.log(manifest.outputs);
                  setImageSrc(manifest.outputs);
            } catch (e) {
                console.log(e);
                displayError(`Get Document Manifest: ${e}`);
            }
        }
    }

    const getFileList = async () => {
        const files = await listObjects('inputs');
        const images = [];
        files.map((file, index) => {
            const filename = file.Key.split('/')[1];
            if(filename.toLowerCase().endsWith('psd')) {
                images.push({id:index, name: filename})
            }
        });
        setFileList(images);
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
            <Heading level={1}>Get Document Manifest</Heading>
            <Flex direction={'row'} gap={10} alignItems={'end'}>
                <ComboBox label='Select an input image' defaultItems={fileList} isRequired onInputChange={handleInputImageSelection}>
                    {item => <Item>{item.name}</Item>}
                </ComboBox>
                <Button variant='cta' onPress={() => getManifest()}>Get Manifest</Button>
            </Flex>
            <Flex direction={'row'} gap={20} alignItems={'end'}>
                <View>
                    <Flex direction={'column'} gap={10}>
                        
                        {(inputImageURL !== null && !inputFileName.toLowerCase().endsWith("psd")) && 
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
                            <TextArea height={600} width={800} defaultValue={JSON.stringify(imageSrc)}></TextArea>
                        </>
                    }
                </View>
            </Flex>
            
        </Flex>
    );
}
export default GetDocumentManifest;
