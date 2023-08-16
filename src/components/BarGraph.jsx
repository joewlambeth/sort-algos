
import React, { useEffect, useRef } from 'react';

function BarGraph({ numbers, colorCodes }) {
  const canvasRef = useRef(null)

  const render = (array) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.fillStyle = "black";

    const barWidth = canvas.width / array.length
    const heightRatio = canvas.height / array.length

    for (let i = 0; i < array.length; i++) {
        if (colorCodes[i]) {
            ctx.fillStyle = colorCodes[i];
        } else {
            ctx.fillStyle = "black"
        }
        ctx.fillRect(i * barWidth, canvas.height - array[i] * heightRatio, barWidth, array[i] * heightRatio)
    }
  }

  useEffect(() => render(numbers))

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default BarGraph;
