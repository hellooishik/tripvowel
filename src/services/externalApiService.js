import axios from "axios";

// Stubs: replace with real providers (Amadeus, Skyscanner, Booking.com, Uber/local)
export const fetchFlights = async ({ from, to, departDate, returnDate, pax = 1 }) => {
  // call provider; normalize fields
  // return [{provider, price, flightNo, departTime, arriveTime, duration, link}]
  return [{ provider: "MockAir", price: 199, flightNo: "MA101", departTime: departDate, arriveTime: departDate, duration: "4h 10m", link: "#" }];
};

export const fetchHotels = async ({ location, checkIn, checkOut, rooms = 1 }) => {
  return [{ provider: "MockHotel", name: "Central Inn", price: 59, rating: 4.2, link: "#" }];
};

export const fetchCabs = async ({ location, date, pax = 1 }) => {
  return [{ provider: "MockCab", type: "Sedan", price: 18, etaMin: 5 }];
};
