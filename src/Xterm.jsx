import { useEffect } from "react"
import { Terminal } from "xterm"

import "./Xterm.css"

function Xterm() {

  useEffect(() => {
    const term = new Terminal()
    term.open(document.getElementById("terminal"))
    term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
  }, [])

  return (
    <div id="terminal"></div>
  )
}

export default Xterm
