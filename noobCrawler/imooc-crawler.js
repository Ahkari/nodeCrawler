var http = require('http') ;
var url = 'http://www.imooc.com/learn/348' ;
var cheerio = require('cheerio') ;

http.get(url,function(res){
	var html = '' ;
	res.on('data',function(data){
		html += data ;
	}) ;
	res.on('end',function(){
		var courseData = filterHtml(html) ;

		printCourseInfo(courseData) ;
	}) ;
}).on('error',function(){
	console.log('获取页面出错') ;
}) ;

function filterHtml(html){
	var $ = cheerio.load(html) ;
	var chapters = $('.chapter') ;

	// [{
	// 	chapterTitle: '',
	// 	videos: [
	// 		title: '',
	// 		id: ''
	// 	]
	// }]

	var courseData = [] ;
	chapters.each(function(item){
		var chapter = $(this) ;
		var chapterTitle = chapter.find('strong').text() ;
		var videos = chapter.find('.video').children('li') ;
		var chapterData = {
			chapterTitle : chapterTitle ,
			videos: [],
		} ;
		videos.each(function(item,ele){
			var video = $(ele).find('.studyvideo') ;
			var videoTitle = video.text() ;
			var id = video.attr('href').split('video/')[1] ;

			chapterData.videos.push({
				title: videoTitle,
				id: id
			}) ;
		}) ;
		courseData.push(chapterData) ;
	}) ;

	return courseData ;

}

function printCourseInfo(courseData){
	courseData.forEach(function(item,index){
		var chapterTitle = item.chapterTitle ;
		console.log(chapterTitle+'\n') ;
		item.videos.forEach(function(video,index){
			console.log('  ['+video.id+']'+video.title+'\n') ;
		}) ;
	}) ;

}



