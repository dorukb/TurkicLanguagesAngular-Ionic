import { Component } from "@angular/core";
import { Media, MediaObject } from "@ionic-native/media/ngx";
import { File } from "@ionic-native/file/ngx";
import { Storage } from "@ionic/storage";
import { AudioFile } from "./audioFile.model";

const MEDIA_FILES_KEY = "recordings";
@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
})
export class Tab2Page {
  status: String = "waiting";
  audioRecording: MediaObject;
  count: number = 0;
  testCount: number = 0;
  audioFiles: AudioFile[] = [];
  currentSource: string;
  currentFileName: string;
  wasRecording: boolean = false;
  isPlaying: boolean = false;
  duration: number = 0;
  currTime: number;
  constructor(
    private media: Media,
    private file: File,
    public storage: Storage
  ) {}

  clearStorage() {
    for (let i = 0; i < this.audioFiles.length; i++) {
      this.file
        .removeFile(this.file.dataDirectory, this.audioFiles[i].fileName)
        .then((res) => {
          console.log(res);
        });
    }
    this.storage.remove(MEDIA_FILES_KEY);
    console.log("storage cleared. getting new data");
    this.audioFiles = [];
    this.count = 0;
    this.status = "Cleared all audio files.";
    this.duration = 0;
  }
  playTest(){
   
    var name = "recording_" + this.testCount + ".aac";
    var filepath = this.file.dataDirectory + name;
    var recordedAudio = this.media.create(filepath);
    console.log("playing test from:" + filepath);
    recordedAudio.play();
    recordedAudio.setVolume(0.9);
    this.testCount++;
    if(this.testCount > 5) this.testCount = 0;
  }
  ionViewDidEnter() {
    console.log("ionviewdidenter");
    this.storage.get(MEDIA_FILES_KEY).then((val) => {
      this.status = "promise fulfilled.";
      if (val != null) {
        this.audioFiles = JSON.parse(val) || [];
        console.log(this.audioFiles);
        this.status = "restored audioFiles from storage.";
        this.count = this.audioFiles.length;
      }
    });
  }
  recordAudio() {
    if (this.wasRecording) return;

    this.wasRecording = true;
    this.currTime = new Date().getTime();

    this.currentFileName = "recording_" + this.count.toString() + ".aac";
    this.currentSource = this.file.dataDirectory + this.currentFileName;
    console.log("current source:" + this.currentSource);
    this.audioRecording = this.media.create(this.currentSource);

    this.audioRecording.startRecord();
    this.status = "recording...";
    this.count++;
  }

  stopRecording() {
    if (!this.wasRecording) return;
    this.wasRecording = false;

    let timeDifference = new Date().getTime() - this.currTime; // in ms
    this.duration = timeDifference / 1000;
    this.audioRecording.stopRecord();
    this.status = "stopped.";
    let newAudioFile = new AudioFile(
      this.currentSource,
      this.currentFileName,
      this.duration,
      this.audioRecording
    );
    this.audioRecording.release();

    this.storeRecording(newAudioFile);
  }

  playRecording(fileName: string) {
    if (this.isPlaying) return;
    this.isPlaying = true;

    var filepath = this.file.dataDirectory + fileName;
    var recordedAudio = this.media.create(filepath);
    console.log("playing from:" + filepath);

    recordedAudio.play();
    recordedAudio.onStatusUpdate.subscribe((status) => {
      if (status == 4) {
        // stopped
        this.isPlaying = false;
        recordedAudio.release();
      }
    });
    // this.duration = recordedAudio.getDuration();
    recordedAudio.setVolume(0.8);
  }

  storeRecording(recording: AudioFile) {
    this.audioFiles.push(recording);
    console.log("Pushed to audioFiles");

    this.storage.get(MEDIA_FILES_KEY).then((res) => {
      if (res != null && res != []) {
        // let arr: AudioFile[] = JSON.parse(res);
        // arr.push(recording);
        console.log("audio files array:", this.audioFiles);
        this.storage.set(MEDIA_FILES_KEY, JSON.stringify(this.audioFiles));
        this.status = "added to stored list";
      } else {
        console.log("res was null ");
        this.storage.set(MEDIA_FILES_KEY, JSON.stringify(this.audioFiles));
        this.status = "created stored list";
      }
    });
  }
}
