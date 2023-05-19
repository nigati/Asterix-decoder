import type Graphic from "@arcgis/core/Graphic";
import type { Cat21 } from "./models/cat21";

export interface Plane {
  latitude: number;
  longitude: number;
  level: number; //FL
  geometric_height: number; //ft
  target_identification: string;
  target_address: string;
  graphic: Graphic | undefined;
  pathGraphic: Graphic | undefined;
  heading: number;

  adsb_msgs: Cat21[];
}
