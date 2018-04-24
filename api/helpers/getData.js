'user strict';

// call node-twitter's function to get data from twitter
function get_data(client, params, target, callback){
    client.get(target, params, function(error, json, response) {
        if (!error) {
            callback(json);
        } else{
            console.log(target);
            console.log(error);
            callback(null);
        }
    });
}

function get_profile_img(client, screen_name, user_id, callback){
    get_data(client, {screen_name: screen_name, user_id: user_id, include_entities: false}, 'users/show', function(json){
        if (json != null){
            callback(json.profile_image_url);
        } else{
            callback(null);
        }
    });
}

// get all cursored data with max_id
function get_all_data_id(client, target, callback){
    var result = [];
    var max_id = -1;
    get_data(client, {count: 200, include_entities: true, tweet_mode: "extended"}, target, function cursoring(json){
        if (json != null && json.length > 1){
            if (max_id == -1){
                result.push.apply(result, json);
            } else{
                result.push.apply(result, json.slice(1));
            }
            max_id = json[json.length-1].id;
            get_data(client, {max_id: max_id, count: 200, include_entities:true, tweet_mode: "extended"}, target, cursoring);

        } else{
            callback(result);
        }
    });
}

// get all cursored data with next_cursor
function get_all_data_cursor(client, target, callback){
    var result = [];
    get_data(client, {count: 200, include_entities: true, tweet_mode: "extended"}, target, function cursoring(json){
        if (json != null){
            result.push.apply(result, json.users);
            if (json.next_cursor != 0){
                get_data(client, {cursor: json.next_cursor, count: 200, include_entities:true, tweet_mode: "extended"}, target, cursoring);
            } else{
                callback(result);
            }
        } else{
            callback(result);
        }
    });
}

module.exports = {
    get_data: get_data,
    get_all_data_id: get_all_data_id,
    get_all_data_cursor: get_all_data_cursor,
    get_profile_img: get_profile_img
}
