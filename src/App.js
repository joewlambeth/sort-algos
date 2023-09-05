import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import BarGraph from './components/BarGraph';
import { bubbleSort, insertionSort, selectionSort } from './utils/SortedArray';

function App() {

  const generateArray = (size) => {
    const arr = []
    for (let i = 0; i < size; i++) {
      arr[i] = i
    }

    for (let i = 0; i < size; i++) {
      const swp = arr[i]
      const randomIndex = Math.floor(Math.random() * size)
      arr[i] = arr[randomIndex]
      arr[randomIndex] = swp
    }

    return arr
  }

  const algoMapping = {
    BUBBLE: {
      label: "Bubble",
      func: bubbleSort
    },
    INSERTION: {
      label: "Insertion",
      func: insertionSort,
    },
    SELECTION: {
      label: "Selection",
      func: selectionSort
    }
  }

  const isDone = useRef(true)
  const delayRef = useRef(100)

  const [done, setDone] = useState(isDone.current)
  const [delay, setDelay] = useState(delayRef.current)
  const [size, setSize] = useState(20)
  const [numbers, setNumbers] = useState([])
  const [colorCodes, setColorCodes] = useState({})
  const [algo, setAlgo] = useState(algoMapping.BUBBLE)

  var timerId
  const sort = () => {
    isDone.current = false
    setDone(isDone.current)
    const iterator = algo.func(numbers)

    var currentIter
    var startTime = new Date().getTime()
    const doYield = async () => {
      const endTime = new Date().getTime()
      const delta = Math.max(33, endTime - startTime) // magic number 33 for 30 frames per second
      const capturedDelay = delayRef.current

      if (capturedDelay < delta) {
        // skip n - 1 frames that exceed the delta
        for (let i = 0; i <= delta / capturedDelay; i++) {
          currentIter = iterator.next()
        }
      } else {
        currentIter = iterator.next()
      }


      if (isDone.current || currentIter.done) {
        isDone.current = true
        setColorCodes({})
        setNumbers([...numbers])
        setDone(isDone.current)
        return
      }

      const writes = currentIter.value.writes ? Object.keys(currentIter.value.writes).reduce((obj, key) => {
        obj[currentIter.value.writes[key]] = "red"
        return obj
      }, {}): {}

      const accesses = currentIter.value.accesses ? Object.keys(currentIter.value.accesses).reduce((obj, key) => {
        obj[currentIter.value.accesses[key]] = "blue"
        return obj
      }, {}): {}

      setColorCodes({
        ...accesses,
        ...writes,
      })
      setNumbers([...numbers])
      await new Promise((resolve) => { timerId = setTimeout(resolve, delayRef.current) })
      startTime = new Date().getTime()
      doYield()
    }

    doYield(iterator)
  }


  useEffect(() => {
    const initialSize = 20
    const array = generateArray(initialSize)
    setNumbers(array)
  }, [])

  const selectAlgo = (e, x) => {
    if (e.target.checked) {
      setAlgo(x)
    }
  }

  return (
    <div className="App">
      <label htmlFor="delay">Delay (ms)</label>
      <input type="number" name="delay" value={delay} min={Number.MIN_VALUE} onChange={(e) => {
        e.preventDefault()
        const targetDelay = e.currentTarget.value
        setDelay(targetDelay)
      }}
      onBlur={(e) => {
        e.preventDefault()
        const targetDelay = e.currentTarget.value
        delayRef.current = targetDelay
      }}/>
      <label htmlFor="count">Count</label>
      <input type="number" name="count" value={size} min={2} disabled={!done} onChange={(e) => {
        e.preventDefault()
        const size = e.currentTarget.value
        setSize(size)
        setNumbers(generateArray(size))
      }}/>
      {Object.keys(algoMapping).map((algo, i) => {
        const algoLabel = algoMapping[algo].label
        return <div key={algo}>
                <label htmlFor={algoLabel}>{algoLabel}</label>
                <input type="radio" name="algo" defaultChecked={i === 0} value={algoLabel} disabled={!done} onChange={(e) => selectAlgo(e, algoMapping[algo])}/>
              </div>
      })}
      <BarGraph numbers={numbers} colorCodes={colorCodes}/>
      <input type="button" disabled={!done} onClick={() => sort()} value="Start"/> 
      <input type="button" disabled={done} onClick={() => {
        isDone.current = true
        setDone(isDone.current)
        clearTimeout(timerId)
      }} value="Stop"/> 
      <input type="button" disabled={!done} onClick={() => setNumbers(generateArray(size))} value="Reset"/> 
    </div>
  );
}

export default App;
