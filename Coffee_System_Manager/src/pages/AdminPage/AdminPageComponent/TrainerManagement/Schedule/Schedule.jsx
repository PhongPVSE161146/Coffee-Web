import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, Button, Popover, Calendar, Checkbox, InputNumber, TimePicker, Switch, Select, DatePicker } from "antd";
import { IoPerson } from "react-icons/io5";
import { MdOutlineBusiness } from "react-icons/md";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
import "./Schedule.css";
import { fetchEvents, fetchDMEvents, fetchEventDetails, EventService, fetchFreeEvents } from "./ApiService/apiService";
import { showErrorNotification, showSuccessNotification, showInfoNotification, showWarningNotification } from "../../../../../components/Notifications/Notifications";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { CalendarMonth, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import ScheduleLoad from "./ScheduleLoad/ScheduleLoad";

const { RangePicker } = TimePicker;
dayjs.extend(isBetween);

const Schedule = () => {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [events, setEvents] = useState([]);
    const [DMevents, setDMEvents] = useState([]);
    const [freeEvents, setFreeEvents] = useState([]);
    const [ShowLoaderPopup, setShowLoaderPopup] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [visiblePopover, setVisiblePopover] = useState({});
    const [eventDetails, setEventDetails] = useState({});
    const [isNewEventModalVisible, setIsNewEventModalVisible] = useState(false);
    const [startEndDate, setStartEndDate] = useState(null);
    const [repeat, setRepeat] = useState(false);
    const [recurWeeks, setRecurWeeks] = useState(0);
    const [selectedDays, setSelectedDays] = useState([]);
    const [Open, setOpen] = useState(false);
    const [openTrainerCalendar, setOpenTrainerCalendar] = useState(false);
    const [isCooldown, setIsCooldown] = useState(false);
    const calendarRef = useRef(null);
    const navigate = useNavigate();



    const roleConfigs = {
        trainer: {
            path: sessionStorage.getItem("username"),
        },
        admin: {
            path: sessionStorage.getItem("accounttrainer"),
        },
        deliverymanager: {
            path: sessionStorage.getItem("username"),
        },
        // Add more roles here if needed
    };

    const role = sessionStorage.getItem("selectedRole");
    const { path } = roleConfigs[role] || {};

    const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    useEffect(() => {
        if (role === 'deliverymanager') return;
        loadFreeEvents();
    }, []);

    const loadFreeEvents = async () => {
        if (role === 'deliverymanager') return;
        try {
            const freeEventData = await fetchFreeEvents(path);

            // Sort events by start time to prioritize earlier events
            const sortedEvents = freeEventData.sort((a, b) => {
                return dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf();
            });

            const filteredEvents = [];

            sortedEvents.forEach(event => {
                const eventStart = dayjs(event.startTime);
                const eventEnd = dayjs(event.endTime);

                const isOverlapping = filteredEvents.some(existingEvent => {
                    const existingStart = dayjs(existingEvent.startTime);
                    const existingEnd = dayjs(existingEvent.endTime);

                    // Check for overlap based on dates and times
                    const sameDayOverlap = eventStart.isBefore(existingEnd) && eventEnd.isAfter(existingStart);

                    // Check for recurrence overlap (e.g., if both have recurrence)
                    const recurrenceOverlap = event.recur_time > 0 && existingEvent.recur_time > 0;

                    return sameDayOverlap || recurrenceOverlap;
                });

                // If no overlap, add the event to the filtered list
                if (!isOverlapping) {
                    filteredEvents.push(event);
                }
            });

            setFreeEvents(filteredEvents);
        } catch (error) {
            showErrorNotification("Failed to Load Freetime Schedule", `${error.message}`)
        }
    };

    const weekDaysMap = {
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6
    };

    const transformFreeEventsToFullCalendar = (freeEvents) => {
        return freeEvents
            .filter(event => !event.isDeleted)
            .flatMap(event => {
                let events = [];

                let start = dayjs(event.startTime);
                let end = dayjs(event.endTime);

                if (event.recur_time === 0) {
                    events.push({
                        id: `FRE-${event.id}`,
                        title: `Free time`,
                        start: start.toISOString(),
                        end: end.toISOString(),
                        extendedProps: {
                            attendeeType: "FREEFREE_TIME",
                            color: '#509ADF75',
                        },
                    });
                }

                Object.entries(weekDaysMap).forEach(([day, dayIndex]) => {
                    if (event[day]) {
                        let dayOfWeekStart = start.day(dayIndex);
                        let dayOfWeekEnd = end.day(dayIndex);

                        if (dayOfWeekStart.isBefore(start)) {
                            dayOfWeekStart = dayOfWeekStart.add(1, 'week');
                            dayOfWeekEnd = dayOfWeekEnd.add(1, 'week');
                        }

                        events.push({
                            id: `FRE-${event.id}-${day}`,
                            title: `Free time`,
                            start: dayOfWeekStart.toISOString(),
                            end: dayOfWeekEnd.toISOString(),
                            extendedProps: {
                                attendeeType: "FREEFREE_TIME",
                                color: '#509ADF75',
                            },
                        });

                        if (event.recur_time > 0) {
                            for (let i = 1; i < event.recur_time; i++) {
                                let newStart = dayOfWeekStart.add(i * 7, 'day');
                                let newEnd = dayOfWeekEnd.add(i * 7, 'day');

                                events.push({
                                    id: `FRE-${event.id}-${day}-${i}`,
                                    title: `Free time`,
                                    start: newStart.toISOString(),
                                    end: newEnd.toISOString(),
                                    extendedProps: {
                                        attendeeType: "FREEFREE_TIME",
                                        color: '#509ADF75',
                                    },
                                });
                            }
                        }
                    }
                });

                return events;
            });
    };

    useEffect(() => {
        if (role === 'deliverymanager') return;
        loadEvents();
    }, []);

    const loadEvents = async () => {
        if (role === 'deliverymanager') return;
        try {
            setShowLoaderPopup(true);
            const eventData = await fetchEvents(path);
            if (eventData) { setShowLoaderPopup(false); }
            const eventsData = transformDataToEvents(eventData);
            setEvents(eventsData);

            eventData.forEach(event => {
                loadEventDetails(event.id);
            });
        } catch (error) {
            setShowLoaderPopup(false);
            showErrorNotification("Failed to Load Event Schedule", `${error.message}`);
        }
    };

    useEffect(() => {
        if (role != 'deliverymanager') return;
        loadDMEvents();
    }, []);

    const loadDMEvents = async () => {
        if (role != 'deliverymanager') return;
        try {
            setShowLoaderPopup(true);
            const eventDataDM = await fetchDMEvents();
            if (eventDataDM) { setShowLoaderPopup(false); }
            const eventsDataDM = transformDataToDMEvents(eventDataDM);
            setDMEvents(eventsDataDM);
            //loadDMEventDetails(dayjs(event.sendDate).format('YYYY-MM-DDTHH:mm:ss'));

        } catch (error) {
            setShowLoaderPopup(false);
            showErrorNotification("Failed to Load Event Schedule", `${error.message}`);
        }
    };

    const loadEventDetails = async (section) => {
        try {
            const details = await fetchEventDetails(section);
            setEventDetails(prevDetails => ({
                ...prevDetails,
                [section]: details
            }));
        } catch (error) {
            showErrorNotification("Error loading event details", `${error.message}`);
        }
    };

    const transformDataToDMEvents = (data) => {
        const now = dayjs();
        const currentDate = dayjs(now).format("YYYY-MM-DDTHH:mm");

        const eventsMap = new Map();

        // Iterate through the data
        data
            .filter(event =>
                dayjs(event.sendDate).isBefore(dayjs(event.expiredDate)) ||
                dayjs(event.sendDate).isSame(dayjs(event.expiredDate))
            )
            .forEach((event) => {
                const sendDateTime = dayjs(event.sendDate);
                const startKey = sendDateTime.format("YYYY-MM-DDTHH:mm"); // Group by this key
                const endDate = sendDateTime.add(2, "hour").format("YYYY-MM-DDTHH:mm"); // Fixed 1-hour duration

                if (!eventsMap.has(startKey)) {
                    eventsMap.set(startKey, {});
                }

                const group = eventsMap.get(startKey);

                // Group by feedbackTemplateName
                if (!group[event.feedbackTemplateName]) {
                    group[event.feedbackTemplateName] = {
                        id: `${startKey}-${event.feedbackTemplateName}`, // Unique identifier
                        title: event.feedbackTemplateName, // Event title
                        start: startKey, // Start datetime
                        end: endDate, // End datetime
                        extendedProps: {
                            feedbackTemplateName: event.feedbackTemplateName,
                            classes: new Set(), // Use Set to ensure unique className values
                            color: "#F66800" // Fixed color for this example
                        }
                    };
                }

                // Add the className to the list
                group[event.feedbackTemplateName].extendedProps.classes.add(event.className);
            });

        // Convert the Map into an array of events
        const events = [];
        eventsMap.forEach((group) => {
            Object.values(group).forEach((event) => {
                event.extendedProps.classes = Array.from(event.extendedProps.classes); // Convert Set to Array
                events.push(event);
            });
        });

        return events;
    };

    const transformDataToEvents = (data) => {
        const events = [];
        const attendeeColors = {
            INTERN: '#2F903F',
            FRESHER: '#F66800',
            FREEFREE_TIME: '#509ADF75',
        };

        data
            .filter(event => !event.deleted)
            .forEach((event) => {
                const startDate = dayjs(event.startDate);
                const endDate = dayjs(event.endDate);

                event.dayParam
                    .filter(section => !section.deleted)
                    .forEach((section) => {
                        const selectedDays = section.selectedDayOfWeek.split(",").map(day => day.trim());
                        let currentDate = startDate.clone();
                        while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
                            const currentDayOfWeek = currentDate.format('dddd');
                            if (selectedDays.includes(currentDayOfWeek)) {
                                const start = section[`start${capitalize(currentDayOfWeek)}`];
                                const end = section[`end${capitalize(currentDayOfWeek)}`];
                                if (start && end) {
                                    events.push({
                                        id: `${event.id}-${section.id}-${currentDayOfWeek}-${currentDate.format('YYYY-MM-DD')}`,
                                        title: event.module.name,
                                        start: currentDate.format('YYYY-MM-DD') + 'T' + start,
                                        end: currentDate.format('YYYY-MM-DD') + 'T' + end,
                                        extendedProps: {
                                            attendeeType: event.attendeeType,
                                            section: event.id,
                                            color: attendeeColors[event.attendeeType] || '#ffffff',
                                        },
                                    });
                                }
                            }
                            currentDate = currentDate.add(1, 'day');
                        }
                    });
            });


        return events;
    };



    const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const handleSelect = (selectInfo) => {
        const start = dayjs(selectInfo.start);
        const end = dayjs(selectInfo.end);

        setStartEndDate([start, end]);

        setNewEvent({
            title: "New Event",
            start: start,
            end: end,
            color: "#00bfa5",
        });

        setIsNewEventModalVisible(true);
    };

    const handleDatePickerClick = () => {
        if (isCooldown) return;

        setIsCooldown(true);
        setOpen(!Open);

        setTimeout(() => {
            setIsCooldown(false);
        }, 1000);
    };

    const renderWeekRange = () => {
        const startOfWeek = selectedDate.startOf("week").add(1, "day");
        const endOfWeek = startOfWeek.add(5, "day");

        return `${("   ")}${startOfWeek.format("DD/MM/YYYY")}${("                  ")}${endOfWeek.format("DD/MM/YYYY")}`;
    };

    const monthOptions = Array.from({ length: 12 }, (_, i) => ({
        value: i,
        label: dayjs().month(i).format("MMMM"),
    }));

    const handleMonthChange = (month) => {
        const newDate = selectedDate.month(month);
        setSelectedDate(newDate);
        calendarRef.current.getApi().gotoDate(newDate.format("YYYY-MM-DD"));
    };

    //Calendar go to the previous month
    const handlePrevMonth = () => {
        const newDate = selectedDate.subtract(1, "month");
        setSelectedDate(newDate);
        calendarRef.current.getApi().gotoDate(newDate.format("YYYY-MM-DD"));
    };

    //Calendar go to the next month
    const handleNextMonth = () => {
        const newDate = selectedDate.add(1, "month");
        setSelectedDate(newDate);
        calendarRef.current.getApi().gotoDate(newDate.format("YYYY-MM-DD"));
    };

    const handleSaveNewEvent = async () => {
        if (!startEndDate) { showWarningNotification("Please select Start time and End time"); return; }

        const [start, end] = startEndDate;
        const now = dayjs();

        if (!start.isAfter(now) && !end.isAfter(now)) {
            showWarningNotification("Invalid, cannot register in the past!");
            return;
        }

        if (start.isSame(now, 'day') && start.diff(now, 'minute') < 30) {
            showWarningNotification("Start time must be at least 30 minutes later!");
            return;
        }

        if (!start.isBefore(end)) {
            showWarningNotification("End time cannot be after Start time!");
            return;
        }

        if (!start.isSame(end, 'day')) {
            showWarningNotification("Please have Start time and End time be on the same day");
            return;
        }

        const newEventData = {
            trainerAccount: path,
            start_time: start.toISOString(),
            end_time: end.toISOString(),
            recur_time: recurWeeks,
            monday: selectedDays.includes("Monday"),
            tuesday: selectedDays.includes("Tuesday"),
            wednesday: selectedDays.includes("Wednesday"),
            thursday: selectedDays.includes("Thursday"),
            friday: selectedDays.includes("Friday"),
            saturday: selectedDays.includes("Saturday"),
        };

        try {
            const response = await EventService.createEvent(newEventData);

            const freeEventData = await fetchFreeEvents(path);
            setFreeEvents(freeEventData);

            setIsNewEventModalVisible(false);
            setNewEvent(null);
            setStartEndDate(null);
            setRepeat(false);
            setRecurWeeks(0);
            setSelectedDays([]);
            showSuccessNotification('Save new event success')
        } catch (error) {
            //console.error("Error creating new event:", error);
        }
    };

    const handleCancelNewEvent = () => {
        setIsNewEventModalVisible(false);
        setNewEvent(null);
        setStartEndDate(null);
        setRepeat(false);
        setRecurWeeks(0);
        setSelectedDays([]);
    };

    const handleEventClick = (info) => {
        const start = dayjs(info.event.start);
        const end = dayjs(info.event.end);

        setSelectedEvent({
            id: info.event.id,
            title: info.event.title,
            start: start,
            end: end,
            section: info.event.extendedProps.section,
        });
        setVisiblePopover((prev) => ({ ...prev, [info.event.id]: true }));
        const scheduledDate = start.format('YYYY-MM-DDTHH:mm:ss');
        {
            role === 'deliverymanager' && (
                navigate(`/DeliveryManagerPage/scheduleDetail?date=${scheduledDate}`)
            )
        }
    };

    const handleEdit = (eventId) => {
        setIsModalVisible(true);
        setVisiblePopover((prev) => ({ ...prev, [eventId]: false }));
    };

    const handleRemove = (eventId) => {
        showInfoNotification("Remove function currently unavailable", `The event ID is: ${eventId}`)
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedEvent(null);
    };

    const handleDaysChange = (day) => {
        setSelectedDays((prevDays) =>
            prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]
        );
        setOpen(false);
    };

    const handleTodayClick = () => {
        const fullCalendarApi = calendarRef.current.getApi();
        const today = dayjs();

        fullCalendarApi.gotoDate(today.format("YYYY-MM-DD"));
        setSelectedDate(today);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click is outside the left-calendar
            const leftCalendar = document.querySelector(".left-calendar");
            const customDatePicker = document.querySelector(".custom-date-picker-wrapper");
            if (Open && leftCalendar && !leftCalendar.contains(event.target) &&
                customDatePicker && !customDatePicker.contains(event.target)) {
                setOpen(false); // Close the calendar
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [Open]);

    const customDatePicker = (
        <DatePicker className="datePicker"
            value={selectedDate}
            format={() => renderWeekRange()}
            onClick={handleDatePickerClick}
            open={false}
            suffixIcon={<><ArrowRightOutlined /> <CalendarMonth /></>}
            inputReadOnly
            allowClear={false}
            disabled={isCooldown}
        />
    );

    return (
        <div className="calendar-container">
            {role === 'deliverymanager' ? (<>
                {ShowLoaderPopup ? (<ScheduleLoad />) : (<>
                    <div className={`left-calendar ${Open ? '' : 'close'}`} style={{ zIndex: '10' }}>
                        <div className="calendar-navigation">
                            <Button
                                type="text"
                                icon={<ArrowLeftOutlined />}
                                onClick={handlePrevMonth}
                                onMouseDown={(e) => e.stopPropagation()}
                            />
                            <Button
                                type="text"
                                icon={<ArrowRightOutlined />}
                                onClick={handleNextMonth}
                                onMouseDown={(e) => e.stopPropagation()}
                            />
                        </div>

                        <Select
                            className="customMonthselect"
                            style={{ width: 90, display: 'flex', justifyContent: 'center' }}
                            value={selectedDate.month()}
                            onChange={handleMonthChange}
                            options={monthOptions}
                            virtual={false}
                        />
                        <Calendar
                            fullscreen={false}
                            mode="month"
                            value={selectedDate}
                            onSelect={(value) => {
                                const fullCalendarApi = calendarRef.current.getApi();
                                fullCalendarApi.gotoDate(value.format("YYYY-MM-DD"));
                                setSelectedDate(value);
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            style={{ "--calendar-month-dropdown": "none" }}
                        />

                    </div>

                    <div className="right-calendar" >
                        <div className="fc-toolbar-chunk custom-date-picker-wrapper" style={{ position: "absolute", right: 80, top: 20, transition: 'width 0.3s ease' }}  >
                            {customDatePicker}
                        </div>
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            events={[...DMevents]}
                            selectable={false}
                            select={handleSelect}
                            eventClick={handleEventClick}
                            slotMinTime="07:00:00"
                            slotMaxTime="21:00:00"
                            allDaySlot={false}
                            slotDuration="00:30:00"
                            height="auto"
                            hiddenDays={[0]}
                            headerToolbar={{
                                left: "title",
                            }}
                            eventContent={(arg) => {
                                return (
                                    <Popover
                                        overlayInnerStyle={{ padding: "0 5px 10px 5px", backgroundImage: 'linear-gradient(to left top, #efefef, #f3f3f3, #f7f7f7, #fbfbfb, #ffffff)', boxShadow: '4px 2px 10px #00000066', outline: '0.2px solid #ccc' }}
                                        content={
                                            <div>
                                                <p className="pop-line" style={{
                                                    color: arg.event.extendedProps.color,
                                                }}>
                                                    <strong>{arg.event.title}</strong>
                                                </p>
                                                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                                                    {arg.event.extendedProps.classes.map((className, index) => (
                                                        <li key={index} style={{ margin: 0, listStyle: 'none' }}>{className}</li>
                                                    ))}
                                                </ul>
                                            </div>}
                                        trigger="hover"
                                        open={visiblePopover[arg.event.id] || false}
                                        onOpenChange={(visible) =>
                                            setVisiblePopover((prev) => ({
                                                ...prev,
                                                [arg.event.id]: visible,
                                            }))
                                        }
                                    >
                                        <div
                                            className="fc-event-title"
                                            style={{
                                                backgroundColor: arg.event.extendedProps.color, border: 'none', outline: 'none', margin: 0, width: '100%', height: '100%',
                                                display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'
                                            }}
                                        >
                                            <strong style={{ minHeight: '32px', maxHeight: '64px', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{arg.event.title}</strong>
                                            <div>
                                                <p style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'start', alignItems: 'end', width: '100%', fontWeight: 200, paddingLeft: '20px', overflow: 'hidden' }}>
                                                    <div style={{ minWidth: '40px', textWrap: 'nowrap' }}>Send To:</div> <ul style={{ padding: '0px', margin: '0 0 0 10px', minWidth: '40px', maxWidth: '100px' }}>
                                                        {arg.event.extendedProps.classes.map((className, index) => (
                                                            <li key={index} style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{className}</li>
                                                        ))}
                                                    </ul>
                                                </p>
                                            </div>
                                        </div>
                                    </Popover>
                                );
                            }}
                        />
                    </div>
                </>)}
            </>) : (<>
                {ShowLoaderPopup ? (<ScheduleLoad />) : (<>
                    <div className="left-calendar trainer">
                        <Calendar
                            fullscreen={false}
                            mode="month"
                            value={selectedDate}
                            onSelect={(value) => {
                                const fullCalendarApi = calendarRef.current.getApi();
                                fullCalendarApi.gotoDate(value.format("YYYY-MM-DD"));
                                setSelectedDate(value);
                            }}
                        />

                        <div id="schedule-tip">
                            <div>
                                <p> <span> ● </span> Fresher</p>
                                <p> <span> ● </span> Intern</p>
                                <p> <span> ● </span> Freetime</p>
                            </div>
                        </div>
                        <div className={`expand-arrow ${openTrainerCalendar ? "" : "calCollapsed"}`}>
                            {openTrainerCalendar ? (<KeyboardArrowLeft onClick={() => setOpenTrainerCalendar(!openTrainerCalendar)} />) : (<KeyboardArrowRight onClick={() => setOpenTrainerCalendar(!openTrainerCalendar)} />)}
                        </div>
                    </div>

                    <div className="right-calendar trainer">
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            events={[...events, ...transformFreeEventsToFullCalendar(freeEvents)]}
                            selectable={true}
                            select={handleSelect}
                            eventClick={handleEventClick}
                            slotMinTime="07:00:00"
                            slotMaxTime="21:00:00"
                            allDaySlot={false}
                            slotDuration="00:30:00"
                            height="auto"
                            hiddenDays={[0]}
                            headerToolbar={{
                                left: "today",
                                center: "title",
                                right: "dayGridMonth,timeGridWeek,timeGridDay",
                            }}
                            customButtons={{
                                today: {
                                    text: 'Today',
                                    click: handleTodayClick
                                },
                            }}
                            eventContent={(arg) => {
                                const isFreeEvent = arg.event.extendedProps.attendeeType === "FREEFREE_TIME";
                                return (
                                    <Popover
                                        overlayInnerStyle={{ padding: "5px", backgroundImage: 'linear-gradient(to left top, #efefef, #f3f3f3, #f7f7f7, #fbfbfb, #ffffff)', boxShadow: '4px 2px 10px #00000066', outline: '0.2px solid #ccc' }}
                                        content={isFreeEvent ?
                                            <div>
                                                <p className="pop-line" style={{
                                                    color: arg.event.extendedProps.color,
                                                }}>
                                                    <strong>{arg.event.title}</strong>
                                                </p>
                                            </div> : (
                                                <div>
                                                    {eventDetails[arg.event.extendedProps.section] ? (
                                                        <>
                                                            <p className="pop-line" style={{
                                                                color: arg.event.extendedProps.color,
                                                            }}>
                                                                <strong>{arg.event.title}</strong>
                                                            </p>
                                                            <p className="pop-line">
                                                                <MdOutlineBusiness />
                                                                <strong className="pop-line-text">Location:</strong> {eventDetails[arg.event.extendedProps.section][0].location}
                                                            </p>
                                                            <p className="pop-line">
                                                                <IoPerson />
                                                                <strong className="pop-line-text">Admin:</strong> {eventDetails[arg.event.extendedProps.section][0].admin}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <p>Loading...</p>
                                                    )}
                                                </div>
                                            )}
                                        trigger="click"
                                        open={visiblePopover[arg.event.id] || false}
                                        onOpenChange={(visible) =>
                                            setVisiblePopover((prev) => ({
                                                ...prev,
                                                [arg.event.id]: visible,
                                            }))
                                        }
                                    >
                                        <div
                                            className="fc-event-title"
                                            style={{
                                                backgroundColor: arg.event.extendedProps.color,
                                                display: 'flex', flexDirection: 'column', justifyContent: 'start', gap: '10px'
                                            }}
                                        >
                                            <div style={{ height: '32px', maxWidth: '80px' }}>{dayjs(arg.event.start).format("HH:mm")}</div>
                                            <strong style={{ minHeight: '32px', maxHeight: '64px' }}>{arg.event.title}</strong>
                                        </div>
                                    </Popover>
                                );
                            }}
                        />
                    </div>

                    <Modal
                        title="Create New Event"
                        open={isNewEventModalVisible}
                        onCancel={handleCancelNewEvent}
                        footer={null}
                    >
                        <div className="event-form">
                            <div className="date-range-picker">
                                <RangePicker
                                    value={startEndDate}
                                    onChange={(dates) => setStartEndDate(dates)}
                                    format="DD-MM-YYYY HH:mm"
                                    showTime={{ format: 'HH:mm' }}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div className="repeat-toggle">
                                <label>Repeat</label>
                                <Switch checked={repeat} onChange={setRepeat} />
                            </div>

                            {repeat && (
                                <div className="repeat-options">
                                    <label>Recur every</label>
                                    <InputNumber
                                        min={0}
                                        value={recurWeeks}
                                        onChange={setRecurWeeks}
                                        style={{ marginRight: 10 }}
                                    />
                                    <span>Week(s) on:</span>
                                    <div className="day-checkboxes">
                                        {dayOptions.map((day) => (
                                            <Checkbox
                                                key={day}
                                                checked={selectedDays.includes(day)}
                                                onChange={() => handleDaysChange(day)}
                                            >
                                                {day}
                                            </Checkbox>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="modal-footer">
                                <Button onClick={handleCancelNewEvent} style={{ marginRight: 10 }}>
                                    Cancel
                                </Button>
                                <Button type="primary" onClick={handleSaveNewEvent}>
                                    Save
                                </Button>
                            </div>
                        </div>
                    </Modal>

                    <Modal
                        title="Edit Event"
                        open={isModalVisible}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="back" onClick={handleCancel}>
                                Cancel
                            </Button>,
                            <Button key="submit" type="primary" >
                                Save
                            </Button>,
                        ]}
                    >
                        <p>{selectedEvent?.title}</p>
                        <p>Start: {selectedEvent?.start.format("YYYY-MM-DD HH:mm:ss")}</p>
                        <p>End: {selectedEvent?.end.format("YYYY-MM-DD HH:mm:ss")}</p>
                    </Modal>
                </>)}
            </>
            )}
        </div>
    );
};

export default Schedule;