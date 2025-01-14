import React, { useState, useEffect } from 'react';
import { format, addDays, setHours, setMinutes, parse } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BookingForm = ({ onBookingSubmit }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  useEffect(() => {
    // Generate time slots from 11 AM to 8:30 PM with 30-minute intervals
    const slots = [];
    let currentTime = setHours(setMinutes(new Date(), 0), 11); // Start at 11:00 AM
    const endTime = setHours(setMinutes(new Date(), 30), 20); // End at 8:30 PM

    while (currentTime <= endTime) {
      slots.push(format(currentTime, 'HH:mm'));
      currentTime = addMinutes(currentTime, 30);
    }

    setAvailableTimeSlots(slots);
  }, []);

  const addMinutes = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60000);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!selectedDate || !selectedTime) {
      return; // Exit if required fields are missing
    }
    
    const bookingDetails = {
      bookingDate: format(selectedDate, 'yyyy-MM-dd'),
      startTime: selectedTime
    };
    
    // Call the parent component's submit handler
    if (typeof onBookingSubmit === 'function') {
      onBookingSubmit(bookingDetails);
    }
  };

  const formatTimeSlot = (timeString) => {
    try {
      const parsedDate = parse(timeString, 'HH:mm', new Date());
      return format(parsedDate, 'h:mm a');
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Select Service Date & Time</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Time Slot</label>
            <Select onValueChange={handleTimeSelect} value={selectedTime}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {availableTimeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {formatTimeSlot(time)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit"
            className="w-full" 
            disabled={!selectedDate || !selectedTime}
          >
            Continue to Cart
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default BookingForm;