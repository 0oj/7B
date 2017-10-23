var students;
var transport;
var strength;
var houses;

$.getJSON('/data', function(result) {
  students = result.students;
  transport = result.transport;
  houses = result.houses;
  strength = students.length;
});

String.prototype.capFirst = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

function submit(e, function_name) {
  if (event.key === 'Enter') {
    function_name(e.value)
  }
}
