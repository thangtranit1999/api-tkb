const express = require('express');
const cheerio = require('cheerio');
const request = require('request');

const router = express.Router();

const TARGET_URL = 'https://sv.bdu.edu.vn/Default.aspx?page=thoikhoabieu';

convertToObject = (string) => {
    const vals = string.split("','");
    return {
        class: vals[0].replace("ddrivetip('", ''),
        subjectName: vals[1],
        subjectCode: vals[2],
        weekDay: vals[3],
        room: vals[5],
        startSlot: vals[6],
        numbersOfSlots: vals[7],
        instructor: vals[8],
    };
};
// map date string to number
const dayMap = {
    'Thứ Hai': 0,
    'Thứ Ba': 1,
    'Thứ Tư': 2,
    'Thứ Năm': 3,
    'Thứ Sáu': 4,
    'Thứ Bảy': 5,
    'Chủ Nhật': 6,
};

getDate = (startDate, weekDay) => {
    startDate = startDate.split('/');
    var date = new Date(`${startDate[2]}/${startDate[1]}, ${startDate[0]}`);
    date.setDate(date.getDate() + dayMap[weekDay]);
    return date;
};

// get data from html
getData = (html) => {
    const $ = cheerio.load(html);
    const id = $('#ctl00_ContentPlaceHolder1_ctl00_lblContentMaSV').text();
    if (id === '') {
        return {
            error: {
                statusCode: 400,
                message: 'Bad request - No student Id found!',
            },
        };
    }

    const [name, dateOfBirth] = $(
        '#ctl00_ContentPlaceHolder1_ctl00_lblContentTenSV'
    )
        .text()
        .split(' - ');
    const detail = $('#ctl00_ContentPlaceHolder1_ctl00_lblContentLopSV').text();
    const date = $('select[name$="ddlTuan"] option:nth-child(2)').text();
    const [startDate, endDate] = date.match(
        /(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}/g
    );

    const schedule = $(
        '#ctl00_ContentPlaceHolder1_ctl00_Table1 tbody td'
    ).toArray();

    let data = schedule.reduce((acc, element) => {
        const el = $(element);
        let content = el.attr('onmouseover');
        content ? acc.push(convertToObject(content)) : acc;
        return acc;
    }, []);

    data = data.map((scheduleItem) => {
        const date = getDate(startDate, scheduleItem.weekDay);
        return { ...scheduleItem, date };
    });

    return {
        week: {
            from: startDate,
            to: endDate,
        },
        student: {
            id,
            name,
            dateOfBirth,
            detail,
        },
        schedule: data,
    };
};

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const endPoint = `${TARGET_URL}&id=${id}`;

    request({ method: 'GET', uri: endPoint }, (error, _, body) => {
        if (error) {
            return res.status(500).json({ error: 'internal server error' });
        }
        const schedule = getData(body, res);
        !schedule ? res.send('err') : res.send(schedule);
    });
});
module.exports = router;