"use strict";

const getElemt = elemt => document.querySelector(elemt);

const api = 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json';
const cards = getElemt('.card-box');
const option = getElemt('.select-wrap');
const tags = getElemt('.tags');
const placeholder = getElemt('.placeholder');
const cardTitle = getElemt('.card-title');
const pageList = getElemt('.page-list');
const scrollBtn = getElemt('#scroll-top');
const overlay = getElemt('.overlay');
let jsonData = [];
window.axios.get(api).then(res => {
  jsonData = res.data.result.records;
  selectFilter(jsonData);
}).catch(err => {
  console.log(err);
}); 

function selectFilter(data) {
  const cacheArr = data.map(item => item.Zone);
  const newSet = new Set(cacheArr);
  const selectArr = [];
  selectArr.push(...newSet); 

  let zone = '';
  const all = "\n  <li><input type=\"radio\" id=\"selectArr[0]\" value=\"\u9AD8\u96C4\u5168\u5340\" name=\"city\"><label class=\"select-option\" for=\"selectArr[0]\">\u9AD8\u96C4\u5168\u5340</label></li>";

  for (let i = 0; i < selectArr.length; i++) {
    zone += "\n  <li><input type=\"radio\" id=\"selectArr[".concat(i + 1, "]\" value=\"").concat(selectArr[i], "\" name=\"city\"><label class=\"select-option\" for=\"selectArr[").concat(i + 1, "]\">").concat(selectArr[i], "</label></li>");
  }

  option.innerHTML = all + zone;
  placeholder.innerHTML = '-- 請選擇行政區 --'; 

  pagination(data, 1);
} 


function handleOverlay() {
  const title = cardTitle.textContent;
  const opts = option.querySelectorAll('input');
  opts.forEach(item => {
    if (item.value === title) {
      item.checked = true;
    }
  });
} 


function update(data) {
  cards.innerHTML = '';

  for (let i = 0; i < data.length; i++) {
    const cont = "\n  <li class=\"card-item\">\n    <div class=\"card-img\">\n    <div class=\"card-txt\">\n      <div class=\"name\">".concat(data[i].Name, "</div>\n      <div class=\"zone\">").concat(data[i].Zone, "</div>\n    </div><img src=\"").concat(data[i].Picture1, "\" alt=\"").concat(data[i].Description, "\">\n    </div>\n    <div class=\"card-cont\">\n    <p class=\"opentime\">\n      <i class=\"material-icons\">watch_later</i><span>").concat(data[i].Opentime, "</span></p>\n    <p class=\"add\">\n      <i class=\"material-icons\">place</i><a href=\"https://www.google.com.tw/maps/search/").concat(data[i].Name).concat(data[i].Add, "\" target=\"_blank\">").concat(data[i].Add, "</a>\n    </p>\n    <p class=\"tel\"><i class=\"material-icons\">smartphone</i><a href=\"tel:").concat(data[i].Tel, "\">").concat(data[i].Tel, "</a></p>\n    <p class=\"ticketinfo\"><i class=\"material-icons\">local_offer</i>").concat(data[i].Ticketinfo, "</p>\n    </div>\n  </li>");
    cards.innerHTML += cont;
    const tickets = document.querySelectorAll('.ticketinfo');

    if (data[i].Ticketinfo === '') {
      tickets[i].style.display = 'none';
    }
  }
} 


function switchData(e) {
  const tag = e.target;
  const tagValue = tag.value;

  if (tag.nodeName === 'INPUT' || tag.nodeName === 'BUTTON') {
    dataFilter(tagValue);
  } 


  if (tag.nodeName === 'A') {
    const page = tag.dataset.page;
    const title = cardTitle.textContent;
    dataFilter(title);
    pagination(dataFilter(title), page);
  }

  return false;
} 


function dataFilter(value) {
  const data = JSON.parse(JSON.stringify(jsonData));
  const newData = data.filter((item, index, arry) => {
    if (item.Zone === value) {
      return arry.push(item);
    } else if (value === '高雄全區') {
      arry = jsonData;
      return arry;
    }
  });
  placeholder.textContent = value;
  cardTitle.textContent = value;
  pagination(newData, 1);
  return newData;
} 


function pagination(data, current) {
  const perPage = 6;
  const pages = {
    nowPage: current,
    totlePage: Math.ceil(data.length / perPage),
    minData: (current - 1) * perPage + 1,
    maxData: current * perPage
  };
  const newData = [];
  data.forEach((item, index) => {
    const num = index + 1;

    if (num >= pages.minData && num <= pages.maxData) {
      newData.push(item);
    }
  });
  update(newData);
  pageBtn(pages, current);
} 


function pageBtn(pages, current) {
  const total = pages.totlePage;
  const now = Number(pages.nowPage);
  let str = ''; 

  if (current > 1) {
    str += "<a class=\"prev\" data-page=\"".concat(now - 1, "\">prev</a>");
  } else {
    str += "<a class=\"prev off\" data-page=\"".concat(now, "\">prev</a>");
  } 


  for (let i = 1; i <= total; i++) {
    if (now === i) {
      str += "<a class=\"active\" data-page=\"".concat(i, "\">").concat(i, "</a>");
    } else {
      str += "<a data-page=\"".concat(i, "\">").concat(i, "</a>");
    }
  } 


  if (current < total) {
    str += "<a class=\"next\" data-page=\"".concat(now + 1, "\">next</a>");
  } else {
    str += "<a class=\"next off\" data-page=\"".concat(now, "\">next</a>");
  }

  pageList.innerHTML = str;
} 


function scrollTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function scrollStyle() {
  if (window.scrollY > 100) {
    scrollBtn.classList.add('is-active');
  } else {
    scrollBtn.classList.remove('is-active');
  }
} 


function init() {
  option.addEventListener('click', switchData);
  tags.addEventListener('click', switchData);
  pageList.addEventListener('click', switchData);
  overlay.addEventListener('click', handleOverlay);
  scrollBtn.addEventListener('click', scrollTop);
  window.addEventListener('scroll', scrollStyle);
}

init();