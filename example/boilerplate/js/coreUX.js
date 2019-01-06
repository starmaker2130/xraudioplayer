var coreEventListeners = {
    launch: function(modules){
        $('#launch-application-page').click(function(){

            console.log('application launch...');

            var elem = document.body;
            //requestFullScreen(elem);

            $(this).animate({
                height: 0
            }, 1000, function(){
                $(this).hide();
                if(modules!=null){
                    for(var i = 0 ; i< modules.length; i++){
                        modules[i].stream();//application.core.stream();
                    }
                }
            });
        });
    }
};