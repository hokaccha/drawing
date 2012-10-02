var lineWidth = document.getElementById("lineWidth");
var colors = [].slice.call(document.querySelectorAll("#colors li"));
var startBtn = document.getElementById("start");
var endBtn = document.getElementById("end");
var selectClassName = "selected";
var isStart = false;

function setColor(color) {
	colors.forEach(function(li) {
		li.innerText === color
			? li.classList.add(selectClassName)
			: li.classList.remove(selectClassName);
	});
}

function getColor() {
	return colors.filter(function(li) {
		return li.classList.contains(selectClassName);
	})[0].innerText;
}

function sendRequest(params, callback) {
	if (typeof params === "function") {
		callback = params;
		params = {};
	}
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, params, callback);
	});
}

chrome.tabs.getSelected(null, function(tab) {
	if (/^(chrome|https:\/\/chrome\.google\.com\/webstore\/)/.test(tab.url)) {
		document.querySelector(".page-error").style.display = "block";
	}
	else {
		document.querySelector(".page-main").style.display = "block";
	}
});

sendRequest(function(response) {
	if (response.isStart) {
		isStart = true;
		startBtn.disabled = true;
		endBtn.disabled = false;
		setColor(response.color);
		lineWidth.value = response.lineWidth;
	}
});

colors.forEach(function(li) {
	var color = li.innerText;
	li.style.backgroundColor = color;
	li.addEventListener("click", function() {
		setColor(color);
		sendRequest({ action: "change", color: color });
	});
});

lineWidth.addEventListener("input", function() {
	sendRequest({ action: "change", lineWidth: lineWidth.value });
});

startBtn.addEventListener("click", function() {
	chrome.tabs.executeScript(null, { file: "script.js" }, function() {
		sendRequest({
			action: "start",
			color: getColor(),
			lineWidth: lineWidth.value
		}, function() {
			isStart = true;
			window.close();
		});
	});
});

endBtn.addEventListener("click", function() {
	sendRequest({ action: "end" }, function() {
		isStart = false;
		window.close();
	});
});
