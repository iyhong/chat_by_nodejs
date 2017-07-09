var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

var userList = [];

var port = process.env.PORT || 3000;
http.listen(port, function() {
  console.log('listening on *:3000');
});

io.on('connection', function(socket) {

  var joinedUser = false;
  var nickname;

  // 유저입장
  socket.on('join', function(data) {
    if (joinedUser) { // 이미입장했다면 중단
      return false;
    }

    nickname = data;
    userList.push(nickname);

    socket.broadcast.emit('join', {
      nickname: nickname,
      userList: userList
    });

    socket.emit('welcome', {
      nickname: nickname,
      userList: userList
    });

    joinedUser = true;
  });

  // 메시지 전달
  socket.on('msg', function(data) {
    console.log('msg:' + data);
    io.emit('msg', {
      nickname: nickname,
      msg: data
    });
  });

  // 접속 종료
  socket.on('disconnect', function() {
    if (!joinedUser) {
      console.log('-----not joinedUser left');
      return false;
    }

    // 접속자목록에서 제거
    var i = userList.indexOf(nickname);
    userList.splice(i, 1);

    socket.broadcast.emit('left', {
      nickname: nickname,
      userList: userList
    });
  });
});
