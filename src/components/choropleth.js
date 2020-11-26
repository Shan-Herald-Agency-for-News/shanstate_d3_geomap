import { MAP_TYPES } from "../constants"

import * as d3 from "d3"
import React, { useCallback, useEffect, useRef, useState } from "react"
import * as topojson from "topojson"

const propertyFieldMap = {
  township: "TS",
}

function ChoroplethMap({
  statistic,
  mapData,
  mapMeta,
  selectedRegion,
  setSelectedRegion,
  isCountryLoaded,
  mapOption,
}) {
  const choroplethMap = useRef(null)
  const choroplethLegend = useRef(null)
  const [svgRenderCount, setSvgRenderCount] = useState(0)

  const ready = useCallback(
    geoData => {
      d3.selectAll("svg#chart > *").remove()

      const propertyField = propertyFieldMap["township"]
      const svg = d3.select(choroplethMap.current)

      const topology = topojson.feature(
        geoData,
        geoData.objects[mapMeta.graphObjectName]
      )

      const projection = d3.geoMercator()

      // Set size of the map
      let path
      let width
      let height
      if (!svg.attr("viewBox")) {
        const widthStyle = parseInt(svg.style("width"))
        if (isCountryLoaded) projection.fitWidth(widthStyle, topology)
        else {
          const heightStyle = parseInt(svg.style("height"))
          projection.fitSize([widthStyle, heightStyle], topology)
        }
        path = d3.geoPath(projection)
        const bBox = path.bounds(topology)
        width = +bBox[1][0]
        height = +bBox[1][1]
        svg.attr("viewBox", `0 0 ${width} ${height}`)
      }
      const bBox = svg.attr("viewBox").split(" ")
      width = +bBox[2]
      height = +bBox[3]
      projection.fitSize([width, height], topology)
      path = d3.geoPath(projection)

      const colorInterpolator = t => {
        switch (mapOption) {
          case "SNLD":
            return d3.interpolateReds(t * 0.85)
          case "NLD":
            return d3.interpolateBlues(t * 0.85)
          case "USDP":
            return d3.interpolateGreens(t * 0.85)
          case "SNDP":
            return d3.interpolateGreys(t * 0.85)
          case "WNP":
            return d3.interpolateGreys(t * 0.85)
          case "PNO":
            return d3.interpolateGreys(t * 0.85)
          case "TNP":
            return d3.interpolateGreys(t * 0.85)
          default:
            return
        }
      }
      const colorScale = d3.scaleSequential(
        [0, Math.max(1, statistic[mapOption].max)],
        colorInterpolator
      )

      /* Draw map */
      let onceTouchedRegion = null
      const g = svg.append("g").attr("class", mapMeta.graphObjectName)
      g.append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(topology.features)
        .join("path")
        .attr("class", `path-region ${mapOption}`)
        .attr("fill", fillColor)
        .attr("d", path)
        .attr("pointer-events", "all")
        .on("mouseenter", (d, i) => {
          handleMouseEnter(i.properties[propertyField])
        })
        .on("mouseleave", d => {
          if (onceTouchedRegion === d) onceTouchedRegion = null
        })
        .on("touchstart", d => {
          if (onceTouchedRegion === d) onceTouchedRegion = null
          else onceTouchedRegion = d
        })
        .on("click", handleClick)
        .style("cursor", "pointer")
        .append("title")
        .text(function (d) {
          const region = d.properties[propertyField]
          const value = mapData[region] ? mapData[region][mapOption] : 0
          return (
            Number(
              parseFloat(
                100 * (value / (statistic[mapOption].total || 0.001))
              ).toFixed(2)
            ).toString() +
            "% from " +
            toTitleCase(region)
          )
        })

      g.append("path")
        .attr("class", "borders")
        .attr("stroke", "#888888")
        .attr("fill", "none")
        .attr("stroke-width", width / 250)
        .attr(
          "d",
          path(topojson.mesh(geoData, geoData.objects[mapMeta.graphObjectName]))
        )

      const handleMouseEnter = name => {
        try {
          setSelectedRegion(name)
          console.log(name)
        } catch (err) {
          console.log("err", err)
        }
      }

      function handleClick(d, i) {
        console.log(i)
      }

      function getPartyColor(p) {
        switch (p) {
          case "SNLD":
            return "#FEF200"
          case "NLD":
            return "#E7332B"
          case "USDP":
            return "#02532D"
          case "SNDP":
            return "#009F3C"
          case "WNP":
            return "#282DEE"
          case "PNO":
            return "#1356B6"
          case "TNP":
            return "#01AEF0"
          default:
            return "#dddddd"
        }
      }

      function fillColor(d) {
        const region = d.properties[propertyField].toLowerCase()
        const n = mapData[region] ? mapData[region][mapOption] : 0
        let sortable = []
        for (let i in mapData[region]) {
          sortable.push([i, mapData[region][i]])
        }

        sortable.sort(function (a, b) {
          if (isNaN(b[1])) {
            return isNaN(a[1]) - 1
          } else {
            return b[1] - a[1]
          }
        })

        const color = !isNaN(sortable[0][1])
          ? getPartyColor(sortable[0][0])
          : getPartyColor("NaN")

        return color
      }

      // Reset on tapping outside map
      svg.attr("pointer-events", "auto").on("click", () => {
        if (mapMeta.mapType === MAP_TYPES.COUNTRY) {
          setSelectedRegion(null)
        }
      })
    },
    [mapMeta, statistic, mapOption, isCountryLoaded, mapData, setSelectedRegion]
  )

  const toTitleCase = str => {
    str = str.toLowerCase().split(" ")
    for (let i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1)
    }
    return str.join(" ")
  }

  useEffect(() => {
    ;(async () => {
      const data = await d3.json(mapMeta.geoDataFile)
      if (statistic && choroplethMap.current) {
        ready(data)
        setSvgRenderCount(prevCount => prevCount + 1)
      }
    })()
  }, [mapMeta.geoDataFile, statistic, ready])

  useEffect(() => {
    const highlightRegionInMap = name => {
      const paths = d3.selectAll(".path-region")
      paths.classed("map-hover", (d, i, nodes) => {
        const propertyField = propertyFieldMap["township"]
        if (name === d.properties[propertyField]) {
          nodes[i].parentNode.appendChild(nodes[i])
          return true
        }
        return false
      })
    }
    highlightRegionInMap(selectedRegion)
  }, [svgRenderCount, selectedRegion])

  return (
    <div>
      <div className="svg-parent fadeInUp" style={{ animationDelay: "2.5s" }}>
        <svg
          id="chart"
          preserveAspectRatio="xMidYMid meet"
          ref={choroplethMap}
        ></svg>
      </div>
      <div
        className="svg-parent legend fadeInUp"
        style={{ animationDelay: "2.5s" }}
      >
        <svg
          id="legend"
          height="65"
          preserveAspectRatio="xMidYMid meet"
          ref={choroplethLegend}
        ></svg>
      </div>
    </div>
  )
}

export default React.memo(ChoroplethMap)
