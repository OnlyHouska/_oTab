let timeElm = document.getElementById('time');

updateTime();
setInterval(updateTime, 1000);

function updateTime() {
    const date = new Date();
    timeElm.innerHTML = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0');
}