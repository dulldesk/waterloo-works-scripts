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

const getAppRows = (i=7) => Array.from(document.querySelectorAll(`#na_studentApplicationGridTableID tr td:nth-child(${i})`))

function queryRejected(rs) {
  let rows = rs ?? getAppRows()
  let rows2 = getAppRows(6)

  let intv = rows2.reduce((acc, curr) => curr.textContent.match(/(Selected)/) ? acc + 1 : acc, 0)
  let rej = rows.reduce((acc, curr) => curr.textContent.match(/(Complete|Finalized)/) ? acc + 1 : acc, 0) - intv
  let cancel = rows.reduce((acc, curr) => curr.textContent.match(/Cancel/) ? acc + 1 : acc, 0)
  let remn = rows.length - rej - cancel

  if (rej > 0 || cancel > 0) {
    let sp = document.createElement("span")
    sp.textContent = `${intv > 0 ? (intv + '|') : ''}${rej}|${cancel}|${remn}`
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

// redirect to student login page
function redirectLogin() {
  if (window.location.pathname === "/notLoggedIn.htm" || window.location.pathname === '/home.htm') {
    window.location.replace('/waterloo.htm?action=login');
  }
}

// main
setTimeout(pollRejected, 1500);
setTimeout(pollLogoutTimeouts, 1500);
setTimeout(redirectLogin, 1000);
