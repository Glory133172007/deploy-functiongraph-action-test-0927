import {expect, test} from '@jest/globals'
import * as install from '../src/install'

test('test base64 install',async()=>{
    expect(install.checkBase64Install()).toEqual(true);
})