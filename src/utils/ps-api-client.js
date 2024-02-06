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

import { generateIMSToken } from "./ims-client";
import { IMS_ORG_ID, CLIENT_ID } from "./secrets";
import psAPIClient from '@adobe/aio-lib-photoshop-api';


export const initSDK = async () => {
    try {
        const { description, version } = require('../../package.json');
        const userAgentHeader = `${description}/${version}`;
        const token = await generateIMSToken();
        
        const client = await psAPIClient.init(IMS_ORG_ID,CLIENT_ID,token, undefined,{
            'User-Agent': userAgentHeader
        });

        return client;

    } catch (e) {
        console.log(e);
    }
   

}