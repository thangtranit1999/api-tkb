const fetch = require("node-fetch");
const Bluebird = require("bluebird");
const day = require("./convert")
//fetch.Promise = Bluebird;

async function getDataAPI(html) {
    var test;
    await fetch(html)
        .then(res => res.json())
        .then(body => {
            test = body;
        });
    return test;
}

async function dataToday(text) {
    const data = await getDataAPI("https://bdu-schedule-api.herokuapp.com/api/schedule/"+text);
    const date = new Date();
    const today = date.getDay();
    const scheduleToday = data.schedule.filter((item) => {
        return today === day.thusangso(item.weekDay);
    })
    console.log(typeof(scheduleToday[0].startSlot));
    var message='';
    if(data.id.length == 0){
        message="Mã số này không tồn tại";
    }else{
        if(scheduleToday[0] ==null){
            message='Xin chào: '+data.name+' ,Hôm nay thứ '+day.sosangthu(today)+'. Bạn không có môn học nào';
        }
        else{
            message='Xin chào: '+data.name+'. Hôm nay là '+scheduleToday[0].weekDay+' ,bạn có môn học:"'+scheduleToday[0].subjectName
            +'" vào '+day.sosangbuoi(scheduleToday[0].startSlot) +' tại phòng: '+scheduleToday[0].room;
        }
    }
    // const message='Xin chào: '+data.name+' ,MSSV của bạn: '+data.id+'. Hôm nay là '+scheduleToday[0].weekDay+' ,bạn có môn học: "'+scheduleToday[0].subjectName
    // +'" tại phòng: '+scheduleToday[0].room;
    // //console.log(message);
    return message;
}
async function test(){
    console.log(await dataToday("17050070"));

}
test();
module.exports = dataToday;
