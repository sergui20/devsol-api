document.addEventListener('DOMContentLoaded', function() {
  modalTrigger()
  dropdownTrigger()
});

function dropdownTrigger() {
  var dropdowns = document.querySelectorAll('.dropdown-trigger');
  var instancesD = M.Dropdown.init(dropdowns);
}

function modalTrigger() {
  var elems = document.querySelectorAll('.modal');
  var instancesM = M.Modal.init(elems);
}

function tabs() {
  var el = document.querySelectorAll('.tabs');
  var instanceTab = M.Tabs.init(el);
}