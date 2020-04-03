import { AckType, Id } from '.';

export interface Ack {
  id: Id;
  body: string;
  type: string;
  t: number;
  subtype: any;
  notifyName: string;
  from: string;
  to: string;
  self: string;
  ack: AckType;
  invis: boolean;
  isNewMsg: boolean;
  star: boolean;
  loc: string;
  lat: number;
  lng: number;
  mentionedJidList: any[];
  isForwarded: boolean;
  labels: any[];
  ephemeralStartTimestamp: number;
}
