const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

var port = 8080;

var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

var app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

Array.prototype.remove = function(index) {
  this.splice(index, 1);
}

app.get('', function(req, res) {
  res.sendFile(__dirname + '/HTML/index.html');
});
app.get('/index', function(req, res) {
  res.sendFile(__dirname + '/HTML/index.html');
});
app.get('/rollSearch', function(req, res) {
  res.sendFile(__dirname + '/HTML/rollSearch.html');
});
app.get('/nameSearch', function(req, res) {
  res.sendFile(__dirname + '/HTML/nameSearch.html');
});
app.get('/transport', function(req, res) {
  res.sendFile(__dirname + '/HTML/transport.html');
});
app.get('/house', function(req, res) {
  res.sendFile(__dirname + '/HTML/house.html');
});
app.get('/add', function(req, res) {
  res.render('add', {
    msg: 'nothing'
  });
});
app.get('/remove', function(req, res) {
  res.render('remove', {
    msg: 'nothing'
  });
});
app.get('/update', function(req, res) {
  res.render('update', {
    msg: 'nothing'
  });
});
app.post('/add', urlencodedParser, function(req, res) {
  let msg;
  let student = req.body;
  student.name = student.name.toLowerCase();

  if (student.transport === 'bus') {
    student.transport = student.busRoute;
  }

  let data = fs.readFileSync(__dirname + '/data.json', 'utf8');
  data = JSON.parse(data);
  let students = data.students;
  let index = student.roll - 1;
  let houses = data.houses;
  let transports = data.transport;

  if (students[index] == student.name && transports[index] == student.transport && houses[index] == student.house) {
    msg = 'Student already in class!';
  } else {
    students.splice(index, 0, student.name);
    houses.splice(index, 0, student.house);
    transports.splice(index, 0, student.transport);

    msg = 'Student Added';
  }

  var newData = {
    students: students,
    transport: transports,
    houses: houses
  }
  newData = JSON.stringify(newData, null, 2);
  fs.writeFileSync(__dirname + '/data.json', newData);

  res.render('add', {
    msg: msg
  });
});
app.post('/remove', urlencodedParser, function(req, res) {
  let msg = 'nothing';
  let name = req.body.name.toLowerCase();

  let data = fs.readFileSync(__dirname + '/data.json', 'utf8');
  data = JSON.parse(data);
  let students = data.students;
  let houses = data.houses;
  let transports = data.transport;
  let index;

  if (students.indexOf(name) != -1) {
    index = students.indexOf(name);
    students.remove(index);
    houses.remove(index);
    transports.remove(index);

    msg = 'Student removed!'
  } else {
    msg = 'Student not in class!'
  }

  var newData = {
    students: students,
    transport: transports,
    houses: houses
  }
  newData = JSON.stringify(newData, null, 2);
  fs.writeFileSync(__dirname + '/data.json', newData);

  res.render('remove', {
    msg: msg
  });
});
app.post('/update', urlencodedParser, function(req, res) {
  let msg;
  let student = req.body;
  let name = student.name.toLowerCase();

  if (student.transport === 'bus') {
    student.transport = student.busRoute;
  }

  let data = fs.readFileSync(__dirname + '/data.json', 'utf8');
  data = JSON.parse(data);
  let students = data.students;
  let houses = data.houses;
  let transports = data.transport;
  let index;

  if (student.what) {
    if (students.indexOf(name) != -1) {
      index = students.indexOf(name);

      let whatToChange = student.what

      if (Array.isArray(whatToChange)) {
        whatToChange.forEach(function(item) {
          if(item == 'roll'){
            students.remove(index);
            students.splice(student.roll-1, 0, student.name);
            houses.splice(student.roll-1, 0, houses[index]);
            houses.remove(index);
            transports.splice(student.roll-1, 0, transports[index]);
            transports.remove(index);
          }
          if(item == 'house' && whatToChange.indexOf('roll') != -1){
            houses.remove(student.roll-1);
            houses.splice(student.roll-1, 0, student.house);
          }
          if (item == 'house' && whatToChange.indexOf('roll') === -1) {
            houses.remove(index);
            houses.splice(index, 0, student.house);
          }
          if(item == 'transport' && whatToChange.indexOf('roll') != -1){
            transports.remove(student.roll-1);
            transports.splice(student.roll-1, 0, student.transport);
          }
          if (item == 'transport' && whatToChange.indexOf('roll') === -1) {
            transports.remove(index);
            transports.splice(index, 0, student.transport);
          }
        });
      } else {
        if(whatToChange == 'roll'){
          let house = houses[index]
          let transport = transports[index]

          students.remove(index);
          students.splice(student.roll-1, 0, student.name);

          houses.remove(index);
          houses.splice(student.roll-1, 0, house);

          transports.remove(index);
          transports.splice(student.roll-1, 0, transport);
        }
        if (whatToChange == 'house') {
          houses.remove(index);
          houses.splice(index, 0, student.house);
        }
        if (whatToChange == 'transport') {
          transports.remove(index);
          transports.splice(index, 0, student.transport);
        }

    }

    msg = 'Student Updated!'

  } else {
      msg = 'Student not in class!'
  }

} else {
  msg = 'Please check one option!';
}

  var newData = {
    students: students,
    transport: transports,
    houses: houses
  }
  newData = JSON.stringify(newData, null, 2);
  fs.writeFileSync(__dirname + '/data.json', newData);

  res.render('update', {
    msg: msg
  });

});

app.get('/class', function(req, res) {
  let data = fs.readFileSync(__dirname + '/data.json', 'utf8');
  data = JSON.parse(data);

  res.render('class', {
    students: data.students,
    houses: data.houses,
    transports: data.transport
  });
})
app.get('/data', function(req, res) {
  res.sendFile(__dirname + '/data.json');
});

app.listen(port);

console.log(`Listening at port:${port}`);
