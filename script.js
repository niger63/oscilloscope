"use strict"




let canvas1 = document.getElementById("cvs1")
let context1 = canvas1.getContext("2d")

let WIDTH1 = canvas1.width
let HEIGHT1 = canvas1.height

context1.fillStyle = "#000000"
context1.fillRect(0,0,WIDTH1 ,HEIGHT1)



function update1(){
	context1.fillStyle = "#000000"
	context1.fillRect(0,0,WIDTH1 ,HEIGHT1)
	let sz = slider[1]-slider[0]+1
	
	let bin1 = (WIDTH1)/(sz-1)
	context1.strokeStyle = "#0000ff"
	context1.lineWidth = 2
	context1.beginPath()     
	context1.moveTo(0, HEIGHT1 / 2 - data[slider[0]]*scale)
	for(let i = slider[0]+1; i <= slider[1]; i++){
		context1.lineTo(bin1*(i-slider[0]), HEIGHT1 / 2 - data[i]*scale)
	}
	context1.stroke()
	
}










let canvas = document.getElementById("cvs")
let context = canvas.getContext("2d")

let WIDTH = canvas.width
let HEIGHT = canvas.height



let slider = [3,7]
let data = new Array(100).fill(0)
data[0] = 10
data[37] = 20
data[67] = 30


let scale = HEIGHT/2
let n = 100
let bin;

function update(){
	context.fillStyle = "#000000"
	context.fillRect(0,0,canvas.width ,canvas.height)
	bin = (WIDTH)/(n-1)
	context.strokeStyle = "#0000ff"
	context.lineWidth = 2
	context.beginPath()
	context.moveTo(0, HEIGHT / 2 - data[0]*scale)
	for(let i = 1; i < n; i++){
		context.lineTo(bin*i, HEIGHT / 2 - data[i]*scale)
	}
	context.stroke()
	
	context.fillStyle = "#00ff00"
	context.fillRect(bin*slider[0] - 1,0,2 ,canvas.height)
	context.fillRect(bin*slider[1] - 1,0,2 ,canvas.height)
	context.fillStyle = "#ffffff3f"
	context.fillRect(bin*slider[0],0,bin*(slider[1] - slider[0]) ,canvas.height)
	update1()
}
update()

let margin = 50;
let touching_slider = -1;
function onMouseDown(ev){
	let x = ev.offsetX;
	let y = ev.offsetY;
	let touch1 = false;
	let touch2 = false;
	if(x < bin*slider[0] + margin && x > bin*slider[0] - margin){
		touch1 = true;
	}
	if(x < bin*slider[1] + margin && x > bin*slider[1] - margin){
		touch2 = true;
	}
	if(touch1 && touch2){
		if (Math.abs(x - bin*slider[0]) > Math.abs(x - bin*slider[1])){
			touch1 = false;
		}else{
			touch2 = false;
		}
		
	}
	touching_slider = -1;
	if(touch1){
		touching_slider = 0;
	}
	if(touch2){
		touching_slider = 1;
	}
	//alert(touching_slider)
}
function onMouseMove(ev){
	let x = ev.offsetX;
	let y = ev.offsetY;
	if (touching_slider !== -1){
		let bin_id = Math.round(x/bin);
		if (touching_slider == 1 && bin_id <= slider[0]){
			bin_id = slider[0]+1;
		}
		if (touching_slider == 0 && bin_id >= slider[1]){
			bin_id = slider[1]-1;
		}
		if(bin_id>=n){
			bin_id = n-1;
		}
		if(bin_id<0){
			bin_id = 0;
		}
		if(bin_id !== slider[touching_slider]){
			slider[touching_slider] = bin_id
			update()
			
		}
		
	}
	
}
function onMouseUp(ev){
	touching_slider = -1;
	
}
canvas.addEventListener("pointerdown",onMouseDown)
canvas.addEventListener("pointermove",onMouseMove)
//canvas.addEventListener("touchstart",onMouseDown)
//canvas.addEventListener("touchmove",onMouseMove)

//window.addEventListener("touchend",onMouseUp)
window.addEventListener("pointerup",onMouseUp)








let stream;
let isRecording = false;
async function audio(){
	
	try{
		stream = await navigator.mediaDevices.getUserMedia(
			{
				audio:{
					echoCancellation: false,
					noiseSuppression: false,
					autoGainControl: false,
					latency: 0,
					channelCount: 1, // Force stereo if hardware supports it
					sampleRate: 48000,
					sampleSize: 16
				},
				video:false
			}
		)
		console.log(stream.getAudioTracks())
		const audioContext = new (window.AudioContext || window.webkitAudioContext)();
		const source = audioContext.createMediaStreamSource(stream);
		const analyser = audioContext.createAnalyser();
		analyser.fftSize = 32768
		source.connect(analyser);
		
		// Your data array where volume amplitudes will be written
		const dataArray = new Float32Array(analyser.fftSize);
		
		function getData() {
			if(!isRecording){
				return;
			}
			requestAnimationFrame(getData);
			n = analyser.fftSize;
			analyser.getFloatTimeDomainData(dataArray);
			
			data=dataArray
			//console.log(n);
			update()
			// dataArray now contains the real-time audio numbers!
		}
		getData()
		return true
	}catch(err){
		console.log(err);
	}
	return false;
}

function stop_a(){
	
	stream.getAudioTracks().forEach((track) => {
      track.stop(); // Stops the hardware recording and turns off the browser light
    });
}

let butt

function clic(){
	if(!isRecording){
		isRecording = true;
		if(audio()){
			butt.textContent = "stop"
		}else{
			isRecording = false;
		}
		
		
	}else{
		isRecording = false;
		stop_a();
		butt.textContent = "start"
		
	}
}
butt = document.getElementById("btn");
butt.addEventListener("click",clic) 

