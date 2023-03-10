import { useEffect, useRef, useState } from "react"
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"

import "xterm/css/xterm.css"
import "./WebTerm.css"

import useWebTerm from "./hooks/useWebTerm"
import useWindowSize from "./hooks/useWindowSize"

const initalShell = {
  term: new Terminal({
    cursorBlink: true,
    creenReaderMode: true,
  }),
  fitAddon: new FitAddon(),
  initialized: false
}


function WebTerm() {
  const [shell,] = useState(initalShell)
  const terminalElement = useRef(null)
  const { sendMessage, lastMessage } = useWebTerm()
  const windowSize = useWindowSize()

  useEffect(() => {
    shell.fitAddon.fit()
  }, [windowSize])

  useEffect(() => {
    if (terminalElement.current && !shell.initialized) {
      shell.term.loadAddon(shell.fitAddon)
      shell.term.open(terminalElement.current)

      shell.term.focus()
      shell.initialized = true

      shell.term.onData(function(data) {
        sendMessage(new TextEncoder().encode("\x00" + data))
      })

      shell.term.onResize(function(data) {
        sendMessage(new TextEncoder().encode("\x01" + JSON.stringify({ cols: data.cols, rows: data.rows })))
      })
    }
  }, [terminalElement])

  useEffect(() => {
    if (lastMessage !== null && lastMessage.data instanceof ArrayBuffer) {
      let message = String.fromCharCode.apply(null, new Uint8Array(lastMessage.data));
      shell.term.write(message)
    }
  }, [lastMessage])

  return <div className="xterm" ref={terminalElement}></div>
}

export default WebTerm
