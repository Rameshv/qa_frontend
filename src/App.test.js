import { render, screen, fireEvent, waitFor, wait } from '@testing-library/react';
import App from './App';
import AskQuestion from './ask_question'; 
import QuestionRow from './question_row'; 
import AnswerBox from './answer_box'; 


test('Question row should how correct title',() => {
	const data = {
		title: 'Hey, whats your name',
		created_at: Date.now(),
    body: 'My name is Ramehs'
	}
	render(<QuestionRow data={data} answers={[]}/>)
	const _text = screen.getByText(`Hey, whats your name`)
	expect(_text).toBeInTheDocument()
})

function setupFetchStub(data) {
	return function fetchStub(_url) {
	  return new Promise((resolve) => {
		resolve({
		  json: () =>
			Promise.resolve(data),
			status: 200
		})
	  })
	}
  }


test('Question should display given answers',() => {
	const data = {
		title: 'Hey, whats your name',
		created_at: Date.now(),
    	id:1
	}
	const answeres = [
		{
			content: 'Ramesh',
			question:1
		}
	]
	render(<QuestionRow data={data} answers={answeres}/>)
	expect(screen.getByText('Show answers')).toBeInTheDocument()
})



test('AskQuestion should throw an alert if question title is empty',() => {
	render(<AskQuestion />)
	const alertMock = jest.spyOn(window,'alert').mockImplementation(); 
	fireEvent.click(screen.getByText('Ask'))
	expect(alertMock).toHaveBeenCalledTimes(1)
})

test('AskQuestion should throw an alert if invalid question info given',() => {
	render(<AskQuestion />)
	const urlInput = screen.getByPlaceholderText('Question title')
	fireEvent.change(urlInput,{target:'asd'})
	const alertMock = jest.spyOn(window,'alert').mockImplementation(); 
	fireEvent.click(screen.getByText('Ask'))
	expect(alertMock).toHaveBeenCalledTimes(1)
})



test('AnswerBox should throw an alert if answer is empty',() => {
	const data = {
		title: 'Hey, whats your name',
		created_at: Date.now(),
    	id:1
	}
	render(<AnswerBox question={data} />)
	const alertMock = jest.spyOn(window,'alert').mockImplementation(); 
	fireEvent.click(screen.getByText('Submit'))
	expect(alertMock).toHaveBeenCalledTimes(1)
})

test('AnswerBox should throw an alert if stopwords present',() => {
	const data = {
		title: 'Hey, whats your name',
		created_at: Date.now(),
    	id:1
	}
	render(<AnswerBox question={data} />)
	const urlInput = screen.getByPlaceholderText('Your answer')
	fireEvent.change(urlInput,{target:"I don't know"})
	const alertMock = jest.spyOn(window,'alert').mockImplementation(); 
	fireEvent.click(screen.getByText('Submit'))
	expect(alertMock).toHaveBeenCalledTimes(1)
})


test('App should display the questions if present at start',async() => {
	const data = {
		data:  [
			{
				title: 'Hey, whats your name',
				created_at: Date.now(),
				id:1
			},
			{
				title: 'Hey, where are you from',
				body:'1212',
				created_at: Date.now(),
				id:2
			}
		],
		success: 0
	}
	var mockAPI = jest.spyOn(global,'fetch').mockImplementation(setupFetchStub(data)); 
	render(<App/>)
	await waitFor(() => expect(mockAPI).toHaveBeenCalledTimes(1))
	await waitFor(() =>
		expect(screen.getByText('Hey, where are you from')).toBeInTheDocument()
	);
	global.fetch.mockClear()

	
})