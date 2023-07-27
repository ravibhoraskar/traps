import SplitPane, {
  Divider,
  SplitPaneBottom,
  SplitPaneLeft,
  SplitPaneRight,
  SplitPaneTop,
} from "./SplitPane";
import QuoteContext from "./QuoteContext";
import { useState, useEffect } from "react";
import Bard from "bard-ai";

import "./App.css";

function App() {
  const [HTMLlogs, setHTMLlogs] = useState(["<div><h1>Hello World</h1></div>"]);
  const [HTMLindex, setHTMLindex] = useState(0);
  const [prompt, updatePrompt] = useState("");
  const [manualEdit, setManualEdit] = useState(false);
  const [bardCookie, setBardCookie] = useState(["1234"]);

  useEffect(() => {
    async function initBard() {
      try {
        await Bard.init(bardCookie);
      } catch (e) {
        console.log(e);
      }
    }
    initBard();
  });

  // Variable for current HTML, and functions to update and append HTML logs
  const currHTML = HTMLlogs[HTMLindex];
  const updateLastHTML = function (newHTML) {
    setHTMLlogs(HTMLlogs.slice(0, HTMLindex).concat(newHTML));
  };
  const appendNewHTML = function (newHTML) {
    setHTMLlogs(HTMLlogs.slice(0, HTMLindex + 1).concat(newHTML));
    setHTMLindex(HTMLindex + 1);
  };

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
    // Potential prompt for updating HTML
    /*
    var full_prompt = (
      "A user's HTML source code is:\n```\n"
      + currHTML + "\n```\n"
      + "The user wants to modify the code as follows: "
      + prompt + "\n\n"
      + "Please provide the modified code.\n"
      + "Do not provide any text other than the modified code."
    );
    var bard_output = Bard.askAI(full_prompt);
    appendNewHTML(bard_output);
    */
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
          bardCookie,
          setBardCookie,
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
