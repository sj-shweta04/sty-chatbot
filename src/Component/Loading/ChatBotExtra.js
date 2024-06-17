import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Box, Grid, IconButton, Collapse } from "@mui/material";
import { Icon } from "@iconify/react";
import Send from "@mui/icons-material/Send";
import useMediaQuery from "@mui/material/useMediaQuery";
import { makeStyles } from "@mui/styles";
import { styled, useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import robo from "../../assets/images/cuteChatbot.png";
import user from "../../assets/images/icon/user.png";
// import "../Bot/BotScreen.css";
import { APIUSER } from "../../E2E/axios.util";
import Modal from "../Modal";
import LoadingDots from "./LoadingDots";
import MinimizeIcon from "@mui/icons-material/Minimize";

const Container = styled("div")({
  display: "flex",
  flexDirection: "column-reverse",
});

const Content = styled("div")({
  background: "#f0f0f0",
  //padding: '16px',
  borderRadius: "4px",
});

const CustomCollapse = ({ in: inProp, children }) => {
  return (
    <Collapse
      in={inProp}
      timeout={300}
      orientation="vertical"
      style={{
        transformOrigin: "bottom",
        transition: "transform 300ms",
      }}
    >
      <Content>{children}</Content>
    </Collapse>
  );
};

const useStyles = makeStyles((theme) => ({
  resizable: {
    position: "relative",
    "& .react-resizable-handle": {
      position: "absolute",
      width: 20,
      height: 20,
      bottom: 0,
      right: 0,
      background:
        "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmYwMCIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4Ij48ZyBvcGFjaXR5PSIwLjMwMiI+PHBhdGggZD0iTSA2IDYgTCAwIDYgTCAwIDQuMiBMIDQgNC4yIEwgNC4yIDQuMiBMIDQuMiAwIEwgNiAwIEwgNiA2IEwgNiA2IFoiIGZpbGw9IiMwMDAwMDAiLz48L2c+PC9zdmc+')",
      "background-position": "bottom right",
      padding: "0 3px 3px 0",
      "background-repeat": "no-repeat",
      "background-origin": "content-box",
      "box-sizing": "border-box",
      cursor: "se-resize",
    },
  },
}));
const ChatBotExtra = () => {
  const classes = useStyles();
  // const userName = localStorage.getItem("userName");
  // const email = localStorage.getItem("email");

  const navigate = useNavigate();
  const [alignment, setAlignment] = useState("ownData");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionLLM, setQuestionLLM] = useState("");
  const [answerLLM, setAnswerLLM] = useState("");
  const [showQuestion, setShowQuestion] = useState("");
  const [showQuestionLLM, setShowQuestionLLM] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const [alertType, setAlertType] = useState("");
  const [minimize, setMinimize] = useState(false);
  const [modal, setModal] = useState(false);
  const [minimizeGrid, setMinimizeGrid] = useState(true);
  const [selectedValue, setSelectedValue] = useState(null);
  const [up, setUp] = useState(false);
  const [option, setOption] = useState([]);
  const [selectChatId, setSelectChatId] = useState("");
  const [update, setUpdate] = useState("");
  const [indexNameForAI, setIndexNameForAI] = useState("");
  const [popupData, setPopupDataQuery] = useState("");
  const [down, setDown] = useState("");

  localStorage.setItem("selectChatId", selectChatId);
  const handleAlert = () => {
    setAlert(false);
  };

  const handleMinimize = () => {
    setMinimize(!minimize);
  };

  const [size, setSize] = useState({ width: 200, height: 200 }); // Initial size

  // Function to handle resize event
  const handleResize = (event, direction, ref, delta) => {
    // Update the size state with the new width and height
    setSize({
      width: ref.style.width ? parseFloat(ref.style.width) : size.width,
      height: ref.style.height ? parseFloat(ref.style.height) : size.height,
    });
  };

  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const handleClickOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [openShare, setOpenShare] = useState(false);

  const handleOpenShareModal = () => {
    setOpenShare(true);
  };

  const handlediscussion = () => {
    setLoading(true);
    setShowQuestion(question);
    setQuestion("");
    const payload = { question: question };
    APIUSER.post("/get-question", payload)
      // APIUSER.post("bot_query", payload)
      .then((response) => {
        // console.log("bot_query response", response);
        console.log("data -- ", response.data);
        setShowQuestion("");
        if (response.data.query) {
          handleAddQa(response.data.answer);
        }
        if (response.data.answer === undefined) {
          // setAnswer(response.data.response[0].response);
          // handleAddQa(response.data.response);
        } else {
          setAnswer(response.data.answer);
          handleAddQa(response.data.answer);
        }
      })
      .catch((error) => {
        console.error("API request failed:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handlediscussion();
    }
  };

  const [qaData, setQaData] = useState([]);
  console.log("qaData", qaData);

  const handleAddQa = (answerRes) => {
    const newQa = {
      question: question,
      answer: answerRes,
    };
    setQaData([...qaData, newQa]);
    // setQuestion("");
  };

  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the chat window when qaData changes
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [qaData]);

  // handle open and close for dialogbox
  const [isOpen, setIsOpen] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDialog = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="bgImage" style={{ width: "100%", height: "120vh" }}>
        <Grid item xs={12} md={6} lg={3}>
          {minimize ? (
            <Grid
              container
              xs={12}
              md={12}
              lg={12}
              style={{
                // marginTop: "1%",
                position: "fixed",
                right: "25px",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                marginTop: "200px",
              }}
            >
              <Grid
                item
                xs={4}
                md={3}
                lg={3}
                style={{
                  height: "70%",
                  border: "1px solid #115E98",
                  borderRadius: "10px",
                  marginTop: minimizeGrid ? "0px" : "25%",
                  width: "10%",
                }}
              >
                <Grid
                  item
                  xs={12}
                  md={12}
                  lg={12}
                  style={{
                    backgroundColor: "#115E98",
                    color: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "5px",
                    borderRadius: "10px 10px 0px 0px",
                  }}
                >
                  {/* --------------------------------------------------- */}

                  <div
                    style={{
                      backgroundColor: "#115E98",
                      color: "white",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "5px",
                      borderRadius: "10px 10px 0px 0px",
                    }}
                  >
                    <img
                      src={robo}
                      alt="bot icon"
                      height={50}
                      width={50}
                      style={{ borderRadius: "50%" }}
                    />
                    <span>Bot</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    {!minimizeGrid ? (
                      <IconButton
                        onClick={() => setMinimizeGrid(true)}
                        title="Minimize"
                        style={{ cursor: "pointer" }}
                      >
                        <MinimizeIcon
                          sx={{ color: "white", marginBottom: "15px" }}
                        />
                      </IconButton>
                    ) : (
                      <IconButton
                        title="Minimize"
                        onClick={() => setMinimizeGrid(false)}
                      >
                        <MinimizeIcon
                          sx={{ color: "white", marginBottom: "15px" }}
                        />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={() => {
                        if (qaData.length > 0) {
                          setModal(true);
                          handleMinimize();
                          setMinimizeGrid(true);
                        } else {
                          setMinimize(false);
                          setMinimizeGrid(true);
                        }
                      }}
                      title="Close"
                      style={{ cursor: "pointer" }}
                    >
                      <CloseIcon sx={{ color: "white" }} />
                    </IconButton>
                  </div>
                </Grid>
                <Grid item xs={12} md={12} lg={12}></Grid>
                {/* addition of timeout ---  timeout={{ enter: 800, exit: 800 }} */}
                <CustomCollapse
                  in={minimizeGrid}
                  timeout={{ enter: 800, exit: 800 }}
                >
                  <Grid
                    item
                    xs={12}
                    md={12}
                    lg={12}
                    style={{
                      backgroundColor: "white",
                      height: "100%",
                      borderRadius: "0px 0px 10px 10px",
                    }}
                  >
                    <Grid item xs={12} md={12} lg={12}>
                      {/* user input---------------- */}
                      <Grid item className="firstBox" ref={chatContainerRef}>
                        <Box>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              marginBottom: "5px",
                              alignItems: "center",
                              marginBottom: "20px",
                              marginTop: "20px",
                            }}
                          >
                            <img src={robo} alt="robo" height={35} width={35} />
                            <div
                              style={{
                                padding: "10px",
                                borderRadius: "10px 10px 10px 10px",
                                marginLeft: "12px",
                                border: "1px solid #d3d3d3",
                                width: "80%",
                                textAlign: "left",
                              }}
                            >
                              <span>
                                Welcome to Shyena Tech Yarn's Chatbot. How can I
                                assist you?
                              </span>
                            </div>
                          </div>
                          {qaData.map((qa, index) => {
                            return (
                              <div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    marginBottom: "5px",
                                    paddingRight: "5px",
                                    alignItems: "center",
                                    marginBottom: "20px",
                                    marginLeft: "12px",
                                  }}
                                >
                                  <img
                                    src={user}
                                    alt="user"
                                    height={25}
                                    width={25}
                                  />
                                  <div
                                    style={{
                                      padding: "10px",
                                      borderRadius: "10px 10px 10px 10px",
                                      marginLeft: "10px",
                                      textAlign: "left",
                                      border: "1px solid #d3d3d3",
                                      width: "82%",
                                      fontSize: "14px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        paddingLeft: 5,
                                        paddingRight: 5,
                                      }}
                                    >
                                      {qa.question}
                                    </span>
                                  </div>
                                </div>
                                {qa.answer && (
                                  <>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        marginBottom: "5px",
                                        alignItems: "center",
                                        marginBottom: "20px",
                                        marginLeft: "6px",
                                      }}
                                    >
                                      <img
                                        src={robo}
                                        alt="robo"
                                        height={35}
                                        width={35}
                                      />
                                      <div
                                        style={{
                                          borderRadius: "10px 10px 10px 10px",
                                          marginLeft: "10px",
                                          textAlign: "left",
                                          border: "1px solid #d3d3d3",
                                          width: "82%",
                                          padding: "10px",
                                          fontSize: "14px",
                                        }}
                                      >
                                        {typeof qa.answer === "string" ? (
                                          <>{qa.answer}</>
                                        ) : (
                                          <div>No data available</div>
                                        )}
                                      </div>
                                    </div>
                                    {qa.answer.retrieved_chunks && (
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "end",
                                          marginBottom: "10px",
                                        }}
                                      >
                                        <IconButton
                                          sx={{
                                            backgroundColor: "#115E98",
                                            "&:hover": {
                                              backgroundColor: "#0083b3",
                                            },
                                          }}
                                          size="small"
                                          onClick={() => {
                                            handleDialog();
                                            setPopupDataQuery(
                                              qa.answer.retrieved_chunks
                                            );
                                          }}
                                        >
                                          <Icon
                                            icon="material-symbols:question-mark"
                                            style={{
                                              color: "white",
                                            }}
                                          />
                                        </IconButton>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}
                          {showQuestion && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                marginBottom: "5px",
                                paddingRight: "5px",
                                alignItems: "center",
                                marginBottom: "20px",
                                marginLeft: "10px",
                                position: "sticky",
                              }}
                            >
                              <img
                                src={user}
                                alt="user"
                                height={25}
                                width={25}
                              />
                              <div
                                style={{
                                  padding: "10px",
                                  borderRadius: "10px 10px 10px 10px",
                                  marginLeft: "15px",
                                  textAlign: "left",
                                  border: "1px solid #d3d3d3",
                                  width: "80%",
                                }}
                              >
                                <span
                                  style={{ paddingLeft: 5, paddingRight: 5 }}
                                >
                                  {showQuestion}
                                </span>
                              </div>
                            </div>
                          )}
                        </Box>
                        <div>
                          {/* ~~~~~~~~~~~~~~~~~~~~~ SJ changes ~~~~~~~~~~~~~~~~~~~~ */}
                          {loading && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                marginBottom: "5px",
                                paddingRight: "5px",
                                alignItems: "center",
                                marginBottom: "20px",
                                marginLeft: "6px",
                              }}
                            >
                              <img
                                src={robo}
                                alt="robo"
                                height={35}
                                width={35}
                              />
                              <div
                                style={{
                                  padding: "10px",
                                  borderRadius: "10px 10px 10px 10px",
                                  marginLeft: "10px",
                                  textAlign: "left",
                                  border: "1px solid #d3d3d3",
                                  width: "82%",
                                }}
                              >
                                <LoadingDots />
                              </div>
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid
                        item
                        container
                        xs={12}
                        md={12}
                        lg={12}
                        spacing={0.5}
                        style={{
                          padding: "10px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: question.length === 0 && "15px",
                        }}
                      >
                        <Grid
                          item
                          xs={10.5}
                          md={10.5}
                          lg={10.5}
                          // md={question.length === 0 ? 12 : 10.5}
                          // lg={question.length === 0 ? 12 : 10.5}
                        >
                          <TextField
                            fullWidth
                            id="fullWidth"
                            placeholder="Type your message..."
                            onChange={(e) => setQuestion(e.target.value)}
                            value={question}
                            onKeyDown={handleKeyPress}
                            size="small"
                            autoComplete="off" // Disables the browser's autocomplete
                          />
                        </Grid>

                        <Grid item xs={1} md={1} lg={1}>
                          {question.length !== 0 && (
                            <IconButton
                              title="Send"
                              onClick={handlediscussion}
                              style={{
                                backgroundColor: "#115E98",
                                "&:hover": {
                                  backgroundColor: "#0083b3",
                                },
                                padding: "5px",
                              }}
                            >
                              <Send style={{ color: "white" }} />
                            </IconButton>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CustomCollapse>
              </Grid>
            </Grid>
          ) : (
            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "80vh",
                marginLeft: "90vw",
                textAlign: "right",
                position: "fixed",
              }}
            >
              {/* <div
                style={{ backgroundColor: "#115E98", borderRadius: "50%" }}
                onClick={handleMinimize}
              > */}
              <img
                src={robo}
                alt="robo"
                height={60}
                width={60}
                onClick={handleMinimize}
                title="Chat With Us Here."
                style={{
                  cursor: "pointer",
                  margin: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#115E98", //#115E98
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
              {/* </div> */}
            </Grid>
          )}
        </Grid>
      </div>

      <Modal
        open={modal}
        setOpen={setModal}
        setQaData={setQaData}
        setMinimize={setMinimize}
      />
    </>
  );
};

export default ChatBotExtra;
