function Calendar() {
	
	var CONST_ADDED_EVENTS = 'CONST_ADDED_EVENTS';
	var CONST_DAYS_ROWS = 6;
	var CONST_DAYS_COLUMS = 7;
	var lang = 'ZH';
	var monthNames = {};
	monthNames['ZH'] = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aguest', 'September', 'October', 'November', 'December');
	var yearNames = {};
	yearNames['ZH'] = '';
	var monthDays = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	var weekNames = ['SUN.','MON.','TUE.','WED.','THU.','FRI.','SAT.'];
	//待办事项数据结构
	var toDoObj = {};
	//              '2015-3-12':
	//              [
	//                  {
	//                      time:'12:05',
	//                      content:'观看中央新闻',
	//                      id:'1'
	//                  },
	//                  {
	//                      time:'15:05',
	//                      content:'洗衣服',
	//                      id:'2'
	//                  }
	//              ],
	//              '2015-2-1':
	//              [
	//              	{
	//                      time:'11:05',
	//                      content:'观看中央财经频道',
	//                      id:'5'
	//                  },
	//                  {
	//                      time:'12:05',
	//                      content:'观看中央新闻1',
	//                      id:'3'
	//                  },
	//                  {
	//                      time:'15:05',
	//                      content:'刷鞋子',
	//                      id:'4'
	//                  }
	//              ]
	//              
	//          };


	var now = new Date();
	var currentDate = new Date(now);
	var currentYear = currentDate.getFullYear();
	var currentMonth = currentDate.getMonth();
	var currentDayIndex = currentDate.getDate();

	function initCalendarAndEvents() {
		if (localStorage.getItem(CONST_ADDED_EVENTS)) {
			toDoObj = JSON.parse(localStorage.getItem(CONST_ADDED_EVENTS));
		}
		initDivDays(now);
		freshmonthTitle();
		initDaySpanHeight();
		addEventListenersFun();
		initcurrentDayEventList();
		freshmonthTodoCount();
	};

	function freshmonthTodoCount() {
			var num = 0;
			for (var str in toDoObj) {
				var strArr = str.split('-');
				if (strArr.length == 3) {
					if (strArr[0] == currentYear && Number(strArr[1]) == Number(currentMonth + 1)) {
						num = num + toDoObj[str].length;
					}
				}
			}
			//document.getElementById('monthTodoCount').innerHTML = num;
		}

	function freshtodayTodoCount() {
			var todoStr = currentYear + '-' + Number(currentMonth + 1) + '-' + currentDayIndex;
			if (toDoObj && toDoObj.hasOwnProperty(todoStr)) {
				var elist = toDoObj[todoStr];
				if (elist instanceof Array) {
					var elen = elist.length;
					document.getElementById('selectDayCount').innerHTML = elen + ' task';
				}
			}
		}
		
	
	function initcurrentDayEventList() {
			document.getElementById('eventList').innerHTML = '';
			var todoStr = currentYear + '-' + Number(currentMonth + 1) + '-' + currentDayIndex;
			if (toDoObj && toDoObj.hasOwnProperty(todoStr)) {
				var elist = toDoObj[todoStr];
				if (elist instanceof Array) {
					var elen = elist.length;
					document.getElementById('selectDayCount').innerHTML = elen + ' task';
					for (var i = 0; i < elen; i++) {
						var obj = elist[i];
						addOneEventCase(obj);
					}
				}
			} else {
				document.getElementById('selectDayCount').innerHTML = '0 task';
			}
		}

	function addOneEventCase(obj) {
			var esingle = document.createElement('div');
			esingle.className = 'eventSingle';

			var content = document.createElement('div');
			content.className = 'eventContent';
			content.innerHTML = obj['content'];

			var etime = document.createElement('div');
			etime.className = 'eventTime';

			var sjspan = document.createElement('span');
			sjspan.className = 'iconfont icon-shijian shijianicon';
			var tspan = document.createElement('span');
			tspan.id = 'eventTimeSpan';
			tspan.innerHTML = obj['time'];

			var dspan = document.createElement('span');
			dspan.className = 'iconfont icon-shanchu1 deleteicon';
			dspan.onclick = function() {
				document.getElementById('eventList').removeChild(esingle);
				deleteContent(obj);
			}

			etime.appendChild(sjspan);
			etime.appendChild(tspan);
			etime.appendChild(dspan);

			esingle.appendChild(content);
			esingle.appendChild(etime);

			var elist = document.getElementById('eventList');
			elist.insertBefore(esingle, elist.firstChild);
		}

	function deleteContent(obj) {
			for (var str in toDoObj) {
				var lArr = toDoObj[str];
				var oIndex = lArr.indexOf(obj);
				if (oIndex > -1) {
					lArr.splice(oIndex, 1);
				}
				if (lArr.length == 0) {
					var classname = lastClickSpan.className;
					if (classname.indexOf('haveEvent') > -1) {
						lastClickSpan.className = classname.replace('haveEvent', '');
					}
				}
			}
			localStorage.setItem(CONST_ADDED_EVENTS, JSON.stringify(toDoObj));
			freshtodayTodoCount();
			freshmonthTodoCount();
		}

	function initDaySpanHeight() {
			var container = document.getElementById('thismonth');
			var spans = container.getElementsByClassName('daySpan');
			var sLen = spans.length;
			for (var i = 0; i < sLen; i++) {
				var span = spans[i];
				span.style.height = span.style.width;
			}
		}
	
	function addEventListenersFun() {
			document.getElementById('thismonth').onclick = function(event) {
				event.preventDefault();
				dayContainerClick(event);
			};
			document.getElementById('eventAdd').onclick = eventAddClick;
		}

	function eventAddClick() {
			event.stopPropagation();
			var content1 = document.getElementById('eventName').value;
			var time1 = document.getElementById('evevtTime').value;
			if (content1 == '' || content1 == undefined || content1 == null) {
				content1 = 'task name';
			}
			var cstr = currentYear + '-' + Number(currentMonth + 1) + '-' + currentDayIndex;
			var obj = {
				time: time1,
				content: content1
			};
			if (toDoObj.hasOwnProperty(cstr)) {
				var toArr = toDoObj[cstr];
				obj['id'] = toArr.length + 1;
				toArr.push(obj);
			} else {
				obj['id'] = '1';
				toDoObj[cstr] = [obj];
				if (lastClickSpan) {
					lastClickSpan.className = lastClickSpan.className + ' haveEvent';
				}
			}

			localStorage.setItem(CONST_ADDED_EVENTS, JSON.stringify(toDoObj));
			freshmonthTodoCount();
			freshtodayTodoCount();
			addOneEventCase(obj);
			
			setTimeout(function() {
				document.getElementById('eventName').value = '';
				document.getElementById('evevtTime').value = '00:00';
			}, 100)
		}
	
	var lastClickSpan;

	function clearClickSpanStyle() {
		if (lastClickSpan != null && lastClickSpan != undefined) {
			var classname = lastClickSpan.className;
			if (classname.indexOf('selected') > -1) {
				lastClickSpan.className = classname.replace('selected', '');
			}
		}
	}

	
	function dayContainerClick(event) {
		if (event.target && event.target.nodeName == 'SPAN') {
			event.stopPropagation();
			clearClickSpanStyle();
			event.stopPropagation();
			var span = event.target;
			lastClickSpan = span;
			if (span.innerHTML != '&nbsp;') {
				span.className = span.className + ' selected';
				currentDayIndex = span.innerHTML;

				initcurrentDayEventList();
			}

            document.getElementById("datecontent").style.display='none';
			document.getElementById("datecontent_add").style.display='block';
		}
	}

	function clearEventlist() {
			document.getElementById('eventList').innerHTML = '';
			document.getElementById('selectDayCount').innerHTML = '0 task';
		}
	
	
	function freshmonthTitle() {
			document.getElementById('monthTitle').innerHTML = monthNames[lang][currentMonth];
    }
	

	function isLeapYear(year) {
		var f = new Date();
		f.setYear(year);
		f.setMonth(1);
		f.setDate(29);
		return f.getDate() == 29;
	}
	

	function getFebDayNum(year) {
			var feb = 28;
			if (isLeapYear(year) === true) {
				feb = 29;
			} else {
				feb = 28;
			}
			return feb;
	}
	
	function initCalendarDiv() {
		for (var i = 0; i < CONST_DAYS_ROWS; i++) {
			var dayDIV = document.createElement('div');
			dayDIV.className = 'dayContainer';
			for (var j = 0; j < CONST_DAYS_COLUMS; j++) {
				var daySpan = document.createElement('span');
				daySpan.className = 'daySpan';
				dayDIV.appendChild(daySpan);
				daySpan.innerHTML = '&nbsp;';
			}
			document.getElementById('thismonth').appendChild(dayDIV);
		}
	}

	function haveEvent(year, month, day) {
			var str = year + '-' + Number(month + 1) + '-' + day;
			return (toDoObj.hasOwnProperty(str) && toDoObj[str].length > 0);
		}
	

	function initDivDays(freshDate) {
		
		clearClickSpanStyle();
		freshmonthTitle();
		freshDate = new Date(currentYear, currentMonth, currentDayIndex);
		freshDate.setDate(1);
		var firstDay = freshDate.getDay(); 
		var currentDayNum = monthDays[currentMonth];
		if (currentMonth == 1) {
			currentDayNum = getFebDayNum(currentYear);
		}
		var dayIndex = 1;

		var divs = document.getElementsByClassName('dayContainer');
		var divsLen = divs.length;
		for (var i = 0; i < divsLen; i++) {
			var dayDIV = divs[i];
			var spans = dayDIV.getElementsByTagName('span');
			var spansLen = spans.length;
			for (var j = 0; j < spansLen; j++) {
				var daySpan = spans[j];
				var strCNAME = daySpan.className;
				if (strCNAME.indexOf('today') > -1) {
					strCNAME = strCNAME.replace('today', '');
				}
				if (strCNAME.indexOf('selected') > -1) {
					strCNAME = strCNAME.replace('selected', '');
				}
				if (strCNAME.indexOf('haveEvent') > -1) {
					strCNAME = strCNAME.replace('haveEvent', '');
				}
				
				daySpan.className = strCNAME;
				if (haveEvent(currentYear, currentMonth, dayIndex)) {
					daySpan.className = daySpan.className + ' haveEvent';
				}
				if (i == 0) {
					if (j < firstDay) {
						daySpan.innerHTML = '&nbsp;';
					} else {
						daySpan.innerHTML = dayIndex;
						if (dayIndex == currentDayIndex) {
							daySpan.className = daySpan.className + ' selected';
							lastClickSpan = daySpan;
						}
						dayIndex++;
					}
				} else {
					if (dayIndex < currentDayNum + 1) {
						daySpan.innerHTML = dayIndex;
						dayIndex++;
					} else {
						daySpan.innerHTML = '&nbsp;';
					}
				}
				if (currentYear == now.getFullYear() && currentMonth == now.getMonth()) {
					clearClickSpanStyle();
				}
				if (currentYear == now.getFullYear() && currentMonth == now.getMonth() && dayIndex == (now.getDate() + 1)) {

					currentDayIndex = now.getDate();
					strCNAME = daySpan.className;
					if (strCNAME.indexOf('selected') > -1) {
						daySpan.className = strCNAME.replace('selected', '');
					}
					daySpan.className = daySpan.className + ' today';
					lastClickSpan = daySpan;
				}
			}
		}
		initcurrentDayEventList();
	}
	

	function initHeadersAndAdds(id)
	{
		var mainBody = document.getElementById(id);
		
		var monthHead = document.createElement('div');
		monthHead.id = 'monthHeader';

		var mtitle = document.createElement('a');
		mtitle.id = 'monthTitle';
		mtitle.href = 'Calendar.html';
		monthHead.appendChild(mtitle);

		mainBody.appendChild(monthHead);
		
		var datecontent = document.createElement('div');
		datecontent.id = "datecontent";
		
		var weekHead = document.createElement('div');
		weekHead.className = 'weekHeader';
		var wLen = weekNames.length;
		for(var i=0;i<wLen;i++)
		{
			var weekD = document.createElement('span');
			weekD.innerHTML = weekNames[i];
			weekHead.appendChild(weekD);
		}
		//mainBody.appendChild(weekHead);
		datecontent.appendChild(weekHead);
		
		var thismonth = document.createElement('div');
		thismonth.id = 'thismonth';
		//mainBody.appendChild(thismonth);
		datecontent.appendChild(thismonth);
		mainBody.appendChild(datecontent);
		initCalendarDiv();

			
		var datecontent_add = document.createElement('div');
		datecontent_add.id = "datecontent_add";
		

		var addDiv1 = document.createElement('div');
		addDiv1.className = 'newevnets';
		var eName = document.createElement('input');
		eName.type = 'text';
		eName.placeholder = 'task name';
		eName.id = 'eventName';
		addDiv1.appendChild(eName);

		datecontent_add.appendChild(addDiv1);
		
		var addDiv2 = document.createElement('div');
		addDiv2.className = 'newevnets';


		var timeSpan_p = document.createElement('p');

		var timeSpan = document.createElement('span');
		timeSpan.className = 'iconfont icon-shijian shijianicon';
		timeSpan.innerHTML = "duetime: ";
		timeSpan_p.appendChild(timeSpan);
		var timeSel = document.createElement('input');
		timeSel.type = 'time';
		timeSel.value = '00:00';
		timeSel.id = 'evevtTime';
		timeSpan_p.appendChild(timeSel);
		//var alldayLab = document.createElement('label');
		//alldayLab.innerHTML = '全天';
		//alldayLab.id = 'alldayLab';
//		alldayLab.for('eventAllday');
		//addDiv2.appendChild(alldayLab);
		//var check = document.createElement('input');
		//check.id = 'eventAllday';
		//check.type = 'checkbox';
		//addDiv2.appendChild(check);

		addDiv2.appendChild(timeSpan_p);


		var timeSpan_p2 = document.createElement('p');

		var timeSpan1 = document.createElement('span');
		timeSpan1.className = 'iconfont icon-shijian shijianicon';
        timeSpan1.innerHTML = "priority: ";

		timeSpan_p2.appendChild(timeSpan1);

		var select1 = document.createElement('select');
		select1.id="priority_select";
		var option1 = document.createElement('option');
		option1.innerHTML = "important and urgent";

		var option2 = document.createElement('option');
		option2.innerHTML = "important but not urgent";

		var option3 = document.createElement('option');
		option3.innerHTML = "not important but urgent";
		
		var option4 = document.createElement('option');
		option4.innerHTML = "not important and not urgent";

		select1.appendChild(option1);
		select1.appendChild(option2);
		select1.appendChild(option3);
		select1.appendChild(option4);

		
		
		timeSpan_p2.appendChild(select1);
		
		
		addDiv2.appendChild(timeSpan_p2);
		
	

		datecontent_add.appendChild(addDiv2);



		var addDiv3 = document.createElement('div');
		addDiv3.className = 'newevnets';
		addDiv3.style.height="30px"
		var eaddBtn1 = document.createElement('input');
		eaddBtn1.type = 'button';
		eaddBtn1.value = 'add task';
		eaddBtn1.id = 'eventAdd';
		eaddBtn1.style.left = '2px';
		addDiv3.appendChild(eaddBtn1);
		datecontent_add.appendChild(addDiv3);


		
		var ecount = document.createElement('div');
		ecount.id = 'eventCount';
		ecount.innerHTML = '<h4 id="selectDayCount">0 task</h4>';
		datecontent_add.appendChild(ecount);
		
		var elist = document.createElement('eventList');
		elist.id = 'eventList';
		datecontent_add.appendChild(elist);


		mainBody.appendChild(datecontent_add);

		document.getElementById("datecontent").style.display='block';
		document.getElementById("datecontent_add").style.display='none';
		
		initCalendarAndEvents();
	}
	
	this.initHeadersAndAdds = initHeadersAndAdds;
}
