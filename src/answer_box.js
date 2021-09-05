import {useState} from 'react'

const AnswerBox = ({app_url,handleCancel,handleSuccess,question}) => {
    const [content, setContent] = useState()
    const stopWords = [ "yes" ,"I don't know", "no", "that's fine"]

    const submitQuestion = async() => {
        
		if (!content || !content.trim()){
			alert('Answer cant be empty');
			return;
		}

        if (content.trim().length < 10){
			alert('Answer cant be less than 10 characters');
			return;
		}


        var stopWordFound = content.split(' ').find(word => {
            return stopWords.includes(word)
        })

        if (!stopWordFound){
            stopWordFound = content.split(',').find(word => {
                return stopWords.includes(word)
            })
        }

        if (stopWordFound){
            console.log("You cant use these stop words in your answer [yes ,I don't know, no, that's fine]")
            return
        }
        

		const response = await fetch(`${app_url}/questions/${question._id}/answers/`,{
			method:'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body:JSON.stringify({
				content: content,
			})
		})

		if (response.status === 200){
			const res = await response.json();
            handleSuccess(res.data)
		}else{
			alert('Problem submitting answers')
		}

    }
    return <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
    
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
    
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex">
                    <h3 className="text-2xl">{question.title}</h3>
                
                </div>
                <div className="pt-2 flex-col">
                    <div className="mt-5">
                        <small>Add your answer here</small>
                    </div>    
                    <textarea value={content}  cols="30" rows="10" className="w-full pl-5 pr-5 pt-5 border border-purple-400 focus:border-purple-800 focus-within:border-purple-800 focus:ring-purple-700" onChange={(e) => setContent(e.target.value)} placeholder="Your answer"></textarea>

                </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={submitQuestion}>
                    Submit
                </button>
            <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleCancel}>
                Cancel
            </button>
            </div>
        </div>
        </div>
  </div>
}

export default AnswerBox;
