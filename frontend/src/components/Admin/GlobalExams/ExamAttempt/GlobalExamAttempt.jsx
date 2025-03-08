/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState, useEffect, useRef } from "react";
import screenfull from "screenfull";
import { useNavigate, useParams } from "react-router-dom";
import "./GlobalExam.css";
import { FaCaretLeft, FaCaretRight, FaRegFlag, FaUser } from "react-icons/fa";
import { FaFlag } from "react-icons/fa6";
import { Button } from "@mui/material";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { FaClock } from "react-icons/fa";
import Service from "../../../../service/Service";
import Modal from "react-modal"; // Import a modal library (e.g., react-modal)
import fscreen from 'fscreen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBars, faTimes, faUsers, faShoppingCart, faWrench, faUser, faExpand, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import SuccessFeedbackPage from "./SuccessPage";

function GlobalExamAttempt({ examToken, hId }) {
    const [exam, setExam] = useState({
        examName: "",
        duration: "",
        questions: "",
        section: "",
        totalMarks: "",
        correctAnswerMarks: "",
        wrongAnswerMarks: "",
        startDateTime: "",
        endDateTime: "",
        questionsList: []
    });

    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (examToken) {
            localStorage.setItem("start_time", startTimeFuntion());
            fetchExamDetails(examToken);
        } else {
            console.error("Invalid examToken in the URL.");
        }
    }, [examToken]);

    useEffect(() => {
        if (examToken && hId) {
            fetchUserDetails(examToken, hId);
        }
    }, [examToken, hId]);




    const fetchUserDetails = async (examToken, hId) => {
        try {
            setLoading(true);
            const response = await Service.get(`/api/getHallTicketDetails/${examToken}/${hId}`);
            console.log("User Details:", response.data.result);
            setUserDetails(response.data.result);
        } catch (error) {
            console.error("Error fetching user details:", error);
        } finally {
            setLoading(false);
        }
    };


    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [flaggedQuestionsState, setFlaggedQuestions] = useState(new Set());
    const [answers, setAnswers] = useState({});
    const [fullscreenMode, setFullscreenMode] = useState(true);
    const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
    const [timer, setTimer] = useState(15);
    const [time, setTime] = useState(localStorage.getItem("timeLeft"));
    const [answered, setAnswered] = useState(0);
    const [notAnswered, setNotAnswered] = useState(0);
    const [marked, setMarked] = useState(0);
    const [markedAnswered, setMarkedAnswered] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
    const [isSubmitted, setISSubmitted] = useState(false);
    const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
    const [examAnswers, setExamAnswers] = useState([]);
    const [liveSupport, setLiveSupoort] = useState(false);
    const [showliveSupport, setshowLiveSupoort] = useState(false);
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

        if (!document.fullscreenElement) {
            enterFullscreen();
        }
    }, []);

    useEffect(() => {
        if (screenfull.isEnabled) {
            screenfull.request();
        }
    }, []);


    // const fetchExamDetails = async (examToken) => {
    //     try {
    //         setLoading(true);
    //         const response = await Service.get('/getGlobalExamsWithQuestions', {
    //             params: { examToken: examToken },
    //         });

    //         const data = response.data.result;
    //         console.log(data.examDetails);
    //         console.log("duration", data.examDetails.duration);

    //         setTime(data.examDetails.duration * 60);
    //         setQuestionCount(data.examDetails.noOfQuestions);
    //         setExam(data.examDetails);
    //         setLiveSupoort(data.examDetails.liveSupport);
    //         { exam && console.log(exam) };


    //         let parsedQuestions = data.questions.map((question) => ({
    //             ...question,
    //             options: JSON.parse(question.options),
    //             correctAnswer: JSON.parse(question.correctAnswer),
    //         }));

    //         const correctAnswersArray = parsedQuestions.map((q) => ({
    //             qid: q.QID,
    //             answer: q.correctAnswer
    //         }));

    //         console.log("Extracted Correct Answers:", correctAnswersArray);
    //         setExamAnswers(correctAnswersArray);

    //         // Randomize questions if required
    //         if (data.examDetails.randomizeQuestions) {
    //             parsedQuestions = shuffleArray(parsedQuestions).slice(0, data.examDetails.noOfQuestions);
    //         } else {
    //             parsedQuestions = parsedQuestions.slice(0, data.examDetails.noOfQuestions);
    //         }

    //         console.log("Final selected questions:", parsedQuestions);
    //         setQuestions(parsedQuestions);

    //     } catch (error) {
    //         console.error("Error fetching exam details:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const fetchExamDetails = async (examToken) => {
        try {
            setLoading(true);

            const response = await Service.get('/getGlobalExamsWithQuestions', {
                params: { examToken: examToken },
            });

            const data = response.data.result;
            console.log(data.examDetails);
            setTime(data.examDetails.duration * 60);
            setQuestionCount(data.examDetails.noOfQuestions);
            setExam(data.examDetails);
            setLiveSupoort(data.examDetails.liveSupport);

            let parsedQuestions = data.questions.map((question) => ({
                ...question,
                options: JSON.parse(question.options),
                correctAnswer: JSON.parse(question.correctAnswer),
            }));

            // Extract all correct answers (we'll filter later)
            const allCorrectAnswers = parsedQuestions.map((q) => ({
                qid: q.QID,
                answer: q.correctAnswer,
            }));
            setExamAnswers(allCorrectAnswers);  // Store all correct answers for later filtering

            let finalSelectedQuestions = parsedQuestions;

            // Handle shuffling + slicing
            const storedQuestions = localStorage.getItem(`selectedQuestions_${examToken}`);

            if (storedQuestions) {
                finalSelectedQuestions = JSON.parse(storedQuestions);
            } else {
                if (data.examDetails.randomizeQuestions) {
                    finalSelectedQuestions = shuffleArray(parsedQuestions).slice(0, data.examDetails.noOfQuestions);
                } else {
                    finalSelectedQuestions = parsedQuestions.slice(0, data.examDetails.noOfQuestions);
                }
                localStorage.setItem(`selectedQuestions_${examToken}`, JSON.stringify(finalSelectedQuestions));
            }

            console.log("Final selected questions:", finalSelectedQuestions);
            setQuestions(finalSelectedQuestions);

        } catch (error) {
            console.error("Error fetching exam details:", error);
        } finally {
            setLoading(false);
        }
    };


    const shuffleArray = (array) => {
        let shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };


    useEffect(() => {
        // Disable Right Click
        const disableRightClick = (e) => e.preventDefault();
        document.addEventListener("contextmenu", disableRightClick);

        // Disable Keyboard Shortcuts
        const disableShortcuts = (e) => {
            if (
                (e.ctrlKey && ["c", "v", "x", "t", "w", "u", "s", "p", "n", "a", "d", "f"].includes(e.key.toLowerCase())) ||
                (e.ctrlKey && e.shiftKey && ["i", "j"].includes(e.key.toLowerCase())) ||
                e.key === "F12" ||
                e.altKey ||     // Blocks all Alt combinations (Alt + Tab, Alt + F4, etc.)
                e.shiftKey ||   // Blocks all Shift combinations
                e.metaKey    // Blocks Windows (Meta) key (Windows + D, Windows + Tab, etc.)
            ) {
                e.preventDefault();
                return false
            }
        };
        document.addEventListener("contextmenu", (e) => e.preventDefault());
        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey || e.altKey || e.metaKey) e.preventDefault();
        });

        // const disableShortcuts = (e) => {
        //     if (
        //         e.ctrlKey ||    // Blocks all Ctrl combinations (Ctrl + C, Ctrl + V, etc.)
        // e.altKey ||     // Blocks all Alt combinations (Alt + Tab, Alt + F4, etc.)
        // e.shiftKey ||   // Blocks all Shift combinations
        // e.metaKey ||    // Blocks Windows (Meta) key (Windows + D, Windows + Tab, etc.)
        //         e.key === "F12" // Blocks F12 (DevTools)
        //     ) {
        //         e.preventDefault();
        //         return false;
        //     }
        // };
        document.addEventListener("keydown", disableShortcuts);

        return () => {
            document.removeEventListener("contextmenu", disableRightClick);
            document.removeEventListener("keydown", disableShortcuts);
        };
    }, []);

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

        if (!document.fullscreenElement) {
            enterFullscreen();
        }
    }, []);

    // useEffect(() => {
    //     if (fullscreenMode) {
    //         screenfull.request();
    //     }
    // })


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

    // useEffect(() => {
    //     const enterFullscreen = () => {
    //         if (fscreen.fullscreenEnabled && !fscreen.fullscreenElement) {
    //             fscreen.requestFullscreen(document.documentElement);
    //         }
    //     };

    //     const handleFullscreenChange = () => {
    //         if (!fscreen.fullscreenElement) {
    //             enterFullscreen(); // Re-enter fullscreen if exited
    //         }
    //     };
    //     enterFullscreen();

    //     fscreen.addEventListener("fullscreenchange", handleFullscreenChange);
    //     return () => {
    //         fscreen.removeEventListener("fullscreenchange", handleFullscreenChange);
    //     };
    // }, []);


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
    // const handleNavigation = (direction) => {
    //     setCurrentQuestion((prev) => {
    //         if (direction === "next" && prev < questions.length - 1) {
    //             return prev + 1;
    //         } else if (direction === "prev" && prev > 0) {
    //             return prev - 1;
    //         }
    //         return prev;
    //     });
    // };
    const handleNavigation = (direction) => {
        setCurrentQuestion((prev) => {
            if (direction === "next") return Math.min(prev + 1, questionCount - 1);
            if (direction === "prev") return Math.max(prev - 1, 0);
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

    // const handleExamSubmit = () => {
    //     console.log("Submiting started")
    //     const computedEndTime = endTimeFuntion();
    //     const startTime = localStorage.getItem("start_time");
    //     console.log("User Answers:", answers);
    //     screenfull.exit();

    //     const correctMarks = exam.correctAnswerMarks;
    //     const wrongMarks = typeof exam.wrongAnswerMarks === "string" && exam.wrongAnswerMarks.includes("%")
    //         ? (parseFloat(exam.wrongAnswerMarks) / 100) * correctMarks
    //         : exam.wrongAnswerMarks;

    //     console.log(correctMarks, wrongMarks);

    //     let score = 0;
    //     let inCorrect = 0;


    //     examAnswers.forEach(({ qid, answer }) => {
    //         if (qid !== undefined) {
    //             const userAnswer = answers[qid];

    //             const correctAnswerArray = Array.isArray(answer)
    //                 ? answer.map(a => (a ? a.toLowerCase() : "")).sort()
    //                 : [answer ? answer.toLowerCase() : ""];

    //             const userAnswerArray = Array.isArray(userAnswer)
    //                 ? userAnswer.map(a => a.trim().toLowerCase()).sort()
    //                 : userAnswer
    //                     ? [userAnswer.trim().toLowerCase()]
    //                     : [];

    //             console.log(`QID: ${qid} | Correct: ${correctAnswerArray} | User: ${userAnswerArray}`);

    //             if (JSON.stringify(userAnswerArray) === JSON.stringify(correctAnswerArray)) {
    //                 score += correctMarks;
    //             } else {
    //                 score -= wrongMarks;
    //                 inCorrect++;
    //             }
    //         } else {
    //             console.error("Error: Undefined QID in examAnswers");
    //         }
    //     });

    //     console.log(`Final Score: ${score}, Incorrect: ${inCorrect}`);

    //     const response = {
    //         hallTicketID: userDetails.hallTicketID,
    //         examToken: examToken,
    //         examStatus: 1,
    //         timeDetails: {
    //             startTime,
    //             computedEndTime
    //         },
    //         responseDetails: answers,
    //         results: score
    //     };

    //     console.log("Final Response:", response);

    //     Service.put("/SaveGlobalResponse", response)
    //         .then((res) => {
    //             console.log(res);
    //             localStorage.clear();
    //             screenfull.exit();
    //             setISSubmitted(true);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // };

    const handleExamSubmit = () => {
        console.log("Submitting started");

        const computedEndTime = endTimeFuntion();
        const startTime = localStorage.getItem("start_time");
        console.log("User Answers:", answers);
        screenfull.exit();

        const correctMarks = exam.correctAnswerMarks;
        const wrongMarks = typeof exam.wrongAnswerMarks === "string" && exam.wrongAnswerMarks.includes("%")
            ? (parseFloat(exam.wrongAnswerMarks) / 100) * correctMarks
            : exam.wrongAnswerMarks;

        console.log(correctMarks, wrongMarks);

        let score = 0;
        let inCorrect = 0;

        // 💡 Filter only the questions shown in the exam
        const shownQuestionIds = questions.map(q => q.QID);
        const filteredExamAnswers = examAnswers.filter(({ qid }) => shownQuestionIds.includes(qid));

        filteredExamAnswers.forEach(({ qid, answer }) => {
            const userAnswer = answers[qid];

            const correctAnswerArray = Array.isArray(answer)
                ? answer.map(a => (a ? a.toLowerCase() : "")).sort()
                : [answer ? answer.toLowerCase() : ""];

            const userAnswerArray = Array.isArray(userAnswer)
                ? userAnswer.map(a => a.trim().toLowerCase()).sort()
                : userAnswer
                    ? [userAnswer.trim().toLowerCase()]
                    : [];

            console.log(`QID: ${qid} | Correct: ${correctAnswerArray} | User: ${userAnswerArray}`);

            if (JSON.stringify(userAnswerArray) === JSON.stringify(correctAnswerArray)) {
                score += correctMarks;
            } else {
                score -= wrongMarks;
                inCorrect++;
            }
        });

        console.log(`Final Score: ${score}, Incorrect: ${inCorrect}`);

        const response = {
            hallTicketID: userDetails.hallTicketID,
            examToken: examToken,
            examStatus: 1,
            timeDetails: {
                startTime,
                computedEndTime
            },
            responseDetails: answers,
            results: score
        };

        console.log("Final Response:", response);

        Service.put("/SaveGlobalResponse", response)
            .then((res) => {
                console.log(res);
                localStorage.clear();
                screenfull.exit();
                setISSubmitted(true);
            })
            .catch((err) => {
                console.log(err);
            });
    };




    useEffect(() => {
        const totalQuestions = questions.length;
        const answeredQuestionsCount = Object.keys(answers).length;
        setNotAnswered(totalQuestions - answeredQuestionsCount);

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
    }
    useEffect(() => {
        getQuestionsData();
    }, [])


    const handleSubmitClick = () => {
        setShowSubmitConfirmation(true);
    }

    const handleMultipleOptionSelect = (qid, option) => {
        setAnswers((prevAnswers) => {
            const currentSelections = prevAnswers[qid] || [];

            return {
                ...prevAnswers,
                [qid]: currentSelections.includes(option)
                    ? currentSelections.filter((selected) => selected !== option) // Remove if already selected
                    : [...currentSelections, option], // Add if not selected
            };
        });
    };


    useEffect(() => {
        if (liveSupport && showliveSupport) {

            console.log(liveSupport, showliveSupport);
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = 'https://embed.tawk.to/67b414865d33ec190c71f78e/1ikbn0bt0';
            script.charset = 'UTF-8';
            script.setAttribute('crossorigin', '*');

            // add script to document body
            document.body.appendChild(script);

            // Cleanup function to remove script when component unmounts
            return () => {
                if (script && script.parentNode) {
                    document.body.removeChild(script)
                }
            };
        }
    }, [liveSupport, showliveSupport]);




    // If test is submitted, render success page
    if (isSubmitted) {
        return <SuccessFeedbackPage examToken={examToken} hId={hId} />;
    }

    return (
        <div>
            <header id="Global_takeExam_header_cont">
                <nav className="d-flex justify-content-between px-3 w-100">
                    <div style={{ fontSize: "17px", fontWeight: "bolder", marginTop: "7px" }}>{exam.examName}</div>
                    <div style={{ marginLeft: "650px", fontSize: "17px", fontWeight: "bolder", marginTop: "7px" }}>
                        <FaClock style={{ marginRight: "3px" }} /> {formatTimer(time)}
                    </div>

                    <div>

                        <button
                            style={{
                                color: "black",
                                width: "150px",
                                height: "27px",
                                background: "#f2eded",
                                border: "none",

                                cursor: "pointer",
                                outline: "none",
                                transition:
                                    "transform 0.3s ease, color 0.3s ease",
                            }}
                            onClick={() => setshowLiveSupoort(true)}>
                            Live Spport
                        </button>
                    </div>
                    <div
                        style={{
                            position: "relative",
                            display: "inline-block",
                        }}
                    >
                        <button
                            style={{
                                color: "black",
                                width: "27px",
                                height: "27px",
                                background: "#f2eded",
                                border: "none",
                                borderRadius: "200%",
                                cursor: "pointer",
                                outline: "none",
                                transition:
                                    "transform 0.3s ease, color 0.3s ease",
                            }}
                            onClick={() =>
                                setDropdownVisible((prev) => !prev)
                            }
                        >
                            <FontAwesomeIcon
                                icon={faUser}
                                style={{
                                    width: "16px",
                                    height: "16px",
                                }}
                            />
                        </button>
                        {dropdownVisible && (
                            <div
                                style={{
                                    cursor: "pointer",
                                    position: "absolute",
                                    top: "100%",
                                    left: "50%",
                                    transform: "translateX(-50%)", // Center horizontally
                                    backgroundColor: "white",
                                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                                    borderRadius: "5px",
                                    zIndex: "1",
                                    width: "auto",
                                    padding: "10px",
                                    textAlign: "left",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                        fontSize: "12px",
                                        color: "gray",
                                        marginBottom: "3px",
                                    }}
                                >
                                    <span><strong>Name:</strong></span>
                                    <span>{userDetails.candidateName}</span>
                                </div>

                                <hr style={{ margin: "3px 0" }} />

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                        fontSize: "12px",
                                        color: "gray",
                                        marginBottom: "3px",
                                    }}
                                >
                                    <span><strong>Email:</strong></span>
                                    <span>{userDetails.candidateEmail}</span>
                                </div>

                                <hr style={{ margin: "3px 0" }} />

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                        fontSize: "12px",
                                        color: "gray",
                                        marginBottom: "3px",
                                    }}
                                >
                                    <span><strong>Contact:</strong></span>
                                    <span>{userDetails.candidateMobile}</span>
                                </div>

                                <hr style={{ margin: "3px 0" }} />
                            </div>

                        )}
                    </div>

                </nav>
                <div style={{ marginRight: "20px" }}>
                    <button
                        onClick={handleSubmitClick}
                        style={{
                            width: "10vh",
                            fontSize: "13px",
                            fontWeight: "bolder",
                            height: "5vh",
                            border: "none",
                        }}
                        type="button"
                    >
                        Submit
                    </button>
                </div>
            </header>

            <aside className="d-flex">
                <div className="w-75">
                    <section style={{ width: "100%", display: "flex", height: "90vh" }}>
                        <div>
                            <div className="Global_takeExam_queBankCont_heading" style={{ width: fullscreenMode ? "132vh" : "147vh" }}>
                                <div style={{ fontSize: "15px", fontWeight: "bolder", padding: "3px", flex: 1 }}>
                                    Question {Math.min(currentQuestion + 1, questionCount)} of {questionCount}
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

                            <div className="Global_currentQue_container" style={{ overflow: "auto" }}>
                                <div style={{ padding: "10px" }}>{questions[currentQuestion]?.questionName}</div>
                                {questions && (
                                    <div>
                                        {/* Single Correct Case */}
                                        {questions[currentQuestion]?.questionType === "singleCorrect" &&
                                            questions[currentQuestion].options.map((option, index) => (
                                                <div key={index} className="d-flex p-3" onClick={() => handleOptionSelect(questions[currentQuestion]?.QID, option)}>
                                                    <label style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                                        <input
                                                            type="radio"
                                                            name={`options-${questions[currentQuestion]?.QID}`}
                                                            className="me-1"
                                                            checked={answers[questions[currentQuestion]?.QID] === option}
                                                            onChange={() => handleOptionSelect(questions[currentQuestion]?.QID, option)}
                                                        />
                                                        {option}
                                                    </label>
                                                </div>
                                            ))}

                                        {/* Multiple Correct Case */}
                                        {questions[currentQuestion]?.questionType === "multipleCorrect" &&
                                            questions[currentQuestion].options.map((option, index) => (
                                                <div key={index} className="d-flex p-3">
                                                    <label style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                                        <input
                                                            type="checkbox"
                                                            className="me-1"
                                                            checked={answers[questions[currentQuestion]?.QID]?.includes(option)}
                                                            onChange={() => handleMultipleOptionSelect(questions[currentQuestion]?.QID, option)}
                                                        />
                                                        {option}
                                                    </label>
                                                </div>
                                            ))}

                                        {/* Yes/No Case */}
                                        {questions[currentQuestion]?.questionType === "yesno" &&
                                            questions[currentQuestion].options.map((option, index) => (
                                                <div key={index}>
                                                    <label style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                                        <input
                                                            type="radio"
                                                            className="me-1"
                                                            name={`options-${questions[currentQuestion]?.QID}`}
                                                            checked={answers[questions[currentQuestion]?.QID] === option}
                                                            onChange={() => handleOptionSelect(questions[currentQuestion]?.QID, option)}
                                                        />
                                                        {option}
                                                    </label>
                                                </div>
                                            ))}
                                    </div>
                                )}

                                {/* {questions[currentQuestion]?.options.map((option, index) => (
                                    <div key={index}>
                                        <div
                                            style={{ marginTop: "20px", paddingLeft: "20px" }}
                                            onClick={() => handleOptionSelect(questions[currentQuestion]?.QID, option)}
                                        >
                                            <label style={{ display: "flex", alignItems: "center", width: "100%", cursor: "pointer" }}>
                                                <input
                                                    type="radio"
                                                    name={`options-${questions[currentQuestion]?.QID}`} // Internal use of QID
                                                    className="me-1"
                                                    checked={answers[questions[currentQuestion]?.QID] === option}
                                                    onChange={() => handleOptionSelect(questions[currentQuestion]?.QID, option)}
                                                />
                                                {option}
                                            </label>
                                        </div>
                                    </div>
                                ))} */}
                            </div>
                        </div>
                    </section>
                </div>


                <div className="w-25" style={{ padding: "15px", fontSize: "13px", fontWeight: "bold", height: "auto" }}>
                    <div className="Global_questions_statusCont">
                        <div className="Global_quesStatus_cont">
                            <div className="Global_queAnswered_nums" style={{ background: "green" }}>{answered}</div>
                            <div>Answered</div>
                        </div>
                        <div className="quesStatus_cont">
                            <div className="Global_queAnswered_nums bg-white" style={{ color: "black", fontWeight: "lighter", borderRadius: "2px" }}>{notAnswered}</div>
                            <div>Not Answered</div>
                        </div>
                        <div className="quesStatus_cont">
                            <div className="Global_queAnswered_nums bg-warning">{marked}</div>
                            <div>Marked</div>
                        </div>
                        <div className="quesStatus_cont">
                            <div className="Global_queAnswered_nums bg-primary">{markedAnswered}</div>
                            <div>Marked & Answered</div>
                        </div>
                    </div>


                    <div className="Global_questions_numbersCont">
                        <div>
                            {questions.map((question, index) => {
                                const qid = question?.QID;
                                const isAnswered = answers[qid] !== undefined;
                                const isMarked = flaggedQuestionsState.has(qid);
                                const isMarkedAnswered = isMarked && isAnswered;


                                // Assign colors based on status
                                let statusClass = "";
                                if (isMarkedAnswered) {
                                    statusClass = "bg-primary color-white"; // Marked & Answered
                                } else if (isMarked) {
                                    statusClass = "bg-warning"; // Marked
                                } else if (isAnswered) {
                                    statusClass = "bg-success"; // Answered
                                } else {
                                    statusClass = ""; // Not Answered
                                }

                                return (
                                    <button
                                        key={index}
                                        className={`${currentQuestion === index ? "Global_questionNums Global_highlight" : "Global_questionNums"} ${statusClass}`}
                                        onClick={() => setCurrentQuestion(index)}
                                    >
                                        {index + 1}
                                    </button>
                                );
                            })}
                        </div>

                        {/* <div className="">
                            {
                                questions.map((que, index) => {
                                    // Determine the class based on whether the key exists and matches que.QID
                                    const isCorrect = Object.keys(answers).some((key) => key == que.QID);
                                    const answerClass = isCorrect ? 'bg-success' : '';

                                    return (
                                        <button
                                            key={que.index}
                                            className={`${currentQuestion == index ? 'questionNums highlight' : 'questionNums'} ${answerClass}`}
                                            onClick={() => setCurrentQuestion(index)}
                                        >
                                            {que.index}
                                        </button>
                                    );
                                })

                            }
                        </div> */}

                        <div className="modal fade" id="submitModal" tabIndex="-1" aria-hidden="true" aria-labelledby="submitModalLabel">
                            {/* <div className="modal-dialog">
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
                            </div> */}

                            <Dialog
                                open={showSubmitConfirmation}
                                onClose={() => setShowSubmitConfirmation(false)}
                                aria-labelledby="submit-dialog-title"
                                aria-describedby="submit-dialog-description"
                                PaperProps={{
                                    sx: {
                                        width: "50vw",
                                        maxWidth: "none",
                                        height: "45vh",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: "20px",
                                    }
                                }}
                            >
                                <DialogContent>
                                    <DialogContentText id="submit-dialog-description" style={{ fontSize: "20px", fontWeight: "bold", color: "#999" }}>
                                        Review your responses before submission
                                    </DialogContentText>

                                    {/* Exam Progress Summary */}
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(2, 1fr)",
                                        gap: "10px",
                                        marginTop: "20px",
                                        textAlign: "center",
                                        fontSize: "16px",
                                        fontWeight: "bold"
                                    }}>
                                        <div style={{ background: "green", color: "white", padding: "10px", borderRadius: "5px" }}>
                                            Answered: {answered}
                                        </div>
                                        <div style={{ background: "gray", color: "white", padding: "10px", borderRadius: "5px" }}>
                                            Not Answered: {notAnswered}
                                        </div>
                                        <div style={{ background: "orange", color: "white", padding: "10px", borderRadius: "5px" }}>
                                            Flagged: {marked}
                                        </div>
                                        <div style={{ background: "blue", color: "white", padding: "10px", borderRadius: "5px" }}>
                                            Flagged & Answered: {markedAnswered}
                                        </div>
                                    </div>

                                </DialogContent>

                                {questionCount !== answered && (
                                    <DialogContentText>
                                        You haven`t answered all Questions !!!
                                    </DialogContentText>

                                )}
                                <DialogContentText>
                                    Are your sure you want to submit ?
                                </DialogContentText>
                                <DialogActions sx={{ justifyContent: "flex-end", width: "100%", padding: "20px" }}>
                                    <Button onClick={() => setShowSubmitConfirmation(false)} color="secondary">
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setShowSubmitConfirmation(false);
                                            handleExamSubmit();
                                        }}
                                        color="success"
                                        variant="contained"
                                        autoFocus
                                    >
                                        Yes, Submit
                                    </Button>
                                </DialogActions>
                            </Dialog>


                        </div>
                    </div>
                </div>
            </aside >

            {/* Fullscreen Warning Modal */}
            {/* <Modal
                isOpen={showFullscreenWarning}
                shouldCloseOnEsc={false}  // Prevents closing with Esc key
                shouldCloseOnOverlayClick={false} // Prevents clicking outside to close
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
            </Modal> */}
            <Modal
                isOpen={showFullscreenWarning}
                shouldCloseOnEsc={false}
                shouldCloseOnOverlayClick={false}
                onRequestClose={() => setShowFullscreenWarning(false)}
                contentLabel="Fullscreen Warning"
                style={{
                    content: {
                        width: "500px",
                        height: "400px",
                        margin: "auto",
                        padding: "30px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f8f9fa",
                        fontFamily: "Arial, sans-serif",
                        textAlign: "center"
                    },
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.6)"
                    }
                }}
            >
                {/* Warning Icon */}
                <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    style={{ fontSize: "48px", color: "#dc3545", marginBottom: "15px" }}
                />

                {/* Title */}
                <h2 style={{ fontSize: "1.5rem", color: "#333", margin: "0 0 10px 0" }}>
                    Fullscreen Required
                </h2>

                {/* Description */}
                <p style={{ fontSize: "1rem", color: "#555", margin: "0 0 10px 0" }}>
                    To proceed with the exam, you must enable fullscreen mode.
                </p>

                {/* Timer Display */}
                <div
                    style={{
                        backgroundColor: "#fff3cd",
                        color: "#856404",
                        padding: "10px 15px",
                        borderRadius: "8px",
                        border: "1px solid #ffeeba",
                        fontWeight: "bold",
                        marginBottom: "15px"
                    }}
                >
                    ⏳ Time remaining: {timer} seconds
                </div>

                {/* Fullscreen Button */}
                <button
                    onClick={enableFullscreen}
                    style={{
                        padding: "12px 25px",
                        fontSize: "16px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontWeight: "bold"
                    }}
                >
                    <FontAwesomeIcon icon={faExpand} />
                    Enable Fullscreen
                </button>
            </Modal>
        </div >
    );
}

export default GlobalExamAttempt;