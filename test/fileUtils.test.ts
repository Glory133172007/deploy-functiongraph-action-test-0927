import {expect, test} from '@jest/globals'
import * as fileutils from '../src/fileUtils'
import * as install from '../src/install'
import * as context from '../src/context'

//jar:application/java-archive
//zip:application/zip

test('test get file mime type',() => {
    let jarPath = "/Users/a/Downloads/demoapp.jar";
    let zipPath = "/Users/a/opensource/functiongraph-deploy-action/resource/index_py.zip";
    expect(fileutils.getFileMimeType(jarPath)).toEqual("application/java-archive");
    expect(fileutils.getFileMimeType(zipPath)).toEqual("application/zip");

    //change file type from jar to zip,and zip to jar test
    let zipPath1 = "/Users/a/Downloads/demoapp.zip";
    let jarPath1 = "/Users/a/opensource/functiongraph-deploy-action/resource/index_py.jar";

    expect(fileutils.getFileMimeType(zipPath1) === "application/java-archive").toEqual(false);
    expect(fileutils.getFileMimeType(jarPath1) === "application/zip").toEqual(false);

    //change other file type to jar or zip
    let zipPath3 = "/Users/a/Downloads/编辑1.zip";
    let jarPath3 = "/Users/a/opensource/functiongraph-deploy-action/resource/index.jar";
    expect(fileutils.getFileMimeType(zipPath3) === "application/java-archive").toEqual(false);
    expect(fileutils.getFileMimeType(jarPath3) === "application/zip").toEqual(false);
})

test('test file size bigger than 50MB',() => {
    //jar file 14M
    let jarPath = "/Users/a/Downloads/demoapp.jar";
    //zip file 2kb
    let zipPath = "/Users/a/opensource/functiongraph-deploy-action/resource/index_py.zip";
    //zip file VSCode-darwin-universal.zip 160+MB
    let bigzipPath = "/Users/a/Downloads/VSCode-darwin-universal.zip";
    expect(fileutils.checkFileSize(jarPath)).toEqual(true);
    expect(fileutils.checkFileSize(zipPath)).toEqual(true);
    expect(fileutils.checkFileSize(bigzipPath)).toEqual(false);
})

test('test zip file and dir ,then delete temp zip files',async()=>{
    let filePath = "/Users/a/opensource/functiongraph-deploy-action/resource/index.py"
    await fileutils.zipFileByPath(filePath);
    await install.execCommand("rm -rf " + context.FUNC_TMP_ZIP)


    let dirPath = "/Users/a/opensource/functiongraph-deploy-action/resource/functions"
    await fileutils.zipDirByPath(dirPath);
    await install.execCommand("rm -rf " + context.FUNC_TMP_ZIP)
})

test('test check file content ', async()=>{
    let filePath = "/Users/a/opensource/functiongraph-deploy-action/resource/index.py"
    expect(await fileutils.checkFileContent("file",filePath)).toEqual(true);
    await install.execCommand("rm -rf " + context.FUNC_TMP_ZIP)

    let dirPath = "/Users/a/opensource/functiongraph-deploy-action/resource/functions"
    expect(await fileutils.checkFileContent("dir",dirPath)).toEqual(true);
    await install.execCommand("rm -rf " + context.FUNC_TMP_ZIP)
})

