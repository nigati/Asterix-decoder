import { Cat10 } from "../models/cat10";
import { Cat21 } from "../models/cat21";



export async function classify_data(
    data:Buffer[],
    data_q:number,
    ) {
    
}

export async function block_slicer(buffer:Buffer) {
    let i= 0;
    let k= 0;
    let blocks=[];
    while (k<buffer.length){
        let blocklen=buffer.subarray(i+1,i+3).readInt16BE();
        k=i+blocklen;
        let blockofdata=buffer.subarray(i,blocklen);
        i=k;
        blocks.push(blockofdata);

    }
    return blocks;
}