// processor2.js
let video, canvas, ctx, canvas_tmp, ctx_tmp;
function init() {
    video = document.getElementById('video');
    canvas = document.getElementById('output-canvas');
    ctx = canvas.getContext('2d');
    // 创建的canvas宽高最好与显示图片的canvas、video宽高一致
    canvas_tmp = document.createElement('canvas');
    canvas_tmp.setAttribute('width', 270);
    canvas_tmp.setAttribute('height', 480);
    ctx_tmp = canvas_tmp.getContext('2d');
    video.addEventListener('play', computeFrame);
}
function computeFrame() {
    if (video) {
        if (video.paused || video.ended) return;
    }
    // 如果视频比例和canvas比例不正确可能会出现显示形变， 调整除的值进行比例调整
    ctx_tmp.drawImage(video, 0, 0, video.clientWidth / 1, video.clientHeight / 1);
    // 获取到绘制的canvas的所有像素rgba值组成的数组
    let frame = ctx_tmp.getImageData(0, 0, video.clientWidth, video.clientHeight);
    // 共有多少像素点
    const pointLens = frame.data.length / 4;
    for (let i = 0; i < pointLens; i++) {
        let r = frame.data[i * 4];
        let g = frame.data[i * 4 + 1];
        let b = frame.data[i * 4 + 2];
        // 判断如果rgb值在这个范围内则是绿幕背景，设置alpha值为0 
        // 同理不同颜色的背景调整rgb的判断范围即可
        if (r < 100 && g > 120 && b < 200) {
            frame.data[i * 4 + 3] = 0;
        }
    }
    // 重新绘制到canvas中显示
    ctx.putImageData(frame, 0, 0);
    // 递归调用
    setTimeout(computeFrame, 0);
}
document.addEventListener("DOMContentLoaded", () => {
    init();
});