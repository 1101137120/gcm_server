
var protocol = location.protocol;
var hostname = location.hostname;

$(document).ready(function () {

    $('#autoConnect').on("click", function () {
        
        $.ajax({
            type: "POST",
            url: protocol + "//" + hostname + ":9004/test/allpay/pay"
               
        })
	.success(function (msg) {
            
            console.log("msgmsgmsg" + msg);
           
            $("#aaa").append(msg);
        
        })
	.fail(function () {
            console.log("error");
        })
	.always(function () {
            console.log("complete")
        });
    });
    

});