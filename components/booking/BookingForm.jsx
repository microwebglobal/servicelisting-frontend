import React, { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, MapPin, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BookingForm = ({ onBookingSubmit }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    bookingDate: new Date(),
    startTime: '',
    serviceAddress: '',
    serviceLocation: '',
    customerNotes: ''
  });
  const [validationError, setValidationError] = useState('');

  const generateTimeSlots = useCallback(() => {
    const slots = [];
    const startHour = 11;
    const endHour = 20;
    
    for (let hour = startHour; hour <= endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour !== endHour) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  }, []);

  const handleInputChange = (field, value) => {
    setBookingDetails(prev => ({
      ...prev,
      [field]: value
    }));
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!bookingDetails.startTime) {
      setValidationError('Please select a time slot');
      return;
    }
    if (!bookingDetails.serviceAddress.trim()) {
      setValidationError('Please enter service address');
      return;
    }
    if (!bookingDetails.serviceLocation.trim()) {
      setValidationError('Please enter service location');
      return;
    }

    try {
      setIsSubmitting(true);
      await onBookingSubmit(bookingDetails);
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to process your booking. Please try again.',
        variant: 'destructive'
      });
      setValidationError(error.message || 'Failed to process your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = generateTimeSlots();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Schedule Your Service
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Calendar
                mode="single"
                selected={bookingDetails.bookingDate}
                onSelect={(date) => handleInputChange('bookingDate', date)}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Time Slot</label>
              <Select 
                onValueChange={(value) => handleInputChange('startTime', value)}
                value={bookingDetails.startTime}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Service Address
              </label>
              <Input
                placeholder="Enter complete service address"
                value={bookingDetails.serviceAddress}
                onChange={(e) => handleInputChange('serviceAddress', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location Details</label>
              <Input
                placeholder="Apartment/Floor/Landmark"
                value={bookingDetails.serviceLocation}
                onChange={(e) => handleInputChange('serviceLocation', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Special Instructions
              </label>
              <Textarea
                placeholder="Any special instructions for the service provider..."
                value={bookingDetails.customerNotes}
                onChange={(e) => handleInputChange('customerNotes', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {validationError && (
            <Alert variant="destructive">
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Confirm Booking'}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default BookingForm;