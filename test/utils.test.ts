import {expect, test} from '@jest/globals'
import * as utils from '../src/utils'
import * as context from '../src/context'
import path from 'path';

test('test get file name from Path', () => {
    let fileName1 = path.basename("wenchui.zip");
    let fileName2 = path.basename("/wenchui.zip");
    let fileName3 = path.basename("/usr/local/wenchui.zip");
    let fileName4 = path.basename("/usr/wenchui.zip");
    let fileName5 = path.basename("./local/wenchui.zip");
    expect(fileName1).toEqual("wenchui.zip")
    expect(fileName2).toEqual("wenchui.zip")
    expect(fileName2).toEqual("wenchui.zip")
    expect(fileName3).toEqual("wenchui.zip")
    expect(fileName4).toEqual("wenchui.zip")
    expect(fileName5).toEqual("wenchui.zip")
 })

 test('test get region from url',()=>{
    const endpoint = "https://functiongraph.cn-north-4.myhuaweicloud.com"
    const urn = "urn:fss:cn-north-4:0dd8cb413000906a2fcdc019b5a84546:function:default:uploadPluginToJetBrainsMacket:latest"
    const obs = "https://huaweihdnbucket.obs.cn-north-4.myhuaweicloud.com/function/publishmarket/index_obs.zip"
    expect(utils.getRegionFromEndpoint(endpoint,1,".")).toEqual("cn-north-4")
    expect(utils.getRegionFromEndpoint(urn,2,":")).toEqual("cn-north-4")
    expect(utils.getRegionFromEndpoint(obs,2,".")).toEqual("cn-north-4")
 })

test('test check region by action inputs',() => {
    expect(utils.checkRegion(getOBSInputs())).toEqual(true);
    expect(utils.checkRegion(getOBSInputs_endpintWrong())).toEqual(false);
    expect(utils.checkRegion(getOBSInputs_urn_wrong())).toEqual(false);
    expect(utils.checkRegion(getOBSInputs_obs_wrong())).toEqual(false);
})

test('test check file and dir exist and not empty',() => {
    let jarInputs = getJarInputs();
    expect(utils.checkFileOrDirExist(jarInputs.functionCodetype,jarInputs.functionFile)).toEqual(true);

    let zipInputs = getZipInputs();
    expect(utils.checkFileOrDirExist(zipInputs.functionCodetype,zipInputs.functionFile)).toEqual(true);

    let fileInputs = getFileInputs();
    expect(utils.checkFileOrDirExist(fileInputs.functionCodetype,fileInputs.functionFile)).toEqual(true);

    let dirInputs = getDirInputs();
    expect(utils.checkFileOrDirExist(dirInputs.functionCodetype,dirInputs.functionFile)).toEqual(true);

})

test('test check relative path exist',()=>{
  let relativeDirPath = "./resource"
  expect(utils.checkFileOrDirExist("dir",relativeDirPath)).toEqual(true);

  let relativeFilePath = "./resource/index.py";
  expect(utils.checkFileOrDirExist("file",relativeFilePath)).toEqual(true);
})

test('test check file and dir is empty',() => {
    let emptyDirPath = "/Users/a/opensource/test"
    expect(utils.checkFileOrDirExist("dir",emptyDirPath)).toEqual(false);

    let emptyFilePath = "/Users/a/opensource/test.ts";
    expect(utils.checkFileOrDirExist("file",emptyFilePath)).toEqual(false);
})

test("test check function type",()=>{
    expect(utils.checkCodeType("obs")).toEqual(true);
    expect(utils.checkCodeType("zip")).toEqual(true);
    expect(utils.checkCodeType("jar")).toEqual(true);
    expect(utils.checkCodeType("file")).toEqual(true);
    expect(utils.checkCodeType("dir")).toEqual(true);

    expect(utils.checkCodeType("test")).toEqual(false);
    expect(utils.checkCodeType("maven")).toEqual(false);
    expect(utils.checkCodeType("python")).toEqual(false);
    expect(utils.checkCodeType("")).toEqual(false);
    expect(utils.checkCodeType("123123")).toEqual(false);
    expect(utils.checkCodeType("fdfdfd")).toEqual(false);
})

test('test check inputs parameters',() => {
    let obsInputs = getJarInputs();
    expect(utils.checkInputs(obsInputs)).toEqual(true);

    let jarInputs = getJarInputs();
    expect(utils.checkInputs(jarInputs)).toEqual(true);

    let zipInputs = getZipInputs();
    expect((utils.checkInputs(zipInputs))).toEqual(true);

    let fileInputs = getFileInputs();
    expect((utils.checkInputs(fileInputs))).toEqual(true);

    let dirInputs = getDirInputs();
    expect((utils.checkInputs(dirInputs))).toEqual(true);

})

