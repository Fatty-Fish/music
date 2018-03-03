var $ = window.Zepto;
var $scope = $(document.body);
var root = window.player;
var songList;
var controlmanager;
var audiomanager = new root.audioManager();
var processor = root.processor;
var playList = root.playList;

function bindTouch() {
    var $sliderPoint = $scope.find(".slider-point");
    var offset = $scope.find(".pro-wrapper").offset();
    var left = offset.left;
    var width = offset.width;
    $sliderPoint.on("touchstart", function() {
        processor.stop();
    }).on("touchmove", function(e) {
        var x = e.changedTouches[0].clientX;
        var percent = (x - left) / width;
        if (percent > 1 || percent < 0) {
            percent = 0;
        }
        processor.upDate(percent);
    }).on("touchend", function(e) {
        var x = e.changedTouches[0].clientX;
        var percent = (x - left) / width;
        if (percent > 1 || percent < 0) {
            percent = 0;
        }
        // processor.upDate(percent);
        processor.start(percent);
        var index = controlmanager.index;
        var curDuration = songList[index].duration;
        var curTime = curDuration * percent;
        audiomanager.jumpToPlay(curTime);
        $scope.find(".play-btn").addClass("playing");
    })
}

function bindClick() {
    $scope.on("click", ".play-btn", function() {
        if (audiomanager.status == "play") {
            audiomanager.pause();
            processor.stop();
            // $(this).removeClass("playing");
        } else {
            audiomanager.play();
            processor.start();
            // $(this).addClass("playing");
        }
        $(this).toggleClass("playing");
    })
    $scope.find(".next-btn").on("click", function() {
        var index = controlmanager.next();
        $scope.trigger("player:change", index);
    })
    $scope.find(".prev-btn").on("click", function() {
        var index = controlmanager.prev()
        $scope.trigger("player:change", index);
    })
    $scope.find(".list-btn").on("click", function() {
        playList.show(controlmanager);
    })
}

$scope.on("player:change", function(event, index, flag) {
    root.render(songList[index]);
    audiomanager.changeSource(songList[index].audio)
    if (audiomanager.status == "play" || flag) {
        processor.start();
        audiomanager.play();
    }
    processor.renderAllTime(songList[index].duration);
    processor.upDate(0);
})

function getData(url) {
    $.ajax({
        type: "GET",
        url: url,
        success: successFn
    })
}

function successFn(data) {
    songList = data;
    $scope.trigger("player:change", 0);
    bindClick();
    bindTouch();
    playList.renderPlayList(data);
    controlmanager = new root.controlManager(data.length)
}
getData("/mock/data.json")