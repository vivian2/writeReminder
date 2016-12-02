/*
  格式形如：{
              2013:{
                    4:{
                       13:{
                            settime:2013-04-13,
                            deadline:2013-06-16,
                            objs:...
                        }
                    }
                }
            }
*/
var getObjs = function(data){
	var items = {};
    data.forEach(function(item,i){
    	var date = new Date(data[i].settime),
    	    year = date.getFullYear(),
    	    month = date.getMonth()+1,
    	    month = month < 10 ? '0'+month :month,
    	    day = date.getDate()< 10 ? '0'+ date.getDate() : date.getDate(),
    	    objs = data[i].objs;
    	items[year] = items[year] || {};
    	items[year][month] = items[year][month] || {};
    	items[year][month][day] = items[year][month][day] || []; 
        items[year][month][day].push(item)
    })
    return items
}
//格式化时间
var	getDate=function(date){
        var y = date.getFullYear(),
            m = date.getMonth()+1,
            m = m <10 ? '0'+ m : m,
            d = date.getDate() < 10 ? '0'+ date.getDate() : date.getDate();
      return  y+"-"+m+"-"+d
}
//滑动条
var scrollBar = function(items){
	for(var i in items){
		var months = items[i];
		var scrollBar_year= $("<div class='scrollBar_year'>");
		scrollBar_year.addClass("scrollBar_year_"+i).text(i+"年");
		for(var i in months){
         	var scrollBar_month= $("<div class='scrollBar_month'>");
            scrollBar_month.addClass("scrollBar_month_"+i).text(i+"月");
            scrollBar_month.appendTo(scrollBar_year)
            scrollBar_year.prependTo($('.scrollBar'))
		}
	}
}
//内容条
var contentBox = function(items){
	for(var i in items){
		var months = items[i];
		var contentBox_year = $("<div class='contentBox_year'>");
		contentBox_year.addClass("contentBox_year_"+i).text(i+"年");
		for(var i in months){
			var days = months[i]
         	var contentBox_month= $("<div class='contentBox_month'>");
            contentBox_month.addClass("contentBox_month_"+i).text(i+"月");
              for(var day in days){
              	var obj = days[day];
              	var contentBox_day= $("<div class='contentBox_day'>");
                    contentBox_day.addClass("contentBox_day_"+day).text(day+"日");
                var contentBox_item= $("<div class='contentBox_item'>");
                var del = $("<span class='del'>")
                del.appendTo(contentBox_item)
                var ul = $('<ul>');
                for(var objPart in obj){
                	var smallItem =obj[objPart].objs;
                	var deadline = obj[objPart].deadline;
                	$('.create').text(getDate(new Date()))
                	var span = $('<span>').text("在"+deadline+"之前完成");                	
                	if(smallItem){
                         for (var j = 0,l=smallItem.length; j < l; j++) {
                         	 var input = $("<input type='checkbox'>");
                         	 var spanItem =$("<span>").text(smallItem[j]);
                	         var li = $('<li>');
                	         input.appendTo(li)
                	         spanItem.appendTo(li)
                	         li.appendTo(ul)
                          }
                	}
                }
                ul.appendTo(contentBox_item)
                span.appendTo(contentBox_item)
                contentBox_item.appendTo(contentBox_day)
                contentBox_day.appendTo(contentBox_month)
              }
            contentBox_month.appendTo(contentBox_year)
		}
	 contentBox_year.prependTo($('.contentBox'))
	}
}
//滑动条点击
	$('.scrollBar').click(function(e){
		var e = e || window.event;
		var target = e.target || e.srcElement;
        var className = $(target).attr('class');
        var re = className.replace(/scrollBar/g,'contentBox').substring(16).trim();
        $(target).css('color','#fff');
        if($(target).parent().attr('class').indexOf('scrollBar ') != '-1'){
        	var classNa = '.'+re;
        }else{
            var parentCla = $(target).parent().attr('class').replace(/scrollBar/g,'contentBox').substring(16).trim();
            var classNa ='.'+parentCla+' .'+re;
        }
        var top1 = $(classNa).offset().top;
        $(window).scrollTop(top1-20)
	})
