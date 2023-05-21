window.addEventListener("load", () => {
    // ビデオを取得
    const video = document.createElement("video");
    video.src = "YOASOBI「アイドル」2.mp4"
    // ビデオをvideoContainerに追加
    const videoContainer = document.getElementById("videoContainer");
    videoContainer.appendChild(video);

    // 再生、停止ボタン
    const play = document.getElementById("play");
    const pause = document.getElementById("pause");
    const stop = document.getElementById("stop");

    //初期ポイント配列
    window.currentPoints = [100, 50, 25, 75, 0];
    window.currentIndex = 0;

    //再生中か否かの判定
    window.playing = false;
    // 再生機能
    play.addEventListener("click", () => {
        video.play();
        //タイムアウトのクリア
        if (pointChangeTimeoutId) {
            clearTimeout(pointChangeTimeoutId);
        }
        //ポイント割り当ての変更
        const pointSequence = [[50, 75, 25, 100, 0],
        [25, 75, 100, 50, 0],
        [0, 25, 75, 50, 100],
        [0, 25, 100, 50, 75],
        [50, 100, 25, 75, 0]
        ];
        //変更のタイミング
        const timingArray = [18500, 23000, 13700, 12300, 11500];
        //タイミング変更機能実装
        window.currentIndex = 0; // 追加：再生が開始されるたびに currentIndex をリセット
        changePoints(pointSequence, timingArray);
        //再生中
        window.playing = true;
    });

    // 一時停止機能
    pause.addEventListener("click", () => {
        video.pause();
        //停止中
        playing = false;
        clearTimeout(pointChangeTimeoutId);
    });
    // 停止（巻き戻し）機能
    stop.addEventListener("click", () => {
        video.pause();
        // 曲の先頭に再生開始位置を戻す
        video.currentTime = 0;
        //停止中
        playing = false;
        //スコアのリセット
        window.score = 0;
        //スコア表示もリセット
        $("#score").html(score);
        clearTimeout(pointChangeTimeoutId);
    });
    //再生終了時にカウントもストップ
    video.addEventListener("ended", () => {
        //停止中
        playing = false;
    });
});
//初期の得点設定
window.score = 0;
//let playing = false;
let pointChangeTimeoutId = null;

//ポイント変更関数
function changePoints(pointsArray, timingArray, index = 0) {
    if (index < timingArray.length) {
        pointChangeTimeoutId = setTimeout(() => {
            window.currentPoints = pointsArray[index];
            window.currentIndex = (window.currentIndex + 1) % pointsArray.length;
            console.log('Points changed to:', window.currentPoints);
            changePoints(pointsArray, timingArray, index + 1);
        }, timingArray[index]);
    }
}
//カーソルがhoverしているときに加点、外れたときには点数が入らないようにする設定
document.querySelectorAll(".givePoints").forEach((element, index) => {
    element.addEventListener("mouseover", function () {
        console.log("givePoints");
        if (playing) {
            const points = window.currentPoints[(window.currentIndex + index) % window.currentPoints.length];
            //timeoutIdがnullの時に加点する

            if (!window.timeoutId) {
                go(points);
                startIncreasingPoints(points);
            }
        }
    });
    element.addEventListener("mouseout", stopIncreasingPoints);
});

//１秒毎に何点加点されたか表示する設定

function go(points) {
    if (playing) {
        const currentPoints = points;
        window.score += currentPoints;
        $("#score").html(window.score);
        $("#tag").text("+" + points);
        console.log("Adding points:", points, "Total score:", window.score);
        // 1秒後に次の go() 関数を呼び出す
        window.timeoutId = setTimeout(() => go(points), 1000)
    }
    $("#tag").fadeIn({
        duration: 700,
        easing: "linear",
        step: function (now, fx) {
            $(this).css("top", -55 * now + "px");
        }
    }).fadeOut({
        duration: 300,
        step: function (now, fx) {
            $(this).css("top", -55 * (2 - now) + "px");
        }
    });

}
//ポイントの増加停止設定
function stopIncreasingPoints() {
    clearTimeout(window.timeoutId);
    window.timeoutId = null;
}

//1秒毎に割り振られたポイントを追加、表示する設定
function startIncreasingPoints(points) {
    if (!window.timeoutId) {
        window.intervalId = setInterval(function () {
            console.log("startincreasingpoints");
            window.score += points;
            $("#score").html(window.score);
            $("#tag").text("+" + points);
        }, 1000);
    }
}