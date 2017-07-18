var nickname;
var socket = io();

// 이벤트: join클릭
$('#joinBtn').click(function(e) {
  console.log('들어가기 버튼클릭');
  fnNickname(e);
});

// 이벤트: nickname 엔터키
$('#nickname').keypress(function(e) {
  if (e.which == 13) {
    fnNickname(e);
  }
});

// 송신: 닉네임
function fnNickname(e) {
  if ($('#nickname').val().trim() == '') {
    alert('닉네임을 적어주세요');
    return false;
  }
  nickname = $('#nickname').val().trim();
  socket.emit('join', nickname); // 접속 이벤트
}

// 수신: 환영인사
socket.on('welcome', function(data) {
  // 유저리스트 업데이트
  fnUpdateUserList(data.userList);

  $('#before').hide();
  $('#after').show();
  $('#messages').append($('<li class="noti">').text(nickname + '님 환영합니다.'));
});

// 유저리스트 업데이트
function fnUpdateUserList(userList) {
  $('#userList').text('');
  for (i = 0; i < userList.length; i++) {
    $('#userList').append($('<li>').text(userList[i]));
  }
}

// 수신: 신규자 접속
socket.on('join', function(data) {
  // 입장 알림
  $('#messages').append($('<li class="noti">').text(data.nickname + '님이 입장하셨습니다'));

  // 유저리스트 업데이트
  fnUpdateUserList(data.userList);
});

// 수신: 퇴장
socket.on('left', function(data) {
  // 종료 알림
  $('#messages').append($('<li class="noti">').text(data.nickname + '님이 퇴장하셨습니다'));

  // 유저리스트 업데이트
  fnUpdateUserList(data.userList);
});

// 송신: 메시지
$('form').submit(function() {
  socket.emit('msg', $('#m').val());
  $('#m').val('');
  return false;
});

// 수신: 메시지
socket.on('msg', function(data) {
  var span = $('<span class="nickname">').text(data.nickname);
  var li = $('<li>').append(span).append(data.msg);
  $('#messages').append(li);
});
