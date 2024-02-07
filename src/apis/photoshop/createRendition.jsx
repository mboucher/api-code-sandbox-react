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
    Link, 
    Image,
    Text,
    ProgressCircle
} from '@adobe/react-spectrum';
import { getSignedURL, listObjects } from "~/utils/aws-client";
import { initSDK } from "~/utils/ps-api-client";
import psApiLib from '@adobe/aio-lib-photoshop-api';
import { displayError} from "~/utils/display-utils";
import { getFileType, FILETYPE, getUUID } from "../../utils/file-utils";

const CreateRendition = () => {
    const [isBusy, setIsBusy] = React.useState(false);
    const [fileList, setFileList] = React.useState([]);
    const [inputFileName, setInputFileName] = React.useState(null);
    const [imageSrc, setImageSrc] = React.useState([]);
    const [inputImageURL, setInputImageURL] = React.useState(null);


    const editPhoto = async () => {
        const sdk = await initSDK();
        if(inputFileName === null) {
            displayError('Input file must be provided');
        } else {
            try {
                setIsBusy(true);
                const fileId = getUUID();
                const input = {
                    href: inputImageURL,
                    storage: psApiLib.Storage.EXTERNAL,
                  }
                  const output = [
                    {
                        href: await getSignedURL('putObject', `output/${fileId}_001.jpg`),
                        storage: psApiLib.Storage.EXTERNAL,
                        type: psApiLib.MimeType.JPEG,
                        width: 300,
                        quality: 7
                    },
                    {
                        href: await getSignedURL('putObject', `output/${fileId}_002.png`),
                        storage: psApiLib.Storage.EXTERNAL,
                        type: psApiLib.MimeType.PNG,
                        width: 260,
                        compression: psApiLib.PngCompression.MEDIUM
                    },
                    {
                        href: await getSignedURL('putObject', `output/${fileId}_003.png`),
                        storage: psApiLib.Storage.EXTERNAL,
                        type: psApiLib.MimeType.JPEG,
                        width: 230,
                        quality: 1
                    }
                ]
                  await sdk.createRendition(input, output);
                  const results = [];
                  results.push(await getSignedURL('getObject', `output/${fileId}_001.jpg`));
                  results.push(await getSignedURL('getObject', `output/${fileId}_002.png`));
                  results.push(await getSignedURL('getObject', `output/${fileId}_003.png`));
                  setImageSrc(results);
                  setIsBusy(false);
            } catch (e) {
                setIsBusy(false);
                console.log(e);
                displayError(`Create Renditions Error: ${e}`);
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
            <Flex direction={'column'}>
                <Heading level={1}>Create Renditions</Heading>
                <Text>
                Generates renditions from a base document. To know more about this feature refer <Link href="https://developer.adobe.com/photoshop/photoshop-api-docs/features/#rendering--conversions">Renditions</Link>
                </Text>
                <Heading level={3}>Instructions:</Heading>
                <Text>In this example,We are rendering multiple renditions with different quality and sizes.</Text>
                <Text>You can supply additional Photoshop action files using the <Link href="/uploadtoS3">Upload Asset to S3 page</Link>.</Text>
            </Flex>
            <Flex direction={'row'} gap={10} alignItems={'end'}>
                <ComboBox label='Select an input image' defaultItems={fileList} isRequired onInputChange={handleInputImageSelection}>
                    {item => <Item>{item.name}</Item>}
                </ComboBox>
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
                            <Flex width="100%" maxHeigt="400">
                                <Image src={inputImageURL} objectFit="cover"/>
                            </Flex>
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
                                        <Flex width="100%" maxHeigt="400">
                                            <Image src={image} objectFit="cover"/>
                                        </Flex>
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
