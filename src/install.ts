import * as core from '@actions/core';
import * as io from '@actions/io';
import * as os from 'os';
import * as context from './context';
import * as exec from '@actions/exec';

/**
 * 检查系统上是否安装了base64,如果没有，会尝试进行安装，如果安装不成功，则提示安装失败，结束操作
 * @returns
 */
export async function installBase64OnSystem(): Promise<boolean> {
    const platform = os.platform();
    const isInstalled = await checkBase64Install(platform);
    if (!isInstalled) {
      core.info('start install base64');
      installBase64ByPlatform(platform);
      return checkBase64Install(platform);
    }
    return true;
}

/**
 * 检查sshpass是否已经在系统上完成安装，并输出版本
 * @returns
 */
export async function checkBase64Install(platform: string): Promise<boolean> {
    const base64 = await io.which('base64');
    if (!base64) {
        core.info('base64 not installed or not set to the path');
        return false;
    }
    core.info('base64 already installed and set to the path');
    if (platform === context.OPERATING_SYSTEM_TYPE_DARWIN) {
        const macosCheckVersion = `${base64} --help`;
        execCommand(macosCheckVersion);
    } else if (platform === context.OPERATING_SYSTEM_TYPE_LINUX) {
        const linuxCheckVersion = `${base64} --version`;
        execCommand(linuxCheckVersion);
    }
    return true;
}

/**
 * 针对不同操作系统完成sshpass安装，可以细分为macos,linux-centos,linux-ubunto,windows等
 * @param platform
 */
export async function installBase64ByPlatform(platform: string): Promise<void> {
    if (platform === context.OPERATING_SYSTEM_TYPE_DARWIN) {
        await installBase64OnMacos();
    }
    if (platform === context.OPERATING_SYSTEM_TYPE_LINUX) {
        await installBase64OnLinux();
    }
}

/**
 * mac系统安装base64
 * 需要先安装brew
 */
export async function installBase64OnMacos(): Promise<void> {
    core.info('current system is macos,use brew to install base64');
    const installBase64CMD = 'brew install base64';
    await execCommand(installBase64CMD);
}

/**
 * 在当前的linux系统上安装base64
 * 目前支持centos和ubunto
 * 后面会扩充到所有常用的linux发行版，如readhat,debain,open SUSE等，
 */
export async function installBase64OnLinux(): Promise<void> {
    const osRelease = await (
        exec.exec(`cat /etc/os-release`) || ''
    ).toString();
    let installCommand = 'yum -y install -q coreutils';

    if (osRelease.indexOf(context.OPERATING_SYSTEM_VENDER_UBUNTU) > -1 || osRelease.indexOf(context.OPERATING_SYSTEM_VENDER_DEBAIN)) {
        core.info('current system is Ubuntu,use apt-get to install base64');
        installCommand = `apt-get -y -q update && apt-get -y install -q coreutils`;
    }

    if (osRelease.indexOf(context.OPERATING_SYSTEM_VENDER_CENTOS) > -1) {
        core.info('current system is Centos,use yum to install base64');
        installCommand = `yum -y install -q coreutils`;
    }

    if (osRelease.indexOf(context.OPERATING_SYSTEM_VENDER_FEDORA) > -1) {
        core.info('current system is Fedor,use dnf to install base64');
        installCommand = `dnf install -y -q coreutils`;
    }

    if (osRelease.indexOf(context.OPERATING_SYSTEM_VENDER_SUSE) > -1) {
        core.info('current system is OpenSuSE,use Zypper to install base64');
        installCommand = `zypper in coreutils`;
    }
    await execCommand(installCommand);
}

/**
 * 根据传入的命令完成Base64的安装
 * @param command
 */
export async function execCommand(command: string): Promise<void> {
    const execCommandResult = (exec.exec(command) || '').toString();
    core.info(execCommandResult);
}
