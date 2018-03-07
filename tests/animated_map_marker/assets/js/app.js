var btn,
	modal,
	span,
	$mapMarkers = $('#map').find('.marker-wrapper'),
	$markersIndexes,
	$usedMarkersIndexes = [],
	$nextMarkersIndex,
	$currentMarkersIndex,
	counter = 0;

$(document).ready(function() {
	setMapMarkers();
});

function openModal(modalName) {
	modal = document.getElementById(modalName);
	modal.style.opacity = 1;
	modal.style.pointerEvents = 'auto';
	span = document.getElementsByClassName('close')[0];
}

function closeModal(modalName) {
	modal = document.getElementById(modalName);
	modal.style.opacity = 0;
	modal.style.pointerEvents = 'none';
}

window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.opacity = 0;
		modal.style.pointerEvents = 'none';
	}
};

function generateArrayWithRange(start, end) {
	return Array(end - start + 1)
		.fill()
		.map((_, idx) => start + idx);
}

function setMapMarkers() {
	$markersIndexes = generateArrayWithRange(0, $mapMarkers.length - 1);
	animateMap();
}

function animateMap() {
	setMarkersIndexes();
	$($mapMarkers[$nextMarkersIndex]).fadeIn(500);
	if ($currentMarkersIndex != undefined) {
		$($mapMarkers[$currentMarkersIndex]).fadeOut(1000);
	}
	resetMarkersIndexes();
	setTimeout(function() {
		animateMap();
	}, 3000);
}

function setMarkersIndexes() {
	$usedMarkersIndexes.push(
		$markersIndexes.splice(
			Math.floor(Math.random() * $markersIndexes.length),
			1
		)[0]
	);
	$nextMarkersIndex = $usedMarkersIndexes[$usedMarkersIndexes.length - 1];
}

function resetMarkersIndexes() {
	$currentMarkersIndex = $nextMarkersIndex;
	if ($markersIndexes.length == 0) {
		$markersIndexes = $usedMarkersIndexes;
		$usedMarkersIndexes = [];
	}
}
