import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, StatusBar, Image } from 'react-native';
import TitleWithCloseButton from '../components/TitleWithCloseButton'
import ProgressBar from '../components/ProgressBar'
import Loading from '../components/Loading'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

function Quiz({ route, navigation }) {
    const [coins, setCoins] = useState()
    const [answers, setAnswers] = useState([])
    const [questions, setQuestions] = useState()
    const [firstQuestion, setFirstQuestion] = useState()
    const [userQuestion, setUserQuestion] = useState(0)
    const [selectedOption, setSelectedOption] = useState(-1);
    const [currentQuestionData, setCurrentQuestionData] = useState();
    const [progressBarPercentage, setProgressBarPercentage] = useState("0")
    const [questionsSize, setQuestionsSize] = useState(0)
    const { id, token } = route.params
    let wrongAnswers = [];

    useEffect(() => {
        // find the users so we can get the user's last answered question
        getUser(`https://covidapptf.herokuapp.com/users/${id}`)
        /* getUser(`http://10.0.2.2:3000/users/${id}`) */
    }, []);

    const getUser = (url) => {
        fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
            .then(response => response.json())
            .then(json => {
                console.log(json);
                setCoins(json.user.coins) // save the number of coins the user has
                setUserQuestion(json.user.quizQuestion) // save the question that's going to be presented to the user
                setFirstQuestion(json.user.quizQuestion) // save the first question 
                getQuestions("https://covidapptf.herokuapp.com/quiz-questions", json.user.quizQuestion) // get the data from the question document
                /*  getQuestions("http://10.0.2.2:3000/quiz-questions/", json.user.quizQuestion) // get the data from the question document
             */
            })
            .catch((error) => console.log(error))
    }

    const getQuestions = (url, index) => {
        fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
            .then(response => response.json())
            .then(json => {
                console.log(json);
                /* MUDAR: em vez de guardar todas as perguntas guarda só as 10 que vão ser apresentadas  */
                setQuestions(json) // saves all the questions in the database
                setCurrentQuestionData(json[index]) // save the initial question data 
                setQuestionsSize(json.length)
            })
            .catch((error) => console.log(error))
    }

    const changeQuestion = (direction, index) => {
        // only lets you go to the next question when you have a selected option or if you don't have a selected option but want to see the previous question
        if (selectedOption !== -1 || (selectedOption == -1 && direction == "backwards")) {
            if (index < firstQuestion + 9) {
                if (direction == "forward" && selectedOption != -1) {
                    index++
                    setUserQuestion(index)
                    if (index > 9) {
                        setProgressBarPercentage(index.toString()[1] + "0")
                    } else {
                        setProgressBarPercentage(index.toString() + "0")
                    }
                    /* If the question was already answered add the yellow background to the selected option */
                    if (index > 9 ) {
                        if (typeof answers[index.toString()[1]] !== 'undefined') {
                            setSelectedOption(answers[index.toString()[1]].selectionIndex)
                        }  else {
                            setSelectedOption(-1) // removes the yellow background from the previously selected option
                        }
                    } else if (typeof answers[index] !== 'undefined') {
                            setSelectedOption(answers[index].selectionIndex)
                    }
                    else {
                        setSelectedOption(-1) // removes the yellow background from the previously selected option
                    }

                } else if (direction == "backwards" && index !== 0) {
                    console.log(index);
                    console.log(firstQuestion);
                    if (index != firstQuestion) {
                        index--
                        if (answers.length > 0) {
                            if (index > 9) {
                            setSelectedOption(answers[index.toString()[1]].selectionIndex)
                        } else {
                            setSelectedOption(answers[index].selectionIndex)
                        }
                        }
                        setUserQuestion(index)
                        if (index > 9) {
                            setProgressBarPercentage(index.toString()[1] + "0")
                        } else {
                            setProgressBarPercentage(index.toString() + "0")
                        }
                    }
                }
                // checks if there's a document with that index in the collection
                if (questions[index]) {
                    setCurrentQuestionData(questions[index])
                } else {
                    setCurrentQuestionData(questions[0])
                    setUserQuestion(0)
                    setFirstQuestion(-1)
                }

            } else {
                checkAnswers()
            }
        }
    }

    const addAnswer = (option, rightAnswer, index, selectionIndex) => {
        let newAnswers = [...answers]
        let obj = {
            question: currentQuestionData.question, // saves the question
            userAnswer: option, // save user selected option
            rightAnswer: rightAnswer, // save the right option
            selectionIndex: selectionIndex // saves the index so when the users goes to see the previous answers the selected option's background is yellow
        }
        if (index > 9) { 
            console.log(index.toString()[1]);
            newAnswers[index.toString()[1]] = obj 
        } else {
            newAnswers[index] = obj
        }  
        setAnswers(newAnswers)
        console.log(newAnswers);
    }

    // go through the answers array and count how many answers the user got wrong andd save the question and right answer of the wrong answers
    const checkAnswers = () => {
        let rightAnswersCounter = 0
        answers.map(answers => {
            if (answers.userAnswer == answers.rightAnswer) {
                rightAnswersCounter++
            } else {
                wrongAnswers.push({
                    question: answers.question,
                    answer: answers.rightAnswer
                })
            }
        })
        finishQuiz(rightAnswersCounter)
    }

    // Update the users information on the db 
    const finishQuiz = (counter) => {
        let updatedQuizQuestion = 0
        let currentDate = new Date()
        currentDate.setHours(currentDate.getHours() + 3)
        currentDate = currentDate.toString().split("(")
        
        if(questionsSize == (userQuestion + 1) ){
            updatedQuizQuestion = 0
        } else{
            updatedQuizQuestion =  userQuestion + 1
        }

        console.log(updatedQuizQuestion + "updatedQuizQuestion");
        updateUser(`https://covidapptf.herokuapp.com/users/${id}/quiz`, {
            updatedCoins: counter * 10 + coins,
            updatedQuizQuestion: updatedQuizQuestion,
            quizAvailableAt: currentDate[0]
        })
        /*  updateUser(`http://10.0.2.2:3000/users/quiz/${id}`, {
             updatedCoins: counter * 10 + coins,
             updatedQuizQuestion: userQuestion + 1
         }) */
        navigation.navigate("QuizResults", { coins: counter * 10, rightAnswersCounter: counter, wrongAnswers: wrongAnswers })
    }

    const updateUser = (url, data) => {
        fetch(url, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
            ,
            credentials: "same-origin"
        })
            .then(response => response.json())
            .then(json => {
                //console.log(json);
            })
            .catch((error) => console.log(error))
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#F9F9F9" barStyle="dark-content" />

            {currentQuestionData
                ?
                <View style={{ flex: 1 }}>
                    <TitleWithCloseButton navigation={navigation} title="Questionário" goToPage="Dashboard"></TitleWithCloseButton>

                    <ProgressBar width={progressBarPercentage} ></ProgressBar>
                    <View style={{ marginVertical: 32 }}>
                        <Text style={styles.question}>{currentQuestionData.question}</Text>
                    </View>

                    {currentQuestionData.options.map((option, index) =>
                        <TouchableWithoutFeedback key={index} onPress={() => {
                            setSelectedOption(index)
                            addAnswer(option.answer, currentQuestionData.rightAnswer, userQuestion, index)
                        }}>
                            <View style={selectedOption == index ? styles.selectedOptionContainer : styles.optionContainer} >
                                <Text style={styles.answer}>{option.answer} </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                    <View style={styles.flex}>
                        <TouchableWithoutFeedback onPress={() => {
                            changeQuestion("backwards", userQuestion)
                        }}>
                            <Image style={styles.image} source={require('../assets/img/backward-blue.png')}></Image>

                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => {
                            changeQuestion("forward", userQuestion)
                        }}>
                            <Image style={styles.image} source={selectedOption !== -1
                                ? require('../assets/img/forward-blue.png')
                                : require('../assets/img/forward-blocked.png')}></Image>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                : <Loading />}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: "#F9F9F9",
        color: "#0D1B1E",
    },

    container: {
        padding: 32,
        flex: 1,
    },

    imageView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: "20%"
    },

    image: {
        marginHorizontal: 5,
        height: 34,
        width: 34,
        resizeMode: 'stretch',
        alignItems: 'center',

    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: "8%"
    },
    optionContainer: {
        backgroundColor: "#F3F3F3",
        borderRadius: 12,
        padding: 16,
        marginVertical: 8
    },
    selectedOptionContainer: {
        backgroundColor: "#FFE07D",
        borderRadius: 12,
        padding: 16,
        marginVertical: 8
    },
    question: {
        fontFamily: "Roboto-Medium",
        fontSize: 16
    },

    answer: {
        fontSize: 16,
        color: "#0D1B1E",
        fontFamily: "Roboto-Medium"
    },

    flex: {
        position: 'absolute',
        bottom: "4%",
        alignSelf: 'center',
        flexDirection: 'row',
        //justifyContent: 'center',
    },
    bottom: {
        position: 'absolute',
        bottom: 0
    }
});

export default Quiz;
