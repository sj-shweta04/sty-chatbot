import React, { useState, useEffect, useRef } from "react";
import { TextField, Box, Grid, IconButton, Collapse } from "@mui/material";
import { Icon } from "@iconify/react";
import Send from "@mui/icons-material/Send";
import useMediaQuery from "@mui/material/useMediaQuery";
import { makeStyles } from "@mui/styles";
import { styled, useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import robo from "../../assets/images/cuteChatbot.png";
import user from "../../assets/images/icon/user.png";
import "./BotScreen.css";
import { APIUSER } from "../../E2E/axios.util";
import Modal from "../Modal";
import LoadingDots from "../Loading/LoadingDots";
import MinimizeIcon from "@mui/icons-material/Minimize";

const Content = styled("div")({
  background: "#f0f0f0",
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

const BotPractice = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [showQuestion, setShowQuestion] = useState("");
  const [minimize, setMinimize] = useState(false);
  const [modal, setModal] = useState(false);
  const [minimizeGrid, setMinimizeGrid] = useState(true);
  const [qaData, setQaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupData, setPopupDataQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectChatId, setSelectChatId] = useState("");
  const [alert, setAlert] = useState(false);
  const chatContainerRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const storedChatMessages = localStorage.getItem("chatMessages");
    if (storedChatMessages) {
      setQaData(JSON.parse(storedChatMessages));
    }
  }, []);


  const handleMinimize = () => {
    setMinimize(!minimize);
  };

  const handlediscussion = () => {
    setLoading(true);
    setShowQuestion(question);
    setQuestion("");
    const payload = { question: question };
    APIUSER.post("/get_question", payload)
      .then((response) => {
        setShowQuestion("");
        if (response.data.query) {
          handleAddQa(response.data.answer);
        }
        if (response.data.answer === undefined) {
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

  const handleAddQa = (answerRes) => {
    const newQa = {
      question: question,
      answer: answerRes,
    };
    setQaData([...qaData, newQa]);
    setQuestion("");
  };

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
              style={{
                position: "fixed",
                right: "25px",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                marginTop: isMobile ? "10vh" : "20vh",
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
                  borderRadius: "5px",
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
                    borderRadius: "3px",
                  }}
                >
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
                              marginLeft: "4px",
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
                                fontSize: "14px",
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
                              <div key={index}>
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
                                      marginLeft: "14px",
                                      textAlign: "left",
                                      border: "1px solid #d3d3d3",
                                      width: "82%",
                                      fontSize: "14px",
                                    }}
                                  >
                                    <span>{qa.question}</span>
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
                        s={12}
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
                          s={10.5}
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

                        <Grid item s={1} md={1} lg={1}>
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
              s={4}
              md={6}
              lg={12}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "85vh",
                textAlign: "right",
                position: "fixed",
              }}
              sx={{
                marginLeft: {
                  xs: "75vw",
                  sm: "80vw",
                  md: "85vw",
                  lg: "90vw",
                },
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

export default BotPractice;
