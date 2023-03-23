export class Cat21{

    aircraft_opertional_status: AircraftOperationlStatus;
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
    time_ASTERIX_report_transmission: number;
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
}

interface QualityIndicator{
    NAC: string;

}

interface TrajectoryIntent{

}

interface WGS_84_coordinates{

}

interface SelectedAltitude{

}

interface FinalStateSelectedAltitude{

}

interface AirborneGroundVector{

}

interface TargetStatus{

}

interface MOPSv{

}

interface MetInformation{

}

interface ACAS_ResolutioinAdvisorReport{

}

interface SurfaceCapabilitiesAndCharacteristics{

}

interface DataAges{

}