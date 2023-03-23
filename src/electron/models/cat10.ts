export class Cat10{
    id:number;
    cat: "Cat10";
    
    message_type: string;
    data_src_id: DataSourceIdentifier;
    target_report_descriptor:TargetReportDescriptor;
    measured_pos_in_polar: PolarCoords;

    position_in_wgs: Wgs84;
    position_in_cartesian: CartesianCoords;
    mode_3a_code_in_octal_rep: Mode3a;
    flight_level: FlightLevel;
    measured_height: number;
    amplitude_of_primary_plot: number;
    time_of_day:number;
    track_number:number;
    track_status: TrackStatus;
    calc_acceleration: CalculatedAcceleration;
    target_address:string;
    targed_id: TargetId;
    model_s_mbdata: string[];
    target_size_orientation:TargetSizeOrientation;
    presence: Presence[];
    vehicle_fleet_id: string;
    pre_programmed_message: PPM;
    std_pos: StdPos;
    sys_status: SysStatus;
    
    constructor(id: number) {
        this.id = id;
        this.message_type = "";
        this.time_of_day = 0;
      }
    
    
      
}

interface DataSourceIdentifier {
    SAC: string;
    SIC: string;
  }

interface TargetReportDescriptor{
    TYP: string;
    DCR: string;
    CHN: string;
    GBS:string;
    CRT:string;
    
    SIM?:string;
    TST?:string;
    RAB?:string;
    LOP?:string;
    TOT?:string;
    SPI?:string;
   
}
interface PolarCoords{
    rho:number;
    theta:number;
}
interface Wgs84{
    lat:number;
    long:number;
}
interface CartesianCoords{
    x:number;
    y:number;
}
interface Mode3a{
    V:string;
    G:string;
    L:string;
    mode:string;
}
interface FlightLevel{
    V:string;
    G:string;
    FL:string;
}
interface TrackStatus {
    CNF: string;
    TRE: string;
    CST: string;
    MAH: string;
    TCC: string;
    STH: string;

    TOM?: string;
    DOU?: string;
    MRS?: string;
    GHO?: string;
  }
interface CalculatedAcceleration {
    Ax: number;
    Ay: number;
  }
  
  interface TargetId {
    STI: string;
    target_identification: string;
  }
  
  interface TargetSizeOrientation {
    Lenght: string;
    Orinetation?: string;
    Width?: string;
  }
  
  interface Presence {
    DRHO: string;
    DTHETA: string;
  }
  
  interface PPM {
    TRB: string;
    MSG: string;
  }
  
  interface StdPos {
    X_component: string;
    Y_component: string;
    Covariance: string;
  }
  
  interface SysStatus {
    NOGO: string;
    OVL: string;
    TSV: string;
    DIV: string;
    TTF: string;
  }