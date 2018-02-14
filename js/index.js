;(function(){
    'use strict';

    var taskList = getTaskList();
    
    $(document).ready(function(){
        //根据已有数据渲染页面，绑定事件
        init();

        //给task提交按钮绑定click事件
        $('#task-submit').click(function(){
            var val = $('#task-content').val();
            var newTask = {};
            if(val != ''){
                newTask.name = val;
                newTask.desc = '';
                newTask.time = '';
                newTask.complete = false;
                taskList.push(newTask);
                init();
                $('#task-content').val('');
                storeTaskList(taskList);
                return false;
            }            
        });
        
        //给task输入框绑定回车事件.
        $('#task-content').keyup(function(e){
            if(e.which == 13){
                $('#task-submit').trigger('click');
            }
        });


        //给delete按钮绑定删除task事件
        function bindDeleteEvent(){
            $('.task-item .task-delete').click(function(e){
                var bool = confirm("确定删除此任务吗？")
                if(!bool){return false;}
                var id = $(this).parent().attr("data-id");
                taskList.splice(id, 1);
                init();
                storeTaskList(taskList);
                return false;
            })
        }

        //给detail按钮绑定详情事件
        function bindDetailEvent(){
            $('.task-item .show-detail').click(function(e){
                var id = $(this).parent().attr('data-id');
                var task = taskList[id];
                $('.task-detail-mask').show();
                $('.task-detail').show();
                renderTaskDetail(task);
                //添加双击事件
                $('.task-detail-header').dblclick(function(){
                    $(this).replaceWith('<input class="task-detail-input" value="'+task.name+'"></input>')
                })

                //添加更新事件
                $('#update').click(function(){
                    task.name = $('.task-detail-input').val() || $('.task-detail-header').html();
                    task.desc = $('#description').val() || '';
                    task.time = $('.task-detail-time input').val() || '';
                    $('.task-detail-mask').trigger('click');
                    init();
                    storeTaskList(taskList);
                })

                return false;
            })
        }


        //渲染task-detail
        function renderTaskDetail(task){
            var template = '<h2 class="task-detail-header">'+ task.name +'</h2>\
                            <textarea id="description" value=""></textarea>\
                            <div class="task-detail-time">\
                                <p>提醒时间：</p>\
                                <input type="date" value="'+ task.time +'">\
                            </div>\
                            <button id="update">更新</button>';
            $('.task-detail').empty().append(template);
            $('#description').val(task.desc);
        }

        //绑定鼠标双击事件
        function bindDoubleClick(){
            $('.task-item').dblclick(function(){
                $(this).find('.show-detail').trigger('click');
            })
        }


        //给task-detail-mask添加点击隐藏task事件
        function hideDetailEvent(){
            $('.task-detail-mask').click(function(){
                var $taskDetail = $('.task-detail');
                $taskDetail.hide();
                $('.task-detail-mask').hide();
            })
        }

        //绑定完成事件
        function bindCompleteEvent(){
            $('.task-item input[type="checkbox"]').click(function(){
                var index = $(this).parent().attr('data-id');
                var task = taskList[index];
                var isComplete = $(this).is(':checked');
                if(isComplete){
                    task.complete = true;
                }else{
                    task.complete = false;
                }
                init();
                storeTaskList(taskList);
            })
        }


        //init函数是进一步的抽象，包括渲染task-list，给task绑定各种事件
        function init(){
            renderTaskList(taskList);
            bindDetailEvent();
            bindDeleteEvent();
            bindDoubleClick();
            hideDetailEvent();
            bindCompleteEvent();
        }

    });

    //从localStorage获取节点列表
    function getTaskList(){
        var taskList = localStorage.getItem('taskList');
        taskList = JSON.parse(taskList);
        if(taskList == null){
            taskList = [];
        }
        return taskList;
    }
    //将taskList存入localStorage
    function storeTaskList(taskList){
        taskList = JSON.stringify(taskList);
        localStorage.setItem('taskList', taskList);
    }

    function renderTaskList(tasklist){
        var template = '', $taskList = $('#task-list');
        $taskList.empty();//清空节点，防止重复渲染
        $.each(taskList, function(index, value){
            template = '<div class="task-item'+ (value.complete ? " complete" : " ")+'" data-id="' + index + '">\
                            <input type="checkbox"'+ (value.complete? " checked" : " ")+'>\
                            <span>'+ value.name +'</span>\
                            <a href="#" class="task-delete">delete</a> \
                            <a href="#" class="show-detail">detail</a> \
                        </div>';
            if(value.complete){
                $taskList.append(template);
            }else{
                $taskList.prepend(template);
            }
        })
    }

})();