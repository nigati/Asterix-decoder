import {expect, test} from '@jest/globals';
import { readFile1 } from '../utils/file_picker';
import { classify_data,block_slicer } from '../utils/classifier';
import { Cat10 } from '../models/cat10';
import { Cat21 } from '../models/cat21';



test('readingtest', async () => {
    // When



    var data : Buffer = await readFile1("Ficheros_asterix/utils/201002-lebl-080001_adsb.ast");
    console.log(data);
    var slicedData : Buffer[] = await block_slicer(data);
    console.log(slicedData);
    var messageList : (Cat10 | Cat21)[] = await classify_data(slicedData,slicedData.length,-1);
    console.log(messageList.length);
    
   
    //Then
    expect(messageList).not.toBe(null);
})