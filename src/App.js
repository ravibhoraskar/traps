import SplitPane, {
  Divider,
  SplitPaneBottom,
  SplitPaneLeft,
  SplitPaneRight,
  SplitPaneTop,
} from "./SplitPane";
import QuoteContext from "./QuoteContext";
import { useState } from "react";

import "./App.css";

function App() {

  const [HTMLlogs, setHTMLlogs] = useState(["<div><h1>Hello World</h1></div>"]);
  const [HTMLindex, setHTMLindex] = useState(0);
  const [prompt, updatePrompt] = useState("");
  const [manualEdit, setManualEdit] = useState(false);

  // Variable for current HTML, and functions to update and append HTML logs
  const currHTML = HTMLlogs[HTMLindex];
  const updateLastHTML = function (newHTML) {
    setHTMLlogs(HTMLlogs.slice(0, HTMLindex).concat(newHTML));
  }
  const appendNewHTML = function (newHTML) {
    setHTMLlogs(HTMLlogs.slice(0, HTMLindex + 1).concat(newHTML));
    setHTMLindex(HTMLindex + 1);
  }

  // Function to update HTML either manually or via prompt.
  const manualUpdateHTML = function (newHTML) {
    if (manualEdit) {
      updateLastHTML(newHTML);
    } else {
      appendNewHTML(newHTML);
      setManualEdit(true);
    }
  };
  const submitPrompt = function () {
    appendNewHTML(prompt);
    setManualEdit(false);
  };

  // Methods to undo and redo.
  const canUndo = HTMLindex > 0;
  const undoPrompt = function () {
    setHTMLindex(HTMLindex - 1);
    setManualEdit(false);
  };
  const canRedo = HTMLindex < HTMLlogs.length - 1;
  const redoPrompt = function () {
    setHTMLindex(HTMLindex + 1);
    setManualEdit(false);
  };

  return (
    <div className="App">
      <QuoteContext.Provider
        value={{
          HTMLlogs,
          HTMLindex,
          prompt,
          updatePrompt,
          currHTML,
          manualUpdateHTML,
          submitPrompt,
          canUndo,
          undoPrompt,
          canRedo,
          redoPrompt,
        }}
      >
        <SplitPane className="split-pane-row">
          <SplitPaneLeft>
            <SplitPane className="split-pane-col">
              <SplitPaneTop />
              <Divider className="separator-row" />
              <SplitPaneBottom />
            </SplitPane>
          </SplitPaneLeft>
          <Divider className="separator-col" />
          <SplitPaneRight />
        </SplitPane>
      </QuoteContext.Provider>
    </div>
  );
}

export default App;
