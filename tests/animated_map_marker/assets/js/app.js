var btn, modal, span;

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

