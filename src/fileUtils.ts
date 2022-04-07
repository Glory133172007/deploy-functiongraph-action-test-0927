import * as core from '@actions/core'

import * as context from './context'
import * as install from './install'

import * as fs from 'fs-extra'
import * as mime from 'mime'
import * as cp from 'child_process'

/**
 * 如果文件是zip或者jar，只需要检查文件大小是否符合小于50M的要求
 * @param filePath
 * @param fileType
 * @returns
 */
export async function checkFileContent(
  fileType: string,
  filePath: string
): Promise<boolean> {
  let checkResult: boolean = false
  if (fileType === 'zip' || fileType === 'jar') {
    checkResult = checkFileSize(filePath)
  } else if (fileType === 'file') {
    await zipFileByPath(filePath)
    checkResult = checkFileSize(context.FUNC_TMP_ZIP)
  } else if (fileType === 'dir') {
    await zipDirByPath(filePath)
    checkResult = checkFileSize(context.FUNC_TMP_ZIP)
  }
  return checkResult
}

export async function getArchiveBase64Content(
  fileType: string,
  filePath: string
): Promise<string> {
  let archiveFilePath = context.FUNC_TMP_ZIP
  if (fileType === 'zip' || fileType === 'jar') {
    archiveFilePath = filePath
  }
  return await getBase64ZipfileContent(archiveFilePath)
}

/**
 * 对于文件，需要将文件打包成zip
 */
export async function zipFileByPath(filePath: string) {
  const fileZipCommand = 'zip -j ' + context.FUNC_TMP_ZIP + ' ' + filePath
  await install.execCommand(fileZipCommand)
}

/**
 * 对于目录，需要将目录打包成zip
 */
export async function zipDirByPath(dirPath: string) {
  const zipDirCommandAll =
    'mkdir ./tmpdir && cp -r ' +
    dirPath +
    '/* ./tmpdir ' +
    '&& cd ./tmpdir && zip -r ' +
    context.FUNC_TMP_ZIP +
    ' ./* ' +
    '&& cp ' +
    context.FUNC_TMP_ZIP +
    ' ../ && cd .. && rm -rf ./tmpdir'
  await install.execCommand(zipDirCommandAll)
}

/**
 * 除了函数类型为obs的文件，其他文件上传前都需要进行base64编码，拿到编码后的内容上传
 * @param zipfilePath
 * @returns
 */
export async function getBase64ZipfileContent(
  archiveFilePath: string
): Promise<string> {
  const base64Command = 'base64 ' + archiveFilePath
  const base64ZipFileContent = await (
    cp.execSync(base64Command) || ''
  ).toString()
  return base64ZipFileContent
}

/**
 * 如果文件大小超过50M，组要中断进程，建议用户将文件先传到OBS中，用OBS的方式进行上传
 * @param filePath
 * @returns
 */
export function checkFileSize(filePath: string): boolean {
  try {
    const stat = fs.statSync(filePath)
    const fileSize = stat.size
    core.info('current file size ' + fileSize)
    if (fileSize > context.MAX_UPLOAD_SIZE) {
      core.info(
        'the upload file ' +
          filePath +
          ' size  ' +
          fileSize +
          ' is bigger than 50MB,please upload to OBS first,then deploy by OBS type'
      )
      return false
    } else {
      core.info(
        'the upload file ' +
          filePath +
          ' size  ' +
          fileSize +
          ' is smaller than 50MB'
      )
      return true
    }
  } catch (error) {
    core.info('file or directory not exist')
    return false
  }
}

/**
 * jar:application/java-archive
 * zip:application/zip
 * 提取文件的mimetype，不使用文件后缀来判定文件类型
 */
export function getFileMimeType(filePath: string): string | null {
  const mimeType = mime.getType(filePath)
  core.info('mimeType ' + mimeType)
  return mimeType
}
