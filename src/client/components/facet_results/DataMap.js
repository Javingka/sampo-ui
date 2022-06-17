import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography'

const styles = () => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const ResultInfo = props => {
  const { classes } = props
  return (
    <div className={classes.root}>
      <Box 
          dangerouslySetInnerHTML={{ __html: "<iframe style='width:100%;height:100%' src='https://drumwave.lichen.com/#/views/DataMap%20Preliminar' />"}} 
          sx={theme => ({
          background: mainPage.bannerBackround,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: mainPage.bannerMobileHeight,
          [theme.breakpoints.up('md')]: {
            height: mainPage.bannerReducedHeight
          },
          [theme.breakpoints.up('xl')]: {
            height: mainPage.bannerDefaultHeight
          },
          boxShadow: '0 -15px 15px 0px #bdbdbd inset',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        })}>
          {/* <div dangerouslySetInnerHTML={{ __html: "<iframe src='https://drumwave.lichen.com/#/views/DataMap%20Preliminar' />"}} /> */}
      </Box>
    </div>
  )
}

ResultInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.string
}

export default withStyles(styles)(ResultInfo)
