type UOM = "Box" | "Pack" | "Bottle" | "Strip" | "Piece";
export interface Product {
  id: number;
  productCD: string;
  hsn: string;
  uom: UOM;
  mrp: number;
  ptr: number;
  pts: number;
  gst: number;
}