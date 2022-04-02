deploy-functiongraph-action
部署serverless函数到华为云函数工作流，支持类型为obs,jar,zip压缩包,单个函数文件,或者目录
目前支持linux系统和苹果系统，windows系统暂不支持

参数说明:
ak:华为云账号的AK字符串，必填
sk:华为云账号的SK字符串，必填
AK/SK的获取方式请参考:https://support.huaweicloud.com/apm_faq/apm_03_0001.html
endpoint:函数服务的endpoint，必填，目前可用的endpoint列表如下
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
project_id:华为云账号的project_id,获取方式请参考:https://support.huaweicloud.com/apm_faq/apm_03_0001.html
function_urn:函数的urn，必填，获取方式请点击函数，查看函数详情中的urn信息:
function_codetype:函数更新方式,目前支持obs,zip,file,dir,jar五中
function_file:函数文件的路径，如果是obs，请填写该文件在OBS上的路径，如果为其他方式，请填写文件或者目录在本地的绝对路径

deploy-functiongraph-action 在github workflow 上的使用样例:
1、如果函数文件比较大(超过50M),请先将文件上传到OBS，然后将该文件在OBS中的路径配置到function_file上,function_codetype填写为obs

- name: deploy serverless function to huaweicloud functiongraph by obs
  uses: huaweicloud/deploy-functiongraph-action@v1.0
  with:
    ak: ${{ secrets.AK }}
    sk: ${{ secrets.SK }}
    endpoint: https://functiongraph.cn-north-4.myhuaweicloud.com
    project_id: 0dd8cb413000906a2fcdc019b5a84546
    function_urn: urn:fss:cn-north-4:0dd8cb413000906a2fcdc019b5a84546:function:default:uploadPluginToJetBrainsMacket:latest
    function_codetype: obs
    function_file: "https://huaweihdnbucket.obs.cn-north-4.myhuaweicloud.com/function/publishmarket/index_obs.zip

2、如果函数使用java开发，可以将java工程打包为jar,function_codetype填写为jar,将jar包在本地的路径填写到function_file上，样例如下
- name: deploy jar to huaweicloud functiongraph
  uses: huaweicloud/deploy-functiongraph-action@v1.0
  with:
    ak: ${{ secrets.AK }}
    sk: ${{ secrets.SK }}
    endpoint: https://functiongraph.cn-north-4.myhuaweicloud.com
    project_id: 0dd8cb413000906a2fcdc019b5a84546
    function_urn: urn:fss:cn-north-4:0dd8cb413000906a2fcdc019b5a84546:function:default:uploadPluginToJetBrainsMacket:latest
    function_codetype: jar
    function_file: /Users/a/Downloads/demoapp.jar
    
   3、如果函数为单个文件，可以直接上传改单个函数文件，function_codetype填写为file,将函数文件在本地的路径填写到function_file上，样例如下
- name: deploy single function file to huaweicloud functiongraph
  uses: huaweicloud/deploy-functiongraph-action@v1.0
  with:
    ak: ${{ secrets.AK }}
    sk: ${{ secrets.SK }}
    endpoint: https://functiongraph.cn-north-4.myhuaweicloud.com
    project_id: 0dd8cb413000906a2fcdc019b5a84546
    function_urn: urn:fss:cn-north-4:0dd8cb413000906a2fcdc019b5a84546:function:default:uploadPluginToJetBrainsMacket:latest
    function_codetype: file
    function_file: /Users/a/opensource/resource/index.py
    
 4、如果函数文件比较多，可以将函数都集中到一个目录下，将整个目录作为函数上传，function_codetype填写为dir,将函数目录在本地的路径填写到function_file上，样例如下
- name: deploy single function file to huaweicloud functiongraph
  uses: huaweicloud/deploy-functiongraph-action@v1.0
  with:
    ak: ${{ secrets.AK }}
    sk: ${{ secrets.SK }}
    endpoint: https://functiongraph.cn-north-4.myhuaweicloud.com
    project_id: 0dd8cb413000906a2fcdc019b5a84546
    function_urn: urn:fss:cn-north-4:0dd8cb413000906a2fcdc019b5a84546:function:default:uploadPluginToJetBrainsMacket:latest
    function_codetype: dir
    function_file: /Users/a/opensource/resource/functions
   
5、如果函数文件比较多，也可以将函数打包成zip，将zip文件作为函数上传，function_codetype填写为zip,将函数目录在本地的路径填写到function_file上，样例如下
- name: deploy single function file to huaweicloud functiongraph
  uses: huaweicloud/deploy-functiongraph-action@v1.0
  with:
    ak: ${{ secrets.AK }}
    sk: ${{ secrets.SK }}
    endpoint: https://functiongraph.cn-north-4.myhuaweicloud.com
    project_id: 0dd8cb413000906a2fcdc019b5a84546
    function_urn: urn:fss:cn-north-4:0dd8cb413000906a2fcdc019b5a84546:function:default:uploadPluginToJetBrainsMacket:latest
    function_codetype: zip
    function_file: /Users/a/opensource/resource/index_py.zip