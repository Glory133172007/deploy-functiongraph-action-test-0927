import * as core from '@actions/core'
import * as io from '@actions/io'
import * as cp from 'child_process'
import * as os from 'os'

/**
 * 检查系统上是否安装了base64,如果没有，会尝试进行安装，如果安装不成功，则提示安装失败，结束操作
 * @returns
 */
export async function installBase64OnSystem(): Promise<boolean> {
  const isInstalld = await checkBase64Install()
  core.info(`is install ${isInstalld}`)
  if (isInstalld) {
    core.info('sshPass already installed and set to the path')
    return isInstalld
  }

  core.info('start install sshpass')
  let platform = os.platform()
  installBase64ByPlatform(platform)
  return checkBase64Install()
}

/**
 * 检查sshpass是否已经在系统上完成安装，并输出版本
 * @returns
 */
export async function checkBase64Install(): Promise<boolean> {
  let base64 = await io.which('base64')
  if (!base64) {
    core.info('base64 not installed or not set to the path')
    return false
  }
  core.info('base64 already installed and set to the path')
  let sbase64Version = (cp.execSync(`${base64} -V`) || '').toString()
  core.info(sbase64Version)
  return true
}

/**
 * 针对不同操作系统完成sshpass安装，可以细分为macos,linux-centos,linux-ubunto,windows等
 * @param platform
 */
export async function installBase64ByPlatform(
  platform: string
): Promise<void> {
  if (platform === 'darwin') {
    await installBase64OnMacos()
  }
  if (platform === 'linux') {
    await installBase64OnLinux()
  }
}

/**
 * mac系统安装sshpass
 * 有可能先要完成xcode-select 的安装，可以执行 xcode-select --install
 */
export async function installBase64OnMacos(): Promise<void> {
  core.info('current system is Ubuntu,use apt-get to install Base64')
  await (
    cp.execSync(
      `wget https://raw.githubusercontent.com/kadwanev/bigboybrew/master/Library/Formula/sshpass.rb && brew install sshpass.rb`
    ) || ''
  ).toString()
}

/**
 * 在当前的linux系统上安装base64
 * 目前支持centos和ubunto
 * 后面会扩充到所有常用的linux发行版，如readhat,debain,open SUSE等，
 */
export async function installBase64OnLinux(): Promise<void> {
  const osRelease = await (cp.execSync(`cat /etc/os-release`) || '').toString()
  let installCommand: string = 'yum -y install -q base64'

  if (osRelease.indexOf('Ubuntu') > -1 || osRelease.indexOf('Debain')) {
    core.info('current system is Ubuntu,use apt-get to install base64')
    installCommand = `apt-get -y -q update && apt-get -y install -q base64`
  }

  if (osRelease.indexOf('CentOS') > -1) {
    core.info('current system is Centos,use yum to install base64')
    installCommand = `yum -y install -q base64`
  }

  if (osRelease.indexOf('Fedora') > -1) {
    core.info('current system is Fedor,use Dnf to install base64')
    installCommand = `dnf install -y sshpass`
  }

  if (osRelease.indexOf('SUSE') > -1) {
    core.info('current system is OpenSuSE,use Zypper to install base64')
    installCommand = `zypper in docker`
  }
  await execCommand(installCommand)
}

/**
 * 根据传入的命令完成Base64的安装
 * @param command
 */
export async function execCommand(command: string): Promise<void> {
  //core.info('current install command is : ' + command)
  const execCommandResult = await (cp.execSync(command) || '').toString()
  core.info(execCommandResult)
}
