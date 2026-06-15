const Extinguisher = require('../models/Extinguisher');
const Inspection = require('../models/Inspection');
const Maintenance = require('../models/Maintenance');

exports.getReports = async (req, res) => {
  try {
    const now = new Date();

    // Date ranges
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Total extinguishers
    const totalExtinguishers = await Extinguisher.countDocuments();
    const dailyAdded = await Extinguisher.countDocuments({ createdAt: { $gte: startOfDay } });
    const monthlyAdded = await Extinguisher.countDocuments({ createdAt: { $gte: startOfMonth } });
    const yearlyAdded = await Extinguisher.countDocuments({ createdAt: { $gte: startOfYear } });

    // By status
    const activeCount = await Extinguisher.countDocuments({ status: 'Active' });
    const expiredCount = await Extinguisher.countDocuments({ status: 'Expired' });
    const underMaintenanceCount = await Extinguisher.countDocuments({ status: 'Under Maintenance' });

    // Inspections
    const totalInspections = await Inspection.countDocuments();
    const scheduledInspections = await Inspection.countDocuments({ status: 'Scheduled' });
    const completedInspections = await Inspection.countDocuments({ status: 'Completed' });
    const cancelledInspections = await Inspection.countDocuments({ status: 'Cancelled' });

    // Maintenance
    const totalMaintenance = await Maintenance.countDocuments();
    const maintenanceThisMonth = await Maintenance.countDocuments({ createdAt: { $gte: startOfMonth } });

    res.status(200).json({
      success: true,
      report: {
        extinguishers: {
          total: totalExtinguishers,
          daily: dailyAdded,
          monthly: monthlyAdded,
          yearly: yearlyAdded,
          byStatus: {
            active: activeCount,
            expired: expiredCount,
            underMaintenance: underMaintenanceCount,
          },
        },
        inspections: {
          total: totalInspections,
          scheduled: scheduledInspections,
          completed: completedInspections,
          cancelled: cancelledInspections,
        },
        maintenance: {
          total: totalMaintenance,
          monthly: maintenanceThisMonth,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};