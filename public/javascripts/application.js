var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();

var paint;
var canvas;
var context;
var in_guess_page = false;

function redraw(){
  canvas.width = canvas.width;
  context.strokeStyle = "#5f5f5f";
  context.lineWidth = 5;
  for(var i=0; i<clickX.length; i++)
  {
    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
    }else{
      context.moveTo(clickX[i], clickY[i]);
    }
    context.lineTo(clickX[i], clickY[i]);
    context.closePath();
    context.stroke();
  }
}

function showPicture(i){
  if(!i){i=0}
  context.strokeStyle = "#5f5f5f";
  context.lineWidth = 5;
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
    }else{
      context.moveTo(clickX[i], clickY[i]);
    }
    context.lineTo(clickX[i], clickY[i]);
    context.stroke();
    if(i < clickX.length){
      setTimeout(function(){showPicture(i+1);}, 100);
    }
}

$(document).ready(function(){

  var $win = $(window)
    , $nav = $('.subnav')
  , navHeight = $('.navbar').first().height()
    , navTop = $('.subnav').length && $('.subnav').offset().top - navHeight
    , isFixed = 0

  processScroll()

  $win.on('scroll', processScroll)

  function processScroll() {
    var i, scrollTop = $win.scrollTop()
    if (scrollTop >= navTop && !isFixed) {
      isFixed = 1
      $nav.addClass('subnav-fixed')
    } else if (scrollTop <= navTop && isFixed) {
      isFixed = 0
      $nav.removeClass('subnav-fixed')
    }
  }


    function addClick(x, y, dragging)
    {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    }

    if(!in_guess_page){
      canvas = document.getElementById('canvasInAPerfectWorld');
      context = document.getElementById('canvasInAPerfectWorld').getContext("2d");

      $('#canvasInAPerfectWorld').mousedown(function(e){
        paint = true;
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        })
      $('#canvasInAPerfectWorld').mousemove(function(e){
        if(paint){
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
        }
        })
      $('#canvasInAPerfectWorld').mouseup(function(e){
          paint = false;
          })
      $("#canvasInAPerfectWorld").mouseleave(function(e){
          paint = false;
          })
  
      //initialize the ajax form
        function preRequest(formData, jqForm, options){
          if(clickX.length === 0 || clickY.length === 0 || clickDrag.length === 0 || formData[0].value == ""){
            alert("please draw first and give it a name!");
            return false;
          }
          var clickXStr = clickX.toString();
          var clickYStr = clickY.toString();
          var clickDragStr = clickDrag.toString();
          formData.push({name:"clickX", value:clickXStr});
          formData.push({name:"clickY", value:clickYStr});
          formData.push({name:"clickDrag", value:clickDragStr});
          clickX = new Array(); clickY = new Array(); clickDrag = new Array();
          return true;
        }
  
        function updatePaintList(responseText, statusText){
          message = responseText + "\n Hey, you, this is your paint url, sent it to your best friend!" 
          alert(message);
        }
        var options = {
          beforeSubmit: preRequest,
          success: updatePaintList,
          clearForm: true,
          url: "/paints"
        };
  
        $("#paintNew").ajaxForm(options);

    }else{
        var paint_name;
        function preRequestForGuess(formData, jqForm, options){
          paint_name = formData[0].value;
        }
  
        function updatePaintListForGuess(responseText, statusText){
          if(responseText == "true"){
            alert("Congrats, you guessed.Smart guy, you can paint a picture next.");
            self.location='/';
          }else
          {
            alert("Sorry, you are wrong!")
          }
        }
        var options = {
          beforeSubmit: preRequestForGuess,
          success: updatePaintListForGuess,
          clearForm: true,
          url: "/paints/" + paint_id + "/guess"
        };
  
        $("#guessName").ajaxForm(options);

    }
});
