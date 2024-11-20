// 녹음 버튼과 재생 버튼의 DOM 요소를 가져옴
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const playButton = document.getElementById('playButton');

// 오디오 컨텍스트 생성
const audioContext = new AudioContext();

// 오디오 워크렛 생성
audioContext.audioWorklet.addModule('recorder-worklet.js')
  .then(() => {
    const recorderNode = new AudioWorkletNode(audioContext, 'recorder-worklet');

    // 녹음된 오디오 데이터 저장 배열
    let recordedChunks = [];

    // 녹음 시작
    startButton.addEventListener('click', () => {
      recordedChunks = []; // 녹음된 오디오 데이터 초기화
      recorderNode.port.onmessage = ({ data }) => {
        recordedChunks.push(...data); // 녹음된 오디오 데이터를 배열에 추가
      };
      recorderNode.connect(audioContext.destination);
    });

    // 녹음 중지
    stopButton.addEventListener('click', () => {
      recorderNode.disconnect();
    });

    // 녹음된 오디오 재생
    playButton.addEventListener('click', () => {
      const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
      const audioURL = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioURL);
      audioElement.play();
    });
  });
