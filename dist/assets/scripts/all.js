"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var getElemt = function getElemt(elemt) {
  return document.querySelector(elemt);
};

var api = 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json';
var cards = getElemt('.card-box');
var option = getElemt('.select-wrap');
var tags = getElemt('.tags');
var placeholder = getElemt('.placeholder');
var cardTitle = getElemt('.card-title');
var pageList = getElemt('.page-list');
var scrollBtn = getElemt('#scroll-top');
var overlay = getElemt('.overlay');
var jsonData = [];
window.axios.get(api).then(function (res) {
  jsonData = res.data.result.records;
  selectFilter(jsonData);
})["catch"](function (err) {
  console.log(err);
}); 

function selectFilter(data) {
  var cacheArr = data.map(function (item) {
    return item.Zone;
  });
  var newSet = new Set(cacheArr);
  var selectArr = [];
  selectArr.push.apply(selectArr, _toConsumableArray(newSet)); 

  var zone = '';
  var all = "\n  <li><input type=\"radio\" id=\"selectArr[0]\" value=\"\u9AD8\u96C4\u5168\u5340\" name=\"city\"><label class=\"select-option\" for=\"selectArr[0]\">\u9AD8\u96C4\u5168\u5340</label></li>";

  for (var i = 0; i < selectArr.length; i++) {
    zone += "\n  <li><input type=\"radio\" id=\"selectArr[".concat(i + 1, "]\" value=\"").concat(selectArr[i], "\" name=\"city\"><label class=\"select-option\" for=\"selectArr[").concat(i + 1, "]\">").concat(selectArr[i], "</label></li>");
  }

  option.innerHTML = all + zone;
  placeholder.innerHTML = '-- 請選擇行政區 --'; 

  pagination(data, 1);
} 


function handleOverlay() {
  var title = cardTitle.textContent;
  var opts = option.querySelectorAll('input');
  opts.forEach(function (item) {
    if (item.value === title) {
      item.checked = true;
    }
  });
} 


function update(data) {
  cards.innerHTML = '';

  for (var i = 0; i < data.length; i++) {
    var cont = "\n  <li class=\"card-item\">\n    <div class=\"card-img\">\n    <div class=\"card-txt\">\n      <div class=\"name\">".concat(data[i].Name, "</div>\n      <div class=\"zone\">").concat(data[i].Zone, "</div>\n    </div><img src=\"").concat(data[i].Picture1, "\" alt=\"").concat(data[i].Description, "\">\n    </div>\n    <div class=\"card-cont\">\n    <p class=\"opentime\">\n      <i class=\"material-icons\">watch_later</i><span>").concat(data[i].Opentime, "</span></p>\n    <p class=\"add\">\n      <i class=\"material-icons\">place</i><a href=\"https://www.google.com.tw/maps/search/").concat(data[i].Name).concat(data[i].Add, "\" target=\"_blank\">").concat(data[i].Add, "</a>\n    </p>\n    <p class=\"tel\"><i class=\"material-icons\">smartphone</i><a href=\"tel:").concat(data[i].Tel, "\">").concat(data[i].Tel, "</a></p>\n    <p class=\"ticketinfo\"><i class=\"material-icons\">local_offer</i>").concat(data[i].Ticketinfo, "</p>\n    </div>\n  </li>");
    cards.innerHTML += cont;
    var tickets = document.querySelectorAll('.ticketinfo');

    if (data[i].Ticketinfo === '') {
      tickets[i].style.display = 'none';
    }
  }
} 


function switchData(e) {
  var tag = e.target;
  var tagValue = tag.value;

  if (tag.nodeName === 'INPUT' || tag.nodeName === 'BUTTON') {
    dataFilter(tagValue);
  } 


  if (tag.nodeName === 'A') {
    var page = tag.dataset.page;
    var title = cardTitle.textContent;
    dataFilter(title);
    pagination(dataFilter(title), page);
  }

  return false;
} 


function dataFilter(value) {
  var data = JSON.parse(JSON.stringify(jsonData));
  var newData = data.filter(function (item, index, arry) {
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
  var perPage = 6;
  var pages = {
    nowPage: current,
    totlePage: Math.ceil(data.length / perPage),
    minData: (current - 1) * perPage + 1,
    maxData: current * perPage
  };
  var newData = [];
  data.forEach(function (item, index) {
    var num = index + 1;

    if (num >= pages.minData && num <= pages.maxData) {
      newData.push(item);
    }
  });
  update(newData);
  pageBtn(pages, current);
} 


function pageBtn(pages, current) {
  var total = pages.totlePage;
  var now = Number(pages.nowPage);
  var str = ''; 

  if (current > 1) {
    str += "<a class=\"prev\" data-page=\"".concat(now - 1, "\">prev</a>");
  } else {
    str += "<a class=\"prev off\" data-page=\"".concat(now, "\">prev</a>");
  } 


  for (var i = 1; i <= total; i++) {
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