<template>
  <!-- 封装的加载动画 -->
  <div>
<div class="cont" v-if="isShow">
  <div class="line">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div class="circle"></div>
  </div>
  </div>
</template>

<script>
export default {
    name:"LoadingView",
    props:["isShow"]
}
</script>

<style scoped>
* {
		    margin: 0;
		    padding: 0;
		}


		body {
            width: 30px;
            height: 30px;
		    background: #fff;
		}


		.cont {
		    width: 30px;
		    height: 30px;
		    position: relative;
		    /* margin: 100px auto; */
		}
		.line div {
		    position: absolute;
		    left: 0;
		    top: 0;
		    width: 3px;
		    height: 30px;
		}


		.line div:before, .line div:after {
		    content: '';
		    display: block;
		    height: 50%;
		    background: #009cda;
		    border-radius: 5px;
		}

		/*设置组成环形加载的竖条的旋转角度*/
		.line div:nth-child(2) {
		    transform: rotate(45deg);
		}


		.line div:nth-child(3) {
		    transform: rotate(90deg);
		}


		.line div:nth-child(4) {
		    transform: rotate(135deg);
		}


		.line div:nth-child(5) {
		    transform: rotate(180deg);
		}

		.line div:nth-child(6) {
		    transform: rotate(225deg);
		}
		.line div:nth-child(7) {
		    transform: rotate(270deg);
		}


		.line div:nth-child(8) {
		    transform: rotate(315deg);
		}

/* 
		.line div:nth-child(9) {
		    transform: rotate(120deg);
		} */

/* 
		.line div:nth-child(10) {
		    transform: rotate(135deg);
		}

		.line div:nth-child(11) {
		    transform: rotate(150deg);
		}
		.line div:nth-child(12) {
		    transform: rotate(165deg);
		} */

		.circle {
		    position: absolute;
		    left: -15%;
		    top: 35%;
		    width: 18px;
		    height: 18px;
		    margin: -4px 0 0 -3px;
		    background: #fff;
		    border-radius: 100%;
		}

		/*定义动画*/
		@keyframes load {
		    0% {
		        opacity: 0;
		    }
		    100% {
		        opacity: 1;
		    }
		}
		/*设置动画以及动画延迟 */
		.line div:nth-child(1):before {
		    animation: load 1.2s linear 0s infinite;
		}
		/*依次从第一个div的:before至最后一个div的:before的动画延迟为每个增加0.05s,此处省略雷同代码*/
		.line div:nth-child(2):before {
		    animation: load 1.2s linear 0.05s infinite;
		}

		.line div:nth-child(3):before {
		    animation: load 1.2s linear 0.1s infinite;
		}

		.line div:nth-child(4):before {
		    animation: load 1.2s linear 0.15s infinite;
		}

		.line div:nth-child(5):before {
		    animation: load 1.2s linear 0.2s infinite;
		}

		.line div:nth-child(6):before {
		    animation: load 1.2s linear 0.25s infinite;
		}

		.line div:nth-child(7):before {
		    animation: load 1.2s linear 0.3s infinite;
		}

		.line div:nth-child(8):before {
		    animation: load 1.2s linear 0.35s infinite;
		}

		.line div:nth-child(9):before {
		    animation: load 1.2s linear 0.4s infinite;
		}

		.line div:nth-child(10):before {
		    animation: load 1.2s linear 0.45s infinite;
		}

		.line div:nth-child(11):before {
		    animation: load 1.2s linear 0.5s infinite;
		}

		.line div:nth-child(12):before {
		    animation: load 1.2s linear 0.55s infinite;
		}

		.line div:nth-child(1):after {
		    animation: load 1.2s linear 0.6s infinite;
		}
		/*依次从第一个div的:after至最后一个div的:after的动画延迟为每个增加0.05s,此处省略雷同代码*/
		.line div:nth-child(2):after {
		    animation: load 1.2s linear 0.65s infinite;
		}

		.line div:nth-child(3):after {
		    animation: load 1.2s linear 0.7s infinite;
		}

		.line div:nth-child(4):after {
		    animation: load 1.2s linear 0.75s infinite;
		}

		.line div:nth-child(5):after {
		    animation: load 1.2s linear 0.8s infinite;
		}

		.line div:nth-child(6):after {
		    animation: load 1.2s linear 0.85s infinite;
		}

		.line div:nth-child(7):after {
		    animation: load 1.2s linear 0.9s infinite;
		}

		.line div:nth-child(8):after {
		    animation: load 1.2s linear 0.95s infinite;
		}

		.line div:nth-child(9):after {
		    animation: load 1.2s linear 1.0s infinite;
		}

		.line div:nth-child(10):after {
		    animation: load 1.2s linear 1.05s infinite;
		}

		.line div:nth-child(11):after {
		    animation: load 1.2s linear 1.1s infinite;
		}

		.line div:nth-child(12):after {
		    animation: load 1.2s linear 1.15s infinite;
		}
</style>