import React, {
  createRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import QuoteContext from "./QuoteContext";
import SplitPaneContext from "./SplitPaneContext";

const SplitPane = ({ children, ...props }) => {
  const [clientHeight, setClientHeight] = useState(null);
  const [clientWidth, setClientWidth] = useState(null);
  const yDividerPos = useRef(null);
  const xDividerPos = useRef(null);

  const onMouseHoldDown = (e) => {
    yDividerPos.current = e.clientY;
    xDividerPos.current = e.clientX;
  };

  const onMouseHoldUp = () => {
    yDividerPos.current = null;
    xDividerPos.current = null;
  };

  const onMouseHoldMove = (e) => {
    if (!yDividerPos.current && !xDividerPos.current) {
      return;
    }

    setClientHeight(clientHeight + e.clientY - yDividerPos.current);
    setClientWidth(clientWidth + e.clientX - xDividerPos.current);

    yDividerPos.current = e.clientY;
    xDividerPos.current = e.clientX;
  };

  useEffect(() => {
    document.addEventListener("mouseup", onMouseHoldUp);
    document.addEventListener("mousemove", onMouseHoldMove);

    return () => {
      document.removeEventListener("mouseup", onMouseHoldUp);
      document.removeEventListener("mousemove", onMouseHoldMove);
    };
  });
  return (
    <div {...props}>
      <SplitPaneContext.Provider
        value={{
          clientHeight,
          setClientHeight,
          clientWidth,
          setClientWidth,
          onMouseHoldDown,
        }}
      >
        {children}
      </SplitPaneContext.Provider>
    </div>
  );
};

export const Divider = (props) => {
  const { onMouseHoldDown } = useContext(SplitPaneContext);

  return <div {...props} onMouseDown={onMouseHoldDown} />;
};

export const SplitPaneTop = (props) => {
  const topRef = createRef();
  const { clientHeight, setClientHeight } = useContext(SplitPaneContext);
  const {
    prompt,
    updatePrompt,
    submitPrompt,
    canUndo,
    undoPrompt,
    canRedo,
    redoPrompt,
    bardCookie,
    setBardCookie,
  } = useContext(QuoteContext);

  useEffect(() => {
    if (!clientHeight) {
      setClientHeight(topRef.current.clientHeight);
      return;
    }

    topRef.current.style.minHeight = clientHeight + "px";
    topRef.current.style.maxHeight = clientHeight + "px";
  }, [clientHeight, setClientHeight, topRef]);

  return (
    <div {...props} className="split-pane-top" ref={topRef}>
      <div>
        <form>
          <div>
            <textarea
              placeholder="What should I change?"
              value={prompt}
              onChange={(event) => {
                updatePrompt(event.target.value);
              }}
            />
          </div>
          <div>
            <input type="button" value="Update HTML" onClick={submitPrompt} />
            <br />
            <input
              type="button"
              value="Undo"
              onClick={undoPrompt}
              disabled={!canUndo}
            />{" "}
            {}
            <input
              type="button"
              value="Redo"
              onClick={redoPrompt}
              disabled={!canRedo}
            />
          </div>
          Bard Cookie:{" "}
          <input
            type="text"
            value={bardCookie}
            onChange={(event) => {
              setBardCookie(event.target.value);
            }}
          />
        </form>
      </div>
    </div>
  );
};

export const SplitPaneBottom = (props) => {
  const { HTMLlogs, HTMLindex, currHTML, manualUpdateHTML } =
    useContext(QuoteContext);

  return (
    <div {...props} className="split-pane-bottom">
      <b> Current HTML: </b>
      <br />
      <textarea
        value={currHTML}
        onChange={(event) => {
          manualUpdateHTML(event.target.value);
        }}
      />
      <br />
      <b>Current index:</b> {HTMLindex} <br />
      <b>Logs length:</b> {HTMLlogs.length}
    </div>
  );
};

export const SplitPaneLeft = (props) => {
  const topRef = createRef();
  const { clientWidth, setClientWidth } = useContext(SplitPaneContext);

  useEffect(() => {
    if (!clientWidth) {
      setClientWidth((topRef.current.clientWidth * 3) / 4);
      return;
    }

    topRef.current.style.minWidth = clientWidth + "px";
    topRef.current.style.maxWidth = clientWidth + "px";
  }, [clientWidth, setClientWidth, topRef]);

  return <div {...props} className="split-pane-left" ref={topRef} />;
};

export const SplitPaneRight = (props) => {
  const { currHTML } = useContext(QuoteContext);
  const markup = { __html: currHTML };
  return (
    <div {...props} className="split-pane-right">
      <div className="quote" dangerouslySetInnerHTML={markup} />
    </div>
  );
};

export default SplitPane;
