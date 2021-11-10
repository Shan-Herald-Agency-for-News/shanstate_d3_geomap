import React, { useState } from "react"
import MapExplorer from "../components/mapexplorer"

import axios from "axios"
import "../styles/styles.css"
import { useEffectOnce } from "react-use"

import { MAP_TYPES } from "../constants"

//* use in development
const MAP_META = {
  Shan: {
    name: "Shan",
    // geoDataFile: `${MAPS_DIR}/shan.json`,
    geoDataFile: `../maps/shan_state_townships.json`,
    mapType: MAP_TYPES.STATE,
    // graphObjectName: 'shan',
    graphObjectName: "myanmar_township",
  },
}

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
