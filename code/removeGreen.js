/*
 * @Author: imc-明安瑞
 * @Date: 2024-04-25 15:04:46
 * @LastEditTime: 2024-04-26 18:20:54
 * @LastEditors: imc-Mar
 * @Description: 有问题请联系我 tel:13562850362
 * @FilePath: \js去除视频绿幕\code\removeGreen.js
 * 一川烟草，满城风絮，梅子黄时雨。
 */
// // 去掉视频中的绿幕
// // 原理：
// //     使用canvas将video的当前帧画面绘制到canvas中
// // 然后getImageData方法获取当前canvas的所有像素的rgba值组成的数组
// // 获取到的值为[r,g,b,a,r,g,b,a,...],每一组rgba的值就是一个像素，所以获得
// // 到的数组长度是canvas的像素的数量*4
// // 通过判断每一组rgb的值是否为绿幕像素，然后设置其透明通道的alpha的值为0的效果
// let video,
//     canvas,
//     ctx,
//     canvas_tmp,
//     ctx_tmp;

// function int() {
//     video = document.getElementById('video');
//     canvas = document.getElementById('output-canvas');
//     ctx = canvas.getContext('2d');
//     // 创建的canvas宽高最好与显示i图片的canvas、video宽高一致
//     canvas_tmp = document.createElement('canvas');
//     canvas_tmp.setAttribute('width', 270);
//     canvas_tmp.setAttribute('height', 480);
//     ctx_tmp = canvas_tmp.getContext('2d');
//     video.addEventListener('play', computeFrame)
// }

// //使用本地服务器看到效果，发现边缘仍有绿色像素闪烁
// //一般这种情况就可以了，使用算法进行处理，相应的资源的消耗也会提升，造成帧率下降
// // 算法进行羽化和颜色过渡


// // 羽化
// //返回canvas中第num个像素点所在的坐标 12 ->[1,12]
// function numToPoint(num, width) {
//     console.log('numToPoint');
//     let col = num % width;
//     let row = Math.floor(num / width);
//     row = col === 0 ? row : row + 1;
//     col = col === 0 ? width : col;
//     return [row, col];
// }

// // 返回canvas中所在的坐标的num(index+1)值 [1,12]->12
// function pointToNum(point, width) {
//     console.log('pointToNum');
//     let [row, col] = point;
//     return (row - 1) * width + col;
// }

// // 获取输入的坐标周围1像素内的所有像素的坐标组成的数组 [1,1] ->[[1,2],[2,1],[2,2]]
// function getAroundPoint(point, width, height, area) {
//     let [row, col] = point;
//     let allAround = [];
//     if (row > height || col > width || row < 0 || col < 0) {
//         return allAround;
//     }

//     for (let i = 0; i < area; i++) {
//         let pRow = row - 1 + i;
//         for (let j = 0; j < area; j++) {
//             let pCol = col - 1 + j;
//             if (i === area % 2 && j === area % 2) {
//                 continue;
//             }
//             allAround.push([pRow, pCol]);;
//         }
//     }

//     return allAround.filter(([iRow, iCol]) => {
//         return (iRow > 0 && iCol > 0) && (iRow <= height && iCol <= width);
//     })
// }


// function computeFrame() {
//     if (video) {
//         if (video.paused || video.ended) {
//             return
//         }
//     }
//     // 如果视频比例和canvas比例不正确可能会出现显示形变，调整除的值进行比例调整
//     ctx_tmp.drawImage(video, 0, 0, video.clientWidth / 1, video.clientHeight / 1);
//     // 获取到绘制的canvas的所有像素rgba值组成的数组
//     let frame = ctx_tmp.getImageData(0, 0, video.clientWidth, video.clientHeight);

//     // ----- emergence ----------
//     const height = frame.height;
//     const width = frame.width;
//     // 共有多少像素点
//     const pointLens = frame.data.length / 4;

