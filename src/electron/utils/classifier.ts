import { Cat10 } from "../models/cat10";
import { Cat21 } from "../models/cat21";



export async function classify_data(
    data:Buffer[],
    data_q:number,
    id:number,
    ): Promise<(Cat10 | Cat21)[]> {
        let cat10msg: number = 0;
        let cat21msg: number = 0;
        let decodedMessages: (Cat10 | Cat21)[] = [];
      
        if (data_q != -1) {
          data = data.slice(0, data_q);
        }
      
        data = data.filter((v) => v[0] === 10 || v[0] === 21);
      
        decodedMessages = await Promise.all(
            data.map(async (v, index) => {
            if (v[0] === 10) {
              cat10msg += 1;
              return decodeClass10Messages(v, index + id + 1);
            }
            //if cat 21
            cat21msg += 1;
            return decodeClass21Messages(v, index + id + 1);
          })
        );
        return decodedMessages;
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

export async function decodeClass10Messages(msg: Buffer, id: number): Promise<Cat10> {
    msg = Buffer.from(msg);
    
    const fspec = BigInt("0x" + msg.subarray(3, 7).toString("hex"))
      .toString(2)
      .padStart(4 * 8, "0")
      .split("");
  
    let count = 7;
    let found = false;
    let offset =
      fspec.filter((value, index) => {
        if (index == count && !found) {
          if (value != "1") {
            found = true;
          } else {
            count += 8;
          }
          return true;
        }
        return;
      }).length + 3;
  
  
    var decod_msg: Cat10 = new Cat10(id); 
    var tasks: any[] = [];
  
    /// I010/010 Data Source Identifier
    tasks.push(decod_msg.set_data_source_identifier(msg.subarray(offset, offset + 2)));
    offset += 2; //length =2
  
    /// I010/000 Message Type
    tasks.push(decod_msg.set_message_type(msg.subarray(offset, offset + 1)));
    offset += 1; //length =1
  
    if (msg[offset - 1] != 0x01) {
      /// I010/140 Time of Day
      tasks.push(decod_msg.set_time_of_day(msg.subarray(offset, offset + 3)));
  
      if (offset === 9) {
        /// I010/550 System Status
        tasks.push(decod_msg.set_system_status(msg.subarray(offset + 3, offset + 4)));
      }
  
    } else {
      /// I010/020 Target Report Descriptor
      let len = variableItemOffset(msg.subarray(offset, offset + 3), 3); // 
      tasks.push(decod_msg.set_target_report_description(msg.subarray(offset, offset + len)));
      offset += len; //length =1+
  
      /// "I010/140 Time of Day"
      tasks.push(decod_msg.set_time_of_day(msg.subarray(offset, offset + 3)));
      offset += 3; //length =3
      if (fspec[4] === "1") {
        /// I010/041 Position in WGS-84 Co-ordinates
        tasks.push(decod_msg.set_wgs_84_coordinates(msg.subarray(offset, offset + 8)));
        offset += 8; //length =8
      }
      if (fspec[5] === "1") {
        /// I010/040 Measured Position in Polar Co-ordinates
        tasks.push(decod_msg.set_polar_coordinates(msg.subarray(offset, offset + 4)));
        offset += 4; //length =4
      }
      if (fspec[6] === "1") {
        /// I010/042 Position in Cartesian Co-ordinates
        tasks.push(decod_msg.set_cartesian_coordinates(msg.subarray(offset, offset + 4)));
        offset += 4; //length =4
      }
      if (fspec[7] === "1") {
        /**** Field Extension Indicator ****/
  
        if (fspec[8] === "1") {
          /// I010/200 Calculated Track Velocity in Polar Co-ordinates
          tasks.push(decod_msg.set_calculated_track_velocity_polar_coordinates(msg.subarray(offset, offset + 4)));
          offset += 4; //length =4
        }
        if (fspec[9] === "1") {
          /// I010/202 Calculated Track Velocity in Cartesian Coord.
          tasks.push(decod_msg.set_calculated_track_velocity_cartesian_coordinates(msg.subarray(offset, offset + 4)));
          offset += 4; //length =4
        }
        if (fspec[10] === "1") {
          /// I010/161 Track Number
          tasks.push(decod_msg.set_track_number(msg.subarray(offset, offset + 2)));
          offset += 2; //length =2
        }
        if (fspec[11] === "1") {
          /// I010/170 Track Status
          let len = variableItemOffset(msg.subarray(offset, offset + 3), 3); 
          tasks.push(decod_msg.set_track_status(msg.subarray(offset, offset + len)));
          offset += len; //length =1+
        }
        if (fspec[12] === "1") {
          /// I010/060 Mode-3/A Code in Octal Representation
          tasks.push(decod_msg.set_mod_3A_code(msg.subarray(offset, offset + 2)));
          offset += 2; //length =2
        }
        if (fspec[13] === "1") {
          /// I010/220 Target Address
          tasks.push(decod_msg.set_target_address(msg.subarray(offset, offset + 3)));
          offset += 3; //length =3
        }
        if (fspec[14] === "1") {
          /// I010/245 Target Identification
          tasks.push(decod_msg.set_target_identification(msg.subarray(offset, offset + 7)));
          offset += 7; //length =7
        }
        if (fspec[15] === "1") {
          /*FEI*/
  
          if (fspec[16] === "1") {
            /// I010/250 Mode S MB Data
            const len = parseInt("0x" + msg.subarray(offset, offset + 1).toString("hex"));
            tasks.push(decod_msg.set_mode_s_mb_data(msg.subarray(offset, offset + 1 + 8 * len), len));
            offset += 1 + 8 * len; 
          }
          if (fspec[17] === "1") {
            /// I010/300 Vehicle Fleet Identification
            tasks.push(decod_msg.set_vehicle_fleet_identification(msg.subarray(offset, offset + 1)));
            offset += 1; //length =1
          }
          if (fspec[18] === "1") {
            /// I010/090 Flight Level in Binary Representation
            tasks.push(decod_msg.set_flight_level(msg.subarray(offset, offset + 2)));
            offset += 2; //length =2
          }
          if (fspec[19] === "1") {
            /// I010/091 Measured Height
            tasks.push(decod_msg.set_measured_height(msg.subarray(offset, offset + 2)));
            offset += 2; //length =2
          }
          if (fspec[20] === "1") {
            /// I010/270 Target Size & Orientation
            let len = variableItemOffset(msg.subarray(offset, offset + 3), 3); 
            tasks.push(decod_msg.set_target_size_and_orientation(msg.subarray(offset, offset + len)));
            offset += len; //length =1+
          }
          if (fspec[22] === "1") {
            /// I010/310 Pre-programmed Message
            tasks.push(decod_msg.set_preprogrammed_message(msg.subarray(offset, offset + 1)));
            offset += 1; //length =1
          }
          if (fspec[23] === "1") {
            /**** Field Extension Indicator ****/
  
            if (fspec[24] === "1") {
              /// I010/500 Standard Deviation of Position
              tasks.push(decod_msg.set_standard_deviation_of_position(msg.subarray(offset, offset + 4)));
              offset += 4; //length =4
            }
            if (fspec[25] === "1") {
              /// I010/280 Presence
              const len = parseInt("0x" + msg.subarray(offset, offset + 1).toString("hex"));
              tasks.push(decod_msg.set_presence(msg.subarray(offset + 1, offset + 1 + 2 * len), len));
              offset += 1 + 2 * len; //length =1+2n
            }
            if (fspec[26] === "1") {
              /// I010/131 Amplitude of Primary Plot
              tasks.push(decod_msg.set_amplitude_of_primary_plot(msg.subarray(offset, offset + 1)));
              offset += 1; //length =1
            }
            if (fspec[27] === "1") {
              /// I010/210 Calculated Acceleration
              tasks.push(decod_msg.set_calculated_acceleration(msg.subarray(offset, offset + 2)));
            }
          }
        }
      }
    }
    //@ts-ignore
    await Promise.all(tasks);
  
    return decod_msg;
  }
  export async function decodeClass21Messages(msg: Buffer, id: number): Promise<Cat21> {
    msg = Buffer.from(msg);
    
    let decod_msg =new Cat21;
    return decod_msg;
    
    
  }

  function variableItemOffset(buffer: Buffer, max_len: number) {
    const bits = BigInt("0x" + buffer.toString("hex"))
      .toString(2)
      .padStart(max_len * 8, "0")
      .split("");
  
    let count = 7;
    let found = false;
    let off = bits.filter((value, index) => {
      if (index == count && !found) {
        if (value != "1") {
          found = true;
        } else {
          count += 8;
        }
        return true;
      }
      return;
    }).length;
    return off;
  }