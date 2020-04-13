export interface Message {
  id: string;
  body: string;
  type: string;
  t: number;
  notifyName: string;
  from: string;
  to: string;
  author: string;
  self: string;
  ack: number;
  invis: boolean;
  isNewMsg: boolean;
  star: boolean;
  recvFresh: boolean;
  interactiveAnnotations: any[];
  clientUrl: string;
  directPath: string;
  mimetype: string;
  filehash: string;
  uploadhash: string;
  size: number;
  mediaKey: string;
  mediaKeyTimestamp: number;
  width: number;
  height: number;
  broadcast: boolean;
  mentionedJidList: any[];
  isForwarded: boolean;
  labels: any[];
  sender: Sender;
  timestamp: number;
  content: string;
  isGroupMsg: boolean;
  isMMS: boolean;
  isMedia: boolean;
  isNotification: boolean;
  isPSA: boolean;
  chat: {
    id: string;
    pendingMsgs: boolean;
    lastReceivedKey: LastReceivedKey;
    t: number;
    unreadCount: number;
    archive: boolean;
    isReadOnly: boolean;
    muteExpiration: number;
    name: string;
    notSpam: boolean;
    pin: number;
    msgs: null;
    kind: string;
    isGroup: boolean;
    contact: Sender;
    groupMetadata: null;
    presence: Presence;
    isOnline: null;
    lastSeen: null;
  };
  isOnline: null;
  lastSeen: null;
  chatId: string;
  quotedMsgObj: null;
  mediaData: MediaData;
}

export interface Sender {
  id: string;
  name: string;
  shortName: string;
  pushname: string;
  type: string;
  isBusiness: boolean;
  isEnterprise: boolean;
  statusMute: boolean;
  labels: any[];
  formattedName: string;
  isMe: boolean;
  isMyContact: boolean;
  isPSA: boolean;
  isUser: boolean;
  isWAContact: boolean;
  profilePicThumbObj: ProfilePicThumbObj;
  msgs: null;
}

export interface ProfilePicThumbObj {
  eurl: string;
  id: string;
  img: string;
  imgFull: string;
  raw: null;
  tag: string;
}

export interface LastReceivedKey {
  fromMe: boolean;
  remote: string;
  id: string;
  _serialized: string;
}

export interface Presence {
  id: string;
  chatstates: any[];
}

export interface MediaData {
  type: string;
  mediaStage: string;
  animationDuration: number;
  animatedAsNewMsg: boolean;
  _swStreamingSupported: boolean;
  _listeningToSwSupport: boolean;
}