//     for (let i = 0; i < pointLens; i++) {
//         let r = frame.data[i * 4];
//         let g = frame.data[i * 4 + 1];
//         let b = frame.data[i * 4 + 2];
//         // 判断如果rgb值在这个范围内则是绿幕背景，设置alpha值为0
//         // 同理不同颜色的背景调整rgb的判断范围即可
//         if (r < 150 && g > 200 && b < 150) {
//             frame.data[i * 4 + 3] = 0;
//         }
//     }
//     const tempData = [...frame.data]
//     for (let i = 0; i < pointLens; i++) {
//         if (frame.data[i * 4 + 3] === 0) {
//             continue
//         }
//         const currentPoint = numToPoint(i + 1, width);
//         const arroundPoint = getAroundPoint(currentPoint, width, height, 3);
//         let opNum = 0;
//         let rSum = 0;
//         let gSum = 0;
//         let bSum = 0;
//         arroundPoint.forEach((position) => {
//             const index = pointToNum(position, width);
//             rSum += tempData[(index - 1) * 4];
//             gSum += tempData[(index - 1) * 4 + 1];
//             bSum += tempData[(index - 1) * 4 + 2];
//             if (tempData[(index - 1) * 4 + 3] != 255) {
//                 opNum++;
//             }
//         })
//         let alpha = (255 / arroundPoint.length) * (arroundPoint.length - opNum);
//         if (alpha !== 255) {
//             frame.data[i * 4] = parseInt(rSum / arroundPoint.length);
//             frame.data[i * 4 + 1] = parseInt(gSum / arroundPoint.length);
//             frame.data[i * 4 + 2] = parseInt(bSum / arroundPoint.length);
//             frame.data[i * 4 + 3] = parseInt(alpha);
//         }
//     }
//     // 重新绘制到canvas中显示
//     ctx.putImageData(frame, 0, 0);
//     // 递归调用
//     setTimeout(computeFrame, 0);
// }



// document.addEventListener('DOMContentLoaded', int);
// 新增羽化和颜色过渡
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
function numToPoint(num, width) {
    let col = num % width;
    let row = Math.floor(num / width);
    row = col === 0 ? row : row + 1;
    col = col === 0 ? width : col;
    return [row, col];
}
function pointToNum(point, width) {
    let [row, col] = point;
    return (row - 1) * width + col
}
function getAroundPoint(point, width, height, area) {
    let [row, col] = point;
    let allAround = [];
    if (row > height || col > width || row < 0 || col < 0) return allAround;
    for (let i = 0; i < area; i++) {
        let pRow = row - 1 + i;
        for (let j = 0; j < area; j++) {
            let pCol = col - 1 + j;
            if (i === area % 2 && j === area % 2) continue;
            allAround.push([pRow, pCol]);
        }
    }
    return allAround.filter(([iRow, iCol]) => {
        return (iRow > 0 && iCol > 0) && (iRow <= height && iCol <= width);
    })
}
function computeFrame() {
    if (video) {
        if (video.paused || video.ended) return;
    }
    ctx_tmp.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
    let frame = ctx_tmp.getImageData(0, 0, video.clientWidth, video.clientHeight);
    //----- emergence ----------
    const height = frame.height;
    const width = frame.width;
    const pointLens = frame.data.length / 4;
    for (let i = 0; i < pointLens; i++) {
        let r = frame.data[i * 4];
        let g = frame.data[i * 4 + 1];
        let b = frame.data[i * 4 + 2];
        if (r < 150 && g > 200 && b < 150) {
            frame.data[i * 4 + 3] = 0;
        }
    }
    const tempData = [...frame.data]
    for (let i = 0; i < pointLens; i++) {
        if (frame.data[i * 4 + 3] === 0) continue
        const currentPoint = numToPoint(i + 1, width);
        const arroundPoint = getAroundPoint(currentPoint, width, height, 3);
        let opNum = 0;
        let rSum = 0;
        let gSum = 0;
        let bSum = 0;
        arroundPoint.forEach((position) => {
            const index = pointToNum(position, width);
            rSum = rSum + tempData[(index - 1) * 4];
            gSum = gSum + tempData[(index - 1) * 4 + 1];
            bSum = bSum + tempData[(index - 1) * 4 + 2];
            if (tempData[(index - 1) * 4 + 3] !== 255) opNum++;
        })
        let alpha = (255 / arroundPoint.length) * (arroundPoint.length - opNum);
        if (alpha !== 255) {
            // debugger
            frame.data[i * 4] = parseInt(rSum / arroundPoint.length);
            frame.data[i * 4 + 1] = parseInt(gSum / arroundPoint.length);
            frame.data[i * 4 + 2] = parseInt(bSum / arroundPoint.length);
            frame.data[i * 4 + 3] = parseInt(alpha);
        }
    }
    //------------------------
    ctx.putImageData(frame, 0, 0);
    setTimeout(computeFrame, 0);
}
document.addEventListener("DOMContentLoaded", () => {
    init();
});