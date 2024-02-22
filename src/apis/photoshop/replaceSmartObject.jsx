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
import { getSignedURL, listObjects } from "../../utils/aws-client";
import { initSDK } from "../../utils/ps-api-client";
import psApiLib from '@adobe/aio-lib-photoshop-api';
import { displayError} from "../../utils/display-utils";
import { getFileType, FILETYPE, getUUID } from "../../utils/file-utils";

const ReplaceSmartObject = () => {
    const [fileList, setFileList] = React.useState([]);
    const [inputFileName, setInputFileName] = React.useState(null);
    const [imageSrc, setImageSrc] = React.useState(null);
    const [inputImageURL, setInputImageURL] = React.useState(null);
    const [isBusy, setIsBusy] = React.useState(false);


    const replaceSmartObject = async () => {
        const sdk = await initSDK();
        if(inputFileName === null) {
            displayError('Input file must be provided');
        } else {
            try {
                setIsBusy(true);
                const fileID = getUUID();
                const options = {
                    layers: [
                      {
                        name: "so1",
                        input: {
                            href: inputImageURL,
                            storage: psApiLib.Storage.EXTERNAL
                        }
                      }
                    ]
                  }

                const input = {
                    href: inputImageURL,
                    storage: psApiLib.Storage.EXTERNAL,
                }
                  const output = {
                    href: await getSignedURL('putObject', `output/${fileID}.png`),
                    storage: psApiLib.Storage.EXTERNAL,
                    type: psApiLib.MimeType.PNG
                  }
                  await sdk.replaceSmartObject(input, output, options);
                  const imageURL = await getSignedURL('getObject', `output/${fileID}.png`);
                  setImageSrc(imageURL);
                  setIsBusy(false);
            } catch (e) {
                setIsBusy(false);
                console.log(e);
                displayError(`Replace Smart Object Error: ${e}`);
            }
        }
    }

    const getFileList = async () => {
        const files = await listObjects('inputs');
        const images = [];
        files.map((file, index) => {
            if(!file.Key.endsWith('/')){
                const filename = file.Key.split('/')[1];
                if(getFileType(filename) === FILETYPE.document) {
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
                <Heading level={1}>Replace Smart Object</Heading>
                <Text>
                Edits a PSD for replacing embedded smart object and then generate renditions and/or save a new psd. To know more about this feature refer <Link href="https://developer.adobe.com/photoshop/photoshop-api-docs/features/#smartobject">Smart Object.</Link>
                </Text>
                <Heading level={3}>Instructions:</Heading>
                <Text>In this example, we are replacing a smart object layet called "so1". Please use "input02.psd" if you are not using your own files.</Text>
                <Text>You can supply additional files using the <Link href="/uploadtoS3">Upload Asset to S3 page</Link>.</Text>
            </Flex>
            <Flex direction={'row'} gap={10} alignItems={'end'}>
                <ComboBox label='Select an input image' defaultItems={fileList} isRequired onInputChange={handleInputImageSelection}>
                    {item => <Item>{item.name}</Item>}
                </ComboBox>
                <Button variant='cta' onPress={() => replaceSmartObject()}>
                    <Text>Replace Smart Object</Text>
                    {isBusy ? <ProgressCircle size='S' isIndeterminate/> : null}
                </Button>
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
export default ReplaceSmartObject;
