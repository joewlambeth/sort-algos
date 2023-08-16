import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import BarGraph from './components/BarGraph';
import { bubbleSort } from './utils/SortedArray';

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


  const isDone = useRef(true)
  const [done, setDone] = useState(isDone.current)
  const [delay, setDelay] = useState(100)
  const [size, setSize] = useState(20)
  const [numbers, setNumbers] = useState([])
  const [colorCodes, setColorCodes] = useState({})

  var timerId
  const sort = () => {
    isDone.current = false
    setDone(isDone.current)
    const iterator = bubbleSort(numbers)

    var currentIter
    var startTime = new Date().getTime()
    const doYield = async () => {
      const endTime = new Date().getTime()
      const delta = Math.max(33, endTime - startTime) // magic number 33 for 30 frames per second

      if (delay < delta) {
        // skip n - 1 frames that exceed the delta
        for (let i = 0; i <= delay / delta; i++) {
          currentIter = iterator.next()
        }
      } else {
        currentIter = iterator.next()
      }


      if (isDone.current || currentIter.done) {
        isDone.current = true
        setColorCodes({})
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
      await new Promise((resolve) => { timerId = setTimeout(resolve, delay) })
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

  return (
    <div className="App">
      <input type="number" value={delay} disabled={/* TODO: use ref to stop disabling this*/ !done} onChange={(e) => {
        e.preventDefault()
        const targetDelay = e.currentTarget.value
        setDelay(targetDelay)
      }}/>
      <input type="number" value={size} disabled={!done} onChange={(e) => {
        e.preventDefault()
        const size = e.currentTarget.value
        setSize(size)
        setNumbers(generateArray(size))
      }}/>
      <input type="radio" name="Bubble"/>
      <input type="radio" name="Insertion"/>
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
