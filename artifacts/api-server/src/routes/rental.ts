import { Router, type IRouter } from "express";
import {
  CreateBookingBody,
  CreateCarBody,
  GetCarParams,
  ListBookingsQueryParams,
  ListCarsQueryParams,
  UpdateBookingStatusBody,
  UpdateBookingStatusParams,
  UpdateCarBody,
  UpdateCarParams,
} from "@workspace/api-zod";

type CarStatus = "available" | "booked" | "maintenance";
type BookingStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled";

type Car = {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  category: string;
  location: string;
  pricePerDay: number;
  imageUrl: string;
  status: CarStatus;
  seats: number;
  transmission: string;
  fuel: string;
  rating: number;
  trips: number;
  description: string | null;
};

type Booking = {
  id: string;
  carId: string;
  carName: string;
  renterName: string;
  renterEmail: string;
  startDate: string;
  endDate: string;
  total: number;
  status: BookingStatus;
  createdAt: string;
};

const cars: Car[] = [
  {
    id: "cayman-gts",
    name: "The GTS",
    make: "Porsche",
    model: "718 Cayman GTS",
    year: 2023,
    category: "Sports",
    location: "Bandra, Mumbai",
    pricePerDay: 12500,
    imageUrl:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85",
    status: "available",
    seats: 2,
    transmission: "Automatic",
    fuel: "Petrol",
    rating: 4.98,
    trips: 42,
    description:
      "A perfectly balanced mid-engine sports car for coastal roads, late exits, and the long way home.",
  },
  {
    id: "defender-110",
    name: "The Defender",
    make: "Land Rover",
    model: "Defender 110",
    year: 2024,
    category: "SUV",
    location: "Indiranagar, Bengaluru",
    pricePerDay: 9800,
    imageUrl:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=85",
    status: "available",
    seats: 5,
    transmission: "Automatic",
    fuel: "Diesel",
    rating: 4.96,
    trips: 31,
    description:
      "A calm, capable escape pod with room for the people and the plans you make after breakfast.",
  },
  {
    id: "mini-cooper-s",
    name: "The Mini",
    make: "MINI",
    model: "Cooper S",
    year: 2022,
    category: "City",
    location: "Hauz Khas, New Delhi",
    pricePerDay: 6200,
    imageUrl:
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1600&q=85",
    status: "booked",
    seats: 4,
    transmission: "Automatic",
    fuel: "Petrol",
    rating: 4.91,
    trips: 67,
    description:
      "Small footprint, huge personality. Built for turning a regular Tuesday into a good story.",
  },
  {
    id: "taycan-4s",
    name: "The Taycan",
    make: "Porsche",
    model: "Taycan 4S",
    year: 2024,
    category: "Electric",
    location: "Alwarpet, Chennai",
    pricePerDay: 15500,
    imageUrl:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1600&q=85",
    status: "available",
    seats: 4,
    transmission: "Automatic",
    fuel: "Electric",
    rating: 4.99,
    trips: 18,
    description:
      "Instant torque and quiet confidence for the kind of drive where the destination is optional.",
  },
];

const bookings: Booking[] = [
  {
    id: "bk-1042",
    carId: "mini-cooper-s",
    carName: "The Mini",
    renterName: "Aarav Mehta",
    renterEmail: "aarav@example.com",
    startDate: "2026-09-09",
    endDate: "2026-09-11",
    total: 12400,
    status: "confirmed",
    createdAt: "2026-09-06T14:20:00.000Z",
  },
  {
    id: "bk-1039",
    carId: "cayman-gts",
    carName: "The GTS",
    renterName: "Maya Iyer",
    renterEmail: "maya@example.com",
    startDate: "2026-09-15",
    endDate: "2026-09-18",
    total: 37500,
    status: "pending",
    createdAt: "2026-09-05T10:12:00.000Z",
  },
  {
    id: "bk-1028",
    carId: "defender-110",
    carName: "The Defender",
    renterName: "Kabir Shah",
    renterEmail: "kabir@example.com",
    startDate: "2026-08-28",
    endDate: "2026-08-31",
    total: 29400,
    status: "completed",
    createdAt: "2026-08-24T09:00:00.000Z",
  },
];

const activity = [
  {
    id: "activity-1",
    type: "booking",
    title: "New booking request",
    detail: "Maya requested The GTS for 3 days",
    timestamp: "12 min ago",
  },
  {
    id: "activity-2",
    type: "payment",
    title: "Payment received",
    detail: "₹12,400 from Aarav Mehta",
    timestamp: "2 hours ago",
  },
  {
    id: "activity-3",
    type: "fleet",
    title: "Listing viewed",
    detail: "The Taycan was viewed 18 times today",
    timestamp: "5 hours ago",
  },
];

