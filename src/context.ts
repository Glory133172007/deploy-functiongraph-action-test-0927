import * as core from '@actions/core';

export interface Inputs {
    ak: string;
    sk: string;
    endpoint: string;
    projectId: string;
    functionUrn: string;
    functionCodetype: string;
    functionFile: string;
}

export const FUNC_TMP_ZIP = 'functmp.zip';
//允许通过SDK上传的最大文件尺寸，50M，52428800字节
export const MAX_UPLOAD_SIZE = 52428800;

export const IPREGX = /^((\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))(\.|$)){4}$/;

/**
 * 目前支持函数功能的region列表
 * 非洲-约翰内斯堡	af-south-1		https://functiongraph.af-south-1.myhuaweicloud.com
 * 华北-北京四	    cn-north-4		https://functiongraph.cn-north-4.myhuaweicloud.com
 * 华北-北京一	    cn-north-1		https://functiongraph.cn-north-1.myhuaweicloud.com
 * 华东-上海二	    cn-east-2		https://functiongraph.cn-east-2.myhuaweicloud.com
 * 华东-上海一	    cn-east-3		https://functiongraph.cn-east-3.myhuaweicloud.com
 * 华南-广州	      cn-south-1		https://functiongraph.cn-south-1.myhuaweicloud.com
 * 拉美-墨西哥城一	 na-mexico-1		https://functiongraph.na-mexico-1.myhuaweicloud.com
 * 拉美-圣保罗一     sa-brazil-1		https://functiongraph.sa-brazil-1.myhuaweicloud.com
 * 拉美-圣地亚哥	   la-south-2		https://functiongraph.la-south-2.myhuaweicloud.com
 * 亚太-曼谷	      ap-southeast-2	https://functiongraph.ap-southeast-2.myhuaweicloud.com
 * 亚太-新加坡	    ap-southeast-3	https://functiongraph.ap-southeast-3.myhuaweicloud.com
 * 中国-香港	      ap-southeast-1	https://functiongraph.ap-southeast-1.myhuaweicloud.com
 */
export const regionArray = [
    'af-south-1',
    'cn-north-4',
    'cn-north-1',
    'cn-east-2',
    'cn-east-3',
    'cn-south-1',
    'na-mexico-1',
    'sa-brazil-1',
    'la-south-2',
    'ap-southeast-2',
    'ap-southeast-3',
    'ap-southeast-1'
];

export const codeTypeArray = ['file', 'jar', 'dir', 'obs', 'zip'];

export const JAR_MIME_TYPE = 'application/java-archive';

export const ZIP_MIME_TYPE = 'application/zip';
//高危命令列表，持续完善
export const dangerCommandSet: string[] = [
    'poweroff',
    'reboot',
    'rm',
    'mkfs',
    'file',
    'dd',
    'shutdown',
    '){:|:&};:',
    '^foo^bar'
];

export function getInputs(): Inputs {
    return {
        ak: core.getInput('ak', {required: true}),
        sk: core.getInput('sk', {required: true}),
        endpoint: core.getInput('endpoint', {required: true}),
        projectId: core.getInput('project_id', {required: true}),
        functionCodetype: core.getInput('function_codetype', {required: true}),
        functionUrn: core.getInput('function_urn', {required: true}),
        functionFile: core.getInput('function_file', {required: true})
    };
}

export const CUSTOM_USER_AGENT_FUNCTIONGRAPH =
    'DevKit-GitHub:Huawei Cloud Functiongraph Deploy';
