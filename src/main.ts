import * as accore from '@actions/core';
import * as utils from './utils';
import * as context from './context';
import * as fileutils from './fileUtils';
import * as install from './install';
import {BasicCredentials} from '@huaweicloud/huaweicloud-sdk-core';
import {
    FuncCode,
    FunctionGraphClient,
    UpdateFunctionCodeRequest,
    UpdateFunctionCodeRequestBody,
    UpdateFunctionCodeRequestBodyCodeTypeEnum
} from '@huaweicloud/huaweicloud-sdk-functiongraph';
import path from 'path';

/**
 * 1、对安装工具，参数和文件进行校验
 * 2、基于ak/sk 鉴权
 * 3、发起部署
 * @returns
 */
export async function run() {
    const inputs: context.Inputs = context.getInputs();

    accore.info('---------- check base64 on system');
    const installSuccess = await install.installBase64OnSystem();
    if (!installSuccess) {
        accore.setFailed('can not install base64 on system');
        return;
    }

    accore.info('---------- check input parameters');
    if (
        !utils.checkInputs(inputs) ||
        !utils.checkCodeType(inputs.functionCodetype) ||
        !utils.checkRegion(inputs) ||
        !utils.checkFileOrDirExist(
            inputs.functionCodetype,
            inputs.functionFile
        )
    ) {
        accore.setFailed('check input parameter error');
        return;
    }

    accore.info('---------- check file content');
    if (
        !(await fileutils.checkFileContent(
            inputs.functionCodetype,
            inputs.functionFile
        ))
    ) {
        accore.setFailed('check file content error');
        return;
    }

    accore.info('---------- gen functiongraph basicCredentials');
    const basicCredentials = new BasicCredentials()
        .withAk(inputs.ak)
        .withSk(inputs.sk)
        .withProjectId(inputs.projectId);

    accore.info('---------- gen functiongraph client');
    const client = FunctionGraphClient.newBuilder()
        .withCredential(basicCredentials)
        .withEndpoint(inputs.endpoint)
        .withOptions({customUserAgent: context.CUSTOM_USER_AGENT_FUNCTIONGRAPH})
        .build();

    accore.info('---------- gen request');
    const request = await genRequest(inputs);

    accore.info('---------- start request');
    try {
        accore.info('result:' + JSON.stringify(await client.updateFunctionCode(request)));
    } catch (ex) {
        accore.setFailed('exception:' + JSON.stringify(ex));
    }
    accore.info('---------- end request');
}

export async function genRequest(inputs: context.Inputs): Promise<UpdateFunctionCodeRequest> {
    const request = new UpdateFunctionCodeRequest();
    request.functionUrn = inputs.functionUrn;
    const body = new UpdateFunctionCodeRequestBody();
    const funcCodebody = new FuncCode();

    accore.info('---------- gen body');
    if (inputs.functionCodetype === context.OBJECT_TYPE_OBS) {
        body.withCodeUrl(inputs.functionFile);
        body.withFuncCode(funcCodebody);
        body.withCodeType(UpdateFunctionCodeRequestBodyCodeTypeEnum.OBS);
    } else {
        const base64Content = await fileutils.getArchiveBase64Content(
            inputs.functionCodetype,
            inputs.functionFile
        );
        funcCodebody.withFile(base64Content);
        body.withFuncCode(funcCodebody);

        let fileName = context.FUNC_TMP_ZIP;
        if (
            inputs.functionCodetype === context.OBJECT_TYPE_JAR ||
            inputs.functionCodetype === context.OBJECT_TYPE_ZIP
        ) {
            fileName = path.basename(inputs.functionFile);
        }
        body.withCodeFilename(fileName);
        if (inputs.functionCodetype === context.OBJECT_TYPE_JAR) {
            body.withCodeType(UpdateFunctionCodeRequestBodyCodeTypeEnum.JAR);
        } else {
            body.withCodeType(UpdateFunctionCodeRequestBodyCodeTypeEnum.ZIP);
        }
    }
    request.withBody(body);
    return request;
}

run();
