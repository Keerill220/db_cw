using Microsoft.EntityFrameworkCore;
using StudioBooking.Api.Data;
using StudioBooking.Api.Models.Entities;
using StudioBooking.Api.Repositories.Interfaces;

namespace StudioBooking.Api.Repositories;

public class EquipmentRepository : IEquipmentRepository
{
    private readonly ApplicationDbContext _db;
    public EquipmentRepository(ApplicationDbContext db) => _db = db;

    public Task<Equipment?> FindByIdAsync(int id, CancellationToken ct) =>
        _db.Equipments.Include(e => e.Room).ThenInclude(r => r.Studio)
            .Include(e => e.EquipmentType)
            .FirstOrDefaultAsync(e => e.EquipmentId == id, ct);

    public async Task<IEnumerable<Equipment>> GetByRoomAsync(int roomId, CancellationToken ct) =>
        await _db.Equipments.Include(e => e.EquipmentType)
            .Where(e => e.RoomId == roomId).ToListAsync(ct);

    public async Task<Equipment> CreateAsync(Equipment equipment, CancellationToken ct)
    {
        _db.Equipments.Add(equipment);
        await _db.SaveChangesAsync(ct);
        return equipment;
    }

    public async Task UpdateAsync(Equipment equipment, CancellationToken ct)
    {
        _db.Equipments.Update(equipment);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Equipment equipment, CancellationToken ct)
    {
        _db.Equipments.Remove(equipment);
        await _db.SaveChangesAsync(ct);
    }
}
