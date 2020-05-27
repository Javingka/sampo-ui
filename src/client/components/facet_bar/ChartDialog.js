import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import PieChartIcon from '@material-ui/icons/PieChart'
import Tooltip from '@material-ui/core/Tooltip'
import GeneralDialog from '../main_layout/GeneralDialog'
import ApexChart from '../facet_results/ApexChart'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  chartContainer: {
    height: 'calc(100% - 10px)',
    paddingRight: theme.spacing(1)
  }
}))

/**
 * A component for displaying an ApexChart in a Material-UI Dialog.
 * A Dialog is a type of modal window that appears in front of app content.
 */
const ChartDialog = props => {
  const [open, setOpen] = React.useState(false)
  const { fetchFacetConstrainSelf, facetID, facetClass, data, fetching } = props
  const classes = useStyles()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Tooltip disableFocusListener title='Chart'>
        <IconButton
          aria-label='Chart'
          aria-owns={open ? 'facet-option-menu' : undefined}
          aria-haspopup='true'
          onClick={handleClickOpen}
        >
          <PieChartIcon />
        </IconButton>
      </Tooltip>
      <GeneralDialog
        open={open}
        onClose={handleClose}
      >
        <div className={classes.chartContainer}>
          <ApexChart
            facetID={facetID}
            facetClass={facetClass}
            fetchFacetConstrainSelf={fetchFacetConstrainSelf}
            data={data}
            fetching={fetching}
            options={{
              chart: {
                type: 'pie',
                width: '100%',
                height: '100%',
                parentHeightOffset: 10,
                fontFamily: 'Roboto'
              },
              legend: {
                position: 'right',
                width: 400,
                fontSize: 16,
                itemMargin: {
                  horizontal: 5
                },
                onItemHover: {
                  highlightDataSeries: false
                },
                onItemClick: {
                  toggleDataSeries: false
                },
                markers: {
                  width: 18,
                  height: 18
                },
                formatter: (seriesName, opts) => {
                  const { series } = opts.w.globals
                  const value = series[opts.seriesIndex]
                  const arrSum = series.reduce((a, b) => a + b, 0)
                  const percentage = value / arrSum * 100
                  return `${seriesName}: ${value} (${percentage.toFixed(2)} %)`
                }
              },
              tooltip: {
                custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                  const arrSum = series.reduce((a, b) => a + b, 0)
                  const value = series[seriesIndex]
                  const percentage = value / arrSum * 100
                  return `
                      <div class="apexcharts-custom-tooltip">
                        <span>${w.config.labels[seriesIndex]}: ${value} (${percentage.toFixed(2)} %)</span> 
                      </div>  
        
                  `
                }
              }
            }}
          />
        </div>
      </GeneralDialog>
    </>
  )
}

ChartDialog.propTypes = {
  /**
   * Unique id of the facet.
   */
  facetID: PropTypes.string,
  /**
   * The class of the facet for server-side configs.
   */
  facetClass: PropTypes.string,
  /**
   * The data for Apex chart as an array of objecsts.
   */
  data: PropTypes.array,
  /**
   * Loading indicator.
   */
  fetching: PropTypes.bool.isRequired,
  /**
   * Redux action for fetching the data. Currently using a modified version of the fetchFacet action.
   */
  fetchFacetConstrainSelf: PropTypes.func
}

export default ChartDialog
