const getElemt = (elemt) => document.querySelector(elemt)
const api = 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json'
const cards = getElemt('.card-box')
const option = getElemt('.select-wrap')
const tags = getElemt('.tags')
const placeholder = getElemt('.placeholder')
const cardTitle = getElemt('.card-title')
const pageList = getElemt('.page-list')
const scrollBtn = getElemt('#scroll-top')
const overlay = getElemt('.overlay')
let jsonData = []
window.axios.get(api).then(res => {
  jsonData = res.data.result.records
  selectFilter(jsonData)
}).catch(err => {
  console.log(err)
})

// ----- 過濾選單----- //
function selectFilter (data) {
  // 過濾不重複地區
  // Set 中所有的值都是唯一的，重複值會被忽略，IE11不支援 new Set()
  const cacheArr = data.map(item => item.Zone)
  const newSet = new Set(cacheArr)
  const selectArr = []
  selectArr.push(...newSet)

  // 選單內容
  let zone = ''
  const all = `
  <li><input type="radio" id="selectArr[0]" value="高雄全區" name="city"><label class="select-option" for="selectArr[0]">高雄全區</label></li>`

  for (let i = 0; i < selectArr.length; i++) {
    zone += `
  <li><input type="radio" id="selectArr[${i + 1}]" value="${selectArr[i]}" name="city"><label class="select-option" for="selectArr[${i + 1}]">${selectArr[i]}</label></li>`
  }
  option.innerHTML = all + zone
  placeholder.innerHTML = '-- 請選擇行政區 --'

  // 預設資料內容
  // update(data)
  pagination(data, 1)
}

// ----- 關閉選單----- //
function handleOverlay () {
  const title = cardTitle.textContent
  const opts = option.querySelectorAll('input')
  opts.forEach(item => {
    if (item.value === title) {
      item.checked = true
    }
  })
}

// ----- 資料更新 ----- //
function update (data) {
  cards.innerHTML = ''
  for (let i = 0; i < data.length; i++) {
    const cont = `
  <li class="card-item">
    <div class="card-img">
    <div class="card-txt">
      <div class="name">${data[i].Name}</div>
      <div class="zone">${data[i].Zone}</div>
    </div><img src="${data[i].Picture1}" alt="${data[i].Description}">
    </div>
    <div class="card-cont">
    <p class="opentime">
      <i class="material-icons">watch_later</i><span>${data[i].Opentime}</span></p>
    <p class="add">
      <i class="material-icons">place</i><a href="https://www.google.com.tw/maps/search/${data[i].Name}${data[i].Add}" target="_blank">${data[i].Add}</a>
    </p>
    <p class="tel"><i class="material-icons">smartphone</i><a href="tel:${data[i].Tel}">${data[i].Tel}</a></p>
    <p class="ticketinfo"><i class="material-icons">local_offer</i>${data[i].Ticketinfo}</p>
    </div>
  </li>`
    cards.innerHTML += cont

    const tickets = document.querySelectorAll('.ticketinfo')
    if (data[i].Ticketinfo === '') {
      tickets[i].style.display = 'none'
    }
  }
}

// ----- 切換地區 ----- //
function switchData (e) {
  const tag = e.target
  const tagValue = tag.value

  if (tag.nodeName === 'INPUT' ||
    tag.nodeName === 'BUTTON') {
    dataFilter(tagValue)
  }
  // 切換分頁
  if (tag.nodeName === 'A') {
    const page = tag.dataset.page
    const title = cardTitle.textContent
    dataFilter(title)
    pagination(dataFilter(title), page)
  }
  return false
}

// ----- 過濾分頁資料 ----- //
function dataFilter (value) {
  const data = JSON.parse(JSON.stringify(jsonData))
  let newData = []
  data.filter(item => {
    if (value === item.Zone) {
      newData.push(item)
    } else if (value === '高雄全區') {
      newData = jsonData
    }
    return newData
  })
  placeholder.textContent = value
  cardTitle.textContent = value
  pagination(newData, 1)
  return newData
}

// ----- 顯示分頁 ----- //
function pagination (data, current) {
  const perPage = 6
  const pages = {
    nowPage: current,
    totlePage: Math.ceil(data.length / perPage),
    minData: (current - 1) * perPage + 1,
    maxData: current * perPage
  }
  const newData = []
  data.forEach((item, index) => {
    const num = index + 1
    if (num >= pages.minData && num <= pages.maxData) {
      newData.push(item)
    }
  })
  update(newData)
  pageBtn(pages, current)
}

// ----- 頁碼按鈕 ----- //
function pageBtn (pages, current) {
  const total = pages.totlePage
  const now = Number(pages.nowPage)
  let str = ''

  // 上一頁
  if (current > 1) {
    str += `<a class="prev" data-page="${now - 1}">prev</a>`
  } else {
    str += `<a class="prev off" data-page="${now}">prev</a>`
  }

  // 當前頁
  for (let i = 1; i <= total; i++) {
    if (now === i) {
      str += `<a class="active" data-page="${i}">${i}</a>`
    } else {
      str += `<a data-page="${i}">${i}</a>`
    }
  }

  // 下一頁
  if (current < total) {
    str += `<a class="next" data-page="${now + 1}">next</a>`
  } else {
    str += `<a class="next off" data-page="${now}">next</a>`
  }
  pageList.innerHTML = str
}

// ----- 畫面滑動 ----- //
function scrollTop () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

function scrollStyle () {
  if (window.scrollY > 100) {
    scrollBtn.classList.add('is-active')
  } else {
    scrollBtn.classList.remove('is-active')
  }
}

// ----- 啟動事件 ----- //
function init () {
  option.addEventListener('click', switchData)
  tags.addEventListener('click', switchData)
  pageList.addEventListener('click', switchData)
  overlay.addEventListener('click', handleOverlay)
  scrollBtn.addEventListener('click', scrollTop)
  window.addEventListener('scroll', scrollStyle)
}
init()