test('test check file and dir exist and not empty',() => {
    let jarInputs = getJarInputs();
    expect(utils.checkFileOrDirExist(jarInputs.functionCodetype,jarInputs.functionFile)).toEqual(true);

    let zipInputs = getZipInputs();
    expect(utils.checkFileOrDirExist(zipInputs.functionCodetype,zipInputs.functionFile)).toEqual(true);

    let fileInputs = getFileInputs();
    expect(utils.checkFileOrDirExist(fileInputs.functionCodetype,fileInputs.functionFile)).toEqual(true);

    let dirInputs = getDirInputs();
    expect(utils.checkFileOrDirExist(dirInputs.functionCodetype,dirInputs.functionFile)).toEqual(true);

})
 export function getOBSInputs(): context.Inputs{
    return{
      ak : "**********************************************",
      sk : "**********************************************",
      endpoint : "https://functiongraph.cn-north-4.myhuaweicloud.com",
      projectId : "****************************",
      functionCodetype: "obs",
      functionUrn :"urn:fss:cn-north-4:****************************:function:default:uploadPluginToJetBrainsMacket:latest",
      functionFile : "https://huaweihdnbucket.obs.cn-north-4.myhuaweicloud.com/function/publishmarket/index_obs.zip"
    }
  }

  export function getOBSInputs_endpintWrong(): context.Inputs{
    return{
      ak : "**********************************************",
      sk : "**********************************************",
      endpoint : "https://functiongraph.cn-north-1.myhuaweicloud.com",
      projectId : "****************************",
      functionCodetype: "obs",
      functionUrn :"urn:fss:cn-north-4:****************************:function:default:uploadPluginToJetBrainsMacket:latest",
      functionFile : "https://huaweihdnbucket.obs.cn-north-4.myhuaweicloud.com/function/publishmarket/index_obs.zip"
    }
  }

  export function getOBSInputs_urn_wrong(): context.Inputs{
    return{
      ak : "**********************************************",
      sk : "**********************************************",
      endpoint : "https://functiongraph.cn-north-4.myhuaweicloud.com",
      projectId : "****************************",
      functionCodetype: "obs",
      functionUrn :"urn:fss:cn-north-1:****************************:function:default:uploadPluginToJetBrainsMacket:latest",
      functionFile : "https://huaweihdnbucket.obs.cn-north-4.myhuaweicloud.com/function/publishmarket/index_obs.zip"
    }
  }

  export function getOBSInputs_obs_wrong(): context.Inputs{
    return{
      ak : "**********************************************",
      sk : "**********************************************",
      endpoint : "https://functiongraph.cn-north-4.myhuaweicloud.com",
      projectId : "****************************",
      functionCodetype: "obs",
      functionUrn :"urn:fss:cn-north-4:****************************:function:default:uploadPluginToJetBrainsMacket:latest",
      functionFile : "https://huaweihdnbucket.obs.cn-north-1.myhuaweicloud.com/function/publishmarket/index_obs.zip"
    }
  }
  
  export function getJarInputs(): context.Inputs{
    return{
      ak : "**********************************************",
      sk : "**********************************************",
      endpoint : "https://functiongraph.cn-north-4.myhuaweicloud.com",
      projectId : "****************************",
      functionCodetype: "jar",
      functionUrn :"urn:fss:cn-north-4:****************************:function:default:uploadPluginToJetBrainsMacket:latest",
      functionFile : "/Users/a/Downloads/demoapp.jar"
    }
  }
  
  export function getZipInputs(): context.Inputs{
    return{
      ak : "**********************************************",
      sk : "**********************************************",
      endpoint : "https://functiongraph.cn-north-4.myhuaweicloud.com",
      projectId : "****************************",
      functionCodetype: "zip",
      functionUrn :"urn:fss:cn-north-4:****************************:function:default:uploadPluginToJetBrainsMacket:latest",
      functionFile : "/Users/a/opensource/functiongraph-deploy-action/resource/index_py.zip"
    }
  }
  
  export function getFileInputs(): context.Inputs{
    return{
      ak : "**********************************************",
      sk : "**********************************************",
      endpoint : "https://functiongraph.cn-north-4.myhuaweicloud.com",
      projectId : "****************************",
      functionCodetype: "file",
      functionUrn :"urn:fss:cn-north-4:****************************:function:default:uploadPluginToJetBrainsMacket:latest",
      functionFile : "/Users/a/opensource/functiongraph-deploy-action/resource/index.py"
    }
  }
  
  export function getDirInputs(): context.Inputs{
    return{
      ak : "**********************************************",
      sk : "**********************************************",
      endpoint : "https://functiongraph.cn-north-4.myhuaweicloud.com",
      projectId : "****************************",
      functionCodetype: "dir",
      functionUrn :"urn:fss:cn-north-4:****************************:function:default:uploadPluginToJetBrainsMacket:latest",
      functionFile : "/Users/a/opensource/functiongraph-deploy-action/resource/functions"
    }
  }
 