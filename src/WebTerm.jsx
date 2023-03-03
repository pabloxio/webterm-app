import { useEffect, useRef, useState } from "react"
import { Terminal } from "xterm";
import useWebSocket, { ReadyState } from 'react-use-websocket';

import "./WebTerm.css"

function WebTerm() {
  const [term,] = useState(new Terminal({
    screenKeys: true,
    useStyle: true,
    cursorBlink: true,
    fullscreenWin: true,
    maximizeWin: true,
    screenReaderMode: true,
    cols: 128,
  }))

  const terminalElement = useRef(null)
  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket("ws://localhost:8000", { share: true });

  useEffect(() => {
    switch (readyState) {
      case ReadyState.OPEN:
        console.log("Connected")
        if (getWebSocket().binaryType === "blob") {
          getWebSocket().binaryType = 'arraybuffer';
        }

        if (terminalElement.current && !term._initialized) {
          term.open(terminalElement.current)
          term.focus()
          term._initialized = true
          term.onData(function(data) {
            sendMessage(new TextEncoder().encode("\x00" + data))
          })
        }

        if (lastMessage !== null) {
          if (lastMessage.data instanceof ArrayBuffer) {
            let message = String.fromCharCode.apply(null, new Uint8Array(lastMessage.data));
            term.write(message)
          }
        }

        break

      case ReadyState.CLOSED:
        term.write("Session terminated");
        break

      case ReadyState.CONNECTING:
        console.log("Conneting...")
        break
    }
  }, [readyState, lastMessage])

  return <div className="xterm" ref={terminalElement}></div>
}

export default WebTerm
