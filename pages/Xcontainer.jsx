/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { Exo_2 } from 'next/font/google'
const font = Exo_2({ subsets: ['latin'] })

import Merge from "./Merge";
import Welcome from "./Welcome";
import Widget from "./Widget";
import Todo from "./Todo";
import { useState, useEffect } from "react";

export default function Xcontainer () {
  const base = {
    todo:[], 
    widget:[]
  }
  const storageKey = 'userConfig';
  const [Init, setInit] = useState(false)
  const [Valid, setValid] = useState({todo:true, widget:true})
  const [userConfig, setUserConfig] = useState({...base})
  const [savedConfig, setSavedConfig] = useState({...base})

  useEffect(() => {
    if (Init) localStorage.setItem(storageKey, JSON.stringify(userConfig))
  }, [userConfig]);

  ///////////////////
  // Storage Setup
  // 
  //
  // Set Client Configuration in Cache for offline usage and API Controls
  //
  // GET TodoList and Validate if the Online and Offline data are synced
  // Get recent cache from Client Local Storage and Fetch from Database
  useEffect(() => {
    const oldData = JSON.parse(localStorage.getItem(storageKey))
    if (oldData) setUserConfig(oldData)

    const fetchValid = async () => {
      try {
        // Fetch Data and Save it to Temp
        const response = await fetch(`api/default`)
        if (response.ok) {
          const data = await response.json();
          setSavedConfig((prevData) => ({
            ...prevData,
            ['todo']: data,
          }))
          if (oldData) {
            if ((JSON.stringify(data) !== JSON.stringify(oldData.todo)))
              setValid((Valid) => ({...Valid,['todo']: false}))
          }
          else if (JSON.stringify(data) !== JSON.stringify(userConfig.todo)) 
          {
            setValid((Valid) => ({...Valid,['todo']: false}))
          }
        } 
        else {console.error('Failed to fetch default data')}
        setInit(true)
      } catch (error) {
        console.error('Error:', error)
      }
    };
    fetchValid()
  }, []);
  // 
  // 
  //
  // Storage Setup End
  /////////////////// 
  
  
  return (<>
    {(!Valid.todo || !Valid.widget) ? <Merge 
      storageKey={storageKey}
      Valid={Valid} 
      setValid={setValid}
      savedConfig={savedConfig} 
      setSavedConfig={setSavedConfig} 
      userConfig={userConfig} 
      setUserConfig={setUserConfig}  
    /> : ''}
    <main className={font.className}>
      <div className="container">
        <Todo 
          storageKey={storageKey}
          Valid={Valid} 
          setValid={setValid}
          savedConfig={savedConfig} 
          setSavedConfig={setSavedConfig} 
          userConfig={userConfig} 
          setUserConfig={setUserConfig}
        />
        <div className="blocks">
          <div className="box">
            <Welcome/>
            <Widget/>
          </div>
          <div className="watermark">
            <span>By LamP</span>
            <div className="line"></div>
          </div>
        </div>
      </div>
    </main>
  </>)
}