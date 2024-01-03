import { useEffect, useRef, useState } from "react";
import { VideoPlayerPropType } from "../types";
import Peer from 'simple-peer'
import { socket } from "../logic/utils";
import { IoVideocam, IoVideocamOff } from "react-icons/io5";
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";

const VideoPlayer = (props: VideoPlayerPropType) => {
  const opponentId = sessionStorage.getItem('opponentId')
  const playerId = sessionStorage.getItem('playerId')
  const { initiator } = props
  const [localStream, setlocalStream] = useState<MediaStream>();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [callerSignal, setCallerSignal] = useState<Peer.SignalData>()
  const [showCanJoinVideoChat, setShowCanJoinVideoChat] = useState<boolean>(false)
  const [initiatorVideoOff, setInitiatorVideoOff] = useState<boolean>(false)
  const [triggeredCallInitiation, setTriggeredCallInitiation] = useState<boolean>(false)
  const startShowingVideo = useRef<boolean>(false)
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
    })
            
    //Cleanup function
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isCameraOn && localStream) {
      if (initiator) {
        socket.emit('initiatorVideoOn', opponentId)
      }
      localStream.getVideoTracks().forEach((track) => (track.enabled = true));
    } else if (localStream) {
      if (initiator) {
        socket.emit('initiatorVideoOff', opponentId)
      }
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

  useEffect(() => {
    if (initiator && localStream && !triggeredCallInitiation) {
      initiateVideoCall()
      setTriggeredCallInitiation(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStream])

  useEffect(() => {
    if (callerSignal)
      acceptVideoCall()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callerSignal])

  useEffect(() => {
    if (opponentVideo && !startShowingVideo.current)
      setShowCanJoinVideoChat(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opponentVideo])

  const handleToggleCamera = () => {
    setIsCameraOn((prevIsCameraOn) => !prevIsCameraOn);
  };

  const handleToggleMicrophone = () => {
    setIsMicrophoneOn((prevIsMicrophoneOn) => !prevIsMicrophoneOn);
  };

  const initiateVideoCall = () => {
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

  socket.on(`${playerId}-initiatorVideoOff`, (()=> {
    setInitiatorVideoOff((prevState) => !prevState)
  }))

  socket.on(`${playerId}-initiatorVideoOn`, (()=> {
    setInitiatorVideoOff((prevState) => !prevState)
  }))

  const disableVideoCall = () => {
    setShowCanJoinVideoChat(false)
    startShowingVideo.current = true
    setIsCameraOn(false)
  }

  const enableVideoCall = () => {
    setShowCanJoinVideoChat(false)
    startShowingVideo.current = true
  }

  return (
    <div className="videoContainer">
      <div className="opponentVideoContainer"><video className="opponentVideo" playsInline autoPlay ref={opponentVideo} hidden={!startShowingVideo.current || initiatorVideoOff}></video></div>
      <div className="videoButtonsContainer">
        {showCanJoinVideoChat ? (<div className="videoChatOptions"><div className="chatOptionsCopy"><p><strong>Enable video sharing?</strong></p></div><div className="chatOptionsButtonsContainer"><button onClick={enableVideoCall} className="chatOptionsButtonYes">Yes</button><button onClick={disableVideoCall} className="chatOptionsButtonNo">No</button></div></div>) : null}
        {<div className={isCameraOn ? "videoButtonsIconOn" : "videoButtonsIconOff"} onClick={handleToggleCamera}>{isCameraOn ? <IoVideocam /> : <IoVideocamOff />}</div>}
        {<div className={isMicrophoneOn ? "audioButtonsIconOn" : "audioButtonsIconOff"} onClick={handleToggleMicrophone}>{isMicrophoneOn ? <AiOutlineAudio /> : <AiOutlineAudioMuted />}</div>}
      </div>
      <video className="localVideo" playsInline autoPlay muted ref={localVideo}></video>
    </div>
  );
};

export default VideoPlayer;