import { MediaObject } from '@ionic-native/media/ngx';

export class AudioFile {
    constructor(
      public fullPath: string,
      public fileName: string,
      public duration: number,
      public data: MediaObject
    ) {}
  }
  