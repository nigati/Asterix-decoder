export interface Cat21{
  id:number;
  cat: "Cat21";
  instrument: "ADS-B";

  aircraft_operational_status: AircraftOperationlStatus;
  data_source_identification: DataSourceIdentification;
  service_identification: string;
  service_management: string;
  emitter_category: string;
  target_report_descriptor: TargetReportDescriptor;
  mod_3A_code: string;
  time_applicability_position: number;
  time_applicability_velocity: number;
  time_message_reception_position: number;
  time_message_reception_position_high: number;
  time_message_reception_velocity: number;
  time_message_reception_velocity_high: number;
  time_report_transmission: number;
  target_address: string;
  quality_indicator: QualityIndicator;
  tarjectory_intent: TrajectoryIntent;
  wgs_84_coordinates: WGS_84_coordinates;
  wgs_84_coordinates_high: WGS_84_coordinates;
  message_amplitude: string;
  geometric_height: string;
  flight_level: string;
  selected_altitude: SelectedAltitude;
  final_state_selected_altitude: FinalStateSelectedAltitude;
  air_speed: string;
  true_airspeed: string;
  magnetic_heading: string;
  barometric_vertical_rate: string;
  geometric_vertical_rate: string;
  airborne_ground_vector: AirborneGroundVector;
  track_number: number;
  track_angle_rate: string;
  target_identification: string;
  target_status: TargetStatus;
  mops_version: MOPSv;
  met_information: MetInformation;
  roll_angle: string;
  mode_s_mb_data: string[];
  acas_resolution_advisory_report: ACAS_ResolutioinAdvisorReport;
  surface_capabilities_and_characteristics: SurfaceCapabilitiesAndCharacteristics;
  data_ages: DataAges;
  receiver_ID: string;
  Pic_accuracy: number;
  Surface_Capabilities_and_Characteristics_age: number;
  ACAS_Resolution_Advisory_age: number;
  Roll_Angle_age: number;
  Met_Information_age: number;
  Target_Status_age: number;
  Target_Identification_age: number;
  Track_Angle_Rate_age: number;
  Ground_Vector_age: number;
  Geometric_Vertical_Rate_age: number;
  Barometric_Vertical_Rate_age: number;
  Magnetic_Heading_age: number;
  True_Air_Speed_age: number;
  Air_Speed_age: number;
  Final_State_Selected_Altitude_age: number;
  Intermediate_State_Selected_Altitude_age: number;
  Flight_Level_age: number;
  Geometric_Height_age: number;
  Message_Amplitude_age: number;
  Trajectory_Intent_age: number;
  Quality_Indicators_age: number;
  Mode_3A_Code_age: number;
  Target_Report_Descriptor_age: number;
  Aircraft_Operational_Status_age: number;
    
}
interface AircraftOperationlStatus{
  RA:string;
  TC:string;
  TS:string;
  ARV:string;
  CDTI:string;
  NotTCAS:string;
  SA:string;
}

interface DataSourceIdentification{
  SAC: string;
  SIC:string;
}
interface TargetReportDescriptor{
  ATP:string;
  ARC: string;
  RC: string;
  RAB: string;
  FX: string;
  DCR?: string;
  GBS?: string;
  SIM?: string;
  TST?: string;
  SAA?: string;
  CL?: string;
  IPC?: string;
  NOGO?: string;
  CPR?: string;
  LDPJ?: string;
  RCF?: string;
}

interface QualityIndicator{
  NACv?: string;
  NIC?: string;
  NICBARO?: String;
  SIL?: String;
  NACp?: String;
  SILsupplement?: String;
  SDA?: String;
  GVA?: String;
  PIC?: string;

}

interface TrajectoryIntent{
  TIS: boolean;
NAV?: string;
NVB?: string;
TID: boolean;
TIDvec?: TIData[];
}

interface TIData {
  TCA: string;
  NC: string;
  TCPnumber: string;
  Altitude: string;
  Latitude: string;
  Longitud: string;
  PointType: string;
  TD: string;
  TRA: string;
  TOA: string;
  TOV: string;
  TTR: string;
}

interface WGS_84_coordinates{
  latitude: number;
  longitude: number;
}

interface SelectedAltitude{
  SAS: string;
  Source: string;
  Altitude: string;
}

interface FinalStateSelectedAltitude{
  MV: string;
  AH: string;
  AM: string;
  Altitude: string;
}

interface AirborneGroundVector{
  GroundSpeed: string;
  TrackAngle: string;
}

interface TargetStatus{
  ICF: string;
  LNAV: string;
  PS: string;
  SS: string;
}

interface MOPSv{
  VNS: string;
  VN: string;
  LTT: string;
}

interface MetInformation{

}

interface ACAS_ResolutioinAdvisorReport{
  TYP: string;
  STYP: string;
  ARA: string;
  RAC: string;
  RAT: string;
  MTE: string;
  TTI: string;
  TID: string;
}

interface SurfaceCapabilitiesAndCharacteristics{
  POA: string;
  CDTI: string;
  B2low: string;
  RAS: string;
  IDENT: string;
  LW?: string;
}

interface DataAges{

}