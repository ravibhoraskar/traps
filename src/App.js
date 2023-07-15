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
  const [innerHTML, setInnerHTML] = useState("<div><h1>Hello World</h1></div>");
  const [prompt, updatePrompt] = useState("");
  const submitPrompt = function () {
    console.log("Updating base on prompt: " + prompt);
    alert("Updating base on prompt: " + prompt);
    setInnerHTML(prompt);
  };

  return (
    <div className="App">
      <QuoteContext.Provider
        value={{ innerHTML, setInnerHTML, prompt, updatePrompt, submitPrompt }}
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
