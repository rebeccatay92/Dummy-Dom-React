export const primaryColor = '#ed9fad'
const mainFontColor = '#3C3A44'
const secondaryFontColor = '#9FACBC'
const backgroundColor = '#FAFAFA'

// PlannerPage.js styles
export const plannerPageStyles = {
  fontFamily: '\'Roboto\', sans-serif',
  color: mainFontColor,
  margin: '0 auto',
  width: '1445px',
  fontWeight: '300'
}

export const plannerStyle = {display: 'inline-block', width: '1106px', verticalAlign: 'top'}
export const bucketStyle = {display: 'inline-block', width: '335px', verticalAlign: 'top', padding: '14px 0 0 14px'}
export const bucketTitleStyle = {textAlign: 'left', fontSize: '24px'}

// Planner.js styles
export const plannerContainerStyle = {
  height: '90vh',
  width: '100%',
  borderRight: '1px solid rgba(159, 172, 188, 0.5)'
}

export const plannerHeaderContainerStyle = {marginLeft: '89px'}
export const itineraryNameStyle = {fontSize: '56px', fontWeight: '100', marginTop: '0'}
export const itineraryDescStyle = {margin: '0 0 2vh 0', fontSize: '16px', fontWeight: '100', color: secondaryFontColor}
export const plannerHeaderIconsContainerStyle = {position: 'relative', height: '4vh', margin: '0 0 2vh 0'}
export const userIconsContainerStyle = {position: 'absolute', left: '0', top: '0'}
export const userIconStyle = {height: '30px', width: '30px', margin: '0 0 10px 10px'}
export const plannerIconStyle = {
  fontSize: '24px',
  margin: '0 0 0 2vh',
  color: primaryColor,
  opacity: '0.6',
  cursor: 'pointer',
  ':hover': {
    opacity: '1'
  }
}

// Date.js styles
export const timelineStyle = {
  width: '1.5px',
  height: '100%',
  display: 'inline-block',
  position: 'absolute',
  top: '0',
  left: '50%',
  bottom: '0',
  margin: '0 auto',
  backgroundColor: primaryColor
}
export const dateTableStyle = {width: '1052px'}
export const timelineColumnStyle = {width: '89px', position: 'relative'}
export const timelineTitleStyle = headerSticky => {
  return {position: headerSticky ? 'fixed' : 'absolute', top: headerSticky ? '60px' : '0px', textAlign: 'center', width: 'inherit', zIndex: 10, backgroundColor: backgroundColor}
}
export const timelineTitleWordStyle = {fontSize: '16px', display: 'block', color: primaryColor}
export const dayTimelineStyle = sticky => {
  return {position: sticky ? 'fixed' : 'absolute', textAlign: 'center', width: 'inherit', top: sticky ? '120px' : '60px', zIndex: 1, padding: '20px 0'}
}
export const dayTimelineContainerStyle = isDateOnScreen => {
  return {padding: '2px', display: 'inline-block', backgroundColor: isDateOnScreen ? primaryColor : backgroundColor, borderRadius: isDateOnScreen ? '5px' : 0}
}
export const dayTimelineWordStyle = isDateOnScreen => {
  return {fontSize: '16px', color: isDateOnScreen ? backgroundColor : primaryColor, display: 'inline-block'}
}
export const addDayButtonStyle = {padding: '1px 3px', backgroundColor: 'white', border: '1px solid #EDB5BF', display: 'inline-block', marginTop: '20px', cursor: 'pointer'}
export const addDayWordStyle = {fontSize: '16px', color: primaryColor, display: 'inline-block'}
export const dateTableFirstHeaderStyle = {width: `${0.4 * 962}px`}
export const headerDayStyle = {display: 'inline-block', margin: '0 0 0 1vw', fontSize: '24px', fontWeight: '300'}
export const headerDateStyle = {fontSize: '16px', display: 'inline-block', position: 'relative', top: '-2px', marginLeft: '0.5vw', fontWeight: '100'}
export const dateTableOtherHeaderStyle = {width: `${0.2 * 962}px`}
export const dateTableHorizontalLineStyle = isFirstDay => {
  return {marginBottom: '2vh', marginTop: isFirstDay ? '0' : '1vh', width: '962px', height: '8px', boxShadow: '0 8px 10px -10px #86919f inset'}
}

// PlannerActivity.js styles
export const eventBoxStyle = (draggable, activityId) => {
  return {
    cursor: draggable ? 'move' : 'default',
    border: activityId ? 'none' : '1px dashed black',
    position: 'relative'
  }
}
export const eventBoxFirstColumnStyle = (activityId, minHeight) => {
  return { lineHeight: '100%', padding: '1vh 0', minHeight: '12vh' }
}
