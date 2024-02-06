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

const ApplyPresetXMP = () => {
    const [fileList, setFileList] = React.useState([]);
    const [inputFileName, setInputFileName] = React.useState(null);
    const [outputFileName, setOuputFileName] = React.useState(null);
    const [imageSrc, setImageSrc] = React.useState(null);
    const [inputImageURL, setInputImageURL] = React.useState(null);


    const applyPresetXMP = async () => {
        const sdk = await initSDK();
        if(inputFileName === null || outputFileName === null) {
            displayError('Input file, preset file and output filename must be provided');
        } else {
            try {
                const options = '<?xml version="1.0"?><x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.6-c140 79.160451, 2017/05/06-01:08:21        "><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/" rdf:about="" crs:PresetType="Normal" crs:Cluster="" crs:UUID="47D5B8888456439D852D7CD225450652" crs:SupportsAmount="False" crs:SupportsColor="True" crs:SupportsMonochrome="True" crs:SupportsHighDynamicRange="True" crs:SupportsNormalDynamicRange="True" crs:SupportsSceneReferred="True" crs:SupportsOutputReferred="True" crs:CameraModelRestriction="" crs:Copyright="" crs:ContactInfo="" crs:Version="12.2.1" crs:ProcessVersion="11.0" crs:ConvertToGrayscale="True" crs:AutoGrayscaleMix="True" crs:CameraProfile="Default Monochrome" crs:HasSettings="True"><crs:Name><rdf:Alt><rdf:li xml:lang="x-default">Auto-BW</rdf:li></rdf:Alt></crs:Name><crs:ShortName><rdf:Alt><rdf:li xml:lang="x-default"/></rdf:Alt></crs:ShortName><crs:SortName><rdf:Alt><rdf:li xml:lang="x-default"/></rdf:Alt></crs:SortName><crs:Group><rdf:Alt><rdf:li xml:lang="x-default"/></rdf:Alt></crs:Group><crs:Description><rdf:Alt><rdf:li xml:lang="x-default"/></rdf:Alt></crs:Description><crs:Look crs:Name=""/></rdf:Description></rdf:RDF></x:xmpmeta>';
                const input = {
                    href: inputImageURL,
                    storage: psApiLib.Storage.EXTERNAL,
                  }
                  const output = {
                    href: await getSignedURL('putObject', `output/${outputFileName}`),
                    storage: psApiLib.Storage.EXTERNAL,
                    type: psApiLib.MimeType.PNG
                  }
                  await sdk.applyPresetXmp(input, output, options);
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
        files.map((file, index) => {
            const filename = file.Key.split('/')[1];
            if(!filename.toLowerCase().endsWith('xmp')) {
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
            <Heading level={1}>Apply Preset XMP</Heading>
            <Flex direction={'row'} gap={10} alignItems={'end'}>
                <ComboBox label='Select an input image' defaultItems={fileList} isRequired onInputChange={handleInputImageSelection}>
                    {item => <Item>{item.name}</Item>}
                </ComboBox>
                <TextField label='Output Image File Name' name='outputFileName' isRequired onChange={setOuputFileName}/>
                <Button variant='cta' onPress={() => applyPresetXMP()}>Apply Preset</Button>
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
export default ApplyPresetXMP;