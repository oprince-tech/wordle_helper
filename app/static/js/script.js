// ROW CYCLE COLOR
$('.underscore').click(function(){
  var input = $(this).parent().children('input');
  var value = input.val().toUpperCase();
  var key = $('#keyboard').find('span:contains('+ value +')');

  if (input.hasClass('yellow-sq')) {
    input.removeClass('yellow-sq');
    input.addClass('green-sq');
    key.removeClass();
    key.addClass('green-sq');
  } else if (input.hasClass('green-sq')) {
    input.removeClass('green-sq');
    input.addClass('grey-sq')
    key.removeClass();
    key.addClass('grey-sq');
  } else {
    input.removeClass('grey-sq')
    input.addClass('yellow-sq');
    key.removeClass();
    key.addClass('yellow-sq');
  }
});

// ROW GATHER
$('.letterInput').on('input', function(){
  var letterCols = $(this).closest('#letterRow').children('.letterCol')
  if ($(this).val() == '') {
    $(this).removeClass('yellow-sq green-sq grey-sq')
  } else {
    $(this).addClass('grey-sq')
  }
  letters = []
  $.each(letterCols, function(){
    var letter = $(this).children('input').val().toUpperCase();
    var color = $(this).children('input').attr('class').split(/\s+/)[1];
    if (letter != "") {
      letters.push({letter:letter, color:color})
    } else {
      $(this).removeClass('yellow-sq green-sq grey-sq')
    }
  });
  var deselect_keys = $('#keyboard').find('span')
  $.each(letters, function(i, letter){
    var key = $('#keyboard').find('span:contains('+ letter['letter'] +')');
    key.addClass(letter['color']);
  });
});

// ROW KEYUP
$('.letterInput').keyup(function(){
  var nextCol = $(this).closest('.letterCol').next();
  nextCol.children('input').focus();
  nextCol.children('input').select();
});

// KEYBOARD CYCLE COLOR
$('#keyboard').children().children().click(function(){
  if ($(this).hasClass('yellow-sq')) {
    $(this).removeClass('yellow-sq');
    $(this).addClass('green-sq');
  } else if ($(this).hasClass('green-sq')) {
    $(this).removeClass('green-sq');
  } else if ($(this).hasClass('grey-sq')) {
    $(this).removeClass('grey-sq')
    $(this).addClass('yellow-sq');
  } else {
    $(this).addClass('grey-sq');
  }
})

// CLEAR
$('#clearButton').click(function(){
  var keys = $('#keyboard').children().children()
  var cols = $('#letterRow').children().children('input')
  keys.removeClass();
  cols.removeClass('grey-sq yellow-sq green-sq');
  cols.val('');
  $('#matchesContainer > table > tbody').children('tr').remove();
});

// SUBMIT
$('#submitButton').click(function(){
  var letterCols = $('#letterRow').children('.letterCol');
  var spans = $('#keyboard').children('div').children('span');
  hits = []
  misses = []
  $.each(spans, function(){
    var letter = $(this).text();
    var color = $(this).attr('class');
    if (color == 'grey-sq') {
      misses.push({letter:letter, color:color})
    }
  });
  $.each(letterCols, function(){
    var letter = $(this).children('input').val().toUpperCase();
    var color = $(this).children('input').attr('class').split(/\s+/)[1]
    var index = $(this).children('input').attr('name');
    if (color == 'yellow-sq' || color == 'green-sq') {
      hits.push({letter:letter, color:color, index:index})
    }
  });
  var rows = $('#matchesContainer > table > tbody').children('tr');
  $.each(rows, function(){
  });
  $('.spinner-border').removeClass('hidden');
  $('#matchesContainer > table > tbody').children('tr').remove();
  $('#errorContainer').children().remove();
  if (!jQuery.isEmptyObject(hits) || !jQuery.isEmptyObject(misses)) {
    $.ajax({
      type: 'POST',
      url: '/run',
      data: JSON.stringify({'hits': hits, 'misses': misses}),
      contentType: 'application/json',
      dataType: 'json',
      cache: false,
      processData: false,
      success: function(data) {
        $.each(data.matches, function(i, match){
          $('#matchesContainer > table > tbody').append('<tr><td>'+ match +'</td><tr/>')
        });
        $('.spinner-border').addClass('hidden');
      },
      error: function(data) {
        $('#errorContainer').append('<span>' + data.responseText + '</span>')
      },
    });
  } else {
    $('#errorContainer').append('<span>No tiles selected.</span>')
  }
});
