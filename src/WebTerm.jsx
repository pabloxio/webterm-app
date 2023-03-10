import { useEffect, useRef, useState } from "react"
import { Terminal } from "xterm"

import "xterm/css/xterm.css"
import useWebTerm from "./hooks/useWebTerm"

function WebTerm() {
  const [term,] = useState(new Terminal())
  const terminalElement = useRef(null)
  const { sendMessage, lastMessage } = useWebTerm()

  useEffect(() => {
    if (terminalElement.current && !term._initialized) {
      term.open(terminalElement.current)
      term.focus()
      term._initialized = true

      term.onData(function(data) {
        sendMessage(new TextEncoder().encode("\x00" + data))
      })
    }
  }, [terminalElement])

  useEffect(() => {
    if (lastMessage !== null && lastMessage.data instanceof ArrayBuffer) {
      let message = String.fromCharCode.apply(null, new Uint8Array(lastMessage.data));
      term.write(message)
    }
  }, [lastMessage])

  return <div className="xterm" ref={terminalElement}></div>
}

export default WebTerm
