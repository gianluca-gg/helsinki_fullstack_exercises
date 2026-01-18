import { useState } from 'react'
const Statistics = (props) => {
  const all = props.good + props.neutral + props.bad;
  const average = (props.good - props.bad) / all;
  const positive = (props.good / all) * 100;
  if (all === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
  else {
  return (
    <div>
    <h1>statistics</h1>
    <table>
      <tbody>
    
          <StatisticLine text="good" value={props.good} />

        <StatisticLine text="neutral" value={props.neutral} />

          <StatisticLine text="bad" value={props.bad} />

          <StatisticLine text="all" value={all} />

          <StatisticLine text="average" value={average} />

           <StatisticLine text="positive" value={positive} />
  </tbody>
    </table>
        </div>
        )
        }
}

const StatisticLine = (props) => {
  return (
      <tr>
        <td>
          {props.text}
        </td>
         <td>
          {props.value}
        </td>
      </tr>
  )
}

const Button = (props) => {
  return (
    <div>
      <button onClick={props.onClick}>{props.text}</button>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <div>
        <h1>give feedback</h1>
        <Button text="good" onClick={() => setGood(good + 1) } />
        <Button text="neutral" onClick={() => setNeutral(neutral + 1) } />
        <Button text="bad" onClick={() => setBad(bad + 1) } />
        
      </div>
      <Statistics bad={bad} neutral={neutral} good={good} />
    
    </div>
  )
}

export default App