function daysBetween(startDate: Date, endDate: Date) {
  return Math.max(
    1,
    Math.ceil((endDate.getTime() - startDate.getTime()) / 86_400_000),
  );
}

const router: IRouter = Router();

router.get("/cars", (req, res) => {
  const parsed = ListCarsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid car filters" });
    return;
  }

  const { search, category, status } = parsed.data;
  const normalizedSearch = search?.toLowerCase();
  const filtered = cars.filter((car) => {
    const matchesSearch =
      !normalizedSearch ||
      [car.name, car.make, car.model, car.location]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    const matchesCategory = !category || category === "all" || car.category === category;
    const matchesStatus = !status || status === "all" || car.status === status;
    return matchesSearch && matchesCategory && matchesStatus;
  });
  res.json(filtered);
});

router.post("/cars", (req, res) => {
  const parsed = CreateCarBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid car listing", details: parsed.error.flatten() });
    return;
  }

  const car: Car = {
    ...parsed.data,
    id: `car-${Date.now()}`,
    status: "available",
    rating: 0,
    trips: 0,
    description: parsed.data.description ?? null,
  };
  cars.unshift(car);
  res.status(201).json(car);
});

router.get("/cars/:id", (req, res) => {
  const parsed = GetCarParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid car id" });
    return;
  }
  const car = cars.find((item) => item.id === parsed.data.id);
  if (!car) {
    res.status(404).json({ error: "Car not found" });
    return;
  }
  res.json(car);
});

router.patch("/cars/:id", (req, res) => {
  const params = UpdateCarParams.safeParse(req.params);
  const body = UpdateCarBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid car update" });
    return;
  }
  const index = cars.findIndex((item) => item.id === params.data.id);
  if (index === -1) {
    res.status(404).json({ error: "Car not found" });
    return;
  }
  cars[index] = { ...cars[index], ...body.data };
  res.json(cars[index]);
});

router.delete("/cars/:id", (req, res) => {
  const parsed = GetCarParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid car id" });
    return;
  }
  const index = cars.findIndex((item) => item.id === parsed.data.id);
  if (index === -1) {
    res.status(404).json({ error: "Car not found" });
    return;
  }
  cars.splice(index, 1);
  res.status(204).send();
});

router.get("/bookings", (req, res) => {
  const parsed = ListBookingsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid booking filters" });
    return;
  }
  res.json(bookings);
});

router.post("/bookings", (req, res) => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid booking details", details: parsed.error.flatten() });
    return;
  }
  const car = cars.find((item) => item.id === parsed.data.carId);
  if (!car) {
    res.status(404).json({ error: "Car not found" });
    return;
  }
  if (car.status !== "available") {
    res.status(409).json({ error: "This car is not currently available" });
    return;
  }
  const startDate = new Date(parsed.data.startDate);
  const endDate = new Date(parsed.data.endDate);
  if (endDate <= startDate) {
    res.status(400).json({ error: "End date must be after start date" });
    return;
  }

  const booking: Booking = {
    id: `bk-${Date.now()}`,
    carId: car.id,
    carName: car.name,
    renterName: parsed.data.renterName,
    renterEmail: parsed.data.renterEmail,
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
    total: daysBetween(startDate, endDate) * car.pricePerDay,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  bookings.unshift(booking);
  car.status = "booked";
  res.status(201).json(booking);
});

router.patch("/bookings/:id/status", (req, res) => {
  const params = UpdateBookingStatusParams.safeParse(req.params);
  const body = UpdateBookingStatusBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid booking status" });
    return;
  }
  const booking = bookings.find((item) => item.id === params.data.id);
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  booking.status = body.data.status;
  const car = cars.find((item) => item.id === booking.carId);
  if (car && body.data.status === "cancelled") car.status = "available";
  if (car && ["confirmed", "active"].includes(body.data.status)) car.status = "booked";
  res.json(booking);
});

router.get("/dashboard/summary", (_req, res) => {
  const revenue = bookings
    .filter((booking) => ["confirmed", "active", "completed"].includes(booking.status))
    .reduce((sum, booking) => sum + booking.total, 0);
  const activeBookings = bookings.filter((booking) =>
    ["pending", "confirmed", "active"].includes(booking.status),
  ).length;
  const averageRating =
    cars.reduce((sum, car) => sum + car.rating, 0) / Math.max(cars.length, 1);
  res.json({
    revenue,
    revenueChange: 12.8,
    activeBookings,
    fleetUtilization: Math.round((activeBookings / Math.max(cars.length, 1)) * 100),
    totalCars: cars.length,
    averageRating: Number(averageRating.toFixed(2)),
  });
});

router.get("/activity", (_req, res) => {
  res.json(activity);
});

export default router;