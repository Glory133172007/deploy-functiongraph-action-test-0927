import * as accore from '@actions/core'
import * as utils from './utils'
import * as context from './context'
import * as fileutils from './fileUtils'
import * as install from './install'
import {BasicCredentials} from '@huaweicloud/huaweicloud-sdk-core'
import {
  FuncCode,
  FunctionGraphClient,
  UpdateFunctionCodeRequest,
  UpdateFunctionCodeRequestBody,
  UpdateFunctionCodeRequestBodyCodeTypeEnum
} from '@huaweicloud/huaweicloud-sdk-functiongraph'

/**
 * 1、对安装工具，参数和文件进行校验
 * 2、基于ak/sk 鉴权
 * 3、发起部署
 * @returns
 */
export async function run() {
  const inputs: context.Inputs = context.getInputs()

  accore.info('---------- check Base64 on system')
  const installSuccess = await install.installBase64OnSystem()
  if (!installSuccess) {
    accore.info('can not install Base64 on system')
    return
  }

  accore.info('---------- check input parameters')
  if (
    !utils.checkInputs(inputs) ||
    !utils.checkCodeType(inputs.function_codetype) ||
    !utils.checkRegion(inputs) ||
    !utils.checkFileOrDirExist(inputs.function_codetype, inputs.function_file)
  ) {
    accore.info('check input parameter error')
    return
  }

  accore.info('---------- check file content')
  if (
    !(await fileutils.checkFileContent(
      inputs.function_codetype,
      inputs.function_file
    ))
  ) {
    accore.info('check file content error')
    return
  }

  accore.info('---------- gen functiongraph basicCredentials')
  const basicCredentials = new BasicCredentials()
    .withAk(inputs.ak)
    .withSk(inputs.sk)
    .withProjectId(inputs.project_id)
  accore.info('---------- gen functiongraph client')

  const client = FunctionGraphClient.newBuilder()
    .withCredential(basicCredentials)
    .withEndpoint(inputs.endpoint)
    .withOptions({customUserAgent: context.CUSTOM_USER_AGENT_FUNCTIONGRAPH})
    .build()

  accore.info('---------- gen request')
  const request = await genRequest(inputs)

  accore.info('---------- start request')
  const result = client.updateFunctionCode(request)
  result
    .then((result: any) => {
      accore.info('JSON.stringify(result)::' + JSON.stringify(result))
    })
    .catch((ex: any) => {
      accore.info('exception:' + JSON.stringify(ex))
    })
  accore.info('---------- end request')
}

export async function genRequest(inputs: context.Inputs): Promise<any> {
  const request = new UpdateFunctionCodeRequest()
  request.functionUrn = inputs.function_urn
  const body = new UpdateFunctionCodeRequestBody()
  const funcCodebody = new FuncCode()

  accore.info('---------- gen body')
  if (inputs.function_codetype === 'obs') {
    body.withCodeUrl(inputs.function_file)
    body.withFuncCode(funcCodebody)
    body.withCodeType(UpdateFunctionCodeRequestBodyCodeTypeEnum.OBS)
  } else {
    const base64Content = await fileutils.getArchiveBase64Content(
      inputs.function_codetype,
      inputs.function_file
    )
    funcCodebody.withFile(base64Content)
    body.withFuncCode(funcCodebody)

    let fileName = context.FUNC_TMP_ZIP
    if (
      inputs.function_codetype === 'jar' ||
      inputs.function_codetype === 'zip'
    ) {
      fileName = utils.getFileNameFromPath(inputs.function_file)
    }
    body.withCodeFilename(fileName)
    if (inputs.function_codetype === 'jar') {
      body.withCodeType(UpdateFunctionCodeRequestBodyCodeTypeEnum.JAR)
    } else {
      body.withCodeType(UpdateFunctionCodeRequestBodyCodeTypeEnum.ZIP)
    }
  }
  request.withBody(body)
  return request
}

run()
