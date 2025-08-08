import prisma from '../prisma.js';

//function to get all the vehicules for admin users
export const getAllVehicles = async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });

  const vehicles = await prisma.vehicle.findMany({ include: { position: true, user: true } });
  res.json(vehicles);
};

//function to for those users that only can see their own vehicule (non-admin)
export const getById = async (req, res) => {
  const vehicles = await prisma.vehicle.findMany({
    where: { userId: req.user.id },
    include: { position: true }
  });
  res.json(vehicles);
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

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: req.params.id },
    include: { position: true },
  });

  if (!vehicle) return res.status(404).json({ message: 'Not found' });

  await prisma.position.update({
    where: { id: vehicle.positionId },
    data: { lat, lng }
  });

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