//添加内容
var addItems = function(){
    $('.add').click(function(){
	    var text = $('.add_objs input').val();
	    var li = $('<li>').text(text);
	    li.appendTo($('.show_objs ul'))
    })
    var date = new ShowDate(); 
    $('.deadline input').focus(function(){
  	    $('.deadline .container').css('display','block')  
    })
    $('.deadline .container').click(function(e){
	    $('.deadline .container').css('display','none') 
    })
}
//筛选获取今天创建的item
var filter = function(data){
   for(var i in data){
   	var time = data[i].settime
   	var today = getDate(new Date())
   	if(time == today){
   		return i
   	}else{
   		return -1
   	}
   }
}
//创建事务
var createItem = function(){
	$('.createObjs button').click(function(){
		var item ={};
		item.objs=[];
	    item.settime =  getDate(new Date());      
        item.deadline = $('.deadline input').val();
		var lis= $('.show_objs li');
		for (var i = 0; i < lis.length; i++) {
			item.objs.push($(lis[i]).text())
		}
		createItems(item)
		delItem()
        $('.show_objs ul').empty()
	})
  	getObjs(data)
}
var createItems = function(item){
	var year = new Date(item.settime).getFullYear();
	var month = new Date(item.settime).getMonth()+1;
	var date = new Date(item.settime).getDate();
	var scrollBar_year= $("<div class='scrollBar_year'>");
	scrollBar_year.addClass("scrollBar_year_"+year).text(year+"年");
    var scrollBar_month= $("<div class='scrollBar_month'>");
    scrollBar_month.addClass("scrollBar_month_"+month).text(month+"月");
    scrollBar_month.appendTo(scrollBar_year)
    scrollBar_year.prependTo($('.scrollBar'))
	var contentBox_year = $("<div class='contentBox_year'>");
	contentBox_year.addClass("contentBox_year_"+year).text(year+"年");
	var contentBox_month= $("<div class='contentBox_month'>");
    contentBox_month.addClass("contentBox_month_"+month).text(month+"月");
    var contentBox_day= $("<div class='contentBox_day'>");
         contentBox_day.addClass("contentBox_day_"+date).text(date+"日");
     var contentBox_item= $("<div class='contentBox_item'>");
     var del = $("<span class='del'>")
     del.appendTo(contentBox_item)
     var ul = $('<ul>');
      var smallItem = item.objs;
      var deadline = item.deadline;
      var span = $('<span>').text("在"+deadline+"之前完成");                	
      if(smallItem){
              for (var j = 0,l=smallItem.length; j < l; j++) {
                var input = $("<input type='checkbox'>");
                var spanItem =$("<span>").text(smallItem[j]);
               var li = $('<li>');
               input.appendTo(li)
               spanItem.appendTo(li)
               li.appendTo(ul)
               }
      }
     ul.appendTo(contentBox_item)
     span.appendTo(contentBox_item)
     contentBox_item.appendTo(contentBox_day)
     contentBox_day.appendTo(contentBox_month)
     contentBox_month.appendTo(contentBox_year)
     contentBox_year.prependTo($('.contentBox'))
}
//跟随内容
var delItem = function(){
	$('.del').click(function(e){
		var e = e || window.event;
		var target = e.target || e.srcElement;
		$(target).parent().remove()
	})
}
var check = function(){
	$('.contentBox_item ul input').click(function(e){
		var e = e || window.event;
		var target = e.target || e.srcElement;
		if($(target).prop('checked')){
			$(target).parent().addClass('isDone')
		}else{
			$(target).parent().removeClass('isDone')
		}
	})
}
$(document).ready(function(){
	$(window).scroll(function(){
	  $('.scrollBar .scrollBar_year').css('color','#000');
	  $('.scrollBar_year .scrollBar_month').css('color','#000');
	  var scrollTop = $(this).scrollTop();
	  var arr = [],aimEle;
	  for (var i = 0; i <  $('.contentBox_month').length; i++) {
	  	var top = $($('.contentBox_month')[i]).offset().top;
	  	arr.push(top)
	  }
	  for (var i = 0; i < arr.length; i++) {
	  	if(arr[i]- scrollTop >0 && arr[i]- scrollTop <150){
	  		$($('.scrollBar_month')[i]).css('color','#fff')
	  	}
	  }
	  var top = scrollTop;	 
		if( scrollTop>300){
			$('.scrollBar').addClass('scrollBarfixed');
		}else{
			$('.scrollBar').removeClass('scrollBarfixed')
		}
	})
	var items = getObjs(data);
	scrollBar(items)
    contentBox(items)
	addItems()
	createItem()
	delItem()
	check()
})


