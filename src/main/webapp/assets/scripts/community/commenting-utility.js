import $ from 'jquery';

var commentApi = {

    'defaults' : {
        'url' : '//testUrlForApi'
    },

    flag: function(data) {
        var flag = new $.Deferred();

        flag.resolve();

        $.ajax({
            type: "POST",
            url: this._getUrl() + '/health-stories/flag.jsp',
            data: {
                // for testing, we have a fake user
                'userId'   : '00000149-7c14-d3cf-a559-7eb7005b0000',
                'targetId' : data.targetId
                },
            success: function(data, textStatus, jqXHR) {

                        },
            error: function(jqXHR, textStatus, errorThrown) {
                        flag.reject();
                        },
            beforeSend: function (request) {
                        request.setRequestHeader("x-requested-with", "yes");
                        }
        });

        return flag.promise();
    },

    comment: function(data) {
        var comment = new $.Deferred();
        var postData = {
            // for testing, we have a fake user
            'userId'            : '00000149-7c14-d3cf-a559-7eb7005b0000',
            'targetId'          : data.targetId,
            'name'              : data.name,
            'comment'           : data.comment
        };

        // if we do not have parent comment id, we do not want to send a blank value
        if(data.parentCommentId) {
            postData.parentCommentId = data.parentCommentId;
        }

        $.ajax({
            type: "POST",
            url: this._getUrl() + '/common/postcomment.jsp',
            data: postData,
            success: function(data, textStatus, jqXHR) {
                        comment.resolve();
                        },
            error: function(jqXHR, textStatus, errorThrown) {
                        comment.reject();
                        },
            beforeSend: function (request) {
                        request.setRequestHeader("x-requested-with", "yes");
                        }
        });

        this._omnitureTl('comment');

        return comment.promise();
    }

}

export default commentApi;
