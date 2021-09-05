import {useState} from 'react'

const AskQuestion = ({app_url,handleCancel,handleSuccess}) => {
    const [questionTitle, setquestionTitle] = useState()
    const [questionContent, setquestionContent] = useState()

    const submitQuestion = async() => {
        // console.log(questionTitle)
        // console.log(questionContent)
        
		if (!questionTitle || !questionTitle.trim()){
			alert('Question tile cant be empty');
			return;
		}

        if (!questionContent || !questionContent.trim()){
			alert('Question body cant be empty');
			return;
		}

        // if (questionTitle.trim().length > 10){
        //     alert('Question title cant be that small, please have atleast 10 characters');
		// 	return;
        // }

        // if (questionContent.trim().length > 10){
        //     alert('Question body cant be that small, please have atleast 10 characters');
		// 	return;
        // }

		const response = await fetch(`${app_url}/questions`,{
			method:'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body:JSON.stringify({
				title: questionTitle,
                body:questionContent
			})
		})

		if (response.status === 200){
			const res = await response.json();
            handleSuccess(res.data)
		}else{
			alert('Problem saving question')
		}

    }
    return <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
    
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
    
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex">
                    <h3 className="text-2xl">Have a question? Ask away!</h3>
                
                </div>
                <div className="pt-2 flex-col">
                    <div>
                        <small>Question title</small>
                    </div>      
                    <input value={questionTitle} type="text" className="w-full pl-5 pr-5 pt-5 border border-purple-400 focus:border-purple-800 focus-within:border-purple-800 focus:ring-purple-700" onChange={(e) => setquestionTitle(e.target.value)} placeholder="Question title" />

                    <div className="mt-5">
                        <small>Any more details?</small>
                    </div>    
                    <textarea value={questionContent}  cols="30" rows="10" className="w-full pl-5 pr-5 pt-5 border border-purple-400 focus:border-purple-800 focus-within:border-purple-800 focus:ring-purple-700" onChange={(e) => setquestionContent(e.target.value)}></textarea>

                </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={submitQuestion}>
                    Ask
                </button>
            <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleCancel}>
                Cancel
            </button>
            </div>
        </div>
        </div>
  </div>
}

export default AskQuestion;
