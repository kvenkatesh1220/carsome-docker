const Moment = require("moment");
const MomentRange = require("moment-range");

const moment = MomentRange.extendMoment(Moment);

const workEndHrs = 18;
const workEndMin = 0;
const workStartHrs = 9;
const workStartMin = 0;
const timings = [];


function getSlots(req, res) {
    try {
        const dateString = req.query.date;
        if (!dateString) {
            return res.status(400).json({ message: "Date Required" });
        }
        if (moment().format('YYYY-MM-DD') > moment(dateString).format('YYYY-MM-DD')) {
            return res.status(404).json({ message: "You can select Today or Features Date." });
        }
        const slots = generateSlots(dateString);
        return res.status(200).json(slots);
    } catch (e) {
        console.log(e);
        return res.status(400).json({ message: e.message });
    }
}

function bookASlot(req, res) {
    try {
        const body = req.body;
        const slotObj = timings.find(slotObj => slotObj.date == body.date);
        const slot = slotObj.slots.find(slot => slot.id == body.id && slot.time == body.time);
        if (slot.status) {
            return res.status(400).json({ message: `Slot already reserved. Please Try for other Slot. ` });
        }
        if (slot.__v != body.__v) {
            return res.status(400).json({ message: `Slot already reserved. Please Try for other Slot. ` });
        }
        slot.status = 1;
        slot.__v++;
        return res.status(200).json({ message: `Booking Conformed on ${body.date} ${body.time} ` });
    } catch (e) {
        return res.status(e.response.status).json({ message: e.message });
    }
}

function generateSlots(dateString) {
    let startTime = moment();
    const startTimeArr = moment(startTime).format("hh:mm").split(":");
    let nextSlotStartsMin = Math.ceil(startTimeArr[1] / 15) * 15;

    const workingHoursStart = moment(dateString).hours(workStartHrs).minute(workStartMin);
    const officeEnd = moment(dateString).hours(workEndHrs).minute(workEndMin);

    const slotObj = timings.find(slot => slot.date == dateString);
    
    if (dateString == startTime.format("YYYY-MM-DD")) {
        if (workingHoursStart < startTime && officeEnd < startTime) {
            console.log("Wrong Hours");
            return;
        }
        startTime = startTime.add(1, "hour");
        startTime.add(nextSlotStartsMin - startTimeArr[1], "minutes");
        if (slotObj) {
            const startingSlot = slotObj.slots.find(slot => {
                if(slot.time.startsWith(startTime.format("hh:mm"))) {
                    return slot;
                }
            });
            const filteredSlots = slotObj.slots.filter(slot => slot.id >= startingSlot.id);
            return {date : slotObj.date, slots : filteredSlots};
        }
    } else {
        if (slotObj) {
            return slotObj;
        }
        startTime = moment(dateString)
            .add(workStartHrs, "hour")
            .add(workStartMin, "minutes");
    }

    const officeStart = startTime;
    console.log(
        officeStart.format("YYYY-MM-DD h:mm:ss a"),
        "----",
        officeEnd.format("YYYY-MM-DD h:mm:ss a")
    );
    const day = moment.range(officeStart, officeEnd);
    const time_slots = Array.from(day.by("minutes", { step: 15 }));

    const slotsArry = [];
    for (var i = 0; i <= time_slots.length; i++) {
        if (time_slots[i + 1]) {
            slotsArry.push({
                time: `${time_slots[i].format('hh:mm')} - ${time_slots[i + 1].format('hh:mm')}`,
                status: 0,
                __v: 0,
                id: i + 1
            });
        }
    }
    // console.log(JSON.stringify(slotsArry, 0, 2));
    const returnObj = { date: dateString, slots: slotsArry };
    timings.push(returnObj);
    return returnObj;
}




module.exports = {
    getSlots,
    bookASlot,
};