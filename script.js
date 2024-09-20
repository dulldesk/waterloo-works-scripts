// ==UserScript==
// @name         waterlooworks userscript
// @version      1
// @match        https://waterlooworks.uwaterloo.ca/*
// @namespace    https://tampermonkey.net/
// @author       me
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uwaterloo.ca
// @grant        none
// ==/UserScript==

'use strict';

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
  const rows = getAppRows();
  if (rows?.length) {
    queryRejected(rows);
  } else {
    setTimeout(pollRejected, 400);
  }
}

/**
 * keepMeLoggedIn
 *
 * The keepMeLoggedInClicked function is defined directly in the WW html page source
 */
function keepLoggedIn() {
  setInterval(window.keepMeLoggedInClicked, 1700 * 1000);
  window.sessionTimeoutTimeout = function() {console.log('called overwritten sessionTimeoutTimeout :p')}
  clearInterval(window.sessionInterval);
  console.log('cleared logout timers')
}
function pollLogoutTimeouts() {
  if (window.sessionInterval && window.sessionTimeoutTimeout && window.keepMeLoggedInClicked) {
    keepLoggedIn();
  } else {
    setTimeout(pollLogoutTimeouts, 800);
  }
}

// main
setTimeout(pollRejected, 1500);
setTimeout(pollLogoutTimeouts, 1500);
