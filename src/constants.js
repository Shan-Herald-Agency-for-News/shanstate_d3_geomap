export const MAP_TYPES = {
  COUNTRY: "country",
  STATE: "state",
}

export const MAP_STATISTICS = {
  TOTAL: 0,
  PER_MILLION: 1,
}

export const MAPS_DIR = "/maps"

export const MAP_META = {
  Shan: {
    name: "Shan",
    // geoDataFile: `${MAPS_DIR}/shan.json`,
    geoDataFile: `${MAPS_DIR}/shan_state_townships.json`,
    mapType: MAP_TYPES.STATE,
    // graphObjectName: 'shan',
    graphObjectName: "myanmar_township",
  },
}

export const STATE_CODES = {
  "MM-07": "Ayeyarwady",
  "MM-02": "Bago",
  "MM-14": "Chin",
  "MM-11": "Kachin",
  "MM-12": "Kayah",
  "MM-13": "Kayin",
  "MM-03": "Magway",
  "MM-04": "Mandalay",
  "MM-15": "Mon",
  "MM-18": "Nay Pyi Taw",
  "MM-16": "Rakhine",
  "MM-01": "Sagaing",
  "MM-17": "Shan",
  "MM-05": "Tanintharyi",
  "MM-06": "Yangon",
}

const stateCodes = []
const reverseStateCodes = {}
Object.keys(STATE_CODES).map((key, index) => {
  reverseStateCodes[STATE_CODES[key]] = key
  stateCodes.push({ code: key, name: STATE_CODES[key] })
  return null
})
export const STATE_CODES_REVERSE = reverseStateCodes
export const STATE_CODES_ARRAY = stateCodes

export const STATE_POPULATIONS = {}

export const DISTRICTS_ARRAY = []
