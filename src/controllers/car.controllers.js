import prisma from '../prisma.js';
import { getIO } from '../socket.js';

//function to get all the vehicules or their own for admin users
export const getVehicles = async (req, res) => {
  const { id } = req.params;

  // If an ID is provided, fetch that specific vehicle
  if (id) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: { position: true, user: true }
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // If user is not admin, ensure they own the vehicle
    if (req.user.role !== 'ADMIN' && vehicle.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return res.json(vehicle);
  }

  // If no ID is provided:
  if (req.user.role === 'ADMIN') {
    // Admin can view all vehicles
    const vehicles = await prisma.vehicle.findMany({
      include: { position: true, user: true }
    });
    return res.json(vehicles);
  } else {
    // Regular users can only view their own vehicles
    const vehicles = await prisma.vehicle.findMany({
      where: { userId: req.user.id },
      include: { position: true }
    });
    return res.json(vehicles);
  }
};


export const createVehicle = async (req, res) => {
  const { license, brand, color, model, lat, lng } = req.body;

  const position = await prisma.position.create({ data: { lat, lng } });

  const vehicle = await prisma.vehicle.create({
    data: {
      license,
      brand,
      color,
      model,
      userId: req.user.id,
      positionId: position.id
    },
  });

  res.status(201).json(vehicle);
};

export const updateVehiclePosition = async (req, res) => {
  const { lat, lng } = req.body;
  const { id } = req.params;

  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) return res.status(404).json({ message: 'Not found' });

  const existing = await prisma.position.findUnique({ where: { vehicleId: id } });
  if (!existing) {
    await prisma.position.create({ data: { lat, lng, vehicleId: id } });
  } else {
    await prisma.position.update({ where: { vehicleId: id }, data: { lat, lng } });
  }

  // Emit real-time update
  const io = getIO();
  io.emit('position:update', { vehicleId: id, lat, lng });
  io.to(`vehicle:${id}`).emit('position:update', { vehicleId: id, lat, lng });

  res.json({ message: 'Position updated' });
};

export const deleteOwnVehicle = async (req, res) => {
    const { id } = req.params;
  
    const vehicle = await prisma.vehicle.findUnique({
      where: { id }
    });
  
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
  
    if (vehicle.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
  
    await prisma.vehicle.delete({ where: { id } });
  
    res.json({ message: 'Vehicle deleted successfully' });
  };

  export const deleteAnyVehicle = async (req, res) => {
    const { id } = req.params;
  
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Admin only' });
    }
  
    const vehicle = await prisma.vehicle.findUnique({
      where: { id }
    });
  
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
  
    await prisma.vehicle.delete({ where: { id } });
  
    res.json({ message: 'Vehicle deleted by admin' });
  };