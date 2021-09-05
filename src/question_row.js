import {useState} from 'react'
const QuestionRow = ({data,answers,handleAnswerClick, fetchAnswers}) => {
    const [canShowAnswers, setcanShowAnswers] = useState(false)


    return <div className={`flex ${data.newly_added ? 'bg-yellow-100' : ''}`}>
                 <div className="m-1 mr-2 relative flex justify-center items-center  bg-purple-200 text-purple-700 flex-none used">
                    {data.viewed}
                 </div>
                <div className="flex-col p-3 flex-auto">
                    <div className="header flex">
                        <h4 className="text-xl font-semibold">{data.title}</h4>
                        <small className="text-xs pt-2 ml-5">(Created At: {new Date(data.created_at).toLocaleDateString('en-US')})</small>
                    </div>
                    
                    <div className="text-sm">
                       {data.body}
                    </div>
                    
                    <div className="flex ">
                        <button className=" text-green-600  font-semibold text-sm" onClick={async ()=>{
                            if (!canShowAnswers){
                                await fetchAnswers(data._id)
                                setcanShowAnswers(true)
                            }else{
                                setcanShowAnswers(false)
                            }
                            
                        }}>{!canShowAnswers ? 'Show answers' : 'Hide answers'}</button>
                    </div>
                   
                   {
                       canShowAnswers
                        ? <div className="answers">
                        {
                            answers.map(answer => {
                                return <div className={`p-5 ${answer.newly_added ? 'bg-yellow-100' : ''}`} key={answer._id}>
                                    {answer.content}
                                </div>
                            })
                        }
                         </div>
                        : null

                   }
                </div>
                <div className="flex-row-reverse p-5">
                    <button className="bg-green-100 text-green-600  p-2 font-semibold text-sm" onClick={() => handleAnswerClick(data)}>Answer it</button>
                </div>
            </div>
}

export default QuestionRow