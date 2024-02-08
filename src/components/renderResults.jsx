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

import React from 'react'
import { Flex, View, Image} from '@adobe/react-spectrum'

const RenderResults = (payload) => {
    return(
        <View>
            <Flex direction={'row'} gap={20} wrap>
                {payload.images.map((item,index) => {
                    if(item.base64) {
                        return (
                            <View key={index} width={500}>
                                <Image src={`data:image/png;base64, ${item.base64}`}/> 
                            </View>     
                        )
                    } else {
                        return (
                            <View key={index} width={500}>
                                <Image src={item.image.presignedUrl}/> 
                            </View>     
                        )
                    }
                    
                })}
            </Flex>
        </View>

    )
}

export default RenderResults