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
import {
    Button, 
    Heading, 
    Flex, 
    View, 
    ComboBox, 
    Item, 
    TextField, 
    Image,
    Text,
    ProgressCircle
} from '@adobe/react-spectrum';
import { getSignedURL, listObjects } from "~/utils/aws-client";
import { initSDK } from "~/utils/ps-api-client";
import psApiLib from '@adobe/aio-lib-photoshop-api';
import { displayError} from "~/utils/display-utils";
import { getFileType, FILETYPE } from "../../utils/file-utils";

const CreateRendition = () => {
    const [isBusy, setIsBusy] = React.useState(false);
    const [fileList, setFileList] = React.useState([]);
    const [inputFileName, setInputFileName] = React.useState(null);
    const [outputFileName, setOuputFileName] = React.useState(null);
    const [imageSrc, setImageSrc] = React.useState([]);
    const [inputImageURL, setInputImageURL] = React.useState(null);


    const editPhoto = async () => {
        const sdk = await initSDK();
        if(inputFileName === null || outputFileName === null) {
            displayError('Input file, preset file and output filename must be provided');
        } else {
            try {
                setIsBusy(true);
                const input = {
                    href: inputImageURL,
                    storage: psApiLib.Storage.EXTERNAL,
                  }
                  const output = [
                    {
                        href: await getSignedURL('putObject', `output/${outputFileName}_001.jpg`),
                        storage: psApiLib.Storage.EXTERNAL,
                        type: psApiLib.MimeType.JPEG,
                        width: 300,
                        quality: 7
                    },
                    {
                        href: await getSignedURL('putObject', `output/${outputFileName}_002.png`),
                        storage: psApiLib.Storage.EXTERNAL,
                        type: psApiLib.MimeType.PNG,
                        width: 260,
                        compression: psApiLib.PngCompression.MEDIUM
                    },
                    {
                        href: await getSignedURL('putObject', `output/${outputFileName}_003.png`),
                        storage: psApiLib.Storage.EXTERNAL,
                        type: psApiLib.MimeType.JPEG,
                        width: 230,
                        quality: 1
                    }
                ]
                  await sdk.createRendition(input, output);
                  const results = [];
                  results.push(await getSignedURL('getObject', `output/${outputFileName}_001.jpg`));
                  results.push(await getSignedURL('getObject', `output/${outputFileName}_002.png`));
                  results.push(await getSignedURL('getObject', `output/${outputFileName}_003.png`));
                  setImageSrc(results);
                  setIsBusy(false);
            } catch (e) {
                setIsBusy(false);
                console.log(e);
                displayError(`Create Mask Error: ${e}`);
            }
        }
    }

    const getFileList = async () => {
        const files = await listObjects('inputs');
        const images = [];
        files.map((file, index) => {
            if(!file.Key.endsWith('/')){
                const filename = file.Key.split('/')[1];
                if(getFileType(filename) === FILETYPE.image) {
                    images.push({id:index, name: filename})
                }
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
            <Heading level={1}>Create Renditions</Heading>
            <Flex direction={'row'} gap={10} alignItems={'end'}>
                <ComboBox label='Select an input image' defaultItems={fileList} isRequired onInputChange={handleInputImageSelection}>
                    {item => <Item>{item.name}</Item>}
                </ComboBox>
                <TextField label='Output Image File Name' name='outputFileName' isRequired onChange={setOuputFileName}/>
                <Button variant='cta' onPress={() => editPhoto()}>
                    <Text>Generate Renditions</Text>
                    {isBusy ? <ProgressCircle size='S' isIndeterminate/> : null}
                </Button>
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
                    {imageSrc.length > 0 &&
                        <>
                            <Heading>Results from Photoshop API</Heading>
                            <Flex direction={'column'} gap={10}>
                                {imageSrc.map(image => {
                                    return(
                                        <Image src={image}/>
                                    )
                                })}
                            </Flex>
                           
                        </>
                    }
                </View>
            </Flex>
            
        </Flex>
    );
}
export default CreateRendition;
