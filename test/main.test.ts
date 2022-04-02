import {expect, test} from '@jest/globals'
import * as main from '../src/main'
import * as context from '../src/context'

test('test run in main',async()=>{
//   const inputs: context.Inputs = context.getInputs();
//   const fileInputs: context.Inputs = getFileInputs();
//   const zipInputs: context.Inputs = getZipInputs();
//   console.info(zipInputs);
//   const dirInputs: context.Inputs = getDirInputs();
//   main.runByInputs(zipInputs);
    main.run();
})


