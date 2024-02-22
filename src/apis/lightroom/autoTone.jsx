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
    Image,
    Text,
    ProgressCircle,
    Link
} from '@adobe/react-spectrum';
import { getSignedURL, listObjects } from "../../utils/aws-client";
import { initSDK } from "../../utils/ps-api-client";
import psApiLib from '@adobe/aio-lib-photoshop-api';
import { displayError} from "../../utils/display-utils";
import { getFileType, FILETYPE, getUUID } from "../../utils/file-utils";

const AutoTone = () => {
    const [isBusy, setIsBusy] = React.useState(false);
    const [fileList, setFileList] = React.useState([]);
    const [inputFileName, setInputFileName] = React.useState(null);
    const [imageSrc, setImageSrc] = React.useState(null);
    const [inputImageURL, setInputImageURL] = React.useState(null);


    const autoTone = async () => {
        const sdk = await initSDK();
        if(inputFileName === null ) {
            displayError('Input file must be provided');
        } else {
            try {
                const fileID = getUUID();
                setIsBusy(true);
                const input = {
                    href: inputImageURL,
                    storage: psApiLib.Storage.EXTERNAL,
                  }
                  const output = {
                    href: await getSignedURL('putObject', `output/${fileID}.png`),
                    storage: psApiLib.Storage.EXTERNAL,
                    type: psApiLib.MimeType.PNG
                  }
                  await sdk.autoTone(input, output);
                  const imageURL = await getSignedURL('getObject', `output/${fileID}.png`);
                  setImageSrc(imageURL);
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
        const result = [];
        files.map((file, index) => {
            if(!file.Key.endsWith('/')) {
                const filename = file.Key.split('/')[1];
                if(getFileType(filename) === FILETYPE.image) {
                    result.push({id: index, name: filename});
                }
            }
            
        });
        setFileList(result);
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
                <Heading level={1}>Auto Tone</Heading>
                <Text>
                Automatically correct exposure, contrast, sharpness, saturation, etc. To know more about this feature refer <Link href="https://developer.adobe.com/photoshop/photoshop-api-docs/features/#autotone">Auto Tone</Link>
                </Text>
                <Heading level={3}>Instructions:</Heading>
                <Text>In this example, we automatically adjusted the photo using the AutoTone API.</Text>
                <Text>You can supply additional Photoshop action files using the <Link href="/uploadtoS3">Upload Asset to S3 page</Link>.</Text>
            </Flex>
            <Flex direction={'row'} gap={10} alignItems={'end'}>
                <ComboBox label='Select an input image' defaultItems={fileList} isRequired onInputChange={handleInputImageSelection}>
                    {item => <Item>{item.name}</Item>}
                </ComboBox>
                <Button variant='cta' onPress={() => autoTone()}>
                    <Text>Auto Tone</Text>
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
                    {imageSrc !== null &&
                        <>
                            <Heading>Result from Photoshop API</Heading>
                            <Flex width="100%" maxHeigt="400">
                                <Image src={imageSrc} objectFit="cover"/>
                            </Flex>
                        </>
                    }
                </View>
            </Flex>
            
        </Flex>
    );
}
export default AutoTone;
