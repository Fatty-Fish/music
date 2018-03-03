(function($, root) {
    var $scope = $(document.body);

    function renderInfo(data) {
        var html = '<div class="song-name">' + data.song + '</div>' +
            '<div class="singer-name">' + data.singer + '</div>' +
            '<div class="album-name">' + data.album + '</div>';
        $scope.find(".song-info").html(html);
    }
    root.renderInfo = renderInfo;
})(window.Zepto, window.player)