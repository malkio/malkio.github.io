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
		workThumbnail +=		"<h4>"+data.title+"</h4>";
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

	function initialize(data) {
		buildWorkSection(data);
		buildExperimentalWorkSection(data);
		buildBackgroundSection(data);
		//buildFooterRecentWork(data);
	}


}(jQuery, window, document, undefined));
