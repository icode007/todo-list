;(function(){
    'use strict';
    //获取taskList, taskList作为全局对象存在，任务的存取，渲染都依赖此对象。
    var taskList = getTaskList();
    
    $(document).ready(function(){
        var   $taskSubmit = $('#task-submit')    //提交任务按钮
            , $taskContent = $taskSubmit.prev()  //添加任务输入框
            , $taskItem                          //任务项
            , $taskDetail                        //任务详情项
            , $taskDetailMask                    //任务详情遮罩
            ;

        //根据已有数据渲染任务列表，绑定事件
        update();

        //绑定提交任务事件
        $taskSubmit.click(function(){
            var val = $taskContent.val(), newTask = {};
            if(val != ''){
                newTask.name = val;
                newTask.desc = '';
                newTask.time = '';
                newTask.complete = false;
                taskList.push(newTask);
                update();
                $taskContent.val('');
                storeTaskList(taskList);
                return false;
            }            
        });
        
        //给任务输入框绑定回车事件.
        $taskContent.keyup(function(e){
            if(e.which == 13){
                $taskSubmit.trigger('click');
            }
        });

        /*
         * update函数是对渲染任务列表，给任务绑定事件的封装。
         */
        function update(){
            renderTaskList(taskList);
            bindDeleteEvent();
            bindDetailEvent();
            bindDoubleClick();
            hideDetailEvent();
            bindCompleteEvent();
        }

        /* 
         * 给任务绑定删除任务事件
         */
        function bindDeleteEvent(){
            $taskItem = $('.task-item');
            $taskItem.find('.task-delete').click(function(e){
                var bool = confirm("确定删除此任务吗？")
                if(!bool){return false;}
                var id = $(this).parent().attr("data-id");
                taskList.splice(id, 1);
                update();
                storeTaskList(taskList);
                return false;
            });
        }

        //给detail按钮绑定详情事件
        function bindDetailEvent(){
            $taskDetail = $('.task-detail');
            $taskDetailMask = $taskDetail.prev();

            $('.task-item .show-detail').click(function(e){
                var id = $(this).parent().attr('data-id'), task = taskList[id];

                //显示task详情部分，根据task渲染task详情
                $taskDetailMask.show();
                $taskDetail.show();
                renderTaskDetail(task);

                //给task详情name添加双击事件。
                $('.task-detail-header').dblclick(function(){
                    $(this).replaceWith('<input class="task-detail-input" value="'+task.name+'"></input>')
                });

                //给task详情添加更新事件
                $('#update').click(function(){
                    task.name = $('.task-detail-input').val() || $('.task-detail-header').html();
                    task.desc = $('#description').val() || '';
                    task.time = $('.task-detail-time input').val() || '';
                    $taskDetailMask.trigger('click');
                    update();
                    storeTaskList(taskList);
                });

                return false;
            });
        }


        /*
         * 根据task渲染任务详情
         */
        function renderTaskDetail(task){
            var template = '<h2 class="task-detail-header">'+ task.name +'</h2>\
                            <textarea id="description" value=""></textarea>\
                            <div class="task-detail-time">\
                                <p>提醒时间：</p>\
                                <input type="text" id="datetimepicker" value="'+ task.time +'">\
                            </div>\
                            <button id="update">更新</button>';
            $('.task-detail').empty().append(template);
            $('#description').val(task.desc);
            
            //引入datetimepicker组件
            $('#datetimepicker').datetimepicker({
                format: "Y-m-d H:i"
            }); 
            $.datetimepicker.setLocale('zh'); //设置日期组件显示中文
        }

        /*
         * 给task绑定鼠标双击事件
         */
        function bindDoubleClick(){
            $taskItem.dblclick(function(){
                $(this).find('.show-detail').trigger('click');
            })
        }

        /*
         * 添加点击隐藏详情事件
         */
        function hideDetailEvent(){
            $taskDetailMask.click(function(){
                $taskDetail.hide();
                $(this).hide();
            })
        }

        /*
         * 给checkbox绑定任务完成事件
         */
        function bindCompleteEvent(){
            $('.task-item input').click(function(){
                var index = $(this).parent().attr('data-id')
                    , task = taskList[index]
                    , isComplete = $(this).is(':checked');
                if(isComplete){
                    task.complete = true;
                }else{
                    task.complete = false;
                }
                update();
                storeTaskList(taskList);
            })
        }
    });

    /*
     * 从localStorage获取数据，将数据转换为taskList对象并返回
     */
    function getTaskList(){
        var taskList = localStorage.getItem('taskList');
        taskList = JSON.parse(taskList);
        if(taskList == null){
            taskList = [];
        }
        return taskList;
    }

    /* 
     * 将taskList使用JSON转换后存入localStorage
     */
    function storeTaskList(taskList){
        taskList = JSON.stringify(taskList);
        localStorage.setItem('taskList', taskList);
    }

    /*
     * 根据taskList渲染数据到页面
     */
    function renderTaskList(tasklist){
        var template = '', $taskList = $('#task-list'), complete;
        $taskList.empty();//清空节点，防止重复渲染
        $.each(taskList, function(index, value){
            complete = value.complete;
            template = '<div class="task-item'+ (complete ? " complete" : " ")+'" data-id="' + index + '">\
                            <input type="checkbox"'+ (complete? " checked" : " ")+'>\
                            <span>'+ value.name +'</span>\
                            <a href="#" class="task-delete">delete</a> \
                            <a href="#" class="show-detail">detail</a> \
                        </div>';
            if(complete){
                $taskList.append(template);
            }else{
                $taskList.prepend(template);
            }
        });
    }
})();