/**
 * Created by mangubu on 09/06/2016.
 */


$(document).ready(function(){
    var maze = $('#maze');
    maze.hide();
    var cells;
    var width = 0;
    var height = 0;
    var direction = [];
    function generateMaze(wth, hgt){
        width = wth;
        height = hgt;
        direction = [1, -1, width, -width];
        maze.css('width', width*40);
        maze.css('height', height*40);
        for(var i = 0; i < width*height; i++){
            $('<div class="cells" data-down="false" data-right="false" data-value="'+i+'"></div>').appendTo(maze);
        }
        cells = $('.cells');
    }
    function selectCell() {
        var randomNumber = parseInt(getRandomArbitrary(0, width * height));
        var randomDir = direction[parseInt(getRandomArbitrary(0, 4))];
        var cell = cells[randomNumber];
        if ((randomNumber < width && randomDir == -width) || (randomNumber > cells.length - width && randomDir == width) || (randomNumber == cells.length - 1 && randomDir == 1) || (randomNumber == 0 && randomDir == -1) || (randomNumber % width == 0 && randomDir == -1) || ((randomNumber + 1) % width == 0 && randomDir == 1)
        ) {
            return false;
        } else {
            var nextCell = cells[randomNumber + randomDir];
            var cellValue = parseInt($(cell).attr('data-value'));
            var nextCellValue = parseInt($(nextCell).attr('data-value'));
            if (cellValue != nextCellValue) {
                $(cell).addClass('check');
                switch (randomDir) {
                    case -1:
                        $(nextCell).attr('data-right', 'true');
                        break;
                    case -width:
                        $(nextCell).attr('data-down', 'true');
                        break;
                    case 1:
                        $(cell).attr('data-right', 'true');
                        break;
                    case width:
                        $(cell).attr('data-down', 'true');
                        break;
                }
                if (cellValue > nextCellValue) {
                    $('.cells[data-value="' + cellValue + '"]').attr('data-value', nextCellValue);
                } else {
                    $('.cells[data-value="' + nextCellValue + '"]').attr('data-value', cellValue);
                }
            }
        }
        if ($('.cells[data-value="0"]').length == width * height) {
            stopInterval();
            $('.cells').html('');
            generateJson();
        }
    }
    document.getElementById('random').addEventListener('click', function(evt) {
        $(".json_btn").hide();
        maze.show();
        $("#maze").html("");
        generateMaze(15,15);
        loop();
        $(".json_btn").show();
    }, false);
    document.querySelector('.readBytesButtons').addEventListener('click', function(evt) {
        if (evt.target.tagName.toLowerCase() == 'button') {
            var file = read();
            console.log(file);
            //generateMaze(file.width, file.height);
        }
    }, false);
    function loop(){
        intervalId = setInterval(selectCell, 10);
    }
    function stopInterval(){
        clearInterval(intervalId);
    }
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
    function generateJson(){
        var json = { "cells" : []};
        var cells = [];
        $('.cells').each(function(){
            var down = JSON.parse($(this).attr("data-down"));
            var right = JSON.parse($(this).attr("data-right"));
            var cell = {
                "down": down,
                "right": right
            };
            cells.push(cell);
        });
        var size = {
            "width": width,
            "height": height
        };
        $.extend(json.cells, cells);
        $.extend(json, size);

        json = JSON.stringify(json);
        var create = document.getElementById('create');
        var data = new Blob([json], {type: 'application/json'});
        var textFile = window.URL.createObjectURL(data);
        create.addEventListener('click', function () {
            this.href = textFile;
            this.download = "maze.json";
        }, false);
    }
    function read() {
        var files = document.getElementById('fileToUpload').files;
        console.log(files);
        if (!files.length) {
            alert('Please select a file!');
            return;
        }
        var file = files[0];
        var start = 0;
        var stop = file.size - 1;
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onloadend = function (evt) {
            var fileContent = evt.target.result;
            fileContent = JSON.parse(fileContent);
            $("#maze").html("");
            $(".json_btn").hide();
            generateMaze(fileContent.width, fileContent.height);
            cells.each(function(i){
                var currentCell = cells[i];
                if (fileContent.cells[i].down == true) {
                    $(currentCell).attr('data-down', 'true');
                }
                if (fileContent.cells[i].right == true) {
                    $(currentCell).attr('data-right', 'true');
                }
                $(currentCell).attr('data-value','0');
                $('.cells').html('');
            });
            $(".json_btn").show();
        }
        reader.onerror = function (evt) {
            document.getElementById("fileContents").innerHTML = "error reading file";
            return "error";
        }
    }

});


