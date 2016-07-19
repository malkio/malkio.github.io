// TODO: turn this into webpack
// TODO: fix text sizes on header, make it larger
// TODO: add list of works
// TODO: add ajax popout overlay on click
// TODO: z-index position absolute all links in landing

(function($, window, document, undefined){

	var isDevelopment = window.location.hostname === 'localhost';
	var source = "data.json";
	var imageLocation = "./assets/images/";

	$.ajax({
		url: source,
		cache: false,
		success: function(data){
			if(typeof data === 'object')
			initialize(data);

		}
	});


	function toggleCoggle(){
		$(".btn-toggle-coggle").on('click', function(e){
			e.preventDefault();
			if( $('#coggle-background').hasClass('hidden') ) {
				$("#coggle-background").removeClass('hidden');
				$('#simple-background').addClass('hidden');
			}
			else {
				$("#coggle-background").addClass('hidden');
				$('#simple-background').removeClass('hidden');
			}
		});
	}
	toggleCoggle();


	function domWorkThumbnail(data, isHeader){

		var workThumbnail = "<div class='col-sm-6 col-xs-6 col-md-3 work-item'>";
		workThumbnail +=  "<a href='"+data.url+"'>";
		workThumbnail +=  	"<img src='"+imageLocation + data.img+"' alt='' class='img-responsive'>";
		workThumbnail += 	"<div class='overlay'>";
		workThumbnail +=		"<h5>"+data.title+"</h5>";
		workThumbnail +=	"</div>";
		workThumbnail += "</a>";
		workThumbnail += "</div>";
		return workThumbnail;
	}

	// BUILD WORK
	function buildWorkSection(data) {

		var workData = data.works;
		var $works = $("#works");

		$.each(workData.categories, function(catIndex, category){
			var $workList = $("<div class='row work-list'></div>");
			var $footerRecentWorks = $("list-recent-works > ul");
			// Add next button
			//$work-list.append("<a href='#' class='btn-work-next'><i class='glyphicon glyphicon-chevron-right'></i></a>");
			$.each(category.list, function(workIndex, work){
				if(workIndex > 3) return false;
				var _workThumbnail = domWorkThumbnail(work);
				$workList.append(_workThumbnail);
			});
			//$workList.prepend( domWorkThumbnail(category, false) );
			$works.find('.container').append($workList);
		});
	}

	// BUILD BACKGROUND
	function buildBackgroundSection(data) {
		var backgroundData = data.background;
		var $background = $("#simple-background");
		$.each(backgroundData.categories, function(catIndex, category){
			var $categories = $("<div class='row'><div class='col-sm-3'><h4>"+category.name+"</h4></div><div class='col-sm-9 background-list'></div></div>");

			$.each(category.list, function(backgroundIndex, background){
				var backgroundSpan = "<span class='label label-default'>"+background+"</span>";
				$categories.find('.background-list').append(backgroundSpan);
			});
			$background.find('.container').append($categories);
		});
	}

	function buildFooterRecentWork(data) {
		var workData = data.works;
		var $listContainer = $(".list-recent-works");
		var $list = $("<ul></ul");
		$.each( workData.categories[0].list, function(i, work){
			$list.append("<li><a href='"+work.url+"'>"+work.title+"</a></li>");
		});
		$listContainer.append($list);
	}


	function buildExperimentalWorkSection(data){
		var workDataList = data["experimental-works"].list;
		var container = $('#experimental-works').find('.list-group');
		for(var i=0; i<workDataList.length; i++){
			container.append('<a href="'+workDataList[i].link+'" class="list-group-item">'+workDataList[i].title+'<br><small>'+workDataList[i].description+'</small> <span class="badge">View</span></a>');
		}
	}

	function buildExperimentalWorkThumbnailSection(data){
		var workDataList = data["experimental-works"]["thumbnail-list"];
		var container = $('#experimental-works .list-thumbnail');
		for(var i = 0; i<workDataList.length; i++){
			console.log(workDataList);
			var b = '<div class="col-md-6"> <div class="card"> <div class="card-image"> <img src="'+imageLocation + workDataList[i].img+'" alt="" class="img-responsive"></div>'+ '<div class="card-content">'+ '<p>'+workDataList[i].description +'</p>'+
					'<div class="card-link">'+
							'<a href="'+workDataList[i].link+'" class="icon-13 github" title="GitHub"><svg viewBox="0 0 512 512"><path d="M256 70.7c-102.6 0-185.9 83.2-185.9 185.9 0 82.1 53.3 151.8 127.1 176.4 9.3 1.7 12.3-4 12.3-8.9V389.4c-51.7 11.3-62.5-21.9-62.5-21.9 -8.4-21.5-20.6-27.2-20.6-27.2 -16.9-11.5 1.3-11.3 1.3-11.3 18.7 1.3 28.5 19.2 28.5 19.2 16.6 28.4 43.5 20.2 54.1 15.4 1.7-12 6.5-20.2 11.8-24.9 -41.3-4.7-84.7-20.6-84.7-91.9 0-20.3 7.3-36.9 19.2-49.9 -1.9-4.7-8.3-23.6 1.8-49.2 0 0 15.6-5 51.1 19.1 14.8-4.1 30.7-6.2 46.5-6.3 15.8 0.1 31.7 2.1 46.6 6.3 35.5-24 51.1-19.1 51.1-19.1 10.1 25.6 3.8 44.5 1.8 49.2 11.9 13 19.1 29.6 19.1 49.9 0 71.4-43.5 87.1-84.9 91.7 6.7 5.8 12.8 17.1 12.8 34.4 0 24.9 0 44.9 0 51 0 4.9 3 10.7 12.4 8.9 73.8-24.6 127-94.3 127-176.4C441.9 153.9 358.6 70.7 256 70.7z"/></svg><em></em></a><!--[if lt IE 9]><em>GitHub</em><![endif]-->'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>';
			container.append(b);
		}
	}

	function initialize(data) {
		buildWorkSection(data);
		buildExperimentalWorkSection(data);
		buildExperimentalWorkThumbnailSection(data);
		buildBackgroundSection(data);
		//buildFooterRecentWork(data);
	}


}(jQuery, window, document, undefined));
