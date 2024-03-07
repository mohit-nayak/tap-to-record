import { useEffect, useState } from "react";
import prettyMilliseconds from "pretty-ms";
import slugify from "react-slugify";

import { randomSentence } from "./utils";

import { storage } from "./firebase/config.js";
import { ref, uploadBytesResumable } from "firebase/storage";

import { useAudioRecorder } from "react-audio-voice-recorder";

import speakerImg from "./assets/person.png";
import recordImg from "./assets/voice.png";
import stopRecordingImg from "./assets/stop-button.png";
import refreshImg from "./assets/refresh.png";
import "./App.css";

function App() {
	const {
		startRecording,
		stopRecording,
		recordingBlob,
		isRecording,
		recordingTime,
	} = useAudioRecorder();

	const [uploadStatus, setUploadStatus] = useState("");
	const [currentSentence, setCurrentSentence] = useState(randomSentence());
	const [audioBlob, setAudioBlob] = useState({
		blob: "",
		url: "",
	});

	const resetAudioBlob = () => {
		setAudioBlob({
			blob: "",
			url: "",
		});
	};

	const startRec = () => {
		resetAudioBlob();
		setUploadStatus("");
		startRecording();
	};

	const refreshSentence = () => {
		setCurrentSentence(randomSentence());
		resetAudioBlob();
	};

	const submitAudio = () => {
		const filename =
			slugify(currentSentence) + "-" + new Date().getTime() + ".webm";
		const storageRef = ref(storage, "audios/" + filename);
		const uploadTask = uploadBytesResumable(storageRef, audioBlob.blob);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setUploadStatus("Uploading... " + progress + "%");
				switch (snapshot.state) {
					case "paused":
						console.log("Upload is paused");
						break;
					case "running":
						console.log("Upload is running");
						break;
					default:
						console.log("Looking for a status");
				}
			},
			(error) => {
				switch (error.code) {
					case "storage/unauthorized":
						console.log("Unauthorized access");
						break;
					case "storage/canceled":
						console.log("Upload canceled");
						break;
					case "storage/unknown":
						console.log("Unknown error");
						break;
					default:
						console.log("Looking for a status");
				}
			},
			() => {
				setUploadStatus("File uploaded!");
				refreshSentence();
			}
		);
	};

	useEffect(() => {
		if (!recordingBlob) return;
		const url = URL.createObjectURL(recordingBlob);
		setAudioBlob({
			blob: recordingBlob,
			url,
		});
	}, [recordingBlob]);

	return (
		<div className="app" id="app">
			<div className="word-wrapper">
				<div className="left">
					<img src={speakerImg} className="word-icon" alt="Speak icon" />
					<span>{currentSentence}</span>
				</div>
				<div className="right">
					<img
						src={refreshImg}
						className="refresh-icon"
						title="Refresh Sentence"
						onClick={refreshSentence}
						alt="Shuffle"
					/>
				</div>
			</div>

			<div className="recording-wrapper">
				<div className="img-wrapper">
					<img
						src={stopRecordingImg}
						className="stop-icon"
						onClick={stopRecording}
						alt="Stop recording"
					/>
					<img
						src={recordImg}
						className={`record-icon ${isRecording ? "hide" : ""}`}
						onClick={startRec}
						alt="Start recording"
					/>
				</div>
				<p className="status">
					{isRecording
						? prettyMilliseconds(recordingTime * 1000, { verbose: true })
						: "Tap to Record"}
				</p>
			</div>

			{audioBlob.blob && (
				<div className="result-wrapper">
					<audio src={audioBlob.url} controls></audio>
					<div className="btns-wrapper">
						<button type="button" className="rerecord-btn" onClick={startRec}>
							Re-record
						</button>
						<button type="button" className="submit-btn" onClick={submitAudio}>
							Submit
						</button>
					</div>
				</div>
			)}

			{uploadStatus && <p className="upload-status">{uploadStatus}</p>}
		</div>
	);
}

export default App;
