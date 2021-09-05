import './App.css';
import {useState,useEffect} from 'react'
import AskQuestion from './ask_question'; 
import QuestionRow from './question_row'; 
import AnswerBox from './answer_box'; 
import io from 'socket.io-client'

function App() {
	var app_url = 'http://localhost:3000'
	// var app_url = 'https://urlshortener-pickfu.herokuapp.com'
	const [currentTabIndex, setcurrentTabIndex] = useState(0)
	const [canShowAskQuestion, setcanShowAskQuestion] = useState(false)
	const [canShowAnswerBox, setcanShowAnswerBox] = useState(false)
	const [questions, setQuestions] = useState([])
	const [answers, setAnswers] = useState([])
	const [questionToAnswer, setquestionToAnswer] = useState()
	let socket = io(app_url)

	useEffect(() => {
		fetchQuestions()
		connectToSocketIo()
	}, [])

	const connectToSocketIo = () =>{
		socket.connect()
		socket.emit('subscribe','new_questions');
		socket.emit('subscribe','new_answers');
		
		socket.on('new_questions', (data) => {
			console.log(data)

			data.newly_added = true
			setQuestions(allQuestions =>{
				if (!allQuestions.find(q => q._id === data._id)){
					return [data,...allQuestions]
				}
				return allQuestions
			} );
		})
		socket.on('new_answers', (data) => {
			console.log(data)
			if (!answers.find(q => q._id === data._id)){
				data.newly_added = true
				setAnswers(allAnswers => {
					if (!allAnswers.find(q => q._id === data._id)){
						return [data,...allAnswers]
					}
					return allAnswers
					
				});
			}
		})
	}




	const  fetchQuestions = async(top) => {
		const response = await fetch(!top ? `${app_url}/questions/all` : `${app_url}/questions/top`)
		if (response.status === 200){
			const res = await response.json();
			console.log(res.data)
			setQuestions(res.data)
		}
	}

    const fetchAnswers = async (question) => {
        const response = await fetch(`${app_url}/questions/${question}/answers`)
		if (response.status === 200){
			const res = await response.json();
			setAnswers([...res.data,...answers]);
		}
    }

	const getTabClasses = (tabId) => {
		return `block relative px-4 py-1 leading-6 sm:text-md font-semibold focus:outline-none transition-colors duration-300 bg-white  mr-5 ${currentTabIndex === tabId ? 'text-gray-900' : ' text-gray-400'}`
	}

	const handleQuestionSave = (data) => {
		setcanShowAskQuestion(false)
		data.newly_added = true
		setQuestions([data,...questions]);
	}

	const handleAnswerSave = (data) => {
		setcanShowAnswerBox(false)
		setquestionToAnswer(null)
		data.newly_added = true
		setAnswers([data,...answers]);
	}
  return (
		<div className="mx-auto bg-gray-50 container">
				<h1 className="text-7xl text-center font-bold pt-3 pb-3"> Simple QA</h1>

		<div className="flex mt-5 p-5">
			<div className="flex flex-auto">
				<button type="button" className={getTabClasses(0)} onClick={()=>{
				setcurrentTabIndex(0)
				fetchQuestions()
				}}>All Questions</button>
				<button type="button" className={getTabClasses(1)} onClick={()=>{
				setcurrentTabIndex(1)
				fetchQuestions('top')
				}}>Latest 100 Questions </button>
			</div>
			<button type="button" className='flex-none px-4 py-1 leading-6 sm:text-md font-semibold focus:outline-none bg-purple-200 text-purple-700' onClick={()=>{
						setcanShowAskQuestion(true)
						// fetchQuestions('top')
			}}> Ask Question </button>
		</div>

		<div className="flex-col">
		{
			questions.map(question => {
				const this_answers  = answers.filter(ans => ans.question === question._id)
				return <QuestionRow data={question} key={question._id} answers={this_answers} handleAnswerClick={(question) => {
					setquestionToAnswer(question)
					setcanShowAnswerBox(true)
				}} fetchAnswers={fetchAnswers}></QuestionRow>
			})
		}			
		</div>
		{
			canShowAskQuestion
			? <AskQuestion handleCancel={() => setcanShowAskQuestion(false)} app_url={app_url} handleSuccess={handleQuestionSave}></AskQuestion>
			: null
		}
		{
			canShowAnswerBox
			? <AnswerBox handleCancel={() => setcanShowAnswerBox(false)} app_url={app_url} handleSuccess={handleAnswerSave} question={questionToAnswer}></AnswerBox>
			: null
		}
		</div>
  );
}

export default App;
