import Trip from "../models/tripModel.js";
import catchAsyncError from "../utils/catchAsyncError.js";

/**
 * @desc Create a new trip
 * @route POST /api/trips
 * @access Private (Authenticated Users)
 */
export const createTrip = catchAsyncError(async (req, res) => {
    const { title, description, when, where, slots } = req.body;
    const newTrip = new Trip({ 
        title, 
        description, 
        when, 
        where, 
        slots, 
        createdBy: req.user._id 
    });

    await newTrip.save();
    res.status(201).json(newTrip);
});

/**
 * @desc Get all trips
 * @route GET /api/trips
 * @access Public
 */
export const getTrips = catchAsyncError(async (req, res) => {
    const trips = await Trip.find().populate("createdBy", "_id name email");
    res.status(200).json({
        trips,
        message:'Trips fetched successfully'
    });
});

/**
 * @desc Get my trips
 * @route GET /api/trips
 * @access Private
 */
export const getMyTrips = catchAsyncError(async (req, res) => {
    const user = req.user;
    console.log(user);

    const trips = await Trip.find({ createdBy: user?._id })
        .populate("requests.user", "firstname lastname email") 
        .populate("participants", "firstname lastname email");

    res.status(200).json({
        trips,
        message: "Trips fetched successfully",
    });
});



export const getTripById = catchAsyncError(async (req, res) => {
    const trip = await Trip.findById(req.params.id).populate("createdBy", "name email").populate("participants", "name email");

    if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json(trip);
});


export const updateTrip = catchAsyncError(async (req, res) => {
    const { title, description, when, where, slots, status } = req.body;
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
    }

    trip.title = title || trip.title;
    trip.description = description || trip.description;
    trip.when = when || trip.when;
    trip.where = where || trip.where;
    trip.slots = slots || trip.slots;
    trip.status = status || trip.status;

    await trip.save();
    res.status(200).json(trip);
});


export const deleteTrip = catchAsyncError(async (req, res) => {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
    }

    await trip.deleteOne();
    res.status(200).json({ message: "Trip deleted successfully" });
});


export const sendJoinRequest = catchAsyncError(async (req, res) => {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
    }

    const existingRequest = trip.requests.find(req => req.user.toString() === req.user._id.toString());
    if (existingRequest) {
        return res.status(400).json({ message: "You have already requested to join this trip" });
    }

    trip.requests.push({ user: req.user._id });
    await trip.save();

    res.status(200).json({ message: "Join request sent successfully" });
});


export const manageJoinRequest = catchAsyncError(async (req, res) => {
    const { status } = req.body;
    const { tripId, requestId } = req.params;

    if (!status || !["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status provided" });
    }

    const trip = await Trip.findById(tripId).populate("requests.user");

    if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to manage requests" });
    }

    // Find the request
    const requestIndex = trip.requests.findIndex((r) => r._id.toString() === requestId);
    if (requestIndex === -1) {
        return res.status(404).json({ message: "Join request not found" });
    }

    const request = trip.requests[requestIndex];

    // Prevent duplicate acceptances
    if (status === "accepted") {
        if (trip.participants.includes(request.user._id)) {
            return res.status(400).json({ message: "User already a participant" });
        }

        // Check if the trip still has slots available
        if (trip.participants.length >= trip.slots) {
            return res.status(400).json({ message: "Trip is already full" });
        }

        // Add user to participants
        trip.participants.push(request.user._id);
    }

    // Remove the request from the list
    trip.requests.splice(requestIndex, 1);
    
    if(trip.participants.length === trip.slots){
        trip.status = 'closed'
    }

    await trip.save();
    res.status(200).json({ message: `Join request ${status} successfully` });
});


/**
 * @desc Update trip status
 * @route PATCH /api/trips/:id/status
 * @access Private (Trip Creator Only)
 */
export const updateTripStatus = catchAsyncError(async (req, res) => {
    const { status } = req.body;
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
    }

    if (!["active", "on hold", "closed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
    }

    trip.status = status;
    await trip.save();

    res.status(200).json({ message: `Trip status updated to ${status}` });
});
