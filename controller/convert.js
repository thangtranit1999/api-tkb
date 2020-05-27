function convertDay(string) {
    switch (string) {
        case "Thứ Hai":
            return 6;
            break;
        case "Thứ Ba":
            return 2
            break;
        case "Thứ Tư":
            return 3
            break;
        case "Thứ Năm":
            return 4
            break;
        case "Thứ Sáu":
            return 5
            break;
        case "Thứ Bảy":
            return 1
            break;
        case "Chủ Nhật":
            return 0
            break;
        default:
            break;
    }
}
function convertDay2(string) {
    switch (string) {
        case 1:
            return "Thứ hai";
            break;
        case 2:
            return "Thứ ba"
            break;
        case 3:
            return "Thứ tư"
            break;
        case 4:
            return "Thứ năm"
            break;
        case 5:
            return "Thứ sáu"
            break;
        case 6:
            return "Thứ bảy"
            break;
        case 0:
            return "Chủ nhật"
            break;
        default:
            break;
    }
}
function buoi(stbd){
    switch(stbd){
        case "1":
            return "buối sáng";
            break;
        case "7":
            return "buổi chiều";
            break;
        default:
            return "Chưa cập nhật";
            break;
    }
}
module.exports = {
    sosangthu: convertDay2,
    thusangso: convertDay,
    sosangbuoi: buoi
}
