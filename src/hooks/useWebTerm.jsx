import { useEffect } from "react"
import useWebSocket from 'react-use-websocket'

function useWebTerm() {
  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket("ws://localhost:8000", { share: true })

  useEffect(() => {
    if (getWebSocket() !== null && getWebSocket().binaryType === "blob") {
      getWebSocket().binaryType = 'arraybuffer';
    }
  }, [readyState])

  return { sendMessage: sendMessage, lastMessage: lastMessage, readyState: readyState }
}

export default useWebTerm
