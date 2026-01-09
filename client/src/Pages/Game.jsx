import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { startTest, submitTest } from '../Slices/testSlice';

const Game = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //STATES

  const GAME_STATE = {
    INSTRUCTION: "instruction",
    TEST: "test",
    REDIRECT: "redirect"
  }

  const { testData, questionData, isLoading } = useSelector(state => state.test);

  const [responses, setResponses] = useState([]);
  const [gameState, setGameState] = useState(GAME_STATE.INSTRUCTION);
  const [index, setIndex] = useState(0);

  const [testTimer, setTestTimer] = useState(10);
  const [redirectTimer, setRedirectTimer] = useState(10);
  const [instructionTimer, setInstructionTimer] = useState(10);

  //TIMER

  //instructions timer
  useEffect(() => {

    if (gameState !== GAME_STATE.INSTRUCTION) return;

    dispatch(startTest())
      .unwrap()
      .then((res) => {

        setResponses(res.data.map((qn, index) => {

          return { uid: qn.uid, selectedOption: 0 };

        }));

      })
      .catch((error) => {
        console.error(error);
      })


    console.log(responses);

    const interval = setInterval(() => {

      setInstructionTimer(prev => {

        if (prev == 1) {
          clearInterval(interval);
          setGameState(GAME_STATE.TEST);
          return 0;
        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(interval);

  }, [gameState, dispatch])

  //test timer
  useEffect(() => {

    if (gameState !== GAME_STATE.TEST) return;

    const interval = setInterval(() => {

      setTestTimer(prev => {

        if (prev == 1) {
          clearInterval(interval);

          //dispatch submit test
          dispatch(submitTest({ response: responses }));

          setGameState(GAME_STATE.REDIRECT);
          return 0;
        }

        return prev - 1;

      })

    }, 1000);

    return () => clearInterval(interval)

  }, [gameState, dispatch, responses])


  //redirect timer
  useEffect(() => {

    if (gameState !== GAME_STATE.REDIRECT) return;

    const interval = setInterval(() => {

      setRedirectTimer(prev => {

        if (prev == 1) {
          clearInterval(interval);
          navigate('/');
          return 0;
        }

        return prev - 1;

      });


    }, 1000)

    return () => clearInterval(interval);

  }, [gameState, navigate]);


  useEffect(()=> {
    console.log(responses)
  },[responses])


  //FUNCTIONS

  //next index
  const next = () => {

    if (index < questionData.length - 1)
      setIndex(prev => prev + 1);

  }

  //prev index
  const prev = () => {

    if (index > 0)
      setIndex(prev => prev - 1);

  }

  //select option
  const selectOption = (uid, selectedOption) => {

    setResponses(prev => {

      const exists = prev.find(r => r.uid === uid)

      if (exists) {
        return prev.map(r => {
          return r.uid === uid ? { ...r, selectedOption } : r
        })
      }

      return [...prev, { uid, selectedOption }];

    })

  }

  //INTERFACES

  //instruction ui
  if (gameState === GAME_STATE.INSTRUCTION) {

    return (

      <div>

        <h1>TEST INSTRUCTIONS</h1>

        <h2>Test Starts in {instructionTimer}</h2>

        <div>10 Seconds for test</div>
        <div>Attempt as many as possible</div>
        <div>Refreshing window or exiting screen is not permitted once the test begins</div>
        <div>Score will be generated once test ends</div>
        <h2>ALL THE BEST</h2>

        <button onClick={() => { setGameState(GAME_STATE.TEST) }}>START TEST</button>

      </div>

    )
  }

  //test ui
  if (gameState === GAME_STATE.TEST) {

    if (isLoading || !questionData.length) {
      return <h1>Loading...</h1>
    }

    const qn = questionData[index];
    const selectedOpt = responses.find(r => r.uid === qn.uid)?.selectedOption;

    return (

      <div>

        <div>Time Left : {testTimer}</div>

        <div>Question {index + 1} / {questionData.length}</div>

        <div>Marks : {qn.value}</div>
        <div>question id : {qn.uid}</div>

        <div>{qn.description}</div>

        {qn.questionImage && <img src={qn.questionImage} />}

        <div>

          {

            qn.options.map((opt) => {
              return (
                <div>
                  <button key={opt.id} className={selectedOpt === opt.id ? 'bg-green-600' : 'bg-white'} onClick={() => { selectOption(qn.uid, opt.id) }}>
                    {opt.id}.   {opt.text}
                  </button>

                  <br />
                </div>
              )
            })

          }

        </div>

        <button onClick={() => { prev() }} disabled={index === 0} >prev</button>

        <button onClick={() => { next() }} disabled={index === questionData.length - 1}>next</button>

        <button onClick={() => {
          dispatch(submitTest({ response: responses }));
          setGameState(GAME_STATE.REDIRECT)
        }
        }>submit</button>

      </div>

    )
  }

  //redirect ui
  if (gameState === GAME_STATE.REDIRECT) {

    const testResp = testData?.[0];

    return (

      <div>

        <h1>TEST RESULT</h1>

        <h2>Redirecting in {redirectTimer}</h2>

        <h1>SCORE : {testResp?.score}</h1>

        <button onClick={() => { navigate('/') }}>GO HOME</button>

      </div>

    )
  }

  return null;

}

export default Game
