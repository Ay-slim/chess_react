import { useEffect, useRef, useState } from "react";
import { VideoPlayerPropType } from "../types";
import Peer from 'simple-peer'
import { socket } from "../logic/utils";

const VideoPlayer = (props: VideoPlayerPropType) => {
  const opponentId = sessionStorage.getItem('opponentId')
  const playerId = sessionStorage.getItem('playerId')
  const { initiator } = props
  const [localStream, setlocalStream] = useState<MediaStream>();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [callerSignal, setCallerSignal] = useState<Peer.SignalData>()
  const [showCanJoinVideoChat, setShowCanJoinVideoChat] = useState<boolean>(false)
  const [opponentRejectedVideo, setOpponentRejectedVideo] = useState<boolean>(false)
  const localVideo = useRef<HTMLVideoElement>(null);
  const opponentVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<Peer.Instance>()

  const initializeVideo = async () => {
    try {
      const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setlocalStream(userMediaStream);
      if (localVideo.current) {
        localVideo.current.srcObject = userMediaStream;
      }
    } catch (error) {
      console.error("Error accessing user media:", error);
    }
  };

  useEffect(() => {
    initializeVideo();

    socket.on(`${playerId}-initiateVideoCall`, (signal) => {
      setCallerSignal(signal)
      setShowCanJoinVideoChat(true) //Display video call options (when initiator boolean is false) after initiator has emmitted a video call initiation event
    })

    if (initiator)
      setShowCanJoinVideoChat(true) //Display video call options when initiator boolean is true

    //Cleanup function
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Turn off the camera
    if (isCameraOn && localStream) {
      localStream.getVideoTracks().forEach((track) => (track.enabled = true));
    } else if (localStream) {
      localStream.getVideoTracks().forEach((track) => (track.enabled = false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCameraOn, localStream]);

  useEffect(() => {
    if (isMicrophoneOn && localStream) {
      localStream.getAudioTracks().forEach((track) => (track.enabled = true));
    } else if (localStream) {
      localStream.getAudioTracks().forEach((track) => (track.enabled = false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMicrophoneOn, localStream]);

  const handleToggleCamera = () => {
    setIsCameraOn((prevIsCameraOn) => !prevIsCameraOn);
  };

  const handleToggleMicrophone = () => {
    setIsMicrophoneOn((prevIsMicrophoneOn) => !prevIsMicrophoneOn);
  };

  const initiateVideoCall = () => {
    setShowCanJoinVideoChat(false)
    const peer = new Peer({
			initiator,
			trickle: false,
			stream: localStream
		})
    peer.on("signal", (data) => {
			socket.emit("initiateVideoCall", {
				opponentId,
				signalData: data,
			})
		})
    peer.on("stream", (stream) => {
      if (opponentVideo.current)
        opponentVideo.current.srcObject = stream
    })

    socket.on(`${playerId}-joinVideoCall`, (signal) => {
			peer.signal(signal)
		})
		connectionRef.current = peer
  }

  const acceptVideoCall = () => {
    setShowCanJoinVideoChat(false)
    const peer = new Peer({
			initiator,
			trickle: false,
			stream: localStream
		})
    peer.on("signal", (data) => {
			socket.emit("joinVideoCall", {
				opponentId,
				signalData: data,
			})
		})
    peer.on("stream", (stream) => {
      if (opponentVideo.current)
        opponentVideo.current.srcObject = stream
    })
    peer.signal(callerSignal!)
    connectionRef.current = peer
  }

  socket.on(`${playerId}-opponentRejectedVideo`, (()=> {
    setOpponentRejectedVideo(true)
  }))

  const disableVideoCall = () => {
    setShowCanJoinVideoChat(false)
    socket.emit('opponentRejectedVideo', opponentId)
  }

  return (
    <div className="videoContainer">
      <video className="opponentVideo" playsInline autoPlay ref = {opponentVideo}></video>
      {opponentRejectedVideo ? (<div className="videoDisallowed">Your opponent has disallowed video sharing</div>): null}
      <div className="videoButtonsContainer">
        {initiator && showCanJoinVideoChat ? (<div className="videoChatOptions"><div className="chatOptionsCopy"><p><strong>Enable video chat?</strong></p></div><div className="chatOptionsButtonsContainer"><button onClick={initiateVideoCall} className="chatOptionsButtonYes">Yes</button><button onClick={disableVideoCall} className="chatOptionsButtonNo">No</button></div></div>) : null}
        {!initiator && showCanJoinVideoChat ? (<div className="videoChatOptions"><div className="chatOptionsCopy"><p><strong>Join video chat?</strong></p></div><div className="chatOptionsButtonsContainer"><button onClick={acceptVideoCall} className="chatOptionsButtonYes">Yes</button><button onClick={disableVideoCall} className="chatOptionsButtonNo">No</button></div></div>) : null}
        <button onClick={handleToggleCamera} className={isCameraOn ? "videoButtonsOn" : "videoButtonsOff"}>
          {isCameraOn ? "Turn camera off" : "Turn camera on"}
        </button>
        <button onClick={handleToggleMicrophone} className={isMicrophoneOn ? "videoButtonsOn": "videoButtonsOff"}>
          {isMicrophoneOn ? "Mute mic" : "Unmute mic"}
        </button>
      </div>
      <video className="localVideo" playsInline autoPlay muted ref={localVideo}></video>
    </div>
  );
};

export default VideoPlayer;