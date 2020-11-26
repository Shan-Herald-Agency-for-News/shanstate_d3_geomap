import MapExplorer from "../components/mapexplorer"

import { MAP_META } from "../constants"

import axios from "axios"
import React, { useState, useCallback } from "react"
import "../styles/styles.css"
import { useEffectOnce, useLocalStorage, useFavicon } from "react-use"

function Home(props) {
  // const [states, setStates] = useState([]);
  const [delegate, setDelegate] = useState({})

  const [fetched, setFetched] = useState(false)

  useEffectOnce(() => {
    getStates()
  })

  const getStates = async () => {
    try {
      const { data } = await axios.get(
        `https://shannews.github.io/election2020-api/delegate.json`
      )

      setDelegate(data)
      setFetched(true)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <React.Fragment>
      <div className="home-right">
        {fetched && (
          <React.Fragment>
            <MapExplorer
              mapMeta={MAP_META.Shan}
              states={"shan"}
              townshipDelegate={delegate}
              isCountryLoaded={true}
            />
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  )
}

export default React.memo(Home)
