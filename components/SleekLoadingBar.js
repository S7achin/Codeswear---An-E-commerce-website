'use client'
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import LoadingBar from 'react-top-loading-bar'


const SleekLoadingBar = () => {
    const [progress, setProgress] = useState(20);
    const pathname = usePathname();

    useEffect(()=>{
      // const interval = setInterval(()=>{
      //   setProgress((prevProgress)=> prevProgress >= 100 ? 0 : prevProgress + 10);
      //   // console.log(progress);
      // },600)
        setProgress(100)
    },[pathname])

  return (
    <div>
      <LoadingBar
        color='#ff2d55'
        progress={progress}
        waitingTime={1000}
        onLoaderFinished={() => setProgress(0)}
      />
    </div>
  )
}

export default SleekLoadingBar
