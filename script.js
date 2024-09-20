/**
 * Count application statuses (rejected|cancelled|remaining)
 */
const getAppRows = () => Array.from(document.querySelectorAll('#na_studentApplicationGridTableID tr td:nth-child(7)'))

function queryRejected(rows) {
  rows = rows ?? getAppRows()

  let rej = rows.reduce((acc, curr) => curr.textContent.match(/(Complete|Finalized)/) ? acc + 1 : acc, 0)
  let cancel = rows.reduce((acc, curr) => curr.textContent.match(/Cancel/) ? acc + 1 : acc, 0)
  let remn = rows.length - rej - cancel
	
  if (rej > 0 || cancel > 0) {
    let sp = document.createElement("span")
    sp.textContent = `${rej}|${cancel}|${remn}`
    document.querySelector(".span12.orbis-posting-actions.sel_SearchMessage .pull-right").prepend(sp)
  }
}

function pollRejected() {
  const rows = getAppRows()
  
  if (!rows || !rows.length) {
   setTimeout(pollRejected, 400) 
  } else {
   queryRejected(rows) 
  }
}

setTimeout(pollRejected, 1500);


/**
 * keepMeLoggedIn
 *
 * This function is defined directly in the WW html page source
 */
setInterval(keepMeLoggedInClicked, 1700 * 1000);
sessionTimeoutTimeout = function() {console.log('called overwritten sessionTimeoutTimeout')}
clearInterval(sessionInterval);

