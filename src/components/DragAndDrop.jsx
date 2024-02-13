/*************************************************************************
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
import {  
    Flex, 
    Heading, 
    IllustratedMessage, 
    Text, 
    Image  
} from '@adobe/react-spectrum';
import Upload from '@spectrum-icons/illustrations/Upload';
import { DropZone } from '@react-spectrum/dropzone';

const DragAndDrop = ({onImageDrop}) => {
    const [filledSrc, setFilledSrc] = React.useState(null);

    const handleObjectDrop = (images) => {
        images.items.find(async (item) => {
            if(item.kind === 'file') {
                console.log(item.type);
                if(item.type === 'image/jpeg' || item.type === 'image/png') {
                    const file = await item.getFile();
                    setFilledSrc(URL.createObjectURL(file));
                    onImageDrop(file);
                } 
            } else {
                return;
            }
        });
    }

    return (
        <Flex direction={'column'} gap={10}>
             <DropZone
                maxWidth='size-3000'
                isFilled={!!filledSrc}
                getDropOperation={(types) => {
                    return types.has('image/jpeg') || types.has('image/png') ? 'copy' : 'cancel';
                }}
                onDrop={(e)=> handleObjectDrop(e)}>
                    {filledSrc
                    ? <Image src={filledSrc}/>
                    : (<IllustratedMessage>
                        <Upload />
                        <Heading>
                            <Text>Drag and drop your image here</Text>
                        </Heading>
                    </IllustratedMessage>
                    )}
                </DropZone>
        </Flex>
    );
}

export default DragAndDrop;