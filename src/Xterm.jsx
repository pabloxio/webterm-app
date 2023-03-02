import { useEffect } from "react"
// import { Terminal } from "xterm"
import useWebSocket, { ReadyState } from 'react-use-websocket';

// import "./Xterm.css"

function Xterm() {
  const { sendMessage, readyState } = useWebSocket("ws://localhost:8000");
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendMessage("Holaaa!")
    }
  }, [readyState])

  return <>
    <span>The WebSocket is currently {connectionStatus}</span>
  </>
}

export default Xterm