test('get file base64 content',async()=>{
    let jarPath = "/Users/a/Downloads/demoapp.jar";
    console.log(await fileutils.getBase64ZipfileContent(jarPath));

    let filePath = "/Users/a/opensource/functiongraph-deploy-action/resource/index.py"
    let fileBase64Content = await fileutils.getBase64ZipfileContent(filePath)
    console.info(fileBase64Content);
    expect(fileBase64Content).toEqual("IyAtKi0gY29kaW5nOiB1dGYtOCAtKi0KCmltcG9ydCBqc29uCmZyb20gUElMIGltcG9ydCBJbWFnZQppbXBvcnQgc3lzCmltcG9ydCBvcwppbXBvcnQgcmVxdWVzdHMKZnJvbSBvYnMgaW1wb3J0ICoKY3VycmVudF9maWxlX3BhdGggPSBvcy5wYXRoLmRpcm5hbWUob3MucGF0aC5yZWFscGF0aChfX2ZpbGVfXykpCiMgYXBwZW5kIGN1cnJlbnQgcGF0aCB0byBzZWFyY2ggcGF0aHMsIHNvIHRoYXQgd2UgY2FuIGltcG9ydCBzb21lIHRoaXJkIHBhcnR5IGxpYnJhcmllcy4Kc3lzLnBhdGguYXBwZW5kKGN1cnJlbnRfZmlsZV9wYXRoKQoKVEVNUF9ST09UX1BBVEggPSAiL3RtcC8iCnNlY3VyZSA9IFRydWUKc2lnbmF0dXJlID0gJ3Y0Jwpwb3J0ID0gNDQzCnBhdGhfc3R5bGUgPSBUcnVlCgpkZWYgbmV3T2JzQ2xpZW50KGNvbnRleHQsIG9ic19zZXJ2ZXIpOgogICAgYWsgPSBjb250ZXh0LmdldEFjY2Vzc0tleSgpCiAgICBzayA9IGNvbnRleHQuZ2V0U2VjcmV0S2V5KCkKICAgIHJldHVybiBPYnNDbGllbnQoYWNjZXNzX2tleV9pZD1haywgc2VjcmV0X2FjY2Vzc19rZXk9c2ssIHNlcnZlcj1vYnNfc2VydmVyLAogICAgICAgICAgICAgICAgICAgICBwYXRoX3N0eWxlPVRydWUsIHNzbF92ZXJpZnk9RmFsc2UsIG1heF9yZXRyeV9jb3VudD01LCB0aW1lb3V0PTIwKQoKZGVmIGRvd25sb2FkRmlsZShvYnNDbGllbnQsIGJ1Y2tldCwgb2JqTmFtZSwgbG9jYWxGaWxlKToKICAgIHJlc3AgPSBvYnNDbGllbnQuZ2V0T2JqZWN0KGJ1Y2tldCwgb2JqTmFtZSwgbG9jYWxGaWxlKQogICAgaWYgcmVzcC5zdGF0dXMgPCAzMDA6CiAgICAgICAgcHJpbnQoJ2Rvd25sb2FkIGZpbGUgJywgb2JqTmFtZSwgJ3N1Y2NlZWQnKQogICAgZWxzZToKICAgICAgICBwcmludCgnZG93bmxvYWQgZmFpbGVkLCBlcnJvckNvZGU6ICVzLCBlcnJvck1lc3NhZ2U6ICVzLCByZXF1ZXN0SWQ6ICVzJyAlKHJlc3AuZXJyb3JDb2RlLCByZXNwLmVycm9yTWVzc2FnZSwKICAgICAgICAgICAgICByZXNwLnJlcXVlc3RJZCkpCgpkZWYgZ2V0T2JqSW5mb0Zyb21PYnNFdmVudChldmVudCk6CiAgICBpZiAnczMnIGluIGV2ZW50WydSZWNvcmRzJ11bMF06CiAgICAgICAgczMgPSBldmVudFsnUmVjb3JkcyddWzBdWydzMyddCiAgICAgICAgZXZlbnROYW1lID0gZXZlbnRbJ1JlY29yZHMnXVswXVsnZXZlbnROYW1lJ10KICAgICAgICBidWNrZXQgPSBzM1snYnVja2V0J11bJ25hbWUnXQogICAgICAgIG9iak5hbWUgPSBzM1snb2JqZWN0J11bJ2tleSddCiAgICBlbHNlOgogICAgICAgIG9ic0luZm8gPSBldmVudFsnUmVjb3JkcyddWzBdWydvYnMnXQogICAgICAgIGV2ZW50TmFtZSA9IGV2ZW50WydSZWNvcmRzJ11bMF1bJ2V2ZW50TmFtZSddCiAgICAgICAgYnVja2V0ID0gb2JzSW5mb1snYnVja2V0J11bJ25hbWUnXQogICAgICAgIG9iak5hbWUgPSBvYnNJbmZvWydvYmplY3QnXVsna2V5J10KICAgIHByaW50KCIqKiogb2JzRXZlbnROYW1lOiAlcywgc3JjQnVja2V0TmFtZTogJXMsIG9iak5hbWU6ICVzIiAlKGV2ZW50TmFtZSwgYnVja2V0LCBvYmpOYW1lKSkKICAgIHJldHVybiBidWNrZXQsIG9iak5hbWUKCmRlZiBQb3N0T2JqZWN0KG9ic0FkZHIsIGJ1Y2tldCwgb2JqTmFtZSwgYWssIHNrKToKICAgIFRlc3RPYnMgPSBPYnNDbGllbnQoYWNjZXNzX2tleV9pZD1haywgc2VjcmV0X2FjY2Vzc19rZXk9c2ssCiAgICAgICAgICAgICAgICAgICAgICAgIGlzX3NlY3VyZT1zZWN1cmUsIHNlcnZlcj1vYnNBZGRyLCBzaWduYXR1cmU9c2lnbmF0dXJlLCBwYXRoX3N0eWxlPXBhdGhfc3R5bGUsc3NsX3ZlcmlmeT1GYWxzZSwgcG9ydD1wb3J0LAogICAgICAgICAgICAgICAgICAgICAgICBtYXhfcmV0cnlfY291bnQ9NSwgdGltZW91dD0yMCkKCgogICAgTGhlYWRlcnMgPSBQdXRPYmplY3RIZWFkZXIobWQ1PU5vbmUsIGFjbD0ncHJpdmF0ZScsIGxvY2F0aW9uPU5vbmUsIGNvbnRlbnRUeXBlPSd0ZXh0L3BsYWluJykKCiAgICBMaGVhZGVycy5zc2VIZWFkZXIgPSBTc2VLbXNIZWFkZXIuZ2V0SW5zdGFuY2UoKQogICAgaCA9IFB1dE9iamVjdEhlYWRlcigpCiAgICBMbWV0YWRhdGEgPSB7J2tleSc6ICd2YWx1ZSd9CgogICAgb2JqUGF0aCA9IFRFTVBfUk9PVF9QQVRIICsgb2JqTmFtZQogICAgcmVzcCA9IFRlc3RPYnMucG9zdE9iamVjdChidWNrZXROYW1lPWJ1Y2tldCwgb2JqZWN0S2V5PW9iak5hbWUsIGZpbGVfcGF0aD1vYmpQYXRoLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRhZGF0YT1MbWV0YWRhdGEsIGhlYWRlcnM9aCkKICAgIGlmIGlzaW5zdGFuY2UocmVzcCwgbGlzdCk6CiAgICAgICAgZm9yIGssIHYgaW4gcmVzcDoKICAgICAgICAgICAgcHJpbnQoJ1Bvc3RPYmplY3QsIG9iamVjdEtleScsaywgJ2NvbW1vbiBtc2c6c3RhdHVzOicsIHYuc3RhdHVzLCAnLGVycm9yQ29kZTonLCB2LmVycm9yQ29kZSwgJyxlcnJvck1lc3NhZ2U6Jywgdi5lcnJvck1lc3NhZ2UpCiAgICBlbHNlOgogICAgICAgIHByaW50KCdQb3N0T2JqZWN0LCBjb21tb24gbXNnOiBzdGF0dXM6JywgcmVzcC5zdGF0dXMsICcsZXJyb3JDb2RlOicsIHJlc3AuZXJyb3JDb2RlLCAnLGVycm9yTWVzc2FnZTonLCByZXNwLmVycm9yTWVzc2FnZSkKCgpkZWYgaGFuZGxlcihldmVudCwgY29udGV4dCk6CiAgICBzcmNCdWNrZXQsIHNyY09iak5hbWUgPSBnZXRPYmpJbmZvRnJvbU9ic0V2ZW50KGV2ZW50KQogICAgb2JzX2FkZHJlc3MgPSBjb250ZXh0LmdldFVzZXJEYXRhKCdvYnNfYWRkcmVzcycpCiAgICBpZiBvYnNfYWRkcmVzcyBpcyBOb25lOgogICAgICAgIG9ic19hZGRyZXNzID0gJzEwMC4xMjUuMTUuMjAwJwoKICAgIHByaW50KCIqKiogc3JjQnVja2V0TmFtZTogIiArIHNyY0J1Y2tldCkKICAgIHByaW50KCIqKiogc3JjT2JqTmFtZToiICsgc3JjT2JqTmFtZSkKICAgIHByaW50KCIqKiogb2JzX2FkZHJlc3M6ICIgKyBvYnNfYWRkcmVzcykKICAgIAogICAgcHJpbnQoIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSB1cGRhdGUgYnkgZ2l0aHViIGFjdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIikgICAgCiAgICBwcmludCgiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHVwZGF0ZSBieSBnaXRodWIgYWN0aW9uIGZyb20gT0JTIGxpbmsgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSIpCiAgICBjbGllbnQgPSBuZXdPYnNDbGllbnQoY29udGV4dCwgb2JzX2FkZHJlc3MpCiAgICAjIGRvd25sb2FkIGZpbGUgdXBsb2FkZWQgYnkgdXNlciBmcm9tIG9icwogICAgbG9jYWxGaWxlID0gVEVNUF9ST09UX1BBVEggKyBzcmNPYmpOYW1lCiAgICBkb3dubG9hZEZpbGUoY2xpZW50LCBzcmNCdWNrZXQsIHNyY09iak5hbWUsIGxvY2FsRmlsZSkKICAgIHByaW50KCIqKiogbG9jYWxGaWxlOiAiICsgbG9jYWxGaWxlKQogCiAgICB1cmwgPSAnaHR0cHM6Ly9wbHVnaW5zLmpldGJyYWlucy5jb20vcGx1Z2luL3VwbG9hZFBsdWdpbicKICAgIGRhdGEgPSB7J3BsdWdpbklkJzogMTg2MzR9CiAgICBoZWFkZXJzID0geydBdXRob3JpemF0aW9uJzogJ0JlYXJlciBwZXJtOmRHbGhibmwxWDJ4NC5PVEl0TlRZeE53PT0uOFFBRW1GQ21GUG9iam1qUWp4Mlh0bXN3anZDS1BRJyx9CiAgICBmaWxlcyA9IHsKICAgICAgICAiZmlsZSI6IChzcmNPYmpOYW1lLCBvcGVuKGxvY2FsRmlsZSwgInJiIikpCiAgICB9CiAgICByZXNwb25zZSA9IHJlcXVlc3RzLnBvc3QodXJsPXVybCwgZmlsZXM9ZmlsZXMsIGRhdGE9ZGF0YSxoZWFkZXJzPWhlYWRlcnMpCiAgICBwcmludChyZXNwb25zZSkKICAgIHJldHVybiAnT0snCgoK");
})