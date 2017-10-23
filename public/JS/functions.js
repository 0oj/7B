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


function sendOutput(output) {
  let before = $('pre').text()
  $('pre').text(before + output + '\n')
  $('input').val('')
  $("pre").scrollTop($("pre")[0].scrollHeight);
}

function getName(roll) {
  let index = roll - 1
  let ouput;

  if (students[index]) {
    output = roll + ': ' + students[index].capFirst()
  } else {
    output = 'Out of range!(1 to ' + strength + ')'
  }
  sendOutput(output)
}

function getRoll(name) {
  let output;
  let roll = students.indexOf(name) + 1;

  if (students.indexOf(name) != -1) {
    output = name.capFirst() + ': ' + roll
  } else {
    output = 'Student not in class!'
  }
  sendOutput(output)
}

function getTransport(name) {
  let output;
  let index = students.indexOf(name)
  let transport_of_student = transport[index]

  if (index != -1) {
    output = name.capFirst() + ': ' + transport_of_student.capFirst()
  } else {
    output = `${name.capFirst()} not in class!`
  }
  sendOutput(output)
}

function getHouse(name) {
  let output;
  let index = students.indexOf(name)
  let house = houses[index]

  if (index != -1) {
    output = name.capFirst() + ': ' + house.capFirst()
  } else {
    output = `${name.capFirst()} not in class!`
  }
  sendOutput(output)
}
