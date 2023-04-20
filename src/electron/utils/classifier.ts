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
        const blocklen=buffer.subarray(i+1,i+3).readInt16BE();
        k=i+blocklen+2;
        blocks.push(buffer.subarray(i,k));
        i=k;

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

  const fspec = BigInt("0x" + msg.subarray(3, 10).toString("hex"))
    .toString(2)
    .padStart(7 * 8, "0")
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
  // console.log("length fspec " + offset);

  var decod_msg: Cat21 = new Cat21(id);
  var tasks: any[] = [];

  /** MANDATORY FIELD**/
  /// I021/010 Data Source Identifier
  tasks.push(decod_msg.set_data_source_identifier(msg.subarray(offset, offset + 2)));
  offset += 2; //length =2

  /// I021/040 Target Report Descriptor
  let len = variableItemOffset(msg.subarray(offset, offset + 3), 3); // Primary Subfield + First Extension + Second Extension => max3
  tasks.push(decod_msg.set_target_report_descriptor(msg.subarray(offset, offset + len)));
  offset += len; //length =1+
  /********************/

  if (fspec[2] === "1") {
    /// I021/161 Track Number
    tasks.push(decod_msg.set_track_number(msg.subarray(offset, offset + 2)));
    offset += 2; //length =2
  }
  if (fspec[3] === "1") {
    /// I021/015 Service Identification
    tasks.push(decod_msg.set_service_identification(msg.subarray(offset, offset + 1)));
    offset += 1; //length =1
  }
  if (fspec[4] === "1") {
    /// I021/071 Time of Applicability for Position
    tasks.push(decod_msg.set_time_applicability_position(msg.subarray(offset, offset + 3)));
    offset += 3; //length =3
  }
  if (fspec[5] === "1") {
    /// I021/130 Position in WGS-84 co-ordinates
    tasks.push(decod_msg.set_wgs_84_coordinates(msg.subarray(offset, offset + 6)));
    offset += 6;
    //length =6
  }
  if (fspec[6] === "1") {
    /// I021/131 Position in WGS-84 co-ordinates, high res.
    if (msg.subarray(offset, offset + 8).length == 0) {
      console.log("Zero buffer");
      console.log(fspec);
      console.log(msg);
    }
    tasks.push(decod_msg.set_wgs_84_coordinates_high(msg.subarray(offset, offset + 8)));
    offset += 8; //length =8
  }
  if (fspec[7] === "1") {
    // Field Extension Indicator

    if (fspec[8] === "1") {
      /// I021/072 Time of Applicability for Velocity
      tasks.push(decod_msg.set_time_applicability_velocity(msg.subarray(offset, offset + 3)));
      offset += 3; //length =3
    }
    if (fspec[9] === "1") {
      /// I021/150 Air Speed
      tasks.push(decod_msg.set_air_speed(msg.subarray(offset, offset + 2)));
      offset += 2; //length =2
    }
    if (fspec[10] === "1") {
      /// I021/151 True Air Speed
      tasks.push(decod_msg.set_true_airspeed(msg.subarray(offset, offset + 2)));
      offset += 2; //length =2
    }
    /** MANDATORY ITEM **/
    /// I021/080 Target Address
    tasks.push(decod_msg.set_target_address(msg.subarray(offset, offset + 3)));
    offset += 3; //length =3
    /*******************/
    if (fspec[12] === "1") {
      /// I021/073 Time of Message Reception of Position
      tasks.push(decod_msg.set_time_message_reception_position(msg.subarray(offset, offset + 3)));
      offset += 3; //length =3
    }
    if (fspec[13] === "1") {
      /// I021/074 Time of Message Reception of Position-High
      tasks.push(decod_msg.set_time_message_reception_position_high(msg.subarray(offset, offset + 4)));
      offset += 4; //length =4
    }
    if (fspec[14] === "1") {
      /// I021/075 Time of Message Reception of Velocity
      tasks.push(decod_msg.set_time_message_reception_velocity(msg.subarray(offset, offset + 3)));
      offset += 3; //length =3
    }
    if (fspec[15] === "1") {
      /// Field Extension Indicator

      if (fspec[16] === "1") {
        /// I021/076 Time of Message Reception of Velocity-High Precision
        tasks.push(decod_msg.set_time_message_reception_velocity_high(msg.subarray(offset, offset + 4)));
        offset += 4; //length =4
      }
      if (fspec[17] === "1") {
        /// I021/140 Geometric Height
        tasks.push(decod_msg.set_geometric_height(msg.subarray(offset, offset + 2)));
        offset += 2; //length =2
      }
      /*** MANDATORY ITEM ***/
      /// I021/090 Quality Indicators
      let len = variableItemOffset(msg.subarray(offset, offset + 4), 4); // Primary Subfield + First extension + Second extension + Third Extension => max 4
      tasks.push(decod_msg.set_quality_indicator(msg.subarray(offset, offset + len)));
      offset += len; //length =1+
      /*********************/
      if (fspec[19] === "1") {
        /// I021/210 MOPS Version
        tasks.push(decod_msg.set_mops_version(msg.subarray(offset, offset + 1)));
        offset += 1; //length =1
      }
      if (fspec[20] === "1") {
        /// I021/070 Mode 3/A Code
        tasks.push(decod_msg.set_mod_3A_code(msg.subarray(offset, offset + 2)));
        offset += 2; //length =2
      }
      if (fspec[21] === "1") {
        /// I021/230 Roll Angle
        tasks.push(decod_msg.set_roll_angle(msg.subarray(offset, offset + 2)));
        offset += 2; //length =2
      }
      if (fspec[22] === "1") {
        /// I021/145 Flight Level
        tasks.push(decod_msg.set_flight_level(msg.subarray(offset, offset + 2)));
        offset += 2; //length =2
      }
      if (fspec[23] === "1") {
        /// Field Extension Indicator

        if (fspec[24] === "1") {
          /// I021/152 Magnetic Heading
          tasks.push(decod_msg.set_magnetic_heading(msg.subarray(offset, offset + 2)));
          offset += 2; //length =2
        }
        if (fspec[25] === "1") {
          /// I021/200 Target Status
          tasks.push(decod_msg.set_target_status(msg.subarray(offset, offset + 1)));
          offset += 1; //length =1
        }
        if (fspec[26] === "1") {
          /// I021/155 Barometric Vertical Rate
          tasks.push(decod_msg.set_barometric_vertical_rate(msg.subarray(offset, offset + 2)));
          offset += 2; //length =2
        }
        if (fspec[27] === "1") {
          /// I021/157 Geometric Vertical Rate
          tasks.push(decod_msg.set_geometric_vertical_rate(msg.subarray(offset, offset + 2)));
          offset += 2; //length =2
        }
        if (fspec[28] === "1") {
          /// I021/160 Airborne Ground Vector
          tasks.push(decod_msg.set_airborne_ground_vector(msg.subarray(offset, offset + 4)));
          offset += 4; //length =4
        }
        if (fspec[29] === "1") {
          /// I021/165 Track Angle Rate
          tasks.push(decod_msg.set_track_angle_rate(msg.subarray(offset, offset + 2)));
          offset += 2; //length =2
        }
        if (fspec[30] === "1") {
          /// I021/077 Time of Report Transmission
          tasks.push(decod_msg.set_time_ASTERIX_report_transmission(msg.subarray(offset, offset + 3)));
          offset += 3; //length =3
        }
        if (fspec[31] === "1") {
          /// Field Extension Indicator

          if (fspec[32] === "1") {
            /// I021/170 Target Identification
            tasks.push(decod_msg.set_target_identification(msg.subarray(offset, offset + 6)));
            offset += 6; //length =6
          }
          if (fspec[33] === "1") {
            /// I021/020 Emitter Category
            tasks.push(decod_msg.set_emitter_category(msg.subarray(offset, offset + 1)));
            offset += 1; //length =1
          }
          if (fspec[34] === "1") {
            /// I021/220 Met Information
            let fields: string[] = []; // Primary Subfield + 2* Subfield #1 + 2* Subfield #2 + 2* Subfield #3 + Subfield #4 => max 8
            let len = 1;
            BigInt("0x" + msg.toString("hex")) //TODO this was buffer, i think its wrong
              .toString(2)
              .padStart(8, "0")
              .split("")
              .forEach((value, index) => {
                switch (index) {
                  case 0:
                    if (value === "1") {
                      fields.push("WS");
                    }
                    break;
                  case 1:
                    if (value === "1") {
                      fields.push("WD");
                    }
                    break;
                  case 2:
                    if (value === "1") {
                      fields.push("TMP");
                    }
                    break;
                  case 3:
                    if (value === "1") {
                      fields.push("TRB");
                      len--;
                    } //only one octet
                    break;
                }
              });
            tasks.push(
              decod_msg.set_met_information(msg.subarray(offset + 1, offset + fields.length * 2 + len), fields)
            );
            offset += fields.length * 2 + len; //length =1+
          }
          if (fspec[35] === "1") {
            /// I021/146 Selected Altitude
            tasks.push(decod_msg.set_selected_altitude(msg.subarray(offset, offset + 2)));
            offset += 2; //length =2
          }
          if (fspec[36] === "1") {
            /// I021/148 Final State Selected Altitude
            tasks.push(decod_msg.set_final_state_selected_altitude(msg.subarray(offset, offset + 2)));
            offset += 2; //length =2
          }
          if (fspec[37] === "1") {
            /// I021/110 Trajectory Intent
            /// Primary Subfield + Subfield #1 + 16 * Subfield #2 => max 18
            const bits = BigInt("0x" + msg.subarray(offset, offset + 1).toString("hex"))
              .toString(2)
              .padStart(8, "0")
              .split("");
            let len = 0;
            let tis = false;
            let tid = false;
            var rep = 0;
            if (bits[0] === "1") {
              len++;
              tis = true;
            }
            if (bits[1] === "1") {
              rep = parseInt("0x" + msg.subarray(offset + 1 + len, offset + 2 + len).toString("hex"));
              len += 15 * rep;
              tid = true;
            }
            tasks.push(decod_msg.set_trajectory_intent(msg.subarray(offset + 1, offset + len + 1), tis, tid, rep));
            offset += len + 1; //length =1+
          }
          if (fspec[38] === "1") {
            /// I021/016 Service Management
            tasks.push(decod_msg.set_service_management(msg.subarray(offset, offset + 1)));
            offset += 1; //length =1
          }
          if (fspec[39] === "1") {
            /// Field Extension Indicator

            if (fspec[40] === "1") {
              /// I021/008 Aircraft Operational Status
              tasks.push(decod_msg.set_aircraft_operational_status(msg.subarray(offset, offset + 1)));
              offset += 1; //length =1
            }
            if (fspec[41] === "1") {
              /// I021/271 Surface Capabilities and Characteristics
              let len = variableItemOffset(msg.subarray(offset, offset + 2), 2); // Primary Subfield + First extension => max 2
              tasks.push(decod_msg.set_surface_capabilities_and_characteristics(msg.subarray(offset, offset + len)));
              offset += len; //length =1+
            }
            if (fspec[42] === "1") {
              /// I021/132 Message Amplitude
              tasks.push(decod_msg.set_message_amplitude(msg.subarray(offset, offset + 1)));
              offset += 1; //length =1
            }
            if (fspec[43] === "1") {
              /// I021/250 Mode S MB Data
              const len = parseInt("0x" + msg.subarray(offset, offset + 1).toString("hex"));
              tasks.push(decod_msg.set_mode_s_mb_data(msg.subarray(offset + 1, offset + 1 + 8 * len), len));
              offset += 1 + 8 * len; //length =1+8n
            }
            if (fspec[44] === "1") {
              /// I021/260 ACAS Resolution Advisory Report
              tasks.push(decod_msg.set_acas_resolution_advisory_report(msg.subarray(offset, offset + 7)));
              offset += 7; //length =7
            }
            if (fspec[45] === "1") {
              /// I021/400 Receiver ID
              tasks.push(decod_msg.set_receiver_ID(msg.subarray(offset, offset + 1)));
              offset += 1;
              //length =1
            }
            if (fspec[46] === "1") {
              /// I021/295 Data Ages
              /// 4 octets to indicate octates presence
              tasks.push(decod_msg.set_data_ages(msg.subarray(offset, msg.length)));
              offset += len; //length =1+
            }
            
          }
        }
      }
    }
    
    }
    await Promise.all(tasks);
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