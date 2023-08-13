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
import OpenAI from "./openai/OpenAI";
import "./App.css";
// import dotenv from 'dotenv';

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
  const submitPrompt = async function () {
    // Potential prompt for updating HTML
    console.log("blah blah blah")
    var full_prompt = (
      "Following is the HTML code of a webpage: ***HTML CODE BEGINS***"
      + currHTML + "***HTML CODE ENDS***"
      + "The user wants to modify the code as follows: ***USER INSTRUCTION BEGINS***"
      + prompt + "***USER INSTRUCTION ENDS***"
      + "Modify and return the given HTML code as per user's instructions.\n"
      + "The HTML code should be preceded by the phrase '***HTML CODE BEGINS***\n' and followed by the phrase '***HTML CODE ENDS***\n'."
    );


    const open_ai_obj = new OpenAI("Put your open AI key here"); //TODO: Put api key in env.
    // const open_ai_output = open_ai_obj.generateText(full_prompt, 'text-davinci-003', 3000, 0.85);

    const open_ai_output  = await open_ai_obj.generateText(full_prompt, 'text-davinci-003', 3000, 0.85);
    console.log(open_ai_output)
    //
    // // Find the index of the start and end markers
    const startIndex = open_ai_output.indexOf("***HTML CODE BEGINS***") + "***HTML CODE BEGINS***".length;
    const endIndex = open_ai_output.indexOf("***HTML CODE ENDS***");
    //
    // // Extract the substring between the start and end markers
    const html_output_openai = open_ai_output.substring(startIndex, endIndex);
    appendNewHTML(html_output_openai);
    // appendNewHTML(open_ai_output)
    /*
    var bard_output = Bard.askAI(full_prompt);
    appendNewHTML(bard_output);
     */
    // appendNewHTML(prompt);
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
