/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import screenfull from "screenfull";
import { useNavigate, useParams } from "react-router-dom";
import "./Exam.css";
import { FaCaretLeft, FaCaretRight, FaRegFlag } from "react-icons/fa";
import { FaFlag } from "react-icons/fa6";
import { Button } from "@mui/material";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { FaClock } from "react-icons/fa";
import Service from "../../../../service/Service";
import Modal from "react-modal"; // Import a modal library (e.g., react-modal)
import fscreen from 'fscreen';


function Exam() {
    const { examID } = useParams();

    const [exam, setExam] = useState({
        examName: "",
        duration: "",
        questions: "",
        section: "",
        startDateTime: "",
        endDateTime: "",
        questionsList: []
    });

    console.log(examID);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [flaggedQuestionsState, setFlaggedQuestions] = useState(new Set());
    const [answers, setAnswers] = useState({});
    const [fullscreenMode, setFullscreenMode] = useState(true);
    const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
    const [timer, setTimer] = useState(15);
    const [time, setTime] = useState(localStorage.getItem("timeLeft") || 1800);
    const [answered, setAnswered] = useState(0);
    const [notAnswered, setNotAnswered] = useState(0);
    const [marked, setMarked] = useState(0);
    const [markedAnswered, setMarkedAnswered] = useState(0);

    useEffect(() => {

        localStorage.setItem("start_time", startTimeFuntion());

        const getExamDetails = async (examID) => {
            try {
                const response = await Service.get(`/getExamsWithQuestions`, {
                    params: { ID: examID },
                });
                const data = response.data.exams[0];
                console.log(data);
                // Parse options and correctAnswer for each question
                const parsedQuestions = data.questionsList.map((question) => ({
                    ...question,
                    options: JSON.parse(question.options), // Parse options from string to array
                    correctAnswer: JSON.parse(question.correctAnswer), // Parse correctAnswer from string to array
                }));

                setQuestions(parsedQuestions);
                setExam(data);
            } catch (error) {
                console.error("Error fetching exam details:", error);
            }
        };

        getExamDetails(examID);
    }, [examID]);

    useEffect(() => {
        const enterFullscreen = () => {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        };

        // Automatically trigger fullscreen
        if (!document.fullscreenElement) {
            enterFullscreen();
        }
    }, []);

    useEffect(() => {
        if (fullscreenMode) {
            screenfull.request();
        }
    })


    // Timer countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setTime((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        if (time === 0) {
            clearInterval(timer);
            alert(`Time's up! Submitting your exam.`);
            handleExamSubmit();

        }

        localStorage.setItem("timeLeft", time);

        return () => {
            clearInterval(timer);
            localStorage.removeItem("timeLeft");

        }
    }, [time]);

    // Format time as HH:MM:SS
    const formatTimer = (timeInSec) => {
        let hours = Math.floor(timeInSec / 3600);
        let minutes = Math.floor((timeInSec % 3600) / 60);
        let seconds = timeInSec % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        // Function to enter fullscreen
        const enterFullscreen = () => {
            if (fscreen.fullscreenEnabled && !fscreen.fullscreenElement) {
                fscreen.requestFullscreen(document.documentElement);
            }
        };

        // Function to detect if fullscreen is exited and re-enter it
        const handleFullscreenChange = () => {
            if (!fscreen.fullscreenElement) {
                enterFullscreen(); // Re-enter fullscreen if exited
            }
        };

        // Enter fullscreen when component mounts
        enterFullscreen();

        // Listen for fullscreen changes
        fscreen.addEventListener("fullscreenchange", handleFullscreenChange);

        // Cleanup event listener when component unmounts
        return () => {
            fscreen.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);


    // Listen for fullscreen mode changes
    useEffect(() => {
        if (screenfull.isEnabled) {
            const handleChange = () => {
                const isFullscreen = screenfull.isFullscreen;
                setFullscreenMode(isFullscreen);

                // If user exits fullscreen, show the warning modal
                if (!isFullscreen) {
                    setShowFullscreenWarning(true);
                    startTimer();
                }
            };

            screenfull.on("change", handleChange);

            return () => screenfull.off("change", handleChange);
        }
    }, []);

    // Timer logic
    useEffect(() => {
        let interval;
        if (showFullscreenWarning && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            // If timer reaches 0, submit the exam
            handleExamSubmit();
            setShowFullscreenWarning(false);
        }

        return () => clearInterval(interval);
    }, [showFullscreenWarning, timer]);

    // Start the timer
    const startTimer = () => {
        setTimer(15);
    };

    // Re-enable fullscreen
    const enableFullscreen = () => {
        if (screenfull.isEnabled) {
            screenfull.request();
            setShowFullscreenWarning(false);
        }
    };


    // Flagging questions
    const handleFlaggedQuestion = (questionId) => {
        setFlaggedQuestions((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(questionId)) {
                newSet.delete(questionId);
            } else {
                newSet.add(questionId);
            }

            localStorage.setItem("flaggedQuestions", JSON.stringify(Array.from(newSet)));
            return newSet;
        });
    };

    // Handling question navigation
    const handleNavigation = (direction) => {
        setCurrentQuestion((prev) => {
            if (direction === "next" && prev < questions.length - 1) {
                return prev + 1;
            } else if (direction === "prev" && prev > 0) {
                return prev - 1;
            }
            return prev;
        });
    };

    // Answer selection
    const handleOptionSelect = (questionId, option) => {
        let answeredQuestions = JSON.parse(localStorage.getItem("answeredQuestions")) || [];
        const existingQuestion = answeredQuestions.find((item) => item.questionId === questionId);

        if (existingQuestion) {
            existingQuestion.option = option;
        } else {
            answeredQuestions.push({ questionId, option });
        }
        localStorage.setItem("answeredQuestions", JSON.stringify(answeredQuestions));

        setAnswers((prev) => {
            const isNewAnswer = !(questionId in prev);
            return { ...prev, [questionId]: option };
        });
    };

    // Clear answer for a question
    const handleClearOption = (questionId) => {
        setAnswers((prev) => {
            const { [questionId]: _, ...remainingAnswers } = prev;
            return remainingAnswers;
        });
    };

    // Submit the exam
    // const handleExamSubmit = () => {
    //     alert("Exam submitted!");
    //     // localStorage.clear();
    // };


    function startTimeFuntion() {
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0];
        return `${date} ${time}`;
    }

    function endTimeFuntion() {
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0];
        return `${date} ${time}`;
    }

    const navigate = useNavigate();

    const handleExamSubmit = () => {

        const computedEndTime = endTimeFuntion();
        const startTime = localStorage.getItem("start_time");

        alert('Exam submitted!');
        console.log(answers);
        screenfull.exit();

        let score = 0;
        let inCorrect = 0;
        for (let i = 0; i < questions.length; i++) {
            if (questions[i].correctAnswer == answers[i]) {
                score++;
            } else {
                inCorrect++;
            }
            console.log(questions[i].correctAnswer, answers[i]);
        }
        console.log(score, inCorrect);

        // Set up the response object
        const response = {
            InternID: "RS24J005",
            ExamID: examID,
            examStatus: 1,
            responses: answers,
            start_time: startTime,
            end_time: computedEndTime,  // Use the computed end time here
            score: score
        };
        console.log(response);

        Service.put("/updateAssignedExams", response)
            .then((res) => {
                console.log(res);
                // localStorage.removeItem("timeLeft")
                localStorage.clear();
                navigate("/candidate/dashboard");
                screenfull.exit();

            })
            .catch((err) => {
                console.log(err);
            });

        alert(`score: ${score}`)
    };


    // Handle question selection from the list
    const handleQuestionClick = (index) => {
        setCurrentQuestion(index);
    };

    useEffect(() => {
        const totalQuestions = questions.length;

        // Calculate answered and not answered
        const answeredQuestionsCount = Object.keys(answers).length;
        setNotAnswered(totalQuestions - answeredQuestionsCount);

        // Calculate marked and markedAnswered
        let flaggedAndAnswered = 0;
        let flaggedAndNotAnswered = 0;

        flaggedQuestionsState.forEach((questionId) => {
            if (answers[questionId]) {
                flaggedAndAnswered++;
            } else {
                flaggedAndNotAnswered++;
            }
        });

        setMarked(flaggedAndNotAnswered);
        setMarkedAnswered(flaggedAndAnswered);
        setAnswered(answeredQuestionsCount);
    }, [answers, questions, flaggedQuestionsState]);


    const getQuestionsData = () => {
        let questionsData = {};
        let optionsData = {};
        let qNo;

        const answeredQuestions = JSON.parse(localStorage.getItem("answeredQuestions")) || [];

        console.log(answeredQuestions);
        for (let i = 0; i < answeredQuestions.length; i++) {
            qNo = answeredQuestions[i].questionId;
            let option = answeredQuestions[i].option;
            questionsData[qNo] = option;
            console.log(questions[qNo]);
            optionsData[qNo] = option;
        }
        console.log(optionsData);
        setAnswers(optionsData);
        let currentQuestion = Object.keys(optionsData).length;
        console.log(currentQuestion);
        setCurrentQuestion(currentQuestion);
        setAnswered(currentQuestion);

        const flaggedQuestions = localStorage.getItem("flaggedQuestions");

        console.log(flaggedQuestions);


        // setFlaggedQuestions((prev) => {
        //     const newSet = new Set(prev);
        //     if (newSet.has(questionId)) {
        //         newSet.delete(questionId);
        //     } else {
        //         newSet.add(questionId);
        //     }

        //     // Convert the updated Set to an array and store it in localStorage
        //     const flaggedQuestionsArray = Array.from(newSet);
        //     localStorage.setItem("flaggedQuestions", JSON.stringify(flaggedQuestionsArray));

        //     return newSet;   
        // });

        // setCurrentQuestion(qNo);



    }
    useEffect(() => {
        getQuestionsData();
    }, [])



    return (
        <div>
            <header id="takeExam_header_cont">
                <nav className="d-flex justify-content-between px-3 w-100">
                    <div style={{ fontSize: "17px", fontWeight: "bolder", marginTop: "7px" }}>{exam.examName}</div>
                    <div style={{ marginLeft: "820px", fontSize: "17px", fontWeight: "bolder", marginTop: "7px" }}>
                        <FaClock style={{ marginRight: "3px" }} /> {formatTimer(time)}
                    </div>


                    {/* {fullscreenMode ? (
                        <button
                            style={{
                                width: "16vh",
                                fontSize: "13px",
                                fontWeight: "bolder",
                                height: "5vh",
                                border: "none",
                            }}
                            onClick={handleFullscreen}
                        >
                            <MdFullscreenExit /> Exit Fullscreen
                        </button>
                    ) : (
                        <button
                            style={{
                                width: "16vh",
                                fontSize: "13px",
                                fontWeight: "bolder",
                                height: "5vh",
                                border: "none",
                            }}
                            onClick={handleFullscreen}
                        >
                            <MdFullscreen /> Fullscreen
                        </button>
                    )} */}
                </nav>
                <div style={{ marginRight: "20px" }}>
                    <button
                        style={{
                            width: "10vh",
                            fontSize: "13px",
                            fontWeight: "bolder",
                            height: "5vh",
                            border: "none",
                        }}
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#submitModal"
                    >
                        Submit
                    </button>
                </div>
            </header>

            <aside className="d-flex">
                <div className="w-75">
                    <section style={{ width: "100%", display: "flex", height: "90vh" }}>
                        <div>
                            <div className="takeExam_queBankCont_heading" style={{ width: fullscreenMode ? "132vh" : "147vh" }}>
                                <div style={{ fontSize: "15px", fontWeight: "bolder", padding: "3px", flex: 1 }}>
                                    Question: {questions[currentQuestion]?.QID} of {questions.length} <br />
                                </div>

                                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                    <button
                                        style={{ fontSize: "13px", fontWeight: "bolder" }}
                                        onClick={() => handleFlaggedQuestion(questions[currentQuestion]?.QID)}
                                        className="footer_btns"
                                    >
                                        {flaggedQuestionsState.has(questions[currentQuestion]?.QID) ? (
                                            <>
                                                <FaFlag className="flagged_icon" /> Unmark
                                            </>
                                        ) : (
                                            <>
                                                <FaRegFlag /> Mark
                                            </>
                                        )}
                                    </button>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        {currentQuestion > 0 && (
                                            <button
                                                style={{ fontSize: "13px", fontWeight: "bolder" }}
                                                className="footer_btns"
                                                onClick={() => handleNavigation("prev")}
                                            >
                                                <FaCaretLeft /> Prev
                                            </button>
                                        )}
                                        <button
                                            style={{ fontSize: "13px", fontWeight: "bolder" }}
                                            onClick={() => handleNavigation("next")}
                                            disabled={currentQuestion === questions.length - 1}
                                            className="footer_btns"
                                        >
                                            Next <FaCaretRight />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="currentQue_container" style={{ overflow: "auto" }}>
                                <div>{questions[currentQuestion]?.questionName}</div>
                                {questions[currentQuestion]?.options.map((option, index) => (
                                    <div key={index}>
                                        <div
                                            className="d-flex p-3"
                                            key={index}
                                            onClick={() => handleOptionSelect(questions[currentQuestion]?.QID, option)}
                                        >
                                            <label style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                                <input
                                                    type="radio"
                                                    name={`options-${questions[currentQuestion]?.QID}`} //use unique identifier per question
                                                    className="me-1"
                                                    checked={answers[questions[currentQuestion]?.QID] === option} //check if this option is selected
                                                    onChange={() => handleOptionSelect(questions[currentQuestion]?.QID, option)} // Added to ensure proper input handling
                                                />
                                                {option}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                {/* <div className="w-25" style={{ padding: "15px", fontSize: "13px", fontWeight: "bold", height: "auto" }}>
                    <div className="questions_statusCont" >
                        <div className="quesStatus_cont">
                            <div className="queAnswered_nums bg-success">{answered}</div>
                            <div>Answered</div>
                        </div>
                        <div className="quesStatus_cont">
                            <div className="queAnswered_nums ">{notAnswered}</div>
                            <div>Not Answered</div>
                        </div>
                        <div className="quesStatus_cont">
                            <div className="queAnswered_nums">{marked}</div>
                            <div>Marked</div>
                        </div>
                        <div className="quesStatus_cont">
                            <div className="queAnswered_nums">{markedAnswered}</div>
                            <div>Marked & Answered</div>
                        </div>
                    </div>


                    <div className="questions_numbersCont">
                        {questions.map((que, index) => {
                            // Determine the class based on whether the key exists and matches que.QID
                            const isAnswered = Object.keys(answers).includes(que.QID.toString());
                            const answerClass = isAnswered ? "bg-success" : ""; */}




                {/* 
                            return (
                                <button
                                    key={que.QID}
                                    className={`${currentQuestion === index ? "questionNums highlight" : "questionNums"} ${answerClass}`}
                                    onClick={() => handleQuestionClick(index)}
                                >
                                    {que.QID}
                                </button>
                            );
                        })} */}


                {/* </div> */}

                <div className="w-25" style={{ padding: "15px", fontSize: "13px", fontWeight: "bold", height: "auto" }}>
                    {/* <div className="user_imageName">
                        <div className="user_imageCont">G</div>
                        <div>Giribabu</div>
                    </div> */}
                    <div className="questions_statusCont" >
                        <div className="quesStatus_cont">
                            <div className="queAnswered_nums bg-success">{answered}</div>
                            <div>Answered</div>
                        </div>
                        <div className="quesStatus_cont">
                            <div className="queAnswered_nums ">{notAnswered}</div>
                            <div>Not Answered</div>
                        </div>
                        <div className="quesStatus_cont">
                            <div className="queAnswered_nums">{marked}</div>
                            <div>Marked</div>
                        </div>
                        <div className="quesStatus_cont">
                            <div className="queAnswered_nums">{markedAnswered}</div>
                            <div>Marked & Answered</div>
                        </div>
                    </div>
                    <div className="py-2 px-3 fw-bold"> </div>
                    <div className="questions_numbersCont">
                        <div className="">
                            {
                                questions.map((que, index) => {
                                    // Determine the class based on whether the key exists and matches que.QID
                                    const isCorrect = Object.keys(answers).some((key) => key == que.QID);
                                    const answerClass = isCorrect ? 'bg-success' : '';

                                    return (
                                        <button
                                            key={que.id}
                                            className={`${currentQuestion == index ? 'questionNums highlight' : 'questionNums'} ${answerClass}`}
                                            onClick={() => setCurrentQuestion(index)}
                                        >
                                            {que.QID}
                                        </button>
                                    );
                                })

                            }
                        </div>

                        <div className="modal fade" id="submitModal" tabIndex="-1" aria-hidden="true" aria-labelledby="submitModalLabel">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="submitModalLabel">Are you sure want to submit?</h5>
                                    </div>
                                    <div className="modal-body">
                                        <Button color="secondary" variant="contained" size="small" data-bs-dismiss="modal" className="ms-5">
                                            No
                                        </Button>
                                        <Button variant="contained" color="success" size="small" onClick={handleExamSubmit} className="ms-5" data-bs-dismiss="modal">
                                            Yes
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside >

            {/* Fullscreen Warning Modal */}
            <Modal
                isOpen={showFullscreenWarning}
                onRequestClose={() => setShowFullscreenWarning(false)}
                contentLabel="Fullscreen Warning"
                style={{
                    content: {
                        width: "600px",
                        height: "400px",
                        margin: "auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                    },
                }}
            >
                <h3>Fullscreen Required</h3>
                <p>Please enable fullscreen to continue the exam.</p>
                <p>Time remaining: {timer} seconds</p>
                <button
                    onClick={enableFullscreen}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Enable Fullscreen
                </button>
            </Modal>
        </div >
    );
}

export default Exam;